import { ConvexHttpClient } from 'convex/browser';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest } from 'next/server';
import { api } from '@/convex/_generated/api';

export async function POST(req: NextRequest) {
  const event = await verifyWebhook(req);
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const syncSecret = process.env.CLERK_WEBHOOK_SYNC_SECRET;

  if (!convexUrl || !syncSecret) {
    return Response.json({ error: 'Missing Convex webhook configuration' }, { status: 500 });
  }

  const client = new ConvexHttpClient(convexUrl);
  await client.mutation(api.profiles.syncFromClerkWebhook, {
    syncSecret,
    eventType: event.type,
    data: event.data as any,
  });

  return Response.json({ ok: true });
}
