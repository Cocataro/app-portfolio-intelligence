// === Birth Plan Module ===
var BirthPlan = (function() {
  'use strict';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }

  function render(container) {
    var sections = APP_CONFIG.birthPlanSections || [];
    var plan = PregnancyStorage.getBirthPlan();

    var html = '<h3 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem;color:var(--text)">Birth plan builder</h3>' +
      '<p style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:1rem">Select your preferences for each section. Add notes for anything specific. This creates a summary you can share with your birthing team.</p>';

    html += '<div class="birth-plan">';

    sections.forEach(function(section) {
      var selected = (plan[section.id] && plan[section.id].options) || [];
      var notes = (plan[section.id] && plan[section.id].notes) || '';

      html += '<div class="birth-plan-section">' +
        '<h4>' + escapeHtml(section.title) + '</h4>' +
        '<div class="birth-plan-chips" data-section="' + section.id + '">';

      section.options.forEach(function(opt) {
        var isSelected = selected.indexOf(opt) !== -1;
        html += '<button type="button" class="chip bp-chip' + (isSelected ? ' selected' : '') + '" ' +
          'data-section="' + section.id + '" data-option="' + escapeHtml(opt) + '" ' +
          'aria-pressed="' + (isSelected ? 'true' : 'false') + '">' +
          escapeHtml(opt) + '</button>';
      });

      html += '</div>' +
        '<div class="birth-plan-notes">' +
          '<textarea placeholder="Additional notes for ' + escapeHtml(section.title.toLowerCase()) + '..." ' +
          'data-section-notes="' + section.id + '" aria-label="Notes for ' + escapeHtml(section.title) + '">' + escapeHtml(notes) + '</textarea>' +
        '</div></div>';
    });

    // Actions
    html += '<div class="birth-plan-actions">' +
      '<button class="btn btn-primary btn-small" id="bp-save" aria-label="Save birth plan">Save birth plan</button>' +
      '<button class="btn btn-outline btn-small" id="bp-print" aria-label="Print birth plan">Print summary</button>' +
      '</div>';

    html += '</div>';

    container.innerHTML = html;

    // Bind chip clicks
    container.querySelectorAll('.bp-chip').forEach(function(chip) {
      chip.addEventListener('click', function() {
        var isSelected = this.classList.contains('selected');
        this.classList.toggle('selected', !isSelected);
        this.setAttribute('aria-pressed', !isSelected ? 'true' : 'false');
      });
    });

    // Bind save
    var saveBtn = container.querySelector('#bp-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', function() {
        var newPlan = {};
        sections.forEach(function(section) {
          var selected = [];
          container.querySelectorAll('.bp-chip[data-section="' + section.id + '"].selected').forEach(function(chip) {
            selected.push(chip.getAttribute('data-option'));
          });
          var notesEl = container.querySelector('[data-section-notes="' + section.id + '"]');
          newPlan[section.id] = {
            options: selected,
            notes: notesEl ? notesEl.value : ''
          };
        });
        PregnancyStorage.saveBirthPlan(newPlan);
        Settings.showToast('Birth plan saved');
      });
    }

    // Bind print
    var printBtn = container.querySelector('#bp-print');
    if (printBtn) {
      printBtn.addEventListener('click', function() {
        // Trigger save first
        saveBtn.click();
        setTimeout(function() {
          var printPlan = PregnancyStorage.getBirthPlan();
          var printHtml = '<html><head><title>Birth Plan</title><style>body{font-family:-apple-system,system-ui,sans-serif;padding:2rem;max-width:600px;margin:0 auto;color:#3A3229}h1{color:#C49350;font-size:1.5rem;border-bottom:2px solid #C49350;padding-bottom:0.5rem}h2{font-size:1rem;margin-top:1.5rem;color:#7B7164;text-transform:uppercase;letter-spacing:0.03em}ul{padding-left:1.25rem;margin:0.5rem 0}.note{font-style:italic;color:#7B7164;margin-top:0.25rem}footer{margin-top:2rem;font-size:0.8125rem;color:#A89E90;border-top:1px solid #DDD5C8;padding-top:0.75rem}</style></head><body>';
          printHtml += '<h1>My Birth Plan</h1>';
          var settings = Storage.getSettings();
          if (settings.userName) printHtml += '<p>Prepared by: ' + escapeHtml(settings.userName) + '</p>';
          printHtml += '<p>Date: ' + new Date().toLocaleDateString() + '</p>';
          sections.forEach(function(section) {
            var data = printPlan[section.id];
            if (!data) return;
            if ((!data.options || data.options.length === 0) && !data.notes) return;
            printHtml += '<h2>' + escapeHtml(section.title) + '</h2>';
            if (data.options && data.options.length > 0) {
              printHtml += '<ul>';
              data.options.forEach(function(opt) { printHtml += '<li>' + escapeHtml(opt) + '</li>'; });
              printHtml += '</ul>';
            }
            if (data.notes) printHtml += '<p class="note">' + escapeHtml(data.notes) + '</p>';
          });
          printHtml += '<footer>This birth plan represents my preferences. I understand that flexibility may be needed based on medical circumstances. Please discuss any changes with me or my partner.</footer>';
          printHtml += '</body></html>';
          var win = window.open('', '_blank');
          if (win) {
            win.document.write(printHtml);
            win.document.close();
            win.print();
          }
        }, 100);
      });
    }
  }

  return { render: render };
})();
