import { prisma } from './prisma';

export async function isAdminOrg(orgId: string | null | undefined): Promise<boolean> {
  if (!orgId) return false;
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  return org?.type === 'admin';
}

export async function requireAdmin(orgId: string | null | undefined): Promise<void> {
  if (!(await isAdminOrg(orgId))) {
    throw new Error('Unauthorized: Admin access required');
  }
}
