import { clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/onboarding(.*)']);
const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);
const isPublicRoute = createRouteMatcher(['/', '/en', '/en/(.*)', '/blog(.*)', '/sign-in(.*)', '/sign-up(.*)', '/api/webhooks(.*)']);

export const onRequest = clerkMiddleware((auth, context) => {
  const { userId, orgId } = auth();
  const url = new URL(context.request.url);

  // Protected routes require login
  if (isProtectedRoute(context.request)) {
    if (!userId) {
      return auth().redirectToSignIn();
    }
  }

  // Logged-in users without an active org get redirected to onboarding
  // (except on onboarding, sign-in/up, public, and API routes)
  if (userId && !orgId && !isOnboardingRoute(context.request) && !isPublicRoute(context.request) && !url.pathname.startsWith('/api/')) {
    return context.redirect('/onboarding');
  }

  // Users on onboarding who already have an org go to home
  if (userId && orgId && isOnboardingRoute(context.request)) {
    return context.redirect('/');
  }
});
