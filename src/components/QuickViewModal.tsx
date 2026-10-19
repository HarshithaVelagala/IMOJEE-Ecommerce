"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronLeft, ChevronRight, Share2, Heart, MessageSquare, Send } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ToastProvider";
import { useImageZoom } from "@/hooks/useImageZoom";
import type { Product } from "@/data/products";

export default function QuickViewModal({
  product,
  open,
  onClose,
}: {
  product?: Product | null;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const zoom = useImageZoom();

  useEffect(() => {
    if (!open) return;
    setActiveIndex(0);
    setQuantity(1);
  }, [open, product?.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setActiveIndex((i) => i + 1);
      if (e.key === "ArrowLeft") setActiveIndex((i) => i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length) return product.images;
    return [product.image];
  }, [product]);

  // clamp activeIndex
  useEffect(() => {
    if (images.length === 0) return;
    setActiveIndex((i) => ((i % images.length) + images.length) % images.length);
  }, [images.length]);

  if (!open || !product) return null;

  const handleAdd = () => {
    addItem(product, quantity);
    showToast("Product added to cart successfully", [
      { label: "View Cart", onClick: () => (window.location.href = "/cart") },
    ]);
    onClose();
  };

  const prev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveIndex((i) => (i + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-[95vw] max-w-[1200px] max-h-[90vh] overflow-auto rounded-2xl bg-white shadow-2xl p-6 animate-quickview-fade"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex items-start justify-between">
          <div className="text-sm text-neutral-500">Quick view</div>
          <button type="button" onClick={onClose} className="text-neutral-600 hover:text-neutral-900">
            <X />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: image gallery */}
          <div className="flex flex-col gap-4">
            <div
              ref={zoom.containerRef}
              onMouseMove={zoom.handleMouseMove}
              onMouseEnter={zoom.handleMouseEnter}
              onMouseLeave={zoom.handleMouseLeave}
              onDoubleClick={zoom.handleDoubleClick}
              onTouchStart={zoom.handleTouchStart}
              onTouchMove={zoom.handleTouchMove}
              onTouchEnd={zoom.handleTouchEnd}
              className="relative w-full bg-neutral-50 rounded-lg overflow-hidden flex items-center justify-center"
              style={{ height: "420px", cursor: zoom.getCursorStyle() }}
            >
              <button
                type="button"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-2 shadow"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-700" />
              </button>

              <button
                type="button"
                onClick={() => router.push(`/products/${product.category}/${product.slug}`)}
                className="absolute inset-0 z-10"
                aria-label="View product details"
              />

              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={images[activeIndex]}
                  alt={product.name}
                  width={800}
                  height={600}
                  style={{
                    objectFit: "contain",
                    ...zoom.getTransformStyle(),
                  }}
                  className="w-full h-full"
                />
              </div>

              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/90 p-2 shadow"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-neutral-700" />
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto md:overflow-x-hidden">
              {images.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveIndex(idx);
                  }}
                  className={`flex-shrink-0 rounded overflow-hidden border ${idx === activeIndex ? "border-purple-600" : "border-neutral-200"}`}
                  style={{ width: 80, height: 60 }}
                  aria-label={`Thumbnail ${idx + 1}`}
                >
                  <Image src={src} alt={`${product.name} thumb ${idx + 1}`} width={80} height={60} className="object-contain w-full h-full bg-white" />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                router.push(`/products/${product.category}/${product.slug}`);
              }}
              className="w-full h-14 bg-purple-600 text-white font-semibold rounded-b-lg hover:bg-purple-700 transition-colors"
            >
              VIEW DETAILS
            </button>
          </div>

          {/* Right: details */}
          <div className="flex flex-col gap-4">
            <nav className="text-sm text-neutral-500">
              <span className="underline cursor-pointer">{product.categoryTitle ?? product.category}</span>
              <span className="mx-2">/</span>
              <span className="text-neutral-700">{product.subcategory ?? ""}</span>
            </nav>

            <button
              type="button"
              onClick={() => router.push(`/products/${product.category}/${product.slug}`)}
              className="text-left"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 hover:text-purple-700 transition-colors">{product.name}</h2>
            </button>
            <div className="text-purple-600 font-bold text-2xl">₹{Number(product.price).toFixed(2)}</div>

            <p className="text-neutral-600">{product.description}</p>

            {product.features && product.features.length ? (
              <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Product Highlights</h3>
                <ul className="list-disc list-inside text-neutral-700 space-y-1">
                  {product.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="flex items-center gap-4">
              <div className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-2 flex items-center gap-3">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="h-8 w-8 rounded-full bg-white text-lg font-bold">
                  -
                </button>
                <div className="min-w-[36px] text-center font-semibold">{quantity}</div>
                <button type="button" onClick={() => setQuantity((q) => q + 1)} className="h-8 w-8 rounded-full bg-white text-lg font-bold">
                  +
                </button>
              </div>

              <div className="flex-1">
                <button onClick={handleAdd} className="w-full rounded-full bg-purple-600 text-white px-4 py-3 font-semibold hover:bg-purple-700">
                  Add To Cart
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <span className="font-semibold text-neutral-800">Categories:</span>
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">{product.categoryTitle ?? product.category}</span>
                <span className="rounded-full border border-neutral-200 bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">{product.subcategory ?? ""}</span>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-purple-600 hover:text-purple-600">
                  <Share2 className="w-4 h-4" />
                </button>
                <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-purple-600 hover:text-purple-600">
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-purple-600 hover:text-purple-600">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes quickview-fade {
          from { opacity: 0; transform: translateY(6px) scale(0.995); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-quickview-fade { animation: quickview-fade 240ms ease both; }
      `}</style>
    </div>
  );
}
