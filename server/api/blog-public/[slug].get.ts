export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug');
  const locale = getQuery(event).locale as string | undefined;

  const post = await prisma.blogPost.findFirst({
    where: {
      slug,
      published: true,
      ...(locale ? { locale } : {}),
    },
  });

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' });
  }

  return post;
});
