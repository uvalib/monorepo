// index.js (ESM Syntax)
import 'dotenv/config'; // Load environment variables from .env at the start
import express from 'express';
import proxy from 'express-http-proxy';
import { URLSearchParams } from 'url'; // Built-in URLSearchParams

// --- Configuration ---
const app = express();

// Get configuration values from the environment, with defaults.
const PORT = process.env.PORT || 3000;
const destination = process.env.DESTINATION || 'https://your-collectionspace-domain.org';
const proxyHost = process.env.PROXY_HOST || 'your-collectionspace-domain.org';
const proxyUrl = process.env.PROXY_URL || `http://localhost:${PORT}`;
const verbosity = Number(process.env.VERBOSITY) || 0;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;
const tenantPathSegment = '/cspace/virginia'; // Adjust as needed

// --- Routes ---

// 1. Welcome Redirect
app.get(`${tenantPathSegment}/welcome`, (req, res) => {
  if (verbosity >= 1) {
    console.log(`Intercepted ${tenantPathSegment}/welcome - redirecting to /cspace-services/login`);
  }
  return res.redirect('/cspace-services/login');
});

// 2. Auto-Login Handler
app.get('/cspace-services/login', async (req, res, next) => {
  if (!username || !password) {
    console.error('Missing USERNAME or PASSWORD in environment variables for auto-login.');
    return res.status(500).send('Proxy configuration error: Missing credentials for auto-login.');
  }
  const loginUrl = `${destination}/cspace-services/login`;
  try {
    if (verbosity >= 1) console.log(`Auto-login Step 1: GET ${loginUrl}`);
    const loginPageResponse = await fetch(loginUrl, {
      headers: { 'User-Agent': req.headers['user-agent'] || 'NodeProxy/1.0' },
      redirect: 'manual',
    });
    const cookieHeader = loginPageResponse.headers.get('set-cookie') || '';
    const loginPageBody = await loginPageResponse.text();
    if (verbosity >= 2) console.log('Fetched login page snippet:', loginPageBody.slice(0, 500));
    const csrfMatch = loginPageBody.match(/"csrf":\s*{[^}]*"token":\s*"([^"]+)"/);
    if (!csrfMatch) {
      console.error('Failed to extract CSRF token from login page.');
      return next(new Error('Unable to find CSRF token in login page response.'));
    }
    const csrfToken = csrfMatch[1];
    if (verbosity >= 1) console.log(`Extracted CSRF Token: ${csrfToken}`);
    if (verbosity >= 2) console.log(`Using Cookie Header for POST: ${cookieHeader}`);
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('_csrf', csrfToken);
    if (verbosity >= 1) console.log(`Auto-login Step 2: POST to ${loginUrl}`);
    const loginPostResponse = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookieHeader,
        'User-Agent': req.headers['user-agent'] || 'NodeProxy/1.0',
      },
      body: formData.toString(),
      redirect: 'manual',
    });
    if (verbosity >= 1) {
      console.log(`Login POST Response Status: ${loginPostResponse.status}`);
      for (const [key, value] of loginPostResponse.headers.entries()) {
        if (verbosity >= 2 || key.toLowerCase() === 'location' || key.toLowerCase() === 'set-cookie') {
          console.log(` <- Header: ${key}: ${value}`);
        }
      }
    }
    if (loginPostResponse.status === 302) {
      const locationHeader = loginPostResponse.headers.get('location');
      const postSetCookies = loginPostResponse.headers.getSetCookie();
      if (postSetCookies && postSetCookies.length > 0) {
        res.setHeader('Set-Cookie', postSetCookies);
        if (verbosity >= 1) console.log(`Forwarding ${postSetCookies.length} cookie(s) to client.`);
      }
      let redirectTarget = locationHeader || '/';
      if (redirectTarget.startsWith(destination)) {
        redirectTarget = redirectTarget.substring(destination.length);
        if (!redirectTarget.startsWith('/')) redirectTarget = '/' + redirectTarget;
      }
      if (verbosity >= 1) console.log(`Login successful. Redirecting client to: ${redirectTarget}`);
      res.status(302).set('Location', redirectTarget).send();
    } else {
      console.error(`Auto-login failed with status: ${loginPostResponse.status}`);
      const errorBody = await loginPostResponse.text();
      console.error('Auto-login error snippet:', errorBody.slice(0, 500));
      res.status(500).send(`Auto-login failed (Status: ${loginPostResponse.status}).`);
    }
  } catch (error) {
    console.error('Error during auto-login:', error);
    next(error);
  }
});

