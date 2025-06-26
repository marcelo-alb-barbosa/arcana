import { NextRequest } from 'next/server';
import { checkoutSessionController } from '@/app/server/controllers/checkout-session.controller';

export async function POST(req: NextRequest) {
  return checkoutSessionController(req);
}
