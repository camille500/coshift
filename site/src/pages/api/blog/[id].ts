import type { APIRoute } from 'astro';
import { prisma } from '../../../lib/prisma';
import { isAdminOrg } from '../../../lib/auth';
import { slugify } from '../../../lib/utils';

export const GET: APIRoute = async ({ params, locals }) => {
  const auth = locals.auth();
  if (!auth.userId || !(await isAdminOrg(auth.orgId))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
  }

  return new Response(JSON.stringify(post), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PUT: APIRoute = async ({ params, request, locals }) => {
  const auth = locals.auth();
  if (!auth.userId || !(await isAdminOrg(auth.orgId))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
  }

  const body = await request.json();
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
        return new Response(JSON.stringify({ error: 'A post with this slug already exists' }), { status: 409 });
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

  const post = await prisma.blogPost.update({
    where: { id: params.id },
    data,
  });

  return new Response(JSON.stringify(post), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  const auth = locals.auth();
  if (!auth.userId || !(await isAdminOrg(auth.orgId))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const existing = await prisma.blogPost.findUnique({ where: { id: params.id } });
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Post not found' }), { status: 404 });
  }

  await prisma.blogPost.delete({ where: { id: params.id } });

  return new Response(JSON.stringify({ deleted: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
