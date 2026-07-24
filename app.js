import { db, collection, addDoc, onSnapshot } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Handle Appointment Form
  const rdvForm = document.getElementById('rdv-form');
  if (rdvForm) {
    rdvForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = rdvForm.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.innerText = 'Envoi en cours...';
      
      const data = {
        patient: document.getElementById('rdv-nom').value,
        email: document.getElementById('rdv-email').value,
        phone: document.getElementById('rdv-phone').value,
        doctor: document.getElementById('rdv-doctor').value,
        date: document.getElementById('rdv-date').value,
        service: document.getElementById('rdv-service').value,
        note: document.getElementById('rdv-note').value,
        createdAt: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, 'appointments'), data);
        alert('Votre rendez-vous a été demandé avec succès ! Nous vous contacterons pour confirmation.');
        rdvForm.reset();
      } catch (err) {
        console.error('Erreur Firebase:', err);
        alert('Une erreur est survenue, veuillez réessayer.');
      } finally {
        btn.disabled = false;
        btn.innerText = 'Confirmer le Rendez-vous';
      }
    });
  }

  // Handle Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = {
        nom: document.getElementById('c-nom').value,
        email: document.getElementById('c-email').value,
        sujet: document.getElementById('c-sujet').value,
        message: document.getElementById('c-message').value,
        createdAt: new Date().toISOString()
      };
      try {
        await addDoc(collection(db, 'messages'), data);
        alert('Message envoyé avec succès !');
        contactForm.reset();
      } catch (err) {
        alert('Erreur d\'envoi.');
      }
    });
  }

  // FAQ Toggle Accordion
  const faqBtns = document.querySelectorAll('.faq-toggle');
  faqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.nextElementSibling;
      target.classList.toggle('accordion-open');
      const icon = btn.querySelector('.faq-icon');
      if (icon) icon.classList.toggle('rotate-180');
    });
  });
});