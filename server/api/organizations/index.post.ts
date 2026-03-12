import { prisma } from '../../utils/prisma';
import { setUserActiveOrgId } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth();
  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const body = await readBody(event);
  const { name } = body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Organization name is required' });
  }

  try {
    const orgId = crypto.randomUUID();

    await prisma.organization.create({
      data: {
        id: orgId,
        name: name.trim(),
        type: 'client',
      },
    });

    await prisma.organizationMember.create({
      data: {
        userId,
        orgId,
        role: 'ADMIN',
      },
    });

    await setUserActiveOrgId(userId, orgId);

    setResponseStatus(event, 201);
    return { id: orgId, name: name.trim(), type: 'client' };
  } catch (err: any) {
    console.error('Create org error:', err);
    throw createError({ statusCode: 500, statusMessage: err.message });
  }
});
