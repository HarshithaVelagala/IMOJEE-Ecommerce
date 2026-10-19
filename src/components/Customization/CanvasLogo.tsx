import React from "react";

type CanvasLogoProps = {
  src: string;
  style: React.CSSProperties;
  onPointerDown: (e: React.MouseEvent | React.TouchEvent) => void;
  className?: string;
};

export default function CanvasLogo({ src, style, onPointerDown, className }: CanvasLogoProps) {
  return (
    <img
      src={src}
      alt="Logo"
      style={style}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      className={className}
    />
  );
}
