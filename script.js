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
  const url = new URL(location.href); url.searchParams.set('skill', key); history.replaceState(null,'',url);
  try { if (!sharedProjects.length) sharedProjects = await ProjectArchive.load(); currentMatches = getMatches(key); renderSample(pickRandomProject()); }
  catch (_) { currentMatches = []; sampleProject.innerHTML = '<div class="sample-empty"><strong>Archive temporarily unavailable.</strong><span>Please try the Projects page again later.</span></div>'; }
}
function closeSkillModal() { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden','true'); document.body.classList.remove('modal-open'); lastFocusedElement?.focus(); }
serviceButtons.forEach(button => button.addEventListener('click', () => openSkillModal(button.dataset.skill, button)));
document.querySelectorAll('[data-modal-close]').forEach(button => button.addEventListener('click', closeSkillModal));
shuffleButton.addEventListener('click', () => renderSample(pickRandomProject()));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('is-open')) closeSkillModal(); });
ProjectArchive.load().then(projects => { sharedProjects = projects; const requestedSkill = new URLSearchParams(location.search).get('skill'); const requestedButton = serviceButtons.find(button => button.dataset.skill === requestedSkill); if (requestedButton) openSkillModal(requestedSkill, requestedButton); }).catch(() => {});