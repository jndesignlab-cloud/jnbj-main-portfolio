const projectGrid = document.querySelector("#projectGrid");
const modal = document.querySelector("#projectModal");
const modalImage = document.querySelector("#modalImage");
const modalCategory = document.querySelector("#modalCategory");
const modalTitle = document.querySelector("#modalTitle");
const modalDescription = document.querySelector("#modalDescription");
const modalSkills = document.querySelector("#modalSkills");
const modalLink = document.querySelector("#modalLink");
const modalInquiryLink = document.querySelector("#modalInquiryLink");
const visitorCountElement = document.querySelector("#visitorCount");
const spotlightProject = document.querySelector("#spotlightProject");
const spotlightShuffle = document.querySelector("#spotlightShuffle");
let projectArchive = [];
let currentSpotlightKey = "";

const statModal = document.querySelector("#statModal");
const statModalCode = document.querySelector("#statModalCode");
const statModalLabel = document.querySelector("#statModalLabel");
const statModalValue = document.querySelector("#statModalValue");
const statModalTitle = document.querySelector("#statModalTitle");
const statModalDescription = document.querySelector("#statModalDescription");
const statModalMeter = document.querySelector("#statModalMeter");
const statModalList = document.querySelector("#statModalList");
const statModalLink = document.querySelector("#statModalLink");
let lastStatTrigger = null;

const STAT_DETAILS = {
  experience: {
    code: "STAT // EXP",
    label: "Experience level",
    value: "8+",
    title: "Professional design experience",
    description: "Years of hands-on work across institutional campaigns, freelance projects, content systems, and digital design.",
    meter: 92,
    bullets: [
      "Creative Designer and Multimedia Specialist at Panpacific University",
      "Founder and Creative Director of DesignLab Creative Studio",
      "Fast-turnaround work for digital, print, social, and events"
    ],
    link: "cv.html",
    linkText: "Open complete CV"
  },
  campaigns: {
    code: "STAT // QST",
    label: "Completed missions",
    value: "200+",
    title: "Campaign and marketing materials",
    description: "A growing body of posters, social content, publications, event visuals, templates, and web presentations.",
    meter: 96,
    bullets: [
      "University announcements and enrollment campaigns",
      "Social media content and branded carousel systems",
      "Print collateral, event graphics, and presentation materials"
    ],
    link: "projects.html",
    linkText: "Browse all projects"
  },
  certification: {
    code: "STAT // BDG",
    label: "Unlocked badge",
    value: "ACP",
    title: "Adobe Certified Professional",
    description: "Certified in Adobe Photoshop, supported by years of daily production, retouching, compositing, and campaign design.",
    meter: 100,
    bullets: [
      "Adobe Photoshop certification",
      "Google Digital Marketing and E-Commerce",
      "Microsoft Office Specialist and Civil Service Professional"
    ],
    link: "cv.html#certifications",
    linkText: "View certifications"
  },
  remote: {
    code: "STAT // MOD",
    label: "Work mode",
    value: "ON",
    title: "Remote collaboration ready",
    description: "Set up for organized remote work, async feedback, online meetings, cloud delivery, and cross-time-zone collaboration.",
    meter: 94,
    bullets: [
      "Reliable workstation and high-speed internet with backup connection",
      "Google Workspace, Figma, Canva, Adobe, Framer, and GitHub workflows",
      "Clear file organization, progress updates, and delivery systems"
    ],
    link: "contact.html?source=stat-remote",
    linkText: "Start a project"
  },
  "social-design": {
    code: "SKILL // 01",
    label: "Core skill",
    value: "94",
    title: "Campaign and social design",
    description: "Clear campaign visuals built for fast reading, brand consistency, and multi-platform use.",
    meter: 94,
    bullets: [
      "Enrollment, institutional, and event campaigns",
      "Social posts, carousels, advisories, and promotional graphics",
      "Content systems for recurring campaigns and daily publishing"
    ],
    link: "projects.html",
    linkText: "View related work"
  },
  publication: {
    code: "SKILL // 02",
    label: "Core skill",
    value: "88",
    title: "Publication and layout design",
    description: "Structured layouts that turn dense information into readable brochures, newsletters, flyers, and event materials.",
    meter: 88,
    bullets: [
      "Brochures, newsletters, flyers, and program materials",
      "Clear hierarchy for information-heavy content",
      "Print-ready file preparation and format adaptation"
    ],
    link: "projects.html",
    linkText: "View related work"
  },
  branding: {
    code: "SKILL // 03",
    label: "Core skill",
    value: "86",
    title: "Brand and content systems",
    description: "Practical identity systems that help brands stay recognizable across repeated content and campaigns.",
    meter: 86,
    bullets: [
      "Logo direction and supporting visual elements",
      "Reusable Canva templates and campaign systems",
      "Guidelines for color, typography, and visual consistency"
    ],
    link: "services.html#branding",
    linkText: "Explore services"
  },
  "web-systems": {
    code: "SKILL // 04",
    label: "Core skill",
    value: "81",
    title: "Web interfaces and workflow systems",
    description: "Lightweight websites and internal tools designed around real communication and workflow needs.",
    meter: 81,
    bullets: [
      "Responsive HTML, CSS, and JavaScript interfaces",
      "Google Apps Script and Google Sheets integrations",
      "Dashboards, inquiry systems, trackers, and static websites"
    ],
    link: "projects.html",
    linkText: "View web projects"
  },
  retouching: {
    code: "SKILL // 05",
    label: "Core skill",
    value: "91",
    title: "Photo retouching and finishing",
    description: "Detailed image cleanup, compositing, product enhancement, and final polishing for digital and print use.",
    meter: 91,
    bullets: [
      "Professional cleanup and image correction",
      "Product, campaign, and portrait compositing",
      "Lighting, color, detail, and presentation finishing"
    ],
    link: "projects.html",
    linkText: "View selected work"
  }
};

