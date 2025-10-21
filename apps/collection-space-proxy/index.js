// index.js (ESM Syntax)
import 'dotenv/config'; // Load environment variables from .env at the start
import express from 'express';
import proxy from 'express-http-proxy';
import { URLSearchParams } from 'url'; // Built-in URLSearchParams
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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
const tenantPathSegment = process.env.TENANT_PATH || '/cspace/virginia'; // Adjust via env
// Silent re-auth / session keep-alive configuration
const sessionRefreshEnabled = process.env.SESSION_REFRESH_ENABLED !== 'false'; // default true
const sessionRefreshIntervalMs = Number(process.env.SESSION_REFRESH_INTERVAL_MS) || (8 * 60 * 1000); // default 8 min

// Parse allowed user IDs from environment and enforce REMOTE_USER authorization
const authIds = (process.env.AUTH_IDS || 'dhc4z,smh2ne,akr5gz,hmh5xj,arm8h,kod9dx')
  .split(',')
  .map(id => id.trim());
app.use((req, res, next) => {
  const remoteUser = req.get('REMOTE_USER');
  if (!remoteUser || !authIds.includes(remoteUser)) {
    if (verbosity >= 1) console.warn(`Unauthorized access attempt by user: ${remoteUser}`);
    return res.status(403).send('Forbidden');
  }
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const injectSource = fs.readFileSync(path.join(__dirname, 'inject.js'), 'utf8');
function createInjectionScript(tenantPath, proxyUsername) {
  // Inject variables + existing client customizations + keep-alive logic in one <script> tag
  const safeSource = injectSource.replace(/<\/script>/g, '<\\/script>');
  const verbosityLevel = verbosity; // capture for closure
  return `<script>
    // ==== Proxy Injected Variables ====
    const tenantPath = ${JSON.stringify(tenantPath)};
    const proxyUsername = ${JSON.stringify(proxyUsername || '')};
    const __proxyRefreshEnabled = ${JSON.stringify(sessionRefreshEnabled)};
    const __proxyRefreshInterval = ${sessionRefreshIntervalMs};
    const __proxyLoginPath = '/cspace-services/login?silent=1';
    const __proxyVerbosity = ${verbosityLevel};
    // ==== Existing UI Mutation / Field Control Script ====
    ${safeSource}
    // ==== Silent Session Keep-Alive ====
    (function(){
      if(!__proxyRefreshEnabled){ if(__proxyVerbosity>=1) console.log('[Proxy] Silent refresh disabled'); return; }
      let lastRefresh = Date.now();
      let refreshing = false;
      function log(...a){ if(__proxyVerbosity>=1) console.log('[Proxy]', ...a); }
      function doRefresh(force){
        if(!__proxyRefreshEnabled) return;
        const now = Date.now();
        if(!force && (now - lastRefresh) < __proxyRefreshInterval) return;
        if(refreshing) return;
        refreshing = true;
        fetch(__proxyLoginPath, { method: 'GET', credentials: 'same-origin' })
          .then(r => { lastRefresh = Date.now(); if(!r.ok) log('Silent refresh failed status', r.status); else log('Silent refresh success'); })
          .catch(err => log('Silent refresh error', err))
          .finally(()=> { refreshing = false; });
      }
      // Poll minutely (or smaller interval if refresh interval < 60s) and refresh on events
      const pollMs = Math.min(__proxyRefreshInterval, 60*1000);
      setInterval(()=>doRefresh(false), pollMs);
      window.addEventListener('focus', () => doRefresh(true));
      document.addEventListener('visibilitychange', () => { if(!document.hidden) doRefresh(true); });
      // Expose manual controls for debugging
      window.__CSProxyForceRefresh = () => doRefresh(true);
      window.__CSProxyGetLastRefresh = () => lastRefresh;
      log('Silent refresh initialized: interval=' + __proxyRefreshInterval + 'ms (poll every ' + pollMs + 'ms)');
    })();
  </script>`;
}
// 1. Welcome Redirect
app.get(`${tenantPathSegment}/welcome`, (req, res) => {
  if (verbosity >= 1) {
    console.log(`Intercepted ${tenantPathSegment}/welcome - redirecting to /cspace-services/login`);
  }
  return res.redirect('/cspace-services/login');
});

// 2. Auto-Login Handler (supports silent refresh via ?silent=1)
app.get('/cspace-services/login', async (req, res, next) => {
  if (!username || !password) {
    console.error('Missing USERNAME or PASSWORD in environment variables for auto-login.');
    return res.status(500).send('Proxy configuration error: Missing credentials for auto-login.');
  }
  
  // Clear any existing CollectionSpace session cookies to prevent state conflicts
  // This fixes the "authorization code does not belong to an active sign in request" error
  // that occurs when users have stale session cookies from previous login attempts
  const cookiesToClear = ['JSESSIONID', 'spring-security-remember-me', 'SESSION'];
  const clearCookies = cookiesToClear.map(name => 
    `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`
  );
  res.setHeader('Set-Cookie', clearCookies);
  if (verbosity >= 1) console.log('Cleared stale session cookies before login');
  
  const loginUrl = `${destination}/cspace-services/login`;
  try {
    if (verbosity >= 1) console.log(`Auto-login Step 1: GET ${loginUrl}`);
    if (verbosity >= 2 && req.headers.cookie) {
      console.log(`Client sent cookies: ${req.headers.cookie.slice(0, 200)}`);
    }
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
    const silent = 'silent' in req.query; // presence of param triggers silent refresh behavior
    if (loginPostResponse.status === 302) {
      const locationHeader = loginPostResponse.headers.get('location');
      const postSetCookies = loginPostResponse.headers.getSetCookie?.();
      if (postSetCookies && postSetCookies.length > 0) {
        res.setHeader('Set-Cookie', postSetCookies);
        if (verbosity >= 1) console.log(`Forwarding ${postSetCookies.length} cookie(s) to client.`);
      }
      // Prevent caching of auth responses to avoid stale state issues
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      if (silent) {
        if (verbosity >= 1) console.log('Silent login refresh succeeded. Returning 200 JSON.');
        return res.status(200).json({ refreshed: true, at: Date.now() });
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
      if (verbosity >= 2) {
        console.error('Request cookies that were sent:', cookieHeader.slice(0, 200));
      }
      const payload = { success: false, status: loginPostResponse.status };
      if (silent) return res.status(500).json(payload);
      res.status(500).send(`Auto-login failed (Status: ${loginPostResponse.status}).`);
  }
  } catch (error) {
    console.error('Error during auto-login:', error);
    next(error);
  }
});

// 3. Main Proxy Middleware
app.use('/', proxy(destination, {
  // Treat all request/response bodies as binary and prevent body parsing (for multipart uploads)
  binary: true,
  parseReqBody: false,
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
      const injectionScript = createInjectionScript(tenantPathSegment, username);
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
  console.log(`Silent Refresh: ${sessionRefreshEnabled ? 'ENABLED' : 'disabled'} (interval ${sessionRefreshIntervalMs} ms)`);
  if (!globalThis.fetch) {
      console.warn("Warning: globalThis.fetch is not detected. Ensure Node.js v18+ is used.");
  }
  console.log("\n-----");
  console.log(" IMPORTANT: Verify and adjust CSS selectors in the injected script");
  console.log("            within index.js based on your CSpace instance's HTML!");
  console.log("-----\n");
});
