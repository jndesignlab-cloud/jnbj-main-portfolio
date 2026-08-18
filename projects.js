const SITE_VERSION = "3.12.0";

const fallbackProjects = [
  {
    id: "sample-university-postings",
    title: "Recent University Postings",
    category: "Social Media Design",
    filterCategory: "Social Media",
    featured: true,
    skills: "Campaign Posters - Social Media Management - Graphic Design",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
    description: "A curated presentation of campaign visuals, announcements, and social media postings designed for university communications."
  },
  {
    id: "sample-designlab-downloads",
    title: "DesignLab Downloads",
    category: "Digital Products",
    filterCategory: "DesignLab",
    featured: true,
    skills: "Canva Templates - Digital Product Design - Content Systems",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop",
    description: "Editable Canva template collections for professionals, business owners, and content creators."
  },
  {
    id: "sample-brand-identity",
    title: "Brand Identity Projects",
    category: "Logo & Branding",
    filterCategory: "Branding",
    featured: true,
    skills: "Logo Design - Brand Identity - Visual Systems",
    image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=1600&auto=format&fit=crop",
    description: "Logo concepts, visual systems, and brand direction projects for different clients and small businesses."
  }
];

const grid = document.querySelector("#allProjectGrid");
const filterTabs = document.querySelector("#filterTabs");
const searchInput = document.querySelector("#projectSearch");
const clearSearchButton = document.querySelector("#clearProjectSearch");
const resultCount = document.querySelector("#projectResultCount");
let allProjects = [];
let activeFilter = "All";
const initialSearchParams = new URLSearchParams(window.location.search);
let searchQuery = initialSearchParams.get("search") || "";
if (searchInput && searchQuery) searchInput.value = searchQuery;

document.querySelector("#year").textContent = new Date().getFullYear();

const versionElement = document.querySelector("#siteVersion");
const lastEditElement = document.querySelector("#lastEdit");

if (versionElement) versionElement.textContent = SITE_VERSION;

if (lastEditElement) {
  const lastModified = new Date(document.lastModified);
  lastEditElement.textContent = lastModified.toLocaleString("en-PH", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function loadProjects() {
  allProjects = fallbackProjects;

  if (API_URL && !API_URL.includes("PASTE_YOUR")) {
    try {
      const response = await fetch(`${API_URL}?action=listProjects`);
      const data = await response.json();

      if (data.success && Array.isArray(data.projects) && data.projects.length) {
        allProjects = data.projects;
      }
    } catch (error) {
      console.error(error);
    }
  }

  renderProjects();
}

function renderProjects() {
  const normalizedQuery = normalizeSearch(searchQuery);
  const projects = allProjects.filter((project) => {
    const matchesCategory = activeFilter === "All" || projectMatchesFilter(project, activeFilter);
    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;
    return createSearchText(project).includes(normalizedQuery);
  });

  grid.innerHTML = "";
  updateSearchUi(projects.length);

  if (!projects.length) {
    grid.innerHTML = `<div class="project-empty-state"><strong>No matching projects.</strong><span>Try another keyword or choose a different category.</span></div>`;
    return;
  }

  projects.forEach((project, index) => {
    const projectId = project.id || createSlug(project.title);
    const row = document.createElement("a");
    row.className = "editorial-project-row";
    row.href = `project.html?id=${encodeURIComponent(projectId)}`;
    const number = String(index + 1).padStart(2, "0");
    row.innerHTML = `
      <span class="editorial-row-index">${number}</span>
      <div class="editorial-project-thumb">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async">
      </div>
      <div class="editorial-row-copy">
        <div class="editorial-row-meta"><span>${escapeHtml(project.category || "Project")}</span></div>
        <h2>${escapeHtml(project.title)}</h2>
        <p>${escapeHtml(project.description || "")}</p>
        <div class="editorial-project-skills">${renderSkillsInline(project.skills)}</div>
      </div>
      <span class="editorial-row-arrow" aria-hidden="true">↗</span>
    `;
    grid.appendChild(row);
  });
}

filterTabs.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  activeFilter = button.dataset.filter;

  document.querySelectorAll("#filterTabs button").forEach((tab) => {
    tab.classList.toggle("active", tab === button);
  });

  renderProjects();
});

if (searchInput) {
  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderProjects();
  });
}

if (clearSearchButton) {
  clearSearchButton.addEventListener("click", () => {
    searchQuery = "";
    searchInput.value = "";
    searchInput.focus();
    renderProjects();
  });
}

function updateSearchUi(count) {
  if (resultCount) {
    const label = count === 1 ? "project" : "projects";
    resultCount.textContent = `${count} ${label} shown`;
  }
  if (clearSearchButton) clearSearchButton.hidden = !searchQuery.trim();
}

function createSearchText(project) {
  return normalizeSearch([
    project.title,
    project.category,
    project.filterCategory,
    project.description,
    project.skills
  ].filter(Boolean).join(" "));
}

function normalizeSearch(value = "") {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&amp;/g, "&")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function projectMatchesFilter(project, activeFilter) {
  const categories = parseFilterCategories(project.filterCategory || project.category);
  return categories.some((category) => normalizeFilter(category) === normalizeFilter(activeFilter));
}

function parseFilterCategories(value = "") {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(/\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeFilter(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/\s*\/\s*/g, " / ")
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s+/g, " ")
    .trim();
}

function renderSkillsInline(skills = "") {
  return parseSkills(skills)
    .slice(0, 4)
    .map((skill) => `<span>${escapeHtml(skill)}</span>`)
    .join("");
}

function parseSkills(skills = "") {
  if (Array.isArray(skills)) {
    return skills.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(skills)
    .split(/\n|-|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function createSlug(value = "") {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadProjects();
