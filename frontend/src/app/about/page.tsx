import Link from "next/link";
import Container from "@/components/Container";
import { getAbout } from "@/lib/api";

export const metadata = {
    title: "About",
    description: "About Ravindranath Porandla — AI Engineer building production ML systems.",
};

export default async function AboutPage() {
    const aboutData = await getAbout();

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
                        About
                    </h1>
                    <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", marginBottom: "2rem" }}>
                        AI Engineer · Hyderabad, India
                    </p>

                    {/* Photo + intro */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1.5rem",
                            marginBottom: "2.5rem",
                        }}
                        className="md:flex-row md:items-start"
                    >
                        {/* Avatar block */}
                        <div
                            style={{
                                flexShrink: 0,
                                width: "10rem",
                                height: "10rem",
                                borderRadius: "8px",
                                background: "var(--muted)",
                                border: "1px solid var(--border)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "2rem",
                                fontWeight: 700,
                                color: "var(--foreground-muted)",
                            }}
                        >
                            RP
                        </div>

                        {/* Bio text */}
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--foreground)", marginBottom: "1rem" }}>
                                {aboutData.bio}
                            </p>
                            <p style={{ fontSize: "0.9rem", lineHeight: 1.8, color: "var(--foreground-muted)" }}>
                                {aboutData.philosophy}
                            </p>
                        </div>
                    </div>

                    <hr className="site-hr" style={{ marginBottom: "2rem" }} />

                    {/* GitHub Activity */}
                    <section style={{ marginBottom: "2.5rem" }}>
                        <h2
                            style={{
                                fontSize: "0.7rem",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "var(--foreground-muted)",
                                fontWeight: 600,
                                marginBottom: "1rem",
                            }}
                        >
                            GitHub Activity
                        </h2>
                        <div
                            style={{
                                background: "var(--muted)",
                                borderRadius: "4px",
                                padding: "1rem",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <img
                                src="https://ghchart.rshah.org/0070f3/Ravindranath-Porandla"
                                alt="Ravindranath's GitHub contribution graph"
                                style={{ width: "100%", height: "auto", display: "block" }}
                                loading="lazy"
                            />
                        </div>
                    </section>

                    <hr className="site-hr" style={{ marginBottom: "2rem" }} />

                    {/* Education */}
                    <section style={{ marginBottom: "2.5rem" }}>
                        <h2
                            style={{
                                fontSize: "0.7rem",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "var(--foreground-muted)",
                                fontWeight: 600,
                                marginBottom: "1rem",
                            }}
                        >
                            Education
                        </h2>
                        {aboutData.education.map((edu, i) => (
                            <div key={i} style={{ marginBottom: "0.75rem" }}>
                                <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--foreground)" }}>{edu.degree}</p>
                                <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)" }}>
                                    {edu.institution} · {edu.year}
                                </p>
                            </div>
                        ))}
                    </section>

                    <hr className="site-hr" style={{ marginBottom: "2rem" }} />

                    {/* Connect */}
                    <section>
                        <h2
                            style={{
                                fontSize: "0.7rem",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                color: "var(--foreground-muted)",
                                fontWeight: 600,
                                marginBottom: "0.75rem",
                            }}
                        >
                            Connect
                        </h2>
                        <p style={{ fontSize: "0.875rem", color: "var(--foreground-muted)", lineHeight: 1.7 }}>
                            Open to collaboration, speaking opportunities, and interesting ML problems.{" "}
                            <Link href="/contact" style={{ color: "var(--accent)", textDecoration: "underline dashed", textUnderlineOffset: "4px" }}>
                                Reach out
                            </Link>{" "}
                            or find me on{" "}
                            <a
                                href="https://github.com/Ravindranath-Porandla"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "var(--accent)", textDecoration: "underline dashed", textUnderlineOffset: "4px" }}
                            >
                                GitHub
                            </a>.
                        </p>
                    </section>
                </section>
            </Container>
        </div>
    );
}
