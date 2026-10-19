/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProductById, Product } from "@/data/products";
import { LayerProvider, useLayer } from "./LayerContext";
import { Layer } from "./LayerTypes";
import EditorCanvas from "./EditorCanvas";
import EditorSidebar from "./EditorSidebar";
import EditorPanel from "./EditorPanel";
import Toolbar from "./Toolbar";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import html2canvas from "html2canvas";

function EditorContent({ product, variantId, initialBgImage, initialTemplateId }: { product: Product; variantId: string | null, initialBgImage?: string | null, initialTemplateId?: string | null }) {
  const { layers, setLayers, selectedLayerId, resetLayers } = useLayer();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("text");
  const [isSaving, setIsSaving] = useState(false);
  const [customBgImage, setCustomBgImage] = useState<string | null>(initialBgImage || null);
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(initialTemplateId || null);

  // Auto-switch sidebar tab when a layer is selected
  useEffect(() => {
    if (selectedLayerId) {
      const selectedLayer = layers.find(l => l.id === selectedLayerId);
      if (selectedLayer) {
        if (selectedLayer.type === "text" && activeTab !== "text") {
          setActiveTab("text");
        } else if (selectedLayer.type === "image" && activeTab !== "uploads") {
          setActiveTab("uploads");
        }
      }
    }
  }, [selectedLayerId, layers, activeTab]);

  // Restore saved design from localStorage if editing an existing cart item
  useEffect(() => {
    const saved = localStorage.getItem(`imojee_edit_design_${product.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLayers(parsed);
        }
      } catch (e) {
        console.error("Failed to restore saved design", e);
      }
      localStorage.removeItem(`imojee_edit_design_${product.id}`);
    }
  }, [product.id, setLayers]);

  const handleNext = async () => {
    setIsSaving(true);
    let tempStyle: HTMLStyleElement | null = null;
    const originalSheets: any[] = [];
    try {
      const card = document.getElementById("editor-printable-card");
      if (card) {
        // Collect all active stylesheets (link and style tags) on the page
        const sheetElements = Array.from(document.querySelectorAll("link[rel='stylesheet'], style"));
        let combinedCss = "";

        for (let i = 0; i < document.styleSheets.length; i++) {
          const sheet = document.styleSheets[i];
          try {
            let sheetCss = "";
            const rules = sheet.cssRules || sheet.rules;
            if (rules) {
              for (let j = 0; j < rules.length; j++) {
                sheetCss += rules[j].cssText + "\n";
              }
            }
            combinedCss += sheetCss + "\n";
          } catch (e) {
            // Fallback: if sheet cannot be read due to CORS / browser policies, try fetching it
            if (sheet.href) {
              try {
                const res = await fetch(sheet.href);
                const text = await res.text();
                combinedCss += text + "\n";
              } catch (err) {
                console.warn("Could not fetch external stylesheet:", sheet.href, err);
              }
            }
          }
        }

        // Sanitize oklch, oklab, and lab color functions that html2canvas fails to parse
        const sanitizedCss = combinedCss
          .replace(/oklch\([^)]+\)/g, "rgb(124, 58, 237)")
          .replace(/oklab\([^)]+\)/g, "rgb(124, 58, 237)")
          .replace(/lab\([^)]+\)/g, "rgb(124, 58, 237)");

        // Create temporary style element with sanitized CSS
        tempStyle = document.createElement("style");
        tempStyle.id = "temp-html2canvas-style";
        tempStyle.textContent = sanitizedCss;
        document.head.appendChild(tempStyle);

        // Disable all original stylesheets to prevent html2canvas from loading/parsing them
        sheetElements.forEach((el: any) => {
          originalSheets.push({ el, originalDisabled: el.disabled });
          el.disabled = true;
          if (el.tagName === "STYLE") {
            el.setAttribute("data-original-media", el.media || "");
            el.media = "only x";
          }
        });

        // Render high-quality canvas preview using html2canvas
        const canvas = await html2canvas(card, {
          useCORS: true,
          scale: 2,
          backgroundColor: "#ffffff",
          onclone: (clonedDoc) => {
            // Find and remove all editor overlays (Safe Area, Bleed, Handles, Tooltips)
            const overlays = clonedDoc.querySelectorAll(".editor-overlay");
            overlays.forEach((el) => el.remove());

            // Also strip selection outlines from layers in the cloned document
            const outlined = clonedDoc.querySelectorAll(".outline");
            outlined.forEach((el) => {
              el.classList.remove(
                "outline", 
                "outline-2", 
                "outline-blue-500", 
                "hover:outline-blue-500",
                "outline-purple-600",
                "hover:outline-purple-600",
                "hover:outline",
                "hover:outline-1",
                "hover:outline-purple-400"
              );
            });
          }
        });
        const previewUrl = canvas.toDataURL("image/png");
        
        // Save current editor state to localStorage for the preview page
        const designData = {
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          productImage: product.image,
          description: product.description,
          layers: layers,
          previewImage: previewUrl,
        };
        localStorage.setItem("imojee_preview_design", JSON.stringify(designData));

        // Navigate to Preview page
        router.push(`/editor/preview?productId=${product.id}`);
      }
    } catch (err) {
      console.error("Failed to capture preview", err);
    } finally {
      // Restore original stylesheets and cleanup temporary style element
      originalSheets.forEach(({ el, originalDisabled }) => {
        el.disabled = originalDisabled;
        if (el.tagName === "STYLE") {
          el.media = el.getAttribute("data-original-media") || "";
          el.removeAttribute("data-original-media");
        }
      });
      if (tempStyle) {
        tempStyle.remove();
      }
      setIsSaving(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#F5F5F7] flex flex-col overflow-hidden text-gray-900 font-sans">
      {/* Top Navbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-4">
          <Link href={`/products/${product.slug}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            <ChevronLeft size={18} />
            Back
          </Link>
          <div className="h-6 w-px bg-gray-300" />
          <h1 className="font-semibold text-gray-800">{product.name} Design</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to reset your design? All progress will be lost.")) {
                resetLayers();
              }
            }}
            disabled={isSaving}
            className="px-4 py-1.5 text-sm font-semibold text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
          >
            Reset Design
          </button>
          <div className="h-4 w-px bg-gray-300 mx-1" />
          <button 
            onClick={handleNext}
            disabled={isSaving}
            className="px-4 py-1.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
          >
            Preview
          </button>
          <button 
            onClick={handleNext}
            disabled={isSaving}
            className="px-5 py-1.5 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:bg-purple-700 disabled:bg-purple-400 rounded-md transition-colors shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {isSaving ? "Saving..." : "Next"}
          </button>
        </div>
      </header>



      {/* Main Editor Body */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        <EditorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <EditorPanel 
          activeTab={activeTab} 
          product={product} 
          variantId={variantId} 
          customBgImage={customBgImage} 
          setCustomBgImage={setCustomBgImage} 
          activeTemplateId={activeTemplateId}
          setActiveTemplateId={setActiveTemplateId}
        />

        {/* Right side workspace */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#F5F5F7]">
          <Toolbar />
          {/* The scalable canvas wrapper */}
          <div className="flex-1 overflow-hidden flex items-center justify-center relative">
            <EditorCanvas 
              bgImage={customBgImage || undefined} 
              productId={product.id} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EditorLoader() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const variantId = searchParams.get("variant");
  const templateId = searchParams.get("templateId");

  const [product, setProduct] = useState<Product | null>(null);
  const [initialLayers, setInitialLayers] = useState<Layer[]>([]);
  const [initialBgImage, setInitialBgImage] = useState<string | null>(null);
  const [initialTemplateId, setInitialTemplateId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      const found = getProductById(productId);
      if (found) {
        setProduct(found);
        
        // If it has templates, fetch the one matching the templateId, or default to first for variant
        if (found.templates && found.templates.length > 0) {
          const matchedTemplate = 
            found.templates.find(t => t.id === templateId) || 
            found.templates.find(t => t.variantId === variantId) || 
            found.templates.find(t => t.id === variantId) || 
            found.templates[0];
          
          fetch(matchedTemplate.configUrl)
            .then(res => res.json())
            .then(data => {
              const fetchedLayers = data.layers ? data.layers.map((l: any) => ({ ...l, isTemplateLayer: true })) : [];
              setInitialLayers(fetchedLayers);
              setInitialBgImage(data.background || null);
              setInitialTemplateId(matchedTemplate.id);
              setIsLoading(false);
            })
            .catch(err => {
              console.error("Failed to load initial template", err);
              setInitialLayers(found.editableFields || []);
              setIsLoading(false);
            });
        } else {
          setInitialLayers(found.editableFields || []);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [productId]);

  if (isLoading || !product) return <div className="p-8 text-center text-gray-500">Loading editor...</div>;

  return (
    <LayerProvider initialLayers={initialLayers}>
      <EditorContent product={product} variantId={variantId} initialBgImage={initialBgImage} initialTemplateId={initialTemplateId} />
    </LayerProvider>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading editor...</div>}>
      <EditorLoader />
    </Suspense>
  );
}