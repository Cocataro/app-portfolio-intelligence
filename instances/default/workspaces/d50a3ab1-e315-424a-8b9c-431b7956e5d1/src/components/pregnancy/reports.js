// === Reports Module (Pregnancy) ===
var Reports = (function() {
  'use strict';

  var startDate = '';
  var endDate = '';
  var activeTab = 'charts';

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

  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(parts[1]) - 1] + ' ' + parseInt(parts[2]) + ', ' + parts[0];
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --- Charts Tab ---

  function renderChartsTab() {
    if (!startDate) {
      startDate = subtractDays(todayStr(), 29);
      endDate = todayStr();
    }

    var entries = Storage.getEntriesInRange(startDate, endDate);
    var dates = Charts.getDatesInRange(startDate, endDate);
    var entryCount = Object.keys(entries).length;

    var html = '';

    // Date range
    html += '<div class="report-range-section">';
    html += '<div class="report-range-row">';
    html += '<label for="chart-start">From</label>';
    html += '<input type="date" id="chart-start" value="' + escapeHtml(startDate) + '" aria-label="Start date">';
    html += '<label for="chart-end">To</label>';
    html += '<input type="date" id="chart-end" value="' + escapeHtml(endDate) + '" aria-label="End date">';
    html += '<button type="button" id="chart-apply" class="btn btn-small" aria-label="Apply date range">Apply</button>';
    html += '</div>';
    html += '</div>';

    html += '<p class="chart-summary">' + entryCount + ' day' + (entryCount !== 1 ? 's' : '') + ' logged in this period</p>';

    if (entryCount === 0) {
      html += '<div class="chart-empty-state"><p>No entries in this date range. Start logging to see your charts.</p></div>';
      return html;
    }

    // Wellness trend
    html += '<section class="chart-section" aria-labelledby="chart-wellness-heading">';
    html += '<h3 id="chart-wellness-heading" class="chart-section-title">Wellness trend</h3>';
    html += Charts.buildWellnessChart(entries, dates);
    html += '</section>';

    // Symptom frequency
    html += '<section class="chart-section" aria-labelledby="chart-symptom-heading">';
    html += '<h3 id="chart-symptom-heading" class="chart-section-title">Top symptoms</h3>';
    html += Charts.buildSymptomChart(entries);
    html += '</section>';

    // Sleep trend
    html += '<section class="chart-section" aria-labelledby="chart-sleep-heading">';
    html += '<h3 id="chart-sleep-heading" class="chart-section-title">Sleep trend</h3>';
    html += Charts.buildSleepChart(entries, dates);
    html += '</section>';

    // Supplement adherence
    html += '<section class="chart-section" aria-labelledby="chart-supp-heading">';
    html += '<h3 id="chart-supp-heading" class="chart-section-title">Supplement adherence</h3>';
    html += Charts.buildSupplementChart(entries);
    html += '</section>';

    // Trimester comparison
    var allEntries = Storage.getAllEntries();
    html += '<section class="chart-section" aria-labelledby="chart-tri-heading">';
    html += '<h3 id="chart-tri-heading" class="chart-section-title">Wellness by trimester</h3>';
    html += Charts.buildTrimesterChart(allEntries);
    html += '</section>';

    return html;
  }

  // --- Report Tab ---

  function buildSummaryStats(entries, dateKeys) {
    var feelingSum = 0;
    var feelingCount = 0;
    var symptomDays = 0;
    var medDays = 0;
    var sleepSum = 0;
    var sleepCount = 0;

    dateKeys.forEach(function(d) {
      var e = entries[d];
      if (e.feeling > 0) { feelingSum += e.feeling; feelingCount++; }
      if (Array.isArray(e.symptoms) && e.symptoms.length > 0) symptomDays++;
      if (e.medications && Object.keys(e.medications).length > 0) medDays++;
      if (e.sleep && e.sleep.hours > 0) { sleepSum += e.sleep.hours; sleepCount++; }
    });

    var avgFeeling = feelingCount > 0 ? (feelingSum / feelingCount).toFixed(1) : 'N/A';
    var avgSleep = sleepCount > 0 ? (sleepSum / sleepCount).toFixed(1) : 'N/A';
    var levels = APP_CONFIG.wellnessLevels || [];
    var feelingLabel = '';
    if (feelingCount > 0) {
      var rounded = Math.round(feelingSum / feelingCount);
      levels.forEach(function(l) { if (l.value === rounded) feelingLabel = l.label; });
    }

    return {
      totalDays: dateKeys.length,
      avgFeeling: avgFeeling,
      feelingLabel: feelingLabel,
      symptomDays: symptomDays,
      medDays: medDays,
      avgSleep: avgSleep
    };
  }

  function buildSymptomFrequency(entries, dateKeys) {
    var counts = {};
    dateKeys.forEach(function(d) {
      var e = entries[d];
      if (Array.isArray(e.symptoms)) {
        e.symptoms.forEach(function(s) {
          counts[s] = (counts[s] || 0) + 1;
        });
      }
    });

    return Object.keys(counts).map(function(s) {
      return { name: s, count: counts[s] };
    }).sort(function(a, b) { return b.count - a.count; });
  }

  function buildSupplementAdherence(entries, dateKeys) {
    var meds = {};
    dateKeys.forEach(function(d) {
      var e = entries[d];
      if (e.medications && typeof e.medications === 'object') {
        Object.keys(e.medications).forEach(function(m) {
          if (!meds[m]) meds[m] = { taken: 0, skipped: 0, total: 0 };
          meds[m].total++;
          if (e.medications[m] === 'taken') meds[m].taken++;
          else meds[m].skipped++;
        });
      }
    });

    return Object.keys(meds).map(function(m) {
      var pct = meds[m].total > 0 ? Math.round((meds[m].taken / meds[m].total) * 100) : 0;
      return { name: m, taken: meds[m].taken, skipped: meds[m].skipped, total: meds[m].total, pct: pct };
    }).sort(function(a, b) { return b.total - a.total; });
  }

  function buildNotesHighlights(entries, dateKeys) {
    var notes = [];
    dateKeys.forEach(function(d) {
      var e = entries[d];
      if (e.notes && e.notes.trim()) {
        notes.push({ date: d, text: e.notes.trim() });
      }
    });
    return notes;
  }

  function buildReportHtml(start, end) {
    var entries = Storage.getEntriesInRange(start, end);
    var dateKeys = Object.keys(entries).sort();

    if (dateKeys.length === 0) {
      return '<div class="report-empty">No entries found for this date range.</div>';
    }

    var stats = buildSummaryStats(entries, dateKeys);
    var symptoms = buildSymptomFrequency(entries, dateKeys);
    var supplements = buildSupplementAdherence(entries, dateKeys);
    var notes = buildNotesHighlights(entries, dateKeys);

    // Pregnancy context
    var week = PregnancyStorage.getCurrentWeek();
    var trimester = PregnancyStorage.getTrimester();
    var daysLeft = PregnancyStorage.getDaysUntilDue();
    var trimesterNames = ['First trimester', 'Second trimester', 'Third trimester'];

    var html = '<div class="report-content" id="report-printable">';

    // Report header
    html += '<div class="report-header">';
    html += '<h3 class="report-title">' + escapeHtml(APP_CONFIG.name || 'Pregnancy Wellness Tracker') + ' Report</h3>';
    html += '<p class="report-period">' + formatDate(start) + ' to ' + formatDate(end) + '</p>';
    if (week > 0 && week <= 42) {
      html += '<p class="report-period">Week ' + week + ' \u2022 ' + trimesterNames[trimester - 1];
      if (daysLeft !== null && daysLeft > 0) html += ' \u2022 ' + daysLeft + ' days until due date';
      html += '</p>';
    }
    html += '<p class="report-generated">Generated: ' + formatDate(todayStr()) + '</p>';
    html += '</div>';

    // Summary stats
    html += '<section class="report-section" aria-labelledby="report-summary-heading">';
    html += '<h4 id="report-summary-heading" class="report-section-title">Summary</h4>';
    html += '<div class="report-stats-grid">';
    html += '<div class="report-stat"><span class="report-stat-value">' + stats.totalDays + '</span><span class="report-stat-label">Days logged</span></div>';
    html += '<div class="report-stat"><span class="report-stat-value">' + stats.avgFeeling + '</span><span class="report-stat-label">Avg wellness' + (stats.feelingLabel ? ' (' + escapeHtml(stats.feelingLabel) + ')' : '') + '</span></div>';
    html += '<div class="report-stat"><span class="report-stat-value">' + stats.symptomDays + '</span><span class="report-stat-label">Days with symptoms</span></div>';
    html += '<div class="report-stat"><span class="report-stat-value">' + stats.avgSleep + '</span><span class="report-stat-label">Avg sleep (hrs)</span></div>';
    html += '</div>';
    html += '</section>';

    // Symptom frequency
    if (symptoms.length > 0) {
      html += '<section class="report-section" aria-labelledby="report-symptoms-heading">';
      html += '<h4 id="report-symptoms-heading" class="report-section-title">Symptom frequency</h4>';
      html += '<div class="report-table-wrapper">';
      html += '<table class="report-table" aria-label="Symptom frequency table">';
      html += '<thead><tr><th>Symptom</th><th>Days</th></tr></thead>';
      html += '<tbody>';
      symptoms.forEach(function(s) {
        html += '<tr><td>' + escapeHtml(s.name) + '</td><td>' + s.count + '</td></tr>';
      });
      html += '</tbody></table>';
      html += '</div>';
      html += '</section>';
    }

    // Supplement adherence
    if (supplements.length > 0) {
      html += '<section class="report-section" aria-labelledby="report-supps-heading">';
      html += '<h4 id="report-supps-heading" class="report-section-title">Supplement &amp; medication adherence</h4>';
      html += '<div class="report-table-wrapper">';
      html += '<table class="report-table" aria-label="Supplement adherence table">';
      html += '<thead><tr><th>Supplement</th><th>Taken</th><th>Skipped</th><th>Rate</th></tr></thead>';
      html += '<tbody>';
      supplements.forEach(function(m) {
        html += '<tr><td>' + escapeHtml(m.name) + '</td><td>' + m.taken + '</td><td>' + m.skipped + '</td><td>' + m.pct + '%</td></tr>';
      });
      html += '</tbody></table>';
      html += '</div>';
      html += '</section>';
    }

    // Appointment history
    var appts = PregnancyStorage.getAppointments();
    var pastAppts = appts.filter(function(a) { return a.date >= start && a.date <= end; });
    if (pastAppts.length > 0) {
      html += '<section class="report-section" aria-labelledby="report-appts-heading">';
      html += '<h4 id="report-appts-heading" class="report-section-title">Prenatal appointments</h4>';
      html += '<div class="report-table-wrapper">';
      html += '<table class="report-table" aria-label="Appointment history">';
      html += '<thead><tr><th>Date</th><th>Type</th><th>Notes</th></tr></thead>';
      html += '<tbody>';
      pastAppts.forEach(function(a) {
        html += '<tr><td>' + formatDate(a.date) + '</td><td>' + escapeHtml(a.type || 'Visit') + '</td><td>' + escapeHtml(a.notes || '') + '</td></tr>';
      });
      html += '</tbody></table>';
      html += '</div>';
      html += '</section>';
    }

    // Notes highlights
    if (notes.length > 0) {
      html += '<section class="report-section" aria-labelledby="report-notes-heading">';
      html += '<h4 id="report-notes-heading" class="report-section-title">Notes</h4>';
      html += '<div class="report-notes-list">';
      notes.forEach(function(n) {
        html += '<div class="report-note-item">';
        html += '<span class="report-note-date">' + formatDate(n.date) + '</span>';
        html += '<p class="report-note-text">' + escapeHtml(n.text) + '</p>';
        html += '</div>';
      });
      html += '</div>';
      html += '</section>';
    }

    // Disclaimer
    html += '<div class="report-disclaimer">';
    html += '<p>This report is for informational purposes only. It is not a medical diagnosis or recommendation. Always consult your healthcare provider for advice about your pregnancy.</p>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  function renderReportTab() {
    if (!startDate) {
      startDate = subtractDays(todayStr(), 29);
      endDate = todayStr();
    }

    var html = '';

    // Date range
    html += '<div class="report-range-section">';
    html += '<div class="report-range-row">';
    html += '<label for="report-start">From</label>';
    html += '<input type="date" id="report-start" value="' + escapeHtml(startDate) + '" aria-label="Report start date">';
    html += '<label for="report-end">To</label>';
    html += '<input type="date" id="report-end" value="' + escapeHtml(endDate) + '" aria-label="Report end date">';
    html += '</div>';
    html += '<div class="report-actions-bar">';
    html += '<button type="button" id="report-generate" class="btn btn-primary" aria-label="Generate report">Generate report</button>';
    html += '</div>';
    html += '</div>';

    // Report output
    html += '<div id="report-output">';
    html += buildReportHtml(startDate, endDate);
    html += '</div>';

    // Action buttons
    var entryCount = Storage.getEntryCount();
    if (entryCount > 0) {
      html += '<div class="report-export-bar">';
      html += '<button type="button" id="report-print" class="btn btn-outline" aria-label="Print report">';
      html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="6" y="14" width="12" height="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
      html += 'Print</button>';
      html += '<button type="button" id="report-copy-text" class="btn btn-outline" aria-label="Copy report as text">';
      html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
      html += 'Copy as text</button>';
      html += '<button type="button" id="report-csv" class="btn btn-outline" aria-label="Export CSV">';
      html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
      html += 'Export CSV</button>';
      html += '</div>';
    }

    return html;
  }

  // --- Plain-Text Builder ---

  function buildPlainText(start, end) {
    var entries = Storage.getEntriesInRange(start, end);
    var dateKeys = Object.keys(entries).sort();
    if (dateKeys.length === 0) return 'No entries found for this date range.';

    var stats = buildSummaryStats(entries, dateKeys);
    var symptoms = buildSymptomFrequency(entries, dateKeys);
    var supplements = buildSupplementAdherence(entries, dateKeys);
    var notes = buildNotesHighlights(entries, dateKeys);

    var week = PregnancyStorage.getCurrentWeek();
    var trimester = PregnancyStorage.getTrimester();
    var trimesterNames = ['First trimester', 'Second trimester', 'Third trimester'];

    var lines = [];
    lines.push((APP_CONFIG.name || 'Pregnancy Wellness Tracker') + ' Report');
    lines.push('Period: ' + formatDate(start) + ' to ' + formatDate(end));
    if (week > 0 && week <= 42) {
      lines.push('Week ' + week + ' - ' + trimesterNames[trimester - 1]);
    }
    lines.push('Generated: ' + formatDate(todayStr()));
    lines.push('');

    lines.push('--- Summary ---');
    lines.push('Days Logged: ' + stats.totalDays);
    lines.push('Avg Wellness: ' + stats.avgFeeling + (stats.feelingLabel ? ' (' + stats.feelingLabel + ')' : ''));
    lines.push('Days with Symptoms: ' + stats.symptomDays);
    lines.push('Avg Sleep: ' + stats.avgSleep + ' hrs');
    lines.push('');

    if (symptoms.length > 0) {
      lines.push('--- Symptom Frequency ---');
      symptoms.forEach(function(s) {
        lines.push(s.name + ': ' + s.count + ' days');
      });
      lines.push('');
    }

    if (supplements.length > 0) {
      lines.push('--- Supplement Adherence ---');
      supplements.forEach(function(m) {
        lines.push(m.name + ': ' + m.taken + '/' + m.total + ' (' + m.pct + '%)');
      });
      lines.push('');
    }

    if (notes.length > 0) {
      lines.push('--- Notes ---');
      notes.forEach(function(n) {
        lines.push(formatDate(n.date) + ': ' + n.text);
      });
      lines.push('');
    }

    lines.push('---');
    lines.push('This report is for informational purposes only. Always consult your healthcare provider.');

    return lines.join('\n');
  }

  // --- CSV Export ---

  function csvEscape(val) {
    var s = String(val);
    if (s.indexOf(',') !== -1 || s.indexOf('"') !== -1 || s.indexOf('\n') !== -1) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  }

  function exportCsv() {
    var entries = Storage.getAllEntries();
    var dateKeys = Object.keys(entries).sort();
    if (dateKeys.length === 0) return;

    var rows = [];
    rows.push(['Date', 'Wellness', 'Symptoms', 'Triggers', 'Supplements', 'Sleep Hours', 'Sleep Quality', 'Exercise Type', 'Exercise Duration', 'Notes'].join(','));

    var levels = APP_CONFIG.wellnessLevels || [];

    dateKeys.forEach(function(d) {
      var e = entries[d];
      var wellnessLabel = '';
      if (e.feeling > 0) {
        levels.forEach(function(l) { if (l.value === e.feeling) wellnessLabel = l.label; });
        wellnessLabel = wellnessLabel || String(e.feeling);
      }

      var symptomList = Array.isArray(e.symptoms) ? e.symptoms.join('; ') : '';
      var triggers = Array.isArray(e.triggers) ? e.triggers.join('; ') : '';
      var meds = e.medications ? Object.keys(e.medications).map(function(m) { return m + ':' + e.medications[m]; }).join('; ') : '';
      var sleepH = e.sleep ? (e.sleep.hours || '') : '';
      var sleepQ = e.sleep ? (e.sleep.quality || '') : '';
      var exType = e.exercise ? (e.exercise.type || '') : '';
      var exDur = e.exercise ? (e.exercise.duration || '') : '';
      var notes = e.notes || '';

      rows.push([
        csvEscape(d),
        csvEscape(wellnessLabel),
        csvEscape(symptomList),
        csvEscape(triggers),
        csvEscape(meds),
        csvEscape(sleepH),
        csvEscape(sleepQ),
        csvEscape(exType),
        csvEscape(exDur),
        csvEscape(notes)
      ].join(','));
    });

    var csv = rows.join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'pregnancy-wellness-data-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- Render ---

  function showToast(msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('visible'); });
    setTimeout(function() {
      toast.classList.remove('visible');
      setTimeout(function() { toast.remove(); }, 300);
    }, 2000);
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Report copied to clipboard');
    } catch (err) {
      showToast('Could not copy');
    }
    document.body.removeChild(ta);
  }

  function render() {
    var container = document.getElementById('reports-container');
    if (!container) return;

    var html = '<div class="reports-view">';
    html += '<h2 class="reports-heading">Reports &amp; charts</h2>';

    // Tabs
    html += '<div class="reports-tabs" role="tablist" aria-label="Reports sections">';
    html += '<button class="report-tab' + (activeTab === 'charts' ? ' active' : '') + '" data-tab="charts" role="tab" aria-selected="' + (activeTab === 'charts') + '">Charts</button>';
    html += '<button class="report-tab' + (activeTab === 'report' ? ' active' : '') + '" data-tab="report" role="tab" aria-selected="' + (activeTab === 'report') + '">Doctor report</button>';
    html += '<button class="report-tab' + (activeTab === 'data' ? ' active' : '') + '" data-tab="data" role="tab" aria-selected="' + (activeTab === 'data') + '">Data</button>';
    html += '</div>';

    if (activeTab === 'charts') {
      html += renderChartsTab();
    } else if (activeTab === 'report') {
      html += renderReportTab();
    } else if (activeTab === 'data') {
      html += renderDataTab();
    }

    html += '</div>';
    container.innerHTML = html;
    bindEvents();
  }

  function renderDataTab() {
    var html = '';
    var entryCount = Storage.getEntryCount();

    html += '<div class="data-section">';
    html += '<p style="color:var(--text-secondary);margin-bottom:1rem">' + entryCount + ' total entries stored on this device.</p>';

    html += '<div class="report-export-bar" style="flex-direction:column;gap:0.75rem">';
    html += '<button type="button" id="data-csv" class="btn btn-outline" style="width:100%" aria-label="Export all data as CSV">';
    html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
    html += 'Export all data (CSV)</button>';

    html += '<button type="button" id="data-backup" class="btn btn-outline" style="width:100%" aria-label="Download JSON backup">';
    html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    html += 'Download backup (JSON)</button>';

    html += '<label class="btn btn-outline data-restore-label" style="width:100%;text-align:center;cursor:pointer" tabindex="0" role="button" aria-label="Restore from backup">';
    html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    html += 'Restore from backup (JSON)';
    html += '<input type="file" id="data-restore-input" accept=".json" hidden aria-hidden="true">';
    html += '</label>';

    html += '</div>';
    html += '</div>';

    return html;
  }

  function bindEvents() {
    // Tab switching
    var tabs = document.querySelectorAll('.report-tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        activeTab = this.getAttribute('data-tab');
        render();
      });
    });

    // Charts date range
    var chartApply = document.getElementById('chart-apply');
    if (chartApply) {
      chartApply.addEventListener('click', function() {
        var s = document.getElementById('chart-start');
        var e = document.getElementById('chart-end');
        if (s && e && s.value && e.value) {
          startDate = s.value;
          endDate = e.value;
          if (startDate > endDate) { var tmp = startDate; startDate = endDate; endDate = tmp; }
          render();
        }
      });
    }

    // Report generation
    var genBtn = document.getElementById('report-generate');
    if (genBtn) {
      genBtn.addEventListener('click', function() {
        var s = document.getElementById('report-start');
        var e = document.getElementById('report-end');
        if (s && e && s.value && e.value) {
          startDate = s.value;
          endDate = e.value;
          if (startDate > endDate) { var tmp = startDate; startDate = endDate; endDate = tmp; }
          var output = document.getElementById('report-output');
          if (output) output.innerHTML = buildReportHtml(startDate, endDate);
        }
      });
    }

    // Print
    var printBtn = document.getElementById('report-print');
    if (printBtn) {
      printBtn.addEventListener('click', function() { window.print(); });
    }

    // Copy text
    var copyBtn = document.getElementById('report-copy-text');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        var text = buildPlainText(startDate, endDate);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function() {
            showToast('Report copied to clipboard');
          }, function() { fallbackCopy(text); });
        } else {
          fallbackCopy(text);
        }
      });
    }

    // CSV export (both tabs)
    var csvBtn = document.getElementById('report-csv') || document.getElementById('data-csv');
    if (csvBtn) {
      csvBtn.addEventListener('click', exportCsv);
    }

    // Backup
    var backupBtn = document.getElementById('data-backup');
    if (backupBtn) {
      backupBtn.addEventListener('click', function() {
        Storage.downloadBackup();
        showToast('Backup downloaded');
      });
    }

    // Restore
    var restoreLabel = document.querySelector('.data-restore-label');
    var restoreInput = document.getElementById('data-restore-input');
    if (restoreLabel) {
      restoreLabel.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (restoreInput) restoreInput.click();
        }
      });
    }
    if (restoreInput) {
      restoreInput.addEventListener('change', function() {
        var file = this.files[0];
        var inputEl = this;
        if (!file) return;
        Settings.showConfirm('Restore from backup?', 'This will merge the backup data with your current entries. Continue?', function() {
          Storage.restoreFromFile(file, function(err, count) {
            if (!err && count >= 0) {
              showToast('Restored ' + count + ' entries');
              render();
            } else {
              showToast('Invalid backup file');
            }
          });
          inputEl.value = '';
        });
      });
    }
  }

  function init() {
    document.addEventListener('viewchange', function(e) {
      if (e.detail && e.detail.view === 'reports') {
        render();
      }
    });
  }

  return { init: init };
})();
