import { AwsRum } from 'aws-rum-web';

export function setupAnalytics() {
  try {
    const config = {
      sessionSampleRate: 1,
      identityPoolId: "us-east-2:ace87ca1-6eaa-4f02-9b0e-cf9ac1a67014",
      endpoint: "https://dataplane.rum.us-east-2.amazonaws.com",
      telemetries: ["performance", "errors", "http"],
      allowCookies: true,
      enableXRay: false
    };

    const APPLICATION_ID = '25e7c184-e75c-43a2-93b4-5d571327cbd9';
    const APPLICATION_VERSION = '1.0.0';
    const APPLICATION_REGION = 'us-east-2';

    const awsRum = new AwsRum(
      APPLICATION_ID,
      APPLICATION_VERSION,
      APPLICATION_REGION,
      config
    );
  } catch (error) {
    // Ignore errors thrown during CloudWatch RUM web client initialization
    console.error('Failed to initialize AWS RUM:', error);
  }
} 