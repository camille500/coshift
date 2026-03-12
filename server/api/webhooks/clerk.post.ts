import { prisma } from '../../utils/prisma';
import { ensureUserExists } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw createError({ statusCode: 500, statusMessage: 'Webhook secret not configured' });
  }

  const payload = await readRawBody(event);
  let webhookEvent: any;

  try {
    webhookEvent = JSON.parse(payload || '');
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid JSON' });
  }

  const type = webhookEvent.type as string;
  const data = webhookEvent.data;

  try {
    switch (type) {
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
        await prisma.user.delete({ where: { id: data.id } }).catch(() => {});
        break;
      }
    }

    return { received: true };
  } catch (err: any) {
    console.error('Webhook error:', err);
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
