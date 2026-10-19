"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

function formatPrice(n: number) {
  return `₹${n.toFixed(2)}`;
}

export default function CartDrawer() {
  const { items, increase, decrease, removeItem, total, isCartOpen, setCartOpen } = useCart();
  const router = useRouter();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
      }
    };
    if (isCartOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setCartOpen]);

  // Load Razorpay Script
  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutMessage(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100), receipt: `rcpt_${Date.now()}` }),
      });

      const data = await res.json();
      if (!res.ok) {
        setCheckoutMessage("Failed: " + JSON.stringify(data));
        setCheckoutLoading(false);
        return;
      }

      const ok = await loadRazorpay();
      if (!ok) {
        setCheckoutMessage("Razorpay load error");
        setCheckoutLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Imojee",
        description: "Custom Print Order Payment",
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const verifyJson = await verifyRes.json();
            if (verifyJson.verified) {
              setCheckoutMessage("Payment Successful");
            } else {
              setCheckoutMessage("Verification Failed");
            }
          } catch (err) {
            setCheckoutMessage("Verification Error: " + String(err));
          }
        },
        modal: {
          ondismiss: function () {
            setCheckoutMessage("Payment Cancelled");
            setCheckoutLoading(false);
          },
        },
        theme: { color: "#7c3aed" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setCheckoutLoading(false);
    } catch (err) {
      setCheckoutMessage("Error: " + String(err));
      setCheckoutLoading(false);
    }
  };

  const handleViewCart = () => {
    setCartOpen(false);
    router.push("/cart");
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 pointer-events-auto ${
          isCartOpen ? "opacity-100 visible" : "opacity-0 invisible delay-75 pointer-events-none"
        }`}
        onClick={() => setCartOpen(false)}
      />

      {/* Slide-out Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[51] shadow-2xl flex flex-col transition-transform duration-300 ease-out transform pointer-events-auto ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-purple-600" />
            <h2 className="text-lg font-bold text-gray-800">Shopping Cart</h2>
            <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-bold">
              {items.length}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-semibold"
          >
            <X size={18} />
            <span>Close</span>
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-2">
              <ShoppingBag size={48} className="stroke-[1.5]" />
              <p className="text-sm font-medium">Your cart is empty</p>
            </div>
          ) : (
            items.map((it) => {
              const itemPrice = Number(String(it.product.price).replace(/[^0-9.]/g, ""));
              return (
                <div key={it.product.id} className="flex gap-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200/50 overflow-hidden flex items-center justify-center p-1 shrink-0">
                    {it.product.image && (
                      <img
                        src={it.product.image}
                        alt={it.product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-semibold text-gray-800 truncate" title={it.product.name}>
                        {it.product.name}
                      </h4>
                      <button
                        onClick={() => removeItem(it.product.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer shrink-0"
                        title="Remove Item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      {/* Quantity selectors */}
                      <div className="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white">
                        <button
                          onClick={() => decrease(it.product.id)}
                          className="px-2 py-0.5 text-gray-400 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer font-bold text-xs"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-700 select-none">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => increase(it.product.id)}
                          className="px-2 py-0.5 text-gray-400 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer font-bold text-xs"
                        >
                          +
                        </button>
                      </div>

                      {/* Price display */}
                      <div className="text-right">
                        <div className="text-xs font-bold text-gray-800">
                          {formatPrice(itemPrice * it.quantity)}
                        </div>
                        <div className="text-[10px] text-gray-400 font-medium">
                          {formatPrice(itemPrice)} / unit
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-gray-100 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Subtotal</span>
            <span className="text-xl font-black text-purple-600">{formatPrice(total)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleViewCart}
              className="py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl text-sm transition-colors cursor-pointer text-center"
            >
              View Cart
            </button>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading || items.length === 0}
              className="py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-[0.98] cursor-pointer"
            >
              {checkoutLoading ? "Processing..." : "Checkout"}
            </button>
          </div>
          
          {checkoutMessage && (
            <p className="text-xs text-center text-red-500 font-medium mt-1">{checkoutMessage}</p>
          )}
        </div>
      </div>
    </>
  );
}
