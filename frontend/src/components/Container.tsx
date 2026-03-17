import React from "react";

/**
 * Centered container — max-w-3xl equivalent (48rem = 768px).
 * Inline styles bypass any Tailwind layer specificity issues.
 */
const containerStyle: React.CSSProperties = {
    maxWidth: "48rem",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
};

export default function Container({
    children,
    className = "",
    as: Tag = "div",
    style,
}: {
    children: React.ReactNode;
    className?: string;
    as?: React.ElementType;
    style?: React.CSSProperties;
}) {
    return (
        <Tag className={className} style={{ ...containerStyle, ...style }}>
            {children}
        </Tag>
    );
}
