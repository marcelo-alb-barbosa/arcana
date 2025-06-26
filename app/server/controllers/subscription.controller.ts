import { NextRequest, NextResponse } from 'next/server';
import { getSubscriptionUseCase, updateSubscriptionUseCase } from '../use-cases/subscription.use-case';

// GET: Retrieve subscription status for a user
export async function getSubscriptionController(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    // Call use case
    const result = await getSubscriptionUseCase(userId);

    // Handle response based on result
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in subscription controller:', error);
    return NextResponse.json(
      { error: 'An error occurred while retrieving the subscription' },
      { status: 500 }
    );
  }
}

// POST: Update subscription (cancel, reactivate, etc.)
export async function updateSubscriptionController(req: NextRequest) {
  try {
    const { action, subscriptionId, userId } = await req.json();

    // Call use case
    const result = await updateSubscriptionUseCase(action, subscriptionId, userId);

    // Handle response based on result
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === 'Subscription not found' ? 404 : 400 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error in subscription controller:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the subscription' },
      { status: 500 }
    );
  }
}