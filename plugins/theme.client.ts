export default defineNuxtPlugin(() => {
  if (import.meta.server) return;
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});
