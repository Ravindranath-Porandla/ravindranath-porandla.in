"use client";

import Link from "next/link";

export default function HeroAvatar() {
    return (
        <Link href="/about" style={{ flexShrink: 0, display: "block" }}>
            <div
                style={{
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "50%",
                    background: "var(--muted)",
                    border: "2px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    color: "var(--foreground-muted)",
                    letterSpacing: "0.05em",
                    flexShrink: 0,
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1.06)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
            >
                RP
            </div>
        </Link>
    );
}
