(() => {
  const CONTACT_DETAILS = {
    email: 'jannjaravata@gmail.com',
    phone: '+63 926 069 7158',
    phoneHref: '+639260697158',
    location: 'Pangasinan, Philippines',
    linkedin: 'https://www.linkedin.com/in/jaenjaravata',
    facebook: 'https://www.facebook.com/DesignLabCreativeStudio',
    designlab: 'https://www.madebydesignlab.com'
  };

  let lastFocusedElement = null;

  function createModal() {
    const wrapper = document.createElement('div');
    wrapper.className = 'contact-modal';
    wrapper.id = 'contactModal';
    wrapper.setAttribute('aria-hidden', 'true');

    wrapper.innerHTML = `
      <button
        class="contact-modal-backdrop"
        type="button"
        aria-label="Close contact details"
        data-contact-close></button>

      <section
        class="contact-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contactModalTitle">

        <header class="contact-dialog-header">
          <div>
            <span>CONTACT DETAILS</span>
            <h2 id="contactModalTitle">Let’s get in touch.</h2>
          </div>

          <button
            class="contact-dialog-close"
            type="button"
            aria-label="Close contact details"
            data-contact-close>×</button>
        </header>

        <p class="contact-dialog-intro">
          For freelance work, collaborations, or professional opportunities,
          send me an email or use any of the contact details below.
        </p>

        <dl class="contact-detail-list">
          <div>
            <dt>Email</dt>
            <dd>
              <a href="mailto:${CONTACT_DETAILS.email}">
                ${CONTACT_DETAILS.email}
              </a>
            </dd>
          </div>

          <div>
            <dt>Mobile</dt>
            <dd>
              <a href="tel:${CONTACT_DETAILS.phoneHref}">
                ${CONTACT_DETAILS.phone}
              </a>
            </dd>
          </div>

          <div>
            <dt>Location</dt>
            <dd>${CONTACT_DETAILS.location}</dd>
          </div>

          <div>
            <dt>LinkedIn</dt>
            <dd>
              <a href="${CONTACT_DETAILS.linkedin}" target="_blank" rel="noopener noreferrer">
                linkedin.com/in/jaenjaravata ↗
              </a>
            </dd>
          </div>

          <div>
            <dt>DesignLab</dt>
            <dd>
              <a href="${CONTACT_DETAILS.designlab}" target="_blank" rel="noopener noreferrer">
                madebydesignlab.com ↗
              </a>
            </dd>
          </div>

          <div>
            <dt>Facebook</dt>
            <dd>
              <a href="${CONTACT_DETAILS.facebook}" target="_blank" rel="noopener noreferrer">
                DesignLab Creative Studio ↗
              </a>
            </dd>
          </div>
        </dl>

        <div class="contact-dialog-actions">
          <a class="contact-email-cta" href="mailto:${CONTACT_DETAILS.email}">
            Send an Email ↗
          </a>
          <button type="button" data-contact-close>Close</button>
        </div>
      </section>
    `;

    document.body.appendChild(wrapper);
    return wrapper;
  }

  const modal = document.getElementById('contactModal') || createModal();

  function openContactModal(trigger) {
    lastFocusedElement = trigger || document.activeElement;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('contact-modal-open');

    window.setTimeout(() => {
      modal.querySelector('.contact-dialog-close')?.focus();
    }, 20);
  }

  function closeContactModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('contact-modal-open');
    lastFocusedElement?.focus();
  }

  document.addEventListener('click', event => {
    const openTrigger = event.target.closest('[data-contact-open]');
    if (openTrigger) {
      event.preventDefault();
      openContactModal(openTrigger);
      return;
    }

    if (event.target.closest('[data-contact-close]')) {
      event.preventDefault();
      closeContactModal();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) {
      closeContactModal();
    }
  });
})();
