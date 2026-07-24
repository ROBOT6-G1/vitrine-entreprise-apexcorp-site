import { db, collection, addDoc, getDocs, doc, deleteDoc, onSnapshot } from './firebase-config.js';

let authenticated = false;

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('admin-login-form');
  const authDiv = document.getElementById('auth-container');
  const adminDash = document.getElementById('admin-dashboard');
  const pwdInput = document.getElementById('admin-password');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const savedPwd = localStorage.getItem('admin_pwd') || '1234';
    if (pwdInput.value === savedPwd) {
      authenticated = true;
      authDiv.classList.add('hidden');
      adminDash.classList.remove('hidden');
      loadAppointments();
      loadMessages();
    } else {
      alert('Mot de passe incorrect!');
    }
  });

  // Tab Switching
  window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById('tab-' + tabName).classList.remove('hidden');
  };

  // Change Password
  const changePwdBtn = document.getElementById('change-pwd-btn');
  if (changePwdBtn) {
    changePwdBtn.addEventListener('click', () => {
      const newPwd = document.getElementById('new-password').value;
      if (newPwd.length >= 4) {
        localStorage.setItem('admin_pwd', newPwd);
        alert('Mot de passe modifié avec succès!');
      } else {
        alert('Le mot de passe doit comporter au moins 4 caractères.');
      }
    });
  }

  // Canvas Image Compression (< 150KB)
  window.compressImage = function(fileInput, previewImg, hiddenInput) {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        let quality = 0.7;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        previewImg.src = dataUrl;
        hiddenInput.value = dataUrl;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Load Appointments
  function loadAppointments() {
    const list = document.getElementById('rdv-list');
    onSnapshot(collection(db, 'appointments'), (snapshot) => {
      list.innerHTML = '';
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        tr.innerHTML = `
          <td class="p-3">${data.patient || ''}</td>
          <td class="p-3">${data.phone || ''}<br><span class="text-xs text-gray-500">${data.email || ''}</span></td>
          <td class="p-3">${data.doctor || 'Non spécifié'}</td>
          <td class="p-3">${data.service || ''}</td>
          <td class="p-3">${data.date || ''}</td>
          <td class="p-3"><button onclick="deleteRdv('${docSnap.id}')" class="bg-red-500 text-white px-2 py-1 rounded text-xs">Supprimer</button></td>
        `;
        list.appendChild(tr);
      });
    });
  }

  // Load Messages
  function loadMessages() {
    const list = document.getElementById('msg-list');
    onSnapshot(collection(db, 'messages'), (snapshot) => {
      list.innerHTML = '';
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const tr = document.createElement('tr');
        tr.className = 'border-b';
        tr.innerHTML = `
          <td class="p-3">${data.nom || ''}</td>
          <td class="p-3">${data.email || ''}</td>
          <td class="p-3">${data.sujet || ''}</td>
          <td class="p-3 text-sm">${data.message || ''}</td>
          <td class="p-3"><button onclick="deleteMsg('${docSnap.id}')" class="bg-red-500 text-white px-2 py-1 rounded text-xs">Supprimer</button></td>
        `;
        list.appendChild(tr);
      });
    });
  }

  window.deleteRdv = async function(id) {
    if (confirm('Supprimer ce rendez-vous ?')) {
      await deleteDoc(doc(db, 'appointments', id));
    }
  };
  window.deleteMsg = async function(id) {
    if (confirm('Supprimer ce message ?')) {
      await deleteDoc(doc(db, 'messages', id));
    }
  };
});