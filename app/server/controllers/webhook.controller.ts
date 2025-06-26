import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { handleWebhookUseCase } from '../use-cases/webhook.use-case';

// Controller for handling POST requests to process Stripe webhooks
export async function webhookController(req: NextRequest) {
  try {
    // Get the request body as text
    const body = await req.text();
    
    // Get the Stripe signature from headers
    const signature = (await headers()).get('stripe-signature') as string;
    
    // Get the webhook secret from environment variables
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('Missing STRIPE_WEBHOOK_SECRET environment variable');
      return NextResponse.json(
        { error: 'Webhook secret is not configured' },
        { status: 500 }
      );
    }
    
    // Call use case
    const result = await handleWebhookUseCase(body, signature, webhookSecret);
    
    // Handle response based on result
    if (result.error) {
      console.error(`Webhook error: ${result.error}`);
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error in webhook controller:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing the webhook' },
      { status: 500 }
    );
  }
}