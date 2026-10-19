"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const CART_STORAGE_KEY = "imojee-cart";

type Product = {
  id: string;
  name: string;
  price: string | number;
  description?: string;
  image?: string;
  designJson?: string;
  previewImage?: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => boolean;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

function parsePrice(price: string | number) {
  if (typeof price === "number") return price;
  const n = Number(String(price).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const isHydrated = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed: CartItem[] = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isHydrated.current) {
      isHydrated.current = true;
      return;
    }
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    
    // Automatically close the drawer if the cart becomes empty
    if (items.length === 0) {
      setCartOpen(false);
    }
  }, [items]);

  const addItem = (product: Product, quantity = 1) => {
    let addedNew = true;
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.product.id === product.id);
      if (idx >= 0) {
        addedNew = false;
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity };
        return copy;
      }
      return [...prev, { product, quantity }];
    });
    return addedNew;
  };

  const increase = (id: string) => {
    setItems((prev) => prev.map((it) => (it.product.id === id ? { ...it, quantity: it.quantity + 1 } : it)));
  };

  const decrease = (id: string) => {
    setItems((prev) =>
      prev
        .map((it) => (it.product.id === id ? { ...it, quantity: it.quantity - 1 } : it))
        .filter((it) => it.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.product.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    }
  };

  const total = items.reduce((sum, it) => sum + parsePrice(it.product.price) * it.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, increase, decrease, removeItem, clearCart, total, isCartOpen, setCartOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
