const data = window.PORTFOLIO_DATA;
const choices = [...document.querySelectorAll('.skill-choice')];
const experienceView = document.getElementById('experience');
const experienceLabel = document.getElementById('experienceLabel');
const experienceTitle = document.getElementById('experienceTitle');
const experienceDescription = document.getElementById('experienceDescription');
const experienceTasks = document.getElementById('experienceTasks');
const experienceTools = document.getElementById('experienceTools');
const projectsHeading = document.getElementById('projectsHeading');
const projectsTitle = document.getElementById('projectsTitle');
const projectCount = document.getElementById('projectCount');
const projectGrid = document.getElementById('projectGrid');
const activeSkillSummary = document.getElementById('activeSkillSummary');
const flowSteps = [...document.querySelectorAll('[data-flow-step]')];

function projectCard(slug, project, index) {
  return `<a class="project-item" style="--project-delay:${index * 55}ms" href="project.html?project=${encodeURIComponent(slug)}">
    <div class="project-thumb"><img src="${project.image}" alt="Preview of ${project.title}" loading="lazy" /></div>
    <div class="project-item-copy">
      <div><span>${project.category}</span><small>${project.year}</small></div>
      <h4>${project.title}</h4>
      <p>${project.summary}</p>
      <b>View project →</b>
    </div>
  </a>`;
}

function setFlowStep(step) {
  flowSteps.forEach(item => {
    const itemStep = Number(item.dataset.flowStep);
    item.classList.toggle('active', itemStep <= step);
    item.classList.toggle('current', itemStep === step);
  });
}

function animateContent() {
  [experienceView, projectsHeading, projectGrid].forEach(element => element?.classList.add('is-updating'));
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      [experienceView, projectsHeading, projectGrid].forEach(element => element?.classList.remove('is-updating'));
    });
  });
}

function updateUrl(key) {
  const url = new URL(window.location.href);
  url.searchParams.set('skill', key);
  url.hash = 'work-finder';
  history.replaceState(null, '', url);
}

function renderSkill(key, options = {}) {
  const skill = data.skills[key];
  if (!skill) return;

  animateContent();
  experienceLabel.textContent = skill.label.toUpperCase();
  experienceTitle.textContent = skill.title;
  experienceDescription.textContent = skill.description;
  experienceTasks.innerHTML = skill.tasks.map(item => `<li>${item}</li>`).join('');
  experienceTools.innerHTML = skill.tools.map(item => `<span>${item}</span>`).join('');
  projectsTitle.textContent = skill.label;
  projectCount.textContent = `${skill.projects.length} project${skill.projects.length === 1 ? '' : 's'}`;
  activeSkillSummary.textContent = `Showing ${skill.label}`;
  projectGrid.innerHTML = skill.projects.map((slug, index) => projectCard(slug, data.projects[slug], index)).join('');

  choices.forEach(choice => {
    const active = choice.dataset.skill === key;
    choice.classList.toggle('active', active);
    choice.setAttribute('aria-selected', String(active));
    if (active) choice.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  });

  setFlowStep(2);
  if (options.updateUrl !== false) updateUrl(key);

  if (options.userInitiated && window.innerWidth < 760) {
    setTimeout(() => experienceView.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }
}

choices.forEach((choice, index) => {
  choice.addEventListener('click', () => renderSkill(choice.dataset.skill, { userInitiated: true }));
  choice.addEventListener('keydown', event => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let targetIndex = index;
    if (event.key === 'ArrowRight') targetIndex = (index + 1) % choices.length;
    if (event.key === 'ArrowLeft') targetIndex = (index - 1 + choices.length) % choices.length;
    if (event.key === 'Home') targetIndex = 0;
    if (event.key === 'End') targetIndex = choices.length - 1;
    choices[targetIndex].focus();
    renderSkill(choices[targetIndex].dataset.skill, { userInitiated: true });
  });
});

const projectsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setFlowStep(3);
    else if (entry.boundingClientRect.top > 0) setFlowStep(2);
  });
}, { threshold: 0.18 });

if (projectGrid) projectsObserver.observe(projectGrid);

const requestedSkill = new URLSearchParams(location.search).get('skill');
renderSkill(data.skills[requestedSkill] ? requestedSkill : 'branding', { updateUrl: false });
setFlowStep(1);
