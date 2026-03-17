"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/admin-api";

interface AdminUser {
    id: string;
    email: string;
    is_active: boolean;
}

export function useAuth() {
    const router = useRouter();
    const [admin, setAdmin] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/auth/login");
            return;
        }
        authApi.me()
            .then(setAdmin)
            .catch(() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                router.push("/auth/login");
            })
            .finally(() => setLoading(false));
    }, [router]);

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        router.push("/auth/login");
    };

    return { admin, loading, logout };
}
