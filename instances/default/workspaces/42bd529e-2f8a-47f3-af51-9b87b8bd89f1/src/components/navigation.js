// === Navigation Module ===
var Navigation = (function() {
  var currentView = 'log';
  var views = ['log', 'calendar', 'charts', 'insights', 'reports'];

  function switchTo(viewName) {
    if (views.indexOf(viewName) === -1) return;
    currentView = viewName;

    // Update tab buttons
    var buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(function(btn) {
      var isActive = btn.getAttribute('data-view') === viewName;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    // Update view panels
    views.forEach(function(v) {
      var panel = document.getElementById('view-' + v);
      if (panel) {
        if (v === viewName) {
          panel.classList.add('active');
          panel.removeAttribute('hidden');
        } else {
          panel.classList.remove('active');
          panel.setAttribute('hidden', '');
        }
      }
    });

    // Fire custom event for view-specific init
    document.dispatchEvent(new CustomEvent('viewchange', { detail: { view: viewName } }));
  }

  function getCurrentView() {
    return currentView;
  }

  function init() {
    // Relabel nav for habit variant
    if (APP_CONFIG.variant === 'habit') {
      var logBtn = document.getElementById('nav-log');
      if (logBtn) {
        var logLabel = logBtn.querySelector('span');
        if (logLabel) logLabel.textContent = 'Today';
      }
    }

    var buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var view = this.getAttribute('data-view');
        if (view) switchTo(view);
      });

      // Keyboard: Enter activates
      btn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var view = this.getAttribute('data-view');
          if (view) switchTo(view);
        }
        // Arrow keys for tab navigation
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          var idx = views.indexOf(this.getAttribute('data-view'));
          var next = (idx + 1) % views.length;
          var nextBtn = document.querySelector('[data-view="' + views[next] + '"]');
          if (nextBtn) nextBtn.focus();
        }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          var idx2 = views.indexOf(this.getAttribute('data-view'));
          var prev = (idx2 - 1 + views.length) % views.length;
          var prevBtn = document.querySelector('[data-view="' + views[prev] + '"]');
          if (prevBtn) prevBtn.focus();
        }
      });
    });
  }

  return { init: init, switchTo: switchTo, getCurrentView: getCurrentView };
})();
