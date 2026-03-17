"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: "⊞" },
    { label: "Posts", href: "/admin/posts", icon: "✏" },
    { label: "Experience", href: "/admin/experience", icon: "💼" },
    { label: "Skills", href: "/admin/skills", icon: "⚡" },
    { label: "Navigation", href: "/admin/navigation", icon: "☰" },
    { label: "Settings", href: "/admin/settings", icon: "⚙" },
    { label: "Messages", href: "/admin/messages", icon: "✉" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { admin, loading, logout } = useAuth();

    if (loading) {
        return (
            <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
                <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>Verifying session…</p>
            </div>
        );
    }

    if (!admin) return null;

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>
            {/* Sidebar */}
            <aside style={{
                width: "220px",
                flexShrink: 0,
                borderRight: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                padding: "1.5rem 0",
            }}>
                {/* Logo */}
                <div style={{ padding: "0 1.25rem 1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "1rem" }}>
                    <p style={{ fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--foreground-muted)", fontWeight: 600, marginBottom: "0.2rem" }}>Portfolio CMS</p>
                    <Link href="/admin" style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--foreground)", textDecoration: "none" }}>Admin</Link>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: "0 0.75rem" }}>
                    {navItems.map((item) => {
                        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.6rem",
                                    padding: "0.5rem 0.6rem",
                                    borderRadius: "4px",
                                    marginBottom: "0.15rem",
                                    fontSize: "0.85rem",
                                    fontWeight: active ? 600 : 400,
                                    color: active ? "var(--accent)" : "var(--foreground-muted)",
                                    background: active ? "var(--muted)" : "transparent",
                                    textDecoration: "none",
                                    transition: "background 0.1s",
                                }}
                            >
                                <span style={{ fontSize: "0.9rem", opacity: 0.8 }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{ padding: "1rem 1.25rem", borderTop: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", marginBottom: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{admin.email}</p>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Link href="/" style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", textDecoration: "none" }}>← Portfolio</Link>
                        <span style={{ color: "var(--border)" }}>·</span>
                        <button onClick={logout} style={{ fontSize: "0.72rem", color: "var(--foreground-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Logout</button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main style={{ flex: 1, padding: "2rem 2.5rem", overflowY: "auto" }}>
                {children}
            </main>
        </div>
    );
}
