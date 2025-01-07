// src/utils/amplify-config.ts
import { Amplify } from 'aws-amplify';

Amplify.configure({
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      region: process.env.NEXT_PUBLIC_AWS_REGION!
    }
  }
});
