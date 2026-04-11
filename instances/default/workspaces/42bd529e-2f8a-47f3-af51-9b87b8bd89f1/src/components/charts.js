// === Charts Module ===
var Charts = (function() {
  'use strict';

  var activeRange = '30d';
  var customStart = '';
  var customEnd = '';

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function subtractDays(dateStr, days) {
    var parts = dateStr.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    d.setDate(d.getDate() - days);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function getDateRange() {
    var end = todayStr();
    var start;
    if (activeRange === 'custom' && customStart && customEnd) {
      start = customStart;
      end = customEnd;
    } else if (activeRange === '7d') {
      start = subtractDays(end, 6);
    } else if (activeRange === '90d') {
      start = subtractDays(end, 89);
    } else {
      start = subtractDays(end, 29);
    }
    return { start: start, end: end };
  }

  function getDatesInRange(start, end) {
    var dates = [];
    var parts = start.split('-');
    var current = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var eParts = end.split('-');
    var endDate = new Date(parseInt(eParts[0]), parseInt(eParts[1]) - 1, parseInt(eParts[2]));
    while (current <= endDate) {
      dates.push(current.getFullYear() + '-' + String(current.getMonth() + 1).padStart(2, '0') + '-' + String(current.getDate()).padStart(2, '0'));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }

  function formatShortDate(dateStr) {
    var parts = dateStr.split('-');
    return parseInt(parts[1]) + '/' + parseInt(parts[2]);
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --- SVG Chart Builders ---

  function buildFeelingChart(entries, dates) {
    var points = [];
    var dataPoints = [];
    dates.forEach(function(d, i) {
      var entry = entries[d];
      if (entry && entry.feeling > 0) {
        dataPoints.push({ idx: i, date: d, val: entry.feeling });
      }
    });
    if (dataPoints.length < 2) {
      return '<div class="chart-empty" role="img" aria-label="Not enough data for feeling trend">Log at least 2 days to see your feeling trend.</div>';
    }

    var w = 100;
    var h = 40;
    var padX = 8;
    var padY = 4;
    var plotW = w - padX * 2;
    var plotH = h - padY * 2;
    var maxIdx = dates.length - 1;

    dataPoints.forEach(function(dp) {
      var x = padX + (maxIdx > 0 ? (dp.idx / maxIdx) * plotW : plotW / 2);
      var y = padY + plotH - ((dp.val - 1) / 4) * plotH;
      points.push(x.toFixed(1) + ',' + y.toFixed(1));
    });

    var feelingColors = ['', 'var(--feeling-1)', 'var(--feeling-2)', 'var(--feeling-3)', 'var(--feeling-4)', 'var(--feeling-5)'];

    var svg = '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Feeling trend over time">';
    // Grid lines
    for (var g = 1; g <= 5; g++) {
      var gy = padY + plotH - ((g - 1) / 4) * plotH;
      svg += '<line x1="' + padX + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padX) + '" y2="' + gy.toFixed(1) + '" stroke="var(--border)" stroke-width="0.3" stroke-dasharray="1,1"/>';
    }
    // Line
    svg += '<polyline points="' + points.join(' ') + '" fill="none" stroke="var(--primary)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>';
    // Dots
    dataPoints.forEach(function(dp) {
      var x = padX + (maxIdx > 0 ? (dp.idx / maxIdx) * plotW : plotW / 2);
      var y = padY + plotH - ((dp.val - 1) / 4) * plotH;
      svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.2" fill="' + feelingColors[dp.val] + '" stroke="var(--surface)" stroke-width="0.3"/>';
    });
    svg += '</svg>';

    // Y-axis labels
    var labels = '<div class="chart-y-labels" aria-hidden="true"><span>Great</span><span>Good</span><span>Steady</span><span>Okay</span><span>Rough</span></div>';

    // Accessible table
    var table = '<table class="sr-only"><caption>Feeling trend data</caption><thead><tr><th>Date</th><th>Feeling</th></tr></thead><tbody>';
    dataPoints.forEach(function(dp) {
      var scale = APP_CONFIG.feelingScale || [];
      var label = dp.val;
      scale.forEach(function(s) { if (s.value === dp.val) label = s.label + ' (' + dp.val + ')'; });
      table += '<tr><td>' + escapeHtml(dp.date) + '</td><td>' + escapeHtml(label) + '</td></tr>';
    });
    table += '</tbody></table>';

    return '<div class="chart-wrapper chart-line-wrapper">' + labels + svg + '</div>' + table;
  }

  function buildSymptomChart(entries) {
    var counts = {};
    Object.keys(entries).forEach(function(d) {
      var e = entries[d];
      if (e.symptoms && typeof e.symptoms === 'object') {
        Object.keys(e.symptoms).forEach(function(s) {
          counts[s] = (counts[s] || 0) + 1;
        });
      }
    });

    var sorted = Object.keys(counts).map(function(s) { return { name: s, count: counts[s] }; });
    sorted.sort(function(a, b) { return b.count - a.count; });
    sorted = sorted.slice(0, 10);

    if (sorted.length === 0) {
      return '<div class="chart-empty" role="img" aria-label="No symptom data">No symptoms logged yet.</div>';
    }

    var maxCount = sorted[0].count;
    var barH = 6;
    var gap = 3;
    var padL = 2;
    var w = 100;
    var h = sorted.length * (barH + gap) + gap;
    var barArea = w - padL - 4;

    var svg = '<svg class="chart-svg chart-bar-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Symptom frequency chart">';
    sorted.forEach(function(item, i) {
      var y = gap + i * (barH + gap);
      var barW = maxCount > 0 ? (item.count / maxCount) * barArea : 0;
      svg += '<rect x="' + padL + '" y="' + y + '" width="' + barW.toFixed(1) + '" height="' + barH + '" rx="1" fill="var(--primary)" opacity="' + (0.6 + 0.4 * (item.count / maxCount)).toFixed(2) + '"/>';
      svg += '<text x="' + (padL + barW + 1.5).toFixed(1) + '" y="' + (y + barH * 0.75).toFixed(1) + '" class="chart-bar-count">' + item.count + '</text>';
    });
    svg += '</svg>';

    var labels = '<div class="chart-h-labels" aria-hidden="true">';
    sorted.forEach(function(item) {
      labels += '<span class="chart-h-label">' + escapeHtml(item.name) + '</span>';
    });
    labels += '</div>';

    var table = '<table class="sr-only"><caption>Symptom frequency</caption><thead><tr><th>Symptom</th><th>Days logged</th></tr></thead><tbody>';
    sorted.forEach(function(item) {
      table += '<tr><td>' + escapeHtml(item.name) + '</td><td>' + item.count + '</td></tr>';
    });
    table += '</tbody></table>';

    return '<div class="chart-wrapper chart-hbar-wrapper">' + labels + svg + '</div>' + table;
  }

  function buildTriggerChart(entries) {
    var counts = {};
    Object.keys(entries).forEach(function(d) {
      var e = entries[d];
      if (Array.isArray(e.triggers)) {
        e.triggers.forEach(function(t) {
          counts[t] = (counts[t] || 0) + 1;
        });
      }
    });

    var sorted = Object.keys(counts).map(function(t) { return { name: t, count: counts[t] }; });
    sorted.sort(function(a, b) { return b.count - a.count; });
    sorted = sorted.slice(0, 10);

    if (sorted.length === 0) {
      return '<div class="chart-empty" role="img" aria-label="No trigger data">No triggers logged yet.</div>';
    }

    var maxCount = sorted[0].count;
    var barH = 6;
    var gap = 3;
    var padL = 2;
    var w = 100;
    var h = sorted.length * (barH + gap) + gap;
    var barArea = w - padL - 4;

    var svg = '<svg class="chart-svg chart-bar-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Trigger frequency chart">';
    sorted.forEach(function(item, i) {
      var y = gap + i * (barH + gap);
      var barW = maxCount > 0 ? (item.count / maxCount) * barArea : 0;
      svg += '<rect x="' + padL + '" y="' + y + '" width="' + barW.toFixed(1) + '" height="' + barH + '" rx="1" fill="var(--accent)" opacity="' + (0.6 + 0.4 * (item.count / maxCount)).toFixed(2) + '"/>';
      svg += '<text x="' + (padL + barW + 1.5).toFixed(1) + '" y="' + (y + barH * 0.75).toFixed(1) + '" class="chart-bar-count">' + item.count + '</text>';
    });
    svg += '</svg>';

    var labels = '<div class="chart-h-labels" aria-hidden="true">';
    sorted.forEach(function(item) {
      labels += '<span class="chart-h-label">' + escapeHtml(item.name) + '</span>';
    });
    labels += '</div>';

    var table = '<table class="sr-only"><caption>Trigger frequency</caption><thead><tr><th>Trigger</th><th>Days logged</th></tr></thead><tbody>';
    sorted.forEach(function(item) {
      table += '<tr><td>' + escapeHtml(item.name) + '</td><td>' + item.count + '</td></tr>';
    });
    table += '</tbody></table>';

    return '<div class="chart-wrapper chart-hbar-wrapper">' + labels + svg + '</div>' + table;
  }

  function buildSleepChart(entries, dates) {
    var dataPoints = [];
    dates.forEach(function(d, i) {
      var entry = entries[d];
      if (entry && entry.sleep && entry.sleep.hours > 0) {
        dataPoints.push({ idx: i, date: d, hours: entry.sleep.hours, quality: entry.sleep.quality || 0 });
      }
    });

    if (dataPoints.length < 2) {
      return '<div class="chart-empty" role="img" aria-label="Not enough sleep data">Log at least 2 days of sleep to see trends.</div>';
    }

    var w = 100;
    var h = 40;
    var padX = 8;
    var padY = 4;
    var plotW = w - padX * 2;
    var plotH = h - padY * 2;
    var maxIdx = dates.length - 1;
    var maxH = 12;

    var points = [];
    dataPoints.forEach(function(dp) {
      var x = padX + (maxIdx > 0 ? (dp.idx / maxIdx) * plotW : plotW / 2);
      var y = padY + plotH - (Math.min(dp.hours, maxH) / maxH) * plotH;
      points.push(x.toFixed(1) + ',' + y.toFixed(1));
    });

    var qualityColors = ['var(--text-secondary)', 'var(--feeling-1)', 'var(--feeling-2)', 'var(--feeling-3)', 'var(--feeling-4)', 'var(--feeling-5)'];

    var svg = '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Sleep trend over time">';
    // Grid lines at 4h, 8h, 12h
    [4, 8, 12].forEach(function(hr) {
      var gy = padY + plotH - (hr / maxH) * plotH;
      svg += '<line x1="' + padX + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padX) + '" y2="' + gy.toFixed(1) + '" stroke="var(--border)" stroke-width="0.3" stroke-dasharray="1,1"/>';
    });
    svg += '<polyline points="' + points.join(' ') + '" fill="none" stroke="var(--primary-light)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>';
    dataPoints.forEach(function(dp) {
      var x = padX + (maxIdx > 0 ? (dp.idx / maxIdx) * plotW : plotW / 2);
      var y = padY + plotH - (Math.min(dp.hours, maxH) / maxH) * plotH;
      var color = qualityColors[dp.quality] || qualityColors[0];
      svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.2" fill="' + color + '" stroke="var(--surface)" stroke-width="0.3"/>';
    });
    svg += '</svg>';

    var labels = '<div class="chart-y-labels" aria-hidden="true"><span>12h</span><span>8h</span><span>4h</span><span>0h</span></div>';

    var table = '<table class="sr-only"><caption>Sleep trend data</caption><thead><tr><th>Date</th><th>Hours</th><th>Quality</th></tr></thead><tbody>';
    dataPoints.forEach(function(dp) {
      table += '<tr><td>' + escapeHtml(dp.date) + '</td><td>' + dp.hours + '</td><td>' + dp.quality + '/5</td></tr>';
    });
    table += '</tbody></table>';

    return '<div class="chart-wrapper chart-line-wrapper">' + labels + svg + '</div>' + table;
  }

  function buildMedChart(entries) {
    var meds = {};
    Object.keys(entries).forEach(function(d) {
      var e = entries[d];
      if (e.medications && typeof e.medications === 'object') {
        Object.keys(e.medications).forEach(function(m) {
          if (!meds[m]) meds[m] = { taken: 0, total: 0 };
          meds[m].total++;
          if (e.medications[m] === 'taken') meds[m].taken++;
        });
      }
    });

    var items = Object.keys(meds).map(function(m) {
      var pct = meds[m].total > 0 ? Math.round((meds[m].taken / meds[m].total) * 100) : 0;
      return { name: m, taken: meds[m].taken, total: meds[m].total, pct: pct };
    });
    items.sort(function(a, b) { return b.total - a.total; });

    if (items.length === 0) {
      return '<div class="chart-empty" role="img" aria-label="No medication data">No medications logged yet.</div>';
    }

    var barH = 6;
    var gap = 3;
    var padL = 2;
    var w = 100;
    var h = items.length * (barH + gap) + gap;
    var barArea = w - padL - 10;

    var svg = '<svg class="chart-svg chart-bar-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Medication adherence chart">';
    items.forEach(function(item, i) {
      var y = gap + i * (barH + gap);
      // Background bar (total)
      svg += '<rect x="' + padL + '" y="' + y + '" width="' + barArea.toFixed(1) + '" height="' + barH + '" rx="1" fill="var(--border)" opacity="0.4"/>';
      // Filled bar (taken pct)
      var barW = (item.pct / 100) * barArea;
      svg += '<rect x="' + padL + '" y="' + y + '" width="' + barW.toFixed(1) + '" height="' + barH + '" rx="1" fill="var(--success)" opacity="0.8"/>';
      svg += '<text x="' + (padL + barArea + 1.5).toFixed(1) + '" y="' + (y + barH * 0.75).toFixed(1) + '" class="chart-bar-count">' + item.pct + '%</text>';
    });
    svg += '</svg>';

    var labels = '<div class="chart-h-labels" aria-hidden="true">';
    items.forEach(function(item) {
      labels += '<span class="chart-h-label">' + escapeHtml(item.name) + '</span>';
    });
    labels += '</div>';

    var table = '<table class="sr-only"><caption>Medication adherence</caption><thead><tr><th>Medication</th><th>Taken</th><th>Logged</th><th>Rate</th></tr></thead><tbody>';
    items.forEach(function(item) {
      table += '<tr><td>' + escapeHtml(item.name) + '</td><td>' + item.taken + '</td><td>' + item.total + '</td><td>' + item.pct + '%</td></tr>';
    });
    table += '</tbody></table>';

    return '<div class="chart-wrapper chart-hbar-wrapper">' + labels + svg + '</div>' + table;
  }

  function buildCycleOverlay(entries, dates) {
    var phaseColors = {
      'Menstrual': 'var(--feeling-1)',
      'Follicular': 'var(--feeling-4)',
      'Ovulatory': 'var(--feeling-5)',
      'Luteal': 'var(--feeling-2)'
    };

    var hasPhase = false;
    dates.forEach(function(d) {
      if (entries[d] && entries[d].cyclePhase) hasPhase = true;
    });

    if (!hasPhase) {
      return '<div class="chart-empty" role="img" aria-label="No cycle data">No cycle phase data logged yet.</div>';
    }

    var w = 100;
    var h = 12;
    var maxIdx = dates.length - 1;

    var svg = '<svg class="chart-svg chart-cycle-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Cycle phase overlay">';
    dates.forEach(function(d, i) {
      var entry = entries[d];
      if (entry && entry.cyclePhase) {
        var x = maxIdx > 0 ? (i / maxIdx) * w : 0;
        var bw = maxIdx > 0 ? (1 / maxIdx) * w : w;
        var color = phaseColors[entry.cyclePhase] || 'var(--text-secondary)';
        svg += '<rect x="' + x.toFixed(2) + '" y="0" width="' + Math.max(bw, 0.5).toFixed(2) + '" height="' + h + '" fill="' + color + '" opacity="0.5"/>';
      }
    });
    svg += '</svg>';

    var legend = '<div class="cycle-legend" aria-hidden="true">';
    var phases = APP_CONFIG.cyclePhases || [];
    phases.forEach(function(p) {
      legend += '<span class="cycle-legend-item"><span class="cycle-legend-swatch" style="background:' + (phaseColors[p] || 'var(--text-secondary)') + '"></span>' + escapeHtml(p) + '</span>';
    });
    legend += '</div>';

    var table = '<table class="sr-only"><caption>Cycle phases</caption><thead><tr><th>Date</th><th>Phase</th></tr></thead><tbody>';
    dates.forEach(function(d) {
      var entry = entries[d];
      if (entry && entry.cyclePhase) {
        table += '<tr><td>' + escapeHtml(d) + '</td><td>' + escapeHtml(entry.cyclePhase) + '</td></tr>';
      }
    });
    table += '</tbody></table>';

    return svg + legend + table;
  }

  // --- Habit-Specific Charts ---

  function buildHeatmap(allEntries) {
    var today = new Date();
    var totalHabits = (APP_CONFIG.medications || []).length;
    if (totalHabits === 0) totalHabits = 1;

    // Build 52 weeks of data ending today (Sunday-start weeks)
    var endDay = new Date(today);
    // Go to end of this week (Saturday)
    var dayOfWeek = endDay.getDay();
    endDay.setDate(endDay.getDate() + (6 - dayOfWeek));

    var startDay = new Date(endDay);
    startDay.setDate(startDay.getDate() - (52 * 7 - 1));

    var cellSize = 14;
    var gap = 3;
    var labelW = 28;
    var labelH = 18;
    var cols = 52;
    var rows = 7;
    var w = labelW + cols * (cellSize + gap);
    var h = labelH + rows * (cellSize + gap);

    var svg = '<svg class="heatmap-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Habit completion heatmap for the past year">';

    // Month labels
    var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var lastMonth = -1;
    for (var col = 0; col < cols; col++) {
      var cellDate = new Date(startDay);
      cellDate.setDate(cellDate.getDate() + col * 7);
      var m = cellDate.getMonth();
      if (m !== lastMonth) {
        var x = labelW + col * (cellSize + gap);
        svg += '<text x="' + x + '" y="12" class="heatmap-month-label">' + monthNames[m] + '</text>';
        lastMonth = m;
      }
    }

    // Day labels (Mon, Wed, Fri)
    var dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
    for (var row = 0; row < rows; row++) {
      if (dayLabels[row]) {
        var y = labelH + row * (cellSize + gap) + cellSize * 0.75;
        svg += '<text x="0" y="' + y + '" class="heatmap-day-label">' + dayLabels[row] + '</text>';
      }
    }

    // Cells
    for (var c = 0; c < cols; c++) {
      for (var r = 0; r < rows; r++) {
        var d = new Date(startDay);
        d.setDate(d.getDate() + c * 7 + r);
        if (d > today) continue;

        var ds = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        var entry = allEntries[ds];
        var pct = 0;
        if (entry && entry.medications && typeof entry.medications === 'object') {
          var takenCount = 0;
          Object.keys(entry.medications).forEach(function(m) {
            if (entry.medications[m] === 'taken') takenCount++;
          });
          pct = Object.keys(entry.medications).length > 0 ? takenCount / Object.keys(entry.medications).length : 0;
        }

        var color;
        if (!entry) {
          color = 'var(--heatmap-empty)';
        } else if (pct === 0) {
          color = 'var(--heatmap-empty)';
        } else if (pct < 0.4) {
          color = 'var(--heatmap-low)';
        } else if (pct < 0.7) {
          color = 'var(--heatmap-mid)';
        } else if (pct < 1) {
          color = 'var(--heatmap-high)';
        } else {
          color = 'var(--heatmap-full)';
        }

        var cx = labelW + c * (cellSize + gap);
        var cy = labelH + r * (cellSize + gap);
        var dOpts = { weekday: 'short', month: 'short', day: 'numeric' };
        var dLabel = d.toLocaleDateString(undefined, dOpts);
        var takenOfTotal = entry && entry.medications ? Object.keys(entry.medications).filter(function(m) { return entry.medications[m] === 'taken'; }).length : 0;
        var loggedTotal = entry && entry.medications ? Object.keys(entry.medications).length : 0;
        var tipText = dLabel + ' — ' + takenOfTotal + '/' + loggedTotal + ' habits (' + Math.round(pct * 100) + '%)';

        svg += '<rect class="heatmap-cell" x="' + cx + '" y="' + cy + '" width="' + cellSize + '" height="' + cellSize + '" fill="' + color + '" data-tip="' + escapeHtml(tipText) + '" aria-label="' + escapeHtml(tipText) + '"/>';
      }
    }

    svg += '</svg>';

    // Legend
    var legend = '<div class="heatmap-legend" aria-label="Heatmap legend">';
    legend += '<span>Less</span>';
    ['var(--heatmap-empty)', 'var(--heatmap-low)', 'var(--heatmap-mid)', 'var(--heatmap-high)', 'var(--heatmap-full)'].forEach(function(c) {
      legend += '<span class="heatmap-legend-cell" style="background:' + c + '"></span>';
    });
    legend += '<span>More</span>';
    legend += '</div>';

    return '<div class="heatmap-wrapper">' + svg + '</div>' + legend;
  }

  function buildCompletionRing(allEntries) {
    // Calculate today's and this week's completion
    var today = todayStr();
    var todayEntry = allEntries[today];
    var todayPct = 0;
    var todayTaken = 0;
    var todayTotal = 0;

    if (todayEntry && todayEntry.medications && typeof todayEntry.medications === 'object') {
      Object.keys(todayEntry.medications).forEach(function(m) {
        todayTotal++;
        if (todayEntry.medications[m] === 'taken') todayTaken++;
      });
      todayPct = todayTotal > 0 ? Math.round((todayTaken / todayTotal) * 100) : 0;
    }

    // This week: last 7 days
    var weekTaken = 0;
    var weekTotal = 0;
    for (var i = 0; i < 7; i++) {
      var ds = subtractDays(today, i);
      var entry = allEntries[ds];
      if (entry && entry.medications && typeof entry.medications === 'object') {
        Object.keys(entry.medications).forEach(function(m) {
          weekTotal++;
          if (entry.medications[m] === 'taken') weekTaken++;
        });
      }
    }
    var weekPct = weekTotal > 0 ? Math.round((weekTaken / weekTotal) * 100) : 0;

    // Total days logged
    var totalDays = Object.keys(allEntries).length;

    // SVG ring
    var radius = 50;
    var circumference = 2 * Math.PI * radius;
    var offset = circumference - (todayPct / 100) * circumference;

    var ringColor = todayPct < 40 ? 'var(--heatmap-low)' : todayPct < 70 ? 'var(--heatmap-mid)' : todayPct < 100 ? 'var(--heatmap-high)' : 'var(--heatmap-full)';

    var html = '<div class="dashboard-hero">';

    // Ring
    html += '<div class="completion-ring-container">';
    html += '<svg class="completion-ring-svg" viewBox="0 0 120 120" aria-label="Today\'s completion: ' + todayPct + '%">';
    html += '<circle class="completion-ring-bg" cx="60" cy="60" r="' + radius + '"/>';
    html += '<circle class="completion-ring-fill" cx="60" cy="60" r="' + radius + '" stroke="' + ringColor + '" stroke-dasharray="' + circumference.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '"/>';
    html += '</svg>';
    html += '<div class="completion-ring-label">';
    html += '<span class="completion-ring-pct">' + todayPct + '%</span>';
    html += '<span class="completion-ring-sublabel">today</span>';
    html += '</div>';
    html += '</div>';

    // Stats
    html += '<div class="dashboard-stats">';
    html += '<div class="dashboard-stat-item"><span class="dashboard-stat-value">' + todayTaken + '/' + todayTotal + '</span><span class="dashboard-stat-label">habits today</span></div>';
    html += '<div class="dashboard-stat-item"><span class="dashboard-stat-value">' + weekPct + '%</span><span class="dashboard-stat-label">this week</span></div>';
    html += '<div class="dashboard-stat-item"><span class="dashboard-stat-value">' + totalDays + '</span><span class="dashboard-stat-label">days logged</span></div>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function buildWeeklyBars(allEntries) {
    var today = todayStr();
    var dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var data = [];
    var maxHabits = 1;

    for (var i = 6; i >= 0; i--) {
      var ds = subtractDays(today, i);
      var entry = allEntries[ds];
      var taken = 0;
      var total = 0;
      if (entry && entry.medications && typeof entry.medications === 'object') {
        Object.keys(entry.medications).forEach(function(m) {
          total++;
          if (entry.medications[m] === 'taken') taken++;
        });
      }
      var parts = ds.split('-');
      var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      data.push({ day: dayNames[d.getDay()], taken: taken, total: total, date: ds });
      if (total > maxHabits) maxHabits = total;
    }

    if (maxHabits === 0) {
      return '<div class="chart-empty" role="img" aria-label="No habit data this week">No habits logged this week.</div>';
    }

    var barH = 24;
    var gap = 8;
    var labelW = 36;
    var countW = 40;
    var w = 300;
    var h = data.length * (barH + gap) + gap;
    var barArea = w - labelW - countW - 8;

    var svg = '<svg class="weekly-bars-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Weekly habit completion">';
    data.forEach(function(item, i) {
      var y = gap + i * (barH + gap);
      // Label
      svg += '<text x="' + (labelW - 4) + '" y="' + (y + barH * 0.65) + '" class="weekly-bar-label" text-anchor="end">' + item.day + '</text>';
      // Background bar
      svg += '<rect class="weekly-bar-bg" x="' + labelW + '" y="' + y + '" width="' + barArea + '" height="' + barH + '"/>';
      // Fill bar
      var fillW = item.total > 0 ? (item.taken / maxHabits) * barArea : 0;
      if (fillW > 0) {
        svg += '<rect class="weekly-bar-fill" x="' + labelW + '" y="' + y + '" width="' + fillW.toFixed(1) + '" height="' + barH + '" opacity="' + (0.5 + 0.5 * (item.total > 0 ? item.taken / item.total : 0)).toFixed(2) + '"/>';
      }
      // Count
      var countText = item.total > 0 ? item.taken + '/' + item.total : '-';
      svg += '<text x="' + (labelW + barArea + 6) + '" y="' + (y + barH * 0.65) + '" class="weekly-bar-count">' + countText + '</text>';
    });
    svg += '</svg>';

    // Accessible table
    var table = '<table class="sr-only"><caption>Weekly habit completion</caption><thead><tr><th>Day</th><th>Done</th><th>Total</th></tr></thead><tbody>';
    data.forEach(function(item) {
      table += '<tr><td>' + item.day + '</td><td>' + item.taken + '</td><td>' + item.total + '</td></tr>';
    });
    table += '</tbody></table>';

    return svg + table;
  }

  // --- Render ---

  function render() {
    var container = document.getElementById('view-charts');
    if (!container) return;

    var isHabit = APP_CONFIG.variant === 'habit';
    var range = getDateRange();
    var entries = Storage.getEntriesInRange(range.start, range.end);
    var dates = getDatesInRange(range.start, range.end);
    var entryCount = Object.keys(entries).length;
    var allEntries = isHabit ? Storage.getAllEntries() : null;

    var html = '<div class="charts-view">';

    // Habit variant: dashboard hero with completion ring + heatmap first
    if (isHabit && allEntries) {
      // Completion Ring
      html += '<section class="chart-section" aria-labelledby="chart-dashboard-heading">';
      html += '<h3 id="chart-dashboard-heading" class="chart-section-title">Dashboard</h3>';
      html += buildCompletionRing(allEntries);
      html += '</section>';

      // Heatmap Calendar
      html += '<section class="heatmap-section" aria-labelledby="chart-heatmap-heading">';
      html += '<h3 id="chart-heatmap-heading" class="chart-section-title">Habit Heatmap</h3>';
      html += buildHeatmap(allEntries);
      html += '</section>';

      // Weekly Bars
      html += '<section class="chart-section" aria-labelledby="chart-weekly-heading">';
      html += '<h3 id="chart-weekly-heading" class="chart-section-title">This Week</h3>';
      html += buildWeeklyBars(allEntries);
      html += '</section>';
    }

    // Time range selector
    html += '<div class="chart-range-bar" role="group" aria-label="Time range">';
    ['7d', '30d', '90d', 'custom'].forEach(function(r) {
      var label = r === '7d' ? '7 days' : r === '30d' ? '30 days' : r === '90d' ? '90 days' : 'Custom';
      html += '<button type="button" class="chart-range-btn' + (activeRange === r ? ' active' : '') + '" data-range="' + r + '" aria-pressed="' + (activeRange === r ? 'true' : 'false') + '">' + label + '</button>';
    });
    html += '</div>';

    // Custom date inputs (shown only when custom is selected)
    if (activeRange === 'custom') {
      html += '<div class="chart-custom-range">';
      html += '<label for="chart-start">From</label><input type="date" id="chart-start" value="' + escapeHtml(customStart || range.start) + '" aria-label="Start date">';
      html += '<label for="chart-end">To</label><input type="date" id="chart-end" value="' + escapeHtml(customEnd || range.end) + '" aria-label="End date">';
      html += '<button type="button" id="chart-apply-custom" class="btn btn-small">Apply</button>';
      html += '</div>';
    }

    // Summary
    html += '<p class="chart-summary">' + entryCount + ' day' + (entryCount !== 1 ? 's' : '') + ' logged in this period</p>';

    if (entryCount === 0) {
      html += '<div class="chart-empty-state"><p>No entries in this date range. Start logging to see your charts.</p></div>';
    } else {
      // Feeling Trend
      html += '<section class="chart-section" aria-labelledby="chart-feeling-heading">';
      html += '<h3 id="chart-feeling-heading" class="chart-section-title">Feeling Trend</h3>';
      html += buildFeelingChart(entries, dates);
      html += '</section>';

      // Symptom Frequency
      html += '<section class="chart-section" aria-labelledby="chart-symptom-heading">';
      html += '<h3 id="chart-symptom-heading" class="chart-section-title">Top Symptoms</h3>';
      html += buildSymptomChart(entries);
      html += '</section>';

      // Trigger Frequency
      html += '<section class="chart-section" aria-labelledby="chart-trigger-heading">';
      html += '<h3 id="chart-trigger-heading" class="chart-section-title">Trigger Frequency</h3>';
      html += buildTriggerChart(entries);
      html += '</section>';

      // Sleep Trend
      html += '<section class="chart-section" aria-labelledby="chart-sleep-heading">';
      html += '<h3 id="chart-sleep-heading" class="chart-section-title">Sleep Trend</h3>';
      html += buildSleepChart(entries, dates);
      html += '</section>';

      // Medication/Habit Adherence
      html += '<section class="chart-section" aria-labelledby="chart-med-heading">';
      html += '<h3 id="chart-med-heading" class="chart-section-title">' + (isHabit ? 'Habit Consistency' : 'Medication Adherence') + '</h3>';
      html += buildMedChart(entries);
      html += '</section>';

      // Cycle Overlay
      html += '<section class="chart-section" aria-labelledby="chart-cycle-heading">';
      html += '<h3 id="chart-cycle-heading" class="chart-section-title">Cycle Phases</h3>';
      html += buildCycleOverlay(entries, dates);
      html += '</section>';
    }

    html += '</div>';
    container.innerHTML = html;
    bindEvents();
    if (isHabit) bindHeatmapTooltips();
  }

  function bindEvents() {
    var rangeBtns = document.querySelectorAll('.chart-range-btn');
    rangeBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var r = this.getAttribute('data-range');
        if (r === 'custom') {
          activeRange = 'custom';
          if (!customStart) {
            customStart = subtractDays(todayStr(), 29);
            customEnd = todayStr();
          }
        } else {
          activeRange = r;
        }
        render();
      });
    });

    var applyBtn = document.getElementById('chart-apply-custom');
    if (applyBtn) {
      applyBtn.addEventListener('click', function() {
        var s = document.getElementById('chart-start');
        var e = document.getElementById('chart-end');
        if (s && e && s.value && e.value) {
          customStart = s.value;
          customEnd = e.value;
          if (customStart > customEnd) {
            var tmp = customStart;
            customStart = customEnd;
            customEnd = tmp;
          }
          render();
        }
      });
    }
  }

  function bindHeatmapTooltips() {
    var tooltip = document.createElement('div');
    tooltip.className = 'heatmap-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-hidden', 'true');
    document.body.appendChild(tooltip);

    var cells = document.querySelectorAll('.heatmap-cell');
    cells.forEach(function(cell) {
      cell.addEventListener('mouseenter', function(e) {
        var tip = this.getAttribute('data-tip');
        if (!tip) return;
        tooltip.textContent = tip;
        tooltip.classList.add('visible');
        var rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 6 + 'px';
      });
      cell.addEventListener('mouseleave', function() {
        tooltip.classList.remove('visible');
      });
    });
  }

  function init() {
    document.addEventListener('viewchange', function(e) {
      if (e.detail && e.detail.view === 'charts') {
        render();
      }
    });
  }

  return { init: init };
})();
