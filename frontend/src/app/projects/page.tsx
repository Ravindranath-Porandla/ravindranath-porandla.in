import Link from "next/link";
import Container from "@/components/Container";
import { getProjects } from "@/lib/api";

export const metadata = {
    title: "Projects",
    description: "Selected ML and AI engineering projects by Ravindranath Porandla.",
};

export default async function ProjectsPage() {
    const projects = await getProjects();

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
                        Projects
                    </h1>
                    <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", marginBottom: "2.5rem" }}>
                        Selected work in ML systems, infrastructure, and production AI.
                    </p>

                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {projects.map((project, index) => (
                            <li
                                key={project.id}
                                style={{
                                    paddingTop: index === 0 ? 0 : "2rem",
                                    paddingBottom: "2rem",
                                    borderBottom: "1px solid var(--border)",
                                }}
                            >
                                {/* Header row */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: "1rem",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <h2
                                        style={{
                                            fontSize: "0.98rem",
                                            fontWeight: 700,
                                            color: "var(--foreground)",
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        {project.title}
                                    </h2>
                                    <div style={{ display: "flex", gap: "0.75rem", flexShrink: 0 }}>
                                        {project.githubUrl && (
                                            <a
                                                href={project.githubUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: "0.78rem", color: "var(--foreground-muted)" }}
                                            >
                                                GitHub ↗
                                            </a>
                                        )}
                                        {project.demoUrl && (
                                            <a
                                                href={project.demoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ fontSize: "0.78rem", color: "var(--foreground-muted)" }}
                                            >
                                                Demo ↗
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <p
                                    style={{
                                        marginTop: "0.5rem",
                                        fontSize: "0.85rem",
                                        color: "var(--foreground-muted)",
                                        lineHeight: 1.65,
                                    }}
                                >
                                    {project.summary}
                                </p>

                                {/* Problem / Approach / Outcome */}
                                {(project.problem || project.approach || project.outcome) && (
                                    <div style={{ marginTop: "0.9rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                        {project.problem && (
                                            <div>
                                                <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)", fontWeight: 600 }}>
                                                    Problem
                                                </span>
                                                <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", lineHeight: 1.6, marginTop: "0.2rem" }}>
                                                    {project.problem}
                                                </p>
                                            </div>
                                        )}
                                        {project.approach && (
                                            <div>
                                                <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)", fontWeight: 600 }}>
                                                    Approach
                                                </span>
                                                <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", lineHeight: 1.6, marginTop: "0.2rem" }}>
                                                    {project.approach}
                                                </p>
                                            </div>
                                        )}
                                        {project.outcome && (
                                            <div>
                                                <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--foreground-muted)", fontWeight: 600 }}>
                                                    Outcome
                                                </span>
                                                <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", lineHeight: 1.6, marginTop: "0.2rem" }}>
                                                    {project.outcome}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Tech stack */}
                                <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                                    {project.techStack.map((tech) => (
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
