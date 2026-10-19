"use client";

import React from "react";
import { Type, Image as ImageIcon, Grid, Layers, LayoutTemplate, Settings2 } from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function EditorSidebar({ activeTab, setActiveTab }: SidebarProps) {
  const tabs = [
    { id: "text", label: "Text", icon: Type },
    { id: "uploads", label: "Uploads", icon: ImageIcon },
    { id: "graphics", label: "Graphics", icon: Grid },
    { id: "background", label: "Background", icon: Layers },
  ];

  return (
    <div className="w-[84px] h-full bg-white border-r border-neutral-200/60 flex flex-col py-6 gap-2 shrink-0 z-10">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-3.5 mx-2 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? "text-purple-700 bg-purple-50/70 shadow-sm font-semibold"
                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
            }`}
          >
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-700 rounded-r-md" />
            )}
            <Icon size={20} className={`transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
            <span className="text-[11px] mt-1.5 font-medium tracking-wide">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
