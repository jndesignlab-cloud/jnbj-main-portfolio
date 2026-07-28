<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Jann Jaravata — multidisciplinary graphic designer creating campaigns, publications, digital experiences, and creative systems." />
  <title>Jann Jaravata — Personal Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="topbar">
    <div class="shell topbar-inner">
      <a class="brand" href="#top">
        <span class="brand-mark">JJ</span>
        <span>Jann Jaravata</span>
      </a>
      <nav class="desktop-nav" aria-label="Primary navigation">
        <a href="#profile">Profile</a>
        <a href="#skills">Skills</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </nav>
      <div class="top-actions">
        <a class="resume-link" href="https://bit.ly/JNBJ-Resume" target="_blank" rel="noreferrer">Résumé ↗</a>
        <button class="menu-button" id="menuButton" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <main id="top">
    <section class="profile-hero" id="profile">
      <div class="shell">
        <div class="cover">
          <div class="cover-grid"></div>
          <div class="cover-copy">
            <span>PERSONAL PORTFOLIO</span>
            <strong>Visual communication across brand, print, social, and digital work.</strong>
          </div>
          <div class="cover-mark">JNBJ</div>
        </div>

        <div class="identity-row">
          <div class="portrait-wrap">
            <img src="assets/profile-photo.webp" alt="Portrait of Jann Jaravata" />
            <span class="status-dot" title="Available for selected work"></span>
          </div>

          <div class="identity-copy">
            <div class="name-line">
              <div>
                <h1>Jann Nathaniel Jaravata</h1>
                <p>Graphic Designer · Social Media Designer · Creative Developer</p>
              </div>
              <div class="identity-actions">
                <a class="primary-action" href="#skills">Explore Skills</a>
                <a class="secondary-action" href="#contact">Let’s Connect</a>
              </div>
            </div>

            <p class="intro-line">
              Hello, I’m Jann. I design visual identities, campaigns, publications, websites, and creative systems that make communication clearer and easier to use.
            </p>

            <div class="quick-facts">
              <span>📍 Pangasinan, Philippines</span>
              <span>● 6+ years of professional experience</span>
              <span>✦ Adobe Certified Professional</span>
              <span>↗ Founder, DesignLab Creative Studio</span>
            </div>
          </div>
        </div>

        <nav class="profile-tabs" aria-label="Portfolio sections">
          <a class="active" href="#profile">Overview</a>
          <a href="#skills">Skills</a>
          <a href="#about">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </section>

    <section class="content-section" id="skills">
      <div class="shell two-column-layout">
        <aside class="profile-sidebar">
          <section class="sidebar-block">
            <h2>Profile</h2>
            <dl class="profile-details">
              <div>
                <dt>Current role</dt>
                <dd>Creative Designer at Panpacific University</dd>
              </div>
              <div>
                <dt>Independent practice</dt>
                <dd>DesignLab Creative Studio</dd>
              </div>
              <div>
                <dt>Primary tools</dt>
                <dd>Photoshop, Canva, Figma, HTML/CSS, Apps Script</dd>
              </div>
              <div>
                <dt>Working style</dt>
                <dd>Remote, collaborative, deadline-focused</dd>
              </div>
            </dl>
          </section>

          <section class="sidebar-block" id="about">
            <h2>About</h2>
            <p>
              I work across institutional communication, social media design, publications, websites, and practical internal tools. My role often includes content organization, creative direction, refinement, and final delivery.
            </p>
          </section>

          <section class="sidebar-block">
            <h2>Links</h2>
            <div class="link-list">
              <a href="https://madebydesignlab.com" target="_blank" rel="noreferrer">DesignLab Creative Studio <span>↗</span></a>
              <a href="https://bit.ly/JNBJ-Portfolio" target="_blank" rel="noreferrer">Portfolio Archive <span>↗</span></a>
              <a href="https://bit.ly/JNBJ-Resume" target="_blank" rel="noreferrer">Résumé <span>↗</span></a>
            </div>
          </section>
        </aside>

        <div class="profile-main">
          <div class="section-title-row">
            <div>
              <span class="section-kicker">SKILL DIRECTORY</span>
              <h2>What do you need to see?</h2>
            </div>
            <p>Select a skill to view the type of work, outputs, and project directions connected to it.</p>
          </div>

          <div class="skill-directory">
            <div class="skill-nav" role="tablist" aria-label="Skill categories">
              <button class="skill-tab active" data-skill="branding" role="tab" aria-selected="true">
                <span>01</span><strong>Branding & Visual Identity</strong><b>→</b>
              </button>
              <button class="skill-tab" data-skill="social" role="tab" aria-selected="false">
                <span>02</span><strong>Social Media & Campaigns</strong><b>→</b>
              </button>
              <button class="skill-tab" data-skill="web" role="tab" aria-selected="false">
                <span>03</span><strong>Web & Digital</strong><b>→</b>
              </button>
              <button class="skill-tab" data-skill="print" role="tab" aria-selected="false">
                <span>04</span><strong>Print & Publications</strong><b>→</b>
              </button>
              <button class="skill-tab" data-skill="presentation" role="tab" aria-selected="false">
                <span>05</span><strong>Presentation Design</strong><b>→</b>
              </button>
              <button class="skill-tab" data-skill="systems" role="tab" aria-selected="false">
                <span>06</span><strong>Creative Systems & Automation</strong><b>→</b>
              </button>
              <button class="skill-tab" data-skill="photo" role="tab" aria-selected="false">
                <span>07</span><strong>Photo Editing & Retouching</strong><b>→</b>
              </button>
            </div>

            <div class="skill-detail" role="tabpanel" aria-live="polite">
              <div class="detail-heading">
                <span id="skillNumber">01</span>
                <div>
                  <small>SELECTED SKILL</small>
                  <h3 id="skillTitle">Branding & Visual Identity</h3>
                </div>
              </div>

              <p id="skillDescription">
                Logo systems, visual direction, identity extensions, and design decisions that help a brand look clear and cohesive across multiple touchpoints.
              </p>

              <div class="detail-section">
                <h4>Typical outputs</h4>
                <div class="inline-list" id="skillOutputs"></div>
              </div>

              <div class="detail-section">
                <h4>Relevant work</h4>
                <div class="project-lines" id="skillProjects"></div>
              </div>

              <div class="detail-note">
                Project pages will be connected to each skill in the next development stage.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="contact-strip" id="contact">
      <div class="shell contact-strip-inner">
        <div>
          <span>AVAILABLE FOR SELECTED COLLABORATIONS</span>
          <h2>Let’s talk about the kind of work you need.</h2>
        </div>
        <div class="contact-strip-actions">
          <a href="mailto:hello@madebydesignlab.com">Send an email</a>
          <a href="https://madebydesignlab.com" target="_blank" rel="noreferrer">Visit DesignLab ↗</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="shell footer-inner">
      <div>
        <strong>Jann Jaravata</strong>
        <span>Multidisciplinary Graphic Designer</span>
      </div>
      <div>
        <span>© 2026 Jann Nathaniel Jaravata</span>
        <span>jannjaravata.madebydesignlab.com</span>
      </div>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
