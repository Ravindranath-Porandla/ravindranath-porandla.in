"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import Container from "@/components/Container";
import { siteConfig } from "@/lib/site-config";

function SunIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
    );
}

function MoonIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
    );
}

export default function Navbar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <header style={{ borderBottom: "1px solid var(--border)" }}>
            {/* Skip to content */}
            <a
                href="#main-content"
                style={{
                    position: "absolute",
                    top: "-4rem",
                    left: "1rem",
                    zIndex: 50,
                    background: "var(--background)",
                    color: "var(--accent)",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "4px",
                    transition: "top 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.top = "1rem")}
                onBlur={(e) => (e.currentTarget.style.top = "-4rem")}
            >
                Skip to content
            </a>

            <Container>
                {/* Main nav row */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingTop: "0.9rem",
                        paddingBottom: "0.9rem",
                        gap: "1rem",
                    }}
                >
                    {/* Site title */}
                    <Link
                        href="/"
                        style={{
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            letterSpacing: "-0.01em",
                            color: "var(--foreground)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                        }}
                    >
                        Ravindranath
                    </Link>

                    {/* Right side: nav links + theme toggle + hamburger */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                        {/* Desktop nav links — hidden on very small screens via nav-links class */}
                        <nav
                            id="desktop-nav"
                            style={{ display: "flex", alignItems: "center", gap: "0.1rem" }}
                        >
                            {siteConfig.navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        fontSize: "0.85rem",
                                        fontWeight: 500,
                                        padding: "0.3rem 0.5rem",
                                        borderRadius: "3px",
                                        color: isActive(item.href) ? "var(--accent)" : "var(--foreground-muted)",
                                        textDecoration: isActive(item.href) ? "underline wavy 2px" : "none",
                                        textUnderlineOffset: isActive(item.href) ? "5px" : "0",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>

                        {/* Theme toggle */}
                        <button
                            onClick={toggleTheme}
                            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                            title="Toggle theme"
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "0.35rem 0.5rem",
                                color: "var(--foreground-muted)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: "4px",
                                marginLeft: "0.25rem",
                            }}
                        >
                            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                        </button>

                        {/* Admin button — subtle, desktop only */}
                        <Link
                            href="/auth/login"
                            aria-label="Admin login"
                            title="Admin"
                            className="desktop-only-flex"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.35rem 0.5rem",
                                borderRadius: "4px",
                                color: "var(--foreground-muted)",
                                opacity: 0.5,
                                marginLeft: "0.1rem",
                            }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </Link>

                        {/* Hamburger — shown on mobile via CSS media query in globals */}
                        <button
                            id="mobile-menu-btn"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "0.35rem 0.4rem",
                                color: "var(--foreground-muted)",
                                display: "none", // hidden by default; .mobile-only CSS shows it
                                alignItems: "center",
                            }}
                            className="mobile-only"
                        >
                            {menuOpen ? (
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile menu dropdown */}
                {menuOpen && (
                    <nav
                        className="mobile-only-block"
                        style={{
                            paddingBottom: "0.75rem",
                            borderTop: "1px solid var(--border)",
                            paddingTop: "0.6rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.25rem",
                        }}
                    >
                        {siteConfig.navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMenuOpen(false)}
                                style={{
                                    fontSize: "0.9rem",
                                    fontWeight: 500,
                                    padding: "0.5rem 0.75rem",
                                    borderRadius: "4px",
                                    color: isActive(item.href) ? "var(--accent)" : "var(--foreground)",
                                    background: isActive(item.href) ? "var(--muted)" : "transparent",
                                    display: "block",
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </Container>
        </header>
    );
}
