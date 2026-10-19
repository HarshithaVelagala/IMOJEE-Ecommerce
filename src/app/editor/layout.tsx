"use client";

import { usePathname } from "next/navigation";

export default function EditorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isPreview = pathname === "/editor/preview";

    return (
        <div className={isPreview ? "min-h-screen w-full bg-[#f3f4f6]" : "h-screen w-screen overflow-hidden bg-[#eef1f5]"}>
            {children}
        </div>
    );
}