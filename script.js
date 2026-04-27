// ===== TRANSLATIONS =====
const translations = {
  fr: {
    // Nav
    navForWho: "Pour qui ?",
    navWhyGuru: "Pourquoi Guru",
    navGallery: "Galerie",
    navFaq: "FAQ",
    navCta: "Demander un devis",
    langBtn: "EN",

    // Hero
    heroTitle1: "Gourmandise et ",
    heroHighlight: "efficacité",
    heroTitle2: ", partout dans le monde.",
    heroSubtitle: "Traiteur événementiel 360° pour entreprises et agences : buffets, bars et staff pour vos séminaires, lancements produits et festivals — réactivité, qualité, flexibilité.",
    stat1Num: "250 000+",
    stat1Label: "repas servis par an",
    stat2Num: "15 ans",
    stat2Label: "d'expertise",
    stat3Num: "4 pays",
    stat3Label: "15+ villes",
    heroCta: "Demander un devis",

    // For Who
    forWhoTag: "Notre cible",
    forWhoTitle: "Pour quels ",
    forWhoHighlight: "événements",
    forWhoTitle2: " ?",
    forWhoSubtitle: "Nous intervenons sur trois grandes catégories d'événements B2B.",
    forWho1Title: "Événements sous forte pression",
    forWho1Desc: "Festivals, shows en live, grandes conférences, événements à volumes massifs. Des contextes où la logistique doit être irréprochable et les volumes parfaitement maîtrisés.",
    forWho2Title: "Soirées clients & moments premium",
    forWho2Desc: "Lancements produits, soirées clients, events marque, séminaires haut de gamme. L'excellence culinaire au service de votre image.",

    // Services 360

    // Gallery
    galleryTag: "Nos réalisations",
    galleryTitle: "Notre ",
    galleryHighlight: "savoir-faire",
    gallerySubtitle: "Découvrez nos créations culinaires à travers notre galerie.",
    filterAll: "Tout",
    galleryLoadMore: "Voir plus",
    ctaReminderGallery: "Un projet en tête ? Nos chefs s'en occupent.",
    ctaReminderTrust: "Rejoignez les marques qui nous confient leurs événements.",

    // Why Guru (replaces old comparison table)
    compTag: "Notre différence",
    compTitle: "Pourquoi Guru plutôt qu'un ",
    compHighlight: "traiteur classique",
    compTitle2: " ?",
    compSubtitle: "Ce qui nous différencie, en quelques points.",
    why1Title: "Solution 360°",
    why1Desc: "Traiteur, bar, staff, scénographie : tout est intégré, rien n'est sous-traité.",
    why2Title: "Inclusion alimentaire",
    why2Desc: "Végan, halal, sans gluten, toutes cuisines du monde — chaque convive est pris en compte.",
    why3Title: "Éco-responsable",
    why3Desc: "Produits locaux, anti-gaspi, zéro plastique jetable — la responsabilité au cœur de chaque prestation.",
    why4Title: "Capacité volume",
    why4Desc: "De 20 à 20 000 repas par événement — la montée en charge est notre cœur de métier.",
    why5Title: "Réactivité extrême",
    why5Desc: "Lancement possible en 48h — mais plus vous nous prévenez tôt, plus la qualité est au rendez-vous.",
    why6Title: "100% fait maison",
    why6Desc: "Chaque plat est cuisiné par nos chefs — pas d'industriel, pas de sous-traitance alimentaire.",

    // Case Study
    csTitle: "Ils nous ont confié le Z Event",
    csSubtitle: "Un événement sous très haute pression opérationnelle, géré de bout en bout par Guru.",
    csCtxTitle: "Contexte",
    csCtxDesc: "Event de plusieurs jours, milliers de repas, invités / talents / staff à servir en continu dans un environnement live permanent.",
    csChalTitle: "Défi",
    csChalDesc: "Contraintes horaires extrêmes, volumes massifs, régimes spéciaux multiples, coordination avec la production en direct.",
    csSolTitle: "Solution",
    csSolDesc: "Organisation d'une équipe de 15–20 personnes, cuisine sur place, bar, logistique complète, coordination avec la prod.",
    csResTitle: "Résultats",
    csResDesc: "Plusieurs jours de prestation, milliers de repas servis, zéro rupture, satisfaction maximale des organisateurs.",
    csQuote: "\"Guru a géré l'intégralité de la restauration du Z Event avec une maîtrise impressionnante. Zéro stress côté orga.\"",

    // Logos / Trust
    trustTag: "Nos références",
    trustTitle: "Ils nous font ",
    trustHighlight: "confiance",
    trustSubtitle: "Des marques et événements de référence nous font confiance chaque année.",
    trustStat1Num: "500+",
    trustStat1Label: "recettes adaptées",
    trustStat2Num: "250 000+",
    trustStat2Label: "repas servis par an",
    trustStat3Num: "15 ans",
    trustStat3Label: "d'expertise",
    trustStat4Num: "4 pays",
    trustStat4Label: "couverture internationale",

    // FAQ
    faqTag: "Informations",
    faqTitle: "Questions ",
    faqHighlight: "fréquentes",
    faqSubtitle: "Les réponses aux questions que vous vous posez sûrement.",
    faq1Q: "Quels types de prestations proposez-vous ?",
    faq1A: "Buffet, cocktail dînatoire, repas assis, livraison seule — tous les formats sont disponibles sur devis personnalisé.",
    faq2Q: "Quelle taille de groupe pouvez-vous gérer ?",
    faq2A: "De dîners privés intimes à des événements internationaux de plusieurs centaines de personnes — nous adaptons notre organisation à chaque échelle.",
    faq3Q: "Gérez-vous les régimes spéciaux ?",
    faq3A: "Végétarien, végan, sans gluten, allergies — nos chefs sont formés aux techniques modernes pour adapter chaque menu sans compromis sur le goût.",
    faq4Q: "Le personnel et le matériel sont-ils inclus ?",
    faq4A: "Selon vos besoins : nous pouvons inclure le staff de service, le matériel et la scénographie, ou proposer une prestation traiteur seule.",
    faq5Q: "Quelle est votre couverture géographique ?",
    faq5A: "Nous intervenons dans le monde entier, avec des accords visa quand nécessaire. Les frais de déplacement sont évalués au cas par cas.",
    faq6Q: "Quels sont vos délais ?",
    faq6A: "Nous pouvons lancer une prestation en 48h, mais plus le délai est long, plus la qualité et la personnalisation sont garanties.",
    faq7Q: "Les menus sont-ils personnalisables ?",
    faq7A: "Tous nos menus sont entièrement personnalisables. Des dégustations sont disponibles sur demande pour valider vos choix.",
    faq8Q: "Quelles sont vos conditions de paiement ?",
    faq8A: "Un acompte de 50% minimum est demandé 2 semaines avant l'événement, le solde le jour J. L'acompte est conservé en cas d'annulation.",

    // Form
    formTag: "Contact",
    formTitle: "Demander un ",
    formHighlight: "devis",
    formSubtitle: "Remplissez ce formulaire et nous vous recontactons sous 24h.",
    formLastname: "Nom",
    formFirstname: "Prénom",
    formCompany: "Société",
    formEmail: "Email professionnel",
    formPhone: "Téléphone",
    formEventType: "Type d'événement",
    formEventOpt1: "Événement sous pression",
    formEventOpt2: "Soirée clients / lancement",
    formEventOpt3: "Séminaire / conférence",
    formEventOpt4: "Autre (préciser)",
    formDate: "Date(s) envisagée(s)",
    formLocation: "Lieu (ville, salle si connue)",
    formGuests: "Nombre estimé de convives",
    formGuestsOpt1: "Moins de 50",
    formGuestsOpt2: "50 – 150",
    formGuestsOpt3: "150 – 500",
    formGuestsOpt4: "500 – 1 000",
    formGuestsOpt5: "Plus de 1 000",
    formServices: "Services souhaités",
    formSvcBuffet: "Buffet",
    formSvcCocktail: "Cocktail dînatoire",
    formSvcBar: "Bar / cocktails",
    formSvcBreakfast: "Petit-déjeuner / pauses",
    formSvcSeated: "Repas assis",
    formSvcStaff: "Staff",
    formSvcSceno: "Scénographie",
    formBudget: "Budget estimé",
    formBudgetOpt1: "Moins de 5 000 €",
    formBudgetOpt2: "5 000 – 15 000 €",
    formBudgetOpt3: "15 000 – 50 000 €",
    formBudgetOpt4: "50 000 – 100 000 €",
    formBudgetOpt5: "Plus de 100 000 €",
    formContext: "Contexte & objectifs de votre événement",
    formSubmit: "Envoyer ma demande de devis",

    // Footer
    footerText: "© 2025 Guru – Traiteur événementiel premium. Tous droits réservés.",

    // Misc
    selectPlaceholder: "Sélectionner…",
  },

  en: {
    // Nav
    navForWho: "For whom?",
    navWhyGuru: "Why Guru",
    navGallery: "Gallery",
    navFaq: "FAQ",
    navCta: "Request a quote",
    langBtn: "FR",

    // Hero
    heroTitle1: "Indulgence and ",
    heroHighlight: "efficiency",
    heroTitle2: ", everywhere in the world.",
    heroSubtitle: "Event catering 360° for businesses and agencies: buffets, bars and staff for your seminars, product launches and festivals — responsiveness, quality, flexibility.",
    stat1Num: "250,000+",
    stat1Label: "meals served per year",
    stat2Num: "15 years",
    stat2Label: "of expertise",
    stat3Num: "4 countries",
    stat3Label: "15+ cities",
    heroCta: "Request a quote",

    // For Who
    forWhoTag: "Our focus",
    forWhoTitle: "For which ",
    forWhoHighlight: "events",
    forWhoTitle2: "?",
    forWhoSubtitle: "We serve three main categories of B2B events.",
    forWho1Title: "High-pressure events",
    forWho1Desc: "Festivals, live shows, large conferences, massive-volume events. Contexts where logistics must be flawless and volumes perfectly mastered.",
    forWho2Title: "Client events & premium moments",
    forWho2Desc: "Product launches, client evenings, brand events, high-end seminars. Culinary excellence at the service of your image.",

    // Services 360

    // Gallery
    galleryTag: "Our creations",
    galleryTitle: "Our ",
    galleryHighlight: "expertise",
    gallerySubtitle: "Discover our culinary creations through our gallery.",
    filterAll: "All",
    galleryLoadMore: "Load more",
    ctaReminderGallery: "Got a project in mind? Our chefs are on it.",
    ctaReminderTrust: "Join the brands that trust us with their events.",

    // Why Guru (replaces old comparison table)
    compTag: "Our difference",
    compTitle: "Why Guru over a ",
    compHighlight: "traditional caterer",
    compTitle2: "?",
    compSubtitle: "What sets us apart, in a few key points.",
    why1Title: "360° Solution",
    why1Desc: "Catering, bar, staff, scenography: everything is integrated, nothing is outsourced.",
    why2Title: "Dietary inclusion",
    why2Desc: "Vegan, halal, gluten-free, world cuisines — every guest is taken into account.",
    why3Title: "Eco-responsible",
    why3Desc: "Local products, anti-waste, zero single-use plastic — responsibility at the heart of every service.",
    why4Title: "Volume capacity",
    why4Desc: "From 20 to 20,000 meals per event — scaling up is our core expertise.",
    why5Title: "Extreme responsiveness",
    why5Desc: "Launch possible in 48h — but the more notice you give us, the higher the quality.",
    why6Title: "100% homemade",
    why6Desc: "Every dish is cooked by our chefs — no industrial food, no outsourced catering.",

    // Case Study
    csTitle: "They trusted us with the Z Event",
    csSubtitle: "An event under extreme operational pressure, managed end-to-end by Guru.",
    csCtxTitle: "Context",
    csCtxDesc: "Multi-day event, thousands of meals, guests / talents / staff to serve continuously in a permanent live environment.",
    csChalTitle: "Challenge",
    csChalDesc: "Extreme time constraints, massive volumes, multiple special diets, coordination with live production.",
    csSolTitle: "Solution",
    csSolDesc: "Team of 15–20 people organized on-site, full kitchen, bar, complete logistics, coordination with production.",
    csResTitle: "Results",
    csResDesc: "Multiple days of service, thousands of meals served, zero shortages, maximum organizer satisfaction.",
    csQuote: "\"Guru handled all the catering for the Z Event with impressive mastery. Zero stress on the organizer side.\"",

    // Logos / Trust
    trustTag: "Our clients",
    trustTitle: "They ",
    trustHighlight: "trust us",
    trustSubtitle: "Leading brands and events trust us year after year.",
    trustStat1Num: "500+",
    trustStat1Label: "adapted recipes",
    trustStat2Num: "250,000+",
    trustStat2Label: "meals served per year",
    trustStat3Num: "15 years",
    trustStat3Label: "of expertise",
    trustStat4Num: "4 countries",
    trustStat4Label: "international coverage",

    // FAQ
    faqTag: "Information",
    faqTitle: "Frequently asked ",
    faqHighlight: "questions",
    faqSubtitle: "Answers to the questions you're probably asking yourself.",
    faq1Q: "What types of services do you offer?",
    faq1A: "Buffet, cocktail reception, seated meal, delivery only — all formats are available with a custom quote.",
    faq2Q: "What group size can you handle?",
    faq2A: "From intimate private dinners to international events with hundreds of guests — we adapt our organization to every scale.",
    faq3Q: "Do you handle special diets?",
    faq3A: "Vegetarian, vegan, gluten-free, allergies — our chefs are trained in modern techniques to adapt every menu without compromising on taste.",
    faq4Q: "Are staff and equipment included?",
    faq4A: "Depending on your needs: we can include service staff, equipment and scenography, or offer a catering-only service.",
    faq5Q: "What is your geographic coverage?",
    faq5A: "We operate worldwide, with visa arrangements when necessary. Travel costs are assessed on a case-by-case basis.",
    faq6Q: "What are your lead times?",
    faq6A: "We can launch a service in 48h, but the longer the lead time, the more quality and customization are guaranteed.",
    faq7Q: "Are menus customizable?",
    faq7A: "All our menus are fully customizable. Tastings are available on request to validate your choices.",
    faq8Q: "What are your payment terms?",
    faq8A: "A minimum 50% deposit is required 2 weeks before the event, with the balance due on the day. The deposit is retained in case of cancellation.",

    // Form
    formTag: "Contact",
    formTitle: "Request a ",
    formHighlight: "quote",
    formSubtitle: "Fill out this form and we'll get back to you within 24 hours.",
    formLastname: "Last name",
    formFirstname: "First name",
    formCompany: "Company",
    formEmail: "Professional email",
    formPhone: "Phone",
    formEventType: "Event type",
    formEventOpt1: "High-pressure event",
    formEventOpt2: "Client evening / launch",
    formEventOpt3: "Seminar / conference",
    formEventOpt4: "Other (specify)",
    formDate: "Planned date(s)",
    formLocation: "Location (city, venue if known)",
    formGuests: "Estimated number of guests",
    formGuestsOpt1: "Less than 50",
    formGuestsOpt2: "50 – 150",
    formGuestsOpt3: "150 – 500",
    formGuestsOpt4: "500 – 1,000",
    formGuestsOpt5: "More than 1,000",
    formServices: "Desired services",
    formSvcBuffet: "Buffet",
    formSvcCocktail: "Cocktail reception",
    formSvcBar: "Bar / cocktails",
    formSvcBreakfast: "Breakfast / breaks",
    formSvcSeated: "Seated meal",
    formSvcStaff: "Staff",
    formSvcSceno: "Scenography",
    formBudget: "Estimated budget",
    formBudgetOpt1: "Less than €5,000",
    formBudgetOpt2: "€5,000 – €15,000",
    formBudgetOpt3: "€15,000 – €50,000",
    formBudgetOpt4: "€50,000 – €100,000",
    formBudgetOpt5: "More than €100,000",
    formContext: "Context & goals of your event",
    formSubmit: "Send my quote request",

    // Footer
    footerText: "© 2025 Guru – Premium event catering. All rights reserved.",

    // Misc
    selectPlaceholder: "Select…",
  }
};

