/**
 * Utility functions for handling errors in the application
 */

// Function to get a user-friendly error message from Firebase error codes
export const getFirebaseErrorMessage = (error: any): string => {
  // If the error is a string, return it directly
  if (typeof error === 'string') {
    return error;
  }

  // Extract the error code if available
  const errorCode = error.code || '';

  // Map Firebase error codes to user-friendly messages
  switch (errorCode) {
    // Authentication errors
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/email-already-in-use':
      return 'This email is already in use. Please try another email or sign in.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    
    // Firestore errors
    case 'permission-denied':
      return 'You do not have permission to perform this action.';
    case 'not-found':
      return 'The requested resource was not found.';
    
    // Default error message
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

// Function to log errors to console with additional context
export const logError = (error: any, context: string): void => {
  console.error(`Error in ${context}:`, error);
  
  // In a production app, you might want to send errors to a monitoring service
  // Example: sendToErrorMonitoring(error, context);
};

// Function to handle errors in async functions
export const handleAsyncError = async <T>(
  promise: Promise<T>,
  context: string
): Promise<[T | null, Error | null]> => {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    logError(error, context);
    return [null, error as Error];
  }
};
