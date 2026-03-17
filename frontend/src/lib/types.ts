// ============================================================
// TypeScript types matching the FastAPI backend schemas exactly.
// ============================================================

// ── Auth ─────────────────────────────────────────────────────
export interface TokenResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

// ── Posts / Writing ──────────────────────────────────────────
export interface PostReference {
    id: string;
    platform: "Medium" | "LinkedIn" | "Stack Overflow" | "Other";
    external_link: string;
    label: string | null;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    content: string | null;
    tags: string[];
    is_published: boolean;
    created_at: string; // ISO datetime string
    updated_at: string;
    references: PostReference[];
}

export interface PostListItem {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    tags: string[];
    is_published: boolean;
    created_at: string;
}

export interface PaginatedPosts {
    items: PostListItem[];
    total: number;
    page: number;
    page_size: number;
    has_next: boolean;
}

// ── Skills ───────────────────────────────────────────────────
export interface Skill {
    id: string;
    name: string;
    order_index: number;
    category_id: string;
}

export interface SkillCategory {
    id: string;
    name: string;
    order_index: number;
    skills: Skill[];
}

// ── Experience ───────────────────────────────────────────────
export interface Experience {
    id: string;
    company: string;
    role: string;
    duration: string;
    description: string | null;
    achievements: string[];
    order_index: number;
}

// ── Navigation ───────────────────────────────────────────────
export interface NavItem {
    id: string;
    label: string;
    route: string;
    is_visible: boolean;
    order_index: number;
}

// ── Settings ─────────────────────────────────────────────────
export interface SiteSetting {
    key: string;
    value: string | null;
    value_type: "text" | "json";
    updated_at: string;
}

// ── Contact ──────────────────────────────────────────────────
export interface ContactForm {
    name: string;
    email: string;
    message: string;
}

export interface ContactResponse {
    success: boolean;
    message: string;
}

// ── Projects (static placeholder — no backend endpoint yet) ──
export interface Project {
    id: string;
    title: string;
    summary: string;
    description: string;
    problem: string;
    approach: string;
    outcome: string;
    techStack: string[];
    githubUrl: string | null;
    demoUrl: string | null;
    featured: boolean;
}

// ── About (static placeholder) ───────────────────────────────
export interface Education {
    degree: string;
    institution: string;
    year: string;
}

export interface About {
    name: string;
    title: string;
    tagline: string;
    bio: string;
    philosophy: string;
    education: Education[];
}
