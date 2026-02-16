// Stripe client integration for Pawtrait Pals
// Uses standard Stripe SDK with environment variables

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover' as any,
});

export async function getUncachableStripeClient(): Promise<Stripe> {
  return stripe;
}

export async function getStripePublishableKey(): Promise<string> {
  return process.env.STRIPE_PUBLISHABLE_KEY!;
}

export const STRIPE_PLAN_PRICE_MAP: Record<string, { id: number; name: string }> = {
  'price_1Sz4cNBL11m7KnKuj1rTreVC': { id: 6, name: 'Starter' },
  'price_1Sz4cOBL11m7KnKuNTnrgKDk': { id: 7, name: 'Professional' },
  'price_1Sz4tFBL11m7KnKu3E12DPOG': { id: 8, name: 'Executive' },
};

export function mapStripeStatusToInternal(
  stripeStatus: string,
  currentStatus?: string | null
): string {
  switch (stripeStatus) {
    case 'active': return 'active';
    case 'trialing': return 'trial';
    case 'past_due': return 'past_due';
    case 'canceled':
    case 'unpaid':
    case 'incomplete':
    case 'incomplete_expired':
    case 'paused':
      return 'canceled';
    default:
      return currentStatus || 'inactive';
  }
}
