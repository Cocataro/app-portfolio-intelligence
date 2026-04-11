// === Charts Module (Pregnancy) ===
var Charts = (function() {
  'use strict';

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

  function buildWellnessChart(entries, dates) {
    var dataPoints = [];
    dates.forEach(function(d, i) {
      var entry = entries[d];
      if (entry && entry.feeling > 0) {
        dataPoints.push({ idx: i, date: d, val: entry.feeling });
      }
    });
    if (dataPoints.length < 2) {
      return '<div class="chart-empty" role="img" aria-label="Not enough wellness data">Log at least 2 days to see your wellness trend.</div>';
    }

    var w = 100;
    var h = 40;
    var padX = 8;
    var padY = 4;
    var plotW = w - padX * 2;
    var plotH = h - padY * 2;
    var maxIdx = dates.length - 1;
    var maxVal = 4;

    var points = [];
    dataPoints.forEach(function(dp) {
      var x = padX + (maxIdx > 0 ? (dp.idx / maxIdx) * plotW : plotW / 2);
      var y = padY + plotH - ((dp.val - 1) / (maxVal - 1)) * plotH;
      points.push(x.toFixed(1) + ',' + y.toFixed(1));
    });

    var wellnessColors = { 1: 'var(--wellness-rough)', 2: 'var(--wellness-tough)', 3: 'var(--wellness-good)', 4: 'var(--wellness-great)' };

    var svg = '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Wellness trend over time">';
    // Grid lines
    for (var g = 1; g <= maxVal; g++) {
      var gy = padY + plotH - ((g - 1) / (maxVal - 1)) * plotH;
      svg += '<line x1="' + padX + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padX) + '" y2="' + gy.toFixed(1) + '" stroke="var(--border)" stroke-width="0.3" stroke-dasharray="1,1"/>';
    }
    // Area fill
    var firstPt = points[0].split(',');
    var lastPt = points[points.length - 1].split(',');
    var areaPath = 'M' + firstPt[0] + ',' + (padY + plotH) + ' L' + points.join(' L') + ' L' + lastPt[0] + ',' + (padY + plotH) + ' Z';
    svg += '<path d="' + areaPath + '" fill="var(--chart-fill)" />';
    // Line
    svg += '<polyline points="' + points.join(' ') + '" fill="none" stroke="var(--chart-line)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>';
    // Dots
    dataPoints.forEach(function(dp) {
      var x = padX + (maxIdx > 0 ? (dp.idx / maxIdx) * plotW : plotW / 2);
      var y = padY + plotH - ((dp.val - 1) / (maxVal - 1)) * plotH;
      svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.2" fill="' + (wellnessColors[dp.val] || 'var(--primary)') + '" stroke="var(--bg-secondary)" stroke-width="0.3"/>';
    });
    svg += '</svg>';

    var labels = '<div class="chart-y-labels" aria-hidden="true"><span>Great</span><span>Good</span><span>Tough</span><span>Rough</span></div>';

    // Accessible table
    var table = '<table class="sr-only"><caption>Wellness trend data</caption><thead><tr><th>Date</th><th>Wellness</th></tr></thead><tbody>';
    var levels = APP_CONFIG.wellnessLevels || [];
    dataPoints.forEach(function(dp) {
      var label = String(dp.val);
      levels.forEach(function(l) { if (l.value === dp.val) label = l.label; });
      table += '<tr><td>' + escapeHtml(dp.date) + '</td><td>' + escapeHtml(label) + '</td></tr>';
    });
    table += '</tbody></table>';

    return '<div class="chart-wrapper chart-line-wrapper">' + labels + svg + '</div>' + table;
  }

  function buildSymptomChart(entries) {
    var counts = {};
    Object.keys(entries).forEach(function(d) {
      var e = entries[d];
      if (Array.isArray(e.symptoms)) {
        e.symptoms.forEach(function(s) {
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

    var svg = '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img" aria-label="Sleep trend over time">';
    [4, 8, 12].forEach(function(hr) {
      var gy = padY + plotH - (hr / maxH) * plotH;
      svg += '<line x1="' + padX + '" y1="' + gy.toFixed(1) + '" x2="' + (w - padX) + '" y2="' + gy.toFixed(1) + '" stroke="var(--border)" stroke-width="0.3" stroke-dasharray="1,1"/>';
    });
    svg += '<polyline points="' + points.join(' ') + '" fill="none" stroke="var(--chart-line-alt)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/>';
    dataPoints.forEach(function(dp) {
      var x = padX + (maxIdx > 0 ? (dp.idx / maxIdx) * plotW : plotW / 2);
      var y = padY + plotH - (Math.min(dp.hours, maxH) / maxH) * plotH;
      svg += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.2" fill="var(--chart-line-alt)" stroke="var(--bg-secondary)" stroke-width="0.3"/>';
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

  function buildSupplementChart(entries) {
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
      return '<div class="chart-empty" role="img" aria-label="No supplement data">No supplements or medications logged yet.</div>';
    }

    var barH = 6;
    var gap = 3;
    var padL = 2;
    var w = 100;
    var h = items.length * (barH + gap) + gap;
    var barArea = w - padL - 10;

    var svg = '<svg class="chart-svg chart-bar-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Supplement adherence chart">';
    items.forEach(function(item, i) {
      var y = gap + i * (barH + gap);
      svg += '<rect x="' + padL + '" y="' + y + '" width="' + barArea.toFixed(1) + '" height="' + barH + '" rx="1" fill="var(--border)" opacity="0.4"/>';
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

    var table = '<table class="sr-only"><caption>Supplement adherence</caption><thead><tr><th>Supplement</th><th>Taken</th><th>Logged</th><th>Rate</th></tr></thead><tbody>';
    items.forEach(function(item) {
      table += '<tr><td>' + escapeHtml(item.name) + '</td><td>' + item.taken + '</td><td>' + item.total + '</td><td>' + item.pct + '%</td></tr>';
    });
    table += '</tbody></table>';

    return '<div class="chart-wrapper chart-hbar-wrapper">' + labels + svg + '</div>' + table;
  }

  function buildTrimesterChart(entries) {
    var trimesterData = { 1: { sum: 0, count: 0 }, 2: { sum: 0, count: 0 }, 3: { sum: 0, count: 0 } };
    var dueDate = PregnancyStorage.getDueDate();
    if (!dueDate) {
      return '<div class="chart-empty" role="img" aria-label="No due date set">Set your due date to see trimester comparison.</div>';
    }

    var dueParts = dueDate.split('-');
    var dueObj = new Date(parseInt(dueParts[0]), parseInt(dueParts[1]) - 1, parseInt(dueParts[2]));
    var conceptionDate = new Date(dueObj.getTime() - 280 * 86400000);

    Object.keys(entries).forEach(function(d) {
      var e = entries[d];
      if (e.feeling > 0) {
        var parts = d.split('-');
        var dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        var daysSince = Math.floor((dateObj.getTime() - conceptionDate.getTime()) / 86400000);
        var week = Math.floor(daysSince / 7) + 1;
        var tri = week <= 13 ? 1 : week <= 27 ? 2 : 3;
        trimesterData[tri].sum += e.feeling;
        trimesterData[tri].count++;
      }
    });

    var hasData = trimesterData[1].count > 0 || trimesterData[2].count > 0 || trimesterData[3].count > 0;
    if (!hasData) {
      return '<div class="chart-empty" role="img" aria-label="No trimester data">Log a few entries to see trimester comparison.</div>';
    }

    var trimColors = ['var(--trimester-1)', 'var(--trimester-2)', 'var(--trimester-3)'];
    var trimLabels = ['First', 'Second', 'Third'];
    var w = 100;
    var h = 36;
    var padX = 8;
    var padY = 4;
    var barW = 20;
    var gap = 8;
    var plotH = h - padY * 2;
    var startX = padX + 4;

    var svg = '<svg class="chart-svg" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Average wellness by trimester">';
    // Baseline
    svg += '<line x1="' + padX + '" y1="' + (padY + plotH) + '" x2="' + (w - padX) + '" y2="' + (padY + plotH) + '" stroke="var(--border)" stroke-width="0.3"/>';

    for (var t = 1; t <= 3; t++) {
      var x = startX + (t - 1) * (barW + gap);
      var avg = trimesterData[t].count > 0 ? trimesterData[t].sum / trimesterData[t].count : 0;
      var barHeight = (avg / 4) * plotH;
      var y = padY + plotH - barHeight;

      svg += '<rect x="' + x + '" y="' + y.toFixed(1) + '" width="' + barW + '" height="' + barHeight.toFixed(1) + '" rx="2" fill="' + trimColors[t - 1] + '" opacity="0.8"/>';
      if (trimesterData[t].count > 0) {
        svg += '<text x="' + (x + barW / 2) + '" y="' + (y - 1.5).toFixed(1) + '" text-anchor="middle" class="chart-bar-count">' + avg.toFixed(1) + '</text>';
      }
      svg += '<text x="' + (x + barW / 2) + '" y="' + (padY + plotH + 4) + '" text-anchor="middle" class="chart-bar-label">' + trimLabels[t - 1] + '</text>';
    }
    svg += '</svg>';

    var table = '<table class="sr-only"><caption>Average wellness by trimester</caption><thead><tr><th>Trimester</th><th>Avg wellness</th><th>Days logged</th></tr></thead><tbody>';
    for (var i = 1; i <= 3; i++) {
      var a = trimesterData[i].count > 0 ? (trimesterData[i].sum / trimesterData[i].count).toFixed(1) : 'N/A';
      table += '<tr><td>' + trimLabels[i - 1] + '</td><td>' + a + '</td><td>' + trimesterData[i].count + '</td></tr>';
    }
    table += '</tbody></table>';

    return '<div class="chart-wrapper">' + svg + '</div>' + table;
  }

  // --- Public API ---

  function init() {
    // Charts view doesn't exist in pregnancy nav — charts are embedded in Reports
  }

  return {
    init: init,
    buildWellnessChart: buildWellnessChart,
    buildSymptomChart: buildSymptomChart,
    buildSleepChart: buildSleepChart,
    buildSupplementChart: buildSupplementChart,
    buildTrimesterChart: buildTrimesterChart,
    getDatesInRange: getDatesInRange,
    subtractDays: subtractDays,
    todayStr: todayStr
  };
})();
