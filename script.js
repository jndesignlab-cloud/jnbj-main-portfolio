const data = window.PORTFOLIO_DATA;
const serviceButtons = [...document.querySelectorAll('.service-item')];
const modal = document.getElementById('skillModal');
const modalTitle = document.getElementById('modalSkillTitle');
const modalDescription = document.getElementById('modalSkillDescription');
const modalTools = document.getElementById('modalSkillTools');
const modalProcess = document.getElementById('modalProcessList');
const modalIcon = document.getElementById('modalSkillIcon');
const sampleProject = document.getElementById('sampleProject');
const shuffleButton = document.getElementById('shuffleSample');
let sharedProjects = [];
let activeSkill = 'branding';
let currentMatches = [];
let lastSampleId = '';
let lastFocusedElement = null;

const skillTerms = {
  branding: ['brand','branding','logo','identity','visual identity'],
  social: ['social','campaign','content','publication material','facebook','instagram'],
  web: ['web','website','app','application','ui','ux','digital'],
  print: ['print','publication','brochure','catalog','flyer','layout','signage'],
  presentation: ['presentation','slides','deck','powerpoint','research'],
  systems: ['system','automation','tracker','dashboard','apps script','workflow'],
  photo: ['photo','retouch','retouching','image editing','compositing','portrait']
};

const skillIcons = {
  branding: '<svg viewBox="0 0 24 24"><path d="M5 5h14v14H5zM9 9h6v6H9z"/></svg>',
  social: '<svg viewBox="0 0 24 24"><path d="M4 7h16v10H4zM8 17v3m8-3v3M8 11h3m2 0h3"/></svg>',
  web: '<svg viewBox="0 0 24 24"><path d="M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01"/></svg>',
  print: '<svg viewBox="0 0 24 24"><path d="M7 3h10v5H7zM5 8h14v9H5zM7 14h10v7H7z"/></svg>',
  presentation: '<svg viewBox="0 0 24 24"><path d="M4 4h16v12H4zM8 20l4-4 4 4M8 9h3m2 0h3M8 12h8"/></svg>',
  systems: '<svg viewBox="0 0 24 24"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6zM10 7h4M7 10v4m10-4v4m-7 3h4"/></svg>',
  photo: '<svg viewBox="0 0 24 24"><path d="M3 6h5l2-2h4l2 2h5v14H3zM12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>'
};

function textValue(value) {
  if (Array.isArray(value)) return value.join(' ');
  return String(value || '');
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function projectId(project) {
  return project.id || String(project.title || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function isVisibleOnPersonal(project) {
  const value = project.showOnPersonalPortfolio ?? project.personalPortfolio ?? project.showPersonal;
  if (value === undefined || value === null || value === '') return true;
  return value === true || ['true','yes','1','show'].includes(String(value).toLowerCase());
}

function projectMatchesSkill(project, key) {
  const explicit = textValue(project.personalPortfolioSkills || project.portfolioSkills).toLowerCase();
  if (explicit) return skillTerms[key].some(term => explicit.includes(term));
  const haystack = [project.category, project.filterCategory, project.skills, project.title, project.description, project.summary]
    .map(textValue)
    .join(' ')
    .toLowerCase();
  return skillTerms[key].some(term => haystack.includes(term));
}

function projectImage(project) {
  if (project.image) return project.image;
  if (project.previewImage) return project.previewImage;
  if (Array.isArray(project.galleryImages) && project.galleryImages.length) return project.galleryImages[0];
  return '';
}

function getMatches(key) {
  return sharedProjects.filter(project => isVisibleOnPersonal(project) && projectMatchesSkill(project, key));
}

function pickRandomProject() {
  if (!currentMatches.length) return null;
  let candidates = currentMatches;
  if (currentMatches.length > 1 && lastSampleId) {
    candidates = currentMatches.filter(project => projectId(project) !== lastSampleId);
  }
  const project = candidates[Math.floor(Math.random() * candidates.length)];
  lastSampleId = projectId(project);
  return project;
}

function renderSample(project) {
  shuffleButton.hidden = currentMatches.length < 2;
  if (!project) {
    sampleProject.innerHTML = `<div class="sample-empty"><strong>No published sample yet.</strong><span>The process is ready, but projects for this area are still being curated in the shared DesignLab archive.</span></div>`;
    return;
  }
  const image = projectImage(project);
  const id = projectId(project);
  const title = escapeHtml(project.title || 'Untitled project');
  const category = escapeHtml(project.category || 'Selected project');
  const summary = escapeHtml(project.description || project.summary || 'A selected project from the DesignLab archive.');
  sampleProject.innerHTML = `
    <div class="sample-thumb">${image ? `<img src="${escapeHtml(image)}" alt="Preview of ${title}" />` : '<span>Project preview</span>'}</div>
    <div class="sample-copy">
      <span>${category}</span>
      <h4>${title}</h4>
      <p>${summary}</p>
      <a href="project.html?id=${encodeURIComponent(id)}">Open project ↗</a>
    </div>`;
}

function openSkillModal(key, sourceButton) {
  const skill = data.skills[key];
  if (!skill) return;
  activeSkill = key;
  lastSampleId = '';
  currentMatches = getMatches(key);
  lastFocusedElement = sourceButton || document.activeElement;

  modalTitle.textContent = skill.label;
  modalDescription.textContent = skill.description;
  modalTools.innerHTML = skill.tools.map(tool => `<span>${escapeHtml(tool)}</span>`).join('');
  modalProcess.innerHTML = skill.tasks.map((step, index) => `<li><b>${String(index + 1).padStart(2, '0')}</b><span>${escapeHtml(step)}</span></li>`).join('');
  modalIcon.innerHTML = skillIcons[key] || '';
  renderSample(pickRandomProject());

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modal.querySelector('.modal-close')?.focus();

  const url = new URL(location.href);
  url.searchParams.set('skill', key);
  history.replaceState(null, '', url);
}

function closeSkillModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lastFocusedElement?.focus();
}

serviceButtons.forEach(button => {
  button.addEventListener('click', () => openSkillModal(button.dataset.skill, button));
});

document.querySelectorAll('[data-modal-close]').forEach(button => button.addEventListener('click', closeSkillModal));
shuffleButton.addEventListener('click', () => renderSample(pickRandomProject()));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeSkillModal();
});

async function loadSharedProjects() {
  try {
    const response = await fetch(`${API_URL}?action=listProjects`);
    const payload = await response.json();
    if (!payload.success || !Array.isArray(payload.projects)) throw new Error('Invalid project response');
    sharedProjects = payload.projects.filter(project => project && project.title);
  } catch (error) {
    sharedProjects = [];
  }
}

loadSharedProjects().then(() => {
  const requestedSkill = new URLSearchParams(location.search).get('skill');
  const requestedButton = serviceButtons.find(button => button.dataset.skill === requestedSkill);
  if (requestedButton) openSkillModal(requestedSkill, requestedButton);
});
