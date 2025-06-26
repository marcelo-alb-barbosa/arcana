import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { 
  SubscriptionResponseEntity, 
  SubscriptionActionResponseEntity,
  validateSubscriptionRequest,
  validateSubscriptionAction
} from '../entities/subscription.entity';

// Get subscription status for a user
export async function getSubscriptionUseCase(userId: string): Promise<{ success: boolean; data?: SubscriptionResponseEntity; error?: string }> {
  try {
    // Validate request
    const validation = validateSubscriptionRequest(userId);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Get the user's active subscription from the database
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!subscription) {
      return { success: true, data: { active: false } };
    }

    // Get the subscription plan details
    const plan = await prisma.regionalPrice.findFirst({
      where: {
        planId: subscription.planId,
        stripePriceId: subscription.stripePriceId,
      },
      select: {
        planId: true,
        regionId: true,
        amount: true,
        interval: true,
      },
    });

    return {
      success: true,
      data: {
        active: true,
        subscription,
        plan,
      }
    };
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    return { success: false, error: 'An error occurred while retrieving the subscription' };
  }
}

// Update subscription (cancel, reactivate, etc.)
export async function updateSubscriptionUseCase(
  action: string,
  subscriptionId: string,
  userId: string
): Promise<{ success: boolean; data?: SubscriptionActionResponseEntity; error?: string }> {
  try {
    // Validate request
    const validation = validateSubscriptionAction(action, subscriptionId, userId);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Get the subscription from the database
    const subscription = await prisma.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId,
      },
    });

    if (!subscription) {
      return { success: false, error: 'Subscription not found' };
    }

    // Handle different actions
    switch (action) {
      case 'cancel':
        // Cancel the subscription at the end of the current period
        if (subscription.stripeSubscriptionId) {
          await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: true,
          });

          // Update the subscription in the database
          await prisma.subscription.update({
            where: {
              id: subscriptionId,
            },
            data: {
              cancelAtPeriodEnd: true,
            },
          });

          return {
            success: true,
            data: {
              success: true,
              message: 'Subscription will be canceled at the end of the current period',
            }
          };
        }
        break;

      case 'reactivate':
        // Reactivate a subscription that was set to cancel
        if (subscription.stripeSubscriptionId && subscription.cancelAtPeriodEnd) {
          await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
            cancel_at_period_end: false,
          });

          // Update the subscription in the database
          await prisma.subscription.update({
            where: {
              id: subscriptionId,
            },
            data: {
              cancelAtPeriodEnd: false,
            },
          });

          return {
            success: true,
            data: {
              success: true,
              message: 'Subscription reactivated successfully',
            }
          };
        }
        break;

      case 'cancel-immediately':
        // Cancel the subscription immediately
        if (subscription.stripeSubscriptionId) {
          await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

          // Update the subscription in the database
          await prisma.subscription.update({
            where: {
              id: subscriptionId,
            },
            data: {
              status: 'canceled',
              cancelAtPeriodEnd: false,
            },
          });

          return {
            success: true,
            data: {
              success: true,
              message: 'Subscription canceled immediately',
            }
          };
        }
        break;

      default:
        return { success: false, error: 'Invalid action' };
    }

    return { success: false, error: 'Could not process the action' };
  } catch (error) {
    console.error('Error updating subscription:', error);
    return { success: false, error: 'An error occurred while updating the subscription' };
  }
}