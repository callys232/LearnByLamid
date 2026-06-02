/**
 * Enforce tenant isolation at the data layer.
 * Every query that touches multi-tenant data MUST go through this.
 * At DB layer, replace with a WHERE tenant_id = ? clause in every query builder call.
 */
export function withTenant<T extends { tenantId: string }>(
  items: T[],
  tenantId: string
): T[] {
  return items.filter((item) => item.tenantId === tenantId);
}

export function assertTenant<T extends { tenantId: string }>(
  item: T,
  tenantId: string
): T {
  if (item.tenantId !== tenantId) {
    throw new Error(`Tenant mismatch: expected ${tenantId}, got ${item.tenantId}`);
  }
  return item;
}

export const LAMID_TENANT_ID = "tenant-lamid";
