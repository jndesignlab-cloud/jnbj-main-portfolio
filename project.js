const data = window.PORTFOLIO_DATA;
const params = new URLSearchParams(location.search);
const projectId = params.get('id') || params.get('project');
function normalizeId(value){return String(value||'').trim().toLowerCase();}
function parseSkills(value){return Array.isArray(value)?value:String(value||'').split(/[·,|]/).map(v=>v.trim()).filter(Boolean);}
function getImage(project){if(project.image)return project.image;if(Array.isArray(project.galleryImages)&&project.galleryImages.length)return project.galleryImages[0];return '';}
function findSkillLabel(project){const text=[project.category,project.filterCategory,project.skills].join(' ').toLowerCase();for(const [key,skill] of Object.entries(data.skills)){if(text.includes(skill.label.toLowerCase().split(' & ')[0])||text.includes(key))return skill.label;}return project.category||'Selected project';}
function missing(message='The requested project page is not available.') {document.getElementById('projectRoot').innerHTML=`<section class="missing-project shell"><h1>Project not found.</h1><p>${message}</p><a href="index.html#work-finder">Return to portfolio →</a></section>`;}
function render(project,all){
 document.title=`${project.title} — Jann Jaravata`; document.querySelector('meta[name="description"]').setAttribute('content',project.description||project.summary||'Project case study by Jann Jaravata.');
 document.getElementById('projectSkill').textContent=findSkillLabel(project).toUpperCase(); document.getElementById('projectTitle').textContent=project.title; document.getElementById('projectSummary').textContent=project.description||project.summary||'';
 document.getElementById('projectMeta').innerHTML=`<span>${project.client||project.category||'Independent project'}</span><span>${project.year||''}</span><span>${findSkillLabel(project)}</span>`;
 const img=document.getElementById('projectImage'); const src=getImage(project); if(src){img.src=src;img.alt=`Project preview for ${project.title}`;}else{img.closest('.project-image-stage').hidden=true;}
 document.getElementById('projectRole').textContent=project.role||'Designer'; document.getElementById('projectTools').innerHTML=parseSkills(project.skills).map(t=>`<span>${t}</span>`).join('');
 document.getElementById('projectProblem').textContent=project.problem||'This project focused on solving a communication, branding, or presentation need through clearer and more strategic visuals.';
 document.getElementById('projectContribution').textContent=project.solution||project.contribution||'I handled the design direction, layout structure, visual hierarchy, and final creative execution based on the project requirements.';
 document.getElementById('projectOutcome').textContent=project.outcome||'The final output provided a more polished, organized, and professional visual presentation.';
 const index=all.indexOf(project), next=all[(index+1)%all.length]; if(next){document.getElementById('nextProjectTitle').textContent=next.title;document.getElementById('nextProjectLink').href=`project.html?id=${encodeURIComponent(next.id||next.title)}`;}else{document.querySelector('.next-project').hidden=true;}
}
(async()=>{try{const response=await fetch(`${API_URL}?action=listProjects`);const payload=await response.json();if(!payload.success||!Array.isArray(payload.projects))throw new Error();const all=payload.projects.filter(p=>p&&p.title);const project=all.find(item=>normalizeId(item.id||item.title)===normalizeId(projectId));if(!project)return missing();render(project,all);}catch(e){missing('The shared DesignLab project archive could not be reached. Please try again later.');}})();
