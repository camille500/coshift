import { prisma } from '../../utils/prisma';

export default defineEventHandler(async () => {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: {
      slug: true,
      locale: true,
      publishedAt: true,
      updatedAt: true,
    },
  });

  return posts.map((post) => ({
    loc: post.locale === 'nl' ? `/blog/${post.slug}` : `/en/blog/${post.slug}`,
    lastmod: post.updatedAt || post.publishedAt,
  }));
});
