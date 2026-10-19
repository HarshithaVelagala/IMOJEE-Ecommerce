"use client";

import { useSyncExternalStore } from "react";

const KEY = "imojee-compare";
const MAX_COMPARE_ITEMS = 4;
let currentItems: string[] = [];
const listeners = new Set<() => void>();
let initialized = false;

function loadCompare() {
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

function saveCompare(items: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function ensureInitialized() {
  if (initialized) return;
  initialized = true;
  loadCompare();
  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key === KEY) {
        loadCompare();
        notifyListeners();
      }
    });
  }
}

export function useCompare() {
  ensureInitialized();

  const items = useSyncExternalStore(
    (callback) => {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    () => currentItems,
    () => currentItems
  );

  const add = (id: string) => {
    if (currentItems.includes(id) || currentItems.length >= MAX_COMPARE_ITEMS) {
      return false;
    }
    currentItems = [id, ...currentItems];
    saveCompare(currentItems);
    notifyListeners();
    return true;
  };

  const remove = (id: string) => {
    const nextItems = currentItems.filter((item) => item !== id);
    if (nextItems.length === currentItems.length) return;
    currentItems = nextItems;
    saveCompare(currentItems);
    notifyListeners();
  };

  const has = (id: string) => items.includes(id);

  return { items, add, remove, has } as const;
}
