"use client";

import AdminLayout from "@/components/AdminLayout";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const cards = [
    { label: "Posts", desc: "Write and publish articles", href: "/admin/posts", icon: "✏" },
    { label: "Experience", desc: "Edit work timeline", href: "/admin/experience", icon: "💼" },
    { label: "Skills", desc: "Manage tech categories", href: "/admin/skills", icon: "⚡" },
    { label: "Navigation", desc: "Configure header links", href: "/admin/navigation", icon: "☰" },
    { label: "Settings", desc: "Bio, email, social links", href: "/admin/settings", icon: "⚙" },
    { label: "Messages", desc: "View contact submissions", href: "/admin/messages", icon: "✉" },
];

export default function AdminDashboard() {
    const { admin } = useAuth();

    return (
        <AdminLayout>
            <div>
                <p style={{ fontSize: "0.7rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--foreground-muted)", fontWeight: 600, marginBottom: "0.35rem" }}>
                    Welcome back
                </p>
                <h1 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.4rem" }}>Dashboard</h1>
                <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", marginBottom: "2.5rem" }}>
                    Manage your portfolio content from here.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                    {cards.map((card) => (
                        <Link
                            key={card.href}
                            href={card.href}
                            style={{
                                display: "block",
                                padding: "1.25rem",
                                background: "var(--muted)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                                textDecoration: "none",
                            }}
                        >
                            <div style={{ fontSize: "1.3rem", marginBottom: "0.6rem" }}>{card.icon}</div>
                            <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.2rem" }}>{card.label}</p>
                            <p style={{ fontSize: "0.78rem", color: "var(--foreground-muted)" }}>{card.desc}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
