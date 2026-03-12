export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.beforeEach((to) => {
    // Clerk's dashboard config defaults to /dashboard — redirect to home
    if (to.path === '/dashboard') {
      return '/';
    }

    // i18n prefix_except_default with nl as default: /nl should be /
    if (to.path === '/nl' || to.path === '/nl/') {
      return '/';
    }
  });
});
