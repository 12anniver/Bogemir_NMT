document.addEventListener('DOMContentLoaded', () => {
  const settingsPanel = document.getElementById('settings-modal');
  const toggleBtn = document.getElementById('settings-button');
  const closeSettingsBtn = document.getElementById('close-settings');

  if (!settingsPanel || !toggleBtn || !closeSettingsBtn) {
    console.error('Settings modal or buttons not found in DOM');
    return;
  }

  // Toggle modal open/close on settings button click
  toggleBtn.addEventListener('click', () => {
    if (settingsPanel.classList.contains('hidden')) {
      // Hide modal
      settingsPanel.classList.remove('hidden');
      setTimeout(() => {
        settingsPanel.classList.add('show');
      }, 400); // match CSS animation duration
    }
  });

  // Close modal on close button click
  closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.classList.remove('show');
    setTimeout(() => {
      settingsPanel.classList.add('hidden');
    }, 400);
  });

  // Close modal on clicking outside of it
  document.addEventListener('click', (e) => {
    if (
      settingsPanel.classList.contains('show') &&
      !settingsPanel.contains(e.target) &&
      e.target !== toggleBtn
    ) {
      settingsPanel.classList.remove('show');
      setTimeout(() => {
        settingsPanel.classList.add('hidden');
      }, 400);
    }
  });

});
