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
let sharedProjects = [];
let activeSkill = 'branding';

const skillTerms = {
  branding: ['brand','branding','logo','identity','visual identity'],
  social: ['social','campaign','content','publication material','facebook','instagram'],
  web: ['web','website','app','application','ui','ux','digital'],
  print: ['print','publication','brochure','catalog','flyer','layout','signage'],
  presentation: ['presentation','slides','deck','powerpoint','research'],
  systems: ['system','automation','tracker','dashboard','apps script','workflow'],
  photo: ['photo','retouch','retouching','image editing','compositing','portrait']
};

function textValue(value) {
  if (Array.isArray(value)) return value.join(' ');
  return String(value || '');
}
function isVisibleOnPersonal(project) {
  const value = project.showOnPersonalPortfolio ?? project.personalPortfolio ?? project.showPersonal;
  if (value === undefined || value === null || value === '') return true;
  return value === true || ['true','yes','1','show'].includes(String(value).toLowerCase());
}
function projectMatchesSkill(project, key) {
  const explicit = textValue(project.personalPortfolioSkills || project.portfolioSkills).toLowerCase();
  if (explicit) return skillTerms[key].some(term => explicit.includes(term));
  const haystack = [project.category, project.filterCategory, project.skills, project.title, project.description].map(textValue).join(' ').toLowerCase();
  return skillTerms[key].some(term => haystack.includes(term));
}
function projectImage(project) {
  if (project.image) return project.image;
  if (Array.isArray(project.galleryImages) && project.galleryImages.length) return project.galleryImages[0];
  return '';
}
function projectCard(project, index) {
  const id = project.id || String(project.title || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const image = projectImage(project);
  return `<a class="project-item" style="--project-delay:${index * 55}ms" href="project.html?id=${encodeURIComponent(id)}">
    <div class="project-thumb">${image ? `<img src="${image}" alt="Preview of ${project.title}" loading="lazy" />` : '<div class="project-placeholder">Project preview</div>'}</div>
    <div class="project-item-copy">
      <div><span>${project.category || 'Selected project'}</span><small>${project.year || ''}</small></div>
      <h4>${project.title || 'Untitled project'}</h4>
      <p>${project.description || project.summary || ''}</p>
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
  [experienceView, projectsHeading, projectGrid].forEach(el => el?.classList.add('is-updating'));
  requestAnimationFrame(() => requestAnimationFrame(() => [experienceView, projectsHeading, projectGrid].forEach(el => el?.classList.remove('is-updating'))));
}
function updateUrl(key) {
  const url = new URL(window.location.href);
  url.searchParams.set('skill', key); url.hash = 'work-finder'; history.replaceState(null,'',url);
}
function renderProjectsForSkill(key) {
  const matches = sharedProjects.filter(project => isVisibleOnPersonal(project) && projectMatchesSkill(project,key));
  projectCount.textContent = `${matches.length} project${matches.length === 1 ? '' : 's'}`;
  if (!matches.length) {
    projectGrid.innerHTML = `<div class="project-state"><strong>Projects are currently being curated.</strong><span>Selected work for this skill will appear here once it is published in the shared DesignLab archive.</span></div>`;
    return;
  }
  projectGrid.innerHTML = matches.map(projectCard).join('');
}
function renderSkill(key, options={}) {
  const skill=data.skills[key]; if(!skill) return; activeSkill=key; animateContent();
  experienceLabel.textContent=skill.label.toUpperCase(); experienceTitle.textContent=skill.title; experienceDescription.textContent=skill.description;
  experienceTasks.innerHTML=skill.tasks.map(item=>`<li>${item}</li>`).join('');
  experienceTools.innerHTML=skill.tools.map(item=>`<span>${item}</span>`).join('');
  projectsTitle.textContent=skill.label; activeSkillSummary.textContent=`Showing ${skill.label}`; renderProjectsForSkill(key);
  choices.forEach(choice=>{const active=choice.dataset.skill===key; choice.classList.toggle('active',active); choice.setAttribute('aria-selected',String(active)); if(active) choice.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});});
  setFlowStep(2); if(options.updateUrl!==false) updateUrl(key);
  if(options.userInitiated && innerWidth<760) setTimeout(()=>experienceView.scrollIntoView({behavior:'smooth',block:'start'}),100);
}
async function loadSharedProjects() {
  try {
    const response=await fetch(`${API_URL}?action=listProjects`);
    const payload=await response.json();
    if(!payload.success || !Array.isArray(payload.projects)) throw new Error('Invalid project response');
    sharedProjects=payload.projects.filter(project=>project && project.title);
    document.getElementById('projectSourceStatus').textContent='Live from the DesignLab project archive';
  } catch(error) {
    sharedProjects=[];
    document.getElementById('projectSourceStatus').textContent='Archive temporarily unavailable';
  }
  renderProjectsForSkill(activeSkill);
}
choices.forEach((choice,index)=>{
  choice.addEventListener('click',()=>renderSkill(choice.dataset.skill,{userInitiated:true}));
  choice.addEventListener('keydown',event=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;event.preventDefault();let target=index;if(event.key==='ArrowRight')target=(index+1)%choices.length;if(event.key==='ArrowLeft')target=(index-1+choices.length)%choices.length;if(event.key==='Home')target=0;if(event.key==='End')target=choices.length-1;choices[target].focus();renderSkill(choices[target].dataset.skill,{userInitiated:true});});
});
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.isIntersecting?setFlowStep(3):(entry.boundingClientRect.top>0&&setFlowStep(2))),{threshold:.18});
if(projectGrid)observer.observe(projectGrid);
const requested=new URLSearchParams(location.search).get('skill');
renderSkill(data.skills[requested]?requested:'branding',{updateUrl:false}); setFlowStep(1); loadSharedProjects();
