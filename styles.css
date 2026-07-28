
const menuButton = document.getElementById('menuButton');
const nav = document.getElementById('nav');

menuButton?.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  nav.style.display = expanded ? 'none' : 'flex';
  if (!expanded) {
    nav.style.position = 'absolute';
    nav.style.top = '76px';
    nav.style.left = '12px';
    nav.style.right = '12px';
    nav.style.padding = '16px';
    nav.style.background = '#ffffff';
    nav.style.border = '1px solid #e1e7f0';
    nav.style.borderRadius = '18px';
    nav.style.flexDirection = 'column';
    nav.style.boxShadow = '0 24px 60px rgba(22, 41, 76, 0.08)';
  }
});

const skillData = {
  branding: {
    title: 'Branding & Visual Identity',
    description: 'Logo systems, visual direction, identity extensions, and design decisions that help a brand look clear and cohesive across multiple touchpoints.',
    tags: ['Logo systems', 'Identity applications', 'Brand direction', 'Visual consistency'],
    projects: ['DesignLab Creative Studio', 'Finora identity direction', 'DesignLab Downloads branding']
  },
  social: {
    title: 'Social Media & Campaigns',
    description: 'Coordinated content systems for schools, organizations, and businesses — built to keep communication clear across multiple posts and campaign materials.',
    tags: ['Publication materials', 'Campaign posters', 'Carousel systems', 'Event promotions'],
    projects: ['Panpacific University campaigns', 'Enrollment and orientation materials', 'DesignLab daily postings']
  },
  web: {
    title: 'Web & Digital',
    description: 'Responsive websites, web visuals, interface design, and lightweight digital experiences designed for clarity, practical use, and clean structure.',
    tags: ['Landing pages', 'Portfolio websites', 'UI systems', 'Responsive design'],
    projects: ['DesignLab portfolio website', 'PACE website', 'Finora web app UI']
  },
  print: {
    title: 'Print & Publications',
    description: 'Brochures, books, flyers, event materials, and layouts designed with readable hierarchy and a practical understanding of print output.',
    tags: ['Brochures', 'Catalogs', 'Tarpaulins', 'Layout design'],
    projects: ['University brochures', 'Institutional print materials', 'Service and event collaterals']
  },
  presentation: {
    title: 'Presentation Design',
    description: 'Presentation slides and visual decks shaped around audience understanding, clean structure, and information hierarchy.',
    tags: ['Research slides', 'Pitch decks', 'Speaker visuals', 'Educational presentations'],
    projects: ['Research brief slides', 'PIRC event presentations', 'University presentation materials']
  },
  systems: {
    title: 'Creative Systems & Automation',
    description: 'Design-related systems that combine visuals with workflow thinking — from trackers and request systems to evaluation tools and content organization.',
    tags: ['Apps Script tools', 'Workflow design', 'Automation support', 'Content systems'],
    projects: ['OSC Request System', 'PIRC Evaluation System', 'DesignLab Task Tracker']
  },
  photo: {
    title: 'Photo Editing & Retouching',
    description: 'Image cleanup, portrait enhancement, compositing, extraction, and retouching focused on polished, production-ready results.',
    tags: ['Portrait retouching', 'Background work', 'Photo enhancement', 'Compositing'],
    projects: ['Studio portrait edits', 'University photo enhancements', 'Product and publication retouching']
  }
};

const buttons = document.querySelectorAll('.skill-button');
const titleEl = document.getElementById('skillTitle');
const descriptionEl = document.getElementById('skillDescription');
const tagsEl = document.getElementById('skillTags');
const projectsEl = document.getElementById('skillProjects');

function renderSkill(key) {
  const skill = skillData[key];
  if (!skill) return;
  titleEl.textContent = skill.title;
  descriptionEl.textContent = skill.description;
  tagsEl.innerHTML = skill.tags.map(tag => `<span>${tag}</span>`).join('');
  projectsEl.innerHTML = skill.projects.map(project => `<span>${project}</span>`).join('');
  buttons.forEach(button => {
    const active = button.dataset.skill === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
}

buttons.forEach(button => {
  button.addEventListener('click', () => renderSkill(button.dataset.skill));
});

renderSkill('branding');
