"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import Image from "next/image";

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isEditor = pathname.startsWith("/editor");

    return (
        <>
            {!isEditor && <Header />}

            <main className="flex-1 flex flex-col">
                {children}
            </main>

            {!isEditor && (
                <footer className="border-t border-neutral-200 py-8 mt-auto bg-neutral-50">
                    <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="relative w-32 h-10">
                            <Image
                                src="/logo.png"
                                alt="IMOJEE Logo"
                                fill
                                className="object-contain"
                            />
                        </div>

                        <div className="text-sm text-neutral-500">
                            &copy; {new Date().getFullYear()} Imojee. All rights reserved.
                        </div>
                    </div>
                </footer>
            )}
        </>
    );
}