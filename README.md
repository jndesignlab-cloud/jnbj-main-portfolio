<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Jann Jaravata — multidisciplinary graphic designer creating campaigns, publications, websites, and creative systems." />
  <title>Jann Jaravata — Personal Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a href="#top" class="brand">
        <span class="brand-mark">JJ</span>
        <span class="brand-copy">
          <strong>Jann Jaravata</strong>
          <small>Graphic Designer</small>
        </span>
      </a>

      <nav class="nav" id="nav">
        <a href="#top">Home</a>
        <a href="#skills">Skills</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>

      <div class="header-actions">
        <a class="resume-link" href="https://bit.ly/JNBJ-Resume" target="_blank" rel="noreferrer">Résumé</a>
        <a class="contact-button" href="#contact">Let’s Connect</a>
        <button class="menu-button" id="menuButton" aria-expanded="false" aria-controls="nav" aria-label="Toggle menu">
          <span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="hero-section">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">MULTIDISCIPLINARY GRAPHIC DESIGNER</span>
          <h1>Hello, I’m Jann. I design across formats.</h1>
          <p class="hero-summary">
            I create visual identities, social media campaigns, publications, websites,
            and creative systems that make communication clearer, more consistent, and easier to use.
          </p>

          <div class="hero-highlights">
            <span>6+ years experience</span>
            <span>Pangasinan, PH</span>
            <span>Adobe Certified Professional</span>
          </div>

          <div class="hero-actions">
            <a class="primary-button" href="#skills">Explore my skills</a>
            <a class="secondary-link" href="#about">More about me ↘</a>
          </div>
        </div>

        <div class="hero-visual">
          <div class="photo-card">
            <img src="assets/profile-photo.webp" alt="Portrait of Jann Jaravata" />
          </div>
          <div class="info-chip chip-one">
            <strong>Currently</strong>
            <span>Creative Designer at Panpacific University</span>
          </div>
          <div class="info-chip chip-two">
            <strong>Also building</strong>
            <span>DesignLab Creative Studio</span>
          </div>
        </div>
      </div>
    </section>

    <section class="skills-section" id="skills">
      <div class="container">
        <div class="section-head compact-head">
          <div>
            <span class="eyebrow">WHAT I DO</span>
            <h2>Choose the area you want to explore.</h2>
          </div>
          <p>
            Instead of starting with everything at once, this portfolio is organized by capability.
            Pick the skill that matches what you need to see first.
          </p>
        </div>

        <div class="skills-layout">
          <div class="skills-list" role="tablist" aria-label="Portfolio skills">
            <button class="skill-button active" data-skill="branding" role="tab" aria-selected="true">Branding & Visual Identity</button>
            <button class="skill-button" data-skill="social" role="tab" aria-selected="false">Social Media & Campaigns</button>
            <button class="skill-button" data-skill="web" role="tab" aria-selected="false">Web & Digital</button>
            <button class="skill-button" data-skill="print" role="tab" aria-selected="false">Print & Publications</button>
            <button class="skill-button" data-skill="presentation" role="tab" aria-selected="false">Presentation Design</button>
            <button class="skill-button" data-skill="systems" role="tab" aria-selected="false">Creative Systems & Automation</button>
            <button class="skill-button" data-skill="photo" role="tab" aria-selected="false">Photo Editing & Retouching</button>
          </div>

          <div class="skill-panel" id="skillPanel" role="tabpanel" aria-live="polite">
            <div class="panel-topline">SELECTED AREA</div>
            <h3 id="skillTitle">Branding & Visual Identity</h3>
            <p id="skillDescription">
              Logo systems, visual direction, identity extensions, and design decisions that help a brand look clear and cohesive across multiple touchpoints.
            </p>

            <div class="mini-label">Typical outputs</div>
            <div class="tag-list" id="skillTags"></div>

            <div class="mini-label">Relevant project directions</div>
            <div class="related-list" id="skillProjects"></div>

            <div class="panel-footer">
              <span>This section can lead into filtered case studies in the next version.</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about-section" id="about">
      <div class="container about-grid">
        <div class="about-copy">
          <span class="eyebrow">ABOUT ME</span>
          <h2>Straight to the point: I design practical visual communication.</h2>
          <p>
            I’m a Pangasinan-based graphic designer working across campaign design, publications,
            digital interfaces, and reusable creative systems. My work often involves not just making visuals,
            but also organizing information, refining direction, and helping outputs stay consistent.
          </p>
        </div>

        <div class="stats-card">
          <div>
            <small>Role</small>
            <strong>Creative Designer</strong>
          </div>
          <div>
            <small>Practice</small>
            <strong>DesignLab Creative Studio</strong>
          </div>
          <div>
            <small>Tools</small>
            <strong>Photoshop · Figma · Canva · HTML/CSS · Apps Script</strong>
          </div>
          <div>
            <small>Focus</small>
            <strong>Campaigns, publications, web visuals, and creative systems</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-section" id="contact">
      <div class="container contact-card">
        <div>
          <span class="eyebrow light">CONTACT</span>
          <h2>If you want to know what I can do, start with the skill section above — then let’s talk.</h2>
        </div>
        <div class="contact-actions">
          <a class="light-button" href="mailto:hello@madebydesignlab.com">Send an email</a>
          <a class="contact-text-link" href="https://madebydesignlab.com" target="_blank" rel="noreferrer">Visit DesignLab Creative Studio ↗</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <strong>Jann Jaravata</strong>
        <p>Personal portfolio website focused on skills, work direction, and creative practice.</p>
      </div>
      <div class="footer-meta">
        <span>© 2026 Jann Nathaniel Jaravata</span>
        <span>jannjaravata.madebydesignlab.com</span>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
