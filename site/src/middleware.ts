import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';
import { clerkClient } from '@clerk/astro/server';
import { prisma } from './lib/prisma';
import { getUserActiveOrgId } from './lib/auth';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/onboarding(.*)']);
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);
const isPublicRoute = createRouteMatcher(['/', '/en', '/en/(.*)', '/blog(.*)', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)']);

export const onRequest = clerkMiddleware((auth, context, next) => {
  const { userId } = auth();

  // Protected routes require login
  if (isProtectedRoute(context.request) && !userId) {
    return auth().redirectToSignIn();
  }

  // Ensure authenticated users exist in our PG database (in case webhook was missed)
  if (userId) {
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }).then(async (existing) => {
      if (!existing) {
        try {
          const clerk = clerkClient(context);
          const clerkUser = await clerk.users.getUser(userId);
          const email = clerkUser.emailAddresses?.[0]?.emailAddress;
          if (email) {
            await prisma.user.create({
              data: {
                id: userId,
                email,
                name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') || null,
                avatar: clerkUser.imageUrl || null,
                role: 'USER',
              },
            });
          }
        } catch {
          // User may have been created concurrently — that's fine
        }
      }
    });
  }

  // Org-based redirects (only for non-API, non-public routes)
  if (userId && !isPublicRoute(context.request) && !context.request.url.includes('/api/')) {
    return getUserActiveOrgId(userId).then(async (orgId): Promise<Response> => {
      // Logged-in users without an active org get redirected to onboarding
      if (!orgId && !isOnboardingRoute(context.request)) {
        return context.redirect('/onboarding');
      }

      // Users on onboarding who already have an org go to home
      if (orgId && isOnboardingRoute(context.request)) {
        return context.redirect('/');
      }

      return await next();
    });
  }
});
