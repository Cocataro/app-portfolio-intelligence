// === Insights Module ===
var Insights = (function() {
  'use strict';

  var MIN_DAYS = 7;

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function getAllEntries() {
    return Storage.getAllEntries();
  }

  function countEntries(entries) {
    return Object.keys(entries).length;
  }

  // --- Insight Generators ---

  function sleepSymptomCorrelation(entries) {
    var lowSleepDays = [];
    var okSleepDays = [];

    Object.keys(entries).forEach(function(d) {
      var e = entries[d];
      if (e.sleep && e.sleep.hours > 0) {
        if (e.sleep.hours < 6) {
          lowSleepDays.push(e);
        } else {
          okSleepDays.push(e);
        }
      }
    });

    if (lowSleepDays.length < 3) return null;

    var lowSymptomCount = 0;
    var okSymptomCount = 0;

    lowSleepDays.forEach(function(e) {
      if (e.symptoms) lowSymptomCount += Object.keys(e.symptoms).length;
    });
    okSleepDays.forEach(function(e) {
      if (e.symptoms) okSymptomCount += Object.keys(e.symptoms).length;
    });

    var lowAvg = lowSleepDays.length > 0 ? (lowSymptomCount / lowSleepDays.length).toFixed(1) : 0;
    var okAvg = okSleepDays.length > 0 ? (okSymptomCount / okSleepDays.length).toFixed(1) : 0;

    if (parseFloat(lowAvg) <= parseFloat(okAvg)) return null;

    return {
      id: 'sleep-symptom-correlation',
      title: 'Sleep and symptom patterns',
      body: 'On nights with less than 6 hours of sleep, you logged an average of ' + lowAvg + ' symptoms the next day, compared to ' + okAvg + ' on better-rested days (' + lowSleepDays.length + ' low-sleep days observed).',
      confidence: Math.min(lowSleepDays.length / 10, 1)
    };
  }

  function triggerRanking(entries) {
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

    if (sorted.length === 0) return null;

    var top3 = sorted.slice(0, 3);
    var parts = top3.map(function(t) { return t.name + ' (' + t.count + 'x)'; });

    return {
      id: 'trigger-frequency',
      title: 'Most common triggers',
      body: 'Your top trigger' + (top3.length > 1 ? 's' : '') + ' this period: ' + parts.join(', ') + '.',
      confidence: Math.min(sorted[0].count / 8, 1)
    };
  }

  function cycleSymptomMap(entries) {
    var phaseSymptoms = {};

    Object.keys(entries).forEach(function(d) {
      var e = entries[d];
      if (e.cyclePhase && e.symptoms && typeof e.symptoms === 'object') {
        if (!phaseSymptoms[e.cyclePhase]) phaseSymptoms[e.cyclePhase] = {};
        Object.keys(e.symptoms).forEach(function(s) {
          phaseSymptoms[e.cyclePhase][s] = (phaseSymptoms[e.cyclePhase][s] || 0) + 1;
        });
      }
    });

    var phases = Object.keys(phaseSymptoms);
    if (phases.length < 2) return null;

    var lines = [];
    phases.forEach(function(phase) {
      var symptoms = phaseSymptoms[phase];
      var sorted = Object.keys(symptoms).map(function(s) { return { name: s, count: symptoms[s] }; });
      sorted.sort(function(a, b) { return b.count - a.count; });
      var top = sorted.slice(0, 3).map(function(s) { return s.name; });
      if (top.length > 0) {
        lines.push('<strong>' + escapeHtml(phase) + '</strong>: ' + top.map(function(s) { return escapeHtml(s); }).join(', '));
      }
    });

    if (lines.length === 0) return null;

    return {
      id: 'cycle-symptom-map',
      title: 'Symptoms by cycle phase',
      body: lines.join('<br>'),
      confidence: Math.min(phases.length / 4, 1)
    };
  }

  function medicationAdherence(entries) {
    var isHabit = APP_CONFIG.variant === 'habit';
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

    if (items.length === 0) return null;

    var lines = items.map(function(item) {
      return escapeHtml(item.name) + ': logged ' + item.taken + ' of ' + item.total + ' days (' + item.pct + '%)';
    });

    return {
      id: 'medication-adherence',
      title: isHabit ? 'Habit consistency' : 'Medication consistency',
      body: lines.join('<br>'),
      confidence: Math.min(items[0].total / 14, 1)
    };
  }

  function habitImpactOnFeeling(entries) {
    if (APP_CONFIG.variant !== 'habit') return null;

    var highCompletionDays = [];
    var lowCompletionDays = [];

    Object.keys(entries).forEach(function(d) {
      var e = entries[d];
      if (!e.feeling || e.feeling === 0) return;
      if (!e.medications || typeof e.medications !== 'object') return;

      var total = Object.keys(e.medications).length;
      if (total === 0) return;
      var taken = 0;
      Object.keys(e.medications).forEach(function(m) {
        if (e.medications[m] === 'taken') taken++;
      });
      var pct = taken / total;

      if (pct >= 0.7) {
        highCompletionDays.push(e.feeling);
      } else if (pct < 0.4) {
        lowCompletionDays.push(e.feeling);
      }
    });

    if (highCompletionDays.length < 3 || lowCompletionDays.length < 3) return null;

    var avgHigh = highCompletionDays.reduce(function(a, b) { return a + b; }, 0) / highCompletionDays.length;
    var avgLow = lowCompletionDays.reduce(function(a, b) { return a + b; }, 0) / lowCompletionDays.length;

    if (avgHigh <= avgLow + 0.3) return null;

    return {
      id: 'habit-feeling-correlation',
      title: 'Habits and how you feel',
      body: 'On days you completed 70%+ of your habits, your average feeling was ' + avgHigh.toFixed(1) + '/5. On days below 40%, it was ' + avgLow.toFixed(1) + '/5 (' + highCompletionDays.length + ' high-completion days, ' + lowCompletionDays.length + ' low-completion days).',
      confidence: Math.min((highCompletionDays.length + lowCompletionDays.length) / 15, 1)
    };
  }

  function feelingTrend(entries) {
    var dates = Object.keys(entries).filter(function(d) {
      return entries[d].feeling > 0;
    });
    dates.sort();

    if (dates.length < 7) return null;

    var half = Math.floor(dates.length / 2);
    var firstHalf = dates.slice(0, half);
    var secondHalf = dates.slice(half);

    var avg = function(arr) {
      var sum = 0;
      arr.forEach(function(d) { sum += entries[d].feeling; });
      return arr.length > 0 ? sum / arr.length : 0;
    };

    var avgFirst = avg(firstHalf);
    var avgSecond = avg(secondHalf);
    var diff = avgSecond - avgFirst;

    if (Math.abs(diff) < 0.3) return null;

    var direction = diff > 0 ? 'improving' : 'declining';
    var body = 'Your average feeling has been ' + direction + ' — from ' + avgFirst.toFixed(1) + ' in the first half of this period to ' + avgSecond.toFixed(1) + ' in the second half.';

    return {
      id: 'feeling-trend',
      title: 'Feeling trend',
      body: body,
      confidence: Math.min(dates.length / 20, 1)
    };
  }

  function triggerSymptomCorrelation(entries) {
    var triggerDays = {};
    var noTriggerSymptoms = { count: 0, symptoms: 0 };

    Object.keys(entries).forEach(function(d) {
      var e = entries[d];
      var symptomCount = e.symptoms ? Object.keys(e.symptoms).length : 0;

      if (Array.isArray(e.triggers) && e.triggers.length > 0) {
        e.triggers.forEach(function(t) {
          if (!triggerDays[t]) triggerDays[t] = { count: 0, symptoms: 0 };
          triggerDays[t].count++;
          triggerDays[t].symptoms += symptomCount;
        });
      } else {
        noTriggerSymptoms.count++;
        noTriggerSymptoms.symptoms += symptomCount;
      }
    });

    var baseAvg = noTriggerSymptoms.count > 0 ? noTriggerSymptoms.symptoms / noTriggerSymptoms.count : 0;
    var insights = [];

    Object.keys(triggerDays).forEach(function(t) {
      var td = triggerDays[t];
      if (td.count >= 3) {
        var avg = td.symptoms / td.count;
        if (avg > baseAvg + 0.5) {
          insights.push({ trigger: t, avg: avg, count: td.count });
        }
      }
    });

    insights.sort(function(a, b) { return b.avg - a.avg; });
    if (insights.length === 0) return null;

    var top = insights.slice(0, 3);
    var lines = top.map(function(item) {
      return 'Days with <strong>' + escapeHtml(item.trigger) + '</strong> averaged ' + item.avg.toFixed(1) + ' symptoms (' + item.count + ' days)';
    });

    return {
      id: 'trigger-symptom-correlation',
      title: 'Triggers linked to more symptoms',
      body: lines.join('<br>') + '<br>Compared to ' + baseAvg.toFixed(1) + ' symptoms on trigger-free days.',
      confidence: Math.min(top[0].count / 8, 1)
    };
  }

  // --- Render ---

  function render() {
    var container = document.getElementById('view-insights');
    if (!container) return;

    var entries = getAllEntries();
    var total = countEntries(entries);

    var html = '<div class="insights-view">';
    html += '<h2 class="insights-heading">Smart Insights</h2>';

    if (total < MIN_DAYS) {
      html += '<div class="insights-placeholder">';
      html += '<div class="insights-placeholder-icon" aria-hidden="true"><svg viewBox="0 0 48 48" width="48" height="48"><path d="M24 4a7 7 0 015 11.9V19a1 1 0 01-1 1h-8a1 1 0 01-1-1v-3.1A7 7 0 0124 4z" fill="none" stroke="var(--primary-light)" stroke-width="2"/><line x1="20" y1="24" x2="28" y2="24" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="28" x2="26" y2="28" stroke="var(--primary-light)" stroke-width="2" stroke-linecap="round"/></svg></div>';
      html += '<p class="insights-placeholder-text">Insights will appear after you have logged at least ' + MIN_DAYS + ' days.</p>';
      html += '<p class="insights-placeholder-count">You have logged <strong>' + total + '</strong> day' + (total !== 1 ? 's' : '') + ' so far. Keep going!</p>';
      html += '</div>';
    } else {
      html += '<p class="insights-summary">Based on ' + total + ' days of data</p>';

      // Generate all insights
      var allInsights = [
        feelingTrend(entries),
        triggerRanking(entries),
        sleepSymptomCorrelation(entries),
        triggerSymptomCorrelation(entries),
        cycleSymptomMap(entries),
        medicationAdherence(entries),
        habitImpactOnFeeling(entries)
      ].filter(function(i) { return i !== null; });

      // Sort by confidence descending
      allInsights.sort(function(a, b) { return b.confidence - a.confidence; });

      if (allInsights.length === 0) {
        html += '<div class="insights-placeholder">';
        html += '<p class="insights-placeholder-text">Not enough variation in your data to detect patterns yet. Keep logging and check back soon.</p>';
        html += '</div>';
      } else {
        html += '<div class="insights-cards">';
        allInsights.forEach(function(insight) {
          var confLabel = insight.confidence >= 0.7 ? 'High' : insight.confidence >= 0.4 ? 'Medium' : 'Low';
          var confClass = insight.confidence >= 0.7 ? 'high' : insight.confidence >= 0.4 ? 'medium' : 'low';
          html += '<article class="insight-card" aria-label="' + escapeHtml(insight.title) + '">';
          html += '<div class="insight-card-header">';
          html += '<h3 class="insight-card-title">' + escapeHtml(insight.title) + '</h3>';
          html += '<span class="insight-confidence insight-confidence-' + confClass + '" aria-label="Confidence: ' + confLabel + '">' + confLabel + '</span>';
          html += '</div>';
          html += '<p class="insight-card-body">' + insight.body + '</p>';
          html += '</article>';
        });
        html += '</div>';
      }

      html += '<div class="insights-disclaimer">';
      html += '<p>These patterns are based on your self-reported data and are for informational purposes only. They are not medical advice. Discuss any concerns with your healthcare provider.</p>';
      html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;
  }

  function init() {
    document.addEventListener('viewchange', function(e) {
      if (e.detail && e.detail.view === 'insights') {
        render();
      }
    });
  }

  return { init: init };
})();
