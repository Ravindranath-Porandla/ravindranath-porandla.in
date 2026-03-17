import Link from "next/link";
import Container from "@/components/Container";
import { getWriting } from "@/lib/api";
import type { PostListItem } from "@/lib/types";

export const metadata = {
    title: "Writing",
    description: "Articles and essays by Ravindranath Porandla on ML systems, infrastructure, and engineering.",
};

export default async function WritingPage() {
    const articles = await getWriting();

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
                        Writing
                    </h1>
                    <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", marginBottom: "2.5rem" }}>
                        Notes on ML systems, infrastructure, and the craft of shipping models that work.
                    </p>

                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {articles.map((article: PostListItem, index) => (
                            <li
                                key={article.id}
                                style={{
                                    paddingTop: index === 0 ? 0 : "2rem",
                                    paddingBottom: "2rem",
                                    borderBottom: "1px solid var(--border)",
                                }}
                            >
                                <Link
                                    href={`/writing/${article.slug}`}
                                    style={{
                                        display: "inline-block",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        color: "var(--accent)",
                                        textDecoration: "none",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    {article.title}
                                </Link>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "0.4rem",
                                        marginTop: "0.3rem",
                                        fontSize: "0.78rem",
                                        color: "var(--foreground-muted)",
                                        opacity: 0.85,
                                    }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                                        <line x1="16" x2="16" y1="2" y2="6" />
                                        <line x1="8" x2="8" y1="2" y2="6" />
                                        <line x1="3" x2="21" y1="10" y2="10" />
                                    </svg>
                                    <time>
                                        {new Date(article.created_at).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </time>
                                    <span aria-hidden>•</span>
                                    <span>5 min read</span>
                                </div>
                                <p
                                    style={{
                                        marginTop: "0.6rem",
                                        fontSize: "0.875rem",
                                        color: "var(--foreground-muted)",
                                        lineHeight: 1.65,
                                    }}
                                >
                                    {article.summary ?? ""}
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            </Container>
        </div>
    );
}
