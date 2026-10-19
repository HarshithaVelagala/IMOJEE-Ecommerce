"use client";

import React from "react";
import { useLayer } from "./LayerContext";
import { TextLayer } from "./LayerTypes";
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, Trash2, 
  Eye, EyeOff, Underline, Undo, Redo, Copy, Lock, Unlock
} from "lucide-react";

export default function Toolbar() {
  const { layers, selectedLayerId, updateLayer, deleteLayer, duplicateLayer, undo, redo, canUndo, canRedo } = useLayer();

  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  // Reusable Undo/Redo component markup
  const renderHistoryButtons = () => (
    <div className="flex items-center gap-1 border-r border-neutral-150 pr-4">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`p-1.5 rounded-lg transition-all ${
          canUndo ? "text-neutral-700 hover:bg-neutral-50 cursor-pointer active:scale-95" : "text-neutral-300 pointer-events-none"
        }`}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={15} strokeWidth={2.5} />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`p-1.5 rounded-lg transition-all ${
          canRedo ? "text-neutral-700 hover:bg-neutral-50 cursor-pointer active:scale-95" : "text-neutral-300 pointer-events-none"
        }`}
        title="Redo (Ctrl+Y / Ctrl+Shift+Z)"
      >
        <Redo size={15} strokeWidth={2.5} />
      </button>
    </div>
  );

  if (!selectedLayer) {
    return (
      <div className="h-16 w-full bg-white flex flex-row items-center px-6 shadow-sm z-20 sticky top-0 border-b border-neutral-200/60 gap-4">
        {renderHistoryButtons()}
        <div className="flex items-center gap-2 text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse shrink-0" />
          <span className="text-sm font-medium tracking-wide">Select a layer to edit</span>
        </div>
      </div>
    );
  }

  // Handle generic Image & Logo layers
  if (selectedLayer.type === "image") {
    const isLogo = selectedLayer.id === "logo";
    return (
      <div className="h-16 w-full bg-white flex flex-row items-center px-6 shadow-sm z-20 sticky top-0 border-b border-neutral-200/60 gap-4">
        {renderHistoryButtons()}
        <span className="text-neutral-800 text-sm font-semibold tracking-wide select-none">{isLogo ? "Logo Asset" : "Image Layer"}</span>
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-1 border-l border-neutral-250 pl-4">
          <button 
            onClick={() => duplicateLayer(selectedLayer.id)}
            disabled={isLogo}
            className={`p-1.5 rounded-lg transition-colors ${isLogo ? "text-neutral-300 pointer-events-none" : "text-neutral-600 hover:bg-neutral-50 cursor-pointer"}`}
            title={isLogo ? "Logo Duplication Disabled" : "Duplicate (Ctrl+D)"}
          >
            <Copy size={17} />
          </button>
          
          <button 
            onClick={() => updateLayer(selectedLayer.id, { visible: !selectedLayer.visible })}
            className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
            title={selectedLayer.visible ? "Hide" : "Show"}
          >
            {selectedLayer.visible ? <Eye size={17} /> : <EyeOff size={17} />}
          </button>
          
          <button 
            onClick={() => updateLayer(selectedLayer.id, { locked: !selectedLayer.locked })}
            className={`p-1.5 rounded-lg transition-colors ${selectedLayer.locked ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 cursor-pointer"}`}
            title={selectedLayer.locked ? "Unlock" : "Lock"}
          >
            {selectedLayer.locked ? <Lock size={17} /> : <Unlock size={17} />}
          </button>
          
          <button 
            onClick={() => deleteLayer(selectedLayer.id)}
            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors ml-2 cursor-pointer"
            title="Delete"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    );
  }

  const textLayer = selectedLayer as TextLayer;

  return (
    <div className="h-16 w-full bg-white flex flex-row items-center px-6 shadow-sm z-20 sticky top-0 border-b border-neutral-200/60 gap-4">
      {renderHistoryButtons()}
      
      {/* Font Family */}
      <div className="relative">
        <select 
          className="appearance-none bg-neutral-50/50 border border-neutral-200 rounded-xl py-2 pl-3 pr-9 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 font-medium text-neutral-700 transition-all cursor-pointer"
          value={textLayer.fontFamily}
          onChange={(e) => updateLayer(textLayer.id, { fontFamily: e.target.value })}
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">QT Basker</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Courier New">Courier New</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-neutral-500">
          <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>

      {/* Font Size */}
      <div className="relative flex items-center border border-neutral-200 rounded-xl bg-neutral-50/50">
        <input 
          type="number"
          value={textLayer.fontSize}
          onChange={(e) => updateLayer(textLayer.id, { fontSize: Number(e.target.value) })}
          className="w-14 text-center py-2 text-sm outline-none font-medium text-neutral-700 bg-transparent focus:bg-white focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 rounded-xl transition-all"
        />
      </div>

      {/* Color */}
      <div className="flex items-center gap-2 border-l border-neutral-200 pl-4">
        <input 
          type="color"
          value={textLayer.color}
          onChange={(e) => updateLayer(textLayer.id, { color: e.target.value })}
          className="w-8 h-8 rounded-xl cursor-pointer border border-neutral-200 p-0.5 bg-white shadow-sm"
        />
      </div>

      {/* Formatting */}
      <div className="flex items-center gap-1 border-l border-neutral-200 pl-4">
        <button 
          onClick={() => updateLayer(textLayer.id, { fontWeight: textLayer.fontWeight === "bold" ? "normal" : "bold" })}
          className={`p-1.5 rounded-lg transition-colors ${textLayer.fontWeight === "bold" ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 cursor-pointer"}`}
        >
          <Bold size={17} />
        </button>
        <button 
          onClick={() => updateLayer(textLayer.id, { fontStyle: textLayer.fontStyle === "italic" ? "normal" : "italic" })}
          className={`p-1.5 rounded-lg transition-colors ${textLayer.fontStyle === "italic" ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 cursor-pointer"}`}
        >
          <Italic size={17} />
        </button>
        <button 
          onClick={() => updateLayer(textLayer.id, { textDecoration: textLayer.textDecoration === "underline" ? "none" : "underline" })}
          className={`p-1.5 rounded-lg transition-colors ${textLayer.textDecoration === "underline" ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 cursor-pointer"}`}
        >
          <Underline size={17} />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 border-l border-neutral-200 pl-4">
        <button 
          onClick={() => updateLayer(textLayer.id, { textAlign: 'left' })}
          className={`p-1.5 rounded-lg transition-colors ${textLayer.textAlign === "left" || !textLayer.textAlign ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 cursor-pointer"}`}
        >
          <AlignLeft size={17} />
        </button>
        <button 
          onClick={() => updateLayer(textLayer.id, { textAlign: 'center' })}
          className={`p-1.5 rounded-lg transition-colors ${textLayer.textAlign === "center" ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 cursor-pointer"}`}
        >
          <AlignCenter size={17} />
        </button>
        <button 
          onClick={() => updateLayer(textLayer.id, { textAlign: 'right' })}
          className={`p-1.5 rounded-lg transition-colors ${textLayer.textAlign === "right" ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 cursor-pointer"}`}
        >
          <AlignRight size={17} />
        </button>
      </div>

      <div className="flex-1" />

      {/* Common Actions */}
      <div className="flex items-center gap-1 border-l border-neutral-200 pl-4">
        <button 
          onClick={() => duplicateLayer(textLayer.id)}
          className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
          title="Duplicate (Ctrl+D)"
        >
          <Copy size={17} />
        </button>
        <button 
          onClick={() => updateLayer(textLayer.id, { visible: !textLayer.visible })}
          className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors cursor-pointer"
          title={textLayer.visible ? "Hide" : "Show"}
        >
          {textLayer.visible ? <Eye size={17} /> : <EyeOff size={17} />}
        </button>
        <button 
          onClick={() => updateLayer(textLayer.id, { locked: !textLayer.locked })}
          className={`p-1.5 rounded-lg transition-colors ${textLayer.locked ? "bg-neutral-100 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 cursor-pointer"}`}
          title={textLayer.locked ? "Unlock" : "Lock"}
        >
          {textLayer.locked ? <Lock size={17} /> : <Unlock size={17} />}
        </button>
        <button 
          onClick={() => deleteLayer(textLayer.id)}
          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors ml-2 cursor-pointer"
          title="Delete"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
}
