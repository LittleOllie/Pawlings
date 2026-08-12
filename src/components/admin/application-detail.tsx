"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import type { Application, ApplicationStatus } from "@/types/database";
import { ArrowLeft, Copy, Check } from "lucide-react";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id: string;
  note: string;
  created_at: string;
  admin_profiles: { display_name: string | null } | null;
}

interface HistoryEntry {
  id: string;
  from_status: ApplicationStatus | null;
  to_status: ApplicationStatus;
  created_at: string;
  admin_profiles: { display_name: string | null } | null;
}

interface ApplicationDetailProps {
  application: Application;
  tags: Tag[];
  allTags: Tag[];
  notes: Note[];
  history: HistoryEntry[];
  reviewer: { display_name: string | null; role: string } | null;
  isApprovedWallet: boolean;
  canReview: boolean;
}

const STATUS_ACTIONS: { status: ApplicationStatus; label: string; variant?: "primary" | "secondary" | "outline" | "danger" }[] = [
  { status: "reviewing", label: "Mark Reviewing", variant: "secondary" },
  { status: "approved", label: "Approve", variant: "primary" },
  { status: "waitlisted", label: "Waitlist", variant: "outline" },
  { status: "rejected", label: "Reject", variant: "danger" },
  { status: "archived", label: "Archive", variant: "secondary" },
];

