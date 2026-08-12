import { requireAdminPage } from "@/lib/admin-page";
import { PageHeader } from "@/components/admin/page-header";
import { ApprovedWalletsManager } from "@/components/admin/approved-wallets-manager";
import { createServiceClient } from "@/lib/supabase/admin";
import { canManageApprovedWallets } from "@/lib/permissions";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ApprovedWalletsPage({ searchParams }: PageProps) {
  const profile = await requireAdminPage("read_only");
  const params = await searchParams;
  const supabase = createServiceClient();

  const search = String(params.search ?? "").trim();
  const page = Math.max(1, parseInt(String(params.page ?? "1"), 10));
  const limit = 50;
  const offset = (page - 1) * limit;

  let query = supabase
    .from("approved_wallets")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(
      `wallet_address.ilike.%${search}%,notes.ilike.%${search}%,allocation_type.ilike.%${search}%`
    );
  }

  const { data, count } = await query.range(offset, offset + limit - 1);

  return (
    <div>
      <PageHeader
        title="Approved Wallets"
        description={`${(count ?? 0).toLocaleString()} wallets on the approved list`}
      />
      <ApprovedWalletsManager
        initialData={{
          wallets: data ?? [],
          pagination: {
            page,
            limit,
            total: count ?? 0,
            totalPages: Math.ceil((count ?? 0) / limit),
          },
        }}
        canManage={canManageApprovedWallets(profile.role)}
      />
    </div>
  );
}
