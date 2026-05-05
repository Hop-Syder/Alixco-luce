import React from "react";

export const AlixLogoIcon = ({ className = "h-8 w-auto", title = "Alixco Luxe" }) => (
    <svg className={className} viewBox="0 0 120 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title}>
        <title>{title}</title>
        <g fill="none" stroke="none">
            <rect width="120" height="32" rx="4" fill="none" />
        </g>
        <text x="6" y="22" fontFamily="Gloock, Georgia, serif" fontSize="18" fontWeight="600" fill="var(--alix-ink)">Alixco</text>
        <text x="74" y="22" fontFamily="Gloock, Georgia, serif" fontSize="18" fontWeight="600" fill="var(--alix-bronze)">Luxe</text>
    </svg>
);

export const AccentLeafIcon = ({ className = "h-6 w-6", title = "Décor" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title}>
        <title>{title}</title>
        <path d="M3 21c6-6 10-10 18-12" stroke="var(--alix-bronze)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 7c2 2 4 4 9 6" stroke="var(--alix-walnut)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
    </svg>
);

export default { AlixLogoIcon, AccentLeafIcon };
