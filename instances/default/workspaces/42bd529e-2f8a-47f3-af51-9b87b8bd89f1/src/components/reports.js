// === Reports Module ===
var Reports = (function() {
  'use strict';

  var startDate = '';
  var endDate = '';

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
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[parseInt(parts[1]) - 1] + ' ' + parseInt(parts[2]) + ', ' + parts[0];
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --- Report Data Generators ---

  function buildSummaryStats(entries, dateKeys) {
    var totalDays = dateKeys.length;
    var feelingSum = 0;
    var feelingCount = 0;
    var symptomDays = 0;
    var triggerDays = 0;
    var medDays = 0;
    var sleepSum = 0;
    var sleepCount = 0;

    dateKeys.forEach(function(d) {
      var e = entries[d];
      if (e.feeling > 0) { feelingSum += e.feeling; feelingCount++; }
      if (e.symptoms && Object.keys(e.symptoms).length > 0) symptomDays++;
      if (Array.isArray(e.triggers) && e.triggers.length > 0) triggerDays++;
      if (e.medications && Object.keys(e.medications).length > 0) medDays++;
      if (e.sleep && e.sleep.hours > 0) { sleepSum += e.sleep.hours; sleepCount++; }
    });

    var avgFeeling = feelingCount > 0 ? (feelingSum / feelingCount).toFixed(1) : 'N/A';
    var avgSleep = sleepCount > 0 ? (sleepSum / sleepCount).toFixed(1) : 'N/A';
    var scale = APP_CONFIG.feelingScale || [];
    var feelingLabel = '';
    if (feelingCount > 0) {
      var rounded = Math.round(feelingSum / feelingCount);
      scale.forEach(function(s) { if (s.value === rounded) feelingLabel = s.label; });
    }

    return {
      totalDays: totalDays,
      avgFeeling: avgFeeling,
      feelingLabel: feelingLabel,
      symptomDays: symptomDays,
      triggerDays: triggerDays,
      medDays: medDays,
      avgSleep: avgSleep,
      sleepCount: sleepCount
    };
  }

  function getSeverityKeys() {
    var levels = APP_CONFIG.severityLevels || [
      { key: 'none', label: 'None' },
      { key: 'mild', label: 'Mild' },
      { key: 'moderate', label: 'Moderate' },
      { key: 'severe', label: 'Severe' },
      { key: 'unbearable', label: 'Unbearable' }
    ];
    return levels;
  }

  function buildSymptomFrequency(entries, dateKeys) {
    var counts = {};
    var severities = {};
    var sevLevels = getSeverityKeys();
    dateKeys.forEach(function(d) {
      var e = entries[d];
      if (e.symptoms && typeof e.symptoms === 'object') {
        Object.keys(e.symptoms).forEach(function(s) {
          counts[s] = (counts[s] || 0) + 1;
          if (!severities[s]) {
            severities[s] = {};
            sevLevels.forEach(function(l) { severities[s][l.key] = 0; });
          }
          var sev = e.symptoms[s];
          if (severities[s][sev] !== undefined) severities[s][sev]++;
        });
      }
    });

    var sorted = Object.keys(counts).map(function(s) {
      return { name: s, count: counts[s], severities: severities[s] };
    });
    sorted.sort(function(a, b) { return b.count - a.count; });
    return sorted;
  }

  function buildMedicationAdherence(entries, dateKeys) {
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

  function buildCycleOverview(entries, dateKeys) {
    var phases = {};
    dateKeys.forEach(function(d) {
      var e = entries[d];
      if (e.cyclePhase) {
        phases[e.cyclePhase] = (phases[e.cyclePhase] || 0) + 1;
      }
    });
    return Object.keys(phases).map(function(p) {
      return { phase: p, days: phases[p] };
    }).sort(function(a, b) { return b.days - a.days; });
  }

  function buildFeelingTrend(entries, dateKeys) {
    var data = [];
    dateKeys.forEach(function(d) {
      var e = entries[d];
      if (e.feeling > 0) {
        data.push({ date: d, feeling: e.feeling });
      }
    });
    return data;
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

  // --- Report HTML Builder ---

  function buildReportHtml(start, end) {
    var entries = Storage.getEntriesInRange(start, end);
    var dateKeys = Object.keys(entries).sort();

    if (dateKeys.length === 0) {
      return '<div class="report-empty">No entries found for this date range.</div>';
    }

    var stats = buildSummaryStats(entries, dateKeys);
    var symptoms = buildSymptomFrequency(entries, dateKeys);
    var meds = buildMedicationAdherence(entries, dateKeys);
    var cycle = buildCycleOverview(entries, dateKeys);
    var feelings = buildFeelingTrend(entries, dateKeys);
    var notes = buildNotesHighlights(entries, dateKeys);

    var html = '<div class="report-content" id="report-printable">';

    // Report header
    html += '<div class="report-header">';
    html += '<h3 class="report-title">' + escapeHtml(APP_CONFIG.name || 'Health Tracker') + ' Report</h3>';
    html += '<p class="report-period">' + formatDate(start) + ' to ' + formatDate(end) + '</p>';
    html += '<p class="report-generated">Generated: ' + formatDate(todayStr()) + '</p>';
    html += '</div>';

    // Summary stats
    html += '<section class="report-section" aria-labelledby="report-summary-heading">';
    html += '<h4 id="report-summary-heading" class="report-section-title">Summary</h4>';
    html += '<div class="report-stats-grid">';
    html += '<div class="report-stat"><span class="report-stat-value">' + stats.totalDays + '</span><span class="report-stat-label">Days Logged</span></div>';
    html += '<div class="report-stat"><span class="report-stat-value">' + stats.avgFeeling + '</span><span class="report-stat-label">Avg Feeling' + (stats.feelingLabel ? ' (' + escapeHtml(stats.feelingLabel) + ')' : '') + '</span></div>';
    html += '<div class="report-stat"><span class="report-stat-value">' + stats.symptomDays + '</span><span class="report-stat-label">Days with Symptoms</span></div>';
    html += '<div class="report-stat"><span class="report-stat-value">' + stats.avgSleep + '</span><span class="report-stat-label">Avg Sleep (hrs)</span></div>';
    html += '</div>';
    html += '</section>';

    // Symptom frequency
    if (symptoms.length > 0) {
      var sevLevels = getSeverityKeys();
      html += '<section class="report-section" aria-labelledby="report-symptoms-heading">';
      html += '<h4 id="report-symptoms-heading" class="report-section-title">Symptom Frequency</h4>';
      html += '<div class="report-table-wrapper"><table class="report-table" aria-label="Symptom frequency table">';
      html += '<thead><tr><th>Symptom</th><th>Days</th>';
      sevLevels.forEach(function(l) { html += '<th>' + escapeHtml(l.label) + '</th>'; });
      html += '</tr></thead>';
      html += '<tbody>';
      symptoms.forEach(function(s) {
        html += '<tr>';
        html += '<td>' + escapeHtml(s.name) + '</td>';
        html += '<td>' + s.count + '</td>';
        sevLevels.forEach(function(l) { html += '<td>' + (s.severities[l.key] || 0) + '</td>'; });
        html += '</tr>';
      });
      html += '</tbody></table></div>';
      html += '</section>';
    }

    // Medication adherence / Habit consistency
    if (meds.length > 0) {
      var isHabitReport = APP_CONFIG.variant === 'habit';
      html += '<section class="report-section" aria-labelledby="report-meds-heading">';
      html += '<h4 id="report-meds-heading" class="report-section-title">' + (isHabitReport ? 'Habit Consistency' : 'Medication Adherence') + '</h4>';
      html += '<div class="report-table-wrapper"><table class="report-table" aria-label="' + (isHabitReport ? 'Habit consistency' : 'Medication adherence') + ' table">';
      html += '<thead><tr><th>' + (isHabitReport ? 'Habit' : 'Medication') + '</th><th>' + (isHabitReport ? 'Done' : 'Taken') + '</th><th>Skipped</th><th>Logged</th><th>Rate</th></tr></thead>';
      html += '<tbody>';
      meds.forEach(function(m) {
        html += '<tr>';
        html += '<td>' + escapeHtml(m.name) + '</td>';
        html += '<td>' + m.taken + '</td>';
        html += '<td>' + m.skipped + '</td>';
        html += '<td>' + m.total + '</td>';
        html += '<td>' + m.pct + '%</td>';
        html += '</tr>';
      });
      html += '</tbody></table></div>';
      html += '</section>';
    }

    // Cycle overview
    if (cycle.length > 0) {
      html += '<section class="report-section" aria-labelledby="report-cycle-heading">';
      html += '<h4 id="report-cycle-heading" class="report-section-title">Cycle Overview</h4>';
      html += '<div class="report-table-wrapper"><table class="report-table" aria-label="Cycle phase table">';
      html += '<thead><tr><th>Phase</th><th>Days</th></tr></thead>';
      html += '<tbody>';
      cycle.forEach(function(c) {
        html += '<tr><td>' + escapeHtml(c.phase) + '</td><td>' + c.days + '</td></tr>';
      });
      html += '</tbody></table></div>';
      html += '</section>';
    }

    // Feeling trend
    if (feelings.length > 0) {
      html += '<section class="report-section" aria-labelledby="report-feeling-heading">';
      html += '<h4 id="report-feeling-heading" class="report-section-title">Feeling Trend</h4>';
      html += '<div class="report-table-wrapper"><table class="report-table" aria-label="Feeling trend table">';
      html += '<thead><tr><th>Date</th><th>Feeling</th></tr></thead>';
      html += '<tbody>';
      var scale = APP_CONFIG.feelingScale || [];
      feelings.forEach(function(f) {
        var label = String(f.feeling);
        scale.forEach(function(s) { if (s.value === f.feeling) label = s.label + ' (' + f.feeling + ')'; });
        html += '<tr><td>' + formatDate(f.date) + '</td><td>' + escapeHtml(label) + '</td></tr>';
      });
      html += '</tbody></table></div>';
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

    // Medical disclaimer
    html += '<div class="report-disclaimer">';
    html += '<p>This report is for informational purposes only. It is not a medical diagnosis. Please consult your healthcare provider.</p>';
    html += '</div>';

    html += '</div>';
    return html;
  }

  // --- Plain-Text Builder (for clipboard export) ---

  function buildPlainText(start, end) {
    var entries = Storage.getEntriesInRange(start, end);
    var dateKeys = Object.keys(entries).sort();

    if (dateKeys.length === 0) return 'No entries found for this date range.';

    var stats = buildSummaryStats(entries, dateKeys);
    var symptoms = buildSymptomFrequency(entries, dateKeys);
    var meds = buildMedicationAdherence(entries, dateKeys);
    var cycle = buildCycleOverview(entries, dateKeys);
    var feelings = buildFeelingTrend(entries, dateKeys);
    var notes = buildNotesHighlights(entries, dateKeys);

    var lines = [];
    lines.push((APP_CONFIG.name || 'Health Tracker') + ' Report');
    lines.push('Period: ' + formatDate(start) + ' to ' + formatDate(end));
    lines.push('Generated: ' + formatDate(todayStr()));
    lines.push('');

    lines.push('--- Summary ---');
    lines.push('Days Logged: ' + stats.totalDays);
    lines.push('Avg Feeling: ' + stats.avgFeeling + (stats.feelingLabel ? ' (' + stats.feelingLabel + ')' : ''));
    lines.push('Days with Symptoms: ' + stats.symptomDays);
    lines.push('Avg Sleep: ' + stats.avgSleep + ' hrs');
    lines.push('');

    if (symptoms.length > 0) {
      var sevLevels = getSeverityKeys();
      lines.push('--- Symptom Frequency ---');
      symptoms.forEach(function(s) {
        var parts = sevLevels.map(function(l) { return l.label.toLowerCase() + ': ' + (s.severities[l.key] || 0); });
        lines.push(s.name + ': ' + s.count + ' days (' + parts.join(', ') + ')');
      });
      lines.push('');
    }

    if (meds.length > 0) {
      lines.push(APP_CONFIG.variant === 'habit' ? '--- Habit Consistency ---' : '--- Medication Adherence ---');
      meds.forEach(function(m) {
        lines.push(m.name + ': ' + m.taken + '/' + m.total + ' (' + m.pct + '%)');
      });
      lines.push('');
    }

    if (cycle.length > 0) {
      lines.push('--- Cycle Overview ---');
      cycle.forEach(function(c) {
        lines.push(c.phase + ': ' + c.days + ' days');
      });
      lines.push('');
    }

    if (feelings.length > 0) {
      var scale = APP_CONFIG.feelingScale || [];
      lines.push('--- Feeling Trend ---');
      feelings.forEach(function(f) {
        var label = String(f.feeling);
        scale.forEach(function(s) { if (s.value === f.feeling) label = s.label + ' (' + f.feeling + ')'; });
        lines.push(formatDate(f.date) + ': ' + label);
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
    lines.push('This report is for informational purposes only. It is not a medical diagnosis. Please consult your healthcare provider.');

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
    rows.push(['Date', 'Feeling', 'Symptoms', 'Symptom Severities', 'Triggers', 'Medications', 'Sleep Hours', 'Sleep Quality', 'Exercise Type', 'Exercise Duration', 'Cycle Phase', 'Notes'].join(','));

    var scale = APP_CONFIG.feelingScale || [];

    dateKeys.forEach(function(d) {
      var e = entries[d];
      var feelingLabel = '';
      if (e.feeling > 0) {
        scale.forEach(function(s) { if (s.value === e.feeling) feelingLabel = s.label; });
        feelingLabel = feelingLabel || String(e.feeling);
      }

      var symptomNames = e.symptoms ? Object.keys(e.symptoms).join('; ') : '';
      var symptomSevs = e.symptoms ? Object.keys(e.symptoms).map(function(s) { return s + ':' + e.symptoms[s]; }).join('; ') : '';
      var triggers = Array.isArray(e.triggers) ? e.triggers.join('; ') : '';
      var meds = e.medications ? Object.keys(e.medications).map(function(m) { return m + ':' + e.medications[m]; }).join('; ') : '';
      var sleepH = e.sleep ? (e.sleep.hours || '') : '';
      var sleepQ = e.sleep ? (e.sleep.quality || '') : '';
      var exType = e.exercise ? (e.exercise.type || '') : '';
      var exDur = e.exercise ? (e.exercise.duration || '') : '';
      var cyclePhase = e.cyclePhase || '';
      var notes = e.notes || '';

      rows.push([
        csvEscape(d),
        csvEscape(feelingLabel),
        csvEscape(symptomNames),
        csvEscape(symptomSevs),
        csvEscape(triggers),
        csvEscape(meds),
        csvEscape(sleepH),
        csvEscape(sleepQ),
        csvEscape(exType),
        csvEscape(exDur),
        csvEscape(cyclePhase),
        csvEscape(notes)
      ].join(','));
    });

    var csv = rows.join('\n');
    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = (APP_CONFIG.variant || 'health') + '-data-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // --- Render ---

  function render() {
    var container = document.getElementById('view-reports');
    if (!container) return;

    if (!startDate) {
      startDate = subtractDays(todayStr(), 29);
      endDate = todayStr();
    }

    var entryCount = Storage.getEntryCount();

    var html = '<div class="reports-view">';
    html += '<h2 class="reports-heading">Reports &amp; Data</h2>';

    // Date range selector
    html += '<div class="report-range-section">';
    html += '<div class="report-range-row">';
    html += '<label for="report-start">From</label>';
    html += '<input type="date" id="report-start" value="' + escapeHtml(startDate) + '" aria-label="Report start date">';
    html += '<label for="report-end">To</label>';
    html += '<input type="date" id="report-end" value="' + escapeHtml(endDate) + '" aria-label="Report end date">';
    html += '</div>';
    html += '<div class="report-actions-bar">';
    html += '<button type="button" id="report-generate" class="btn btn-primary" aria-label="Generate report">Generate Report</button>';
    html += '</div>';
    html += '</div>';

    // Report output area
    html += '<div id="report-output">';
    html += buildReportHtml(startDate, endDate);
    html += '</div>';

    // Action buttons (below report)
    if (entryCount > 0) {
      html += '<div class="report-export-bar">';
      html += '<button type="button" id="report-print" class="btn btn-outline" aria-label="Print report">';
      html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" fill="none" stroke="currentColor" stroke-width="2"/><rect x="6" y="14" width="12" height="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
      html += 'Print Report</button>';
      html += '<button type="button" id="report-copy-text" class="btn btn-outline" aria-label="Copy report as text">';
      html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
      html += 'Copy as Text</button>';
      html += '<button type="button" id="report-csv" class="btn btn-outline" aria-label="Export all data as CSV">';
      html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="none" stroke="currentColor" stroke-width="2"/><polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
      html += 'Export CSV</button>';
      html += '<button type="button" id="report-backup" class="btn btn-outline" aria-label="Download JSON backup">';
      html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      html += 'Backup (JSON)</button>';
      html += '<label class="btn btn-outline report-restore-label" tabindex="0" role="button" aria-label="Restore from JSON backup">';
      html += '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style="margin-right:0.375rem"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      html += 'Restore (JSON)';
      html += '<input type="file" id="report-restore-input" accept=".json" hidden aria-hidden="true">';
      html += '</label>';
      html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;
    bindEvents();
  }

  function showToast(msg) {
    var existing = document.querySelector('.toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function() {
      toast.classList.add('visible');
    });
    setTimeout(function() {
      toast.classList.remove('visible');
      setTimeout(function() { toast.remove(); }, 300);
    }, 2000);
  }

  function bindEvents() {
    var genBtn = document.getElementById('report-generate');
    if (genBtn) {
      genBtn.addEventListener('click', function() {
        var s = document.getElementById('report-start');
        var e = document.getElementById('report-end');
        if (s && e && s.value && e.value) {
          startDate = s.value;
          endDate = e.value;
          if (startDate > endDate) {
            var tmp = startDate;
            startDate = endDate;
            endDate = tmp;
          }
          var output = document.getElementById('report-output');
          if (output) {
            output.innerHTML = buildReportHtml(startDate, endDate);
          }
        }
      });
    }

    var printBtn = document.getElementById('report-print');
    if (printBtn) {
      printBtn.addEventListener('click', function() {
        window.print();
      });
    }

    var copyBtn = document.getElementById('report-copy-text');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        var text = buildPlainText(startDate, endDate);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function() {
            showToast('Report copied to clipboard');
          }, function() {
            fallbackCopy(text);
          });
        } else {
          fallbackCopy(text);
        }
      });
    }

    var csvBtn = document.getElementById('report-csv');
    if (csvBtn) {
      csvBtn.addEventListener('click', exportCsv);
    }

    var backupBtn = document.getElementById('report-backup');
    if (backupBtn) {
      backupBtn.addEventListener('click', function() {
        Storage.downloadBackup();
        showToast('Backup downloaded');
      });
    }

    var restoreInput = document.getElementById('report-restore-input');
    var restoreLabel = document.querySelector('.report-restore-label');
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
      showToast('Could not copy — try manually');
    }
    document.body.removeChild(ta);
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
