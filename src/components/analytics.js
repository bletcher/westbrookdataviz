export function setupAnalytics() {
  // Create the script element with AWS RUM configuration
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://rum.us-east-2.amazonaws.com/1.0.2/cwr.js';
  script.onload = function() {
    window.cwr('init', {
      sessionSampleRate: 1,
      identityPoolId: "us-east-2:ace87ca1-6eaa-4f02-9b0e-cf9ac1a67014",
      endpoint: "https://dataplane.rum.us-east-2.amazonaws.com",
      telemetries: ["performance", "errors", "http"],
      allowCookies: true,
      enableXRay: false
    });
  };
  
  // Add the script to the document head
  document.head.insertBefore(script, document.head.firstChild);
} 