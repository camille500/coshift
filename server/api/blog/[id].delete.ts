import { prisma } from '../../utils/prisma';
import { isUserAdmin } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth();
  if (!userId || !(await isUserAdmin(userId))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const id = getRouterParam(event, 'id');
  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }

  await prisma.blogPost.delete({ where: { id } });
  return { deleted: true };
});
