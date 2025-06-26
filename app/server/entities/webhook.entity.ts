// Webhook entity definitions
import Stripe from "stripe";

export interface WebhookEvent {
  type: string;
  data: {
    object: any;
  };
}

export interface WebhookResponse {
  received?: boolean;
  error?: string;
}

export interface SubscriptionData {
  userId: string;
  planId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId?: string;
  status: 'active' | 'past_due' | 'canceled';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

// Validation functions
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): { isValid: boolean; event?: Stripe.Event; error?: string } {
  try {
    const { stripe } = require('@/lib/stripe');
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return { isValid: true, event };
  } catch (error: any) {
    return { 
      isValid: false, 
      error: `Webhook signature verification failed: ${error.message}` 
    };
  }
}