(function() {
  // Remove unwanted panels
  function removeUnwantedSections() {
    // Remove entire Authorities panel
    const authorityPanel = document.querySelector('div.cspace-ui-CreatePagePanel--authority');
    if (authorityPanel) {
      authorityPanel.remove();
      console.log('Proxy MutationObserver: Removed Authorities panel.');
    }
    const panel = document.querySelector('div.cspace-ui-CreatePagePanel--procedure');
    if (!panel) return;
    // Remove every list item except the one containing the Media Handling link
    panel.querySelectorAll('li').forEach(li => {
      if (!li.querySelector('a#media')) {
        li.remove();
        console.log('Proxy MutationObserver: Removed procedure item:', li.textContent.trim());
      }
    });
  }

  // Remove specific menu items
  function removeMenuItems() {
    const selectors = [
      `a[href="${tenantPath}/dashboard"]`,
      `a[href="${tenantPath}/tool"]`,
      `a[href="${tenantPath}/admin"]`
    ];
    selectors.forEach(selector => {
      const el = document.querySelector(selector);
      if (el) {
        const li = el.closest('li');
        if (li) li.remove();
      }
    });
  }

  // Fix Responsible Department field to always be 'Other'
  function fixResponsibleDepartmentField() {
    const container = document.querySelector('fieldset[data-name="responsibleDepartments"]');
    if (!container) return;
    const repeat = container.querySelector('fieldset[data-name="responsibleDepartment"]');
    if (!repeat) return;
    const input = repeat.querySelector('input[type="text"]');
    if (input) {
      input.value = 'Other';
      input.setAttribute('readonly', 'true');
      input.style.backgroundColor = '#f0f0f0';
      console.log('Proxy MutationObserver: Set Responsible Department to Other and made read-only.');
    }
    // Remove add/remove buttons
    ['add', 'remove'].forEach(name => {
      const btn = repeat.querySelector(`button[data-name="${name}"]`);
      if (btn) btn.remove();
    });
  }

  // Fix the Responsible department condition input in search/filter forms
  function fixResponsibleConditionField() {
    document.querySelectorAll('div.cspace-ui-FieldConditionInput--common').forEach(container => {
      const label = container.querySelector('div > span')?.textContent;
      if (label === 'Responsible department') {
        const repeat = container.querySelector('fieldset[data-name="responsibleDepartment"]');
        if (!repeat) return;
        const input = repeat.querySelector('input[type="text"]');
        if (input) {
          input.value = 'Other';
          input.setAttribute('readonly', 'true');
          input.style.backgroundColor = '#f0f0f0';
          console.log('Proxy MutationObserver: Set Responsible department condition to Other and made read-only.');
        }
        repeat.querySelectorAll('button[data-name="add"], button[data-name="remove"]').forEach(btn => btn.remove());
        const removeBtn = container.querySelector('button.cspace-ui-RemoveConditionButton--common');
        if (removeBtn) removeBtn.remove();
      }
    });
  }

  // Fix the boolean search operator dropdown to always show 'All'
  function fixBooleanSearchOp() {
    document.querySelectorAll('input[data-name="booleanSearchOp"]').forEach(input => {
      // Hide input, set to 'All', and display static text next to it
      if (input.nextElementSibling?.classList.contains('proxy-boolean-display')) {
        return;
      }
      input.value = 'All';
      input.setAttribute('readonly', 'true');
      input.style.backgroundColor = '#f0f0f0';
      input.style.display = 'none';
      const span = document.createElement('span');
      span.textContent = 'All';
      span.className = 'proxy-boolean-display';
      input.parentNode.insertBefore(span, input.nextSibling);
      console.log('Proxy MutationObserver: Hid booleanSearchOp input, showed static All.');
    });
  }

  // Run all cleanup actions
  function runAllRemovals() {
    removeUnwantedSections();
    removeMenuItems();
    fixResponsibleDepartmentField();
    fixResponsibleConditionField();
    fixBooleanSearchOp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllRemovals);
  } else {
    runAllRemovals();
  }

  // Observe mutations for dynamic content
  new MutationObserver(runAllRemovals).observe(document.body, { childList: true, subtree: true });
})();