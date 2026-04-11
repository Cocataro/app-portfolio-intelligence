// === Navigation Module (Pregnancy) ===
var Navigation = (function() {
  'use strict';

  var views = ['home', 'log', 'timeline', 'tools', 'reports'];
  var currentView = 'home';

  function switchTo(viewName) {
    if (views.indexOf(viewName) === -1) return;
    currentView = viewName;

    // Update nav buttons
    var btns = document.querySelectorAll('.nav-btn');
    btns.forEach(function(btn) {
      var v = btn.getAttribute('data-view');
      var isActive = v === viewName;
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

    // Notify listeners
    document.dispatchEvent(new CustomEvent('viewchange', { detail: { view: viewName } }));
  }

  function init() {
    var btns = document.querySelectorAll('.nav-btn');
    btns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var view = this.getAttribute('data-view');
        if (view) switchTo(view);
      });
    });

    // Keyboard nav
    document.addEventListener('keydown', function(e) {
      if (e.target.closest('.settings-overlay, .confirm-overlay, .setup-overlay')) return;
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

      var idx = views.indexOf(currentView);
      if (e.key === 'ArrowLeft' && idx > 0) {
        switchTo(views[idx - 1]);
      } else if (e.key === 'ArrowRight' && idx < views.length - 1) {
        switchTo(views[idx + 1]);
      }
    });
  }

  return { init: init, switchTo: switchTo, getCurrentView: function() { return currentView; } };
})();
