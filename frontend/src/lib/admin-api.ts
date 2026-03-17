/**
 * Admin API — all functions include Authorization: Bearer <token> header.
 * Token is read from localStorage on each call.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function authHeaders(): HeadersInit {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: authHeaders(),
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(err?.detail || `Error ${res.status}`);
    }
    if (res.status === 204) return undefined as T;
    return res.json();
}

// ── Auth ─────────────────────────────────────────────────────
export const authApi = {
    me: () => request<{ id: string; email: string; is_active: boolean }>("GET", "/auth/me"),
};

// ── Posts ─────────────────────────────────────────────────────
export interface AdminPost {
    id: string;
    title: string;
    slug: string;
    summary: string | null;
    content: string | null;
    tags: string[];
    is_published: boolean;
    created_at: string;
    updated_at: string;
}
export interface AdminPostCreate { title: string; slug?: string; summary?: string; content?: string; tags?: string[]; is_published?: boolean; }
export interface AdminPostUpdate { title?: string; slug?: string; summary?: string; content?: string; tags?: string[]; is_published?: boolean; }

export const postsApi = {
    list: (page = 1, pageSize = 20) =>
        request<{ items: AdminPost[]; total: number; has_next: boolean }>(
            "GET", `/admin/posts?page=${page}&page_size=${pageSize}`
        ),
    get: (id: string) => request<AdminPost>("GET", `/admin/posts/${id}`),
    create: (data: AdminPostCreate) => request<AdminPost>("POST", "/admin/posts", data),
    update: (id: string, data: AdminPostUpdate) => request<AdminPost>("PATCH", `/admin/posts/${id}`, data),
    delete: (id: string) => request<void>("DELETE", `/admin/posts/${id}`),
    togglePublish: (id: string) => request<AdminPost>("PATCH", `/admin/posts/${id}/publish`),
};

// ── Skills ────────────────────────────────────────────────────
export interface AdminSkillCategory { id: string; name: string; order_index: number; skills: AdminSkill[]; }
export interface AdminSkill { id: string; category_id: string; name: string; order_index: number; }

export const skillsApi = {
    list: () => request<AdminSkillCategory[]>("GET", "/admin/skills"),
    createCategory: (name: string, order_index = 0) => request<AdminSkillCategory>("POST", "/admin/skills/categories", { name, order_index }),
    updateCategory: (id: string, data: { name?: string; order_index?: number }) => request<AdminSkillCategory>("PATCH", `/admin/skills/categories/${id}`, data),
    deleteCategory: (id: string) => request<void>("DELETE", `/admin/skills/categories/${id}`),
    createSkill: (category_id: string, name: string, order_index = 0) => request<AdminSkill>("POST", "/admin/skills", { category_id, name, order_index }),
    updateSkill: (id: string, data: { name?: string; order_index?: number }) => request<AdminSkill>("PATCH", `/admin/skills/${id}`, data),
    deleteSkill: (id: string) => request<void>("DELETE", `/admin/skills/${id}`),
};

// ── Experience ────────────────────────────────────────────────
export interface AdminExperience { id: string; company: string; role: string; duration: string; description: string | null; achievements: string[]; order_index: number; }
export interface AdminExperienceWrite { company: string; role: string; duration: string; description?: string; achievements?: string[]; order_index?: number; }

export const experienceApi = {
    list: () => request<AdminExperience[]>("GET", "/admin/experience"),
    create: (data: AdminExperienceWrite) => request<AdminExperience>("POST", "/admin/experience", data),
    update: (id: string, data: Partial<AdminExperienceWrite>) => request<AdminExperience>("PATCH", `/admin/experience/${id}`, data),
    delete: (id: string) => request<void>("DELETE", `/admin/experience/${id}`),
};

// ── Navigation ────────────────────────────────────────────────
export interface AdminNavItem { id: string; label: string; route: string; is_visible: boolean; order_index: number; }
export interface AdminNavWrite { label: string; route: string; is_visible?: boolean; order_index?: number; }

export const navigationApi = {
    list: () => request<AdminNavItem[]>("GET", "/admin/navigation"),
    create: (data: AdminNavWrite) => request<AdminNavItem>("POST", "/admin/navigation", data),
    update: (id: string, data: Partial<AdminNavWrite>) => request<AdminNavItem>("PATCH", `/admin/navigation/${id}`, data),
    delete: (id: string) => request<void>("DELETE", `/admin/navigation/${id}`),
    reorder: (ids: string[]) => request<void>("POST", "/admin/navigation/reorder", { ordered_ids: ids }),
};

// ── Settings ──────────────────────────────────────────────────
export interface AdminSetting { key: string; value: string | null; value_type: string; updated_at: string; }

export const settingsApi = {
    list: () => request<AdminSetting[]>("GET", "/admin/settings"),
    upsert: (key: string, value: string, value_type = "text") => request<AdminSetting>("PATCH", "/admin/settings", { key, value, value_type }),
};

// ── Messages ──────────────────────────────────────────────────
export interface AdminMessage { id: string; name: string; email: string; message: string; is_read: boolean; created_at: string; }

export const messagesApi = {
    list: (unread_only = false) => request<AdminMessage[]>("GET", `/admin/messages?unread_only=${unread_only}`),
    markRead: (id: string) => request<AdminMessage>("PATCH", `/admin/messages/${id}/read`),
    delete: (id: string) => request<void>("DELETE", `/admin/messages/${id}`),
};
