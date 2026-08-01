"use client";

import { useState } from "react";
import { UserPlus, Trash2, Loader2, ShieldAlert, Eye, EyeOff } from "lucide-react";

interface AdminItem {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

interface AdminManagerProps {
  admins: AdminItem[];
  currentAdminId?: string;
}

export function AdminManager({ admins: initialAdmins, currentAdminId }: AdminManagerProps) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      const res = await fetch("/api/admin/settings/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || undefined, email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Impossible de créer l'administrateur.");
      }

      setAdmins((prev) => [...prev, data.admin]);
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Impossible de créer l'administrateur.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (admin: AdminItem) => {
    if (!confirm(`Supprimer le compte administrateur « ${admin.email} » ?`)) return;

    setDeleteError(null);
    setDeletingId(admin.id);

    try {
      const res = await fetch(`/api/admin/settings/admins/${admin.id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Impossible de supprimer l'administrateur.");
      }

      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Impossible de supprimer l'administrateur.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create admin form – card style aligned */}
      <form
        onSubmit={handleCreate}
        className="space-y-4 rounded-lg border border-powder/40 bg-white p-5"
      >
        <h2 className="font-display text-sm uppercase tracking-widest text-ink/50">
          Ajouter un administrateur
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink/60">Nom (optionnel)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-powder/40 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/10"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink/60">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-powder/40 bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink/60">
            Mot de passe (8 caractères minimum)
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-powder/40 bg-white px-3 py-2 pr-10 text-sm text-ink placeholder:text-ink/40 focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {createError && <p className="text-sm text-rose-500">{createError}</p>}

        <button
          type="submit"
          disabled={isCreating}
          className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreating ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          Créer le compte
        </button>
      </form>

      {/* Admin list  */}
      <div className="overflow-hidden rounded-lg border border-powder/40 bg-white">
        <div className="border-b border-powder/40 bg-powder/10 px-5 py-3">
          <h2 className="font-display text-xs uppercase tracking-widest text-ink/50">
            Administrateurs ({admins.length})
          </h2>
        </div>

        {deleteError && (
          <p className="border-b border-powder/20 px-5 py-2 text-sm text-rose-500">{deleteError}</p>
        )}

        <ul className="divide-y divide-powder/20">
          {admins.map((admin) => {
            const isSelf = admin.id === currentAdminId;
            return (
              <li
                key={admin.id}
                className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-powder/5 transition-colors"
              >
                <div>
                  <p className="font-medium text-ink">
                    {admin.name || admin.email}
                    {isSelf && (
                      <span className="ml-2 rounded-full bg-navy/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-navy/60">
                        Vous
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink/50">{admin.email}</p>
                </div>

                {!isSelf && (
                  <button
                    type="button"
                    onClick={() => handleDelete(admin)}
                    disabled={deletingId === admin.id || admins.length <= 1}
                    title={
                      admins.length <= 1
                        ? "Impossible de supprimer le dernier administrateur"
                        : "Supprimer"
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                  >
                    {deletingId === admin.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} strokeWidth={1.5} />
                    )}
                    Supprimer
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {admins.length <= 1 && (
          <div className="flex items-center gap-2 border-t border-powder/20 px-5 py-3 text-xs text-ink/50">
            <ShieldAlert size={14} strokeWidth={1.5} />
            Au moins un administrateur doit toujours exister.
          </div>
        )}
      </div>
    </div>
  );
}