function openStatModal(statKey, trigger) {
  const stat = STAT_DETAILS[statKey];
  if (!statModal || !stat) return;

  lastStatTrigger = trigger || document.activeElement;
  statModalCode.textContent = stat.code;
  statModalLabel.textContent = stat.label;
  statModalValue.textContent = stat.value;
  statModalTitle.textContent = stat.title;
  statModalDescription.textContent = stat.description;
  statModalMeter.style.width = `${Math.max(0, Math.min(100, stat.meter || 0))}%`;
  statModalList.innerHTML = stat.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  statModalLink.href = stat.link;
  statModalLink.textContent = stat.linkText;

  statModal.classList.add("active");
  statModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const closeButton = statModal.querySelector("[data-close-stat-modal]");
  window.setTimeout(() => closeButton?.focus(), 20);
}

function closeStatModal() {
  if (!statModal) return;
  statModal.classList.remove("active");
  statModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  lastStatTrigger?.focus?.();
}

document.querySelectorAll("[data-stat]").forEach((button) => {
  button.addEventListener("click", () => openStatModal(button.dataset.stat, button));
});

document.querySelectorAll("[data-close-stat-modal]").forEach((element) => {
  element.addEventListener("click", closeStatModal);
});

const SITE_VERSION = "3.12.0";

document.querySelector("#year").textContent = new Date().getFullYear();

const versionElement = document.querySelector("#siteVersion");
const lastEditElement = document.querySelector("#lastEdit");

if (versionElement) {
  versionElement.textContent = SITE_VERSION;
}

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

