const settingsPanel = document.getElementById('settings-modal');
const toggleBtn = document.getElementById('settings-button');
const closeSettingsBtn = document.getElementById('close-settings');

// Show modal with animation
toggleBtn.addEventListener('click', () => {
  settingsPanel.classList.remove('hidden');

  // Allow CSS to apply before adding .show
  setTimeout(() => {
    settingsPanel.classList.add('show');
  }, 10);
});

