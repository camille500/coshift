import { prisma } from '../../utils/prisma';
import { setUserActiveOrgId } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth();
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const { code } = body;

  if (!code || typeof code !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Invite code is required' });
  }

  try {
    const invite = await prisma.inviteCode.findUnique({
      where: { code: code.trim() },
    });

    if (!invite) {
      throw createError({ statusCode: 404, statusMessage: 'Invalid invite code' });
    }

    if (invite.expiresAt && invite.expiresAt < new Date()) {
      throw createError({ statusCode: 410, statusMessage: 'Invite code has expired' });
    }

    if (invite.maxUses && invite.uses >= invite.maxUses) {
      throw createError({ statusCode: 410, statusMessage: 'Invite code has reached maximum uses' });
    }

    await prisma.organizationMember.create({
      data: {
        userId,
        orgId: invite.orgId,
        role: 'USER',
      },
    });

    await prisma.inviteCode.update({
      where: { id: invite.id },
      data: { uses: { increment: 1 } },
    });

    await setUserActiveOrgId(userId, invite.orgId);

    const org = await prisma.organization.findUnique({ where: { id: invite.orgId } });

    return { orgId: invite.orgId, orgName: org?.name };
  } catch (err: any) {
    if (err.statusCode) throw err;
    console.error('Join org error:', err);
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