const fallbackProjects = [
  {
    id: "sample-university-postings",
    title: "Recent University Postings",
    category: "Social Media Design",
    filterCategory: "Social Media",
    featured: true,
    skills: "Campaign Posters - Social Media Management - Graphic Design",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
    description: "A curated presentation of campaign visuals, announcements, and social media postings designed for university communications.",
    problem: "The university needed clear, consistent, and professional campaign visuals for announcements and enrollment-related communications.",
    solution: "I created organized social media layouts with strong hierarchy, clean typography, and brand-aligned visuals to make each announcement easier to understand.",
    outcome: "The final outputs created a more consistent and polished online presence for university communications.",
    link: "https://bit.ly/JNBJ-Porfolio",
    galleryImages: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1600&auto=format&fit=crop"
    ]
  },
  {
    id: "sample-designlab-downloads",
    title: "DesignLab Downloads",
    category: "Digital Products",
    filterCategory: "DesignLab",
    featured: true,
    skills: "Canva Templates - Digital Product Design - Content Systems",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop",
    description: "Editable Canva template collections for professionals, business owners, and content creators.",
    problem: "Business owners and professionals needed ready-made content templates that looked professional without starting from scratch.",
    solution: "I designed editable Canva templates with structured layouts, reusable visual systems, and clear content sections.",
    outcome: "The template sets helped users save time, post more consistently, and maintain a more professional brand presence.",
    link: "https://bit.ly/JNBJ-Porfolio",
    galleryImages: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop"
    ]
  },
  {
    id: "sample-brand-identity",
    title: "Brand Identity Projects",
    category: "Logo & Branding",
    filterCategory: "Branding",
    featured: true,
    skills: "Logo Design - Brand Identity - Visual Systems",
    image: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=1600&auto=format&fit=crop",
    description: "Logo concepts, visual systems, and brand direction projects for different clients and small businesses.",
    problem: "Clients needed brand visuals that felt more recognizable, credible, and aligned with their business identity.",
    solution: "I developed logo concepts, visual directions, and supporting brand elements based on each client’s positioning and audience.",
    outcome: "The final brand assets gave each client a clearer and more professional visual identity.",
    link: "https://bit.ly/JNBJ-Porfolio",
    galleryImages: [
      "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1600&auto=format&fit=crop"
    ]
  }
];

async function loadProjects() {
  let sourceProjects = fallbackProjects;

  if (API_URL && !API_URL.includes("PASTE_YOUR")) {
    try {
      const response = await fetch(`${API_URL}?action=listProjects`);
      const data = await response.json();

      if (!data.success || !Array.isArray(data.projects)) {
        throw new Error("Invalid project response.");
      }

      sourceProjects = data.projects;
    } catch (error) {
      console.error(error);
    }
  }

  projectArchive = sourceProjects.filter((project) => project && project.title);
  if (!projectArchive.length) projectArchive = fallbackProjects;

  const spotlight = chooseRandomProject(projectArchive);
  renderSpotlight(spotlight);

  const featuredProjects = getFeaturedProjects(projectArchive);
  const preferredRecent = featuredProjects.length ? featuredProjects : projectArchive;
  const recentProjects = buildRecentProjects(preferredRecent, projectArchive, spotlight, 6);
  renderProjects(recentProjects);
}

function projectKey(project = {}) {
  return String(project.id || project.title || "").trim().toLowerCase();
}

