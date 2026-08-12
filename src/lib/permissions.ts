import type { AdminRole } from "@/types/database";

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  read_only: 1,
  reviewer: 2,
  admin: 3,
  owner: 4,
};

export function hasMinRole(
  userRole: AdminRole | null | undefined,
  requiredRole: AdminRole
): boolean {
  if (!userRole) return false;
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canReview(role: AdminRole | null | undefined): boolean {
  return hasMinRole(role, "reviewer");
}

export function canManageSettings(role: AdminRole | null | undefined): boolean {
  return hasMinRole(role, "admin");
}

export function canManageTeam(role: AdminRole | null | undefined): boolean {
  return hasMinRole(role, "owner");
}

export function canExport(role: AdminRole | null | undefined): boolean {
  return hasMinRole(role, "reviewer");
}

export function canManageApprovedWallets(
  role: AdminRole | null | undefined
): boolean {
  return hasMinRole(role, "admin");
}
