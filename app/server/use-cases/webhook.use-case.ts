import { prisma } from '@/lib/prisma';
import { 
  WebhookResponse, 
  validateWebhookSignature 
} from '../entities/webhook.entity';
import Stripe from 'stripe';

// Use case for handling Stripe webhook events
export async function handleWebhookUseCase(
  payload: string,
  signature: string,
  secret: string
): Promise<WebhookResponse> {
  try {
    // Validate webhook signature
    const validation = validateWebhookSignature(payload, signature, secret);
    if (!validation.isValid) {
      return { error: validation.error };
    }

    const event = validation.event;
    if (!event) {
      return { error: 'Invalid event' };
    }

    // Handle the event based on its type
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { received: true };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return { error: 'An error occurred while processing the webhook' };
  }
}

// Handler for checkout.session.completed event
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  // Extract metadata
  const { userId, planId } = session.metadata || {};

  if (userId && planId) {
    // Create a new subscription record in the database
    await prisma.subscription.create({
      data: {
        userId,
        planId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        stripePriceId: session.line_items?.data[0]?.price?.id,
        status: 'active',
        currentPeriodStart: new Date(session?.current_period_start * 1000),
        currentPeriodEnd: new Date(session?.current_period_end * 1000),
        cancelAtPeriodEnd: false,
      },
    });

    console.log(`Subscription created for user ${userId}`);
  }
}

// Handler for invoice.paid event
async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  // Update subscription status to active
  if (invoice.subscription) {
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: invoice.subscription as string,
      },
      data: {
        status: 'active',
        currentPeriodStart: new Date(invoice.period_start * 1000),
        currentPeriodEnd: new Date(invoice.period_end * 1000),
      },
    });

    console.log(`Subscription ${invoice.subscription} updated to active`);
  }
}

// Handler for invoice.payment_failed event
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  // Update subscription status to past_due
  if (invoice.subscription) {
    await prisma.subscription.updateMany({
      where: {
        stripeSubscriptionId: invoice.subscription as string,
      },
      data: {
        status: 'past_due',
      },
    });

    console.log(`Subscription ${invoice.subscription} updated to past_due`);
  }
}

// Handler for customer.subscription.updated event
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  // Update subscription details
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id as string,
    },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  console.log(`Subscription ${subscription.id} updated`);
}

// Handler for customer.subscription.deleted event
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  // Update subscription status to canceled
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id as string,
    },
    data: {
      status: 'canceled',
    },
  });

  console.log(`Subscription ${subscription.id} canceled`);
}