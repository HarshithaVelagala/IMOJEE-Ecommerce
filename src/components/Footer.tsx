"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/editor")) {
    return null;
  }

  return (
    <footer className="border-t border-neutral-200 py-8 mt-auto bg-neutral-50">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-shrink-0">
          <div className="relative w-32 h-10">
            <Image
              src="/logo.png"
              alt="IMOJEE Logo"
              fill
              className="object-contain object-center md:object-left"
            />
          </div>
        </div>
        <div className="text-sm text-neutral-500 text-center md:text-right">
          &copy; {new Date().getFullYear()} Imojee. All rights reserved.
        </div>
      </div>
    </footer>
  );
}