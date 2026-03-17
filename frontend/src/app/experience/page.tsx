import Container from "@/components/Container";
import { getExperience } from "@/lib/api";

export const metadata = {
    title: "Experience",
    description: "Work history and experience of Ravindranath Porandla.",
};

export default async function ExperiencePage() {
    const experience = await getExperience();

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
                        Experience
                    </h1>
                    <p style={{ fontSize: "0.85rem", color: "var(--foreground-muted)", marginBottom: "2.5rem" }}>
                        Building ML systems in production since 2019.
                    </p>

                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {experience.map((job, index) => (
                            <li
                                key={job.id}
                                style={{
                                    paddingTop: index === 0 ? 0 : "2rem",
                                    paddingBottom: "2rem",
                                    borderBottom: "1px solid var(--border)",
                                }}
                            >
                                {/* Job header */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        justifyContent: "space-between",
                                        gap: "1rem",
                                        flexWrap: "wrap",
                                    }}
                                >
                                    <div>
                                        <h2
                                            style={{
                                                fontSize: "0.95rem",
                                                fontWeight: 700,
                                                color: "var(--foreground)",
                                                letterSpacing: "-0.01em",
                                            }}
                                        >
                                            {job.role}
                                        </h2>
                                        <p style={{ fontSize: "0.85rem", color: "var(--accent)", marginTop: "0.15rem", fontWeight: 500 }}>
                                            {job.company}
                                        </p>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: "0.78rem",
                                            color: "var(--foreground-muted)",
                                            whiteSpace: "nowrap",
                                            fontFamily: "var(--font-mono)",
                                            opacity: 0.8,
                                        }}
                                    >
                                        {job.duration}
                                    </span>
                                </div>

                                {/* Achievements */}
                                <ul style={{ listStyle: "none", padding: 0, margin: "0.9rem 0 0" }}>
                                    {job.achievements.map((ach, i) => (
                                        <li
                                            key={i}
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                gap: "0.6rem",
                                                marginBottom: "0.5rem",
                                                fontSize: "0.85rem",
                                                color: "var(--foreground-muted)",
                                                lineHeight: 1.65,
                                            }}
                                        >
                                            <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "0.1rem" }}>—</span>
                                            {ach}
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </section>
            </Container>
        </div>
    );
}
