/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, ChevronDown, Heart, Scale } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";

const megaMenuData = [
  {
    id: "business-collaterals",
    name: "Business Collaterals",
    subcategories: [
      "Bill Books",
      "Booklets",
      "Calendars",
      "Diaries",
      "Envelopes",
      "Flyers",
      "Letterheads",
      "Lanyards",
      "Notepads",
      "Rubber Stamps",
      "Visiting Cards",
    ],
  },
  {
    id: "gifting",
    name: "Gifting",
    subcategories: [
      "Bags",
      "Bottles And Sippers",
      "Engraved Pens",
      "Magnets",
      "Mugs",
      "Notebooks",
      "Photo Frames",
    ],
  },
  {
    id: "packaging",
    name: "Packaging",
    subcategories: [
      "Corrugated Mailer Boxes",
      "Corrugated Shipping Boxes",
      "Cotton Carry Bags",
      "Courier Poly Bags",
      "Food Boxes",
      "Food Wrapping Papers",
      "Hang Tags",
      "Labels",
      "Packaging Sleeves",
      "Packing Tape",
      "Paper Pouches",
      "Pizza Boxes",
    ],
  },
  {
    id: "sweatshirts",
    name: "Sweat Shirts & Hoodies",
    subcategories: ["T-Shirts"],
  },
];

export function Header() {
  const pathname = usePathname();
  const [activeCategory, setActiveCategory] = useState(megaMenuData[0].id);
  const { items, setCartOpen } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { items: compareItems } = useCompare();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (pathname.startsWith("/editor")) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="relative w-36 md:w-44 h-12">
                <Image
                  src="/logo.png"
                  alt="IMOJEE Logo"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            <Link href="/" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              About Us
            </Link>

            {/* Products with Mega Menu */}
            <div className="group h-full flex items-center">
              <Link href="/products" className="text-sm font-medium text-neutral-600 group-hover:text-purple-700 transition-colors flex items-center gap-1">
                Products <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" />
              </Link>

              {/* Mega Menu Dropdown */}
              <div className="absolute top-[80px] left-0 w-full bg-white shadow-xl border-t border-neutral-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-50 origin-top">
                <div className="container mx-auto px-4 md:px-8">
                  <div className="flex flex-col md:flex-row h-full py-8">

                    {/* Left Panel: Categories */}
                    <div className="w-full md:w-1/4 border-r border-neutral-100 pr-8">
                      <ul className="space-y-1">
                        {megaMenuData.map((category) => (
                          <li key={category.id}>
                            <button
                              onMouseEnter={() => setActiveCategory(category.id)}
                              className={`w-full text-left px-4 py-3 rounded-md text-sm font-semibold transition-all duration-200 ${activeCategory === category.id
                                  ? "bg-purple-50 text-purple-700 border-l-4 border-purple-700"
                                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border-l-4 border-transparent"
                                }`}
                            >
                              {category.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right Panel: Subcategories */}
                    <div className="w-full md:w-3/4 pl-8">
                      {megaMenuData.map((category) => (
                        <div
                          key={`sub-${category.id}`}
                          className={`transition-opacity duration-300 ${activeCategory === category.id ? "block opacity-100" : "hidden opacity-0"
                            }`}
                        >
                          <h3 className="text-lg font-bold text-neutral-900 mb-6 border-b border-neutral-100 pb-2">
                            {category.name}
                          </h3>
                          {category.subcategories.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                              {category.subcategories.map((sub, index) => (
                                <Link
                                  key={index}
                                  href={`/products?category=${category.id}&sub=${encodeURIComponent(sub.toLowerCase())}`}
                                  className="group/sub flex items-center gap-2 text-sm text-neutral-600 hover:text-purple-700 transition-colors"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-300 group-hover/sub:bg-purple-700 transition-colors" />
                                  {sub}
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-neutral-400 italic">No subcategories available.</p>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </div>

            <Link href="/services" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Services
            </Link>
            <Link href="/festive-gifting" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Festive Gifting
            </Link>
            <Link href="/partner" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              Partner With Us
            </Link>
          </nav>

          {/* Right: Cart & Login */}
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="relative group flex items-center rounded-full p-2 text-neutral-800 hover:text-purple-700 transition-colors">
              <Heart
                className={`w-6 h-6 transition-colors ${mounted && wishlistItems.length > 0 ? "text-purple-700" : "text-neutral-800"}`}
                fill={mounted && wishlistItems.length > 0 ? "currentColor" : "none"}
              />
              {mounted && wishlistItems.length > 0 ? (
                <span className="absolute -top-2 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-700 text-[10px] font-bold text-white px-1">
                  {wishlistItems.length}
                </span>
              ) : null}
            </Link>

            <Link href="/compare" className="relative group flex items-center rounded-full p-2 text-neutral-800 hover:text-purple-700 transition-colors">
              <Scale className={`w-6 h-6 transition-colors ${mounted && compareItems.length > 0 ? "text-purple-700" : "text-neutral-800"}`} />
              {mounted && compareItems.length > 0 ? (
                <span className="absolute -top-2 -right-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-purple-700 text-[10px] font-bold text-white px-1">
                  {compareItems.length}
                </span>
              ) : null}
            </Link>

            <button 
              onClick={() => setCartOpen(true)}
              className="relative group flex items-center rounded-full p-2 text-neutral-800 hover:text-purple-700 transition-colors cursor-pointer"
            >
              <ShoppingCart className="w-6 h-6" />
              {mounted && items.reduce((count, item) => count + item.quantity, 0) > 0 ? (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 group-hover:bg-purple-700 text-[10px] font-bold text-white transition-colors">
                  {items.reduce((count, item) => count + item.quantity, 0)}
                </span>
              ) : null}
            </button>

            <Link href="/login" className="hidden sm:block text-sm font-medium text-neutral-800 hover:text-purple-700 transition-colors">
              Login / Register
            </Link>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-neutral-800 hover:text-purple-700 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
