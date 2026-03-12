import { prisma } from '../../utils/prisma';
import { isUserAdmin } from '../../utils/auth';
import { slugify } from '../../utils/utils';

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

  const body = await readBody(event);
  const data: Record<string, any> = {};

  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.content !== undefined) data.content = body.content;
  if (body.contentHtml !== undefined) data.contentHtml = body.contentHtml;
  if (body.locale !== undefined) data.locale = body.locale;
  if (body.tags !== undefined) data.tags = body.tags;
  if (body.author !== undefined) data.author = body.author;
  if (body.image !== undefined) data.image = body.image;
  if (body.slug !== undefined) {
    const newSlug = body.slug.trim() || slugify(body.title || existing.title);
    if (newSlug !== existing.slug) {
      const conflict = await prisma.blogPost.findUnique({ where: { slug: newSlug } });
      if (conflict) {
        throw createError({ statusCode: 409, statusMessage: 'A post with this slug already exists' });
      }
      data.slug = newSlug;
    }
  }

  if (body.published !== undefined) {
    data.published = body.published;
    if (body.published && !existing.publishedAt) {
      data.publishedAt = new Date();
    }
    if (!body.published) {
      data.publishedAt = null;
    }
  }

  const post = await prisma.blogPost.update({ where: { id }, data });
  return post;
});
