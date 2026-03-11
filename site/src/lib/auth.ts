import { prisma } from './prisma';
import type { Role } from '../generated/prisma/enums';

/** Get the user's active orgId from Prisma (stored in settings JSON, or first membership). */
export async function getUserActiveOrgId(userId: string | null | undefined): Promise<string | null> {
  if (!userId) return null;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });
  const settings = user?.settings as Record<string, any> | null;
  if (settings?.orgId) return settings.orgId;

  // Fallback: use first membership
  const membership = await prisma.organizationMember.findFirst({
    where: { userId },
    select: { orgId: true },
    orderBy: { createdAt: 'asc' },
  });
  return membership?.orgId ?? null;
}

/** Set the user's active orgId in Prisma settings. */
export async function setUserActiveOrgId(userId: string, orgId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });
  const settings = (user?.settings as Record<string, any>) || {};
  await prisma.user.update({
    where: { id: userId },
    data: { settings: { ...settings, orgId } },
  });
}

export async function isAdminOrg(orgId: string | null | undefined): Promise<boolean> {
  if (!orgId) return false;
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  return org?.type === 'admin';
}

/** Check if a user is in an admin org (combines getUserActiveOrgId + isAdminOrg). */
export async function isUserAdmin(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const orgId = await getUserActiveOrgId(userId);
  return isAdminOrg(orgId);
}

export async function requireAdmin(orgId: string | null | undefined): Promise<void> {
  if (!(await isAdminOrg(orgId))) {
    throw new Error('Unauthorized: Admin access required');
  }
}

export async function getUserRole(userId: string): Promise<Role | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role ?? null;
}

export async function getOrgMemberRole(userId: string, orgId: string): Promise<Role | null> {
  const member = await prisma.organizationMember.findUnique({
    where: { userId_orgId: { userId, orgId } },
    select: { role: true },
  });
  return member?.role ?? null;
}

export async function requireOrgAdmin(userId: string, orgId: string): Promise<void> {
  const role = await getOrgMemberRole(userId, orgId);
  if (role !== 'ADMIN') {
    throw new Error('Unauthorized: Organization admin access required');
  }
}

export async function isSuperAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'ADMIN';
}

export async function ensureUserExists(clerkUserId: string, email: string, name?: string | null, avatar?: string | null): Promise<void> {
  await prisma.user.upsert({
    where: { id: clerkUserId },
    update: { email, name: name || null, avatar: avatar || null },
    create: {
      id: clerkUserId,
      email,
      name: name || null,
      avatar: avatar || null,
      role: 'USER',
    },
  });
}
