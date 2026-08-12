"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "./pagination";
import { formatDateTime, truncateAddress } from "@/lib/utils";
import type { ApprovedWallet } from "@/types/database";
import { Download, Plus, Trash2, Upload } from "lucide-react";

interface ApprovedWalletsManagerProps {
  initialData: {
    wallets: ApprovedWallet[];
    pagination: { page: number; limit: number; total: number; totalPages: number };
  };
  canManage: boolean;
}

export function ApprovedWalletsManager({
  initialData,
  canManage,
}: ApprovedWalletsManagerProps) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newWallet, setNewWallet] = useState({
    wallet_address: "",
    allocation_type: "",
    allocation_amount: "",
    notes: "",
  });
  const [pasteText, setPasteText] = useState("");
  const [csvContent, setCsvContent] = useState("");
  const [importPreview, setImportPreview] = useState<{
    valid: number;
    duplicates: number;
    invalid: { row: number; value: string; reason: string }[];
  } | null>(null);

  async function refresh(page = data.pagination.page) {
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (search) params.set("search", search);
    const res = await fetch(`/api/admin/approved-wallets?${params}`);
    const json = await res.json();
    setData(json);
    setSelected(new Set());
  }

  async function handleAdd() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/approved-wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: newWallet.wallet_address,
          allocation_type: newWallet.allocation_type || null,
          allocation_amount: newWallet.allocation_amount
            ? parseInt(newWallet.allocation_amount, 10)
            : null,
          notes: newWallet.notes || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? "Failed to add wallet");
        return;
      }
      setShowAdd(false);
      setNewWallet({ wallet_address: "", allocation_type: "", allocation_amount: "", notes: "" });
      router.refresh();
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handlePaste() {
    const addresses = pasteText
      .split(/[\n,;\s]+/)
      .map((a) => a.trim())
      .filter(Boolean);

    setLoading(true);
    let added = 0;
    for (const addr of addresses) {
      const res = await fetch("/api/admin/approved-wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: addr }),
      });
      if (res.ok) added++;
    }
    setLoading(false);
    setShowPaste(false);
    setPasteText("");
    alert(`Added ${added} of ${addresses.length} wallets.`);
    router.refresh();
    await refresh();
  }

  async function handleCsvPreview() {
    const res = await fetch("/api/admin/approved-wallets/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: csvContent }),
    });
    const json = await res.json();
    setImportPreview(json);
  }

  async function handleCsvImport() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/approved-wallets/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: csvContent, confirm: true }),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Import failed");
        return;
      }
      setShowImport(false);
      setCsvContent("");
      setImportPreview(null);
      alert(`Imported ${json.imported} wallets.`);
      router.refresh();
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove() {
    if (selected.size === 0) return;
    if (!confirm(`Remove ${selected.size} wallet(s) from approved list?`)) return;
    setLoading(true);
    try {
      await fetch("/api/admin/approved-wallets", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      router.refresh();
      await refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search wallets…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && refresh(1)}
          className="flex-1 rounded-lg border border-border bg-background-elevated px-4 py-2.5 text-sm"
        />
        <Button variant="secondary" size="sm" onClick={() => refresh(1)}>
          Search
        </Button>
        {canManage && (
          <>
            <Button size="sm" onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowPaste(true)}>
              Paste multiple
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
              <Upload className="h-4 w-4" />
              CSV import
            </Button>
            {selected.size > 0 && (
              <Button variant="danger" size="sm" loading={loading} onClick={handleRemove}>
                <Trash2 className="h-4 w-4" />
                Remove ({selected.size})
              </Button>
            )}
          </>
        )}
        <a href="/api/admin/approved-wallets?export=true">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </a>
      </div>

      <div className="hidden md:block overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              {canManage && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={
                      data.wallets.length > 0 && selected.size === data.wallets.length
                    }
                    onChange={() => {
                      if (selected.size === data.wallets.length) setSelected(new Set());
                      else setSelected(new Set(data.wallets.map((w) => w.id)));
                    }}
                    aria-label="Select all"
                  />
                </th>
              )}
              <th className="px-4 py-3 text-left text-foreground-muted">Wallet</th>
              <th className="px-4 py-3 text-left text-foreground-muted">Allocation</th>
              <th className="px-4 py-3 text-left text-foreground-muted">Source</th>
              <th className="px-4 py-3 text-left text-foreground-muted">Added</th>
            </tr>
          </thead>
          <tbody>
            {data.wallets.map((w) => (
              <tr key={w.id} className="border-b border-border-subtle hover:bg-surface/30">
                {canManage && (
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(w.id)}
                      onChange={() => {
                        setSelected((prev) => {
                          const next = new Set(prev);
                          if (next.has(w.id)) next.delete(w.id);
                          else next.add(w.id);
                          return next;
                        });
                      }}
                    />
                  </td>
                )}
                <td className="px-4 py-3 font-mono text-xs">{truncateAddress(w.wallet_address, 8)}</td>
                <td className="px-4 py-3 text-foreground-muted">
                  {w.allocation_type ?? "—"}
                  {w.allocation_amount != null ? ` (${w.allocation_amount})` : ""}
                </td>
                <td className="px-4 py-3 capitalize">{w.source.replace(/_/g, " ")}</td>
                <td className="px-4 py-3 text-foreground-muted">{formatDateTime(w.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-3">
        {data.wallets.map((w) => (
          <Card key={w.id}>
            <CardContent className="pt-4">
              <p className="font-mono text-xs">{truncateAddress(w.wallet_address, 8)}</p>
              <p className="text-xs text-foreground-muted mt-1 capitalize">
                {w.source} · {formatDateTime(w.created_at)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination
        page={data.pagination.page}
        totalPages={data.pagination.totalPages}
        onPageChange={(p) => refresh(p)}
      />

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add approved wallet">
        <div className="space-y-4">
          <Input
            label="Wallet address"
            value={newWallet.wallet_address}
            onChange={(e) => setNewWallet({ ...newWallet, wallet_address: e.target.value })}
            required
          />
          <Input
            label="Allocation type"
            value={newWallet.allocation_type}
            onChange={(e) => setNewWallet({ ...newWallet, allocation_type: e.target.value })}
          />
          <Input
            label="Allocation amount"
            type="number"
            value={newWallet.allocation_amount}
            onChange={(e) => setNewWallet({ ...newWallet, allocation_amount: e.target.value })}
          />
          <Textarea
            label="Notes"
            value={newWallet.notes}
            onChange={(e) => setNewWallet({ ...newWallet, notes: e.target.value })}
          />
          <Button onClick={handleAdd} loading={loading} className="w-full">
            Add wallet
          </Button>
        </div>
      </Modal>

      <Modal open={showPaste} onClose={() => setShowPaste(false)} title="Paste wallet addresses">
        <div className="space-y-4">
          <Textarea
            label="Addresses"
            hint="One per line, or comma/semicolon separated"
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            className="min-h-[160px] font-mono text-xs"
          />
          <Button onClick={handlePaste} loading={loading} className="w-full">
            Import addresses
          </Button>
        </div>
      </Modal>

      <Modal open={showImport} onClose={() => { setShowImport(false); setImportPreview(null); }} title="CSV import">
        <div className="space-y-4">
          <Textarea
            label="CSV content"
            hint="Must include wallet_address column"
            value={csvContent}
            onChange={(e) => setCsvContent(e.target.value)}
            className="min-h-[160px] font-mono text-xs"
          />
          {importPreview && (
            <div className="rounded-lg border border-border-subtle p-4 text-sm space-y-1">
              <p className="text-success">{importPreview.valid} valid wallets</p>
              <p className="text-warning">{importPreview.duplicates} duplicates skipped</p>
              <p className="text-error">{importPreview.invalid.length} invalid rows</p>
            </div>
          )}
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCsvPreview} disabled={!csvContent}>
              Preview
            </Button>
            <Button
              onClick={handleCsvImport}
              loading={loading}
              disabled={!importPreview || importPreview.valid === 0}
            >
              Confirm import
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