function chooseRandomProject(projects = [], excludeKey = "") {
  const candidates = projects.filter((project) => projectKey(project) !== excludeKey);
  const pool = candidates.length ? candidates : projects;
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function buildRecentProjects(preferred = [], allProjects = [], spotlight = null, limit = 6) {
  const spotlightKey = projectKey(spotlight);
  const result = [];
  const seen = new Set([spotlightKey]);

  [...preferred, ...allProjects].forEach((project) => {
    const key = projectKey(project);
    if (!key || seen.has(key) || result.length >= limit) return;
    seen.add(key);
    result.push(project);
  });

  return result.length ? result : fallbackProjects.slice(0, limit);
}

function getProjectImage(project = {}) {
  if (project.image) return project.image;
  if (Array.isArray(project.galleryImages) && project.galleryImages.length) return project.galleryImages[0];
  return "profile-photo.webp";
}

function renderSpotlight(project) {
  if (!spotlightProject) return;

  if (!project) {
    spotlightProject.innerHTML = '<div class="spotlight-loading">No project highlight is available yet.</div>';
    return;
  }

  currentSpotlightKey = projectKey(project);
  const projectId = project.id || createSlug(project.title);
  const projectUrl = `project.html?id=${encodeURIComponent(projectId)}`;
  const skills = parseSkills(project.skills).slice(0, 4);
  const archivePosition = Math.max(1, projectArchive.findIndex((item) => projectKey(item) === currentSpotlightKey) + 1);

  spotlightProject.innerHTML = `
    <button class="spotlight-media" type="button" aria-label="Preview ${escapeHtml(project.title)}">
      <img src="${escapeHtml(getProjectImage(project))}" alt="${escapeHtml(project.title)}" loading="eager" decoding="async">
      <span class="spotlight-number">Archive pick ${String(archivePosition).padStart(2, "0")}</span>
    </button>
    <div class="spotlight-copy">
      <div class="spotlight-meta">
        <span>${escapeHtml(project.category || "Selected project")}</span>
        <span>Randomly selected</span>
      </div>
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description || "A selected project from the DesignLab archive.")}</p>
      ${skills.length ? `<div class="spotlight-skills">${skills.map((skill) => `<span>${escapeHtml(skill)}</span>`).join("")}</div>` : ""}
      <div class="spotlight-actions">
        <a class="btn btn-primary" href="${projectUrl}">View case study ↗</a>
        <button class="compact-text-link spotlight-preview" type="button">Quick preview</button>
      </div>
    </div>
  `;

  const previewProject = { ...project, image: getProjectImage(project) };
  spotlightProject.querySelector(".spotlight-media")?.addEventListener("click", () => openModal(previewProject));
  spotlightProject.querySelector(".spotlight-preview")?.addEventListener("click", () => openModal(previewProject));
}

function shuffleSpotlight() {
  if (!projectArchive.length) return;
  const nextProject = chooseRandomProject(projectArchive, currentSpotlightKey);
  renderSpotlight(nextProject);

  if (spotlightProject && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    spotlightProject.animate(
      [
        { opacity: 0.2, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" }
    );
  }
}

spotlightShuffle?.addEventListener("click", shuffleSpotlight);

function getFeaturedProjects(projects = []) {
  return projects
    .filter((project) => isFeatured(project))
    .slice(0, 6);
}

function isFeatured(project) {
  return project.featured === true || String(project.featured).toLowerCase() === "true" || String(project.featured).toLowerCase() === "yes";
}

function renderProjects(projects) {
  projectGrid.innerHTML = "";

  projects.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "project-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Preview ${project.title}`);
    card.innerHTML = `
      <div class="project-thumb">
        <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}" loading="lazy" decoding="async">
      </div>
      <div class="project-info">
        <p class="eyebrow">${String(index + 1).padStart(2, "0")} · ${escapeHtml(project.category || "Project")}</p>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description || "")}</p>
      </div>
    `;

    card.addEventListener("click", () => openModal(project));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openModal(project);
      }
    });
    projectGrid.appendChild(card);
  });
}

function openModal(project) {
  modalImage.src = project.image;
  modalImage.alt = project.title;
  modalCategory.textContent = project.category || "Project";
  modalTitle.textContent = project.title;
  modalDescription.textContent = project.description || "";
  renderSkillTags(modalSkills, project.skills);
  const projectId = project.id || createSlug(project.title);
  modalLink.href = `project.html?id=${encodeURIComponent(projectId)}`;
  if (modalInquiryLink) {
    const params = new URLSearchParams({ source: "project-preview", service: "Similar Project", package: project.title || "Portfolio Project" });
    modalInquiryLink.href = `contact.html?${params.toString()}`;
  }
  modal.classList.add("active");
  document.body.classList.add("modal-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-close-modal]").forEach((element) => {
  element.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (statModal?.classList.contains("active")) {
    closeStatModal();
    return;
  }
  closeModal();
});

function renderSkillTags(container, skills = "") {
  if (!container) return;

  const skillList = parseSkills(skills);
  container.innerHTML = "";

  if (!skillList.length) {
    container.style.display = "none";
    return;
  }

  container.style.display = "flex";

  skillList.forEach((skill) => {
    const tag = document.createElement("span");
    tag.textContent = skill;
    container.appendChild(tag);
  });
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


async function recordVisitor() {
  if (!visitorCountElement) return;

  if (!API_URL || API_URL.includes("PASTE_YOUR")) {
    visitorCountElement.textContent = "—";
    return;
  }

  try {
    const response = await fetch(`${API_URL}?action=recordVisit&t=${Date.now()}`, {
      cache: "no-store"
    });
    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Unable to record visit.");
    }

    visitorCountElement.textContent = Number(data.visits || 0).toLocaleString("en-PH");
  } catch (error) {
    console.error("Visitor counter error:", error);
    visitorCountElement.textContent = "—";
  }
}

loadProjects();
recordVisitor();
