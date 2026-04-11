// === Storage Module ===
var Storage = (function() {
  var VARIANT = APP_CONFIG.variant;
  var SETTINGS_KEY = 'healthtracker_' + VARIANT + '_settings';
  var ENTRY_PREFIX = 'healthtracker_' + VARIANT + '_';

  function getSettings() {
    try {
      var raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return {
      darkMode: 'auto',
      customSymptoms: [],
      customTriggers: [],
      customMedications: []
    };
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  function entryKey(dateStr) {
    return ENTRY_PREFIX + dateStr;
  }

  function getEntry(dateStr) {
    try {
      var raw = localStorage.getItem(entryKey(dateStr));
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function saveEntry(dateStr, data) {
    try {
      data.timestamp = Date.now();
      localStorage.setItem(entryKey(dateStr), JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Failed to save entry:', e);
      return false;
    }
  }

  function deleteEntry(dateStr) {
    try {
      localStorage.removeItem(entryKey(dateStr));
    } catch (e) { /* ignore */ }
  }

  function getAllEntries() {
    var entries = {};
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf(ENTRY_PREFIX) === 0 && key !== SETTINGS_KEY) {
        var dateStr = key.substring(ENTRY_PREFIX.length);
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          try {
            entries[dateStr] = JSON.parse(localStorage.getItem(key));
          } catch (e) { /* skip corrupt */ }
        }
      }
    }
    return entries;
  }

  function getEntriesInRange(startDate, endDate) {
    var all = getAllEntries();
    var result = {};
    Object.keys(all).forEach(function(dateStr) {
      if (dateStr >= startDate && dateStr <= endDate) {
        result[dateStr] = all[dateStr];
      }
    });
    return result;
  }

  function exportAll() {
    return {
      version: 1,
      variant: VARIANT,
      exportedAt: new Date().toISOString(),
      settings: getSettings(),
      entries: getAllEntries()
    };
  }

  function importAll(data) {
    if (!data || !data.entries || typeof data.entries !== 'object') {
      throw new Error('Invalid backup file: missing entries');
    }
    if (data.settings && typeof data.settings === 'object') {
      saveSettings(data.settings);
    }
    var count = 0;
    Object.keys(data.entries).forEach(function(dateStr) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        saveEntry(dateStr, data.entries[dateStr]);
        count++;
      }
    });
    return count;
  }

  function downloadBackup() {
    var data = exportAll();
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = VARIANT + '-tracker-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function restoreFromFile(file, callback) {
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var data = JSON.parse(e.target.result);
        var count = importAll(data);
        callback(null, count);
      } catch (err) {
        callback(err);
      }
    };
    reader.onerror = function() {
      callback(new Error('Could not read file'));
    };
    reader.readAsText(file);
  }

  function clearAll() {
    var keysToRemove = [];
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.indexOf(ENTRY_PREFIX) === 0) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(function(k) { localStorage.removeItem(k); });
  }

  function getEntryCount() {
    return Object.keys(getAllEntries()).length;
  }

  return {
    getSettings: getSettings,
    saveSettings: saveSettings,
    getEntry: getEntry,
    saveEntry: saveEntry,
    deleteEntry: deleteEntry,
    getAllEntries: getAllEntries,
    getEntriesInRange: getEntriesInRange,
    exportAll: exportAll,
    importAll: importAll,
    downloadBackup: downloadBackup,
    restoreFromFile: restoreFromFile,
    clearAll: clearAll,
    getEntryCount: getEntryCount
  };
})();