// ===== STATE =====
let currentLang = 'fr';

// ===== LANGUAGE SWITCH =====
function setLang(lang) {
  currentLang = lang;
  const t = translations[lang];

  // Update all elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = t[key];
      } else if (el.tagName === 'OPTION') {
        el.textContent = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Update innerHTML elements (those with highlights)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const keys = el.getAttribute('data-i18n-html').split(',');
    let html = '';
    keys.forEach(k => {
      const trimmed = k.trim();
      if (trimmed.endsWith('Highlight') || trimmed.endsWith('highlight')) {
        html += `<span class="highlight">${t[trimmed]}</span>`;
      } else {
        html += t[trimmed];
      }
    });
    el.innerHTML = html;
  });

  // Update lang button
  document.getElementById('langToggle').textContent = t.langBtn;
  document.documentElement.lang = lang;
}

// ===== FAQ TOGGLE =====
function initFaq() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item').forEach(fi => {
        fi.classList.remove('open');
        fi.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('mainNav');

  const closeMenu = () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.classList.remove('menu-open');
  };

  hamburger.addEventListener('click', () => {
    const willOpen = !nav.classList.contains('open');
    nav.classList.toggle('open', willOpen);
    hamburger.classList.toggle('open', willOpen);
    hamburger.classList.toggle('active', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
  });
}

