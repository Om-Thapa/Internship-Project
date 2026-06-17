export const initAnalytics = () => {
  if (import.meta.env.PROD) {
    // GA4 Init Wrapper
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", "G-YOUR_MEASUREMENT_ID");
    }
    // Clarity Tracking Implementation
    if (!window.clarity) {
      (function (c, l, a, r, i, t, y) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        t = l.createElement(r);
        t.async = 1;
        t.src = "https://www.clarity.ms/tag/" + i;
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
    }
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }
  if (window.clarity) {
    window.clarity("event", eventName);
  }
};
