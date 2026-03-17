import type {
    Post,
    PostListItem,
    PaginatedPosts,
    SkillCategory,
    Experience,
    NavItem,
    SiteSetting,
    Project,
    About,
    ContactForm,
    ContactResponse,
} from "./types";
import { projects, experience as placeholderExperience, skills as placeholderSkills, about } from "./placeholder-data";

// ============================================================
// API Integration Layer
// NEXT_PUBLIC_API_URL → FastAPI backend (http://localhost:8000)
// Falls back to placeholder data when API is unreachable.
// ============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function fetchAPI<T>(endpoint: string, fallback: T): Promise<T> {
    if (!API_BASE) return fallback;
    try {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) throw new Error(`API ${res.status}`);
        return res.json();
    } catch {
        console.warn(`[api] Failed ${endpoint} — using placeholder`);
        return fallback;
    }
}

// ── Posts / Writing ──────────────────────────────────────────
export async function getPosts(page = 1, pageSize = 10): Promise<PaginatedPosts> {
    const fallback: PaginatedPosts = {
        items: [],
        total: 0,
        page: 1,
        page_size: pageSize,
        has_next: false,
    };
    return fetchAPI<PaginatedPosts>(
        `/posts?page=${page}&page_size=${pageSize}`,
        fallback
    );
}

/** Convenience: get the flat list of published post items */
export async function getWriting(): Promise<PostListItem[]> {
    const result = await getPosts(1, 20);
    return result.items;
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    if (!API_BASE) return null;
    try {
        const res = await fetch(`${API_BASE}/posts/${slug}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

// ── Skills ───────────────────────────────────────────────────
export async function getSkills(): Promise<SkillCategory[]> {
    return fetchAPI<SkillCategory[]>("/skills", placeholderSkills as unknown as SkillCategory[]);
}

// ── Experience ───────────────────────────────────────────────
export async function getExperience(): Promise<Experience[]> {
    return fetchAPI<Experience[]>("/experience", placeholderExperience as unknown as Experience[]);
}

// ── Navigation (dynamic header items from backend) ───────────
export async function getNavigation(): Promise<NavItem[]> {
    return fetchAPI<NavItem[]>("/navigation", []);
}

// ── Settings (bio, email, links from backend) ────────────────
export async function getSettings(): Promise<SiteSetting[]> {
    return fetchAPI<SiteSetting[]>("/settings", []);
}

/** Helper: get a single setting value by key */
export async function getSetting(key: string): Promise<string | null> {
    const all = await getSettings();
    return all.find((s) => s.key === key)?.value ?? null;
}

// ── Projects (static — no backend endpoint yet) ──────────────
export async function getProjects(): Promise<Project[]> {
    return projects;
}

export async function getFeaturedProjects(): Promise<Project[]> {
    return projects.filter((p) => p.featured);
}

// ── About (static placeholder) ───────────────────────────────
export async function getAbout(): Promise<About> {
    return about;
}

// ── Contact ──────────────────────────────────────────────────
export async function submitContact(data: ContactForm): Promise<ContactResponse> {
    if (!API_BASE) {
        console.log("[api] Contact submission (no API):", data);
        return { success: true, message: "Message received (placeholder)" };
    }
    const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to submit contact form");
    return res.json();
}
