const body = document.body;
const nav = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = [...document.querySelectorAll('.nav-link')];
const revealItems = document.querySelectorAll('.reveal');
const roleText = document.getElementById('roleText');
const progressBar = document.querySelector('.scroll-progress');
const loader = document.querySelector('.loader');
const backToTop = document.querySelector('.back-to-top');
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

const roles = [
  'SOFTWARE DEVELOPER',
  'MERN STACK MENTOR',
  'FULL-STACK DEVELOPER',
  'WEB DEVELOPER',
  'MERN STACK DEVELOPER'
];

const skillGroups = [
  {
    category: 'Frontend',
    items: [
      { icon: '<i class="fa-brands fa-html5"></i>', name: 'HTML' },
      { icon: '<i class="fa-brands fa-css3-alt"></i>', name: 'CSS' },
      { icon: '<i class="fa-brands fa-react"></i>', name: 'React.js' },
      { icon: '<i class="fa-solid fa-mobile-screen-button"></i>', name: 'React Native' }
    ]
  },
  {
    category: 'Backend',
    items: [
      { icon: '<i class="fa-brands fa-node-js"></i>', name: 'Node.js' },
      { icon: '<i class="fa-solid fa-server"></i>', name: 'Express.js' },
      { icon: '<i class="fa-solid fa-code"></i>', name: 'REST APIs' },
      { icon: '<i class="fa-brands fa-js-square"></i>', name: 'JavaScript' }
    ]
  },
  {
    category: 'Database',
    items: [
      { icon: '<i class="fa-solid fa-database"></i>', name: 'MongoDB' },
      { icon: '<i class="fa-solid fa-database"></i>', name: 'MongoDB Atlas' },
      { icon: '<i class="fa-solid fa-layer-group"></i>', name: 'Schema Design' },
      { icon: '<i class="fa-solid fa-shield-halved"></i>', name: 'Security' }
    ]
  },
  {
    category: 'Tools',
    items: [
      { icon: '<i class="fa-brands fa-git-alt"></i>', name: 'Git' },
      { icon: '<i class="fa-brands fa-github"></i>', name: 'GitHub' },
      { icon: '<i class="fa-solid fa-vial"></i>', name: 'Postman' },
      { icon: '<i class="fa-solid fa-terminal"></i>', name: 'CLI' }
    ]
  }
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let activeSkillIndex = 0;
let skillRotationTimer = null;

function updateRoleText() {
  const currentRole = roles[roleIndex];

  if (!isDeleting) {
    charIndex += 1;
  } else {
    charIndex -= 1;
  }

  const visibleText = currentRole.slice(0, charIndex);
  roleText.textContent = visibleText;

  let typingSpeed = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === currentRole.length) {
    typingSpeed = 1200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    typingSpeed = 260;
  }

  setTimeout(updateRoleText, typingSpeed);
}

function createObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
}

function updateHeaderState() {
  nav.classList.toggle('scrolled', window.scrollY > 16);
}

function updateActiveLink() {
  const sections = document.querySelectorAll('main section[id]');

  let currentId = 'home';
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= 200 && rect.bottom >= 200) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentId}`;
    link.classList.toggle('active', isActive);
  });
}

function handleNavToggle() {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
}

function handleCursorMove(event) {
  const { clientX, clientY } = event;
  cursorDot.style.left = `${clientX}px`;
  cursorDot.style.top = `${clientY}px`;
  cursorRing.style.left = `${clientX}px`;
  cursorRing.style.top = `${clientY}px`;
}

function bindCursorInteractions() {
  const hoverables = document.querySelectorAll('a, button, .skill-card, .social-link, .project-showcase, .contact-card');

  hoverables.forEach((element) => {
    element.addEventListener('mouseenter', () => {
      cursorRing.classList.add('active');
    });

    element.addEventListener('mouseleave', () => {
      cursorRing.classList.remove('active');
    });
  });
}

function renderSkillPanel(index) {
  const panel = document.getElementById('skillPanel');
  const categoryButtons = document.querySelectorAll('.skill-category');

  if (!panel || categoryButtons.length === 0) return;

  const selectedGroup = skillGroups[index];
  const panelTag = panel.querySelector('.panel-tag');
  const itemContainer = panel.querySelector('.skill-items');

  panel.classList.remove('is-swapping');
  void panel.offsetWidth;
  panel.classList.add('is-swapping');

  panelTag.textContent = selectedGroup.category;

  itemContainer.innerHTML = selectedGroup.items
    .map(
      (item) => `
        <div class="skill-item">
          <span class="skill-icon">${item.icon}</span>
          <span>${item.name}</span>
        </div>
      `
    )
    .join('');

  categoryButtons.forEach((button, buttonIndex) => {
    button.classList.toggle('active', buttonIndex === index);
  });

  window.clearTimeout(panel._resetTimer);
  panel._resetTimer = window.setTimeout(() => {
    panel.classList.remove('is-swapping');
  }, 450);
}

function rotateSkillPanel() {
  activeSkillIndex = (activeSkillIndex + 1) % skillGroups.length;
  renderSkillPanel(activeSkillIndex);
}

function initSkillRotator() {
  const buttons = document.querySelectorAll('.skill-category');

  if (!buttons.length) return;

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      activeSkillIndex = Number(button.dataset.index);
      renderSkillPanel(activeSkillIndex);
      clearInterval(skillRotationTimer);
      skillRotationTimer = setInterval(rotateSkillPanel, 7000);
    });
  });

  renderSkillPanel(activeSkillIndex);
  skillRotationTimer = setInterval(rotateSkillPanel, 7000);
}

function initProjectTilt() {
  const showcases = document.querySelectorAll('.project-showcase');

  showcases.forEach((showcase) => {
    showcase.addEventListener('mousemove', (event) => {
      const rect = showcase.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 12;
      const rotateX = (0.5 - y) * 12;

      const visual = showcase.querySelector('.project-visual .mockup-window, .project-visual .restaurant-mockup');
      if (visual) {
        visual.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      }
    });

    showcase.addEventListener('mouseleave', () => {
      const visual = showcase.querySelector('.project-visual .mockup-window, .project-visual .restaurant-mockup');
      if (visual) {
        visual.style.transform = '';
      }
    });
  });
}

function handleBackToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initLoader() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 850);
  });
}

function initNav() {
  navToggle.addEventListener('click', handleNavToggle);
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function initFormSubmit() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      event.preventDefault();
      alert('Please fill in your name, email, and message before sending.');
    }
  });
}

function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  body.classList.add('cursor-enabled');
  window.addEventListener('pointermove', handleCursorMove);
  bindCursorInteractions();
}

updateRoleText();
createObserver();
updateHeaderState();
updateActiveLink();
updateScrollProgress();
initLoader();
initNav();
initFormSubmit();
initCustomCursor();
initSkillRotator();
initProjectTilt();

window.addEventListener('scroll', () => {
  updateHeaderState();
  updateActiveLink();
  updateScrollProgress();
});

window.addEventListener('resize', updateActiveLink);
backToTop.addEventListener('click', handleBackToTop);
