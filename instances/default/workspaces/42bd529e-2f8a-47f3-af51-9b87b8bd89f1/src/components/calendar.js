// === Calendar Module ===
var Calendar = (function() {
  'use strict';

  var currentYear = 0;
  var currentMonth = 0; // 0-indexed

  var MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function dateStr(y, m, d) {
    return y + '-' + pad(m + 1) + '-' + pad(d);
  }

  function setMonth(year, month) {
    currentYear = year;
    currentMonth = month;
    render();
  }

  function render() {
    var label = document.getElementById('cal-month-label');
    if (label) label.textContent = MONTH_NAMES[currentMonth] + ' ' + currentYear;

    var grid = document.getElementById('cal-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Get month range
    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Get entries for the month
    var startStr = dateStr(currentYear, currentMonth, 1);
    var endStr = dateStr(currentYear, currentMonth, daysInMonth);
    var entries = Storage.getEntriesInRange(startStr, endStr);

    // Today string for highlighting
    var today = new Date();
    var todayStr = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());

    // Empty cells for days before month starts
    for (var e = 0; e < firstDay; e++) {
      var empty = document.createElement('div');
      empty.className = 'cal-cell cal-empty';
      empty.setAttribute('aria-hidden', 'true');
      grid.appendChild(empty);
    }

    // Day cells
    for (var d = 1; d <= daysInMonth; d++) {
      var ds = dateStr(currentYear, currentMonth, d);
      var entry = entries[ds];
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-cell cal-day';
      cell.setAttribute('aria-label', formatCellLabel(d, entry));

      if (ds === todayStr) cell.classList.add('cal-today');

      // Color by feeling
      if (entry && entry.feeling) {
        cell.classList.add('cal-feeling-' + entry.feeling);
        cell.style.setProperty('--cell-bg', 'var(--feeling-' + entry.feeling + ')');
      }

      if (entry) cell.classList.add('cal-has-data');

      var dayNum = document.createElement('span');
      dayNum.className = 'cal-day-num';
      dayNum.textContent = d;
      cell.appendChild(dayNum);

      // Dot indicators
      if (entry) {
        var dots = document.createElement('div');
        dots.className = 'cal-dots';
        dots.setAttribute('aria-hidden', 'true');

        var hasSymptoms = entry.symptoms && Object.keys(entry.symptoms).length > 0;
        var hasMeds = entry.medications && Object.keys(entry.medications).length > 0;
        var hasExercise = entry.exercise && entry.exercise.type;

        if (hasSymptoms) {
          var dot = document.createElement('span');
          dot.className = 'cal-dot cal-dot-symptom';
          dots.appendChild(dot);
        }
        if (hasMeds) {
          var dot2 = document.createElement('span');
          dot2.className = 'cal-dot cal-dot-med';
          dots.appendChild(dot2);
        }
        if (hasExercise) {
          var dot3 = document.createElement('span');
          dot3.className = 'cal-dot cal-dot-exercise';
          dots.appendChild(dot3);
        }
        if (dots.children.length > 0) cell.appendChild(dots);
      }

      (function(date) {
        cell.addEventListener('click', function() {
          QuickLog.navigateToDate(date);
        });
      })(ds);

      grid.appendChild(cell);
    }
  }

  function formatCellLabel(day, entry) {
    var parts = [MONTH_NAMES[currentMonth] + ' ' + day];
    if (entry) {
      if (entry.feeling) {
        var scale = APP_CONFIG.feelingScale || [];
        var f = scale.find(function(s) { return s.value === entry.feeling; });
        if (f) parts.push('Feeling: ' + f.label);
      }
      var sympCount = entry.symptoms ? Object.keys(entry.symptoms).length : 0;
      if (sympCount) parts.push(sympCount + ' symptom' + (sympCount > 1 ? 's' : ''));
    } else {
      parts.push('No entry');
    }
    return parts.join(', ');
  }

  function init() {
    var today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth();

    document.getElementById('cal-prev').addEventListener('click', function() {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      render();
    });

    document.getElementById('cal-next').addEventListener('click', function() {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      render();
    });

    // Re-render when switching to calendar view
    document.addEventListener('viewchange', function(e) {
      if (e.detail && e.detail.view === 'calendar') render();
    });

    render();
  }

  return { init: init, render: render };
})();
