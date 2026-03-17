"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { experienceApi, type AdminExperience } from "@/lib/admin-api";

const emptyForm = { company: "", role: "", duration: "", description: "", achievements: "" };

export default function AdminExperiencePage() {
    const [items, setItems] = useState<AdminExperience[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<string | null>(null); // id or "new"
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const load = () => {
        setLoading(true);
        experienceApi.list().then((res) => setItems(res.sort((a, b) => a.order_index - b.order_index))).catch((e) => setError(e.message)).finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const openNew = () => { setForm(emptyForm); setEditing("new"); setError(""); };
    const openEdit = (item: AdminExperience) => {
        setForm({ company: item.company, role: item.role, duration: item.duration, description: item.description ?? "", achievements: item.achievements.join("\n") });
        setEditing(item.id);
        setError("");
    };
    const cancel = () => { setEditing(null); setError(""); };

    const save = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        const data = { company: form.company, role: form.role, duration: form.duration, description: form.description || undefined, achievements: form.achievements.split("\n").map((s) => s.trim()).filter(Boolean), order_index: editing === "new" ? items.length : undefined };
        try {
            if (editing === "new") await experienceApi.create(data);
            else await experienceApi.update(editing!, data);
            cancel(); load();
        } catch (e: unknown) { setError((e as Error).message); }
        finally { setSaving(false); }
    };

    const del = async (id: string, company: string) => {
        if (!confirm(`Delete experience at "${company}"?`)) return;
        try { await experienceApi.delete(id); load(); }
        catch (e: unknown) { setError((e as Error).message); }
    };

    const inputStyle: React.CSSProperties = { width: "100%", padding: "0.5rem 0.7rem", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", outline: "none", boxSizing: "border-box" };

    return (
        <AdminLayout>
            <div style={{ maxWidth: "680px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                    <div>
                        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Experience</h1>
                        <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", marginTop: "0.2rem" }}>Work history timeline</p>
                    </div>
                    {!editing && <button onClick={openNew} style={{ padding: "0.5rem 1rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>+ Add Entry</button>}
                </div>

                {error && <div style={{ padding: "0.6rem 0.75rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", color: "#dc2626", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}

                {/* Form */}
                {editing && (
                    <form onSubmit={save} style={{ background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "6px", padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: "0.25rem" }}>{editing === "new" ? "New Entry" : "Edit Entry"}</p>
                        {(["company", "role", "duration"] as const).map((f) => (
                            <div key={f}>
                                <label style={{ display: "block", fontSize: "0.75rem", color: "var(--foreground-muted)", marginBottom: "0.25rem", textTransform: "capitalize" }}>{f}</label>
                                <input type="text" required value={form[f]} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} placeholder={f === "duration" ? "2023 — Present" : ""} style={inputStyle} />
                            </div>
                        ))}
                        <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--foreground-muted)", marginBottom: "0.25rem" }}>Description (optional)</label>
                            <input type="text" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.75rem", color: "var(--foreground-muted)", marginBottom: "0.25rem" }}>Achievements (one per line)</label>
                            <textarea rows={5} value={form.achievements} onChange={(e) => setForm((p) => ({ ...p, achievements: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
                        </div>
                        <div style={{ display: "flex", gap: "0.6rem" }}>
                            <button type="submit" disabled={saving} style={{ padding: "0.5rem 1rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>{saving ? "Saving…" : "Save"}</button>
                            <button type="button" onClick={cancel} style={{ padding: "0.5rem 1rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "0.85rem", cursor: "pointer", color: "var(--foreground-muted)" }}>Cancel</button>
                        </div>
                    </form>
                )}

                {loading && <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>Loading…</p>}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {items.map((item) => (
                        <div key={item.id} style={{ background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "6px", padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                            <div>
                                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.role} <span style={{ color: "var(--accent)" }}>@ {item.company}</span></p>
                                <p style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", marginTop: "0.15rem" }}>{item.duration}</p>
                                {item.achievements.length > 0 && <p style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", marginTop: "0.4rem" }}>{item.achievements.length} achievement{item.achievements.length !== 1 ? "s" : ""}</p>}
                            </div>
                            <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                                <button onClick={() => openEdit(item)} style={{ padding: "0.3rem 0.6rem", fontSize: "0.78rem", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--background)", color: "var(--foreground-muted)", cursor: "pointer" }}>Edit</button>
                                <button onClick={() => del(item.id, item.company)} style={{ padding: "0.3rem 0.6rem", fontSize: "0.78rem", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", background: "transparent", color: "#dc2626", cursor: "pointer" }}>Delete</button>
                            </div>
                        </div>
                    ))}
                    {!loading && items.length === 0 && !editing && <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>No experience entries yet.</p>}
                </div>
            </div>
        </AdminLayout>
    );
}
