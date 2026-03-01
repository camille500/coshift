import type { APIRoute } from 'astro';
import { clerkClient } from '@clerk/astro/server';
import { prisma } from '../../../lib/prisma';

export const POST: APIRoute = async (context) => {
  const auth = context.locals.auth();
  if (!auth.userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await context.request.json();
  const { code } = body;

  if (!code || typeof code !== 'string') {
    return new Response(JSON.stringify({ error: 'Invite code is required' }), { status: 400 });
  }

  try {
    const invite = await prisma.inviteCode.findUnique({
      where: { code: code.trim() },
    });

    if (!invite) {
      return new Response(JSON.stringify({ error: 'Invalid invite code' }), { status: 404 });
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      return new Response(JSON.stringify({ error: 'Invite code has expired' }), { status: 410 });
    }

    if (invite.maxUses && invite.uses >= invite.maxUses) {
      return new Response(JSON.stringify({ error: 'Invite code has reached maximum uses' }), { status: 410 });
    }

    // Add user to the Clerk organization
    const clerk = clerkClient(context);
    await clerk.organizations.createOrganizationMembership({
      organizationId: invite.orgId,
      userId: auth.userId,
      role: 'org:member',
    });

    // Increment invite usage
    await prisma.inviteCode.update({
      where: { id: invite.id },
      data: { uses: { increment: 1 } },
    });

    const org = await prisma.organization.findUnique({
      where: { id: invite.orgId },
    });

    return new Response(JSON.stringify({ orgId: invite.orgId, orgName: org?.name }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Join org error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};
