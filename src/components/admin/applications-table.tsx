"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "./pagination";
import { formatDateTime } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types/database";
import { Download, Search } from "lucide-react";
import { CopyWalletButton } from "./copy-wallet-button";

const QUICK_FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface ApplicationWithTags extends Application {
  tags: Tag[];
}

interface ApplicationsTableProps {
  initialData: {
    applications: ApplicationWithTags[];
    tags: Tag[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  };
  canReview: boolean;
}

const BULK_ACTIONS: {
  status: ApplicationStatus;
  label: string;
  variant: "primary" | "secondary" | "outline" | "danger";
  confirm?: string;
}[] = [
  { status: "approved", label: "Approve", variant: "primary" },
  { status: "reviewing", label: "Reviewing", variant: "secondary" },
  { status: "waitlisted", label: "Waitlist", variant: "outline" },
  {
    status: "rejected",
    label: "Decline",
    variant: "danger",
    confirm: "Decline the selected applications?",
  },
];

const STATUSES: { value: string; label: string }[] = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "reviewing", label: "Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "waitlisted", label: "Waitlisted" },
  { value: "rejected", label: "Not Selected" },
];

export function ApplicationsTable({ initialData, canReview }: ApplicationsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addToWhitelist, setAddToWhitelist] = useState(true);
  const [bulkLoading, setBulkLoading] = useState<ApplicationStatus | null>(null);

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const tag = searchParams.get("tag") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const sort = searchParams.get("sort") ?? "submitted_at";
  const order = searchParams.get("order") ?? "desc";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  useEffect(() => {
    setData(initialData);
    setSelected(new Set());
  }, [initialData]);

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      if (!("page" in updates)) params.set("page", "1");
      startTransition(() => {
        router.push(`/admin/applications?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  async function handleBulkAction(status: ApplicationStatus, confirm?: string) {
    if (selected.size === 0) return;
    if (confirm && !window.confirm(`${confirm}\n\n${selected.size} selected.`)) return;

    setBulkLoading(status);
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: Array.from(selected),
          status,
          addToApprovedWallets: status === "approved" ? addToWhitelist : undefined,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      router.refresh();
      setSelected(new Set());
    } finally {
      setBulkLoading(null);
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === data.applications.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.applications.map((a) => a.id)));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {QUICK_FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => updateParams({ status: f.value })}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === f.value
                ? "bg-accent text-background"
                : "bg-surface text-foreground-muted hover:text-foreground border border-border-subtle"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
          <input
            type="search"
            placeholder="Search by reference, wallet, X, email…"
            defaultValue={search}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParams({ search: (e.target as HTMLInputElement).value });
              }
            }}
            className="w-full rounded-lg border border-border bg-background-elevated pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-foreground-subtle focus:border-accent focus:ring-1 focus:ring-accent/30"
          />
        </div>
        <select
          value={status}
          onChange={(e) => updateParams({ status: e.target.value })}
          className="rounded-lg border border-border bg-background-elevated px-3 py-2.5 text-sm text-foreground"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={tag}
          onChange={(e) => updateParams({ tag: e.target.value })}
          className="rounded-lg border border-border bg-background-elevated px-3 py-2.5 text-sm text-foreground"
        >
          <option value="">All tags</option>
          {data.tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <Input
          type="date"
          value={dateFrom}
          onChange={(e) => updateParams({ dateFrom: e.target.value })}
          className="w-auto"
        />
        <Input
          type="date"
          value={dateTo}
          onChange={(e) => updateParams({ dateTo: e.target.value })}
          className="w-auto"
        />
        <a href={`/api/admin/applications/export?status=${status}`}>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </a>
      </div>

      {canReview && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-foreground-muted">
            Tick the boxes to select applications, then use the action bar to approve or decline in bulk.
          </p>
          {data.applications.length > 0 && (
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-accent hover:underline font-medium shrink-0"
            >
              {selected.size === data.applications.length
                ? "Deselect all on page"
                : `Select all ${data.applications.length} on this page`}
            </button>
          )}
        </div>
      )}

      {canReview && selected.size > 0 && (
        <div className="sticky bottom-4 z-20 rounded-xl border border-accent/40 bg-background-elevated shadow-lg px-4 py-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-medium text-foreground">
              {selected.size} selected
            </p>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-sm text-foreground-muted hover:text-foreground"
            >
              Clear
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {BULK_ACTIONS.map(({ status: actionStatus, label, variant, confirm }) => (
              <Button
                key={actionStatus}
                variant={variant}
                size="sm"
                loading={bulkLoading === actionStatus}
                disabled={bulkLoading !== null && bulkLoading !== actionStatus}
                onClick={() => handleBulkAction(actionStatus, confirm)}
              >
                {label}
              </Button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-foreground-muted">
            <input
              type="checkbox"
              checked={addToWhitelist}
              onChange={(e) => setAddToWhitelist(e.target.checked)}
              className="rounded border-border"
            />
            Add approved wallets to guardian list
          </label>
        </div>
      )}

      <div className="hidden md:block overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {canReview && (
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={
                      data.applications.length > 0 &&
                      selected.size === data.applications.length
                    }
                    onChange={toggleSelectAll}
                    aria-label="Select all on this page"
                    className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
                  />
                </th>
              )}
              <th className="px-4 py-3.5 text-left text-foreground-muted font-medium whitespace-nowrap">
                <button
                  type="button"
                  onClick={() =>
                    updateParams({
                      sort: "submitted_at",
                      order: sort === "submitted_at" && order === "desc" ? "asc" : "desc",
                    })
                  }
                  className="hover:text-foreground"
                >
                  Submitted
                </button>
              </th>
              <th className="px-4 py-3.5 text-left text-foreground-muted font-medium min-w-[200px]">
                Wallet
              </th>
              <th className="px-4 py-3.5 text-left text-foreground-muted font-medium">
                X Handle
              </th>
              <th className="px-4 py-3.5 text-left text-foreground-muted font-medium">
                Discord
              </th>
              <th className="px-4 py-3.5 text-left text-foreground-muted font-medium">
                Status
              </th>
              <th className="px-4 py-3.5 text-left text-foreground-muted font-medium">
                Notes
              </th>
              <th className="px-4 py-3.5 text-left text-foreground-muted font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className={isPending ? "opacity-50" : ""}>
            {data.applications.map((app) => (
              <tr
                key={app.id}
                className={`border-b border-border-subtle transition-colors ${
                  selected.has(app.id) ? "bg-accent/5" : "hover:bg-surface/30"
                }`}
              >
                {canReview && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(app.id)}
                      onChange={() => toggleSelect(app.id)}
                      aria-label={`Select ${app.reference_code}`}
                      className="h-4 w-4 rounded border-border accent-accent cursor-pointer"
                    />
                  </td>
                )}
                <td className="px-4 py-4 text-foreground-muted text-sm whitespace-nowrap">
                  {formatDateTime(app.submitted_at)}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-start gap-1 max-w-xs">
                    <code className="font-mono text-xs break-all leading-relaxed">
                      {app.wallet_address}
                    </code>
                    <CopyWalletButton address={app.wallet_address} />
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-foreground-muted">
                  {app.x_handle ? (
                    <a
                      href={`https://x.com/${app.x_handle.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {app.x_handle}
                    </a>
                  ) : (
                    <span className="text-foreground-subtle">—</span>
                  )}
                </td>
                <td className="px-4 py-4 text-sm text-foreground-muted">
                  {app.discord_username ?? (
                    <span className="text-foreground-subtle">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={app.status} />
                </td>
                <td className="px-4 py-4 text-sm text-foreground-muted">
                  {app.review_notes?.trim() ? (
                    <span className="inline-flex items-center gap-1 text-accent" title="Has review notes">
                      <span aria-hidden>📝</span>
                      <span className="sr-only">Has notes</span>
                    </span>
                  ) : (
                    <span className="text-foreground-subtle">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/applications/${app.id}`}
                    className="text-sm text-accent hover:text-accent-hover font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {canReview && data.applications.length > 0 && (
          <label className="flex items-center gap-2 text-sm text-foreground-muted px-1">
            <input
              type="checkbox"
              checked={
                data.applications.length > 0 &&
                selected.size === data.applications.length
              }
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-border accent-accent"
            />
            Select all on this page
          </label>
        )}
        {data.applications.map((app) => (
          <Card
            key={app.id}
            className={`overflow-hidden ${selected.has(app.id) ? "ring-2 ring-accent/50" : ""}`}
          >
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-start gap-3">
                {canReview && (
                  <input
                    type="checkbox"
                    checked={selected.has(app.id)}
                    onChange={() => toggleSelect(app.id)}
                    aria-label={`Select ${app.reference_code}`}
                    className="h-4 w-4 mt-1 rounded border-border accent-accent shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/admin/applications/${app.id}`}
                  className="text-accent font-semibold"
                >
                  {app.reference_code}
                </Link>
                <StatusBadge status={app.status} />
              </div>
              <div className="flex items-start gap-2">
                <code className="font-mono text-xs break-all flex-1">
                  {app.wallet_address}
                </code>
                <CopyWalletButton address={app.wallet_address} />
              </div>
              {(app.x_handle || app.discord_username) && (
                <p className="text-sm text-foreground-muted">
                  {app.x_handle}
                  {app.x_handle && app.discord_username ? " · " : ""}
                  {app.discord_username}
                </p>
              )}
              {app.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {app.tags.map((t) => (
                    <span
                      key={t.id}
                      className="text-xs rounded-full px-2 py-0.5 border"
                      style={{
                        backgroundColor: `${t.color}20`,
                        borderColor: `${t.color}50`,
                        color: t.color,
                      }}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-foreground-subtle">
                {formatDateTime(app.submitted_at)}
              </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.applications.length === 0 && (
        <p className="text-center text-foreground-muted py-12">
          No applications match your filters.
        </p>
      )}

      <Pagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        onPageChange={(p) => updateParams({ page: String(p) })}
      />
    </div>
  );
}
