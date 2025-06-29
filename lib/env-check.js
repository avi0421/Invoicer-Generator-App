// lib/env-check.js
// Add this to your app to check environment variables

export function checkEnvironmentVariables() {
  const requiredVars = [
    'JWT_SECRET',
    'MONGODB_URI'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:');
    missing.forEach(varName => {
      console.error(`- ${varName}`);
    });
    return false;
  }

  console.log('All required environment variables are set');
  return true;
}

// Call this in your API routes or app startup
if (typeof window === 'undefined') { // Server-side only
  checkEnvironmentVariables();
}