// ===== STICKY CTA : masqué quand on survole/scrolle sur la section devis =====
function initStickyCta() {
  const sticky = document.querySelector('.sticky-cta');
  const devis  = document.getElementById('devis');
  if (!sticky || !devis) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      sticky.classList.toggle('hidden', entry.isIntersecting);
    });
  }, { threshold: 0.08 });

  io.observe(devis);
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ===== SMOOTH SCROLL FOR NAV =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== HEADER SCROLL EFFECT =====
// On bascule juste une classe ; les couleurs viennent du CSS pour rester
// compatibles avec le thème actif (sombre ou crème).
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.pageYOffset > 100);
  }, { passive: true });
}

// ===== GALLERY =====
let galleryData = [];
let currentFilter = 'all';
let visibleCount = 12;
const PHOTOS_PER_LOAD = 12;
const PHOTOS_BASE_PATH = 'gallery/';

async function loadGallery() {
  try {
    // Cache-buster pour que les mises à jour de tags.json (via admin-photos)
    // soient visibles immédiatement, sans nettoyer le cache du navigateur.
    const res = await fetch('gallery/tags.json?v=' + Date.now(), { cache: 'no-store' });
    galleryData = await res.json();
    // La sélection qualité est faite en amont (tags.json ne contient que
    // les photos validées : 7/10 et + ; 5/10 et + pour le tag Evénement).
    renderFilters();
    renderGallery();
  } catch (e) {
    console.warn('Gallery: could not load tags.json', e);
  }
}

