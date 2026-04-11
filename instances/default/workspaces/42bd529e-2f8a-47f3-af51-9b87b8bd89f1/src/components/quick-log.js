// === Quick Log Module ===
var QuickLog = (function() {
  'use strict';

  var currentDate = '';
  var selectedSymptoms = {};
  var selectedTriggers = [];
  var selectedMeds = {};
  var selectedFeeling = 0;
  var selectedCyclePhase = '';
  var sleepQuality = 0;

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function formatDisplayDate(dateStr) {
    var parts = dateStr.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var today = todayStr();
    var opts = { weekday: 'short', month: 'short', day: 'numeric' };
    var formatted = d.toLocaleDateString(undefined, opts);
    if (dateStr === today) return 'Today — ' + formatted;
    return formatted;
  }

  function shiftDate(dateStr, days) {
    var parts = dateStr.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function setDate(dateStr) {
    currentDate = dateStr;
    var display = document.getElementById('log-date-text');
    if (display) display.textContent = formatDisplayDate(dateStr);
    var picker = document.getElementById('log-date-picker');
    if (picker) picker.value = dateStr;
    loadEntry(dateStr);
  }

  function getAllSymptoms() {
    var base = APP_CONFIG.symptoms || [];
    var settings = Storage.getSettings();
    var custom = settings.customSymptoms || [];
    var all = base.slice();
    custom.forEach(function(s) {
      if (all.indexOf(s) === -1) all.push(s);
    });
    return all;
  }

  function getAllTriggers() {
    var base = APP_CONFIG.triggers || [];
    var settings = Storage.getSettings();
    var custom = settings.customTriggers || [];
    var all = base.slice();
    custom.forEach(function(t) {
      if (all.indexOf(t) === -1) all.push(t);
    });
    return all;
  }

  function getAllMedications() {
    var base = APP_CONFIG.medications || [];
    var settings = Storage.getSettings();
    var custom = settings.customMedications || [];
    var all = base.slice();
    custom.forEach(function(m) {
      if (all.indexOf(m) === -1) all.push(m);
    });
    return all;
  }

  function renderFeelingScale() {
    var container = document.getElementById('feeling-scale');
    if (!container) return;
    container.innerHTML = '';
    var scale = APP_CONFIG.feelingScale || [];
    scale.forEach(function(item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'feeling-btn';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', selectedFeeling === item.value ? 'true' : 'false');
      btn.setAttribute('aria-label', item.label + ' (' + item.value + ' of 5)');
      btn.setAttribute('data-value', item.value);
      if (selectedFeeling === item.value) btn.classList.add('selected');
      btn.style.setProperty('--feeling-color', item.color);

      var num = document.createElement('span');
      num.className = 'feeling-num';
      num.textContent = item.value;
      btn.appendChild(num);

      var label = document.createElement('span');
      label.className = 'feeling-label';
      label.textContent = item.label;
      btn.appendChild(label);

      btn.addEventListener('click', function() {
        if (selectedFeeling === item.value) {
          selectedFeeling = 0;
        } else {
          selectedFeeling = item.value;
        }
        renderFeelingScale();
      });

      container.appendChild(btn);
    });
  }

  function renderSymptomChips() {
    var container = document.getElementById('symptom-chips');
    if (!container) return;
    container.innerHTML = '';
    var symptoms = getAllSymptoms();
    symptoms.forEach(function(name) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = name;
      chip.setAttribute('aria-pressed', selectedSymptoms[name] ? 'true' : 'false');
      if (selectedSymptoms[name]) chip.classList.add('selected');

      chip.addEventListener('click', function() {
        if (selectedSymptoms[name]) {
          delete selectedSymptoms[name];
        } else {
          selectedSymptoms[name] = 'mild';
        }
        renderSymptomChips();
        renderSeverityArea();
      });
      container.appendChild(chip);
    });
  }

  function renderSeverityArea() {
    var area = document.getElementById('symptom-severity-area');
    if (!area) return;
    var names = Object.keys(selectedSymptoms);
    if (names.length === 0) {
      area.setAttribute('hidden', '');
      area.innerHTML = '';
      return;
    }
    area.removeAttribute('hidden');
    area.innerHTML = '';

    names.forEach(function(name) {
      var row = document.createElement('div');
      row.className = 'severity-row';

      var label = document.createElement('span');
      label.className = 'severity-name';
      label.textContent = name;
      row.appendChild(label);

      var btnGroup = document.createElement('div');
      btnGroup.className = 'severity-btns';
      btnGroup.setAttribute('role', 'radiogroup');
      btnGroup.setAttribute('aria-label', name + ' severity');

      ['mild', 'moderate', 'severe'].forEach(function(level) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'severity-btn';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', selectedSymptoms[name] === level ? 'true' : 'false');
        if (selectedSymptoms[name] === level) btn.classList.add('selected');
        btn.textContent = level.charAt(0).toUpperCase() + level.slice(1);
        btn.addEventListener('click', function() {
          selectedSymptoms[name] = level;
          renderSeverityArea();
        });
        btnGroup.appendChild(btn);
      });

      row.appendChild(btnGroup);
      area.appendChild(row);
    });
  }

  function renderTriggerChips() {
    var container = document.getElementById('trigger-chips');
    if (!container) return;
    container.innerHTML = '';
    var triggers = getAllTriggers();
    triggers.forEach(function(name) {
      var chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'chip';
      chip.textContent = name;
      chip.setAttribute('aria-pressed', selectedTriggers.indexOf(name) !== -1 ? 'true' : 'false');
      if (selectedTriggers.indexOf(name) !== -1) chip.classList.add('selected');

      chip.addEventListener('click', function() {
        var idx = selectedTriggers.indexOf(name);
        if (idx !== -1) {
          selectedTriggers.splice(idx, 1);
        } else {
          selectedTriggers.push(name);
        }
        renderTriggerChips();
      });
      container.appendChild(chip);
    });
  }

  function renderMedications() {
    var container = document.getElementById('medication-list');
    if (!container) return;
    container.innerHTML = '';
    var meds = getAllMedications();
    meds.forEach(function(name) {
      var row = document.createElement('div');
      row.className = 'med-row';

      var label = document.createElement('span');
      label.className = 'med-name';
      label.textContent = name;
      row.appendChild(label);

      var btnGroup = document.createElement('div');
      btnGroup.className = 'med-toggle';
      btnGroup.setAttribute('role', 'radiogroup');
      btnGroup.setAttribute('aria-label', name + ' status');

      var currentVal = selectedMeds[name] || '';

      ['taken', 'skipped'].forEach(function(status) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'med-btn';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', currentVal === status ? 'true' : 'false');
        if (currentVal === status) btn.classList.add('selected');
        if (status === 'taken' && currentVal === 'taken') btn.classList.add('med-taken');
        if (status === 'skipped' && currentVal === 'skipped') btn.classList.add('med-skipped');
        btn.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        btn.addEventListener('click', function() {
          if (selectedMeds[name] === status) {
            delete selectedMeds[name];
          } else {
            selectedMeds[name] = status;
          }
          renderMedications();
        });
        btnGroup.appendChild(btn);
      });

      row.appendChild(btnGroup);
      container.appendChild(row);
    });
  }

  function renderMealFields() {
    var container = document.getElementById('meal-fields');
    if (!container) return;
    container.innerHTML = '';
    var meals = APP_CONFIG.mealOptions || [];
    meals.forEach(function(meal) {
      var row = document.createElement('div');
      row.className = 'meal-row';
      var label = document.createElement('label');
      label.setAttribute('for', 'meal-' + meal.toLowerCase());
      label.textContent = meal;
      row.appendChild(label);
      var input = document.createElement('input');
      input.type = 'text';
      input.id = 'meal-' + meal.toLowerCase();
      input.className = 'meal-input';
      input.placeholder = 'What did you have?';
      input.setAttribute('aria-label', meal + ' meal');
      row.appendChild(input);
      container.appendChild(row);
    });
  }

  function renderExerciseType() {
    var select = document.getElementById('exercise-type');
    if (!select) return;
    select.innerHTML = '';
    var opt = document.createElement('option');
    opt.value = '';
    opt.textContent = 'Select type...';
    select.appendChild(opt);
    var types = APP_CONFIG.exerciseTypes || [];
    types.forEach(function(t) {
      var o = document.createElement('option');
      o.value = t;
      o.textContent = t;
      select.appendChild(o);
    });
  }

  function renderCyclePhases() {
    var container = document.getElementById('cycle-chips');
    if (!container) return;
    container.innerHTML = '';
    var phases = APP_CONFIG.cyclePhases || [];
    phases.forEach(function(phase) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', selectedCyclePhase === phase ? 'true' : 'false');
      if (selectedCyclePhase === phase) btn.classList.add('selected');
      btn.textContent = phase;
      btn.addEventListener('click', function() {
        selectedCyclePhase = selectedCyclePhase === phase ? '' : phase;
        renderCyclePhases();
      });
      container.appendChild(btn);
    });
  }

  function renderSleepQuality() {
    var container = document.getElementById('sleep-quality');
    if (!container) return;
    container.innerHTML = '';
    for (var i = 1; i <= 5; i++) {
      (function(val) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quality-btn';
        btn.setAttribute('role', 'radio');
        btn.setAttribute('aria-checked', sleepQuality === val ? 'true' : 'false');
        btn.setAttribute('aria-label', 'Sleep quality ' + val + ' of 5');
        if (sleepQuality === val) btn.classList.add('selected');
        btn.textContent = val;
        btn.addEventListener('click', function() {
          sleepQuality = sleepQuality === val ? 0 : val;
          renderSleepQuality();
        });
        container.appendChild(btn);
      })(i);
    }
  }

  function collectEntry() {
    var entry = {
      feeling: selectedFeeling,
      symptoms: {},
      triggers: selectedTriggers.slice(),
      medications: {},
      meals: {},
      exercise: {},
      cyclePhase: selectedCyclePhase,
      sleep: {},
      notes: ''
    };

    // Symptoms with severity
    entry.symptoms = JSON.parse(JSON.stringify(selectedSymptoms));

    // Medications
    entry.medications = JSON.parse(JSON.stringify(selectedMeds));

    // Meals
    var mealOpts = APP_CONFIG.mealOptions || [];
    mealOpts.forEach(function(meal) {
      var input = document.getElementById('meal-' + meal.toLowerCase());
      if (input && input.value.trim()) {
        entry.meals[meal] = input.value.trim();
      }
    });

    // Exercise
    var exType = document.getElementById('exercise-type');
    var exDur = document.getElementById('exercise-duration');
    if (exType && exType.value) {
      entry.exercise.type = exType.value;
      entry.exercise.duration = exDur ? parseInt(exDur.value) || 0 : 0;
    }

    // Sleep
    var sleepH = document.getElementById('sleep-hours');
    entry.sleep.hours = sleepH ? parseFloat(sleepH.value) || 0 : 0;
    entry.sleep.quality = sleepQuality;

    // Notes
    var notes = document.getElementById('log-notes');
    entry.notes = notes ? notes.value : '';

    return entry;
  }

  function loadEntry(dateStr) {
    // Reset state
    selectedSymptoms = {};
    selectedTriggers = [];
    selectedMeds = {};
    selectedFeeling = 0;
    selectedCyclePhase = '';
    sleepQuality = 0;

    var entry = Storage.getEntry(dateStr);
    if (entry) {
      selectedFeeling = entry.feeling || 0;

      if (entry.symptoms && typeof entry.symptoms === 'object') {
        selectedSymptoms = JSON.parse(JSON.stringify(entry.symptoms));
      }
      if (Array.isArray(entry.triggers)) {
        selectedTriggers = entry.triggers.slice();
      }
      if (entry.medications && typeof entry.medications === 'object') {
        selectedMeds = JSON.parse(JSON.stringify(entry.medications));
      }
      selectedCyclePhase = entry.cyclePhase || '';

      if (entry.sleep) {
        sleepQuality = entry.sleep.quality || 0;
      }
    }

    // Render all sections
    renderFeelingScale();
    renderSymptomChips();
    renderSeverityArea();
    renderTriggerChips();
    renderMedications();
    renderCyclePhases();
    renderSleepQuality();

    // Fill meals
    var mealOpts = APP_CONFIG.mealOptions || [];
    mealOpts.forEach(function(meal) {
      var input = document.getElementById('meal-' + meal.toLowerCase());
      if (input) input.value = (entry && entry.meals && entry.meals[meal]) || '';
    });

    // Fill exercise
    var exType = document.getElementById('exercise-type');
    var exDur = document.getElementById('exercise-duration');
    if (exType) exType.value = (entry && entry.exercise && entry.exercise.type) || '';
    if (exDur) exDur.value = (entry && entry.exercise && entry.exercise.duration) || '';

    // Fill sleep hours
    var sleepH = document.getElementById('sleep-hours');
    if (sleepH) sleepH.value = (entry && entry.sleep && entry.sleep.hours) || '';

    // Fill notes
    var notes = document.getElementById('log-notes');
    if (notes) notes.value = (entry && entry.notes) || '';
  }

  function save() {
    var entry = collectEntry();
    var ok = Storage.saveEntry(currentDate, entry);
    if (ok) {
      var saveBtn = document.getElementById('log-save');
      if (saveBtn) {
        saveBtn.classList.add('save-pulse');
        setTimeout(function() { saveBtn.classList.remove('save-pulse'); }, 600);
      }
      Settings.showToast('Entry saved');
    } else {
      Settings.showToast('Could not save — storage may be full');
    }
  }

  function initCollapsibles() {
    var toggles = document.querySelectorAll('.log-section-toggle');
    toggles.forEach(function(toggle) {
      toggle.addEventListener('click', function() {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        var targetId = this.getAttribute('aria-controls');
        var target = document.getElementById(targetId);
        if (expanded) {
          this.setAttribute('aria-expanded', 'false');
          if (target) target.setAttribute('hidden', '');
        } else {
          this.setAttribute('aria-expanded', 'true');
          if (target) target.removeAttribute('hidden');
        }
      });
    });
  }

  function addCustomSymptomFromLog() {
    var input = document.getElementById('log-custom-symptom');
    if (!input) return;
    var val = input.value.trim();
    if (!val) return;
    var all = getAllSymptoms();
    if (all.indexOf(val) === -1) {
      var settings = Storage.getSettings();
      if (!settings.customSymptoms) settings.customSymptoms = [];
      settings.customSymptoms.push(val);
      Storage.saveSettings(settings);
    }
    // Auto-select the newly added symptom
    if (!selectedSymptoms[val]) {
      selectedSymptoms[val] = 'mild';
    }
    input.value = '';
    renderSymptomChips();
    renderSeverityArea();
  }

  function addCustomTriggerFromLog() {
    var input = document.getElementById('log-custom-trigger');
    if (!input) return;
    var val = input.value.trim();
    if (!val) return;
    var all = getAllTriggers();
    if (all.indexOf(val) === -1) {
      var settings = Storage.getSettings();
      if (!settings.customTriggers) settings.customTriggers = [];
      settings.customTriggers.push(val);
      Storage.saveSettings(settings);
    }
    if (selectedTriggers.indexOf(val) === -1) {
      selectedTriggers.push(val);
    }
    input.value = '';
    renderTriggerChips();
  }

  function init() {
    // Date navigation
    document.getElementById('log-prev-day').addEventListener('click', function() {
      setDate(shiftDate(currentDate, -1));
    });
    document.getElementById('log-next-day').addEventListener('click', function() {
      setDate(shiftDate(currentDate, 1));
    });
    document.getElementById('log-date-display').addEventListener('click', function() {
      var picker = document.getElementById('log-date-picker');
      if (picker) {
        picker.showPicker ? picker.showPicker() : picker.click();
      }
    });
    document.getElementById('log-date-picker').addEventListener('change', function() {
      if (this.value) setDate(this.value);
    });

    // Save
    document.getElementById('log-save').addEventListener('click', save);

    // Custom add buttons
    document.getElementById('log-add-symptom').addEventListener('click', addCustomSymptomFromLog);
    document.getElementById('log-custom-symptom').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addCustomSymptomFromLog();
    });
    document.getElementById('log-add-trigger').addEventListener('click', addCustomTriggerFromLog);
    document.getElementById('log-custom-trigger').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addCustomTriggerFromLog();
    });

    // Collapsibles
    initCollapsibles();

    // Render static elements
    renderMealFields();
    renderExerciseType();

    // Set today and load
    setDate(todayStr());
  }

  function navigateToDate(dateStr) {
    Navigation.switchTo('log');
    setDate(dateStr);
  }

  return { init: init, navigateToDate: navigateToDate };
})();
