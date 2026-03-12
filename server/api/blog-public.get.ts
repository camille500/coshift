import { prisma } from '../utils/prisma';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const locale = query.locale as string | undefined;

  const posts = await prisma.blogPost.findMany({
    where: { published: true, ...(locale ? { locale } : {}) },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      slug: true,
      locale: true,
      title: true,
      description: true,
      author: true,
      tags: true,
      image: true,
      publishedAt: true,
      createdAt: true,
    },
  });

  return posts;
});
