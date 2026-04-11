// === Pregnancy Storage Extensions ===
var PregnancyStorage = (function() {
  'use strict';
  var PREFIX = 'healthtracker_pregnancy_';

  function getKey(name) { return PREFIX + name; }

  function getJSON(name) {
    try {
      var raw = localStorage.getItem(getKey(name));
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return null;
  }

  function setJSON(name, data) {
    try {
      localStorage.setItem(getKey(name), JSON.stringify(data));
      return true;
    } catch (e) { return false; }
  }

  // Due date helpers
  function getDueDate() {
    var s = Storage.getSettings();
    return s.dueDate || null;
  }

  function setDueDate(dateStr) {
    var s = Storage.getSettings();
    s.dueDate = dateStr;
    Storage.saveSettings(s);
  }

  function getCurrentWeek() {
    var due = getDueDate();
    if (!due) return 0;
    var parts = due.split('-');
    var dueDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    // Pregnancy is 40 weeks = 280 days
    var conceptionDate = new Date(dueDate.getTime() - 280 * 86400000);
    var daysSince = Math.floor((now.getTime() - conceptionDate.getTime()) / 86400000);
    var week = Math.floor(daysSince / 7) + 1;
    return Math.max(1, Math.min(42, week));
  }

  function getDaysUntilDue() {
    var due = getDueDate();
    if (!due) return null;
    var parts = due.split('-');
    var dueDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return Math.ceil((dueDate.getTime() - now.getTime()) / 86400000);
  }

  function getTrimester() {
    var week = getCurrentWeek();
    if (week <= 13) return 1;
    if (week <= 27) return 2;
    return 3;
  }

  // Appointments
  function getAppointments() {
    return getJSON('appointments') || [];
  }

  function saveAppointments(appts) {
    setJSON('appointments', appts);
  }

  function addAppointment(appt) {
    var appts = getAppointments();
    appt.id = Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
    appts.push(appt);
    appts.sort(function(a, b) { return a.date < b.date ? -1 : 1; });
    saveAppointments(appts);
    return appt;
  }

  function deleteAppointment(id) {
    var appts = getAppointments().filter(function(a) { return a.id !== id; });
    saveAppointments(appts);
  }

  function updateAppointment(id, updates) {
    var appts = getAppointments();
    for (var i = 0; i < appts.length; i++) {
      if (appts[i].id === id) {
        Object.keys(updates).forEach(function(k) { appts[i][k] = updates[k]; });
        break;
      }
    }
    saveAppointments(appts);
  }

  // Kick counter sessions
  function getKickSessions() {
    return getJSON('kicks') || [];
  }

  function saveKickSession(session) {
    var sessions = getKickSessions();
    sessions.unshift(session);
    if (sessions.length > 50) sessions = sessions.slice(0, 50);
    setJSON('kicks', sessions);
  }

  // Contraction sessions
  function getContractionSessions() {
    return getJSON('contractions') || [];
  }

  function saveContractionSession(session) {
    var sessions = getContractionSessions();
    sessions.unshift(session);
    if (sessions.length > 100) sessions = sessions.slice(0, 100);
    setJSON('contractions', sessions);
  }

  // Birth plan
  function getBirthPlan() {
    return getJSON('birthplan') || {};
  }

  function saveBirthPlan(plan) {
    setJSON('birthplan', plan);
  }

  // Hospital bag
  function getHospitalBag() {
    return getJSON('hospitalbag') || {};
  }

  function saveHospitalBag(bag) {
    setJSON('hospitalbag', bag);
  }

  return {
    getDueDate: getDueDate,
    setDueDate: setDueDate,
    getCurrentWeek: getCurrentWeek,
    getDaysUntilDue: getDaysUntilDue,
    getTrimester: getTrimester,
    getAppointments: getAppointments,
    saveAppointments: saveAppointments,
    addAppointment: addAppointment,
    deleteAppointment: deleteAppointment,
    updateAppointment: updateAppointment,
    getKickSessions: getKickSessions,
    saveKickSession: saveKickSession,
    getContractionSessions: getContractionSessions,
    saveContractionSession: saveContractionSession,
    getBirthPlan: getBirthPlan,
    saveBirthPlan: saveBirthPlan,
    getHospitalBag: getHospitalBag,
    saveHospitalBag: saveHospitalBag
  };
})();
