const skillData = {
  branding: {
    number: '01',
    title: 'Branding & Visual Identity',
    description: 'Logo systems, visual direction, identity extensions, and design decisions that help a brand look clear and cohesive across multiple touchpoints.',
    outputs: ['Logo systems', 'Brand direction', 'Identity applications', 'Visual guidelines'],
    projects: [
      ['DesignLab Creative Studio', 'Brand system'],
      ['Finora', 'Product identity'],
      ['DesignLab Downloads', 'Sub-brand direction']
    ]
  },
  social: {
    number: '02',
    title: 'Social Media & Campaigns',
    description: 'Coordinated content systems for institutions, events, and businesses, designed to keep communication clear across multiple posts and campaign materials.',
    outputs: ['Campaign posters', 'Carousels', 'Event promotions', 'Content systems'],
    projects: [
      ['Panpacific University campaigns', 'Institutional communication'],
      ['Panagpasangbay materials', 'Student campaign'],
      ['DesignLab daily content', 'Brand publishing system']
    ]
  },
  web: {
    number: '03',
    title: 'Web & Digital',
    description: 'Responsive websites, web visuals, interface design, and lightweight digital experiences designed for clarity, practical use, and clean structure.',
    outputs: ['Portfolio websites', 'Landing pages', 'Interface design', 'Responsive systems'],
    projects: [
      ['DesignLab portfolio website', 'Creative studio website'],
      ['PACE website', 'Institutional website'],
      ['Finora', 'Finance web application']
    ]
  },
  print: {
    number: '04',
    title: 'Print & Publications',
    description: 'Brochures, books, flyers, event materials, and layouts designed with readable hierarchy and a practical understanding of print production.',
    outputs: ['Brochures', 'Catalogs', 'Tarpaulins', 'Publication layouts'],
    projects: [
      ['University brochures', 'Institutional publication'],
      ['Event collaterals', 'Print campaign'],
      ['Client catalogs', 'Commercial layout']
    ]
  },
  presentation: {
    number: '05',
    title: 'Presentation Design',
    description: 'Presentation slides and visual decks shaped around audience understanding, clean structure, and information hierarchy.',
    outputs: ['Research decks', 'Pitch presentations', 'Speaker slides', 'Educational materials'],
    projects: [
      ['Research brief slides', 'Academic presentation'],
      ['PIRC presentations', 'Conference materials'],
      ['University decks', 'Institutional presentation']
    ]
  },
  systems: {
    number: '06',
    title: 'Creative Systems & Automation',
    description: 'Design-related systems that combine visuals with workflow thinking, from trackers and request systems to evaluation tools and content organization.',
    outputs: ['Apps Script tools', 'Workflow design', 'Automation support', 'Content systems'],
    projects: [
      ['OSC Request System', 'Creative workflow'],
      ['PIRC Evaluation System', 'Automated certificate workflow'],
      ['DesignLab Task Tracker', 'Content planning system']
    ]
  },
  photo: {
    number: '07',
    title: 'Photo Editing & Retouching',
    description: 'Image cleanup, portrait enhancement, compositing, extraction, and retouching focused on polished, production-ready results.',
    outputs: ['Portrait retouching', 'Background replacement', 'Photo enhancement', 'Compositing'],
    projects: [
      ['Studio portrait edits', 'Professional portraits'],
      ['University photo enhancements', 'Institutional imagery'],
      ['Product and publication edits', 'Commercial retouching']
    ]
  }
};

const tabs = document.querySelectorAll('.skill-tab');
const number = document.getElementById('skillNumber');
const title = document.getElementById('skillTitle');
const description = document.getElementById('skillDescription');
const outputs = document.getElementById('skillOutputs');
const projects = document.getElementById('skillProjects');

function renderSkill(key) {
  const data = skillData[key];
  number.textContent = data.number;
  title.textContent = data.title;
  description.textContent = data.description;
  outputs.innerHTML = data.outputs.map(item => `<span>${item}</span>`).join('');
  projects.innerHTML = data.projects.map(([name, type]) => `<a href="#"><strong>${name}</strong><span>${type}</span></a>`).join('');
  tabs.forEach(tab => {
    const active = tab.dataset.skill === key;
    tab.classList.toggle('active', active);
    tab.setAttribute('aria-selected', String(active));
  });
}

tabs.forEach(tab => tab.addEventListener('click', () => renderSkill(tab.dataset.skill)));
renderSkill('branding');

const menuButton = document.getElementById('menuButton');
const nav = document.querySelector('.desktop-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  if (!open) {
    nav.style.display = 'flex';
    nav.style.position = 'absolute';
    nav.style.top = '68px';
    nav.style.left = '10px';
    nav.style.right = '10px';
    nav.style.padding = '16px';
    nav.style.background = '#fff';
    nav.style.border = '1px solid #dfe5ee';
    nav.style.flexDirection = 'column';
    nav.style.boxShadow = '0 20px 40px rgba(17,27,47,.08)';
  } else {
    nav.removeAttribute('style');
  }
});
