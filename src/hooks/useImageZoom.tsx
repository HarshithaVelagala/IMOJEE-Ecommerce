import { useState, useRef, useCallback } from "react";

interface ZoomState {
  scale: number;
  originX: number;
  originY: number;
}

export function useImageZoom() {
  const [zoomState, setZoomState] = useState<ZoomState>({
    scale: 1,
    originX: 50,
    originY: 50,
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchDistanceRef = useRef(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate percentage position (0-100)
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    // Constrain to 0-100
    const originX = Math.max(0, Math.min(100, percentX));
    const originY = Math.max(0, Math.min(100, percentY));

    setZoomState({
      scale: 2.5,
      originX,
      originY,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsZoomed(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
    setZoomState({
      scale: 1,
      originX: 50,
      originY: 50,
    });
  }, []);

  // Touch support - Pinch zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      touchDistanceRef.current = distance;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!containerRef.current || e.touches.length !== 2) return;

    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const distance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );

    const scale = Math.min(2.5, Math.max(1, (distance / (touchDistanceRef.current || distance)) * 1.5 + 0.5));

    const rect = containerRef.current.getBoundingClientRect();
    const midX = (touch1.clientX + touch2.clientX) / 2 - rect.left;
    const midY = (touch1.clientY + touch2.clientY) / 2 - rect.top;

    const originX = Math.max(0, Math.min(100, (midX / rect.width) * 100));
    const originY = Math.max(0, Math.min(100, (midY / rect.height) * 100));

    setZoomState({
      scale,
      originX,
      originY,
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchDistanceRef.current = 0;
    setZoomState({
      scale: 1,
      originX: 50,
      originY: 50,
    });
  }, []);

  // Double tap zoom for mobile
  const handleDoubleClick = useCallback(() => {
    setZoomState((prev) =>
      prev.scale > 1
        ? { scale: 1, originX: 50, originY: 50 }
        : { scale: 2.5, originX: 50, originY: 50 }
    );
  }, []);

  const getTransformStyle = () => {
    return {
      transform: `scale(${zoomState.scale})`,
      transformOrigin: `${zoomState.originX}% ${zoomState.originY}%`,
      transition: isZoomed ? "none" : "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
    };
  };

  return {
    containerRef,
    zoomState,
    isZoomed,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleDoubleClick,
    getTransformStyle,
    getCursorStyle: () => (isZoomed ? "grab" : "zoom-in"),
  };
}
