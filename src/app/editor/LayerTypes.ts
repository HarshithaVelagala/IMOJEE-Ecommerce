// src/app/editor/LayerTypes.ts

export type LayerBase = {
  id: string;
  type: 'text' | 'image' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
  visible: boolean;
  locked: boolean;
  isTemplateLayer?: boolean;
};

export type TextLayer = LayerBase & {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  color: string; // CSS color string
  textAlign?: 'left' | 'center' | 'right';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  letterSpacing?: number;
  lineHeight?: number;
};

export type ImageLayer = LayerBase & {
  type: 'image';
  src: string;
};

export type ShapeLayer = LayerBase & {
  type: 'shape';
  shapeType: 'rect' | 'circle' | 'line';
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  borderRadius?: number;
};

export type Layer = TextLayer | ImageLayer | ShapeLayer;