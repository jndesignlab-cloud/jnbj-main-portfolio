(() => {
  const pickButtons = [...document.querySelectorAll('[data-lab-pick]')];
  const selectedList = document.querySelector('#builderSelected');
  const emptyState = document.querySelector('#builderEmpty');
  const countNode = document.querySelector('#builderCount');
  const clearButton = document.querySelector('#builderClear');
  const inquiryLink = document.querySelector('#builderInquiry');
  const selected = new Map();

  function syncButtons() {
    pickButtons.forEach((button) => {
      const active = selected.has(button.dataset.labPick);
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
      const plus = button.querySelector('b');
      if (plus) plus.textContent = active ? '✓' : '＋';
    });
  }

  function render() {
    if (!selectedList || !countNode || !emptyState || !inquiryLink) return;
    const items = [...selected.entries()];
    countNode.textContent = String(items.length);
    emptyState.hidden = items.length > 0;
    selectedList.innerHTML = items.map(([id, label]) => `
      <li><span>${label}</span><button type="button" data-remove-lab-pick="${id}" aria-label="Remove ${label}">×</button></li>
    `).join('');
    const summary = items.map(([, label]) => label).join(', ');
    const params = new URLSearchParams({ source: 'services-builder' });
    if (summary) params.set('selected', summary);
    inquiryLink.href = `contact.html?${params.toString()}`;
    syncButtons();
  }

  pickButtons.forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const id = button.dataset.labPick;
      const label = button.dataset.labLabel || button.textContent.trim();
      if (selected.has(id)) selected.delete(id); else selected.set(id, label);
      render();
    });
  });

  selectedList?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-remove-lab-pick]');
    if (!button) return;
    selected.delete(button.dataset.removeLabPick);
    render();
  });

  clearButton?.addEventListener('click', () => {
    selected.clear();
    render();
  });

  render();
})();