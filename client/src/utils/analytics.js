/**
 * PurePuff Analytics — GA4 + Microsoft Clarity
 *
 * Usage:
 *   trackEvent("add_to_cart", { item_name: "PurePuff Candy", value: 2, currency: "INR" });
 *   trackPageView("/products");
 */

// ── Initialise ────────────────────────────────────────────────────────────────
export const initAnalytics = () => {
  if (!import.meta.env.PROD) return; // only run in production

  const GA_ID      = import.meta.env.VITE_GA_MEASUREMENT_ID;
  const CLARITY_ID = import.meta.env.VITE_CLARITY_ID;

  // Google Analytics 4
  if (GA_ID && !window.gtag) {
    const script   = document.createElement("script");
    script.async   = true;
    script.src     = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, {
      send_page_view: false, // we send manually via trackPageView
    });
  }

  // Microsoft Clarity
  if (CLARITY_ID && !window.clarity) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r);
      t.async = 1;
      t.src   = `https://www.clarity.ms/tag/${i}`;
      y = l.getElementsByTagName(r)[0];
      y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", CLARITY_ID);
  }
};

// ── Track page view (call on route change) ────────────────────────────────────
export const trackPageView = (path) => {
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_path:  path || window.location.pathname,
      page_title: document.title,
    });
  }
};

// ── Track custom event ────────────────────────────────────────────────────────
export const trackEvent = (eventName, params = {}) => {
  if (window.gtag) window.gtag("event", eventName, params);
  if (window.clarity) window.clarity("event", eventName);
};

// ── Standard e-commerce events ────────────────────────────────────────────────

/** Called when product is viewed */
export const trackViewItem = (product) =>
  trackEvent("view_item", {
    currency: "INR",
    value:    product.price,
    items: [{
      item_id:   String(product.id),
      item_name: product.name,
      price:     product.price,
    }],
  });

/** Called when item added to cart */
export const trackAddToCart = (product, quantity = 1) =>
  trackEvent("add_to_cart", {
    currency: "INR",
    value:    product.price * quantity,
    items: [{
      item_id:   String(product.id),
      item_name: product.name,
      price:     product.price,
      quantity,
    }],
  });

/** Called when item removed from cart */
export const trackRemoveFromCart = (product, quantity = 1) =>
  trackEvent("remove_from_cart", {
    currency: "INR",
    value:    product.price * quantity,
    items: [{
      item_id:   String(product.id),
      item_name: product.name,
      price:     product.price,
      quantity,
    }],
  });

/** Called on checkout start */
export const trackBeginCheckout = (cartItems, total) =>
  trackEvent("begin_checkout", {
    currency: "INR",
    value:    total,
    items: cartItems.map((i) => ({
      item_id:   String(i.id),
      item_name: i.name,
      price:     i.price,
      quantity:  i.quantity,
    })),
  });

/** Called after successful payment */
export const trackPurchase = (orderId, cartItems, total) =>
  trackEvent("purchase", {
    transaction_id: orderId,
    currency:       "INR",
    value:          total,
    items: cartItems.map((i) => ({
      item_id:   String(i.id),
      item_name: i.name,
      price:     i.price,
      quantity:  i.quantity,
    })),
  });
