"use client";

import Container from "@/components/Container";
import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        try {
            const { submitContact } = await import("@/lib/api");
            await submitContact(form);
            setStatus("sent");
            setForm({ name: "", email: "", message: "" });
        } catch {
            setStatus("error");
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "0.6rem 0.75rem",
        background: "var(--muted)",
        border: "1px solid var(--border)",
        borderRadius: "4px",
        color: "var(--foreground)",
        fontSize: "0.875rem",
        fontFamily: "var(--font-mono, monospace)",
        outline: "none",
    };

    return (
        <div id="main-content">
            <Container>
                <section style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}>
                    <h1
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: 700,
                            marginBottom: "0.4rem",
                            color: "var(--accent)",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        Contact
                    </h1>
                    <p style={{ fontSize: "0.875rem", color: "var(--foreground-muted)", marginBottom: "2.5rem", lineHeight: 1.7 }}>
                        Have a project in mind or want to collaborate? Reach out.
                    </p>

                    {/* Email + Social */}
                    <div style={{ marginBottom: "2.5rem" }}>
                        <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--foreground-muted)", fontWeight: 600, marginBottom: "0.4rem" }}>
                            Email
                        </p>
                        <a
                            href={`mailto:${siteConfig.email}`}
                            style={{ fontSize: "0.875rem", color: "var(--foreground)", textDecoration: "underline dashed", textUnderlineOffset: "4px" }}
                        >
                            {siteConfig.email}
                        </a>

                        <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--foreground-muted)", fontWeight: 600, marginTop: "1.25rem", marginBottom: "0.5rem" }}>
                            Links
                        </p>
                        <div style={{ display: "flex", gap: "1rem" }}>
                            {siteConfig.socialLinks.github && (
                                <a href={siteConfig.socialLinks.github} target="_blank" rel="noopener noreferrer"
                                    style={{ color: "var(--foreground-muted)" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            )}
                            {siteConfig.socialLinks.linkedin && (
                                <a href={siteConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                                    style={{ color: "var(--foreground-muted)" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                    </svg>
                                </a>
                            )}
                            {siteConfig.socialLinks.email && (
                                <a href={`mailto:${siteConfig.socialLinks.email}`}
                                    style={{ color: "var(--foreground-muted)" }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                </a>
                            )}
                        </div>
                    </div>

                    <hr className="site-hr" style={{ marginBottom: "2rem" }} />

                    {/* Form */}
                    {status === "sent" ? (
                        <p style={{ fontSize: "0.9rem", color: "var(--accent)", fontWeight: 500 }}>
                            ✓ Message sent. I&apos;ll get back to you soon.
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--foreground-muted)", fontWeight: 600, marginBottom: "0.25rem" }}>
                                Send a Message
                            </p>
                            <div>
                                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "0.3rem" }}>
                                    Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "0.3rem" }}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    style={inputStyle}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.78rem", color: "var(--foreground-muted)", marginBottom: "0.3rem" }}>
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows={6}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    style={{ ...inputStyle, resize: "vertical" }}
                                />
                            </div>
                            <div>
                                <button
                                    type="submit"
                                    disabled={status === "sending"}
                                    style={{
                                        padding: "0.55rem 1.25rem",
                                        background: "var(--accent)",
                                        color: "#ffffff",
                                        border: "none",
                                        borderRadius: "4px",
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        cursor: status === "sending" ? "not-allowed" : "pointer",
                                        opacity: status === "sending" ? 0.7 : 1,
                                        fontFamily: "var(--font-mono, monospace)",
                                    }}
                                >
                                    {status === "sending" ? "Sending…" : "Send Message"}
                                </button>
                            </div>
                        </form>
                    )}
                </section>
            </Container>
        </div>
    );
}
