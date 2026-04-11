// === 40-Week Timeline Module ===
var Timeline = (function() {
  'use strict';

  var selectedWeek = 0;

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }

  // Week-by-week development summaries (condensed)
  var weekInfo = {
    1: { dev: 'Conception occurs. The fertilized egg begins dividing.', mom: 'You may not know yet. Normal period expected timing.' },
    2: { dev: 'The blastocyst implants in the uterine wall.', mom: 'Some may notice light spotting (implantation bleeding).' },
    3: { dev: 'The embryo is forming. Neural tube begins developing.', mom: 'Early hormonal changes begin. Some notice fatigue.' },
    4: { dev: 'Heart begins to form and beat. Arm and leg buds appear.', mom: 'Missed period. Positive pregnancy test possible.' },
    5: { dev: 'Brain and spinal cord developing rapidly. Heart beats regularly.', mom: 'Morning sickness may begin. Breast tenderness.' },
    6: { dev: 'Facial features forming. Tiny fingers and toes.', mom: 'Fatigue, nausea, frequent urination common.' },
    7: { dev: 'Bones beginning to form. Brain growing rapidly.', mom: 'Food aversions and cravings may start.' },
    8: { dev: 'All major organs forming. Fingers and toes separating.', mom: 'First prenatal visit often scheduled around now.' },
    9: { dev: 'Muscles developing. Can make small movements.', mom: 'Morning sickness may peak. Mood changes.' },
    10: { dev: 'Vital organs fully formed. Officially a fetus.', mom: 'Fatigue may ease slightly. Uterus growing.' },
    11: { dev: 'Bones hardening. Tooth buds forming.', mom: 'Skin changes possible. Increased blood volume.' },
    12: { dev: 'Reflexes developing. Can open and close fingers.', mom: 'Nausea often begins to ease. First trimester screening.' },
    13: { dev: 'Vocal cords forming. Intestines move into abdomen.', mom: 'End of first trimester. Energy may return.' },
    14: { dev: 'Facial expressions possible. Can suck thumb.', mom: 'Welcome to second trimester. "Golden period" begins.' },
    15: { dev: 'Ears moving to final position. Sensing light.', mom: 'Appetite may increase. Round ligament pain.' },
    16: { dev: 'Patterned movements. Circulatory system working.', mom: 'You may feel first flutters (quickening).' },
    17: { dev: 'Fat beginning to form. Skeleton hardening.', mom: 'Growing belly visible. May need maternity clothes.' },
    18: { dev: 'Ears functional. Baby can hear your heartbeat.', mom: 'Anatomy scan often scheduled (18-20 weeks).' },
    19: { dev: 'Vernix coating forming to protect skin.', mom: 'May notice skin changes. Balance shifting.' },
    20: { dev: 'Halfway there! Taste buds working. Active movements.', mom: 'Anatomy scan. Movements more noticeable.' },
    21: { dev: 'Eyebrows and eyelids formed. Bone marrow making blood cells.', mom: 'Increasing appetite. Braxton Hicks may start.' },
    22: { dev: 'Grip strength developing. Lungs developing.', mom: 'Backaches common. Swelling may begin.' },
    23: { dev: 'Hearing more developed. Responds to sounds.', mom: 'Weight gain steady. Glucose screening soon.' },
    24: { dev: 'Lungs developing surfactant. Gaining weight steadily.', mom: 'Viability milestone. Glucose screening test.' },
    25: { dev: 'Startle reflex developed. Hair growing.', mom: 'Shortness of breath may increase.' },
    26: { dev: 'Eyes opening. Brain wave patterns for sleep cycles.', mom: 'Third trimester approaching. Braxton Hicks.' },
    27: { dev: 'Lungs and brain developing rapidly.', mom: 'Last week of second trimester.' },
    28: { dev: 'Eyes can open and close. Dreaming during sleep.', mom: 'Third trimester begins. Kick counts recommended.' },
    29: { dev: 'Bones fully developed but still soft. Gaining weight.', mom: 'Frequent urination returns. Heartburn.' },
    30: { dev: 'Red blood cells forming in bone marrow.', mom: 'Fatigue may return. Practice breathing.' },
    31: { dev: 'Brain developing rapidly. Processing information.', mom: 'Shortness of breath. Leg cramps at night.' },
    32: { dev: 'Practicing breathing movements. Toenails visible.', mom: 'Hospital bag time. Prenatal visits more frequent.' },
    33: { dev: 'Skull bones still flexible for birth. Immune system developing.', mom: 'Difficulty sleeping common. Nesting instinct.' },
    34: { dev: 'Central nervous system maturing. Fat layers increasing.', mom: 'Pelvic pressure increasing. Discuss birth plan.' },
    35: { dev: 'Most internal development complete. Gaining weight.', mom: 'Baby may drop lower (lightening). More frequent visits.' },
    36: { dev: 'Skin smooth. Ready position for birth.', mom: 'Weekly prenatal visits begin. Contraction monitoring.' },
    37: { dev: 'Full term! Organs ready to function independently.', mom: 'Baby could come anytime. Rest when you can.' },
    38: { dev: 'Firm grasp. Organs fully mature.', mom: 'Watch for labor signs. Cervical changes.' },
    39: { dev: 'Brain and lungs continue maturing. Ready for birth.', mom: 'Due date approaching. Contractions may increase.' },
    40: { dev: 'Fully developed and ready. Average birth weight 7-8 lbs.', mom: 'Due date! Baby will arrive when ready.' }
  };

  function getWeekEntries(weekNum) {
    var due = PregnancyStorage.getDueDate();
    if (!due) return {};
    var parts = due.split('-');
    var dueDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var conceptionDate = new Date(dueDate.getTime() - 280 * 86400000);
    var weekStart = new Date(conceptionDate.getTime() + (weekNum - 1) * 7 * 86400000);
    var weekEnd = new Date(weekStart.getTime() + 6 * 86400000);

    var startStr = weekStart.getFullYear() + '-' + String(weekStart.getMonth() + 1).padStart(2, '0') + '-' + String(weekStart.getDate()).padStart(2, '0');
    var endStr = weekEnd.getFullYear() + '-' + String(weekEnd.getMonth() + 1).padStart(2, '0') + '-' + String(weekEnd.getDate()).padStart(2, '0');
    return Storage.getEntriesInRange(startStr, endStr);
  }

  function render() {
    var container = document.getElementById('timeline-container');
    if (!container) return;

    var dueDate = PregnancyStorage.getDueDate();
    if (!dueDate) {
      container.innerHTML = '<div class="chart-empty"><p>Set your due date in Settings to see your 40-week timeline.</p></div>';
      return;
    }

    var currentWeek = PregnancyStorage.getCurrentWeek();
    var babySizes = APP_CONFIG.babySizes || [];
    var html = '';

    // Timeline strip
    html += '<h2 style="font-size:1.25rem;font-weight:600;color:var(--text);margin-bottom:0.5rem">Your 40-week journey</h2>';
    html += '<div class="timeline-scroll" role="region" aria-label="Week timeline">';
    html += '<div class="timeline-track">';

    var trimesterBreaks = [1, 14, 28];
    var trimesterLabels = ['First trimester', 'Second trimester', 'Third trimester'];

    for (var w = 1; w <= 40; w++) {
      var tIdx = trimesterBreaks.indexOf(w);
      if (tIdx !== -1) {
        html += '<div class="timeline-trimester-label" style="color:var(--trimester-' + (tIdx + 1) + ')">' + trimesterLabels[tIdx] + '</div>';
      }

      var classes = 'timeline-week';
      if (w < currentWeek) classes += ' completed';
      if (w === currentWeek) classes += ' current';
      var entries = getWeekEntries(w);
      if (Object.keys(entries).length > 0) classes += ' has-data';

      var trimColor = w <= 13 ? 'var(--trimester-1)' : w <= 27 ? 'var(--trimester-2)' : 'var(--trimester-3)';
      var borderStyle = w === currentWeek ? 'border-color:' + trimColor : '';

      html += '<button type="button" class="' + classes + '" data-week="' + w + '" ' +
        'aria-label="Week ' + w + (babySizes[w] ? ', ' + babySizes[w] : '') + '"' +
        (borderStyle ? ' style="' + borderStyle + '"' : '') + '>' +
        '<span class="timeline-week-num">' + w + '</span>';
      if (babySizes[w]) {
        html += '<span class="timeline-week-size">' + escapeHtml(babySizes[w]) + '</span>';
      }
      html += '</button>';
    }

    html += '</div></div>';

    // Detail panel
    var showWeek = selectedWeek || currentWeek;
    if (showWeek >= 1 && showWeek <= 40) {
      var info = weekInfo[showWeek] || { dev: '', mom: '' };
      var size = babySizes[showWeek] || '';
      var trimester = showWeek <= 13 ? 1 : showWeek <= 27 ? 2 : 3;
      var trimesterName = ['First', 'Second', 'Third'][trimester - 1] + ' trimester';

      html += '<div class="timeline-detail">';
      html += '<div class="timeline-detail-title">Week ' + showWeek + '</div>';
      html += '<div class="timeline-detail-subtitle">' + trimesterName + (size ? ' \u2022 Baby is about the size of a ' + escapeHtml(size.toLowerCase()) : '') + '</div>';

      if (info.dev) {
        html += '<div class="timeline-detail-section"><h4>Baby\'s development</h4><p>' + escapeHtml(info.dev) + '</p></div>';
      }
      if (info.mom) {
        html += '<div class="timeline-detail-section"><h4>What you might feel</h4><p>' + escapeHtml(info.mom) + '</p></div>';
      }

      // Show logged data for this week
      var entries = getWeekEntries(showWeek);
      var entryKeys = Object.keys(entries).sort();
      if (entryKeys.length > 0) {
        html += '<div class="timeline-detail-section"><h4>Your logs this week</h4><ul>';
        entryKeys.forEach(function(date) {
          var e = entries[date];
          var parts = [];
          if (e.feeling) {
            var levels = APP_CONFIG.wellnessLevels || [];
            for (var i = 0; i < levels.length; i++) {
              if (levels[i].value === e.feeling) { parts.push('Feeling: ' + levels[i].label); break; }
            }
          }
          if (Array.isArray(e.symptoms) && e.symptoms.length > 0) {
            parts.push(e.symptoms.join(', '));
          }
          var dateParts = date.split('-');
          var dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
          var formatted = dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
          html += '<li><strong>' + formatted + '</strong>: ' + (parts.length > 0 ? escapeHtml(parts.join(' \u2022 ')) : 'Entry logged') + '</li>';
        });
        html += '</ul></div>';
      }

      html += '</div>';
    }

    container.innerHTML = html;

    // Scroll current week into view
    setTimeout(function() {
      var currentBtn = container.querySelector('.timeline-week.current');
      if (currentBtn) {
        currentBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, 100);

    // Bind week clicks
    container.querySelectorAll('.timeline-week').forEach(function(btn) {
      btn.addEventListener('click', function() {
        selectedWeek = parseInt(this.getAttribute('data-week'));
        render();
      });
    });
  }

  function init() {
    render();
    document.addEventListener('viewchange', function(e) {
      if (e.detail.view === 'timeline') render();
    });
  }

  return { init: init };
})();
