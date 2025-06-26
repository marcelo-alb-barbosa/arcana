import { NextRequest } from 'next/server';
import { webhookController } from '@/app/server/controllers/webhook.controller';

export async function POST(req: NextRequest) {
  return webhookController(req);
}
