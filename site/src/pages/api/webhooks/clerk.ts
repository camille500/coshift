import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import { ensureUserExists } from '../../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
  const webhookSecret = import.meta.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new Response('Webhook secret not configured', { status: 500 });
  }

  const payload = await request.text();
  let event: any;

  try {
    event = JSON.parse(payload);
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const type = event.type as string;
  const data = event.data;

  try {
    switch (type) {
      // User events
      case 'user.created':
      case 'user.updated': {
        const email = data.email_addresses?.[0]?.email_address;
        if (email) {
          const name = [data.first_name, data.last_name].filter(Boolean).join(' ') || null;
          await ensureUserExists(data.id, email, name, data.image_url || null);
        }
        break;
      }
      case 'user.deleted': {
        await prisma.user.delete({
          where: { id: data.id },
        }).catch(() => {});
        break;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
