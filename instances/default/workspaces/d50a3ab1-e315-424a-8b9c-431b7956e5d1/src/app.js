// === App Initialization ===
(function() {
  'use strict';

  function initApp() {
    // Initialize modules in order (Theme.init() already called in boot())
    Navigation.init();
    Settings.init();
    if (typeof Dashboard !== 'undefined') Dashboard.init();
    if (typeof QuickLog !== 'undefined') QuickLog.init();
    if (typeof Timeline !== 'undefined') Timeline.init();
    if (typeof Tools !== 'undefined') Tools.init();
    if (typeof Calendar !== 'undefined') Calendar.init();
    if (typeof Charts !== 'undefined') Charts.init();
    if (typeof Insights !== 'undefined') Insights.init();
    if (typeof Reports !== 'undefined') Reports.init();

    // Set initial view based on variant
    Navigation.switchTo(typeof Dashboard !== 'undefined' ? 'home' : 'log');
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
