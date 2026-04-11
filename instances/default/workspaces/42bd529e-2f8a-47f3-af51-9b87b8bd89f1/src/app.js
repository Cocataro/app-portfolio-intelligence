// === App Initialization ===
(function() {
  'use strict';

  function init() {
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

  // Boot when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
