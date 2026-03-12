import { prisma } from '../../utils/prisma';
import { isUserAdmin } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth();
  if (!userId || !(await isUserAdmin(userId))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      locale: true,
      title: true,
      description: true,
      author: true,
      tags: true,
      published: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return posts;
});
