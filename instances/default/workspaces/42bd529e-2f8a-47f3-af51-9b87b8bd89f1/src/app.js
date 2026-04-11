// === App Initialization ===
(function() {
  'use strict';

  function initApp() {
    // Initialize modules in order
    Theme.init();
    Navigation.init();
    Settings.init();
    QuickLog.init();
    Calendar.init();
    Charts.init();
    Insights.init();
    Reports.init();

    // Set initial view
    Navigation.switchTo('log');
  }

  function boot() {
    // Always init theme early so setup overlay gets correct colors
    Theme.init();

    // Check for first-time setup
    Setup.init(function() {
      initApp();
    });
  }

  // Boot when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