function renderFilters() {
  const allTags = new Set();
  galleryData.forEach(item => item.tags.forEach(t => allTags.add(t)));
  const container = document.getElementById('galleryFilters');
  if (!container) return;
  // Keep "Tout" button
  const sortedTags = [...allTags].sort((a, b) => a.localeCompare(b, 'fr'));
  sortedTags.forEach(tag => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = tag;
    btn.textContent = tag;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = tag;
      visibleCount = PHOTOS_PER_LOAD;
      renderGallery();
    });
    container.appendChild(btn);
  });
  // "Tout" button click
  container.querySelector('[data-filter="all"]').addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    container.querySelector('[data-filter="all"]').classList.add('active');
    currentFilter = 'all';
    visibleCount = PHOTOS_PER_LOAD;
    renderGallery();
  });
}

function buildGalleryItemHTML(item) {
  return `
    <div class="gallery-item" onclick="openLightbox('${PHOTOS_BASE_PATH}${item.photo}')">
      <img src="${PHOTOS_BASE_PATH}${item.photo}" alt="${item.tags.join(', ')}" loading="lazy">
      <div class="gallery-tags">
        ${item.tags.map(t => `<span class="gallery-tag">${t}</span>`).join('')}
      </div>
    </div>`;
}

function animateIn(elements) {
  // Applique la classe d'apparition avec un léger stagger pour fluidifier
  elements.forEach((el, i) => {
    el.classList.add('gallery-item-enter');
    // stagger court : 40ms entre chaque image, plafonné pour ne pas traîner
    const delay = Math.min(i * 40, 320);
    el.style.animationDelay = delay + 'ms';
  });
}

