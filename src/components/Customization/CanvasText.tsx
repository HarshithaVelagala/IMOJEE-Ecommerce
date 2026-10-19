import React from "react";

type CanvasTextProps = {
  style: React.CSSProperties;
  onPointerDown: (e: React.MouseEvent | React.TouchEvent) => void;
  children: React.ReactNode;
  className?: string;
};

export default function CanvasText({ style, onPointerDown, children, className }: CanvasTextProps) {
  return (
    <div
      style={style}
      onMouseDown={onPointerDown}
      onTouchStart={onPointerDown}
      className={className}
    >
      {children}
    </div>
  );
}
