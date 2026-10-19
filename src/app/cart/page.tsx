"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

function formatPrice(n: number) {
  return `₹${n.toFixed(2)}`;
}

export default function CartPage() {
  const { items, increase, decrease, removeItem, total } = useCart();
  const router = useRouter();

  const handleEditDesign = (it: any) => {
    const baseProductId = it.product.id.split("_custom_")[0];
    localStorage.setItem(`imojee_edit_design_${baseProductId}`, it.product.designJson || "");
    removeItem(it.product.id);
    router.push(`/editor?productId=${baseProductId}`);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-neutral-600">Browse products and add items to your cart.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.product.id} className="flex items-center gap-4 p-4 rounded-lg border bg-white shadow-sm">
            <div className="w-24 h-24 relative bg-neutral-50 rounded overflow-hidden flex items-center justify-center p-1 border border-gray-100/50 shrink-0">
              {it.product.image && (
                <img src={it.product.image} alt={it.product.name} className="max-h-full max-w-full object-contain" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">{it.product.name}</h3>
                <div className="text-sm font-bold text-gray-900">{formatPrice(Number(String(it.product.price).replace(/[^0-9.]/g, "")) * it.quantity)}</div>
              </div>
              <p className="text-sm text-neutral-500 mt-0.5">{it.product.description}</p>

              <div className="flex items-center gap-2 mt-3">
                <button onClick={() => decrease(it.product.id)} className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors">-</button>
                <div className="px-3 font-semibold text-gray-700">{it.quantity}</div>
                <button onClick={() => increase(it.product.id)} className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 rounded transition-colors">+</button>

                <button onClick={() => removeItem(it.product.id)} className="ml-4 text-sm text-red-600 hover:text-red-700 font-semibold cursor-pointer">Remove</button>
                
                {it.product.designJson && (
                  <button 
                    onClick={() => handleEditDesign(it)} 
                    className="ml-4 text-sm text-purple-600 hover:text-purple-700 font-semibold cursor-pointer border-l border-gray-200 pl-4"
                  >
                    Edit Design
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end">
        <div className="text-xl font-semibold mr-4">Total: {formatPrice(total)}</div>
        <CheckoutButton total={total} />
      </div>
    </div>
  );
}

function CheckoutButton({ total }: { total: number }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100), receipt: `rcpt_${Date.now()}` }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage("Failed to create order: " + JSON.stringify(data));
        setLoading(false);
        return;
      }

      const ok = await loadRazorpay();
      if (!ok) {
        setMessage("Failed to load Razorpay checkout script");
        setLoading(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Imojee",
        description: "Order Payment",
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
              setMessage("Payment successful");
            } else {
              setMessage("Payment verification failed");
            }
          } catch (err) {
            setMessage("Verification error: " + String(err));
          }
        },
        modal: {
          ondismiss: function () {
            setMessage("Payment cancelled");
            setLoading(false);
          },
        },
        theme: { color: "#7c3aed" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setLoading(false);
    } catch (err) {
      setMessage("Checkout error: " + String(err));
      setLoading(false);
    }
  };

  return (
    <div className="ml-4 flex items-center gap-4">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="px-6 py-2 bg-purple-600 text-white rounded"
      >
        {loading ? "Processing..." : "Checkout"}
      </button>
      {message && <div className="text-sm text-neutral-600">{message}</div>}
    </div>
  );
}
