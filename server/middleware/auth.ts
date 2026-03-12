import { clerkClient, clerkMiddleware } from '@clerk/nuxt/server';
import { getRequestURL, sendRedirect } from 'h3';
import { prisma } from '../utils/prisma';
import { getUserActiveOrgId } from '../utils/auth';

export default clerkMiddleware(async (event) => {
  try {
    const url = getRequestURL(event);
    const path = url.pathname;

    // Redirect legacy/Clerk-default paths
    if (path === '/dashboard') {
      await sendRedirect(event, '/', 301);
      return;
    }
    if (path === '/nl' || path === '/nl/') {
      await sendRedirect(event, '/', 301);
      return;
    }

    const isProtectedRoute = path.startsWith('/admin') || path.startsWith('/onboarding');
    const isOnboardingRoute = path.startsWith('/onboarding');
    const isPublicRoute =
      path === '/' ||
      path === '/en' ||
      path.startsWith('/en/') ||
      path.startsWith('/blog') ||
      path.startsWith('/sign-in') ||
      path.startsWith('/sign-up') ||
      path.startsWith('/sso-callback') ||
      path.startsWith('/api/webhooks') ||
      path.startsWith('/_') ||
      path.startsWith('/api/_') ||
      path.includes('.');

    const { userId } = event.context.auth();

    // Protected routes require login
    if (isProtectedRoute && !userId) {
      await sendRedirect(event, '/sign-in');
      return;
    }

    // Ensure authenticated users exist in our PG database (in case webhook was missed)
    if (userId) {
      prisma.user.findUnique({ where: { id: userId }, select: { id: true } }).then(async (existing) => {
        if (!existing) {
          try {
            const client = clerkClient(event);
            const clerkUser = await client.users.getUser(userId);
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
    if (userId && !isPublicRoute && !path.includes('/api/')) {
      const orgId = await getUserActiveOrgId(userId);

      // Logged-in users without an active org get redirected to onboarding
      if (!orgId && !isOnboardingRoute) {
        await sendRedirect(event, '/onboarding');
        return;
      }

      // Users on onboarding who already have an org go to home
      if (orgId && isOnboardingRoute) {
        await sendRedirect(event, '/');
        return;
      }
    }
  } catch (err) {
    console.error('[auth middleware]', err);
    throw err;
  }
});
