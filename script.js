const homeProjectGrid = document.getElementById('homeProjectGrid');

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function homeProjectTile(project, index) {
  const id = ProjectArchive.id(project);
  const image = ProjectArchive.image(project);
  const title = escapeHtml(project.title);
  const category = escapeHtml(project.category || 'Selected Project');
  const description = escapeHtml(project.description || '');

  return `
    <a
      class="home-project-tile reveal-ready"
      style="--reveal-delay:${index * 55}ms"
      href="project.html?id=${encodeURIComponent(id)}"
      aria-label="Open ${title}">
      <div class="home-project-image">
        ${
          image
            ? `<img src="${escapeHtml(image)}" alt="Preview of ${title}" loading="lazy" decoding="async" />`
            : '<span>No preview image</span>'
        }
      </div>
      <div class="home-project-copy">
        <span>${category}</span>
        <h3>${title}</h3>
        ${description ? `<p>${description}</p>` : ''}
      </div>
    </a>
  `;
}

async function loadHomepageProjects() {
  if (!homeProjectGrid) return;

  try {
    const projects = await ProjectArchive.load();
    const selectedProjects = projects.slice(0, 6);

    if (!selectedProjects.length) {
      homeProjectGrid.innerHTML = `
        <div class="home-project-state">
          <strong>Projects are being updated.</strong>
        </div>
      `;
      return;
    }

    homeProjectGrid.innerHTML = selectedProjects
      .map(homeProjectTile)
      .join('');

    requestAnimationFrame(() => {
      homeProjectGrid
        .querySelectorAll('.reveal-ready')
        .forEach(item => item.classList.add('is-revealed'));
    });
  } catch (error) {
    console.warn('Homepage project archive:', error);
    homeProjectGrid.innerHTML = `
      <div class="home-project-state">
        <strong>Projects are temporarily unavailable.</strong>
        <a href="projects.html">Open the project archive ↗</a>
      </div>
    `;
  }
}

loadHomepageProjects();
