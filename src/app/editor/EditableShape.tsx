"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { ShapeLayer } from "./LayerTypes";
import { useLayer } from "./LayerContext";

let KonvaPrimitives: any = null;

interface Props {
  layer: ShapeLayer;
  scaleFactor: number;
  boundsRef: React.RefObject<HTMLDivElement | null>;
}

export default function EditableShape({ layer, scaleFactor, boundsRef }: Props) {
  const { selectedLayerId, selectLayer, updateLayer } = useLayer();
  const isSelected = selectedLayerId === layer.id;

  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const [isLoaded, setIsLoaded] = useState(!!KonvaPrimitives);

  // Load react-konva strictly on the client
  useEffect(() => {
    if (!KonvaPrimitives) {
      import("react-konva")
        .then((mod) => {
          KonvaPrimitives = mod;
          setIsLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to import react-konva inside EditableShape:", err);
        });
    }
  }, []);

  console.log(`[EditableShape: ${layer.id}] rendered. isSelected=${isSelected}, x=${layer.x}, y=${layer.y}, width=${layer.width}, height=${layer.height}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__shapes = (window as any).__shapes || {};
      (window as any).__shapes[layer.id] = {
        shapeRef,
        trRef,
      };
    }
    return () => {
      if (typeof window !== "undefined" && (window as any).__shapes) {
        delete (window as any).__shapes[layer.id];
      }
    };
  }, [layer.id, isLoaded]);

  // Guarantee that the layer is redrawn when this component unmounts (fixes delete ghosting)
  useEffect(() => {
    return () => {
      console.log(`[EditableShape: ${layer.id}] unmounting`);
      if (shapeRef.current) {
        const layerNode = shapeRef.current.getLayer();
        if (layerNode) {
          Promise.resolve().then(() => layerNode.batchDraw());
        }
      }
    };
  }, [isLoaded]);

  // Constantly ensure Transformer is attached and visually updated
  useEffect(() => {
    console.log(`[EditableShape: ${layer.id}] transformer sync effect. isSelected=${isSelected}, trRef=${!!trRef.current}, shapeRef=${!!shapeRef.current}`);
    if (isSelected && trRef.current && shapeRef.current) {
      console.log(`[EditableShape: ${layer.id}] attaching shape node to transformer`);
      trRef.current.nodes([shapeRef.current]);
      trRef.current.forceUpdate();
      trRef.current.getLayer()?.batchDraw();
    }
  }, [layer.x, layer.y, layer.width, layer.height, layer.rotation, isSelected]);

  const handleTrRef = useCallback((node: any) => {
    console.log(`[EditableShape: ${layer.id}] handleTrRef called with node=${!!node}`);
    trRef.current = node;
    if (node && shapeRef.current) {
      console.log(`[EditableShape: ${layer.id}] handleTrRef: attaching shape node to transformer`);
      node.nodes([shapeRef.current]);
      node.getLayer()?.batchDraw();
    }
  }, []);

  if (!layer.visible || !isLoaded || !KonvaPrimitives) return null;

  const { Rect, Ellipse, Transformer } = KonvaPrimitives;

  // Pure Konva event handler - stops BOTH Konva and native DOM bubbling
  const handlePointerDown = (e: any) => {
    console.log(`[EditableShape: ${layer.id}] handlePointerDown called`);
    e.cancelBubble = true; // Stop Konva bubble
    if (e.evt) e.evt.stopPropagation(); // Stop native DOM bubble
    selectLayer(layer.id);
  };

  const handleDragStart = (e: any) => {
    console.log(`[EditableShape: ${layer.id}] handleDragStart called`);
    e.cancelBubble = true;
    if (e.evt) e.evt.stopPropagation();
    selectLayer(layer.id);
  };

  const handleDragEnd = (e: any) => {
    console.log(`[EditableShape: ${layer.id}] handleDragEnd called`);
    updateLayer(layer.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    console.log(`[EditableShape: ${layer.id}] handleTransformEnd. scaleX=${scaleX}, scaleY=${scaleY}, node.x=${node.x()}, node.y=${node.y()}, node.width=${node.width()}, node.height=${node.height()}`);

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

  const renderShape = () => {
    if (layer.shapeType === "circle") {
      return (
        <Ellipse
          ref={shapeRef}
          x={layer.x}
          y={layer.y}
          radiusX={layer.width / 2}
          radiusY={layer.height / 2}
          fill={layer.fill || "transparent"}
          stroke={layer.stroke || "transparent"}
          strokeWidth={layer.strokeWidth || 0}
          rotation={layer.rotation || 0}
          draggable={!layer.locked}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
          onClick={handlePointerDown}
          onTap={handlePointerDown}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        />
      );
    }

    const isLine = layer.shapeType === "line";
    const shapeWidth = layer.width;
    const shapeHeight = isLine ? (layer.strokeWidth || 1) : layer.height;

    return (
      <Rect
        ref={shapeRef}
        x={layer.x}
        y={layer.y}
        width={shapeWidth}
        height={shapeHeight}
        offsetX={shapeWidth / 2}
        offsetY={shapeHeight / 2}
        fill={layer.fill || (isLine ? layer.stroke : "transparent")}
        stroke={isLine ? "transparent" : (layer.stroke || "transparent")}
        strokeWidth={isLine ? 0 : (layer.strokeWidth || 0)}
        cornerRadius={layer.borderRadius || 0}
        rotation={layer.rotation || 0}
        draggable={!layer.locked}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={handlePointerDown}
        onTap={handlePointerDown}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
      />
    );
  };

  return (
    <React.Fragment>
      {renderShape()}
      {isSelected && !layer.locked && (
        <Transformer
          ref={handleTrRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 2 || newBox.height < 2) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={
            layer.shapeType === "line"
              ? ["middle-left", "middle-right"]
              : undefined // Use all 8 corner + edge anchors for standard shapes
          }
          borderStroke="#9333ea"
          anchorStroke="#9333ea"
          anchorFill="#ffffff"
          anchorSize={10}
          borderStrokeWidth={2}
          anchorStrokeWidth={2}
          rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
          // Intercept Transformer handle interactions natively in Konva
          onClick={handlePointerDown}
          onTap={handlePointerDown}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
        />
      )}
    </React.Fragment>
  );
}
