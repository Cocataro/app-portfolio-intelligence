// === Calendar Module ===
var Calendar = (function() {
  'use strict';

  var currentYear = 0;
  var currentMonth = 0; // 0-indexed

  var isHabit = APP_CONFIG.variant === 'habit';

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

      if (entry) cell.classList.add('cal-has-data');

      // Color by habit completion (habit variant) or feeling (other variants)
      if (isHabit && entry && entry.medications && typeof entry.medications === 'object') {
        var totalHabits = Object.keys(entry.medications).length;
        var doneHabits = 0;
        Object.keys(entry.medications).forEach(function(m) {
          if (entry.medications[m] === 'taken') doneHabits++;
        });
        if (totalHabits > 0) {
          var pct = doneHabits / totalHabits;
          var hColor = pct === 0 ? 'var(--heatmap-empty)' : pct < 0.4 ? 'var(--heatmap-low)' : pct < 0.7 ? 'var(--heatmap-mid)' : pct < 1 ? 'var(--heatmap-high)' : 'var(--heatmap-full)';
          cell.style.setProperty('--cell-bg', hColor);
          cell.classList.add('cal-habit-filled');
        }
      } else if (!isHabit && entry && entry.feeling) {
        cell.classList.add('cal-feeling-' + entry.feeling);
        cell.style.setProperty('--cell-bg', 'var(--feeling-' + entry.feeling + ')');
      }

      var dayNum = document.createElement('span');
      dayNum.className = 'cal-day-num';
      dayNum.textContent = d;
      cell.appendChild(dayNum);

      // Dot indicators
      if (entry) {
        var dots = document.createElement('div');
        dots.className = 'cal-dots';
        dots.setAttribute('aria-hidden', 'true');

        if (isHabit) {
          // For habit variant: show dots for symptoms and feeling
          var hasSymptoms = entry.symptoms && Object.keys(entry.symptoms).length > 0;
          var hasFeeling = entry.feeling > 0;

          if (hasSymptoms) {
            var dotS = document.createElement('span');
            dotS.className = 'cal-dot cal-dot-symptom';
            dots.appendChild(dotS);
          }
          if (hasFeeling) {
            var dotF = document.createElement('span');
            dotF.className = 'cal-dot cal-dot-exercise';
            dots.appendChild(dotF);
          }
        } else {
          var hasSymptoms2 = entry.symptoms && Object.keys(entry.symptoms).length > 0;
          var hasMeds = entry.medications && Object.keys(entry.medications).length > 0;
          var hasExercise = entry.exercise && entry.exercise.type;

          if (hasSymptoms2) {
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
      if (isHabit && entry.medications && typeof entry.medications === 'object') {
        var total = Object.keys(entry.medications).length;
        var done = 0;
        Object.keys(entry.medications).forEach(function(m) {
          if (entry.medications[m] === 'taken') done++;
        });
        if (total > 0) parts.push(done + ' of ' + total + ' habits (' + Math.round(done / total * 100) + '%)');
      }
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

    // Update legend for habit variant
    if (isHabit) {
      var feelingLegend = document.querySelector('.cal-legend:not(.cal-legend-dots)');
      if (feelingLegend) {
        feelingLegend.innerHTML = '<span class="cal-legend-label">Completion:</span>' +
          '<span class="cal-legend-item" style="--dot-color: var(--heatmap-empty)">None</span>' +
          '<span class="cal-legend-item" style="--dot-color: var(--heatmap-low)">Low</span>' +
          '<span class="cal-legend-item" style="--dot-color: var(--heatmap-mid)">Half</span>' +
          '<span class="cal-legend-item" style="--dot-color: var(--heatmap-high)">Most</span>' +
          '<span class="cal-legend-item" style="--dot-color: var(--heatmap-full)">All</span>';
      }
      var dotLegend = document.querySelector('.cal-legend-dots');
      if (dotLegend) {
        dotLegend.innerHTML = '<span class="cal-legend-label">Dots:</span>' +
          '<span class="cal-legend-dot-item"><span class="cal-dot cal-dot-symptom"></span>Symptoms</span>' +
          '<span class="cal-legend-dot-item"><span class="cal-dot cal-dot-exercise"></span>Feeling</span>';
      }
    }

    document.getElementById('cal-prev').addEventListener('click', function() {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      render();
    });

    document.getElementById('cal-next').addEventListener('click', function() {
      var now = new Date();
      var nextMonth = currentMonth + 1;
      var nextYear = currentYear;
      if (nextMonth > 11) { nextMonth = 0; nextYear++; }
      if (nextYear > now.getFullYear() || (nextYear === now.getFullYear() && nextMonth > now.getMonth())) return;
      currentMonth = nextMonth;
      currentYear = nextYear;
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
