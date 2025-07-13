// Simple and secure authentication utilities
// Token management is handled by backend via HttpOnly cookies

// Check if user is authenticated (relies on backend validation)
export const isAuthenticated = () => {
  // In cookie-based auth, we can't directly check the token
  // Instead, we rely on API calls to determine auth status
  return sessionStorage.getItem('isAuthenticated') === 'true';
};

// Set authentication status (called after successful login/logout)
export const setAuthStatus = (isAuth) => {
  if (isAuth) {
    sessionStorage.setItem('isAuthenticated', 'true');
  } else {
    sessionStorage.removeItem('isAuthenticated');
  }
};

// Clear authentication status
export const clearAuthStatus = () => {
  sessionStorage.removeItem('isAuthenticated');
  localStorage.removeItem('isAuthenticated'); // Also clear localStorage if used
  // Clear any other auth-related data
  sessionStorage.removeItem('adminProfile');
  localStorage.removeItem('adminProfile');
  // Dispatch logout event for other tabs
  window.dispatchEvent(new CustomEvent('auth:logout'));
};

// Alias for API service compatibility
export const clearUserSession = clearAuthStatus;
export const clearAuthToken = clearAuthStatus; // For AdminDashboard compatibility

// Basic encryption for sensitive form data (development fallback)
export const encrypt = (data) => {
  if (!data) return null;

  try {
    // Simple base64 encoding for development
    // Backend will handle proper encryption
    return btoa(
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

// Alias for consistency
export const encryptData = encrypt;

// Alias for compatibility with existing components
export const setAuthToken = setAuthStatus;

// Listen for logout events from other tabs
window.addEventListener('auth:logout', () => {
  clearAuthStatus();
  window.location.href = '/admin/login';
});

// Listen for session expired events
window.addEventListener('auth:sessionExpired', (event) => {
  clearAuthStatus();
  const redirectTo = event.detail?.redirectTo || '/admin/login';
  window.location.href = redirectTo;
});

export default {
  isAuthenticated,
  setAuthStatus,
  setAuthToken,
  clearAuthStatus,
  clearUserSession,
  clearAuthToken,
  encrypt,
  encryptData,
};
