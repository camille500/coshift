import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth();
  if (!auth.userId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
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
