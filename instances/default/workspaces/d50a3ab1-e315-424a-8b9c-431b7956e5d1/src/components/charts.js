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

  // --- Render ---

  function render() {
    var container = document.getElementById('view-charts');
    if (!container) return;

    var range = getDateRange();
    var entries = Storage.getEntriesInRange(range.start, range.end);
    var dates = getDatesInRange(range.start, range.end);
    var entryCount = Object.keys(entries).length;

    var html = '<div class="charts-view">';

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

      // Medication Adherence
      html += '<section class="chart-section" aria-labelledby="chart-med-heading">';
      html += '<h3 id="chart-med-heading" class="chart-section-title">Medication Adherence</h3>';
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

  function init() {
    document.addEventListener('viewchange', function(e) {
      if (e.detail && e.detail.view === 'charts') {
        render();
      }
    });
  }

  return { init: init };
})();
