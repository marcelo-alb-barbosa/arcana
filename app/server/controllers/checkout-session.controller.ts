import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSessionUseCase } from '../use-cases/create-checkout-session.use-case';

export async function checkoutSessionController(req: NextRequest) {
  try {
    // Extract data from request
    const { planId, regionId, userId } = await req.json();
    
    // Get the origin for success and cancel URLs
    const origin = req.nextUrl.origin;
    
    // Call use case
    const result = await createCheckoutSessionUseCase(
      { planId, regionId, userId },
      origin
    );
    
    // Handle response based on result
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Error in checkout session controller:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the checkout session' },
      { status: 500 }
    );
  }
}