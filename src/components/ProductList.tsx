"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { MouseEvent, KeyboardEvent } from "react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastProvider";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";
import QuickViewModal from "@/components/QuickViewModal";
import { Heart, Search, Scale } from "lucide-react";
import type { Product } from "@/data/products";

export function ProductList({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { toggle: toggleWishlist, has: hasWish } = useWishlist();
  const { add: addCompare, has: hasCompare } = useCompare();
  const router = useRouter();
  const [quickView, setQuickView] = useState<Product | null>(null);

  const handleAddToCart = (product: Product, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const addedNew = addItem(product);
    showToast(addedNew ? "Product added to cart successfully" : "Quantity updated in cart", [
      {
        label: "View Cart",
        onClick: () => router.push("/cart"),
      },
    ]);
  };

  const handleCardClick = (product: Product) => {
    router.push(`/products/${product.category}/${product.slug}`);
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>, product: Product) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(product);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
      {products.map((product) => (
        <div key={product.id} className="w-full max-w-[320px]">
          <div
            role="button"
            tabIndex={0}
            onClick={() => handleCardClick(product)}
            onKeyDown={(event) => handleCardKeyDown(event, product)}
            className="group relative rounded-2xl bg-white shadow-sm border border-neutral-100 overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            {/* Image section */}
            <div className="relative w-full h-[260px] overflow-hidden bg-neutral-100">
<Image src={(product.images?.[0] ?? product.image)} alt={product.name} fill className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" />

              {/* Action icons overlay (hidden, slides in) */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full group-hover:translate-x-0 transition-transform duration-300">
                <div className="flex flex-col items-center rounded-l-2xl bg-white p-2 shadow-md space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const added = addCompare(product.id);
                      showToast(
                        added ? "Added to compare" : hasCompare(product.id) ? "Already in compare" : "You can compare up to 4 products"
                      );
                    }}
                    className={`w-10 h-10 rounded-full ${hasCompare(product.id) ? "bg-purple-50 text-purple-700" : "bg-white text-neutral-700"} flex items-center justify-center border border-neutral-200 hover:border-purple-600`}
                    aria-label="Add to compare"
                  >
                    <Scale className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickView(product);
                    }}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                    aria-label="Quick view"
                  >
                    <Search className="w-5 h-5 text-neutral-700" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const added = toggleWishlist(product.id);
                      showToast(added ? "Added to wishlist" : "Removed from wishlist");
                    }}
                    className={`w-10 h-10 rounded-full ${hasWish(product.id) ? "bg-purple-50 text-purple-700" : "bg-white text-neutral-700"} flex items-center justify-center border border-neutral-200 hover:border-purple-600`}
                    aria-label={hasWish(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 text-center">
              <h3 className="text-sm md:text-base font-semibold text-neutral-900 truncate">{product.name}</h3>
              <p className="mt-2 text-lg font-bold text-purple-600">₹{product.price.toFixed(2)}</p>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={(event) => handleAddToCart(product, event)}
                  className="w-full rounded-full bg-purple-600 text-white px-4 py-3 text-sm font-semibold hover:bg-purple-700"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      <QuickViewModal product={quickView} open={!!quickView} onClose={() => setQuickView(null)} />
    </div>
  );
}
