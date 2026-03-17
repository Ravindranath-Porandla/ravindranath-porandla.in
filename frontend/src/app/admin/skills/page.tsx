"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { skillsApi, type AdminSkillCategory, type AdminSkill } from "@/lib/admin-api";

export default function AdminSkillsPage() {
    const [categories, setCategories] = useState<AdminSkillCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCatName, setNewCatName] = useState("");
    const [newSkill, setNewSkill] = useState<Record<string, string>>({});
    const [error, setError] = useState("");

    const load = () => {
        setLoading(true);
        skillsApi.list().then(setCategories).catch((e) => setError(e.message)).finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const addCategory = async () => {
        if (!newCatName.trim()) return;
        try { await skillsApi.createCategory(newCatName.trim(), categories.length); setNewCatName(""); load(); }
        catch (e: unknown) { setError((e as Error).message); }
    };

    const deleteCategory = async (id: string, name: string) => {
        if (!confirm(`Delete category "${name}" and all its skills?`)) return;
        try { await skillsApi.deleteCategory(id); load(); }
        catch (e: unknown) { setError((e as Error).message); }
    };

    const addSkill = async (categoryId: string) => {
        const name = newSkill[categoryId]?.trim();
        if (!name) return;
        const cat = categories.find((c) => c.id === categoryId);
        try {
            await skillsApi.createSkill(categoryId, name, cat?.skills.length ?? 0);
            setNewSkill((s) => ({ ...s, [categoryId]: "" }));
            load();
        } catch (e: unknown) { setError((e as Error).message); }
    };

    const deleteSkill = async (id: string, name: string) => {
        if (!confirm(`Delete skill "${name}"?`)) return;
        try { await skillsApi.deleteSkill(id); load(); }
        catch (e: unknown) { setError((e as Error).message); }
    };

    return (
        <AdminLayout>
            <div style={{ maxWidth: "680px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
                    <div>
                        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Skills</h1>
                        <p style={{ fontSize: "0.82rem", color: "var(--foreground-muted)", marginTop: "0.2rem" }}>Manage skill categories and individual skills</p>
                    </div>
                </div>

                {error && <div style={{ padding: "0.6rem 0.75rem", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "4px", color: "#dc2626", fontSize: "0.82rem", marginBottom: "1rem" }}>{error}</div>}
                {loading && <p style={{ color: "var(--foreground-muted)", fontSize: "0.85rem" }}>Loading…</p>}

                {/* Add new category */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
                    <input
                        type="text"
                        placeholder="New category name (e.g. Programming)"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCategory()}
                        style={{ flex: 1, padding: "0.5rem 0.75rem", background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "0.875rem", fontFamily: "var(--font-mono, monospace)", outline: "none" }}
                    />
                    <button onClick={addCategory} style={{ padding: "0.5rem 1rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "4px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                        + Category
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {categories.map((cat) => (
                        <div key={cat.id} style={{ background: "var(--muted)", border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden" }}>
                            {/* Category header */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem 1rem", borderBottom: "1px solid var(--border)" }}>
                                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{cat.name}</p>
                                <button onClick={() => deleteCategory(cat.id, cat.name)} style={{ fontSize: "0.75rem", color: "#dc2626", background: "none", border: "none", cursor: "pointer" }}>Delete category</button>
                            </div>

                            {/* Skills */}
                            <div style={{ padding: "0.75rem 1rem" }}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
                                    {cat.skills.sort((a, b) => a.order_index - b.order_index).map((skill: AdminSkill) => (
                                        <span key={skill.id} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", padding: "0.2rem 0.55rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "3px" }}>
                                            {skill.name}
                                            <button onClick={() => deleteSkill(skill.id, skill.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--foreground-muted)", lineHeight: 1, fontSize: "0.9rem", padding: 0, paddingLeft: "0.2rem" }}>×</button>
                                        </span>
                                    ))}
                                    {cat.skills.length === 0 && <p style={{ fontSize: "0.78rem", color: "var(--foreground-muted)" }}>No skills yet</p>}
                                </div>

                                {/* Add skill */}
                                <div style={{ display: "flex", gap: "0.4rem" }}>
                                    <input
                                        type="text"
                                        placeholder="Add skill…"
                                        value={newSkill[cat.id] ?? ""}
                                        onChange={(e) => setNewSkill((s) => ({ ...s, [cat.id]: e.target.value }))}
                                        onKeyDown={(e) => e.key === "Enter" && addSkill(cat.id)}
                                        style={{ flex: 1, padding: "0.4rem 0.65rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--foreground)", fontSize: "0.82rem", fontFamily: "var(--font-mono, monospace)", outline: "none" }}
                                    />
                                    <button onClick={() => addSkill(cat.id)} style={{ padding: "0.4rem 0.75rem", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "4px", fontSize: "0.82rem", cursor: "pointer", color: "var(--foreground-muted)" }}>Add</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
