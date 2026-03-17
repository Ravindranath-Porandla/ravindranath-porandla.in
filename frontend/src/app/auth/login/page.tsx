"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function AdminLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMsg("");

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                setErrorMsg(data?.detail || "Invalid email or password.");
                setStatus("error");
                return;
            }

            const { access_token, refresh_token } = await res.json();
            localStorage.setItem("access_token", access_token);
            localStorage.setItem("refresh_token", refresh_token);
            router.push("/admin");
        } catch {
            setErrorMsg("Could not connect to the server. Is the backend running?");
            setStatus("error");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--background)",
                padding: "2rem",
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: "380px",
                }}
            >
                {/* Header */}
                <div style={{ marginBottom: "2rem" }}>
                    <p
                        style={{
                            fontSize: "0.7rem",
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: "var(--foreground-muted)",
                            fontWeight: 600,
                            marginBottom: "0.5rem",
                        }}
                    >
                        Portfolio CMS
                    </p>
                    <h1
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            color: "var(--foreground)",
                            letterSpacing: "-0.02em",
                            marginBottom: "0.3rem",
                        }}
                    >
                        Admin Login
                    </h1>
                    <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)" }}>
                        Sign in to manage your portfolio content.
                    </p>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            style={{
                                display: "block",
                                fontSize: "0.78rem",
                                color: "var(--foreground-muted)",
                                marginBottom: "0.35rem",
                                fontWeight: 500,
                            }}
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="admin@portfolio.com"
                            style={{
                                width: "100%",
                                padding: "0.6rem 0.75rem",
                                background: "var(--muted)",
                                border: "1px solid var(--border)",
                                borderRadius: "4px",
                                color: "var(--foreground)",
                                fontSize: "0.875rem",
                                fontFamily: "var(--font-mono, monospace)",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            style={{
                                display: "block",
                                fontSize: "0.78rem",
                                color: "var(--foreground-muted)",
                                marginBottom: "0.35rem",
                                fontWeight: 500,
                            }}
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder="••••••••"
                            style={{
                                width: "100%",
                                padding: "0.6rem 0.75rem",
                                background: "var(--muted)",
                                border: "1px solid var(--border)",
                                borderRadius: "4px",
                                color: "var(--foreground)",
                                fontSize: "0.875rem",
                                fontFamily: "var(--font-mono, monospace)",
                                outline: "none",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    {/* Error */}
                    {status === "error" && (
                        <div
                            style={{
                                padding: "0.6rem 0.75rem",
                                background: "rgba(220, 38, 38, 0.08)",
                                border: "1px solid rgba(220, 38, 38, 0.3)",
                                borderRadius: "4px",
                                fontSize: "0.8rem",
                                color: "#dc2626",
                            }}
                        >
                            {errorMsg}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={status === "loading"}
                        style={{
                            width: "100%",
                            padding: "0.65rem 1rem",
                            background: status === "loading" ? "var(--muted)" : "var(--accent)",
                            color: status === "loading" ? "var(--foreground-muted)" : "#ffffff",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            cursor: status === "loading" ? "not-allowed" : "pointer",
                            fontFamily: "var(--font-mono, monospace)",
                            transition: "opacity 0.15s ease",
                            marginTop: "0.25rem",
                        }}
                    >
                        {status === "loading" ? "Signing in…" : "Sign In"}
                    </button>
                </form>

                {/* Back link */}
                <div style={{ marginTop: "2rem", textAlign: "center" }}>
                    <a
                        href="/"
                        style={{
                            fontSize: "0.8rem",
                            color: "var(--foreground-muted)",
                            textDecoration: "none",
                        }}
                    >
                        ← Back to portfolio
                    </a>
                </div>
            </div>
        </div>
    );
}
