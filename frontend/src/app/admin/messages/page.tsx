"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { messagesApi, type AdminMessage } from "@/lib/admin-api";

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<AdminMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [unreadOnly, setUnreadOnly] = useState(false);
    const [error, setError] = useState("");

    const load = () => {
        setLoading(true);
        messagesApi.list(unreadOnly).then(setMessages).catch((e) => setError(e.message)).finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, [unreadOnly]);

    const markRead = async (id: string) => {
        try { await messagesApi.markRead(id); load(); }
        catch (e: unknown) { setError((e as Error).message); }
    };

    const del = async (id: string, name: string) => {
        if (!confirm(`Delete message from "${name}"?`)) return;
        try { await messagesApi.delete(id); load(); }
        catch (e: unknown) { setError((e as Error).message); }
    };

    const unreadCount = messages.filter((m) => !m.is_read).length;

    return (
        <AdminLayout>
            <div style={{ maxWidth: "680px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                    <div>
                        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Messages</h1>
                        <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", marginTop: "0.2rem" }}>
                            {messages.length} total{unreadCount > 0 && ` · `}
                            {unreadCount > 0 && <span style={{ color: "var(--accent)", fontWeight: 600 }}>{unreadCount} unread</span>}
                        </p>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", color: "var(--foreground-muted)", cursor: "pointer" }}>
                        <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
                        Unread only
                    </label>
                </div>

                {error && <div style={{ padding: "0.6rem 0.75rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", color: "#dc2626", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}
                {loading && <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>Loading…</p>}
                {!loading && messages.length === 0 && <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>No messages{unreadOnly ? " unread" : ""}.</p>}

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                background: "var(--muted)",
                                border: `1px solid ${!msg.is_read ? "var(--accent)" : "var(--border)"}`,
                                borderRadius: "6px",
                                overflow: "hidden",
                                opacity: msg.is_read ? 0.8 : 1,
                            }}
                        >
                            {/* Header row */}
                            <div
                                style={{ padding: "0.85rem 1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}
                                onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                            >
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                        {!msg.is_read && <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0, display: "inline-block" }} />}
                                        <p style={{ fontWeight: 600, fontSize: "0.875rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.name}</p>
                                        <p style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.email}</p>
                                    </div>
                                    <p style={{ fontSize: "0.78rem", color: "var(--foreground-muted)", marginTop: "0.1rem" }}>
                                        {new Date(msg.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                                    {!msg.is_read && (
                                        <button onClick={(e) => { e.stopPropagation(); markRead(msg.id); }} style={{ padding: "0.28rem 0.55rem", fontSize: "0.72rem", border: "1px solid var(--border)", borderRadius: "3px", background: "var(--background)", cursor: "pointer", color: "var(--foreground-muted)" }}>
                                            Mark read
                                        </button>
                                    )}
                                    <button onClick={(e) => { e.stopPropagation(); del(msg.id, msg.name); }} style={{ padding: "0.28rem 0.55rem", fontSize: "0.72rem", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "3px", background: "transparent", color: "#dc2626", cursor: "pointer" }}>
                                        Delete
                                    </button>
                                    <span style={{ fontSize: "0.9rem", color: "var(--foreground-muted)" }}>{expanded === msg.id ? "▴" : "▾"}</span>
                                </div>
                            </div>

                            {/* Expanded body */}
                            {expanded === msg.id && (
                                <div style={{ padding: "0 1rem 1rem", borderTop: "1px solid var(--border)" }}>
                                    <p style={{ fontSize: "0.875rem", color: "var(--foreground)", lineHeight: 1.7, marginTop: "0.75rem", whiteSpace: "pre-wrap" }}>{msg.message}</p>
                                    <a href={`mailto:${msg.email}`} style={{ display: "inline-block", marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none" }}>Reply via email →</a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
