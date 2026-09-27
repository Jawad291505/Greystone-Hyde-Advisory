// Stripe-hosted payment link used by every "Pay Securely" CTA on the site.
// Set NEXT_PUBLIC_STRIPE_PAYMENT_LINK in the environment (e.g. .env.local)
// to the link from the Stripe dashboard — the fallback below is a
// placeholder and will not take a payment.
export const STRIPE_PAYMENT_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK || "https://buy.stripe.com/REPLACE_WITH_YOUR_LINK";
