"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { TextLayer } from "./LayerTypes";
import { useLayer } from "./LayerContext";

let KonvaPrimitives: any = null;

interface Props {
  layer: TextLayer;
  scaleFactor: number;
  boundsRef: React.RefObject<HTMLDivElement | null>;
}

export default function EditableText({ layer, scaleFactor, boundsRef }: Props) {
  const { selectedLayerId, selectLayer, updateLayer } = useLayer();
  const isSelected = selectedLayerId === layer.id;

  const textNodeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  const [isLoaded, setIsLoaded] = useState(!!KonvaPrimitives);
  const [isEditing, setIsEditing] = useState(false);

  // Load react-konva strictly on the client
  useEffect(() => {
    if (!KonvaPrimitives) {
      import("react-konva")
        .then((mod) => {
          KonvaPrimitives = mod;
          setIsLoaded(true);
        })
        .catch((err) => {
          console.error("Failed to import react-konva inside EditableText:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__texts = (window as any).__texts || {};
      (window as any).__texts[layer.id] = {
        textNodeRef,
        trRef,
      };
    }
    return () => {
      if (typeof window !== "undefined" && (window as any).__texts) {
        delete (window as any).__texts[layer.id];
      }
    };
  }, [layer.id, isLoaded]);

  // Guarantee that the layer is redrawn when this component unmounts
  useEffect(() => {
    return () => {
      if (textNodeRef.current) {
        const layerNode = textNodeRef.current.getLayer();
        if (layerNode) {
          Promise.resolve().then(() => layerNode.batchDraw());
        }
      }
    };
  }, [isLoaded]);

  const [textHeight, setTextHeight] = useState(50);
  
  // Calculate text height on every render to ensure accurate offsetY
  useEffect(() => {
    if (textNodeRef.current) {
      const h = textNodeRef.current.height();
      if (Math.abs(h - textHeight) > 1) { // 1px threshold to prevent infinite loops
        setTextHeight(h);
      }
    }
  });

  // Constantly ensure Transformer is attached and visually updated
  useEffect(() => {
    if (isSelected && !isEditing && trRef.current && textNodeRef.current) {
      trRef.current.nodes([textNodeRef.current]);
      trRef.current.forceUpdate();
      trRef.current.getLayer()?.batchDraw();
    }
  }, [
    layer.x, layer.y, layer.width, layer.rotation, layer.text, 
    layer.fontSize, layer.fontFamily, layer.fontWeight, layer.fontStyle, 
    layer.textAlign, layer.color, layer.textDecoration, 
    layer.letterSpacing, layer.lineHeight,
    isSelected, isEditing
  ]);

  const handleTrRef = useCallback((node: any) => {
    trRef.current = node;
    if (node && textNodeRef.current) {
      node.nodes([textNodeRef.current]);
      node.getLayer()?.batchDraw();
    }
  }, []);

  if (!layer.visible || !isLoaded || !KonvaPrimitives) return null;

  const { Text, Transformer } = KonvaPrimitives;

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
    const node = textNodeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    
    // Convert scaling into a width change instead of visual squishing
    const width = Math.max(20, node.width() * Math.abs(scaleX));

    node.scaleX(1);
    node.scaleY(1);

    updateLayer(layer.id, {
      x: node.x(),
      y: node.y(),
      width: width,
      rotation: node.rotation(),
    });
  };

  const handleDoubleClick = (e: any) => {
    if (layer.locked) return;
    e.cancelBubble = true;
    if (e.evt) e.evt.stopPropagation();
    
    setIsEditing(true);

    const textNode = textNodeRef.current;
    if (!textNode) return;

    textNode.hide();
    trRef.current?.hide();

    // Create native textarea directly over the canvas
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    textarea.value = layer.text;
    textarea.style.position = 'absolute';

    // Calculate absolute position on screen
    const stage = textNode.getStage();
    const container = stage.container();
    const containerRect = container.getBoundingClientRect();

    const textPosition = textNode.absolutePosition();
    
    // We adjust position to account for the center offset since the textarea draws from top-left
    textarea.style.top = `${containerRect.top + textPosition.y - (textNode.height() * scaleFactor) / 2}px`;
    textarea.style.left = `${containerRect.left + textPosition.x - (layer.width * scaleFactor) / 2}px`;
    
    textarea.style.width = `${layer.width * scaleFactor}px`;
    textarea.style.height = `${textNode.height() * scaleFactor + 10}px`;
    
    // Style text to match Konva text precisely
    textarea.style.fontSize = `${layer.fontSize * scaleFactor}px`;
    textarea.style.border = '1px dashed #9333ea';
    textarea.style.padding = '0px';
    textarea.style.margin = '0px';
    textarea.style.overflow = 'hidden';
    textarea.style.background = 'rgba(255, 255, 255, 0.9)';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.lineHeight = (layer.lineHeight !== undefined ? layer.lineHeight : textNode.lineHeight()).toString();
    textarea.style.letterSpacing = `${layer.letterSpacing || 0}px`;
    textarea.style.fontFamily = layer.fontFamily || 'Arial';
    textarea.style.fontWeight = layer.fontWeight || 'normal';
    textarea.style.fontStyle = layer.fontStyle || 'normal';
    textarea.style.textAlign = layer.textAlign || 'left';
    textarea.style.color = layer.color || '#000000';
    textarea.style.transformOrigin = 'center center';
    textarea.style.transform = `rotateZ(${textNode.rotation()}deg)`;
    textarea.style.zIndex = '99999';
    textarea.style.boxSizing = 'border-box';
    textarea.style.whiteSpace = 'pre-wrap';
    textarea.style.wordWrap = 'break-word';

    textarea.focus();

    const removeTextarea = () => {
      if (document.body.contains(textarea)) {
        document.body.removeChild(textarea);
      }
      setIsEditing(false);
      textNode.show();
      trRef.current?.show();
      textNode.getLayer()?.batchDraw();
    };

    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        updateLayer(layer.id, { text: textarea.value });
        removeTextarea();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        removeTextarea();
      }
    });

    textarea.addEventListener('blur', () => {
      updateLayer(layer.id, { text: textarea.value });
      removeTextarea();
    });

    textarea.addEventListener('input', () => {
        // Auto-resize textarea height
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });
  };

  return (
    <React.Fragment>
      <Text
        ref={textNodeRef}
        x={layer.x}
        y={layer.y}
        text={layer.text}
        width={layer.width}
        offsetX={layer.width / 2}
        offsetY={textHeight / 2}
        fontSize={layer.fontSize}
        fontFamily={layer.fontFamily}
        fontWeight={layer.fontWeight}
        fontStyle={layer.fontStyle}
        fill={layer.color}
        align={layer.textAlign}
        textDecoration={layer.textDecoration}
        letterSpacing={layer.letterSpacing || 0}
        lineHeight={layer.lineHeight || 1}
        rotation={layer.rotation || 0}
        draggable={!layer.locked && !isEditing}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={handlePointerDown}
        onTap={handlePointerDown}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        onDblClick={handleDoubleClick}
        onDblTap={handleDoubleClick}
        opacity={isEditing ? 0 : 1}
      />
      {isSelected && !layer.locked && !isEditing && (
        <Transformer
          ref={handleTrRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 10) {
              return oldBox;
            }
            return newBox;
          }}
          enabledAnchors={["middle-left", "middle-right"]}
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