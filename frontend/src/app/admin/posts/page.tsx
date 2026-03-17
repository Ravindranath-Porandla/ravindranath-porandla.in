"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { postsApi, type AdminPost } from "@/lib/admin-api";

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<AdminPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const load = () => {
        setLoading(true);
        postsApi.list(1, 50)
            .then((res) => setPosts(res.items))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        try { await postsApi.delete(id); load(); } catch (e: unknown) { alert((e as Error).message); }
    };

    const handleToggle = async (id: string) => {
        try { await postsApi.togglePublish(id); load(); } catch (e: unknown) { alert((e as Error).message); }
    };

    return (
        <AdminLayout>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Posts</h1>
                    <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", marginTop: "0.2rem" }}>{posts.length} total</p>
                </div>
                <Link href="/admin/posts/new" style={{ padding: "0.5rem 1rem", background: "var(--accent)", color: "#fff", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                    + New Post
                </Link>
            </div>

            {loading && <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>Loading…</p>}
            {error && <p style={{ color: "#dc2626", fontSize: "0.85rem" }}>{error}</p>}

            {!loading && posts.length === 0 && (
                <div style={{ padding: "3rem", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "6px" }}>
                    <p style={{ color: "var(--foreground-muted)", fontSize: "0.9rem" }}>No posts yet. <Link href="/admin/posts/new" style={{ color: "var(--accent)" }}>Create your first post →</Link></p>
                </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {posts.map((post) => (
                    <div key={post.id} style={{ padding: "1rem 1.25rem", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "6px", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                                <span style={{
                                    fontSize: "0.65rem", padding: "0.1rem 0.45rem", borderRadius: "3px", fontWeight: 600, letterSpacing: "0.05em",
                                    background: post.is_published ? "rgba(22,163,74,0.12)" : "rgba(156,163,175,0.15)",
                                    color: post.is_published ? "#16a34a" : "var(--foreground-muted)",
                                    border: `1px solid ${post.is_published ? "rgba(22,163,74,0.3)" : "var(--border)"}`,
                                }}>
                                    {post.is_published ? "PUBLISHED" : "DRAFT"}
                                </span>
                                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</p>
                            </div>
                            <p style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>
                                /{post.slug} · {new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                {post.tags?.length > 0 && ` · ${post.tags.join(", ")}`}
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                            <button onClick={() => handleToggle(post.id)} style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--background)", color: "var(--foreground-muted)", cursor: "pointer" }}>
                                {post.is_published ? "Unpublish" : "Publish"}
                            </button>
                            <Link href={`/admin/posts/${post.id}/edit`} style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem", border: "1px solid var(--border)", borderRadius: "4px", background: "var(--background)", color: "var(--foreground-muted)", textDecoration: "none" }}>
                                Edit
                            </Link>
                            <button onClick={() => handleDelete(post.id, post.title)} style={{ padding: "0.35rem 0.65rem", fontSize: "0.78rem", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", background: "transparent", color: "#dc2626", cursor: "pointer" }}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