// Re-render complet (changement de filtre / premier rendu)
function renderGallery() {
  const grid = document.getElementById('galleryGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!grid) return;

  const filtered = currentFilter === 'all'
    ? galleryData
    : galleryData.filter(item => item.tags.includes(currentFilter));

  const toShow = filtered.slice(0, visibleCount);

  grid.innerHTML = toShow.map(buildGalleryItemHTML).join('');
  animateIn([...grid.querySelectorAll('.gallery-item')]);

  if (loadMoreBtn) {
    loadMoreBtn.style.display = visibleCount >= filtered.length ? 'none' : 'inline-block';
  }
}

// Append : ajoute uniquement les nouvelles images et anime leur apparition
function appendMoreGallery() {
  const grid = document.getElementById('galleryGrid');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!grid) return;

  const filtered = currentFilter === 'all'
    ? galleryData
    : galleryData.filter(item => item.tags.includes(currentFilter));

  const previousCount = grid.children.length;
  const nextCount = Math.min(visibleCount, filtered.length);
  const newItems = filtered.slice(previousCount, nextCount);
  if (newItems.length === 0) return;

  const frag = document.createDocumentFragment();
  const newEls = [];
  newItems.forEach(item => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildGalleryItemHTML(item).trim();
    const el = wrapper.firstElementChild;
    newEls.push(el);
    frag.appendChild(el);
  });
  grid.appendChild(frag);
  animateIn(newEls);

  if (loadMoreBtn) {
    loadMoreBtn.style.display = nextCount >= filtered.length ? 'none' : 'inline-block';
  }
}

