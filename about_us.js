document.addEventListener('DOMContentLoaded', () => {
  const helpBtn = document.getElementById('help-button');
  const aboutModal = document.getElementById('about-modal');
  const aboutCloseBtn = document.getElementById('about-close');

  helpBtn.addEventListener('click', () => {
    aboutModal.classList.remove('hidden');
    requestAnimationFrame(() => {
      aboutModal.classList.add('show');
      aboutModal.setAttribute('aria-hidden', 'false');
      aboutCloseBtn.focus();
    });
  });

  aboutCloseBtn.addEventListener('click', closeAboutModal);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aboutModal.classList.contains('show')) {
      closeAboutModal();
    }
  });

  function closeAboutModal() {
    aboutModal.classList.remove('show');
    aboutModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      aboutModal.classList.add('hidden');
      helpBtn.focus();
    }, 300);
  }
});
