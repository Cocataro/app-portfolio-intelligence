// === Settings Module ===
var Settings = (function() {
  var panel, closeBtn, settingsBtn;

  function open() {
    panel = document.getElementById('settings-panel');
    if (!panel) return;
    panel.removeAttribute('hidden');
    renderCustomLists();
    // Focus the close button
    var close = document.getElementById('settings-close');
    if (close) close.focus();
    // Trap focus inside
    panel.addEventListener('keydown', trapFocus);
  }

  function close() {
    panel = document.getElementById('settings-panel');
    if (!panel) return;
    panel.setAttribute('hidden', '');
    panel.removeEventListener('keydown', trapFocus);
    var btn = document.getElementById('settings-btn');
    if (btn) btn.focus();
  }

  function trapFocus(e) {
    if (e.key === 'Escape') {
      close();
      return;
    }
    if (e.key !== 'Tab') return;
    var focusable = panel.querySelectorAll('button, input, select, [tabindex]:not([tabindex="-1"])');
    if (focusable.length === 0) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function renderCustomLists() {
    var settings = Storage.getSettings();
    renderChipList('custom-symptoms-list', settings.customSymptoms || [], function(items) {
      var s = Storage.getSettings();
      s.customSymptoms = items;
      Storage.saveSettings(s);
    });
    renderChipList('custom-triggers-list', settings.customTriggers || [], function(items) {
      var s = Storage.getSettings();
      s.customTriggers = items;
      Storage.saveSettings(s);
    });
    renderChipList('custom-medications-list', settings.customMedications || [], function(items) {
      var s = Storage.getSettings();
      s.customMedications = items;
      Storage.saveSettings(s);
    });
  }

  function renderChipList(containerId, items, onUpdate) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    items.forEach(function(item, idx) {
      var chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = item;
      var removeBtn = document.createElement('button');
      removeBtn.className = 'remove-chip';
      removeBtn.setAttribute('aria-label', 'Remove ' + item);
      removeBtn.textContent = '\u00d7';
      removeBtn.addEventListener('click', function() {
        items.splice(idx, 1);
        onUpdate(items);
        renderChipList(containerId, items, onUpdate);
      });
      chip.appendChild(removeBtn);
      container.appendChild(chip);
    });
  }

  function addCustomItem(inputId, settingsKey) {
    var input = document.getElementById(inputId);
    if (!input) return;
    var val = input.value.trim();
    if (!val) return;
    var settings = Storage.getSettings();
    if (!settings[settingsKey]) settings[settingsKey] = [];
    if (settings[settingsKey].indexOf(val) !== -1) return; // duplicate
    settings[settingsKey].push(val);
    Storage.saveSettings(settings);
    input.value = '';
    renderCustomLists();
  }

  function showConfirm(title, message, onConfirm) {
    var overlay = document.getElementById('confirm-dialog');
    var titleEl = document.getElementById('confirm-title');
    var msgEl = document.getElementById('confirm-message');
    var cancelBtn = document.getElementById('confirm-cancel');
    var okBtn = document.getElementById('confirm-ok');

    titleEl.textContent = title;
    msgEl.textContent = message;
    overlay.removeAttribute('hidden');
    okBtn.focus();

    function cleanup() {
      overlay.setAttribute('hidden', '');
      cancelBtn.removeEventListener('click', handleCancel);
      okBtn.removeEventListener('click', handleOk);
      overlay.removeEventListener('keydown', handleEscape);
    }
    function handleCancel() { cleanup(); }
    function handleOk() { cleanup(); onConfirm(); }
    function handleEscape(e) { if (e.key === 'Escape') cleanup(); }

    cancelBtn.addEventListener('click', handleCancel);
    okBtn.addEventListener('click', handleOk);
    overlay.addEventListener('keydown', handleEscape);
  }

  function showToast(message) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
    requestAnimationFrame(function() {
      toast.classList.add('visible');
    });
    setTimeout(function() {
      toast.classList.remove('visible');
      setTimeout(function() { toast.remove(); }, 300);
    }, 2500);
  }

  function init() {
    // Open/close settings
    document.getElementById('settings-btn').addEventListener('click', open);
    document.getElementById('settings-close').addEventListener('click', close);

    // Click outside to close
    document.getElementById('settings-panel').addEventListener('click', function(e) {
      if (e.target === document.getElementById('settings-panel')) close();
    });

    // Custom item add buttons
    document.getElementById('add-custom-symptom').addEventListener('click', function() {
      addCustomItem('custom-symptom-input', 'customSymptoms');
    });
    document.getElementById('custom-symptom-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addCustomItem('custom-symptom-input', 'customSymptoms');
    });
    document.getElementById('add-custom-trigger').addEventListener('click', function() {
      addCustomItem('custom-trigger-input', 'customTriggers');
    });
    document.getElementById('custom-trigger-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addCustomItem('custom-trigger-input', 'customTriggers');
    });
    document.getElementById('add-custom-medication').addEventListener('click', function() {
      addCustomItem('custom-medication-input', 'customMedications');
    });
    document.getElementById('custom-medication-input').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addCustomItem('custom-medication-input', 'customMedications');
    });

    // Backup
    document.getElementById('backup-btn').addEventListener('click', function() {
      Storage.downloadBackup();
      showToast('Backup downloaded');
    });

    // Restore
    document.getElementById('restore-btn').addEventListener('click', function() {
      document.getElementById('restore-input').click();
    });
    document.getElementById('restore-input').addEventListener('change', function(e) {
      var file = e.target.files[0];
      if (!file) return;
      Storage.restoreFromFile(file, function(err, count) {
        if (err) {
          showToast('Restore failed: ' + err.message);
        } else {
          showToast('Restored ' + count + ' entries');
        }
        e.target.value = '';
      });
    });

    // Clear all data
    document.getElementById('clear-data-btn').addEventListener('click', function() {
      showConfirm(
        'Clear all data?',
        'This will permanently delete all your tracked entries and settings. This cannot be undone.',
        function() {
          Storage.clearAll();
          showToast('All data cleared');
        }
      );
    });
  }

  return { init: init, showToast: showToast, showConfirm: showConfirm };
})();
