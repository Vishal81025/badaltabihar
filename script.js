/**
 * badalta.bihar – script.js
 * Handles: theme toggle, sticky nav, hamburger menu,
 *          reel modal, news filter/search, scroll reveals,
 *          newsletter form, contact form
 */

/* ═══════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════════ */
const themeToggle = document.getElementById('themeToggle');
const html        = document.documentElement;

// Restore saved theme
const savedTheme = localStorage.getItem('bb-theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('bb-theme', next);
    updateThemeIcon(next);
  });
}

function updateThemeIcon(theme) {
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/* ═══════════════════════════════════════════
   STICKY NAVBAR
══════════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 30);
});

/* ═══════════════════════════════════════════
   HAMBURGER MENU
══════════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ═══════════════════════════════════════════
   REEL / VIDEO MODAL
══════════════════════════════════════════════ */
const videoModal   = document.getElementById('videoModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose   = document.getElementById('modalClose');
const modalCaption = document.getElementById('modalCaption');

function openModal(caption) {
  if (!videoModal) return;
  if (modalCaption) modalCaption.textContent = caption || '';
  videoModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!videoModal) return;
  videoModal.classList.remove('active');
  document.body.style.overflow = '';
}

document.querySelectorAll('.reel-card').forEach(card => {
  card.addEventListener('click', () => {
    const caption = card.dataset.caption || card.querySelector('.reel-caption')?.textContent || '';
    openModal(caption);
  });
});

if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
if (modalClose)   modalClose.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ═══════════════════════════════════════════
   NEWS FILTER + SEARCH
══════════════════════════════════════════════ */
const filterBtns  = document.querySelectorAll('.filter-btn');
const newsGrid    = document.getElementById('newsGrid');
const searchInput = document.getElementById('searchInput');
const noResults   = document.getElementById('noResults');

let activeCategory = 'all';
let searchQuery    = '';

function filterNews() {
  if (!newsGrid) return;
  const cards = newsGrid.querySelectorAll('.news-list-card');
  let visibleCount = 0;

  cards.forEach(card => {
    const cat   = card.dataset.cat || '';
    const text  = card.textContent.toLowerCase();
    const catOK = activeCategory === 'all' || cat === activeCategory;
    const sOK   = !searchQuery || text.includes(searchQuery);

    if (catOK && sOK) {
      card.style.display = '';
      card.style.animation = 'fadeUp 0.4s ease both';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });

  if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategory = btn.dataset.cat || 'all';
    filterNews();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', () => {
    searchQuery = searchInput.value.toLowerCase().trim();
    filterNews();
  });
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function addRevealClasses() {
  const selectors = [
    '.news-card', '.reel-card', '.cat-card', '.news-list-card',
    '.mv-card', '.acard', '.why-item', '.about-full-grid',
    '.about-grid', '.creator-card', '.contact-grid',
    '.section-header', '.hero-stats'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      if (!el.classList.contains('reveal')) {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.07}s`;
      }
    });
  });
}

function onReveal() {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addRevealClasses();
  onReveal();
});
window.addEventListener('scroll', onReveal, { passive: true });

/* ═══════════════════════════════════════════
   NEWSLETTER FORM
══════════════════════════════════════════════ */
document.querySelectorAll('#nlForm').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const btn   = form.querySelector('button');
    if (!input || !input.value) return;
    const orig = btn.textContent;
    btn.textContent = '✅ Subscribed!';
    btn.disabled = true;
    input.value = '';
    setTimeout(() => {
      btn.textContent = orig;
      btn.disabled = false;
    }, 3000);
  });
});

/* ═══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════════ */
const contactForm   = document.getElementById('contactForm');
const formSuccess   = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const orig = btn.textContent;
    btn.textContent = 'Bhej rahe hain... ⏳';
    btn.disabled = true;

    setTimeout(() => {
      if (formSuccess) {
        formSuccess.style.display = 'block';
        formSuccess.style.animation = 'fadeUp 0.4s ease both';
      }
      contactForm.reset();
      btn.textContent = orig;
      btn.disabled = false;
      setTimeout(() => {
        if (formSuccess) formSuccess.style.display = 'none';
      }, 5000);
    }, 1400);
  });
}

/* ═══════════════════════════════════════════
   SHARE BUTTONS
══════════════════════════════════════════════ */
document.querySelectorAll('.share-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card  = btn.closest('.news-list-card');
    const title = card?.querySelector('h3')?.textContent || 'badalta.bihar';
    const url   = window.location.href;

    if (btn.title?.includes('Facebook')) {
      window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (btn.title?.includes('Instagram')) {
      alert('Instagram pe share karne ke liye screenshot lein aur post karein! 📱');
    } else {
      // Copy link
      navigator.clipboard.writeText(url).then(() => {
        const orig = btn.textContent;
        btn.textContent = '✅';
        setTimeout(() => btn.textContent = orig, 1500);
      });
    }
  });
});

/* ═══════════════════════════════════════════
   SMOOTH ACTIVE NAV HIGHLIGHT
══════════════════════════════════════════════ */
(function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

console.log('🧡 badalta.bihar – Badlav Ki Awaaz | Loaded');
