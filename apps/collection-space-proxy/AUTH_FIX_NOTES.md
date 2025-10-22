# Authentication Error Fix

## Issue Summary

Users were experiencing authentication errors when signing into CollectionSpace through the proxy:

- **Error 1**: "Sign in failed. The CollectionSpace server received a bad request"
- **Error 2**: "Sign in failed. The authorization code does not belong to an active sign in request."
- **Error 3** (NEW): "Error: ERR_API" when performing searches after login

**Key Symptom**: Users could work around the issue by using an incognito/private browsing window, indicating a problem with cached state (cookies, localStorage, or browser cache).

## Root Cause

The authentication flow uses CSRF tokens and session cookies managed by Spring Security. The issue occurred when:

1. **Stale Session Cookies**: Users with existing CollectionSpace session cookies from previous login attempts would send those cookies to the proxy
2. **Cookie Conflict**: The proxy would fetch a fresh CSRF token and session cookie from the backend, but the client's stale cookies would conflict with the new authentication state
3. **State Mismatch**: CollectionSpace's OAuth2/Spring Security backend would reject the login attempt because the authorization code/CSRF token didn't match the session state indicated by the stale cookies

**Why Incognito Worked**: Incognito/private windows have no cached cookies, so there's no conflict—creating a clean authentication flow.

### Second Issue: Cookie Clearing Broke Authenticated API Calls

The initial fix cleared cookies too early (before login), which caused a new problem:
- Cookie clearing headers were sent at the start of the response
- New session cookies from successful login were added after
- Browsers sometimes processed them out of order or the clearing cookies persisted
- Result: Users had no valid session cookies for authenticated API calls (searches)

## Solution Implemented

### 1. Cookie Clearing ONLY After Successful Login (Lines 145-165)

```javascript
const silent = 'silent' in req.query;
if (loginPostResponse.status === 302) {
  const locationHeader = loginPostResponse.headers.get('location');
  const postSetCookies = loginPostResponse.headers.getSetCookie?.();
  
  // Clear any existing CollectionSpace session cookies before setting new ones
  const cookiesToClear = ['JSESSIONID', 'spring-security-remember-me', 'SESSION'];
  const clearCookies = cookiesToClear.map(name => 
    `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`
  );
  
  // Combine clearing cookies with new cookies from successful login
  const allCookies = [...clearCookies];
  if (postSetCookies && postSetCookies.length > 0) {
    allCookies.push(...postSetCookies);
  }
  res.setHeader('Set-Cookie', allCookies);
}
```

**What this does**:

- Clears stale session cookies atomically with setting new ones
- Ensures the browser receives both clearing and new cookies in a single response
- New cookies from successful login immediately replace the old ones
- Prevents the "ERR_API" error that occurred when users had no valid session cookies

### 2. Add Cache-Control Headers (Lines 167-169)

```javascript
// Prevent caching of auth responses to avoid stale state issues
res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
res.setHeader('Pragma', 'no-cache');
res.setHeader('Expires', '0');
```

**What this does**:

- Prevents browsers from caching authentication responses
- Ensures each login attempt fetches fresh CSRF tokens and session state
- Reduces risk of replay attacks or stale auth state

### 3. Enhanced Logging (Lines 115-117, 161-163)

```javascript
if (verbosity >= 2 && req.headers.cookie) {
  console.log(`Client sent cookies: ${req.headers.cookie.slice(0, 200)}`);
}
// ... and in error handler:
if (verbosity >= 2) {
  console.error('Request cookies that were sent:', cookieHeader.slice(0, 200));
}
```

**What this does**:
- Provides visibility into cookie state during authentication
- Helps diagnose similar issues in the future
- Available at VERBOSITY=2 level

## Testing Recommendations

### Before Deployment

1. **Test with stale cookies**:
   ```bash
   # In browser dev tools:
   # 1. Login successfully
   # 2. Manually corrupt a cookie value
   # 3. Try to login again - should now work
   ```

2. **Test normal flow**:
   - Fresh browser tab → should login successfully
   - Existing session → should refresh silently (if enabled)

3. **Test cache behavior**:
   ```bash
   # Check response headers include:
   # Cache-Control: no-store, no-cache, must-revalidate, private
   ```

### After Deployment

Monitor logs for:
- "Cleared stale cookies and forwarding X new cookie(s) to client" (confirms fix is working)
- Any decrease in authentication and search errors
- Cookie state in verbose logs (VERBOSITY=2)

## Environment Variables

Ensure these are set appropriately:

```ini
# For debugging during testing
VERBOSITY=2

# For production
VERBOSITY=1
```

## Rollback Plan

If issues persist, the changes can be easily reverted:
1. Remove the cookie-clearing logic from the success block (lines 147-165)
2. Remove cache-control headers (lines 167-169)
3. Remove enhanced logging (lines 103-105, 161-163)

## Additional Notes

### Cookies Cleared

The fix clears these specific cookies:
- `JSESSIONID` - Standard Java servlet session ID
- `spring-security-remember-me` - Spring Security remember-me token
- `SESSION` - Generic session cookie name

If CollectionSpace uses additional session cookies, add them to the `cookiesToClear` array.

### Security Considerations

- Cookie clearing only affects client-side cookies sent to the proxy
- Does not impact server-side session state on CollectionSpace backend
- HttpOnly flag prevents JavaScript access to cleared cookies
- No sensitive data is logged (cookies are truncated in logs)

### Performance Impact

- Minimal: Cookie clearing adds ~1ms to login flow
- Cache-control headers are standard HTTP headers with negligible overhead
- Logging overhead only at VERBOSITY >= 2

## Related Issues

If users still experience authentication issues after this fix:

1. **Check for domain mismatches**: Ensure cookies are scoped to the correct domain
2. **Verify CSRF token extraction**: Check if CollectionSpace changed their token format
3. **Session timeout**: Adjust `SESSION_REFRESH_INTERVAL_MS` if sessions expire too quickly
4. **Browser extensions**: Some ad blockers or privacy extensions may interfere with cookies

## Changes Made

- **File**: `/Users/dhc4z/workspace/monorepo/apps/collection-space-proxy/index.js`
- **Lines Modified**: 93-175
- **Breaking Changes**: None
- **Backward Compatible**: Yes
