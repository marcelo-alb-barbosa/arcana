import { NextRequest } from 'next/server';
import { getSubscriptionController, updateSubscriptionController } from '@/app/server/controllers/subscription.controller';

// GET: Retrieve subscription status for a user
export async function GET(req: NextRequest) {
  return getSubscriptionController(req);
}

// POST: Update subscription (cancel, reactivate, etc.)
export async function POST(req: NextRequest) {
  return updateSubscriptionController(req);
}
