const data = window.PORTFOLIO_DATA;
const serviceButtons = [...document.querySelectorAll('.service-item')];
const modal = document.getElementById('skillModal');
const modalTitle = document.getElementById('modalSkillTitle');
const modalDescription = document.getElementById('modalSkillDescription');
const modalTools = document.getElementById('modalSkillTools');
const modalIcon = document.getElementById('modalSkillIcon');
const sampleProject = document.getElementById('sampleProject');
const shuffleButton = document.getElementById('shuffleSample');
let sharedProjects = [];
let activeSkill = 'social';
let currentMatches = [];
let lastSampleId = '';
let lastFocusedElement = null;

const skillTerms = {
  social: ['social','campaign','content','poster','carousel','facebook','instagram','publication material'],
  print: ['print','publication','brochure','catalog','flyer','layout','signage','tarpaulin','booklet'],
  packaging: ['packaging','package','label','box','pouch','sleeve','bottle','product packaging'],
  web: ['web','website','landing page','app','application','ui','ux','digital platform'],
  presentation: ['presentation','slides','deck','powerpoint','research','conference'],
  custom: ['custom','brand','branding','logo','identity','system','automation','tracker','dashboard','workflow','photo','retouch','compositing','digital product']
};
const skillIcons = {
  social: '<svg viewBox="0 0 24 24"><path d="M4 6h16v12H4zM8 10h8M8 14h5M7 21h10"/></svg>',
  print: '<svg viewBox="0 0 24 24"><path d="M7 3h10v5H7zM5 8h14v9H5zM7 14h10v7H7z"/></svg>',
  packaging: '<svg viewBox="0 0 24 24"><path d="M4 7l8-4 8 4-8 4zM4 7v10l8 4 8-4V7M12 11v10"/></svg>',
  web: '<svg viewBox="0 0 24 24"><path d="M3 5h18v14H3zM3 9h18M7 7h.01M10 7h.01"/></svg>',
  presentation: '<svg viewBox="0 0 24 24"><path d="M4 4h16v12H4zM8 20l4-4 4 4M8 9h3m2 0h3M8 12h8"/></svg>',
  custom: '<svg viewBox="0 0 24 24"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/><circle cx="12" cy="12" r="3"/></svg>'
};
function escapeHtml(value) { return String(value || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;'); }
function projectMatchesSkill(project, key) {
  const explicit = ProjectArchive.text(project.personalPortfolioSkills || project.portfolioSkills).toLowerCase();
  if (explicit) return skillTerms[key].some(term => explicit.includes(term));
  const haystack = [project.category, project.filterCategory, project.skills, project.title, project.description, project.summary].map(ProjectArchive.text).join(' ').toLowerCase();
  return skillTerms[key].some(term => haystack.includes(term));
}
function getMatches(key) { return sharedProjects.filter(project => projectMatchesSkill(project, key)); }
function pickRandomProject() {
  if (!currentMatches.length) return null;
  let candidates = currentMatches;
  if (currentMatches.length > 1 && lastSampleId) candidates = currentMatches.filter(project => ProjectArchive.id(project) !== lastSampleId);
  const project = candidates[Math.floor(Math.random() * candidates.length)];
  lastSampleId = ProjectArchive.id(project);
  return project;
}
function renderSample(project) {
  shuffleButton.hidden = currentMatches.length < 2;
  if (!project) {
    sampleProject.innerHTML = `<div class="sample-empty"><strong>No published sample yet.</strong><span>Projects for this area are still being curated in the shared DesignLab archive.</span><a href="projects.html">Browse all projects ↗</a></div>`;
    return;
  }
  const image = ProjectArchive.image(project);
  const id = ProjectArchive.id(project);
  const title = escapeHtml(project.title);
  const category = escapeHtml(project.category);
  const summary = escapeHtml(project.description || 'A selected project from the DesignLab archive.');
  sampleProject.innerHTML = `<div class="sample-thumb">${image ? `<img src="${escapeHtml(image)}" alt="Preview of ${title}" />` : '<span>Project preview</span>'}</div><div class="sample-copy"><span>${category}</span><h4>${title}</h4><p>${summary}</p><div class="sample-actions"><a href="project.html?id=${encodeURIComponent(id)}">View gallery ↗</a><a href="projects.html">All projects</a></div></div>`;
}
async function openSkillModal(key, sourceButton) {
  const skill = data.skills[key];
  if (!skill) return;
  activeSkill = key; lastSampleId = ''; lastFocusedElement = sourceButton || document.activeElement;
  modalTitle.textContent = skill.label; modalDescription.textContent = skill.description;
  modalTools.innerHTML = skill.tools.map(tool => `<span>${escapeHtml(tool)}</span>`).join('');
  modalIcon.innerHTML = skillIcons[key] || '';
  sampleProject.innerHTML = '<div class="sample-loading">Loading a related project…</div>';
  modal.classList.add('is-open'); modal.setAttribute('aria-hidden','false'); document.body.classList.add('modal-open'); modal.querySelector('.modal-close')?.focus();
  try { if (!sharedProjects.length) sharedProjects = await ProjectArchive.load(); currentMatches = getMatches(key); renderSample(pickRandomProject()); }
  catch (_) { currentMatches = []; sampleProject.innerHTML = '<div class="sample-empty"><strong>Archive temporarily unavailable.</strong><span>Please try the Projects page again later.</span></div>'; }
}
function clearSkillParameter() {
  const url = new URL(location.href);
  if (!url.searchParams.has('skill')) return;
  url.searchParams.delete('skill');
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}
function closeSkillModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  clearSkillParameter();
  lastFocusedElement?.focus();
}
serviceButtons.forEach(button => button.addEventListener('click', () => openSkillModal(button.dataset.skill, button)));
document.querySelectorAll('[data-modal-close]').forEach(button => button.addEventListener('click', closeSkillModal));
shuffleButton.addEventListener('click', () => renderSample(pickRandomProject()));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('is-open')) closeSkillModal(); });
clearSkillParameter();
ProjectArchive.load()
  .then(projects => {
    sharedProjects = projects;
  })
  .catch(() => {});