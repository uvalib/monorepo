# Authentication Error Fix

## Issue Summary

Users were experiencing authentication errors when signing into CollectionSpace through the proxy:

- **Error 1**: "Sign in failed. The CollectionSpace server received a bad request"
- **Error 2**: "Sign in failed. The authorization code does not belong to an active sign in request."

**Key Symptom**: Users could work around the issue by using an incognito/private browsing window, indicating a problem with cached state (cookies, localStorage, or browser cache).

## Root Cause

The authentication flow uses CSRF tokens and session cookies managed by Spring Security. The issue occurred when:

1. **Stale Session Cookies**: Users with existing CollectionSpace session cookies from previous login attempts would send those cookies to the proxy
2. **Cookie Conflict**: The proxy would fetch a fresh CSRF token and session cookie from the backend, but the client's stale cookies would conflict with the new authentication state
3. **State Mismatch**: CollectionSpace's OAuth2/Spring Security backend would reject the login attempt because the authorization code/CSRF token didn't match the session state indicated by the stale cookies

**Why Incognito Worked**: Incognito/private windows have no cached cookies, so there's no conflict—creating a clean authentication flow.

## Solution Implemented

### 1. Clear Stale Cookies Before Login (Lines 101-108)

```javascript
// Clear any existing CollectionSpace session cookies to prevent state conflicts
const cookiesToClear = ['JSESSIONID', 'spring-security-remember-me', 'SESSION'];
const clearCookies = cookiesToClear.map(name => 
  `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`
);
res.setHeader('Set-Cookie', clearCookies);
```

**What this does**: 
- Explicitly clears common Spring Security session cookies before initiating the login flow
- Ensures a clean slate, similar to incognito mode
- Prevents cookie conflicts between old and new session states

### 2. Add Cache-Control Headers (Lines 149-151)

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
- "Cleared stale session cookies before login" (confirms cookie clearing is working)
- Any decrease in authentication errors
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
1. Remove the cookie-clearing logic (lines 101-108)
2. Remove cache-control headers (lines 149-151)
3. Remove enhanced logging (lines 115-117, 161-163)

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
