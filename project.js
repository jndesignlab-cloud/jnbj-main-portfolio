const data = window.PORTFOLIO_DATA;
const params = new URLSearchParams(location.search);
const slug = params.get('project');
const project = data.projects[slug];

if (!project) {
  document.getElementById('projectRoot').innerHTML = `<section class="missing-project shell"><h1>Project not found.</h1><p>The requested project page is not available.</p><a href="index.html#work-finder">Return to portfolio →</a></section>`;
} else {
  document.title = `${project.title} — Jann Jaravata`;
  document.querySelector('meta[name="description"]').setAttribute('content', project.summary);
  document.getElementById('projectSkill').textContent = project.category.toUpperCase();
  document.getElementById('projectTitle').textContent = project.title;
  document.getElementById('projectSummary').textContent = project.summary;
  document.getElementById('projectMeta').innerHTML = `<span>${project.client}</span><span>${project.year}</span><span>${data.skills[project.skill].label}</span>`;
  const image = document.getElementById('projectImage');
  image.src = project.image;
  image.alt = `Project preview for ${project.title}`;
  document.getElementById('projectRole').textContent = project.role;
  document.getElementById('projectTools').innerHTML = project.tools.map(tool => `<span>${tool}</span>`).join('');
  document.getElementById('projectProblem').textContent = project.problem;
  document.getElementById('projectContribution').textContent = project.contribution;
  document.getElementById('projectOutcome').textContent = project.outcome;

  const slugs = Object.keys(data.projects);
  const nextSlug = slugs[(slugs.indexOf(slug) + 1) % slugs.length];
  const next = data.projects[nextSlug];
  document.getElementById('nextProjectTitle').textContent = next.title;
  document.getElementById('nextProjectLink').href = `project.html?project=${encodeURIComponent(nextSlug)}`;
}
