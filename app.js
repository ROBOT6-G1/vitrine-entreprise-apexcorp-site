import { db, collection, addDoc, doc, onSnapshot } from './firebase-config.js';

// Handle Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName').value;
    const contact = document.getElementById('contactContact').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;

    try {
      await addDoc(collection(db, 'messages'), {
        type: 'contact',
        name,
        contact,
        subject,
        message,
        createdAt: new Date().toISOString()
      });
      document.getElementById('contactSuccess').classList.remove('hidden');
      contactForm.reset();
    } catch (err) {
      console.error("Erreur d'envoi:", err);
      alert("Tsy tafatsidika ny hafatra. Mba andramo indray!");
    }
  });
}

// Handle Devis Form Submission
const devisForm = document.getElementById('devisForm');
if (devisForm) {
  devisForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('devisName').value;
    const company = document.getElementById('devisCompany').value;
    const email = document.getElementById('devisEmail').value;
    const phone = document.getElementById('devisPhone').value;
    const service = document.getElementById('devisService').value;
    const details = document.getElementById('devisDetails').value;

    try {
      await addDoc(collection(db, 'messages'), {
        type: 'devis',
        name,
        company,
        email,
        phone,
        service,
        details,
        createdAt: new Date().toISOString()
      });
      document.getElementById('devisSuccess').classList.remove('hidden');
      devisForm.reset();
    } catch (err) {
      console.error("Erreur devis:", err);
      alert("Misy olana tamin'ny fandefasana devis.");
    }
  });
}

// Live sync hero dynamic edits if available
onSnapshot(doc(db, 'site_content', 'hero'), (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    const heroTitleEl = document.querySelector('.hero-bg h1');
    if (heroTitleEl && data.title) {
      heroTitleEl.innerHTML = data.title;
    }
  }
});
