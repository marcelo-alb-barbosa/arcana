# Stripe Integration for Regionalized Subscriptions

This document describes the implementation of the regionalized subscription system using Stripe for the ARCANA project.

## Overview

The system allows users to subscribe to different plans with pricing that varies by region. The implementation includes:

1. **Region-based pricing**: Different prices for each subscription plan based on the user's region
2. **Multi-currency support**: Prices displayed in the user's local currency
3. **Internationalization**: UI text in the user's preferred language
4. **Stripe integration**: Secure payment processing and subscription management

## Architecture

### Data Models

The system uses the following data models:

- **Region**: Defines a geographic region with its currency and locale
- **SubscriptionPlan**: Defines a subscription plan with its features and credits
- **RegionalPrice**: Defines the price of a plan in a specific region
- **Subscription**: Tracks a user's subscription in the database

### Frontend Components

- **AssinaturaPage**: Main subscription page with region selector and plan display
- **PlanoAssinaturaCard**: Displays a subscription plan with region-specific pricing
- **ModalConfirmacaoAssinatura**: Confirmation modal for subscribing to a plan
- **StatusAssinaturaCard**: Displays the user's current subscription status

### Backend API Routes

- **/api/create-checkout-session**: Creates a Stripe checkout session for a subscription
- **/api/webhook**: Handles Stripe webhook events (subscription created, updated, etc.)
- **/api/subscription**: Manages subscriptions (get status, cancel, reactivate)

## Implementation Details

### Region Selection

Users can select their region from a dropdown menu on the subscription page. The selected region determines:

1. The currency used to display prices
2. The locale used to format numbers and dates
3. The prices of subscription plans

### Subscription Flow

1. User selects a region and a subscription plan
2. User clicks "Subscribe" and confirms in the modal
3. Frontend calls `/api/create-checkout-session` with plan ID, region ID, and user ID
4. Backend creates a Stripe checkout session and returns the URL
5. User is redirected to Stripe checkout page
6. User enters payment information and completes checkout
7. Stripe sends a webhook event to `/api/webhook`
8. Backend creates a subscription record in the database
9. User is redirected back to the subscription page

### Subscription Management

Users can manage their subscriptions through the UI:

1. **Cancel subscription**: Sets the subscription to cancel at the end of the current period
2. **Reactivate subscription**: Removes the cancellation status from a subscription

These actions call the `/api/subscription` API route with the appropriate action.

## Stripe Configuration

### Products and Prices

In the Stripe dashboard, you need to create:

1. **Products** for each subscription plan (Místico, Oráculo, Mestre)
2. **Prices** for each product in each supported currency

### Webhook Events

The system handles the following Stripe webhook events:

- `checkout.session.completed`: When a checkout is completed
- `invoice.paid`: When an invoice is paid
- `invoice.payment_failed`: When an invoice payment fails
- `customer.subscription.updated`: When a subscription is updated
- `customer.subscription.deleted`: When a subscription is deleted

## Environment Variables

The following environment variables are required:

```
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
```

## Testing

To test the system:

1. Set up Stripe in test mode
2. Use Stripe test cards (e.g., 4242 4242 4242 4242)
3. Use the Stripe CLI to forward webhook events to your local environment:
   ```
   stripe listen --forward-to localhost:3000/api/webhook
   ```

## Future Improvements

1. **Tax handling**: Implement tax calculation based on the user's region
2. **Coupon support**: Allow users to apply coupons to their subscriptions
3. **Subscription upgrades/downgrades**: Allow users to change their subscription plan
4. **Usage-based billing**: Track credit usage and bill accordingly
5. **Automatic region detection**: Detect the user's region based on IP address