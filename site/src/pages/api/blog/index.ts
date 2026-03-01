import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import { isAdminOrg } from '../../../lib/auth';
import { slugify } from '../../../lib/utils';

export const GET: APIRoute = async ({ locals }) => {
  const auth = locals.auth();
  if (!auth.userId || !(await isAdminOrg(auth.orgId))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
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

  return new Response(JSON.stringify(posts), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, locals }) => {
  const auth = locals.auth();
  if (!auth.userId || !auth.orgId || !(await isAdminOrg(auth.orgId))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const body = await request.json();
  const { title, description, content, contentHtml, locale, tags, author, published, slug, image } = body;

  if (!title || !description || !content || !contentHtml) {
    return new Response(JSON.stringify({ error: 'Missing required fields: title, description, content, contentHtml' }), { status: 400 });
  }

  const finalSlug = slug?.trim() || slugify(title);

  const existing = await prisma.blogPost.findUnique({ where: { slug: finalSlug } });
  if (existing) {
    return new Response(JSON.stringify({ error: 'A post with this slug already exists' }), { status: 409 });
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
      orgId: auth.orgId,
      createdBy: auth.userId,
    },
  });

  return new Response(JSON.stringify(post), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};