export function ApplicationDetail({
  application,
  tags,
  allTags,
  notes,
  history,
  reviewer,
  isApprovedWallet,
  canReview,
}: ApplicationDetailProps) {
  const router = useRouter();
  const [reviewNotes, setReviewNotes] = useState(application.review_notes ?? "");
  const [newNote, setNewNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(tags.map((t) => t.id));
  const [addToApproved, setAddToApproved] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function patch(data: Record<string, unknown>) {
    const res = await fetch(`/api/admin/applications/${application.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Update failed");
    router.refresh();
  }

  async function handleStatus(status: ApplicationStatus) {
    setLoading(status);
    try {
      await patch({
        status,
        review_notes: reviewNotes || null,
        tagIds: selectedTags,
        addToApprovedWallets: status === "approved" ? addToApproved : undefined,
      });
    } finally {
      setLoading(null);
    }
  }

  async function handleSaveNotes() {
    setLoading("notes");
    try {
      await patch({ review_notes: reviewNotes || null });
    } finally {
      setLoading(null);
    }
  }

  async function handleAddNote() {
    if (!newNote.trim()) return;
    setLoading("note");
    try {
      await patch({ note: newNote.trim() });
      setNewNote("");
    } finally {
      setLoading(null);
    }
  }

  async function handleSaveTags() {
    setLoading("tags");
    try {
      await patch({ tagIds: selectedTags });
    } finally {
      setLoading(null);
    }
  }

  function copyWallet() {
    navigator.clipboard.writeText(application.wallet_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-1 text-sm text-foreground-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="pt-6 pb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold">{application.reference_code}</h1>
            <StatusBadge status={application.status} />
            {isApprovedWallet && (
              <span className="text-xs rounded-full bg-success/15 text-success border border-success/30 px-2 py-0.5">
                Approved guardian
              </span>
            )}
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-foreground-subtle mb-2">
              Wallet address
            </p>
            <div className="flex items-start gap-2">
              <code className="text-sm sm:text-base font-mono break-all leading-relaxed flex-1">
                {application.wallet_address}
              </code>
              <button
                type="button"
                onClick={copyWallet}
                className="shrink-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground-muted hover:text-foreground flex items-center gap-1.5"
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            {application.x_handle && (
              <div>
                <span className="text-foreground-subtle">X: </span>
                <a
                  href={`https://x.com/${application.x_handle.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {application.x_handle}
                </a>
              </div>
            )}
            {application.discord_username && (
              <div>
                <span className="text-foreground-subtle">Discord: </span>
                <span>{application.discord_username}</span>
              </div>
            )}
            <div className="text-foreground-muted">
              Submitted {formatDateTime(application.submitted_at)}
            </div>
          </div>

          {canReview && application.status === "pending" && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border-subtle">
              <Button
                onClick={() => handleStatus("approved")}
                loading={loading === "approved"}
                className="flex-1 sm:flex-none min-w-[120px]"
              >
                Approve
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleStatus("reviewing")}
                loading={loading === "reviewing"}
              >
                Reviewing
              </Button>
              <Button
                variant="outline"
                onClick={() => handleStatus("waitlisted")}
                loading={loading === "waitlisted"}
              >
                Waitlist
              </Button>
              <Button
                variant="danger"
                onClick={() => handleStatus("rejected")}
                loading={loading === "rejected"}
              >
                Reject
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {(application.application_answer?.trim() ||
            application.signature_data) && (
            <>
              {application.application_answer?.trim() && (
                <Card>
                  <CardHeader>
                    <CardTitle>Application Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {application.application_answer}
                    </p>
                  </CardContent>
                </Card>
              )}

              {application.signature_data && (
                <Card>
                  <CardHeader>
                    <CardTitle>Signature</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {application.signature_data.startsWith("data:image") ? (
                      <div className="rounded-lg border border-border bg-signature-bg p-4 inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={application.signature_data}
                          alt="Applicant signature"
                          className="max-h-32 max-w-full"
                        />
                      </div>
                    ) : application.signature_data.startsWith("text:") ? (
                      <p className="font-display text-2xl text-foreground italic">
                        {application.signature_data.replace("text:", "")}
                      </p>
                    ) : (
                      <p className="text-sm text-foreground-muted">
                        No signature provided.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Internal Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-sm text-foreground-muted">No notes yet.</p>
              ) : (
                <ul className="space-y-3">
                  {notes.map((n) => (
                    <li key={n.id} className="rounded-lg border border-border-subtle px-4 py-3">
                      <p className="text-sm text-foreground">{n.note}</p>
                      <p className="text-xs text-foreground-subtle mt-1">
                        {n.admin_profiles?.display_name ?? "Admin"} ·{" "}
                        {formatDateTime(n.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
              {canReview && (
                <div className="flex gap-2">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note…"
                    className="min-h-[80px]"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddNote}
                    loading={loading === "note"}
                    disabled={!newNote.trim()}
                  >
                    Add
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {canReview && application.status !== "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Update status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={addToApproved}
                    onChange={(e) => setAddToApproved(e.target.checked)}
                    className="rounded border-border"
                  />
                  Add to guardian list on approve
                </label>
                <div className="flex flex-col gap-2">
                  {STATUS_ACTIONS.map(({ status, label, variant = "secondary" }) => (
                    <Button
                      key={status}
                      variant={variant}
                      size="sm"
                      onClick={() => handleStatus(status)}
                      loading={loading === status}
                      disabled={application.status === status}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {canReview && application.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>On approve</CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={addToApproved}
                    onChange={(e) => setAddToApproved(e.target.checked)}
                    className="rounded border-border"
                  />
                  Add wallet to guardian list
                </label>
              </CardContent>
            </Card>
          )}

          {canReview && (
            <Card>
              <CardHeader>
                <CardTitle>Review notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  className="min-h-[80px]"
                  placeholder="Optional internal notes…"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSaveNotes}
                  loading={loading === "notes"}
                >
                  Save notes
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {allTags.map((t) => (
                  <label
                    key={t.id}
                    className="inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(t.id)}
                      onChange={(e) => {
                        setSelectedTags((prev) =>
                          e.target.checked
                            ? [...prev, t.id]
                            : prev.filter((id) => id !== t.id)
                        );
                      }}
                      disabled={!canReview}
                      className="rounded border-border"
                    />
                    <span
                      className="text-xs rounded-full px-2 py-0.5 border"
                      style={{
                        backgroundColor: `${t.color}20`,
                        borderColor: `${t.color}50`,
                        color: t.color,
                      }}
                    >
                      {t.name}
                    </span>
                  </label>
                ))}
              </div>
              {canReview && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleSaveTags}
                  loading={loading === "tags"}
                >
                  Save tags
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Info</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <span className="text-foreground-muted">Reviewer: </span>
                {reviewer?.display_name ?? "—"}
              </p>
              <p>
                <span className="text-foreground-muted">Reviewed: </span>
                {application.reviewed_at
                  ? formatDateTime(application.reviewed_at)
                  : "—"}
              </p>
            </CardContent>
          </Card>

          {history.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {history.map((h) => (
                    <li key={h.id} className="text-foreground-muted">
                      {h.from_status ? `${h.from_status} → ` : ""}
                      <span className="text-foreground">{h.to_status}</span>
                      {" · "}
                      {h.admin_profiles?.display_name ?? "System"} ·{" "}
                      {formatDateTime(h.created_at)}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
