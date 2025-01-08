import { Amplify } from 'aws-amplify';

// Define the configuration type
type AmplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: string;
      userPoolClientId: string;
    }
  }
};

// Create the configuration object
const amplifyConfig: AmplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID ?? '',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID ?? ''
    }
  }
};

// Only configure Amplify on the client side
if (typeof window !== 'undefined') {
  if (amplifyConfig.Auth.Cognito.userPoolId && amplifyConfig.Auth.Cognito.userPoolClientId) {
    try {
      Amplify.configure(amplifyConfig);
    } catch (error) {
      console.error('Error configuring Amplify:', error);
    }
  } else {
    console.warn('Missing Amplify configuration values');
  }
}

// Export what you need from aws-amplify
export { getCurrentUser, signIn, signOut } from 'aws-amplify/auth';
