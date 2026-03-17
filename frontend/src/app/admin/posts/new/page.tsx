"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/components/AdminLayout";
import { postsApi } from "@/lib/admin-api";

export default function NewPostPage() {
    const router = useRouter();
    const [form, setForm] = useState({ title: "", slug: "", summary: "", content: "", tags: "", is_published: false });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const set = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const post = await postsApi.create({
                title: form.title,
                slug: form.slug || slugify(form.title),
                summary: form.summary || undefined,
                content: form.content || undefined,
                tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
                is_published: form.is_published,
            });
            router.push(`/admin/posts/${post.id}/edit`);
        } catch (e: unknown) {
            setError((e as Error).message);
            setSaving(false);
        }
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: "720px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                    <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "var(--foreground-muted)", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}>← Back</button>
                    <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>New Post</h1>
                </div>

                {error && <div style={{ padding: "0.6rem 0.75rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", color: "#dc2626", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {(["title", "slug", "summary"] as const).map((field) => (
                        <div key={field}>
                            <label style={{ display: "block", fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "0.3rem", fontWeight: 500, textTransform: "capitalize" }}>{field}</label>
                            <input
                                type="text"
                                value={form[field]}
                                onChange={(e) => set(field, e.target.value)}
                                required={field === "title"}
                                placeholder={field === "slug" ? "auto-generated from title if empty" : field === "summary" ? "Short description shown in listing" : ""}
                                style={{ width: "100%", padding: "0.55rem 0.75rem", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", outline: "none", boxSizing: "border-box" }}
                            />
                        </div>
                    ))}

                    <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "0.3rem", fontWeight: 500 }}>Content (Markdown)</label>
                        <textarea
                            rows={16}
                            value={form.content}
                            onChange={(e) => set("content", e.target.value)}
                            placeholder="Write your post in Markdown..."
                            style={{ width: "100%", padding: "0.55rem 0.75rem", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", outline: "none", resize: "vertical", boxSizing: "border-box" }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "0.3rem", fontWeight: 500 }}>Tags (comma-separated)</label>
                        <input type="text" value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="mlops, python, production" style={{ width: "100%", padding: "0.55rem 0.75rem", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", outline: "none", boxSizing: "border-box" }} />
                    </div>

                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
                        <input type="checkbox" checked={form.is_published} onChange={(e) => set("is_published", e.target.checked)} style={{ width: "15px", height: "15px" }} />
                        Publish immediately
                    </label>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button type="submit" disabled={saving} style={{ padding: "0.55rem 1.25rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.875rem", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                            {saving ? "Saving…" : "Create Post"}
                        </button>
                        <button type="button" onClick={() => router.back()} style={{ padding: "0.55rem 1rem", background: "var(--muted)", color: "var(--foreground-muted)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "0.875rem", cursor: "pointer" }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
