// === Theme Module ===
var Theme = (function() {
  var html = document.documentElement;

  function getSystemPreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function apply(mode) {
    var effective;
    if (mode === 'auto') {
      effective = getSystemPreference();
    } else {
      effective = mode;
    }
    html.setAttribute('data-theme', effective);
  }

  function init() {
    var settings = Storage.getSettings();
    var mode = settings.darkMode || 'auto';
    apply(mode);

    // Update select if it exists
    var select = document.getElementById('dark-mode-select');
    if (select) select.value = mode;

    // Listen for system changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
        var current = Storage.getSettings().darkMode || 'auto';
        if (current === 'auto') apply('auto');
      });
    }

    // Theme toggle button (cycles: auto -> light -> dark -> auto)
    var toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function() {
        var s = Storage.getSettings();
        var current = s.darkMode || 'auto';
        var next;
        var currentTheme = html.getAttribute('data-theme');
        if (currentTheme === 'light') {
          next = 'dark';
        } else {
          next = 'light';
        }
        s.darkMode = next;
        Storage.saveSettings(s);
        apply(next);
        var sel = document.getElementById('dark-mode-select');
        if (sel) sel.value = next;
      });
    }

    // Settings dropdown
    var darkSelect = document.getElementById('dark-mode-select');
    if (darkSelect) {
      darkSelect.addEventListener('change', function() {
        var val = this.value;
        var s = Storage.getSettings();
        s.darkMode = val;
        Storage.saveSettings(s);
        apply(val);
      });
    }
  }

  return { init: init, apply: apply };
})();
