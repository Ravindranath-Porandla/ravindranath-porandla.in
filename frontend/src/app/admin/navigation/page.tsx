"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { navigationApi, type AdminNavItem } from "@/lib/admin-api";

const emptyForm = { label: "", route: "", is_visible: true };

export default function AdminNavigationPage() {
    const [items, setItems] = useState<AdminNavItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const load = () => {
        setLoading(true);
        navigationApi.list().then((r) => setItems(r.sort((a, b) => a.order_index - b.order_index))).catch((e) => setError(e.message)).finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const openNew = () => { setForm(emptyForm); setEditing("new"); };
    const openEdit = (item: AdminNavItem) => { setForm({ label: item.label, route: item.route, is_visible: item.is_visible }); setEditing(item.id); };
    const cancel = () => { setEditing(null); setError(""); };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing === "new") await navigationApi.create({ ...form, order_index: items.length });
            else await navigationApi.update(editing!, form);
            cancel(); load();
        } catch (e: unknown) { setError((e as Error).message); }
        finally { setSaving(false); }
    };

    const del = async (id: string, label: string) => {
        if (!confirm(`Delete nav item "${label}"?`)) return;
        try { await navigationApi.delete(id); load(); }
        catch (e: unknown) { setError((e as Error).message); }
    };

    const toggleVisible = async (item: AdminNavItem) => {
        try { await navigationApi.update(item.id, { is_visible: !item.is_visible }); load(); }
        catch (e: unknown) { setError((e as Error).message); }
    };

    const inputStyle: React.CSSProperties = { width: "100%", padding: "0.5rem 0.7rem", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", outline: "none", boxSizing: "border-box" };

    return (
        <AdminLayout>
            <div style={{ maxWidth: "580px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                    <div>
                        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Navigation</h1>
                        <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", marginTop: "0.2rem" }}>Manage header nav links</p>
                    </div>
                    {!editing && <button onClick={openNew} style={{ padding: "0.5rem 1rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>+ Add Link</button>}
                </div>

                {error && <div style={{ padding: "0.6rem 0.75rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", color: "#dc2626", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}

                {editing && (
                    <form onSubmit={save} style={{ background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "6px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{editing === "new" ? "New Nav Item" : "Edit Nav Item"}</p>
                        <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--foreground-muted)", marginBottom: "0.25rem" }}>Label</label>
                            <input type="text" required value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} placeholder="About" style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--foreground-muted)", marginBottom: "0.25rem" }}>Route</label>
                            <input type="text" required value={form.route} onChange={(e) => setForm((p) => ({ ...p, route: e.target.value }))} placeholder="/about" style={inputStyle} />
                        </div>
                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
                            <input type="checkbox" checked={form.is_visible} onChange={(e) => setForm((p) => ({ ...p, is_visible: e.target.checked }))} />
                            Visible in header
                        </label>
                        <div style={{ display: "flex", gap: "0.6rem" }}>
                            <button type="submit" disabled={saving} style={{ padding: "0.5rem 1rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>{saving ? "Saving…" : "Save"}</button>
                            <button type="button" onClick={cancel} style={{ padding: "0.5rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "0.85rem", cursor: "pointer", color: "var(--foreground-muted)" }}>Cancel</button>
                        </div>
                    </form>
                )}

                {loading && <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>Loading…</p>}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {items.map((item) => (
                        <div key={item.id} style={{ background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0.8rem 1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>{item.label}</span>
                                <span style={{ color: "var(--foreground-muted)", fontSize: "0.8rem", marginLeft: "0.5rem" }}>{item.route}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <button onClick={() => toggleVisible(item)} style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem", border: "1px solid var(--border)", borderRadius: "3px", background: "var(--background)", cursor: "pointer", color: item.is_visible ? "#16a34a" : "var(--foreground-muted)" }}>
                                    {item.is_visible ? "Visible" : "Hidden"}
                                </button>
                                <button onClick={() => openEdit(item)} style={{ fontSize: "0.78rem", padding: "0.28rem 0.55rem", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--background)", color: "var(--foreground-muted)", cursor: "pointer" }}>Edit</button>
                                <button onClick={() => del(item.id, item.label)} style={{ fontSize: "0.78rem", padding: "0.28rem 0.55rem", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", background: "transparent", color: "#dc2626", cursor: "pointer" }}>Delete</button>
                            </div>
                        </div>
                    ))}
                    {!loading && items.length === 0 && !editing && <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>No navigation items yet.</p>}
                </div>
            </div>
        </AdminLayout>
    );
}
