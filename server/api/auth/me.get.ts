import { isUserAdmin } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const { userId } = event.context.auth();
  if (!userId) return { isAdmin: false };
  const admin = await isUserAdmin(userId);
  return { isAdmin: admin };
});
