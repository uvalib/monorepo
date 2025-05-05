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

  // Fix named collection input
  function fixNamedCollectionInput() {
    const fieldset = document.querySelector('fieldset[data-name="namedCollection"]');
    if (!fieldset) return;
    const input = fieldset.querySelector('input');
    if (input) {
      input.value = "Facilities Architectural Collection";
      input.setAttribute("readonly", "true");
      input.style.backgroundColor = "#f0f0f0";
    }
    ['add','remove','moveToTop'].forEach(name => {
      const btn = fieldset.querySelector(`button[data-name="${name}"]`);
      if (btn) btn.remove();
    });
  }

  // Run all cleanup actions
  function runAllRemovals() {
    removeUnwantedSections();
    removeMenuItems();
    fixNamedCollectionInput();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllRemovals);
  } else {
    runAllRemovals();
  }

  // Observe mutations for dynamic content
  new MutationObserver(runAllRemovals).observe(document.body, { childList: true, subtree: true });
})();