import { Amplify } from 'aws-amplify';
import { getAmplifyConfig } from '../utils/auth-config';
// or if you prefer using absolute paths, make sure your tsconfig.json has the proper path aliases

// Only configure Amplify on the client side
if (typeof window !== 'undefined') {
  const config = getAmplifyConfig();
  const { userPoolId, userPoolClientId } = config.Auth.Cognito;
  if (userPoolId && userPoolClientId) {
    Amplify.configure({
      ...config,
      Auth: {
        ...config.Auth,
        Cognito: {
          ...config.Auth.Cognito,
          userPoolId,
          userPoolClientId
        }
      }
    });
  }
}

export { getCurrentUser } from 'aws-amplify/auth';
