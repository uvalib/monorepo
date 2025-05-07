(function() {
  // Helper that sets value in a way React can detect
  function setNativeValue(el, value) {
    const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value').set;
    setter.call(el, value);
  }

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
      setNativeValue(input, "University's Facilities Management");
      input.setAttribute('readonly', 'true');
      input.style.backgroundColor = '#f0f0f0';
      // Trigger events so React sees the change
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      // Simulate clicking the 'Other' dropdown option if present
      document.querySelectorAll('li').forEach(option => {
        if (option.textContent.trim() === "University's Facilities Management") {
          option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
          option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      });
      console.log('Proxy MutationObserver: Set Responsible Department to University\'s Facilities Management and made read-only.');
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
          setNativeValue(input, "University's Facilities Management");
          input.setAttribute('readonly', 'true');
          input.style.backgroundColor = '#f0f0f0';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          // Simulate selecting 'Other' from the dropdown list
          document.querySelectorAll('li').forEach(option => {
            if (option.textContent.trim() === "University's Facilities Management") {
              option.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
              option.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            }
          });
          console.log('Proxy MutationObserver: Set Responsible department condition to University\'s Facilities Management and made read-only.');
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

  // Fix the 'Last updated by' condition input in search/filter forms
  function fixLastUpdatedByConditionField() {
    document.querySelectorAll('div.cspace-ui-FieldConditionInput--common').forEach(container => {
      const label = container.querySelector('div > span')?.textContent;
      if (label === 'Last updated by') {
        const repeat = container.querySelector('fieldset[data-name="updatedBy"]');
        if (!repeat) return;
        const input = repeat.querySelector('input[type="text"]');
        if (input) {
          // Set value using React-compatible setter, then fire InputEvent and change+blur
          input.focus();
          // React value tracker hack
          const lastValue = input.value;
          setNativeValue(input, proxyUsername);
          const tracker = input._valueTracker;
          if (tracker) tracker.setValue(lastValue);
          // Ensure React sees defaultValue and make input read-only
          input.defaultValue = proxyUsername;
          input.setAttribute('readonly', 'true');
          input.style.backgroundColor = '#f0f0f0';
          // Dispatch a series of events to trigger React change detection
          input.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
          input.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
          // Simulate typing to cover any key handlers
          ['keydown', 'keypress', 'keyup'].forEach(type => {
            input.dispatchEvent(new KeyboardEvent(type, { bubbles: true, cancelable: true, key: 'd' }));
          });
          // Complete any composition
          input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));
          input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
          // Fire React’s internal onChange if available
          const reactHandlerKey = Object.keys(input).find(key => key.startsWith('__reactEventHandlers'));
          if (reactHandlerKey) {
            input[reactHandlerKey].onChange({ target: input });
            console.log('Proxy MutationObserver: Called React onChange on Last updated by field');
          }
          console.log(`Proxy MutationObserver: Set Last updated by to ${proxyUsername} and made read-only.`);
        }
        // Remove add/remove and remove-condition buttons
        repeat.querySelectorAll('button[data-name="add"], button[data-name="remove"]').forEach(btn => btn.remove());
        const removeBtn = container.querySelector('button.cspace-ui-RemoveConditionButton--common');
        if (removeBtn) removeBtn.remove();
      }
    });
  }

  // Remove the Quick Search bar from the banner
  function removeQuickSearchBar() {
    const banner = document.querySelector('div.cspace-ui-BannerMain--common');
    if (!banner) return;
    const fs = banner.querySelector('fieldset');
    if (fs) {
      fs.remove();
      console.log('Proxy MutationObserver: Removed Quick Search fieldset');
    }
  }

  // Prune the record type dropdown to only Objects and Media Handling
  function pruneRecordTypeOptions() {
    const container = document.querySelector('div.cspace-ui-SearchFormRecordType--common');
    if (!container) return;
    const list = container.querySelector('ul.cspace-input-Menu--common');
    if (!list) return;
    Array.from(list.children).forEach(li => {
      const text = li.textContent.trim();
      if (text !== 'Objects' && text !== 'Media Handling') {
        li.remove();
      } else {
        // ensure correct selection state
        if (text === 'Objects') {
          li.setAttribute('aria-selected', 'true');
          li.classList.add('cspace-input-MenuItem--selected');
        } else {
          li.setAttribute('aria-selected', 'false');
          li.classList.remove('cspace-input-MenuItem--selected');
        }
      }
    });
    // Reset the input value to Objects
    const input = container.querySelector('input[type="text"]');
    if (input) input.value = 'Objects';
  }

  // Run all cleanup actions
  function runAllRemovals() {
    removeUnwantedSections();
    removeMenuItems();
    fixResponsibleDepartmentField();
    fixResponsibleConditionField();
    fixBooleanSearchOp();
    fixLastUpdatedByConditionField();
    removeQuickSearchBar();
    pruneRecordTypeOptions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllRemovals);
  } else {
    runAllRemovals();
  }

  // Observe mutations for dynamic content
  new MutationObserver(runAllRemovals).observe(document.body, { childList: true, subtree: true });
})();