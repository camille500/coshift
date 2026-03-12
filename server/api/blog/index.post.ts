import { prisma } from '../../utils/prisma';
import { isUserAdmin, getUserActiveOrgId } from '../../utils/auth';
import { slugify } from '../../utils/utils';

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth();
  if (!userId || !(await isUserAdmin(userId))) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const orgId = await getUserActiveOrgId(userId);
  if (!orgId) {
    throw createError({ statusCode: 403, statusMessage: 'No active organization' });
  }

  const body = await readBody(event);
  const { title, description, content, contentHtml, locale, tags, author, published, slug, image } = body;

  if (!title || !description || !content || !contentHtml) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields: title, description, content, contentHtml' });
  }

  const finalSlug = slug?.trim() || slugify(title);

  const existing = await prisma.blogPost.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'A post with this slug already exists' });
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug: finalSlug,
      description,
      content,
      contentHtml,
      locale: locale || 'nl',
      tags: tags || [],
      author: author || 'Camille',
      published: published ?? false,
      publishedAt: published ? new Date() : null,
      image: image || null,
      orgId,
      createdBy: userId,
    },
  });

  setResponseStatus(event, 201);
  return post;
});
