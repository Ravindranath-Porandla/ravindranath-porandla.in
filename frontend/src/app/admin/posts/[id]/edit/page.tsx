"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { postsApi, type AdminPost } from "@/lib/admin-api";

export default function EditPostPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [post, setPost] = useState<AdminPost | null>(null);
    const [form, setForm] = useState({ title: "", slug: "", summary: "", content: "", tags: "", is_published: false });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        postsApi.get(id).then((p) => {
            setPost(p);
            setForm({ title: p.title, slug: p.slug, summary: p.summary ?? "", content: p.content ?? "", tags: (p.tags || []).join(", "), is_published: p.is_published });
        }).catch((e) => setError(e.message));
    }, [id]);

    const set = (field: string, value: string | boolean) => { setForm((f) => ({ ...f, [field]: value })); setSaved(false); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            await postsApi.update(id, {
                title: form.title, slug: form.slug, summary: form.summary,
                content: form.content,
                tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
                is_published: form.is_published,
            });
            setSaved(true);
        } catch (e: unknown) { setError((e as Error).message); }
        finally { setSaving(false); }
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: "720px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                    <button onClick={() => router.push("/admin/posts")} style={{ background: "none", border: "none", color: "var(--foreground-muted)", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}>← Posts</button>
                    <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Edit Post</h1>
                    {post && <span style={{ fontSize: "0.65rem", padding: "0.1rem 0.45rem", borderRadius: "3px", fontWeight: 600, background: post.is_published ? "rgba(22,163,74,0.12)" : "rgba(156,163,175,0.15)", color: post.is_published ? "#16a34a" : "var(--foreground-muted)", border: `1px solid ${post.is_published ? "rgba(22,163,74,0.3)" : "var(--border)"}` }}>{post.is_published ? "PUBLISHED" : "DRAFT"}</span>}
                </div>

                {error && <div style={{ padding: "0.6rem 0.75rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", color: "#dc2626", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}
                {saved && <div style={{ padding: "0.6rem 0.75rem", background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.3)", borderRadius: "4px", color: "#16a34a", fontSize: "0.82rem", marginBottom: "1rem" }}>✓ Saved successfully</div>}

                {!post && !error && <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>Loading…</p>}

                {post && (
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        {(["title", "slug", "summary"] as const).map((field) => (
                            <div key={field}>
                                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "0.3rem", fontWeight: 500, textTransform: "capitalize" }}>{field}</label>
                                <input type="text" value={form[field] as string} onChange={(e) => set(field, e.target.value)} required={field === "title"} style={{ width: "100%", padding: "0.55rem 0.75rem", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", outline: "none", boxSizing: "border-box" }} />
                            </div>
                        ))}

                        <div>
                            <label style={{ display: "block", fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "0.3rem", fontWeight: 500 }}>Content (Markdown)</label>
                            <textarea rows={20} value={form.content} onChange={(e) => set("content", e.target.value)} style={{ width: "100%", padding: "0.55rem 0.75rem", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "0.3rem", fontWeight: 500 }}>Tags (comma-separated)</label>
                            <input type="text" value={form.tags} onChange={(e) => set("tags", e.target.value)} style={{ width: "100%", padding: "0.55rem 0.75rem", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", outline: "none", boxSizing: "border-box" }} />
                        </div>

                        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
                            <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} style={{ width: "15px", height: "15px" }} />
                            Published
                        </label>

                        <div style={{ display: "flex", gap: "0.75rem" }}>
                            <button type="submit" disabled={saving} style={{ padding: "0.55rem 1.25rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.875rem", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                                {saving ? "Saving…" : "Save Changes"}
                            </button>
                            <button type="button" onClick={() => router.push("/admin/posts")} style={{ padding: "0.55rem 1rem", background: "var(--muted)", color: "var(--foreground-muted)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "0.875rem", cursor: "pointer" }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </AdminLayout>
    );
}