function initLoadMore() {
  const btn = document.getElementById('loadMoreBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      visibleCount += PHOTOS_PER_LOAD;
      appendMoreGallery();
    });
  }
}

// ===== LIGHTBOX =====
function openLightbox(src) {
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<button class="lightbox-close">&times;</button><img src="" alt="Photo">';
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('active');
      }
    });
    document.body.appendChild(lightbox);
  }
  lightbox.querySelector('img').src = src;
  lightbox.classList.add('active');
}

// Close lightbox on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const lb = document.getElementById('lightbox');
    if (lb) lb.classList.remove('active');
  }
});

// ===== FONT SWITCHER (DEV) =====
function initFontSwitcher() {
  const toggle = document.getElementById('fontSwitcherToggle');
  const panel = document.getElementById('fontSwitcherPanel');
  const close = document.getElementById('fontSwitcherClose');
  const select = document.getElementById('fontSelect');
  const current = document.getElementById('fontSwitcherCurrent');

  if (!toggle || !panel) return;

  toggle.addEventListener('click', () => panel.classList.toggle('open'));
  close.addEventListener('click', () => panel.classList.remove('open'));

  // Liste des fonts custom (pour activer la classe body.custom-heading-font)
  const customFonts = ['Arsenica','Birds and Home','Brown Sugar','Palmore','Rattani','Sailing Club','Selga','Tritone','Zafrada'];

  select.addEventListener('change', () => {
    document.documentElement.style.setProperty('--font-heading', select.value);
    current.textContent = select.options[select.selectedIndex].text;
    // Si la value contient une des 9 typos Valentin, on active la classe qui
    // neutralise le faux-bold et ouvre le tracking sur les titres.
    const isCustom = customFonts.some(f => select.value.includes(`'${f}'`) || select.value.includes(f));
    document.body.classList.toggle('custom-heading-font', isCustom);
  });

  // Keyboard shortcut: Ctrl+Shift+F
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      panel.classList.toggle('open');
    }
  });

  // Disposition galerie : grille uniforme (défaut) ou masonry
  const gallerySelect = document.getElementById('gallerySelect');
  const galleryGrid = document.getElementById('galleryGrid');
  if (gallerySelect && galleryGrid) {
    // Restaurer le choix éventuellement sauvegardé
    const saved = localStorage.getItem('guru-gallery-layout');
    if (saved === 'masonry') {
      gallerySelect.value = 'masonry';
      galleryGrid.classList.add('layout-masonry');
    }
    gallerySelect.addEventListener('change', () => {
      const isMasonry = gallerySelect.value === 'masonry';
      galleryGrid.classList.toggle('layout-masonry', isMasonry);
      localStorage.setItem('guru-gallery-layout', gallerySelect.value);
    });
  }

  // ===== Code couleur (thème) =====
  // Deux templates : "dark" (premium sombre, identique à l'actuel) et "cream"
  // (DA Valentin — crème + bleu marine #142F8A / #FBEFDF). On bascule via une
  // classe sur <body> et on swap les SVG des logos pour préserver le contraste.
  const colorSelect = document.getElementById('colorTemplateSelect');
  const logoIcone = document.querySelector('.logo .logo-icone');
  const logoTypo  = document.querySelector('.logo .logo-typo');
  const logoFooter = document.querySelector('.footer-logo .logo-svg');
  const LOGO_BLANC = {
    icone:  'images/logo-icone-blanc.svg',
    typo:   'images/logo-typo-blanc.svg',
    footer: 'images/logo-entier-xl-blanc.svg'
  };
  const LOGO_BLEU = {
    icone:  'images/logo-icone-bleu.svg',
    typo:   'images/logo-typo-bleu.svg',
    footer: 'images/logo-entier-xl-bleu.svg'
  };

  function applyColorTemplate(theme) {
    const isCream = theme === 'cream';
    document.body.classList.toggle('theme-cream', isCream);
    const set = isCream ? LOGO_BLEU : LOGO_BLANC;
    if (logoIcone)  logoIcone.setAttribute('src', set.icone);
    if (logoTypo)   logoTypo.setAttribute('src',  set.typo);
    if (logoFooter) logoFooter.setAttribute('src', set.footer);
  }

  if (colorSelect) {
    const savedTheme = localStorage.getItem('guru-color-template') || 'dark';
    colorSelect.value = savedTheme;
    applyColorTemplate(savedTheme);
    colorSelect.addEventListener('change', () => {
      const theme = colorSelect.value;
      localStorage.setItem('guru-color-template', theme);
      applyColorTemplate(theme);
    });
  }

  // Note : le toggle "Assets décoratifs" et la parallaxe associée ont été
  // retirés du panneau dev (cf. retours client). Le calque .overlay-assets
  // reste dans le DOM mais n'est plus activable — body.assets-on n'est
  // jamais mis, donc opacity:0 le garde invisible.
  // On nettoie quand même un éventuel ancien localStorage hérité.
  if (localStorage.getItem('guru-assets-on') !== null) {
    localStorage.removeItem('guru-assets-on');
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initFaq();
  initMobileMenu();
  initStickyCta();
  initScrollAnimations();
  initSmoothScroll();
  initHeaderScroll();
  loadGallery();
  initLoadMore();
  initFontSwitcher();

  // Lang toggle
  document.getElementById('langToggle').addEventListener('click', () => {
    setLang(currentLang === 'fr' ? 'en' : 'fr');
  });

  // Set initial language
  setLang('fr');
});
