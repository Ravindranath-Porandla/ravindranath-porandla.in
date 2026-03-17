import Link from "next/link";
import Container from "@/components/Container";
import HeroAvatar from "@/components/HeroAvatar";
import { getFeaturedProjects, getAbout, getWriting } from "@/lib/api";
import type { PostListItem } from "@/lib/types";

export default async function HomePage() {
  const [featuredProjects, aboutData, articles] = await Promise.all([
    getFeaturedProjects(),
    getAbout(),
    getWriting(),
  ]);

  return (
    <div id="main-content">
      <Container>
        {/* ─── Hero ─── */}
        <section style={{ paddingTop: "2.5rem", paddingBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "1.25rem",
            }}
            className="sm:flex-row sm:items-start"
          >
            {/* Avatar */}
            <HeroAvatar />

            {/* Bio */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.3 }}>
                  Hello, I&apos;m Ravindranath.
                </h1>
              </div>
              <p style={{ marginTop: "0.5rem", color: "var(--foreground-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                {aboutData.tagline}
              </p>
              {/* Social links */}
              <div style={{ marginTop: "0.9rem", display: "flex", gap: "0.9rem", alignItems: "center" }}>
                <a
                  href="https://github.com/Ravindranath-Porandla"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com/in/ravindranath-porandla"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="mailto:ravindranath@example.com"
                  aria-label="Email"
                  style={{ color: "var(--foreground-muted)" }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        <hr className="site-hr" />

        {/* ─── Recent Writing ─── */}
        <section style={{ paddingTop: "2.5rem", paddingBottom: "1rem" }}>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {articles.slice(0, 5).map((article: PostListItem) => (
              <li
                key={article.id}
                style={{
                  marginBottom: "2rem",
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

          {/* All Posts link */}
          <div style={{ textAlign: "center", marginTop: "1rem", marginBottom: "2.5rem" }}>
            <Link
              href="/writing"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.875rem",
                color: "var(--accent)",
                fontWeight: 500,
                textDecoration: "none",
                padding: "0.4rem 0.8rem",
                border: "1px solid var(--border)",
                borderRadius: "4px",
              }}
            >
              All Posts
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>

        <hr className="site-hr" />

        {/* ─── Selected Projects ─── */}
        <section style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--foreground-muted)",
              marginBottom: "1.5rem",
              fontWeight: 600,
            }}
          >
            Selected Projects
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {featuredProjects.map((project) => (
              <li
                key={project.id}
                style={{ marginBottom: "1.75rem" }}
              >
                <Link
                  href="/projects"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "var(--accent)",
                    textDecoration: "none",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {project.title}
                </Link>
                <p
                  style={{
                    marginTop: "0.3rem",
                    fontSize: "0.85rem",
                    color: "var(--foreground-muted)",
                    lineHeight: 1.6,
                  }}
                >
                  {project.summary}
                </p>
                <div style={{ marginTop: "0.5rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {project.techStack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--foreground-muted)",
                        background: "var(--muted)",
                        border: "1px solid var(--border)",
                        padding: "0.1rem 0.45rem",
                        borderRadius: "3px",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </div>
  );
}
