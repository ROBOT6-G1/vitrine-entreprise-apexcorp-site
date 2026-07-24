import { db, doc, setDoc, collection, onSnapshot } from './firebase-config.js';

// Authentication state
let isAuthenticated = false;

const loginForm = document.getElementById('adminLoginForm');
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pass = document.getElementById('adminPassInput').value;
    if (pass === '1234') {
      isAuthenticated = true;
      loginSection.classList.add('hidden');
      dashboardSection.classList.remove('hidden');
      loadMessages();
    } else {
      loginError.classList.remove('hidden');
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    isAuthenticated = false;
    dashboardSection.classList.add('hidden');
    loginSection.classList.remove('hidden');
  });
}

// Tab switcher
window.switchTab = function(tabId) {
  document.querySelectorAll('.tab-pane').forEach(el => el.classList.add('hidden'));
  const target = document.getElementById(tabId);
  if (target) target.classList.remove('hidden');
};

// Save Content changes
const saveBtn = document.getElementById('saveAllContentBtn');
if (saveBtn) {
  saveBtn.addEventListener('click', async () => {
    const heroTitle = document.getElementById('editHeroTitle').value;
    const heroDesc = document.getElementById('editHeroDesc').value;
    const aboutText = document.getElementById('editAboutText').value;

    try {
      await setDoc(doc(db, 'site_content', 'hero'), {
        title: heroTitle,
        description: heroDesc,
        updatedAt: new Date().toISOString()
      });
      await setDoc(doc(db, 'site_content', 'about'), {
        text: aboutText,
        updatedAt: new Date().toISOString()
      });
      alert('Voasoratra soa aman-tsara ny fanovana!');
    } catch (err) {
      console.error('Erreur enregistrement:', err);
      alert('Misy olana teo am-paritahana ny fanovana.');
    }
  });
}

// Load messages from Firestore
function loadMessages() {
  const container = document.getElementById('messagesContainer');
  if (!container) return;

  onSnapshot(collection(db, 'messages'), (snapshot) => {
    if (snapshot.empty) {
      container.innerHTML = '<p class="text-slate-500 text-sm">Mbola tsy misy hafatra.</p>';
      return;
    }
    container.innerHTML = '';
    snapshot.forEach(docSnap => {
      const m = docSnap.data();
      const card = document.createElement('div');
      card.className = 'bg-slate-800 border border-slate-700 p-4 rounded-xl space-y-2 text-sm';
      card.innerHTML = `
        <div class="flex justify-between items-center">
          <span class="px-2 py-0.5 rounded text-xs font-bold ${m.type === 'devis' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}">
            ${m.type ? m.type.toUpperCase() : 'CONTACT'}
          </span>
          <span class="text-xs text-slate-500">${m.createdAt ? new Date(m.createdAt).toLocaleString('fr-FR') : ''}</span>
        </div>
        <div class="font-bold text-white">${m.name || 'Sans Nom'} <span class="text-slate-400 font-normal text-xs">(${m.contact || m.phone || m.email || ''})</span></div>
        ${m.subject ? `<div class="text-xs text-blue-400 font-semibold">Lohahevitra: ${m.subject}</div>` : ''}
        ${m.service ? `<div class="text-xs text-amber-400 font-semibold">Service: ${m.service}</div>` : ''}
        <p class="text-slate-300 text-xs bg-slate-900 p-3 rounded-lg border border-slate-800">${m.message || m.details || ''}</p>
      `;
      container.appendChild(card);
    });
  });
}

// HTML5 Canvas Image Compression (<150KB)
const uploader = document.getElementById('imageUploader');
if (uploader) {
  uploader.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxWidth = 800;

        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const base64 = canvas.toDataURL('image/jpeg', 0.7);
        const preview = document.getElementById('imagePreview');
        const resultArea = document.getElementById('imageBase64Result');
        const previewBox = document.getElementById('imagePreviewBox');
        const sizeInfo = document.getElementById('imageSizeInfo');

        const approxKB = Math.round((base64.length * 3) / 4 / 1024);
        sizeInfo.textContent = `Sary Voa-compresse: ~${approxKB} KB (Limit <150KB)`;
        preview.src = base64;
        resultArea.value = base64;
        previewBox.classList.remove('hidden');
      };
    };
    reader.readAsDataURL(file);
  });
}
