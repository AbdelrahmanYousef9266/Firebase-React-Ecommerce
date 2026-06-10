const AUTH_ERROR_MESSAGES = {
  'auth/configuration-not-found':
    'Firebase Authentication is not set up. Go to Firebase Console → Authentication → click "Get started" → enable Email/Password.',
  'auth/email-already-in-use':
    'This email is already registered. Try logging in instead.',
  'auth/invalid-email':
    'Please enter a valid email address.',
  'auth/weak-password':
    'Password must be at least 6 characters.',
  'auth/user-not-found':
    'No account found with this email address.',
  'auth/wrong-password':
    'Incorrect password. Please try again.',
  'auth/invalid-credential':
    'Invalid email or password. Please check your details and try again.',
  'auth/too-many-requests':
    'Too many failed attempts. Please wait a moment and try again.',
  'auth/network-request-failed':
    'Network error. Please check your internet connection.',
  'auth/operation-not-allowed':
    'Email/password sign-in is not enabled. Go to Firebase Console → Authentication → Sign-in method and enable Email/Password.',
  'auth/user-disabled':
    'This account has been disabled. Please contact support.',
};

export function getAuthErrorMessage(err) {
  console.error('[Auth] Error code:', err.code);
  console.error('[Auth] Full error:', err.message);
  return AUTH_ERROR_MESSAGES[err.code] ?? err.message ?? 'An unexpected error occurred. Please try again.';
}
