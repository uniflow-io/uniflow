/**
 * Settings page functionality
 * Handles API key generation and clipboard operations
 */

class SettingsManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const generateButton = document.getElementById('generateApiKey');
    const copyButton = document.getElementById('copyApiUsage');

    if (generateButton) {
      generateButton.addEventListener('click', (e) => this.onGenerateKey(e));
    }

    if (copyButton) {
      copyButton.addEventListener('click', (e) => this.onCopyApiUsage(e));
    }
  }

  /**
   * Generate a random API key
   */
  onGenerateKey(event) {
    event.preventDefault();

    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let apiKey = '';

    for (let i = 0; i < 32; i++) {
      apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // Update the API key input field
    const apiKeyInput = document.getElementById('settings-apiKeyGenerate');
    if (apiKeyInput) {
      apiKeyInput.value = apiKey;
    }

    // Update the API usage display
    this.updateApiUsageDisplay(apiKey);

    // Update the userSettings.apiKey field (matching TypeScript behavior)
    this.updateUserSettingsApiKey(apiKey);

    // Optional: Show success feedback
    this.showFeedback(event.target, 'Generated!');
  }

  /**
   * Update the userSettings.apiKey field to match TypeScript behavior
   */
  updateUserSettingsApiKey(apiKey) {
    // Find the hidden input field that stores the userSettings.apiKey
    const userSettingsApiKeyField = document.querySelector('input[name="settings[apiKey]"]');
    if (userSettingsApiKeyField) {
      userSettingsApiKeyField.value = apiKey;
    }

    // Also update any data attributes or other fields that might store this value
    const settingsContainer = document.getElementById('settings');
    if (settingsContainer) {
      settingsContainer.dataset.apiKey = apiKey;
    }
  }

  /**
   * Copy API usage command to clipboard
   */
  onCopyApiUsage(event) {
    event.preventDefault();

    const apiUsageDisplay = document.getElementById('settings-apiKey');
    if (apiUsageDisplay && apiUsageDisplay.value) {
      navigator.clipboard.writeText(apiUsageDisplay.value)
        .then(() => {
          this.showFeedback(event.target, 'Copied!');
        })
        .catch((err) => {
          console.error('Failed to copy to clipboard:', err);
          this.showFeedback(event.target, 'Failed!');
        });
    }
  }

  /**
   * Update the API usage display with the generated key
   */
  updateApiUsageDisplay(apiKey) {
    const apiUsageDisplay = document.getElementById('settings-apiKey');
    if (apiUsageDisplay && apiKey) {
      apiUsageDisplay.value = `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${apiKey}`;
    }
  }

  /**
   * Show temporary feedback on button
   */
  showFeedback(button, message) {
    if (!button) return;

    const originalText = button.innerHTML;
    button.innerHTML = message;
    button.disabled = true;

    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    }, 1000);
  }

  /**
   * Get the current API key from the input field
   */
  getCurrentApiKey() {
    const apiKeyInput = document.getElementById('settings-apiKeyGenerate');
    return apiKeyInput ? apiKeyInput.value : '';
  }

  /**
   * Get the API usage command
   */
  getApiUsageCommand() {
    const apiKey = this.getCurrentApiKey();
    if (apiKey) {
      return `node -e "$(curl -s https://uniflow.io/assets/node.js)" - --api-key=${apiKey}`;
    }
    return '';
  }
}

// Initialize settings manager when the DOM element is found
document.addEventListener('DOMContentLoaded', function() {
  const settingsContainer = document.getElementById('settings');
  if (settingsContainer) {
    new SettingsManager();
  }
});

// Export for module usage
export default SettingsManager;
