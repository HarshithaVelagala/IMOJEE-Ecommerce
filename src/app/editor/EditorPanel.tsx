/* eslint-disable react-hooks/purity */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLayer } from "./LayerContext";
import { TextLayer, ImageLayer } from "./LayerTypes";
import { Lock, Unlock, Eye, EyeOff, Plus, Search, ChevronDown, ChevronRight, LayoutTemplate } from "lucide-react";
import { Product } from "@/data/products";

interface PanelProps {
  activeTab: string;
  product?: Product;
  variantId?: string | null;
  customBgImage?: string | null;
  setCustomBgImage?: (img: string) => void;
  activeTemplateId?: string | null;
  setActiveTemplateId?: (id: string) => void;
}

export default function EditorPanel({ activeTab, product, variantId, customBgImage, setCustomBgImage, activeTemplateId, setActiveTemplateId }: PanelProps) {
  const { layers, updateLayer, selectLayer, selectedLayerId, deleteLayer, setLayers, setSelectedLayerId } = useLayer();

  // Graphics Panel state
  const [graphicsData, setGraphicsData] = useState<Record<string, string[]>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [viewAll, setViewAll] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedLayerId) {
      const el = document.getElementById(`panel-layer-${selectedLayerId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedLayerId, activeTab]);

  useEffect(() => {
    if (activeTab === "graphics") {
      fetch("/api/graphics")
        .then((res) => res.json())
        .then((data) => setGraphicsData(data))
        .catch((err) => console.error("Error loading graphics:", err));
    }
  }, [activeTab]);

  const handleAddGraphic = (svgPath: string) => {
    const filename = svgPath.split("/").pop()?.split(".")[0] || "graphic";
    const newLayer: ImageLayer = {
      id: `graphic_${filename}_${Date.now()}`,
      type: "image",
      src: svgPath,
      x: 300,
      y: 400,
      width: 100,
      height: 100,
      rotation: 0,
      visible: true,
      locked: false,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  const toggleCollapse = (cat: string) => {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleViewAll = (cat: string) => {
    setViewAll((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  if (activeTab === "text") {
    const textLayers = layers.filter((l) => l.type === "text") as TextLayer[];
    const selectedTextLayer = layers.find((l) => l.id === selectedLayerId && l.type === "text") as TextLayer | undefined;
    
    return (
      <div className="w-[300px] h-full bg-white border-r border-neutral-200/60 flex flex-col shadow-sm z-10 shrink-0">
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-neutral-800">Text</h2>
          <button 
            onClick={() => {
              const newLayer: TextLayer = {
                id: `text_${Date.now()}`,
                type: 'text',
                text: 'New Text',
                x: 300,
                y: 400,
                width: 200,
                height: 50,
                rotation: 0,
                visible: true,
                locked: false,
                fontSize: 32,
                fontFamily: 'Arial',
                fontWeight: 'normal',
                color: '#000000',
                textAlign: 'center',
                letterSpacing: 0,
                lineHeight: 1,
              };
              setLayers(prev => [...prev, newLayer]);
              setSelectedLayerId(newLayer.id);
            }}
            className="h-8 px-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
          >
            <Plus size={14} strokeWidth={2.5} /> Add
          </button>
        </div>
        <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-white">
          
          {selectedTextLayer ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Properties</label>
                <span className="text-[10px] font-mono bg-purple-50 text-purple-600 px-2 py-0.5 rounded border border-purple-100 truncate max-w-[100px]">{selectedTextLayer.id}</span>
              </div>
              
              {/* Text Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-600">Content</label>
                <textarea
                  value={selectedTextLayer.text}
                  onChange={(e) => updateLayer(selectedTextLayer.id, { text: e.target.value })}
                  className="w-full py-2 px-3 text-sm text-neutral-800 border border-neutral-200 rounded-xl outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 resize-none min-h-[80px]"
                />
              </div>

              {/* Font Family & Size */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-600">Font Family</label>
                  <select 
                    className="w-full appearance-none bg-white border border-neutral-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15 font-medium text-neutral-700 cursor-pointer"
                    value={selectedTextLayer.fontFamily}
                    onChange={(e) => updateLayer(selectedTextLayer.id, { fontFamily: e.target.value })}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">QT Basker</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-600">Size</label>
                  <input 
                    type="number"
                    value={selectedTextLayer.fontSize}
                    onChange={(e) => updateLayer(selectedTextLayer.id, { fontSize: Number(e.target.value) })}
                    className="w-full py-2 px-3 text-sm text-neutral-800 border border-neutral-200 rounded-xl outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15"
                  />
                </div>
              </div>

              {/* Style & Alignment */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-neutral-600">Style & Align</label>
                <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200 p-1 rounded-xl">
                  <button 
                    onClick={() => updateLayer(selectedTextLayer.id, { fontWeight: selectedTextLayer.fontWeight === "bold" ? "normal" : "bold" })}
                    className={`flex-1 p-1.5 rounded-lg flex justify-center transition-colors cursor-pointer ${selectedTextLayer.fontWeight === "bold" ? "bg-white shadow-sm border border-neutral-200 text-purple-600" : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>
                  </button>
                  <button 
                    onClick={() => updateLayer(selectedTextLayer.id, { fontStyle: selectedTextLayer.fontStyle === "italic" ? "normal" : "italic" })}
                    className={`flex-1 p-1.5 rounded-lg flex justify-center transition-colors cursor-pointer ${selectedTextLayer.fontStyle === "italic" ? "bg-white shadow-sm border border-neutral-200 text-purple-600" : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
                  </button>
                  <button 
                    onClick={() => updateLayer(selectedTextLayer.id, { textDecoration: selectedTextLayer.textDecoration === "underline" ? "none" : "underline" })}
                    className={`flex-1 p-1.5 rounded-lg flex justify-center transition-colors cursor-pointer ${selectedTextLayer.textDecoration === "underline" ? "bg-white shadow-sm border border-neutral-200 text-purple-600" : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
                  </button>
                  <div className="w-px h-5 bg-neutral-200 mx-1" />
                  <button 
                    onClick={() => updateLayer(selectedTextLayer.id, { textAlign: 'left' })}
                    className={`flex-1 p-1.5 rounded-lg flex justify-center transition-colors cursor-pointer ${selectedTextLayer.textAlign === "left" || !selectedTextLayer.textAlign ? "bg-white shadow-sm border border-neutral-200 text-purple-600" : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></svg>
                  </button>
                  <button 
                    onClick={() => updateLayer(selectedTextLayer.id, { textAlign: 'center' })}
                    className={`flex-1 p-1.5 rounded-lg flex justify-center transition-colors cursor-pointer ${selectedTextLayer.textAlign === "center" ? "bg-white shadow-sm border border-neutral-200 text-purple-600" : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="19" y1="12" x2="5" y2="12"/><line x1="17" y1="18" x2="7" y2="18"/></svg>
                  </button>
                  <button 
                    onClick={() => updateLayer(selectedTextLayer.id, { textAlign: 'right' })}
                    className={`flex-1 p-1.5 rounded-lg flex justify-center transition-colors cursor-pointer ${selectedTextLayer.textAlign === "right" ? "bg-white shadow-sm border border-neutral-200 text-purple-600" : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"}`}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></svg>
                  </button>
                </div>
              </div>

              {/* Spacing & Color */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-medium text-neutral-600">Color</label>
                  <input 
                    type="color"
                    value={selectedTextLayer.color}
                    onChange={(e) => updateLayer(selectedTextLayer.id, { color: e.target.value })}
                    className="w-full h-9 rounded-xl cursor-pointer border border-neutral-200 p-0.5 bg-white shadow-sm"
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-medium text-neutral-600 truncate" title="Letter Spacing">Spacing</label>
                  <input 
                    type="number"
                    value={selectedTextLayer.letterSpacing || 0}
                    onChange={(e) => updateLayer(selectedTextLayer.id, { letterSpacing: Number(e.target.value) })}
                    className="w-full py-2 px-2 text-sm text-center text-neutral-800 border border-neutral-200 rounded-xl outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15"
                  />
                </div>
                <div className="space-y-1.5 col-span-1">
                  <label className="text-xs font-medium text-neutral-600 truncate" title="Line Height">Height</label>
                  <input 
                    type="number"
                    step="0.1"
                    value={selectedTextLayer.lineHeight !== undefined ? selectedTextLayer.lineHeight : 1}
                    onChange={(e) => updateLayer(selectedTextLayer.id, { lineHeight: Number(e.target.value) })}
                    className="w-full py-2 px-2 text-sm text-center text-neutral-800 border border-neutral-200 rounded-xl outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/15"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex gap-2">
                <button
                  onClick={() => {
                    const newId = `text_${Date.now()}`;
                    const dupLayer: TextLayer = {
                      ...selectedTextLayer,
                      id: newId,
                      x: Math.min(600, selectedTextLayer.x + 20),
                      y: Math.min(800, selectedTextLayer.y + 20),
                    };
                    setLayers((prev) => [...prev, dupLayer]);
                    setSelectedLayerId(newId);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors border border-neutral-200 cursor-pointer"
                >
                  Duplicate
                </button>
                <button
                  onClick={() => deleteLayer(selectedTextLayer.id)}
                  className="flex-1 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100 cursor-pointer"
                >
                  Delete
                </button>
              </div>

            </div>
          ) : (
            <div className="text-center py-6 text-neutral-400 text-sm font-medium border-2 border-dashed border-neutral-100 rounded-xl flex flex-col items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              Select a text layer on the canvas to edit its properties.
            </div>
          )}

          {/* All Text Layers List */}
          <div className="pt-6 border-t border-neutral-100 mt-6">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">All Text Layers</label>
            <div className="space-y-2">
              {textLayers.map((layer) => (
                <div 
                  id={`panel-layer-${layer.id}`}
                  key={layer.id} 
                  className={`flex items-center justify-between p-2.5 border rounded-lg transition-all duration-200 cursor-pointer ${
                    selectedLayerId === layer.id 
                      ? 'border-purple-600 bg-purple-50/20 shadow-sm ring-1 ring-purple-600/15' 
                      : 'border-neutral-200 hover:border-purple-200 bg-white hover:bg-neutral-50/50'
                  }`}
                  onClick={() => !layer.locked && selectLayer(layer.id)}
                >
                  <span className="text-sm font-medium text-neutral-700 truncate flex-1 mr-3">
                    {layer.text || "Empty text"}
                  </span>
                  <div className="flex gap-2 text-neutral-400 shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { visible: !layer.visible }); }}
                      className="hover:text-neutral-700 transition-colors p-1 cursor-pointer"
                    >
                      {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); updateLayer(layer.id, { locked: !layer.locked }); }}
                      className="hover:text-neutral-700 transition-colors p-1 cursor-pointer"
                    >
                      {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                    </button>
                  </div>
                </div>
              ))}
              {textLayers.length === 0 && (
                <div className="text-xs text-neutral-400 text-center py-2">No text layers found.</div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    );
  }

  if (activeTab === "uploads") {
    const logoLayer = layers.find((l) => l.id === "logo" && l.type === "image") as ImageLayer | undefined;
    const isCustomLogo = logoLayer && logoLayer.src !== "";
    
    const uploadedImages = layers.filter((l) => l.type === "image" && l.id !== "logo") as ImageLayer[];

    const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const objectURL = URL.createObjectURL(file);
      if (logoLayer) {
        updateLayer(logoLayer.id, { src: objectURL });
        selectLayer(logoLayer.id);
      }
    };

    const handleLogoDelete = () => {
      if (logoLayer) {
        updateLayer(logoLayer.id, { src: "" });
      }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const objectURL = URL.createObjectURL(file);
      
      const img = new window.Image();
      img.onload = () => {
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const initialWidth = 150;
        const initialHeight = Math.round(initialWidth * aspectRatio);

        const newLayer: ImageLayer = {
          id: `image_${Date.now()}`,
          type: "image",
          src: objectURL,
          x: 300,
          y: 400,
          width: initialWidth,
          height: initialHeight,
          rotation: 0,
          visible: true,
          locked: false,
        };

        setLayers((prev) => [...prev, newLayer]);
        setSelectedLayerId(newLayer.id);
      };
      img.src = objectURL;
    };

    return (
      <div className="w-[300px] h-full bg-white border-r border-neutral-200/60 flex flex-col shadow-sm z-10 shrink-0">
        <div className="p-5 border-b border-neutral-100">
          <h2 className="text-xl font-bold text-neutral-800">Uploads</h2>
        </div>
        <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-white">
          {/* Logo Upload Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Logo Brand Asset</label>
            <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/30 space-y-3">
              <div className="h-20 bg-neutral-50 border border-neutral-100 rounded-lg flex items-center justify-center p-2 relative group overflow-hidden">
                {logoLayer && (
                  <img
                    src={logoLayer.src}
                    alt="Logo preview"
                    className="max-h-full max-w-full object-contain"
                  />
                )}
                {isCustomLogo && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={handleLogoDelete}
                      className="bg-red-500 text-white px-2 py-1 rounded text-[10px] font-bold hover:bg-red-600 transition-colors shadow cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.svg"
                    onChange={handleLogoFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full text-center py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 rounded-xl transition-colors border border-neutral-200 cursor-pointer">
                    {isCustomLogo ? "Replace Logo" : "Upload Logo"}
                  </button>
                </div>
                {logoLayer && (
                  <button
                    onClick={() => selectLayer(logoLayer.id)}
                    className="py-2 px-3 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 rounded-xl transition-colors border border-neutral-200 cursor-pointer"
                  >
                    Select
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Customer Image Upload Section */}
          <div className="space-y-4 pt-5 border-t border-neutral-100">
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Product Images</label>
            
            <div className="border-2 border-dashed border-neutral-200 rounded-xl p-5 text-center hover:border-purple-600 hover:bg-purple-50/10 transition-all relative flex flex-col items-center justify-center bg-neutral-50/30 group cursor-pointer">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.webp"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-neutral-400 mb-2 group-hover:text-purple-600 transition-colors">
                <svg className="w-8 h-8 mx-auto stroke-current" fill="none" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 00.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="text-xs font-bold text-neutral-700">Upload Image</p>
              <p className="text-[9px] text-neutral-400 mt-1 font-medium">Supports PNG, JPG, JPEG, WEBP</p>
            </div>

            {/* Uploaded Images List */}
            {uploadedImages.length > 0 && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map((imgLayer) => {
                    const isSelected = selectedLayerId === imgLayer.id;
                    return (
                      <div 
                        id={`panel-layer-${imgLayer.id}`}
                        key={imgLayer.id}
                        onClick={() => selectLayer(imgLayer.id)}
                        className={`group relative aspect-square bg-neutral-50 border rounded-xl overflow-hidden p-1.5 flex items-center justify-center cursor-pointer transition-all ${
                          isSelected ? "border-purple-600 ring-2 ring-purple-600/15" : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <img src={imgLayer.src} alt="Uploaded thumbnail" className="max-h-full max-w-full object-contain rounded-lg" />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newId = `image_${Date.now()}`;
                              const dupLayer: ImageLayer = {
                                ...imgLayer,
                                id: newId,
                                x: Math.min(600, imgLayer.x + 20),
                                y: Math.min(800, imgLayer.y + 20),
                              };
                              setLayers((prev) => [...prev, dupLayer]);
                              setSelectedLayerId(newId);
                            }}
                            className="bg-white text-gray-700 p-1.5 rounded hover:bg-gray-100 transition-colors shadow cursor-pointer"
                            title="Duplicate"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLayer(imgLayer.id);
                            }}
                            className="bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors shadow cursor-pointer"
                            title="Delete"
                          >
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Selected Image Actions */}
            {selectedLayerId && selectedLayerId !== "logo" && (
              (() => {
                const selectedImgLayer = layers.find(l => l.id === selectedLayerId && l.type === "image") as ImageLayer | undefined;
                if (!selectedImgLayer) return null;

                const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const objectURL = URL.createObjectURL(file);
                  
                  const img = new window.Image();
                  img.onload = () => {
                    const aspectRatio = img.naturalHeight / img.naturalWidth;
                    const newHeight = Math.round(selectedImgLayer.width * aspectRatio);
                    updateLayer(selectedImgLayer.id, { 
                      src: objectURL,
                      height: newHeight
                    });
                  };
                  img.src = objectURL;
                };

                return (
                  <div className="border border-purple-100 rounded-xl p-3 bg-purple-50/20 shadow-sm space-y-3 mt-4">
                    <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Selected Image Controls</div>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.webp"
                          onChange={handleReplaceFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button className="w-full text-center py-2 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 rounded-xl transition-colors border border-neutral-200 cursor-pointer">
                          Replace
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          const newId = `image_${Date.now()}`;
                          const dupLayer: ImageLayer = {
                            ...selectedImgLayer,
                            id: newId,
                            x: Math.min(600, selectedImgLayer.x + 20),
                            y: Math.min(800, selectedImgLayer.y + 20),
                          };
                          setLayers((prev) => [...prev, dupLayer]);
                          setSelectedLayerId(newId);
                        }}
                        className="py-2 px-3 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-50 rounded-xl transition-colors border border-neutral-200 cursor-pointer"
                      >
                        Duplicate
                      </button>
                      <button
                        onClick={() => deleteLayer(selectedImgLayer.id)}
                        className="py-2 px-3 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === "graphics") {
    return (
      <div className="w-[300px] h-full bg-white border-r border-neutral-200/60 flex flex-col shadow-sm z-10 shrink-0">
        <div className="p-5 border-b border-neutral-100 space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Graphics</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="Search graphics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-sm text-neutral-900 bg-neutral-50/50 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 focus:bg-white transition-all"
            />
          </div>
        </div>
        
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-white">
          {Object.entries(graphicsData).map(([category, items]) => {
            const filteredItems = items.filter((item) => {
              const name = item.split("/").pop()?.split(".")[0] || "";
              return name.toLowerCase().includes(searchQuery.toLowerCase());
            });

            if (filteredItems.length === 0) return null;

            const isCollapsed = collapsed[category];
            const isViewingAll = viewAll[category] || searchQuery !== "";
            const itemsToShow = isViewingAll ? filteredItems : filteredItems.slice(0, 6);
            const hasMore = filteredItems.length > 6 && !isViewingAll;

            return (
              <div key={category} className="border border-neutral-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => toggleCollapse(category)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-neutral-50/50 hover:bg-neutral-50 border-b border-neutral-100 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-neutral-700 uppercase tracking-wider capitalize">
                    {category}
                  </span>
                  {isCollapsed ? <ChevronRight size={16} className="text-neutral-500" /> : <ChevronDown size={16} className="text-neutral-500" />}
                </button>

                {!isCollapsed && (
                  <div className="p-4 bg-white space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      {itemsToShow.map((item) => {
                        const name = item.split("/").pop()?.split(".")[0] || "graphic";
                        return (
                          <div
                            key={item}
                            onClick={() => handleAddGraphic(item)}
                            className="group aspect-square bg-neutral-50/40 border border-neutral-100 hover:border-purple-200 hover:bg-purple-50/10 rounded-xl flex items-center justify-center p-2.5 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                            title={`Add ${name}`}
                          >
                            <img
                              src={item}
                              alt={name}
                              className="max-h-full max-w-full object-contain pointer-events-none select-none text-purple-600 transition-transform duration-200 group-hover:scale-110"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {searchQuery === "" && (hasMore || viewAll[category]) && (
                      <button
                        onClick={() => toggleViewAll(category)}
                        className="w-full text-center text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors py-1 cursor-pointer"
                      >
                        {isViewingAll ? "Show Less" : `View All (${filteredItems.length})`}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {Object.keys(graphicsData).length > 0 && 
            Object.values(graphicsData).every(items => 
              items.filter(item => item.split("/").pop()?.split(".")[0]?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0
            ) && (
              <div className="text-center py-8 text-neutral-400 text-sm font-medium">
                No graphics match your search.
              </div>
            )
          }
        </div>
      </div>
    );
  }


  return (
    <div className="w-[300px] h-full bg-white border-r border-neutral-200/60 flex flex-col shadow-sm z-10 shrink-0">
      <div className="p-5 border-b border-neutral-100">
        <h2 className="text-xl font-bold text-neutral-800 capitalize">{activeTab}</h2>
      </div>
      <div className="p-5 text-neutral-400 text-sm font-medium">
        {activeTab} options coming soon.
      </div>
    </div>
  );
}
