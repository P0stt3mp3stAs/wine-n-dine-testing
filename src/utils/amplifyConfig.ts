import { Amplify } from 'aws-amplify';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_daJbUvWzH',
      userPoolClientId: '5hlt0jspd175jnj3j8rf9hf2t2',
      signUpVerificationMethod: 'code',
    }
  }
});