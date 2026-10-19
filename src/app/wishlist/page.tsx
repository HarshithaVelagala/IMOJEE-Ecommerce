"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/components/ToastProvider";
import { useCart } from "@/context/CartContext";
import { getProductsByIds } from "@/data/products";

export default function WishlistPage() {
  const { items, toggle } = useWishlist();
  const { showToast } = useToast();
  const { addItem } = useCart();

  const products = getProductsByIds(items);

  const handleRemove = (id: string) => {
    toggle(id);
    showToast("Removed from wishlist");
  };

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem(product);
    showToast("Product added to cart");
  };

  return (
    <div className="container mx-auto px-4 py-14">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-purple-600 font-semibold">Wishlist</p>
        <h1 className="mt-4 text-4xl font-bold text-neutral-900">Saved products</h1>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-neutral-200 bg-purple-50 p-16 text-center">
          <p className="text-lg font-semibold text-neutral-900">Your wishlist is empty</p>
          <p className="mt-3 text-neutral-600">Save products to view them later</p>
          <Link href="/products" className="inline-flex mt-8 rounded-full bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => (
            <div key={product.id} className="grid gap-4 rounded-3xl border border-neutral-200 bg-white p-6 sm:grid-cols-[220px_minmax(0,1fr)] items-center">
              <div className="relative h-56 overflow-hidden rounded-3xl bg-neutral-100 sm:h-48">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-purple-600 font-semibold">{product.categoryTitle}</p>
                  <h2 className="mt-2 text-2xl font-bold text-neutral-900">{product.name}</h2>
                </div>
                <p className="text-xl font-semibold text-purple-600">₹{product.price.toFixed(2)}</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Add To Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(product.id)}
                    className="rounded-full border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
