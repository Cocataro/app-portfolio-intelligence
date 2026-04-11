// === Tools View Orchestrator ===
var Tools = (function() {
  'use strict';

  var currentTool = 'appointments';
  var tools = [
    { key: 'appointments', label: 'Appointments' },
    { key: 'kicks', label: 'Kick counter' },
    { key: 'contractions', label: 'Contractions' },
    { key: 'birthplan', label: 'Birth plan' },
    { key: 'hospitalbag', label: 'Hospital bag' }
  ];

  function render() {
    var container = document.getElementById('tools-container');
    if (!container) return;

    var html = '<div class="tools-tabs" role="tablist" aria-label="Pregnancy tools">';
    tools.forEach(function(tool) {
      html += '<button class="tool-tab' + (currentTool === tool.key ? ' active' : '') + '" ' +
        'data-tool="' + tool.key + '" role="tab" aria-selected="' + (currentTool === tool.key ? 'true' : 'false') + '">' +
        tool.label + '</button>';
    });
    html += '</div>';

    tools.forEach(function(tool) {
      html += '<div class="tool-panel' + (currentTool === tool.key ? ' active' : '') + '" id="tool-' + tool.key + '" role="tabpanel"></div>';
    });

    container.innerHTML = html;

    // Bind tab clicks
    container.querySelectorAll('.tool-tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        currentTool = this.getAttribute('data-tool');
        render();
      });
    });

    // Render active tool
    var panel = container.querySelector('#tool-' + currentTool);
    if (panel) {
      switch (currentTool) {
        case 'appointments': Appointments.render(panel); break;
        case 'kicks': KickCounter.render(panel); break;
        case 'contractions': ContractionTimer.render(panel); break;
        case 'birthplan': BirthPlan.render(panel); break;
        case 'hospitalbag': HospitalBag.render(panel); break;
      }
    }
  }

  function init() {
    render();
    document.addEventListener('viewchange', function(e) {
      if (e.detail.view === 'tools') render();
    });
  }

  return { init: init };
})();
