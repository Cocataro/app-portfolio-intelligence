// === Hospital Bag Module ===
var HospitalBag = (function() {
  'use strict';

  var currentTab = 'mom';

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }

  function getItems(category) {
    var bag = PregnancyStorage.getHospitalBag();
    var defaults = (APP_CONFIG.hospitalBagItems && APP_CONFIG.hospitalBagItems[category]) || [];
    var saved = bag[category];
    if (saved) return saved;
    // Initialize from defaults
    return defaults.map(function(item) {
      return { name: item, packed: false };
    });
  }

  function saveItems(category, items) {
    var bag = PregnancyStorage.getHospitalBag();
    bag[category] = items;
    PregnancyStorage.saveHospitalBag(bag);
  }

  function render(container) {
    var tabs = [
      { key: 'mom', label: 'For mom' },
      { key: 'partner', label: 'For partner' },
      { key: 'baby', label: 'For baby' }
    ];

    var html = '<h3 style="font-size:1.125rem;font-weight:600;margin-bottom:1rem;color:var(--text)">Hospital bag checklist</h3>';

    // Tabs
    html += '<div class="bag-tabs">';
    tabs.forEach(function(tab) {
      html += '<button class="bag-tab' + (currentTab === tab.key ? ' active' : '') + '" data-bag-tab="' + tab.key + '" aria-label="' + tab.label + '">' + tab.label + '</button>';
    });
    html += '</div>';

    // Panels
    tabs.forEach(function(tab) {
      var items = getItems(tab.key);
      var packedCount = items.filter(function(i) { return i.packed; }).length;

      html += '<div class="bag-panel' + (currentTab === tab.key ? ' active' : '') + '" data-bag-panel="' + tab.key + '">';
      html += '<div class="bag-progress">' + packedCount + ' of ' + items.length + ' items packed</div>';

      items.forEach(function(item, idx) {
        html += '<div class="bag-item' + (item.packed ? ' packed' : '') + '" data-bag-category="' + tab.key + '" data-bag-idx="' + idx + '">' +
          '<button class="bag-checkbox' + (item.packed ? ' checked' : '') + '" data-bag-category="' + tab.key + '" data-bag-idx="' + idx + '" aria-label="' + (item.packed ? 'Unpack' : 'Pack') + ' ' + escapeHtml(item.name) + '" role="checkbox" aria-checked="' + (item.packed ? 'true' : 'false') + '">' +
          (item.packed ? '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><polyline points="20 6 9 17 4 12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '') +
          '</button>' +
          '<span class="bag-item-label">' + escapeHtml(item.name) + '</span>' +
          '</div>';
      });

      // Add item
      html += '<div class="add-custom-row" style="margin-top:0.75rem">' +
        '<input type="text" placeholder="Add item" aria-label="Add item to ' + tab.label + '" maxlength="50" data-bag-add-input="' + tab.key + '">' +
        '<button class="btn btn-small" data-bag-add-btn="' + tab.key + '" aria-label="Add item">Add</button>' +
        '</div>';

      html += '</div>';
    });

    container.innerHTML = html;

    // Bind tab clicks
    container.querySelectorAll('.bag-tab').forEach(function(tabBtn) {
      tabBtn.addEventListener('click', function() {
        currentTab = this.getAttribute('data-bag-tab');
        render(container);
      });
    });

    // Bind checkbox clicks
    container.querySelectorAll('.bag-checkbox').forEach(function(cb) {
      cb.addEventListener('click', function() {
        var cat = this.getAttribute('data-bag-category');
        var idx = parseInt(this.getAttribute('data-bag-idx'));
        var items = getItems(cat);
        if (idx >= 0 && idx < items.length) {
          items[idx].packed = !items[idx].packed;
          saveItems(cat, items);
          render(container);
        }
      });
    });

    // Bind add buttons
    container.querySelectorAll('[data-bag-add-btn]').forEach(function(btn) {
      var cat = btn.getAttribute('data-bag-add-btn');
      btn.addEventListener('click', function() {
        addItem(container, cat);
      });
    });
    container.querySelectorAll('[data-bag-add-input]').forEach(function(input) {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          addItem(container, input.getAttribute('data-bag-add-input'));
        }
      });
    });
  }

  function addItem(container, category) {
    var input = container.querySelector('[data-bag-add-input="' + category + '"]');
    if (!input) return;
    var val = input.value.trim();
    if (!val) return;
    var items = getItems(category);
    items.push({ name: val, packed: false });
    saveItems(category, items);
    input.value = '';
    render(container);
  }

  return { render: render };
})();
