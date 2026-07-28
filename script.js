const data = window.PORTFOLIO_DATA;
const choices = document.querySelectorAll('.skill-choice');
const experienceLabel = document.getElementById('experienceLabel');
const experienceTitle = document.getElementById('experienceTitle');
const experienceDescription = document.getElementById('experienceDescription');
const experienceTasks = document.getElementById('experienceTasks');
const experienceTools = document.getElementById('experienceTools');
const projectsTitle = document.getElementById('projectsTitle');
const projectCount = document.getElementById('projectCount');
const projectGrid = document.getElementById('projectGrid');

function projectCard(slug, project) {
  return `<a class="project-item" href="project.html?project=${encodeURIComponent(slug)}">
    <div class="project-thumb"><img src="${project.image}" alt="Preview of ${project.title}" loading="lazy" /></div>
    <div class="project-item-copy">
      <div><span>${project.category}</span><small>${project.year}</small></div>
      <h4>${project.title}</h4>
      <p>${project.summary}</p>
      <b>View project →</b>
    </div>
  </a>`;
}

function renderSkill(key, updateHash = true) {
  const skill = data.skills[key];
  if (!skill) return;

  experienceLabel.textContent = skill.label.toUpperCase();
  experienceTitle.textContent = skill.title;
  experienceDescription.textContent = skill.description;
  experienceTasks.innerHTML = skill.tasks.map(item => `<li>${item}</li>`).join('');
  experienceTools.innerHTML = skill.tools.map(item => `<span>${item}</span>`).join('');
  projectsTitle.textContent = skill.label;
  projectCount.textContent = `${skill.projects.length} project${skill.projects.length === 1 ? '' : 's'}`;
  projectGrid.innerHTML = skill.projects.map(slug => projectCard(slug, data.projects[slug])).join('');

  choices.forEach(choice => {
    const active = choice.dataset.skill === key;
    choice.classList.toggle('active', active);
    choice.setAttribute('aria-selected', String(active));
  });

  if (updateHash) history.replaceState(null, '', `#work-finder?skill=${key}`);
}

choices.forEach(choice => choice.addEventListener('click', () => renderSkill(choice.dataset.skill)));

const hashSkill = location.hash.match(/skill=([a-z]+)/)?.[1];
renderSkill(data.skills[hashSkill] ? hashSkill : 'branding', false);
