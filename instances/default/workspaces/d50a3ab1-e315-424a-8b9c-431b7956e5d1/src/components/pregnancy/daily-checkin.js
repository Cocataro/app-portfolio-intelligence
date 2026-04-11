// === Daily Check-In Module (Pregnancy Quick Log) ===
var QuickLog = (function() {
  'use strict';

  var currentDate = '';
  var selectedSymptoms = [];
  var selectedTriggers = [];
  var selectedMeds = {};
  var selectedWellness = 0;
  var sleepQuality = 0;

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function formatDisplayDate(dateStr) {
    var parts = dateStr.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var opts = { weekday: 'short', month: 'short', day: 'numeric' };
    var formatted = d.toLocaleDateString(undefined, opts);
    if (dateStr === todayStr()) return 'Today \u2014 ' + formatted;
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
    custom.forEach(function(s) { if (all.indexOf(s) === -1) all.push(s); });
    return all;
  }

  function getAllTriggers() {
    var base = APP_CONFIG.triggers || [];
    var settings = Storage.getSettings();
    var custom = settings.customTriggers || [];
    var all = base.slice();
    custom.forEach(function(t) { if (all.indexOf(t) === -1) all.push(t); });
    return all;
  }

  function getAllMedications() {
    var base = APP_CONFIG.medications || [];
    var settings = Storage.getSettings();
    var custom = settings.customMedications || [];
    var all = base.slice();
    custom.forEach(function(m) { if (all.indexOf(m) === -1) all.push(m); });
    return all;
  }

  function renderWellnessScale() {
    var container = document.getElementById('wellness-scale');
    if (!container) return;
    container.innerHTML = '';
    var levels = APP_CONFIG.wellnessLevels || [];
    var colorMap = {
      great: 'var(--wellness-great)',
      good: 'var(--wellness-good)',
      tough: 'var(--wellness-tough)',
      rough: 'var(--wellness-rough)'
    };
    levels.forEach(function(item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wellness-btn';
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', selectedWellness === item.value ? 'true' : 'false');
      btn.setAttribute('aria-label', item.label);
      btn.setAttribute('data-value', item.value);
      if (selectedWellness === item.value) btn.classList.add('selected');
      var color = colorMap[item.key] || 'var(--primary)';
      btn.style.setProperty('--wellness-color', color);
      btn.textContent = item.label;
      btn.addEventListener('click', function() {
        selectedWellness = selectedWellness === item.value ? 0 : item.value;
        renderWellnessScale();
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
      var isSelected = selectedSymptoms.indexOf(name) !== -1;
      chip.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      if (isSelected) chip.classList.add('selected');
      chip.addEventListener('click', function() {
        var idx = selectedSymptoms.indexOf(name);
        if (idx !== -1) { selectedSymptoms.splice(idx, 1); }
        else { selectedSymptoms.push(name); }
        renderSymptomChips();
      });
      container.appendChild(chip);
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
      var isSelected = selectedTriggers.indexOf(name) !== -1;
      chip.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
      if (isSelected) chip.classList.add('selected');
      chip.addEventListener('click', function() {
        var idx = selectedTriggers.indexOf(name);
        if (idx !== -1) { selectedTriggers.splice(idx, 1); }
        else { selectedTriggers.push(name); }
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
    if (meds.length === 0) {
      container.innerHTML = '<p style="color:var(--text-secondary);font-size:0.875rem">No supplements set up yet. Add them in Settings.</p>';
      return;
    }
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
          if (selectedMeds[name] === status) { delete selectedMeds[name]; }
          else { selectedMeds[name] = status; }
          renderMedications();
        });
        btnGroup.appendChild(btn);
      });
      row.appendChild(btnGroup);
      container.appendChild(row);
    });
  }

  function renderExerciseType() {
    var select = document.getElementById('exercise-type');
    if (!select) return;
    select.innerHTML = '<option value="">Select type...</option>';
    (APP_CONFIG.exerciseTypes || []).forEach(function(t) {
      var o = document.createElement('option');
      o.value = t;
      o.textContent = t;
      select.appendChild(o);
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
      feeling: selectedWellness,
      symptoms: selectedSymptoms.slice(),
      triggers: selectedTriggers.slice(),
      medications: JSON.parse(JSON.stringify(selectedMeds)),
      exercise: {},
      sleep: {},
      notes: ''
    };
    var exType = document.getElementById('exercise-type');
    var exDur = document.getElementById('exercise-duration');
    if (exType && exType.value) {
      entry.exercise.type = exType.value;
      entry.exercise.duration = exDur ? parseInt(exDur.value) || 0 : 0;
    }
    var sleepH = document.getElementById('sleep-hours');
    entry.sleep.hours = sleepH ? parseFloat(sleepH.value) || 0 : 0;
    entry.sleep.quality = sleepQuality;
    var notes = document.getElementById('log-notes');
    entry.notes = notes ? notes.value : '';
    return entry;
  }

  function loadEntry(dateStr) {
    selectedSymptoms = [];
    selectedTriggers = [];
    selectedMeds = {};
    selectedWellness = 0;
    sleepQuality = 0;

    var entry = Storage.getEntry(dateStr);
    if (entry) {
      selectedWellness = entry.feeling || 0;
      if (Array.isArray(entry.symptoms)) selectedSymptoms = entry.symptoms.slice();
      if (Array.isArray(entry.triggers)) selectedTriggers = entry.triggers.slice();
      if (entry.medications && typeof entry.medications === 'object') {
        selectedMeds = JSON.parse(JSON.stringify(entry.medications));
      }
      if (entry.sleep) sleepQuality = entry.sleep.quality || 0;
    }

    renderWellnessScale();
    renderSymptomChips();
    renderTriggerChips();
    renderMedications();
    renderSleepQuality();

    var exType = document.getElementById('exercise-type');
    var exDur = document.getElementById('exercise-duration');
    if (exType) exType.value = (entry && entry.exercise && entry.exercise.type) || '';
    if (exDur) exDur.value = (entry && entry.exercise && entry.exercise.duration) || '';
    var sleepH = document.getElementById('sleep-hours');
    if (sleepH) sleepH.value = (entry && entry.sleep && entry.sleep.hours) || '';
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
      Settings.showToast('Could not save \u2014 storage may be full');
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
    if (selectedSymptoms.indexOf(val) === -1) selectedSymptoms.push(val);
    input.value = '';
    renderSymptomChips();
  }

  function init() {
    document.getElementById('log-prev-day').addEventListener('click', function() { setDate(shiftDate(currentDate, -1)); });
    document.getElementById('log-next-day').addEventListener('click', function() { setDate(shiftDate(currentDate, 1)); });
    document.getElementById('log-date-display').addEventListener('click', function() {
      var picker = document.getElementById('log-date-picker');
      if (picker) { picker.showPicker ? picker.showPicker() : picker.click(); }
    });
    document.getElementById('log-date-picker').addEventListener('change', function() {
      if (this.value) setDate(this.value);
    });
    document.getElementById('log-save').addEventListener('click', save);
    document.getElementById('log-add-symptom').addEventListener('click', addCustomSymptomFromLog);
    document.getElementById('log-custom-symptom').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') addCustomSymptomFromLog();
    });

    initCollapsibles();
    renderExerciseType();
    setDate(todayStr());

    if (Storage.getEntryCount() === 0) {
      var logView = document.querySelector('.quick-log');
      if (logView) {
        var banner = document.createElement('div');
        banner.className = 'welcome-banner';
        banner.id = 'welcome-banner';
        banner.innerHTML = '<h3>Your daily check-in</h3><p>Tap how you\'re feeling, select any symptoms, and save. Takes less than 30 seconds, even on tough morning sickness days.</p>';
        logView.insertBefore(banner, logView.children[1]);
      }
    }
  }

  function navigateToDate(dateStr) {
    Navigation.switchTo('log');
    setDate(dateStr);
  }

  return { init: init, navigateToDate: navigateToDate };
})();
