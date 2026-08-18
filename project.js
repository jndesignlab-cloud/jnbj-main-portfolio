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

const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");

const titleElement = document.querySelector("#projectTitle");
const categoryElement = document.querySelector("#projectCategory");
const descriptionElement = document.querySelector("#projectDescription");
const skillsElement = document.querySelector("#projectSkills");
const problemElement = document.querySelector("#projectProblem");
const solutionElement = document.querySelector("#projectSolution");
const outcomeElement = document.querySelector("#projectOutcome");
const externalLink = document.querySelector("#projectExternalLink");
const carouselImage = document.querySelector("#carouselImage");
const slideCounter = document.querySelector("#slideCounter");
const dotsWrapper = document.querySelector("#carouselDots");
const prevButton = document.querySelector("#prevSlide");
const nextButton = document.querySelector("#nextSlide");
const similarProjectCta = document.querySelector("#similarProjectCta");

let gallery = [];
let currentSlide = 0;

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

async function loadProject() {
  let projects = fallbackProjects;

  if (API_URL && !API_URL.includes("PASTE_YOUR")) {
    try {
      const response = await fetch(`${API_URL}?action=listProjects`);
      const data = await response.json();

      if (data.success && Array.isArray(data.projects) && data.projects.length) {
        projects = data.projects;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const project = projects.find((item) => {
    const id = item.id || createSlug(item.title);
    return id === projectId;
  }) || projects[0];

  renderProject(project);
}

function renderProject(project) {
  const projectTitle = project.title || "Untitled Project";
  titleElement.textContent = projectTitle;
  document.title = `${projectTitle} | Jann Nathaniel Jaravata`;
  categoryElement.textContent = project.category || "Project";
  renderSkillTags(skillsElement, project.skills);
  descriptionElement.textContent = project.description || "";
  problemElement.textContent = project.problem || "This project focused on solving a communication, branding, or presentation need through clearer and more strategic visuals.";
  solutionElement.textContent = project.solution || "I handled the design direction, layout structure, visual hierarchy, and final creative execution based on the project requirements.";
  outcomeElement.textContent = project.outcome || "The final output provided a more polished, organized, and professional visual presentation.";

  if (project.link) {
    externalLink.href = project.link;
    externalLink.style.display = "inline-flex";
  } else {
    externalLink.style.display = "none";
  }

  if (similarProjectCta) {
    const inquiryParams = new URLSearchParams({
      source: "project-case-study",
      service: project.category || "General Inquiry",
      package: `Similar to: ${projectTitle}`
    });
    similarProjectCta.href = `contact.html?${inquiryParams.toString()}`;
  }

  gallery = normalizeGallery(project);
  currentSlide = 0;
  renderDots();
  renderSlide();
}



function normalizeGallery(project) {
  if (Array.isArray(project.galleryImages) && project.galleryImages.length) {
    return project.galleryImages.filter(Boolean);
  }

  if (typeof project.galleryImages === "string" && project.galleryImages.trim()) {
    return project.galleryImages
      .split(/\n|,/)
      .map((url) => url.trim())
      .filter(Boolean);
  }

  return [project.image].filter(Boolean);
}

function renderSlide() {
  const image = gallery[currentSlide];

  carouselImage.src = image || "";
  carouselImage.alt = `${titleElement.textContent} preview ${currentSlide + 1}`;
  slideCounter.textContent = `${currentSlide + 1} / ${gallery.length}`;

  prevButton.disabled = gallery.length <= 1;
  nextButton.disabled = gallery.length <= 1;

  document.querySelectorAll(".carousel-dots button").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function renderDots() {
  dotsWrapper.innerHTML = "";

  gallery.forEach((_, index) => {
    const button = document.createElement("button");
    button.setAttribute("aria-label", `Go to image ${index + 1}`);
    button.addEventListener("click", () => {
      currentSlide = index;
      renderSlide();
    });
    dotsWrapper.appendChild(button);
  });
}

prevButton.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + gallery.length) % gallery.length;
  renderSlide();
});

nextButton.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % gallery.length;
  renderSlide();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") prevButton.click();
  if (event.key === "ArrowRight") nextButton.click();
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

loadProject();
