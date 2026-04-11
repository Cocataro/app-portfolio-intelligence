// === Dashboard Module (Pregnancy) ===
var Dashboard = (function() {
  'use strict';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }

  function render() {
    var container = document.getElementById('dashboard-container');
    if (!container) return;

    var dueDate = PregnancyStorage.getDueDate();
    if (!dueDate) {
      container.innerHTML = '<div class="dashboard-hero">' +
        '<h2 class="dashboard-week-label">Set your due date to get started</h2>' +
        '<p style="color:var(--text-secondary);margin-top:0.5rem">Open Settings to enter your expected due date.</p>' +
        '</div>';
      return;
    }

    var week = PregnancyStorage.getCurrentWeek();
    var daysLeft = PregnancyStorage.getDaysUntilDue();
    var trimester = PregnancyStorage.getTrimester();
    var babySizes = APP_CONFIG.babySizes || [];
    var babySize = week > 0 && week <= babySizes.length ? babySizes[week] : '';
    var progress = Math.min(100, Math.round((week / 40) * 100));

    var trimesterColors = ['var(--trimester-1)', 'var(--trimester-2)', 'var(--trimester-3)'];
    var trimesterNames = ['First trimester', 'Second trimester', 'Third trimester'];

    var settings = Storage.getSettings();
    var greeting = settings.userName ? 'Welcome back, ' + escapeHtml(settings.userName) : 'Welcome back';

    // Recent entries summary
    var today = new Date();
    var todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
    var todayEntry = Storage.getEntry(todayStr);
    var entryCount = Storage.getEntryCount();

    // Upcoming appointment
    var appts = PregnancyStorage.getAppointments();
    var nextAppt = null;
    for (var i = 0; i < appts.length; i++) {
      if (appts[i].date >= todayStr) { nextAppt = appts[i]; break; }
    }

    var html = '';

    // Hero: Week number
    html += '<div class="dashboard-hero">' +
      '<p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:0.25rem">' + greeting + '</p>' +
      '<div class="dashboard-week-num">Week ' + week + '</div>' +
      '<div class="dashboard-week-label">' + (babySize ? 'Your baby is about the size of a ' + escapeHtml(babySize.toLowerCase()) : 'of 40') + '</div>' +
      '<span class="dashboard-trimester-badge" style="background:' + trimesterColors[trimester - 1] + ';color:#fff;border-color:' + trimesterColors[trimester - 1] + '">' + trimesterNames[trimester - 1] + '</span>' +
      '</div>';

    // Countdown
    if (daysLeft !== null && daysLeft > 0) {
      html += '<div class="dashboard-countdown">' +
        '<div class="dashboard-countdown-num">' + daysLeft + '</div>' +
        '<div class="dashboard-countdown-label">days until your due date</div>' +
        '</div>';
    } else if (daysLeft !== null && daysLeft <= 0) {
      html += '<div class="dashboard-countdown">' +
        '<div class="dashboard-countdown-num" style="color:var(--milestone)">Due date reached</div>' +
        '<div class="dashboard-countdown-label">Your baby could arrive any time now</div>' +
        '</div>';
    }

    // Progress bar
    html += '<div class="dashboard-progress">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline">' +
        '<span style="font-size:0.9375rem;font-weight:600;color:var(--text)">Pregnancy progress</span>' +
        '<span style="font-size:0.875rem;color:var(--text-secondary)">' + progress + '%</span>' +
      '</div>' +
      '<div class="progress-bar-track">' +
        '<div class="progress-bar-fill" style="width:' + progress + '%;background:linear-gradient(90deg,' + trimesterColors[0] + ',' + trimesterColors[trimester - 1] + ')"></div>' +
      '</div>' +
      '<div class="progress-bar-label"><span>Week 1</span><span>Week 40</span></div>' +
      '</div>';

    // Cards row
    html += '<div class="dashboard-cards">';

    // Today's check-in status
    if (todayEntry) {
      var wellnessLabel = '';
      var levels = APP_CONFIG.wellnessLevels || [];
      for (var j = 0; j < levels.length; j++) {
        if (levels[j].value === todayEntry.feeling) { wellnessLabel = levels[j].label; break; }
      }
      html += '<div class="dashboard-card">' +
        '<div class="dashboard-card-title">Today</div>' +
        '<div class="dashboard-card-value">Feeling: ' + (wellnessLabel || 'Logged') + '</div>' +
        '</div>';
    } else {
      html += '<div class="dashboard-card" style="cursor:pointer" onclick="Navigation.switchTo(\'log\')" role="button" tabindex="0" aria-label="Log how you are feeling today">' +
        '<div class="dashboard-card-title">Today</div>' +
        '<div class="dashboard-card-value" style="color:var(--primary)">Tap to log how you\'re feeling</div>' +
        '</div>';
    }

    // Next appointment
    if (nextAppt) {
      var apptParts = nextAppt.date.split('-');
      var apptDate = new Date(parseInt(apptParts[0]), parseInt(apptParts[1]) - 1, parseInt(apptParts[2]));
      var apptDays = Math.ceil((apptDate.getTime() - today.getTime()) / 86400000);
      html += '<div class="dashboard-card">' +
        '<div class="dashboard-card-title">Next appointment</div>' +
        '<div class="dashboard-card-value">' + escapeHtml(nextAppt.type || 'Visit') + ' &mdash; ' +
        (apptDays === 0 ? 'Today' : apptDays === 1 ? 'Tomorrow' : 'in ' + apptDays + ' days') + '</div>' +
        '</div>';
    }

    // Entry count
    if (entryCount > 0) {
      html += '<div class="dashboard-card">' +
        '<div class="dashboard-card-title">Entries logged</div>' +
        '<div class="dashboard-card-value">' + entryCount + ' day' + (entryCount === 1 ? '' : 's') + ' tracked</div>' +
        '</div>';
    }

    html += '</div>';

    container.innerHTML = html;
  }

  function init() {
    render();
    document.addEventListener('viewchange', function(e) {
      if (e.detail.view === 'home') render();
    });
  }

  return { init: init, render: render };
})();
