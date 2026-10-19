"use client";

import { createContext, useContext, useRef, useState, type ReactNode } from "react";

type ToastAction = {
  label: string;
  onClick: () => void;
};

type Toast = {
  id: number;
  message: string;
  visible: boolean;
  actions?: ToastAction[];
};

type ToastContextType = {
  showToast: (message: string, actions?: ToastAction[]) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutRefs = useRef<Record<number, NodeJS.Timeout>>({});

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const ref = timeoutRefs.current[id];
    if (ref) {
      clearTimeout(ref);
      delete timeoutRefs.current[id];
    }
  };

  const showToast = (message: string, actions: ToastAction[] = []) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const toast: Toast = { id, message, visible: true, actions };
    setToasts((prev) => [toast, ...prev]);

    const timeout = setTimeout(() => {
      setToasts((prev) => prev.map((item) => (item.id === id ? { ...item, visible: false } : item)));
      const removeTimeout = setTimeout(() => removeToast(id), 300);
      timeoutRefs.current[id] = removeTimeout;
    }, 3000);

    timeoutRefs.current[id] = timeout;
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col items-end gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full max-w-sm overflow-hidden rounded-3xl border border-purple-200 bg-purple-600/95 p-4 shadow-2xl shadow-purple-900/10 text-white transition-all duration-300 ${
              toast.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Success</p>
                <p className="text-sm leading-6">{toast.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-sm font-semibold text-white/80 transition hover:text-white"
              >
                ×
              </button>
            </div>
            {toast.actions?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {toast.actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => {
                      action.onClick();
                      removeToast(toast.id);
                    }}
                    className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
