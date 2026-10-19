import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ToastProvider";
import CartDrawer from "@/components/CartDrawer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Imojee | Premium Platform",
  description: "Next-generation ecommerce platform and CRM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-white text-neutral-900 flex flex-col font-sans">
        <CartProvider>
          <ToastProvider>
            <Suspense fallback={<div className="h-20 bg-white border-b border-neutral-200" />}>
              <Header />
            </Suspense>
            <main className="flex-1 flex flex-col">{children}</main>
            <CartDrawer />
          </ToastProvider>
        </CartProvider>

        <Footer />
      </body>
    </html>
  );
}
