"use client";

import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

interface BookletSpecificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (specs: { pages: number; lamination: string; thickness: string }) => void;
  variantName: string;
}

export default function BookletSpecificationsModal({
  isOpen,
  onClose,
  onContinue,
  variantName,
}: BookletSpecificationsModalProps) {
  const [pages, setPages] = useState<number | "">("");
  const [lamination, setLamination] = useState("Glossy");
  const [thickness, setThickness] = useState("Premium 210 GSM");

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setPages(40);
      setLamination("Glossy");
      setThickness("Premium 210 GSM");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isValid = 
    typeof pages === "number" && 
    pages >= 40 && 
    pages <= 400 && 
    lamination !== "" && 
    thickness !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white">
          <h3 className="text-xl font-bold text-neutral-900">Booklet Specifications</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-900 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Size</label>
            <div className="w-full py-3 px-4 text-sm font-semibold text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-xl cursor-not-allowed">
              {variantName}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Page Count (Including Cover)
            </label>
            <input 
              type="number"
              min={40}
              max={400}
              value={pages}
              onChange={(e) => {
                const val = e.target.value;
                setPages(val === "" ? "" : parseInt(val, 10));
              }}
              className="w-full py-3 px-4 text-sm font-medium text-neutral-900 bg-white border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all"
              placeholder="40 - 400"
            />
            {typeof pages === "number" && (pages < 40 || pages > 400) && (
              <p className="text-xs text-red-500 mt-1">Page count must be between 40 and 400.</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Cover Lamination
            </label>
            <div className="relative">
              <select 
                value={lamination}
                onChange={(e) => setLamination(e.target.value)}
                className="w-full appearance-none bg-white border border-neutral-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium text-neutral-900 cursor-pointer transition-all"
              >
                <option value="Glossy">Glossy</option>
                <option value="Matte">Matte</option>
                <option value="Velvet">Velvet</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
              Cover Thickness
            </label>
            <div className="relative">
              <select 
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="w-full appearance-none bg-white border border-neutral-200 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent font-medium text-neutral-900 cursor-pointer transition-all"
              >
                <option value="Premium 210 GSM">Premium 210 GSM</option>
                <option value="Premium Plus 210 GSM Laminated">Premium Plus 210 GSM Laminated</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" size={18} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end">
          <button
            onClick={() => {
              if (isValid) {
                onContinue({ pages: pages as number, lamination, thickness });
              }
            }}
            disabled={!isValid}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
              isValid 
                ? "bg-purple-600 text-white hover:bg-purple-700 hover:-translate-y-0.5" 
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
