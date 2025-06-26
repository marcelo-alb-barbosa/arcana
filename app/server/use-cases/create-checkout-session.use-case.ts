import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { getPlanPrice, getRegion, getPlans, getRegionalPlanContent } from '@/lib/subscription-data';
import { 
  CheckoutSessionRequest, 
  CheckoutSessionResponse, 
  validateCheckoutSessionRequest 
} from '../entities/checkout-session.entity';

export async function createCheckoutSessionUseCase(
  request: CheckoutSessionRequest,
  origin: string
): Promise<CheckoutSessionResponse> {
  try {
    // Validate request
    const validation = validateCheckoutSessionRequest(request);
    if (!validation.isValid) {
      return { error: validation.error };
    }

    const { planId, regionId, userId } = request;

    // Get plan and region
    const plans = await getPlans();
    const plan = plans.find(p => p.id === planId);
    const region = await getRegion(regionId);

    if (!plan || !region) {
      return { error: 'Invalid plan or region' };
    }

    // Get price for the plan in the specified region
    const price = await getPlanPrice(planId, regionId);
    if (!price) {
      return { error: 'Price not found for the specified plan and region' };
    }

    // Format amount for Stripe (convert to smallest currency unit)
    const amount = formatAmountForStripe(price, region.currencyCode);

    // Get regional content for the plan
    const regionalContent = await getRegionalPlanContent(plan, regionId);

    // Create a Stripe Checkout Session
    const session: any = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: region.currencyCode.toLowerCase(),
            product_data: {
              name: regionalContent.title,
              description: regionalContent.description,
              metadata: {
                planId: plan.id,
              },
            },
            unit_amount: amount,
            recurring: {
              interval: plan.interval === 'month' ? 'month' : 
                        plan.interval === 'quarter' ? 'month' : 'year',
              interval_count: plan.interval === 'quarter' ? 3 : 1,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/assinatura?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/assinatura?canceled=true`,
      metadata: {
        userId: userId || '',
        planId: plan.id,
        regionId: region.id,
      },
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { error: 'An error occurred while creating the checkout session' };
  }
}