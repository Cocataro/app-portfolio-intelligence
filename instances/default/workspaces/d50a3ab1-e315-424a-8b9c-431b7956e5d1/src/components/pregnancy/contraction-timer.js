// === Contraction Timer Module ===
var ContractionTimer = (function() {
  'use strict';

  var contractions = []; // { start, end, duration }
  var currentStart = null;
  var isActive = false;
  var timerInterval = null;

  function formatDuration(ms) {
    var s = Math.floor(ms / 1000);
    var m = Math.floor(s / 60);
    s = s % 60;
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  }

  function formatTime(ts) {
    var d = new Date(ts);
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  function avgDuration() {
    if (contractions.length === 0) return 0;
    var sum = 0;
    contractions.forEach(function(c) { sum += c.duration; });
    return Math.round(sum / contractions.length);
  }

  function avgInterval() {
    if (contractions.length < 2) return 0;
    var intervals = [];
    for (var i = 1; i < contractions.length; i++) {
      intervals.push(contractions[i - 1].start - contractions[i].start);
    }
    var sum = 0;
    intervals.forEach(function(v) { sum += v; });
    return Math.round(sum / intervals.length);
  }

  function render(container) {
    var elapsed = isActive && currentStart ? Date.now() - currentStart : 0;

    var html = '<h3 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem;color:var(--text);text-align:center">Contraction timer</h3>';

    html += '<div class="contraction-timer">';

    // Timer display
    html += '<div class="contraction-display">' +
      '<div class="contraction-time" id="contraction-time">' + formatDuration(elapsed) + '</div>' +
      '<div class="contraction-label">' + (isActive ? 'Contraction in progress' : 'Tap start when a contraction begins') + '</div>' +
      '</div>';

    // Buttons
    html += '<div class="contraction-btns">';
    if (!isActive) {
      html += '<button class="contraction-start-btn" id="contraction-start" aria-label="Start contraction">Start contraction</button>';
    } else {
      html += '<button class="contraction-stop-btn" id="contraction-stop" aria-label="End contraction">End contraction</button>';
    }
    html += '</div>';

    // Stats
    if (contractions.length > 0) {
      var avgDur = avgDuration();
      var avgInt = avgInterval();
      html += '<div class="contraction-stats">' +
        '<div><div class="contraction-stat-value">' + contractions.length + '</div><div class="contraction-stat-label">Contractions</div></div>' +
        '<div><div class="contraction-stat-value">' + formatDuration(avgDur) + '</div><div class="contraction-stat-label">Avg duration</div></div>' +
        (avgInt > 0 ? '<div><div class="contraction-stat-value">' + formatDuration(avgInt) + '</div><div class="contraction-stat-label">Avg apart</div></div>' : '') +
        '</div>';
    }

    // 5-1-1 hint
    html += '<div class="contraction-hint">' +
      '<strong>When to call your provider:</strong> Contractions 5 minutes apart, lasting 1 minute each, for at least 1 hour (the 5-1-1 guideline). Always follow your care team\'s specific instructions.' +
      '</div>';

    // History
    if (contractions.length > 0) {
      html += '<div class="contraction-history">' +
        '<h4 style="font-size:0.875rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:0.5rem">This session</h4>';
      contractions.forEach(function(c, i) {
        var interval = '';
        if (i < contractions.length - 1) {
          interval = formatDuration(contractions[i].start - contractions[i + 1].start) + ' apart';
        }
        html += '<div class="contraction-history-item">' +
          '<span>' + formatTime(c.start) + '</span>' +
          '<span>' + formatDuration(c.duration) + '</span>' +
          '<span style="color:var(--text-muted)">' + interval + '</span>' +
          '</div>';
      });
      html += '</div>';

      html += '<div style="text-align:center;margin-top:1rem">' +
        '<button class="btn btn-outline btn-small" id="contraction-save" aria-label="Save session">Save session</button> ' +
        '<button class="btn btn-text btn-small" id="contraction-reset" aria-label="Reset">Reset</button>' +
        '</div>';
    }

    html += '</div>';

    container.innerHTML = html;

    // Bind start
    var startBtn = container.querySelector('#contraction-start');
    if (startBtn) {
      startBtn.addEventListener('click', function() {
        currentStart = Date.now();
        isActive = true;
        render(container);
        startTimerUpdate(container);
      });
    }

    // Bind stop
    var stopBtn = container.querySelector('#contraction-stop');
    if (stopBtn) {
      stopBtn.addEventListener('click', function() {
        if (currentStart) {
          contractions.unshift({
            start: currentStart,
            end: Date.now(),
            duration: Date.now() - currentStart
          });
        }
        isActive = false;
        currentStart = null;
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        render(container);
      });
    }

    // Bind save
    var saveBtn = container.querySelector('#contraction-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        PregnancyStorage.saveContractionSession({
          timestamp: Date.now(),
          contractions: contractions.slice(),
          avgDuration: avgDuration(),
          avgInterval: avgInterval()
        });
        contractions = [];
        render(container);
        Settings.showToast('Session saved');
      });
    }

    // Bind reset
    var resetBtn = container.querySelector('#contraction-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        contractions = [];
        isActive = false;
        currentStart = null;
        if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
        render(container);
      });
    }

    if (isActive) startTimerUpdate(container);
  }

  function startTimerUpdate(container) {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function() {
      var el = container.querySelector('#contraction-time');
      if (el && currentStart) {
        el.textContent = formatDuration(Date.now() - currentStart);
      }
    }, 1000);
  }

  return { render: render };
})();
