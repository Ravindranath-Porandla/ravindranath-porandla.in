// ============================================================
// Site Configuration — single source of truth for navigation,
// social links, and site identity.
// Add new nav items here; the Navbar picks them up automatically.
// ============================================================

export interface NavItem {
    href: string;
    label: string;
}

export const siteConfig = {
    author: "Ravindranath Porandla",
    title: "Ravindranath Porandla",
    tagline: "AI Engineer building production ML systems.",
    email: "ravindranath@example.com",

    socialLinks: {
        github: "https://github.com/Ravindranath-Porandla",
        linkedin: "https://linkedin.com/in/ravindranath-porandla",
        email: "ravindranath@example.com",
    },

    // --------------------------------------------------------
    //  Navigation — add/remove entries freely.
    //  The title above appears as the site name (left side).
    //  These items appear as right-side nav links.
    // --------------------------------------------------------
    navItems: [
        { href: "/writing", label: "Writing" },
        { href: "/about", label: "About" },
        { href: "/projects", label: "Projects" },
        { href: "/experience", label: "Experience" },
        { href: "/contact", label: "Contact" },
    ] as NavItem[],
};