// 3. Main Proxy Middleware
app.use('/', proxy(destination, {
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (verbosity >= 1) console.log(`Proxying: ${srcReq.method} ${srcReq.originalUrl}`);
    if (verbosity >= 2) console.log(" -> Original Client Headers:", srcReq.headers);
    proxyReqOpts.headers['accept-encoding'] = 'identity';
    proxyReqOpts.headers['host'] = proxyHost;
    if (srcReq.headers.origin) proxyReqOpts.headers['origin'] = destination;
    if (srcReq.headers.referer) {
      proxyReqOpts.headers['referer'] = srcReq.headers.referer.replace(proxyUrl, destination);
    }
    if (verbosity >= 2) console.log(" -> Modified Proxy Request Headers:", proxyReqOpts.headers);
    return proxyReqOpts;
  },
  userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
    if (verbosity >= 1) {
      console.log(`Response Status: ${proxyRes.statusCode} for ${userReq.originalUrl}`);
      for (const [key, value] of Object.entries(headers)) {
        if (verbosity >= 2 || key.toLowerCase() === 'location' || key.toLowerCase() === 'content-type') {
          console.log(` <- Header: ${key}: ${value}`);
        }
      }
    }
    if (headers.location && headers.location.startsWith(destination)) {
      headers.location = headers.location.substring(destination.length);
      if (!headers.location.startsWith('/')) headers.location = '/' + headers.location;
      if (verbosity >= 1) console.log(` <- Rewritten Location Header: ${headers.location}`);
    }
    delete headers['content-length'];
    return headers;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    const contentType = proxyRes.headers['content-type'];
    let body = proxyResData;
    if (contentType && contentType.includes('text/html')) {
      let dataString = proxyResData.toString('utf8');
      if (verbosity >= 1) console.log(`HTML detected, injecting MutationObserver script for: ${userReq.originalUrl}`);
      // --- BEGIN SCRIPT INJECTION WITH MUTATION OBSERVER ---
      const injectionScript = `
        <script>
          (function() {
            const tenantPath = '${tenantPathSegment}';
            function removeUnwantedSections() {
              const proceduresPanel = document.querySelector('div.cspace-ui-CreatePagePanel--procedure');
              if (proceduresPanel) {
                proceduresPanel.remove();
                console.log('Proxy MutationObserver: Removed Procedures panel.');
              }
              const authorityPanel = document.querySelector('div.cspace-ui-CreatePagePanel--authority');
              if (authorityPanel) {
                authorityPanel.remove();
                console.log('Proxy MutationObserver: Removed Authorities panel.');
              }
            }
            function removeMenuItems() {
              const selectors = [
                'a[href="' + tenantPath + '/dashboard"]',
                'a[href="' + tenantPath + '/tool"]',
                'a[href="' + tenantPath + '/admin"]'
              ];
              selectors.forEach(function(selector) {
                const el = document.querySelector(selector);
                if (el) {
                  const li = el.closest('li');
                  if (li) {
                    li.remove();
                    console.log('Proxy MutationObserver: Removed menu item with selector:', selector);
                  }
                }
              });
            }
            function fixNamedCollectionInput() {
              const fieldset = document.querySelector('fieldset[data-name="namedCollection"]');
              if (fieldset) {
                const input = fieldset.querySelector('input');
                if (input) {
                  input.value = "Facilities Architectural Collection";
                  input.setAttribute("readonly", "true");
                  input.style.backgroundColor = "#f0f0f0";
                  console.log('Proxy MutationObserver: Set Named Collection input and made it read-only.');
                }
                const addBtn = fieldset.querySelector('button[data-name="add"]');
                if (addBtn) {
                  addBtn.remove();
                  console.log('Proxy MutationObserver: Removed add button from Named Collection.');
                }
                const removeBtn = fieldset.querySelector('button[data-name="remove"]');
                if (removeBtn) {
                  removeBtn.remove();
                  console.log('Proxy MutationObserver: Removed remove button from Named Collection.');
                }
                const moveBtn = fieldset.querySelector('button[data-name="moveToTop"]');
                if (moveBtn) {
                  moveBtn.remove();
                  console.log('Proxy MutationObserver: Removed moveToTop button from Named Collection.');
                }
              }
            }
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
            const observer = new MutationObserver(runAllRemovals);
            observer.observe(document.body, { childList: true, subtree: true });
          })();
        </script>
      `;
      dataString = dataString.replace(/<\/body>/i, injectionScript + '</body>');
      body = dataString;
      // --- END SCRIPT INJECTION ---
    } else if (verbosity >= 2) {
      console.log(`Non-HTML response (${contentType}), passing through: ${userReq.originalUrl}`);
    }
    return body;
  }
}));

// --- Error Handling & Server Start ---
app.use((err, req, res, next) => {
  console.error("Proxy Middleware Error:", err.stack || err);
  if (res.headersSent) return next(err);
  res.status(500).send('An internal proxy error occurred.');
});

app.listen(PORT, () => {
  console.log(`\nCollectionSpace Simple Proxy (ESM) running on http://localhost:${PORT}`);
  console.log(`Proxying requests to CollectionSpace instance: ${destination}`);
  console.log(`Expecting Host header: ${proxyHost}`);
  console.log(`Auto-login: ${username ? "Enabled (user: " + username + ")" : "DISABLED (set USERNAME/PASSWORD env vars)"}`);
  console.log(`Verbosity Level: ${verbosity}`);
  console.log(`Node.js Version: ${process.version}`);
  if (!globalThis.fetch) {
      console.warn("Warning: globalThis.fetch is not detected. Ensure Node.js v18+ is used.");
  }
  console.log("\n-----");
  console.log(" IMPORTANT: Verify and adjust CSS selectors in the injected script");
  console.log("            within index.js based on your CSpace instance's HTML!");
  console.log("-----\n");
});
