import { Amplify } from 'aws-amplify';

// Check required configuration
if (!process.env.NEXT_PUBLIC_USER_POOL_ID || !process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID) {
  throw new Error('Missing required Cognito configuration');
}

// Create the config object with required fields
const cognitoConfig = {
  userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
  userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID,
  region: process.env.NEXT_PUBLIC_AWS_REGION ?? 'us-east-1' // Provide a default region
} as const;

// Only add identityPoolId if it exists
if (process.env.NEXT_PUBLIC_IDENTITY_POOL_ID) {
  Object.assign(cognitoConfig, {
    identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID
  });
}

Amplify.configure({
  Auth: {
    Cognito: cognitoConfig
  }
});

export { getCurrentUser } from 'aws-amplify/auth';
