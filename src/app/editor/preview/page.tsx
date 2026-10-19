"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ShoppingCart, Info, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function PreviewPage() {
  const router = useRouter();
  const { addItem, setCartOpen } = useCart();
  const [designData, setDesignData] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const stored = localStorage.getItem("imojee_preview_design");
    if (stored) {
      try {
        setDesignData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse design data", e);
      }
    }
  }, []);

  if (!designData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 text-center text-gray-500 font-sans">
        <div className="space-y-4">
          <p>No preview design found. Please create a design first.</p>
          <Link href="/" className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const basePrice = Number(designData.productPrice);
  const totalPrice = basePrice * quantity;

  const handleBackToEditor = () => {
    localStorage.setItem(`imojee_edit_design_${designData.productId}`, JSON.stringify(designData.layers));
    router.push(`/editor?productId=${designData.productId}`);
  };

  const handleAddToCart = () => {
    // Generate a unique product ID for this specific design customization
    const customProductId = `${designData.productId}_custom_${Date.now()}`;
    
    const cartProduct = {
      id: customProductId,
      name: `${designData.productName} (Customized)`,
      price: basePrice,
      description: `Customized with ${designData.layers.length} design layers.`,
      image: designData.previewImage, // Set main cart item image to the customized preview image
      designJson: JSON.stringify(designData.layers),
      previewImage: designData.previewImage,
    };

    addItem(cartProduct, quantity);
    
    // Clear preview key
    localStorage.removeItem("imojee_preview_design");
    
    // Open the Right-Side Cart Drawer instead of redirecting directly to /cart
    setCartOpen(true);
  };

  // Summarize layers
  const textLayersCount = designData.layers.filter((l: any) => l.type === "text").length;
  const imageLayersCount = designData.layers.filter((l: any) => l.type === "image" && l.id !== "logo").length;
  const hasCustomLogo = designData.layers.some((l: any) => l.id === "logo" && l.src !== "/logo.png" && !l.src.endsWith("/logo.png"));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-16">
      {/* Top Header - Removed sticky top-0 and z-30 to keep it in normal page flow */}
      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
        <button
          onClick={handleBackToEditor}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} />
          Back to Editor
        </button>
        <h1 className="font-bold text-gray-800 text-lg">Approve Design Preview</h1>
        <div className="w-20" />
      </header>

      {/* Grid container - added items-start to align left and right cards at the top */}
      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side Preview Image */}
        <div className="md:col-span-7 flex flex-col items-center">
          {/* Removed aspect-[3/4] and overflow-hidden to prevent image cropping and keep natural layout size */}
          <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-md p-6 md:p-10 flex items-center justify-center relative">
            <img
              src={designData.previewImage}
              alt="Design Preview"
              className="max-w-full h-auto object-contain rounded shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
            />
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-green-600 bg-green-50 border border-green-200/50 px-3 py-1.5 rounded-full select-none">
            <CheckCircle2 size={14} />
            High-Quality Print Ready Preview
          </div>
        </div>

        {/* Right Side Order Details */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200/80 shadow-md p-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-2.5 py-1 rounded-md">Print Specs Approved</span>
              <h2 className="text-2xl font-extrabold text-gray-800 mt-3">{designData.productName}</h2>
              <p className="text-sm text-gray-500 mt-1">{designData.description || "Premium print personalization."}</p>
            </div>

            <hr className="border-gray-100" />

            {/* Design Summary Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Design Summary</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                  <div className="text-gray-400 text-xs font-medium">Text Elements</div>
                  <div className="text-gray-700 font-bold text-lg mt-0.5">{textLayersCount}</div>
                </div>
                <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100">
                  <div className="text-gray-400 text-xs font-medium">Custom Images</div>
                  <div className="text-gray-700 font-bold text-lg mt-0.5">{imageLayersCount}</div>
                </div>
                <div className="bg-gray-50/50 rounded-lg p-3 border border-gray-100 col-span-2">
                  <div className="text-gray-400 text-xs font-medium">Brand Logo</div>
                  <div className="text-gray-700 font-bold text-sm mt-0.5 flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${hasCustomLogo ? "bg-green-500" : "bg-yellow-500"}`} />
                    {hasCustomLogo ? "Custom Brand Asset Uploaded" : "Default Template Logo Asset"}
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Quantity</label>
                <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-gray-700">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-1.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pricing</div>
                <div className="text-2xl font-black text-purple-600">₹{totalPrice.toFixed(2)}</div>
                <div className="text-[10px] text-gray-400 font-semibold mt-0.5">₹{basePrice.toFixed(2)} per unit</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleBackToEditor}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
              >
                Edit Design
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-gray-400 bg-gray-50 border border-gray-200/50 rounded-xl p-4 select-none">
            <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              By adding this item to the cart, you certify that you have reviewed the alignment, spelling, and placement of all elements and that the print preview meets your expectations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
