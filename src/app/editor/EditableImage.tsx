"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { ImageLayer } from "./LayerTypes";
import { useLayer } from "./LayerContext";

let KonvaPrimitives: any = null;

interface Props {
  layer: ImageLayer;
  scaleFactor: number;
  boundsRef: React.RefObject<HTMLDivElement | null>;
}

export default function EditableImage({ layer, scaleFactor, boundsRef }: Props) {
  const { selectedLayerId, selectLayer, updateLayer } = useLayer();
  const isSelected = selectedLayerId === layer.id;

  const imageNodeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const [isLoaded, setIsLoaded] = useState(!!KonvaPrimitives);
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);

  // Load react-konva strictly on the client
  useEffect(() => {
    if (!KonvaPrimitives) {
      import("react-konva")
        .then((mod) => {
          KonvaPrimitives = mod;
          setIsLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to import react-konva inside EditableImage:", err);
        });
    }
  }, []);

  // Load the image source
  useEffect(() => {
    if (!layer.src) return;
    const img = new window.Image();
    img.src = layer.src;
    img.crossOrigin = "Anonymous"; // Important for html2canvas / export
    img.onload = () => {
      setImageObj(img);
    };
  }, [layer.src]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__images = (window as any).__images || {};
      (window as any).__images[layer.id] = {
        imageNodeRef,
        trRef,
      };
    }
    return () => {
      if (typeof window !== "undefined" && (window as any).__images) {
        delete (window as any).__images[layer.id];
      }
    };
  }, [layer.id, isLoaded]);

  // Guarantee that the layer is redrawn when this component unmounts
  useEffect(() => {
    return () => {
      if (imageNodeRef.current) {
        const layerNode = imageNodeRef.current.getLayer();
        if (layerNode) {
          Promise.resolve().then(() => layerNode.batchDraw());
        }
      }
    };
  }, [isLoaded]);

  // Constantly ensure Transformer is attached and visually updated
  useEffect(() => {
    if (isSelected && trRef.current && imageNodeRef.current) {
      trRef.current.nodes([imageNodeRef.current]);
      trRef.current.forceUpdate();
      trRef.current.getLayer()?.batchDraw();
    }
  }, [layer.x, layer.y, layer.width, layer.height, layer.rotation, isSelected]);

  const handleTrRef = useCallback((node: any) => {
    trRef.current = node;
    if (node && imageNodeRef.current) {
      node.nodes([imageNodeRef.current]);
      node.getLayer()?.batchDraw();
    }
  }, []);

  if (!layer.visible || !isLoaded || !KonvaPrimitives) return null;

  const { Image, Transformer } = KonvaPrimitives;

  // Pure Konva event handler - stops BOTH Konva and native DOM bubbling
  const handlePointerDown = (e: any) => {
    e.cancelBubble = true;
    if (e.evt) e.evt.stopPropagation();
    selectLayer(layer.id);
  };

  const handleDragStart = (e: any) => {
    e.cancelBubble = true;
    if (e.evt) e.evt.stopPropagation();
    selectLayer(layer.id);
  };

  const handleDragEnd = (e: any) => {
    updateLayer(layer.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = imageNodeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    updateLayer(layer.id, {
      x: node.x(),
      y: node.y(),
      width: Math.max(2, node.width() * Math.abs(scaleX)),
      height: Math.max(2, node.height() * Math.abs(scaleY)),
      rotation: node.rotation(),
    });
  };

  const handleDoubleClick = (e: any) => {
    if (layer.locked) return;
    e.cancelBubble = true;
    if (e.evt) e.evt.stopPropagation();
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const objectURL = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        const aspectRatio = img.naturalHeight / img.naturalWidth;
        const newHeight = Math.round(layer.width * aspectRatio);
        updateLayer(layer.id, { 
          src: objectURL,
          height: newHeight 
        });
      };
      img.src = objectURL;
    };
    input.click();
  };

  return (
    <React.Fragment>
      <Image
        ref={imageNodeRef}
        image={imageObj}
        x={layer.x}
        y={layer.y}
        width={layer.width}
        height={layer.height}
        offsetX={layer.width / 2}
        offsetY={layer.height / 2}
        rotation={layer.rotation || 0}
        draggable={!layer.locked}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={handlePointerDown}
        onTap={handlePointerDown}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onDblClick={handleDoubleClick}
        onDblTap={handleDoubleClick}
      />
      {isSelected && !layer.locked && (
        <Transformer
          ref={handleTrRef}
          flipEnabled={false}
          keepRatio={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 2 || newBox.height < 2) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          borderStroke="#9333ea"
          anchorStroke="#9333ea"
          anchorFill="#ffffff"
          anchorSize={10}
          borderStrokeWidth={2}
          anchorStrokeWidth={2}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          onClick={handlePointerDown}
          onTap={handlePointerDown}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        />
      )}
    </React.Fragment>
  );
}