import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';

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
      case 'user.created': {
        const email = data.email_addresses?.[0]?.email_address;
        if (email) {
          await prisma.user.upsert({
            where: { id: data.id },
            update: {
              email,
              name: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
              avatar: data.image_url || null,
            },
            create: {
              id: data.id,
              email,
              name: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
              avatar: data.image_url || null,
            },
          });
        }
        break;
      }
      case 'user.updated': {
        const email = data.email_addresses?.[0]?.email_address;
        if (email) {
          await prisma.user.upsert({
            where: { id: data.id },
            update: {
              email,
              name: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
              avatar: data.image_url || null,
            },
            create: {
              id: data.id,
              email,
              name: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
              avatar: data.image_url || null,
            },
          });
        }
        break;
      }
      case 'user.deleted': {
        await prisma.user.delete({
          where: { id: data.id },
        }).catch(() => {});
        break;
      }

      // Organization events
      case 'organization.created': {
        await prisma.organization.upsert({
          where: { id: data.id },
          update: { name: data.name },
          create: {
            id: data.id,
            name: data.name,
            type: 'client',
          },
        });
        break;
      }
      case 'organization.updated': {
        await prisma.organization.update({
          where: { id: data.id },
          data: { name: data.name },
        });
        break;
      }
      case 'organization.deleted': {
        await prisma.organization.delete({
          where: { id: data.id },
        }).catch(() => {});
        break;
      }

      // Organization membership events
      case 'organizationMembership.created': {
        const userId = data.public_user_data?.user_id;
        const orgId = data.organization?.id;
        if (userId && orgId) {
          await prisma.user.update({
            where: { id: userId },
            data: { orgId },
          }).catch(() => {});
        }
        break;
      }
      case 'organizationMembership.deleted': {
        const userId = data.public_user_data?.user_id;
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: { orgId: null },
          }).catch(() => {});
        }
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
