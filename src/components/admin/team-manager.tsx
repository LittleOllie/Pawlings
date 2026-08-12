"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { AdminProfile, AdminRole } from "@/types/database";
import { Plus, UserX } from "lucide-react";

interface TeamMember extends AdminProfile {
  email: string;
}

interface TeamManagerProps {
  team: TeamMember[];
}

const ROLES: { value: AdminRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "reviewer", label: "Reviewer" },
  { value: "read_only", label: "Read only" },
];

export function TeamManager({ team: initialTeam }: TeamManagerProps) {
  const router = useRouter();
  const [team, setTeam] = useState(initialTeam);
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMember, setNewMember] = useState({
    email: "",
    password: "",
    display_name: "",
    role: "reviewer" as AdminRole,
  });

  async function handleAdd() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Failed to add team member");
        return;
      }
      setTeam((prev) => [...prev, json.member]);
      setShowAdd(false);
      setNewMember({ email: "", password: "", display_name: "", role: "reviewer" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(id: string, updates: Partial<AdminProfile>) {
    const res = await fetch("/api/admin/team", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    const json = await res.json();
    if (!res.ok) {
      alert(json.error ?? "Update failed");
      return;
    }
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, ...json.member } : m)));
    router.refresh();
  }

  async function handleDeactivate(id: string) {
    if (!confirm("Deactivate this team member?")) return;
    const res = await fetch("/api/admin/team", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const json = await res.json();
      alert(json.error ?? "Failed to deactivate");
      return;
    }
    setTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_active: false } : m))
    );
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4" />
          Add team member
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border-subtle">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle bg-surface/40">
              <th className="px-4 py-3 text-left text-foreground-muted">Name</th>
              <th className="px-4 py-3 text-left text-foreground-muted">Email</th>
              <th className="px-4 py-3 text-left text-foreground-muted">Role</th>
              <th className="px-4 py-3 text-left text-foreground-muted">Status</th>
              <th className="px-4 py-3 text-left text-foreground-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr
                key={member.id}
                className={`border-b border-border-subtle ${!member.is_active ? "opacity-50" : ""}`}
              >
                <td className="px-4 py-3">
                  <Input
                    defaultValue={member.display_name ?? ""}
                    onBlur={(e) => {
                      if (e.target.value !== (member.display_name ?? "")) {
                        handleUpdate(member.id, { display_name: e.target.value || null });
                      }
                    }}
                    className="py-1.5"
                    disabled={!member.is_active}
                  />
                </td>
                <td className="px-4 py-3 text-foreground-muted">{member.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleUpdate(member.id, { role: e.target.value as AdminRole })
                    }
                    disabled={!member.is_active}
                    className="rounded-md border border-border bg-background-elevated px-2 py-1.5 text-sm"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs rounded-full px-2 py-0.5 border ${
                      member.is_active
                        ? "bg-success/15 text-success border-success/30"
                        : "bg-foreground-subtle/20 text-foreground-subtle border-foreground-subtle/30"
                    }`}
                  >
                    {member.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {member.is_active && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeactivate(member.id)}
                      className="text-error hover:text-error"
                    >
                      <UserX className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {team.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-foreground-muted">
            No team members found.
          </CardContent>
        </Card>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add team member">
        <div className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            value={newMember.password}
            onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
            required
          />
          <Input
            label="Display name"
            value={newMember.display_name}
            onChange={(e) => setNewMember({ ...newMember, display_name: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
            <select
              value={newMember.role}
              onChange={(e) =>
                setNewMember({ ...newMember, role: e.target.value as AdminRole })
              }
              className="w-full rounded-lg border border-border bg-background-elevated px-4 py-2.5 text-sm"
            >
              {ROLES.filter((r) => r.value !== "owner").map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleAdd} loading={loading} className="w-full">
            Create account
          </Button>
        </div>
      </Modal>
    </div>
  );
}
