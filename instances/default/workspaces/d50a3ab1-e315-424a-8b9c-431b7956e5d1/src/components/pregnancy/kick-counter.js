// === Kick Counter Module ===
var KickCounter = (function() {
  'use strict';

  var kicks = 0;
  var goal = 10;
  var startTime = null;
  var timerInterval = null;
  var isActive = false;

  function formatTime(ms) {
    var seconds = Math.floor(ms / 1000);
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function formatTimeShort(ms) {
    var seconds = Math.floor(ms / 1000);
    var m = Math.floor(seconds / 60);
    if (m < 60) return m + ' min';
    var h = Math.floor(m / 60);
    m = m % 60;
    return h + 'h ' + m + 'm';
  }

  function render(container) {
    var sessions = PregnancyStorage.getKickSessions();
    var elapsed = isActive && startTime ? Date.now() - startTime : 0;

    var html = '<h3 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem;color:var(--text);text-align:center">Kick counter</h3>' +
      '<p style="font-size:0.875rem;color:var(--text-secondary);text-align:center;margin-bottom:1rem">Count to ' + goal + ' kicks. Tap each time you feel a movement.</p>';

    html += '<div class="kick-counter">';

    // Count display
    html += '<div class="kick-count-display">' + kicks + ' of ' + goal + '</div>';
    html += '<div class="kick-progress-text">' + (kicks >= goal ? 'Goal reached!' : 'kicks counted') + '</div>';

    // Tap button
    html += '<button type="button" class="kick-tap-btn" id="kick-tap" aria-label="Record a kick">' +
      '<span style="font-size:1.5rem">Tap</span>' +
      '<span style="font-size:0.75rem">for each kick</span>' +
      '</button>';

    // Timer
    html += '<div class="kick-timer" id="kick-timer">' + formatTime(elapsed) + '</div>';

    // Actions
    html += '<div class="kick-actions">';
    if (!isActive) {
      html += '<button class="btn btn-primary btn-small" id="kick-start" aria-label="Start counting">New session</button>';
    } else {
      html += '<button class="btn btn-outline btn-small" id="kick-finish" aria-label="Finish session">Finish</button>';
    }
    html += '</div>';

    html += '</div>';

    // History
    if (sessions.length > 0) {
      html += '<div class="kick-history" style="margin:1rem auto">' +
        '<h4 style="font-size:0.875rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:0.5rem">Recent sessions</h4>';
      sessions.slice(0, 10).forEach(function(s) {
        var d = new Date(s.timestamp);
        var dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        var timeStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        html += '<div class="kick-session-item">' +
          '<span>' + dateStr + ' ' + timeStr + '</span>' +
          '<span>' + s.kicks + ' kicks in ' + formatTimeShort(s.duration) + '</span>' +
          '</div>';
      });
      html += '</div>';
    }

    container.innerHTML = html;

    // Bind tap
    var tapBtn = container.querySelector('#kick-tap');
    if (tapBtn) {
      tapBtn.addEventListener('click', function() {
        if (!isActive) {
          startSession();
          render(container);
          return;
        }
        kicks++;
        tapBtn.classList.add('kick-pulse');
        setTimeout(function() { tapBtn.classList.remove('kick-pulse'); }, 400);
        var countDisplay = container.querySelector('.kick-count-display');
        if (countDisplay) countDisplay.textContent = kicks + ' of ' + goal;
        var progressText = container.querySelector('.kick-progress-text');
        if (progressText) progressText.textContent = kicks >= goal ? 'Goal reached!' : 'kicks counted';
        if (kicks >= goal && isActive) {
          finishSession();
          render(container);
          Settings.showToast(goal + ' kicks recorded');
        }
      });
    }

    // Bind start
    var startBtn = container.querySelector('#kick-start');
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        startSession();
        render(container);
      });
    }

    // Bind finish
    var finishBtn = container.querySelector('#kick-finish');
    if (finishBtn) {
      finishBtn.addEventListener('click', function() {
        if (kicks > 0) finishSession();
        else stopSession();
        render(container);
      });
    }

    // Start timer update
    if (isActive) {
      startTimerUpdate(container);
    }
  }

  function startSession() {
    kicks = 0;
    startTime = Date.now();
    isActive = true;
  }

  function stopSession() {
    isActive = false;
    startTime = null;
    kicks = 0;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  function finishSession() {
    if (startTime && kicks > 0) {
      PregnancyStorage.saveKickSession({
        timestamp: startTime,
        kicks: kicks,
        duration: Date.now() - startTime
      });
    }
    isActive = false;
    startTime = null;
    kicks = 0;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
  }

  function startTimerUpdate(container) {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      var timerEl = container.querySelector('#kick-timer');
      if (timerEl && startTime) {
        timerEl.textContent = formatTime(Date.now() - startTime);
      }
    }, 1000);
  }

  return { render: render };
})();
