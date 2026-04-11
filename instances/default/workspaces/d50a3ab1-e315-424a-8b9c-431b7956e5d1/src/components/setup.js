// === First-Time Setup Module ===
var Setup = (function() {
  'use strict';

  var SETUP_KEY = 'healthtracker_' + APP_CONFIG.variant + '_settings';
  var currentStep = 0;
  var totalSteps = 5;
  var selectedSymptoms = [];
  var userName = '';
  var dueDate = '';

  function isFirstTime() {
    try {
      var raw = localStorage.getItem(SETUP_KEY);
      if (raw) {
        var settings = JSON.parse(raw);
        if (settings.setupComplete) return false;
      }
    } catch (e) { /* treat parse errors as first time */ }
    return true;
  }

  function init(onComplete) {
    if (!isFirstTime()) {
      if (onComplete) onComplete();
      return;
    }

    // Pre-select all default symptoms from config
    selectedSymptoms = (APP_CONFIG.symptoms || []).slice();

    var overlay = document.getElementById('setup-overlay');
    if (!overlay) {
      if (onComplete) onComplete();
      return;
    }

    overlay.removeAttribute('hidden');
    document.body.classList.add('setup-active');

    renderStep(0);
    bindEvents(onComplete);
    updateProgress();

    // Focus first interactive element
    setTimeout(function() {
      var firstBtn = overlay.querySelector('.setup-btn-primary');
      if (firstBtn) firstBtn.focus();
    }, 100);
  }

  function renderStep(step) {
    currentStep = step;
    var container = document.getElementById('setup-step-content');
    if (!container) return;

    var html = '';
    switch (step) {
      case 0:
        html = renderWelcome();
        break;
      case 1:
        html = renderName();
        break;
      case 2:
        html = renderDueDate();
        break;
      case 3:
        html = renderSymptoms();
        break;
      case 4:
        html = renderDone();
        break;
    }

    container.innerHTML = html;
    updateProgress();
    updateButtons();

    // Focus management
    setTimeout(function() {
      var heading = container.querySelector('h2');
      if (heading) heading.focus();
    }, 50);
  }

  function renderWelcome() {
    return '<div class="setup-step setup-welcome">' +
      '<div class="setup-icon" aria-hidden="true">' +
        '<svg viewBox="0 0 48 48" width="64" height="64"><path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm0 36c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z" fill="var(--primary-light)" opacity="0.3"/><path d="M24 8c8.84 0 16 7.16 16 16s-7.16 16-16 16S8 32.84 8 24 15.16 8 24 8z" fill="none" stroke="var(--primary)" stroke-width="2"/><path d="M17 20c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm10 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-11 8s2 4 8 4 8-4 8-4" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round"/></svg>' +
      '</div>' +
      '<h2 tabindex="-1" class="setup-heading">Welcome to ' + escapeHtml(APP_CONFIG.name) + '</h2>' +
      '<p class="setup-text">A private space to track your symptoms, spot patterns, and share insights with your doctor.</p>' +
      '<div class="setup-privacy-badge" role="note">' +
        '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<span>Your data stays on this device. Nothing is sent anywhere.</span>' +
      '</div>' +
    '</div>';
  }

  function renderName() {
    return '<div class="setup-step setup-name">' +
      '<h2 tabindex="-1" class="setup-heading">What should we call you?</h2>' +
      '<p class="setup-text">This is optional and only used to personalize your experience.</p>' +
      '<div class="setup-input-group">' +
        '<label for="setup-name-input" class="sr-only">Your name (optional)</label>' +
        '<input type="text" id="setup-name-input" class="setup-input" placeholder="Your name (optional)" maxlength="30" aria-label="Your name (optional)" value="' + escapeHtml(userName) + '">' +
      '</div>' +
    '</div>';
  }

  function renderDueDate() {
    return '<div class="setup-step setup-due-date">' +
      '<h2 tabindex="-1" class="setup-heading">When is your due date?</h2>' +
      '<p class="setup-text">This helps calculate your trimester and week. You can update it anytime in Settings.</p>' +
      '<div class="setup-input-group">' +
        '<label for="setup-due-date-input" class="sr-only">Expected due date</label>' +
        '<input type="date" id="setup-due-date-input" class="setup-input" aria-label="Expected due date" value="' + escapeHtml(dueDate) + '">' +
      '</div>' +
    '</div>';
  }

  function renderSymptoms() {
    var symptoms = APP_CONFIG.symptoms || [];
    var chips = '';
    for (var i = 0; i < symptoms.length; i++) {
      var s = symptoms[i];
      var isSelected = selectedSymptoms.indexOf(s) !== -1;
      chips += '<button type="button" class="setup-chip' + (isSelected ? ' selected' : '') + '" ' +
        'data-symptom="' + escapeHtml(s) + '" ' +
        'role="checkbox" aria-checked="' + (isSelected ? 'true' : 'false') + '" ' +
        'aria-label="' + escapeHtml(s) + '">' +
        escapeHtml(s) + '</button>';
    }
    return '<div class="setup-step setup-symptoms">' +
      '<h2 tabindex="-1" class="setup-heading">Choose your symptoms</h2>' +
      '<p class="setup-text">Select the symptoms you want to track. You can always change these later in Settings.</p>' +
      '<div class="setup-chip-grid" role="group" aria-label="Symptom selection">' + chips + '</div>' +
      '<p class="setup-hint">' + selectedSymptoms.length + ' of ' + symptoms.length + ' selected</p>' +
    '</div>';
  }

  function renderDone() {
    return '<div class="setup-step setup-done">' +
      '<div class="setup-icon" aria-hidden="true">' +
        '<svg viewBox="0 0 48 48" width="64" height="64"><circle cx="24" cy="24" r="20" fill="var(--success)" opacity="0.15"/><circle cx="24" cy="24" r="20" fill="none" stroke="var(--success)" stroke-width="2"/><path d="M15 24l6 6 12-12" fill="none" stroke="var(--success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '</div>' +
      '<h2 tabindex="-1" class="setup-heading">You\'re all set' + (userName ? ', ' + escapeHtml(userName) : '') + '!</h2>' +
      '<p class="setup-text">Here\'s what you can do:</p>' +
      '<ul class="setup-views-list">' +
        '<li><strong>Log</strong> \u2014 Record symptoms, meds, and how you feel</li>' +
        '<li><strong>Calendar</strong> \u2014 See your history at a glance</li>' +
        '<li><strong>Charts</strong> \u2014 Visualize trends over time</li>' +
        '<li><strong>Insights</strong> \u2014 Spot patterns after 7+ days</li>' +
        '<li><strong>Reports</strong> \u2014 Share data with your doctor</li>' +
      '</ul>' +
    '</div>';
  }

  function updateProgress() {
    var dots = document.querySelectorAll('.setup-progress-dot');
    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === currentStep);
      dot.classList.toggle('completed', i < currentStep);
      dot.setAttribute('aria-current', i === currentStep ? 'step' : 'false');
    });
    var label = document.getElementById('setup-progress-label');
    if (label) label.textContent = 'Step ' + (currentStep + 1) + ' of ' + totalSteps;
  }

  function updateButtons() {
    var backBtn = document.getElementById('setup-back');
    var nextBtn = document.getElementById('setup-next');
    var skipBtn = document.getElementById('setup-skip');

    if (backBtn) {
      if (currentStep === 0) {
        backBtn.setAttribute('hidden', '');
      } else {
        backBtn.removeAttribute('hidden');
      }
    }

    if (nextBtn) {
      if (currentStep === totalSteps - 1) {
        nextBtn.textContent = 'Start Tracking';
        nextBtn.setAttribute('aria-label', 'Start tracking');
      } else {
        nextBtn.textContent = 'Continue';
        nextBtn.setAttribute('aria-label', 'Continue to next step');
      }
    }

    if (skipBtn) {
      if (currentStep === 0 || currentStep === totalSteps - 1) {
        skipBtn.setAttribute('hidden', '');
      } else {
        skipBtn.removeAttribute('hidden');
      }
    }
  }

  function bindEvents(onComplete) {
    var overlay = document.getElementById('setup-overlay');

    // Next button
    var nextBtn = document.getElementById('setup-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        // Save name from step 1
        if (currentStep === 1) {
          var input = document.getElementById('setup-name-input');
          if (input) userName = input.value.trim();
        }
        // Save due date from step 2
        if (currentStep === 2) {
          var dateInput = document.getElementById('setup-due-date-input');
          if (dateInput) dueDate = dateInput.value.trim();
        }

        if (currentStep < totalSteps - 1) {
          renderStep(currentStep + 1);
        } else {
          completeSetup(overlay, onComplete);
        }
      });
    }

    // Back button
    var backBtn = document.getElementById('setup-back');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        if (currentStep === 1) {
          var input = document.getElementById('setup-name-input');
          if (input) userName = input.value.trim();
        }
        if (currentStep === 2) {
          var dateInput = document.getElementById('setup-due-date-input');
          if (dateInput) dueDate = dateInput.value.trim();
        }
        if (currentStep > 0) {
          renderStep(currentStep - 1);
        }
      });
    }

    // Skip button
    var skipBtn = document.getElementById('setup-skip');
    if (skipBtn) {
      skipBtn.addEventListener('click', function() {
        if (currentStep === 1) {
          userName = '';
        }
        if (currentStep === 2) {
          dueDate = '';
        }
        if (currentStep < totalSteps - 1) {
          renderStep(currentStep + 1);
        }
      });
    }

    // Symptom chip clicks (delegated)
    var stepContent = document.getElementById('setup-step-content');
    if (stepContent) {
      stepContent.addEventListener('click', function(e) {
        var chip = e.target.closest('.setup-chip');
        if (!chip) return;
        var symptom = chip.getAttribute('data-symptom');
        if (!symptom) return;

        var idx = selectedSymptoms.indexOf(symptom);
        if (idx !== -1) {
          selectedSymptoms.splice(idx, 1);
          chip.classList.remove('selected');
          chip.setAttribute('aria-checked', 'false');
        } else {
          selectedSymptoms.push(symptom);
          chip.classList.add('selected');
          chip.setAttribute('aria-checked', 'true');
        }

        // Update hint
        var hint = stepContent.querySelector('.setup-hint');
        if (hint) {
          hint.textContent = selectedSymptoms.length + ' of ' + (APP_CONFIG.symptoms || []).length + ' selected';
        }
      });
    }

    // Keyboard: Enter on name input advances
    overlay.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && (e.target.id === 'setup-name-input' || e.target.id === 'setup-due-date-input')) {
        e.preventDefault();
        if (nextBtn) nextBtn.click();
      }
      // Escape goes back (but not on first step)
      if (e.key === 'Escape' && currentStep > 0) {
        if (backBtn) backBtn.click();
      }
    });
  }

  function completeSetup(overlay, onComplete) {
    // Build active symptoms list from selection
    var activeSymptoms = selectedSymptoms.slice();

    // Save settings
    var settings = Storage.getSettings();
    settings.setupComplete = true;
    settings.userName = userName;
    settings.activeSymptoms = activeSymptoms;
    if (dueDate) settings.dueDate = dueDate;
    Storage.saveSettings(settings);

    // Transition out
    overlay.classList.add('setup-fade-out');
    setTimeout(function() {
      overlay.setAttribute('hidden', '');
      overlay.classList.remove('setup-fade-out');
      document.body.classList.remove('setup-active');
      if (onComplete) onComplete();
    }, 300);
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }

  return { init: init, isFirstTime: isFirstTime };
})();
