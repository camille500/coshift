import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import { setUserActiveOrgId } from '../../../lib/auth';

export const POST: APIRoute = async (context) => {
  const auth = context.locals.auth();
  if (!auth.userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await context.request.json();
  const { name } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Organization name is required' }), { status: 400 });
  }

  try {
    const orgId = crypto.randomUUID();

    // Create organization in our Prisma database
    await prisma.organization.create({
      data: {
        id: orgId,
        name: name.trim(),
        type: 'client',
      },
    });

    // Create membership record — creator is org ADMIN
    await prisma.organizationMember.create({
      data: {
        userId: auth.userId,
        orgId,
        role: 'ADMIN',
      },
    });

    // Set this org as the user's active organization
    await setUserActiveOrgId(auth.userId, orgId);

    return new Response(JSON.stringify({ id: orgId, name: name.trim(), type: 'client' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Create org error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
