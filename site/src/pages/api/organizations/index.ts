import type { APIRoute } from 'astro';
import { clerkClient } from '@clerk/astro/server';
import { prisma } from '../../../lib/prisma';

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
    // Create organization in Clerk (user becomes admin automatically)
    const clerk = clerkClient(context);
    const clerkOrg = await clerk.organizations.createOrganization({
      name: name.trim(),
      createdBy: auth.userId,
    });

    // Sync to our Prisma database
    await prisma.organization.create({
      data: {
        id: clerkOrg.id,
        name: clerkOrg.name,
        type: 'client',
      },
    });

    // Set this org as the user's active organization
    await clerk.users.updateUser(auth.userId, {
      publicMetadata: { orgId: clerkOrg.id },
    });

    return new Response(JSON.stringify({ id: clerkOrg.id, name: clerkOrg.name, type: 'client' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Create org error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
