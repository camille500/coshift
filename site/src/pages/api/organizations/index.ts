import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth();
  if (!auth.userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const { name } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Organization name is required' }), { status: 400 });
  }

  try {
    const org = await prisma.organization.create({
      data: {
        id: `org_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`,
        name: name.trim(),
        type: 'client',
      },
    });

    return new Response(JSON.stringify(org), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Create org error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
