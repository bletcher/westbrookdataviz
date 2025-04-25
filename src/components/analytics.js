export function setupAnalytics() {
  try {
    const script = document.createElement('script');
    script.src = 'https://client.rum.us-east-2.amazonaws.com/1.0.2/cwr.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = function() {
      window.cwr('init', {
        sessionSampleRate: 1,
        identityPoolId: 'us-east-2:ace87ca1-6eaa-4f02-9b0e-cf9ac1a67014',
        endpoint: 'https://dataplane.rum.us-east-2.amazonaws.com',
        telemetries: ['errors', 'performance'],
        allowCookies: true
      });
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error initializing AWS RUM:', error);
  }
} 