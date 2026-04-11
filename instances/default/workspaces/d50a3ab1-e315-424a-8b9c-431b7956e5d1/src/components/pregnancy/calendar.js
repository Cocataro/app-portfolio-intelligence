// === Calendar Module (Pregnancy) ===
var Calendar = (function() {
  'use strict';

  var currentMonth = new Date().getMonth();
  var currentYear = new Date().getFullYear();

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function pad(n) { return String(n).padStart(2, '0'); }

  function render() {
    var grid = document.getElementById('cal-grid');
    var label = document.getElementById('cal-month-label');
    if (!grid || !label) return;

    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    label.textContent = monthNames[currentMonth] + ' ' + currentYear;

    var firstDay = new Date(currentYear, currentMonth, 1).getDay();
    var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    var today = todayStr();

    // Get all entries for this month
    var startDate = currentYear + '-' + pad(currentMonth + 1) + '-01';
    var endDate = currentYear + '-' + pad(currentMonth + 1) + '-' + pad(daysInMonth);
    var entries = Storage.getEntriesInRange(startDate, endDate);

    grid.innerHTML = '';

    // Empty cells before first day
    for (var e = 0; e < firstDay; e++) {
      var empty = document.createElement('div');
      empty.className = 'cal-cell cal-empty';
      empty.setAttribute('aria-hidden', 'true');
      grid.appendChild(empty);
    }

    // Day cells
    for (var d = 1; d <= daysInMonth; d++) {
      var dateStr = currentYear + '-' + pad(currentMonth + 1) + '-' + pad(d);
      var cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-cell cal-day';
      cell.setAttribute('aria-label', d + ' ' + monthNames[currentMonth]);

      if (dateStr === today) cell.classList.add('cal-today');

      var entry = entries[dateStr];
      if (entry) {
        cell.classList.add('cal-has-data');
        var feeling = entry.feeling || 0;
        if (feeling >= 1 && feeling <= 4) {
          cell.classList.add('cal-feeling-' + feeling);
          cell.style.setProperty('--cell-bg', 'var(--feeling-' + feeling + ')');
        }
      }

      var dayNum = document.createElement('span');
      dayNum.className = 'cal-day-num';
      dayNum.textContent = d;
      cell.appendChild(dayNum);

      // Dots
      if (entry) {
        var dots = document.createElement('span');
        dots.className = 'cal-dots';
        if (Array.isArray(entry.symptoms) && entry.symptoms.length > 0) {
          var dotS = document.createElement('span');
          dotS.className = 'cal-dot cal-dot-symptom';
          dots.appendChild(dotS);
        }
        if (entry.medications && Object.keys(entry.medications).length > 0) {
          var dotM = document.createElement('span');
          dotM.className = 'cal-dot cal-dot-med';
          dots.appendChild(dotM);
        }
        if (entry.exercise && entry.exercise.type) {
          var dotE = document.createElement('span');
          dotE.className = 'cal-dot cal-dot-exercise';
          dots.appendChild(dotE);
        }
        cell.appendChild(dots);
      }

      (function(ds) {
        cell.addEventListener('click', function() {
          QuickLog.navigateToDate(ds);
        });
      })(dateStr);

      grid.appendChild(cell);
    }
  }

  function init() {
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
    render();
    document.addEventListener('viewchange', function(e) {
      if (e.detail.view === 'calendar') render();
    });
  }

  return { init: init, render: render };
})();
