"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { settingsApi, type AdminSetting } from "@/lib/admin-api";

const KNOWN_KEYS = [
    { key: "bio", label: "Bio", multiline: true },
    { key: "tagline", label: "Tagline", multiline: false },
    { key: "title", label: "Job Title", multiline: false },
    { key: "email", label: "Contact Email", multiline: false },
    { key: "github_url", label: "GitHub URL", multiline: false },
    { key: "linkedin_url", label: "LinkedIn URL", multiline: false },
    { key: "twitter_url", label: "Twitter / X URL", multiline: false },
];

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [saved, setSaved] = useState<string | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        settingsApi.list()
            .then((list) => {
                const map: Record<string, string> = {};
                list.forEach((s: AdminSetting) => { map[s.key] = s.value ?? ""; });
                setSettings(map);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const save = async (key: string) => {
        setSaving(key);
        setError("");
        try {
            await settingsApi.upsert(key, settings[key] ?? "");
            setSaved(key);
            setTimeout(() => setSaved(null), 2000);
        } catch (e: unknown) { setError((e as Error).message); }
        finally { setSaving(null); }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "0.55rem 0.75rem", background: "var(--muted)",
        border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)",
        fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", outline: "none", boxSizing: "border-box",
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: "600px" }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Settings</h1>
                    <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", marginTop: "0.2rem" }}>Site-wide configuration stored in the database</p>
                </div>

                {error && <div style={{ padding: "0.6rem 0.75rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", color: "#dc2626", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}
                {loading && <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>Loading…</p>}

                {!loading && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        {KNOWN_KEYS.map(({ key, label, multiline }) => (
                            <div key={key}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                                    <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--foreground)" }}>{label}</label>
                                    {saved === key && <span style={{ fontSize: "0.72rem", color: "#16a34a" }}>✓ Saved</span>}
                                </div>
                                {multiline ? (
                                    <textarea rows={4} value={settings[key] ?? ""} onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
                                ) : (
                                    <input type="text" value={settings[key] ?? ""} onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))} style={inputStyle} />
                                )}
                                <div style={{ marginTop: "0.4rem" }}>
                                    <button
                                        onClick={() => save(key)}
                                        disabled={saving === key}
                                        style={{ padding: "0.35rem 0.85rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", opacity: saving === key ? 0.7 : 1 }}
                                    >
                                        {saving === key ? "Saving…" : "Save"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
