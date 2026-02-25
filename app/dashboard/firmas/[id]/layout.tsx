export function generateStaticParams() {
    return [
        { id: "DOC-2026-001" },
        { id: "DOC-2026-002" },
        { id: "DOC-2026-003" },
        { id: "DOC-2026-004" }
    ];
}

export default function FirmaDetalleLayout({ children }: { children: React.ReactNode }) {
    return children;
}
