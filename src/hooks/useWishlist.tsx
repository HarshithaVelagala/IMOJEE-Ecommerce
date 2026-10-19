"use client";

import { useSyncExternalStore } from "react";

const KEY = "imojee-wishlist";
let currentItems: string[] = [];
const listeners = new Set<() => void>();
let initialized = false;

function loadWishlist() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      currentItems = parsed;
    }
  } catch {
    window.localStorage.removeItem(KEY);
  }
}

function saveWishlist(items: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function ensureInitialized() {
  if (initialized) return;
  initialized = true;
  loadWishlist();
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === KEY) {
        loadWishlist();
        notifyListeners();
      }
    });
  }
}

export function useWishlist() {
  ensureInitialized();

  const items = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => currentItems,
    () => currentItems
  );

  const toggle = (id: string) => {
    const hasItem = currentItems.includes(id);
    const nextItems = hasItem ? currentItems.filter((item) => item !== id) : [id, ...currentItems];
    currentItems = nextItems;
    saveWishlist(nextItems);
    notifyListeners();
    return !hasItem;
  };

  const has = (id: string) => items.includes(id);

  return { items, toggle, has } as const;
}
