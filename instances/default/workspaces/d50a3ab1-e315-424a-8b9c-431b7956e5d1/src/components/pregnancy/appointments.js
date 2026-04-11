// === Appointments Module ===
var Appointments = (function() {
  'use strict';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }

  function todayStr() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function formatDate(dateStr) {
    var parts = dateStr.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  function daysUntil(dateStr) {
    var parts = dateStr.split('-');
    var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return Math.ceil((d.getTime() - now.getTime()) / 86400000);
  }

  function render(container) {
    var appts = PregnancyStorage.getAppointments();
    var today = todayStr();
    var upcoming = appts.filter(function(a) { return a.date >= today; });
    var past = appts.filter(function(a) { return a.date < today; });

    var html = '<h3 style="font-size:1.125rem;font-weight:600;margin-bottom:1rem;color:var(--text)">Prenatal appointments</h3>';

    // Add form
    html += '<div class="appt-form" style="margin-bottom:1rem">' +
      '<div class="appt-form-row"><label for="appt-date">Date</label><input type="date" id="appt-date" value="' + today + '"></div>' +
      '<div class="appt-form-row"><label for="appt-type">Type</label>' +
        '<select id="appt-type"><option value="Routine checkup">Routine checkup</option><option value="Ultrasound">Ultrasound</option><option value="Glucose test">Glucose test</option><option value="Blood work">Blood work</option><option value="Group B strep">Group B strep</option><option value="Non-stress test">Non-stress test</option><option value="Specialist">Specialist</option><option value="Other">Other</option></select></div>' +
      '<div class="appt-form-row"><label for="appt-notes">Notes / questions</label><textarea id="appt-notes" placeholder="Questions to ask, things to mention..."></textarea></div>' +
      '<button id="appt-add-btn" class="btn btn-primary btn-small" aria-label="Add appointment">Add appointment</button>' +
      '</div>';

    // Upcoming
    if (upcoming.length > 0) {
      html += '<h4 style="font-size:0.875rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.03em;margin-bottom:0.5rem">Upcoming</h4>';
      upcoming.forEach(function(appt) {
        var days = daysUntil(appt.date);
        var countdownText = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : days + ' days';
        html += '<div class="appt-card">' +
          '<div class="appt-card-header">' +
            '<div><span class="appt-date">' + formatDate(appt.date) + '</span><br><span class="appt-type">' + escapeHtml(appt.type) + '</span></div>' +
            '<div style="display:flex;gap:0.25rem;align-items:center"><span class="appt-countdown">' + countdownText + '</span>' +
            '<button class="appt-delete-btn" data-appt-id="' + appt.id + '" aria-label="Delete appointment">&times;</button></div>' +
          '</div>';
        if (appt.notes) html += '<div class="appt-notes">' + escapeHtml(appt.notes) + '</div>';
        html += '</div>';
      });
    }

    // Past
    if (past.length > 0) {
      html += '<details style="margin-top:1rem"><summary style="cursor:pointer;font-size:0.875rem;font-weight:600;color:var(--text-secondary);min-height:44px;display:flex;align-items:center">Past appointments (' + past.length + ')</summary>';
      past.reverse().forEach(function(appt) {
        html += '<div class="appt-card" style="opacity:0.7">' +
          '<div class="appt-card-header">' +
            '<div><span class="appt-date">' + formatDate(appt.date) + '</span><br><span class="appt-type">' + escapeHtml(appt.type) + '</span></div>' +
            '<button class="appt-delete-btn" data-appt-id="' + appt.id + '" aria-label="Delete appointment">&times;</button>' +
          '</div>';
        if (appt.notes) html += '<div class="appt-notes">' + escapeHtml(appt.notes) + '</div>';
        html += '</div>';
      });
      html += '</details>';
    }

    if (appts.length === 0) {
      html += '<p style="color:var(--text-secondary);text-align:center;padding:1rem">No appointments yet. Add your next prenatal visit above.</p>';
    }

    container.innerHTML = html;

    // Bind add
    var addBtn = container.querySelector('#appt-add-btn');
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        var dateInput = document.getElementById('appt-date');
        var typeInput = document.getElementById('appt-type');
        var notesInput = document.getElementById('appt-notes');
        if (!dateInput || !dateInput.value) return;
        PregnancyStorage.addAppointment({
          date: dateInput.value,
          type: typeInput ? typeInput.value : 'Routine checkup',
          notes: notesInput ? notesInput.value : ''
        });
        if (notesInput) notesInput.value = '';
        render(container);
        Settings.showToast('Appointment added');
      });
    }

    // Bind delete
    container.querySelectorAll('.appt-delete-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = this.getAttribute('data-appt-id');
        PregnancyStorage.deleteAppointment(id);
        render(container);
        Settings.showToast('Appointment removed');
      });
    });
  }

  return { render: render };
})();
