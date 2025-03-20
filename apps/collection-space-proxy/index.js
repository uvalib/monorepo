// index.js
require('dotenv').config(); // load environment variables from .env

const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

// Get configuration values from the environment, with defaults.
const PORT = process.env.PORT || 3000;
const destination = process.env.DESTINATION || 'https://virginia.staging.collectionspace.org';
const proxyHost = process.env.PROXY_HOST || 'virginia.staging.collectionspace.org';
const proxyUrl = process.env.PROXY_URL || `http://localhost:${PORT}`;
const verbosity = Number(process.env.VERBOSITY) || 0;
const username = process.env.USERNAME;
const password = process.env.PASSWORD;

//
// Route for /jsdelivr/*
// This proxies requests from '/jsdelivr/*' to 'https://cdn.jsdelivr.net/*'
// and applies a response filter to remove the dashboard menu string using a simple string replace.
//
app.use('/jsdelivr', proxy('https://cdn.jsdelivr.net', {
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (verbosity >= 1) {
      console.log("Outgoing /jsdelivr Request Headers:", srcReq.headers);
    }
    // Force uncompressed responses.
    proxyReqOpts.headers['accept-encoding'] = 'identity';
    return proxyReqOpts;
  },
  userResHeaderDecorator: (headers) => {
    if (verbosity >= 1) {
      console.log("Incoming /jsdelivr Response Headers:", headers);
    }
    return headers;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    let dataString = proxyResData.toString('utf8');
    if (verbosity >= 1) {
      console.log("jsdelivr response before filtering:", dataString.slice(0, 200));
    }
    // Remove the exact dashboard menu string.
    // Adjust this literal if the response slightly differs.
    dataString = dataString.split('a.createElement("li",null,a.createElement(rx,{to:"/dashboard"},a.createElement(Ye,cx.dashboard))),').join('');
    // Replace the admin menu item with the literal string "null".
    dataString = dataString.split('a.createElement("li",null,a.createElement(rx,{to:"/admin"},a.createElement(Ye,cx.admin)))').join('null');
    // Replace the admin menu item with the literal string "null".
    dataString = dataString.split('a.createElement("li",null,a.createElement(rx,{to:"/tool"},a.createElement(Ye,cx.tool)))').join('null');
    
    if (verbosity >= 1) {
      console.log("jsdelivr response after filtering:", dataString.slice(0, 200));
    }
    return dataString;
  }
}));

//
// Route for /cspace/virginia/welcome: redirect to /cspace-services/login
//
app.get('/cspace/virginia/welcome', (req, res) => {
  if (verbosity >= 1) {
    console.log("Intercepted /cspace/virginia/welcome - redirecting to /cspace-services/login");
  }
  return res.redirect('/cspace-services/login');
});

//
// Route for /cspace-services/login: perform auto login
//
app.get('/cspace-services/login', async (req, res, next) => {
  try {
    // Step 1: GET the login page from the destination to retrieve the CSRF token.
    const loginPageResponse = await fetch(destination + '/cspace-services/login', {
      headers: { 'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0' },
      redirect: 'manual'
    });
    const cookieHeader = loginPageResponse.headers.get('set-cookie') || '';
    const loginPageBody = await loginPageResponse.text();
    if (verbosity >= 1) {
      console.log("Fetched login page body:", loginPageBody);
    }
    // Extract the CSRF token from the JSON snippet in the script.
    const csrfMatch = loginPageBody.match(/"csrf":\s*{[^}]*"token":\s*"([^"]+)"/);
    if (!csrfMatch) {
      return next(new Error('Unable to find CSRF token in login page'));
    }
    const csrfToken = csrfMatch[1];
    if (verbosity >= 1) {
      console.log("Extracted CSRF Token:", csrfToken);
    }
    // Ensure credentials are provided.
    if (!username || !password) {
      return next(new Error('Missing USERNAME or PASSWORD in environment variables'));
    }
    // Step 2: Submit the POST request to log in.
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('_csrf', csrfToken);
    const loginPostResponse = await fetch(destination + '/cspace-services/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookieHeader
      },
      body: formData.toString(),
      redirect: 'manual'
    });
    if (verbosity >= 1) {
      console.log("Login POST Response Status:", loginPostResponse.status);
      console.log("Login POST Response Headers:", loginPostResponse.headers);
    }
    if (loginPostResponse.status === 302) {
      const locationHeader = loginPostResponse.headers.get('location');
      const postSetCookies = loginPostResponse.headers.get('set-cookie');
      if (postSetCookies) {
        res.setHeader('set-cookie', postSetCookies);
      }
      res.status(302).set('location', locationHeader).send();
    } else {
      res.status(500).send('Auto login failed, unexpected response status: ' + loginPostResponse.status);
    }
  } catch (error) {
    next(error);
  }
});

//
// For all other routes, use the proxy middleware with response body filtering.
//
app.use('/', proxy(destination, {
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (verbosity >= 1) {
      console.log("Outgoing Request Headers:", srcReq.headers);
    }
    // Force uncompressed responses.
    proxyReqOpts.headers['accept-encoding'] = 'identity';
    proxyReqOpts.headers['host'] = proxyHost;
    if (srcReq.headers.origin) {
      proxyReqOpts.headers['origin'] = destination;
    }
    if (srcReq.headers.referer) {
      proxyReqOpts.headers['referer'] = srcReq.headers.referer.replace(proxyUrl, destination);
    }
    return proxyReqOpts;
  },
  userResHeaderDecorator: (headers) => {
    if (verbosity >= 1) {
      console.log("Incoming Response Headers:", headers);
    }
    if (headers.location && headers.location.includes(proxyHost)) {
      headers.location = headers.location.replace(destination, '');
    }
    return headers;
  },
  userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
    let dataString = proxyResData.toString('utf8');
    if (verbosity >= 1) {
      console.log("Response before filtering:", dataString.slice(0, 200));
    }
    // Replace any references to cdn.jsdelivr.net with /jsdelivr/
    dataString = dataString.replace(/https:\/\/cdn\.jsdelivr\.net\//g, '/jsdelivr/');
    if (verbosity >= 1) {
      console.log("Response after filtering:", dataString.slice(0, 200));
    }
    return dataString;
  }
}));

app.listen(PORT, () => {
  console.log(`Reverse proxy listening on port ${PORT}`);
});
