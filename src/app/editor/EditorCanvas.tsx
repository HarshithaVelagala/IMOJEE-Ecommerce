"use client";

import SafeAreaOverlay from "./SafeAreaOverlay";
import React, { useRef, useState, useEffect } from "react";
import { useLayer } from "./LayerContext";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";
import EditableShape from "./EditableShape";
import { Plus, Minus } from "lucide-react";
let KonvaPrimitives: any = null;

interface EditorCanvasProps {
  bgImage?: string;
  productId?: string;
}

export default function EditorCanvas({ bgImage, productId }: EditorCanvasProps) {
  const { layers, clearSelection } = useLayer();

  const scaleWrapperRef = useRef<HTMLDivElement>(null);
  const printableRef = useRef<HTMLDivElement>(null);
  const [baseScaleFactor, setBaseScaleFactor] = useState(1);
  const [zoom, setZoom] = useState<number | "FIT">("FIT"); // Zoom in percentage (30% to 300%) or 'FIT'
  const [isKonvaLoaded, setIsKonvaLoaded] = useState(!!KonvaPrimitives);

  // Load react-konva strictly on the client
  useEffect(() => {
    if (!KonvaPrimitives) {
      import("react-konva")
        .then((mod) => {
          KonvaPrimitives = mod;
          setIsKonvaLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to import react-konva in EditorCanvas:", err);
        });
    }
  }, []);

  const finalScale = baseScaleFactor * (zoom === "FIT" ? 1 : zoom / 100);

  // Keyboard deselection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearSelection();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [clearSelection]);

  // Mouse wheel + Ctrl zoom logic
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 10 : -10;
        setZoom((prev) => {
          const currentZoom = prev === "FIT" ? 180 : prev;
          return Math.min(300, Math.max(30, currentZoom + delta));
        });
      }
    };
    const wrapper = scaleWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (wrapper) {
        wrapper.removeEventListener("wheel", handleWheel);
      }
    };
  }, []);

  // Responsive scaling logic
  useEffect(() => {
    if (!scaleWrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width;
        const containerHeight = entry.contentRect.height;
        if (containerWidth === 0 || containerHeight === 0) return;

        const templateWidth = 600;
        const templateHeight = 800;

        const scale = Math.min(
          (containerWidth - 80) / templateWidth,
          (containerHeight * 0.65) / templateHeight
        );

        setBaseScaleFactor(scale);
      }
    });
    observer.observe(scaleWrapperRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="w-full h-full relative bg-transparent flex items-center justify-center overflow-auto p-16"
      ref={scaleWrapperRef}
    >
      {/* Zoom wrapper */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{
          width: `${600 * finalScale}px`,
          height: `${800 * finalScale}px`,
        }}
      >
        <div
          id="editor-printable-card"
          ref={printableRef}
          className="absolute bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12),_0_0_1px_rgba(0,0,0,0.15)] origin-center overflow-hidden shrink-0"
          style={{
            width: "600px",
            height: "800px",
            transform: `scale(${finalScale})`,
          }}
        >
          {/* Phase 1: Konva Stage connected to LayerContext */}
          {isKonvaLoaded && KonvaPrimitives && (
            <div className="absolute inset-0 z-10">
              <KonvaPrimitives.Stage
                width={600}
                height={800}
                onMouseDown={(e: any) => {
                  if (e.target === e.target.getStage()) {
                    clearSelection();
                  }
                }}
              >
                <KonvaPrimitives.Layer>
                  {layers.filter(l => l.type === 'shape').map(layer => (
                    <EditableShape
                      key={layer.id}
                      // @ts-ignore
                      layer={layer}
                      scaleFactor={finalScale}
                      boundsRef={printableRef}
                    />
                  ))}
                  {layers.filter(l => l.type === 'image').map(layer => (
                    <EditableImage
                      key={layer.id}
                      // @ts-ignore
                      layer={layer}
                      scaleFactor={finalScale}
                      boundsRef={printableRef}
                    />
                  ))}
                  {layers.filter(l => l.type === 'text').map(layer => (
                    <EditableText
                      key={layer.id}
                      // @ts-ignore
                      layer={layer}
                      scaleFactor={finalScale}
                      boundsRef={printableRef}
                    />
                  ))}
                </KonvaPrimitives.Layer>
              </KonvaPrimitives.Stage>
            </div>
          )}

          {/* Layer 0: Background Template */}
          {bgImage && (!productId || !productId.includes('bill-book')) && (
            <img
              src={bgImage}
              alt="Background Template"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-0"
            />
          )}

          <SafeAreaOverlay />

          {/* Dynamic Layers */}
          {layers.map((layer) => {
            switch (layer.type) {
              case "text":
                // Rendered inside Konva Stage above
                return null;
              case "image":
                // Rendered inside Konva Stage above
                return null;
              case "shape":
                // Rendered inside Konva Stage above
                return null;
              default:
                return null;
            }
          })}
        </div>
      </div>

      {/* Floating Zoom Controls (Bottom Center) */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-white/95 backdrop-blur-md border border-neutral-200/60 px-5 py-2.5 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.06),_0_0_1px_rgba(0,0,0,0.1)] select-none pointer-events-auto transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setZoom((prev) => {
            const currentZoom = prev === "FIT" ? 100 : prev;
            return Math.max(30, currentZoom - 10);
          })}
          disabled={zoom !== "FIT" && zoom <= 30}
          className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200 disabled:opacity-30 transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>

        <span className="text-xs font-semibold text-neutral-700 min-w-[3.5rem] text-center">
          {zoom === "FIT" ? "FIT" : `${zoom}%`}
        </span>

        <button
          onClick={() => setZoom((prev) => {
            const currentZoom = prev === "FIT" ? 100 : prev;
            return Math.min(300, currentZoom + 10);
          })}
          disabled={zoom !== "FIT" && zoom >= 300}
          className="p-1 rounded-full text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200 disabled:opacity-30 transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>

        <div className="w-px h-4 bg-neutral-200 mx-0.5" />

        <button
          onClick={() => setZoom("FIT")}
          className="text-[11px] font-bold text-purple-600 hover:text-purple-700 uppercase tracking-wider px-2.5 py-1 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/20"
        >
          Fit
        </button>
      </div>
    </div>
  );
}
