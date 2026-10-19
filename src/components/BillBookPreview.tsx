import Image from "next/image";
import CanvasLogo from "./Customization/CanvasLogo";
import CanvasText from "./Customization/CanvasText";
import { X } from "lucide-react";
import { useRef, useState, useEffect, CSSProperties } from "react";

interface Customization {
  companyName?: string;
  companyAddress?: string;
  gstNumber?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  logoImage?: string | null;
  // Position objects in pixels relative to printable area
  logoPos?: { x: number; y: number };
  companyNamePos?: { x: number; y: number };
  companyAddressPos?: { x: number; y: number };
  gstNumberPos?: { x: number; y: number };
  phoneNumberPos?: { x: number; y: number };
  emailPos?: { x: number; y: number };
  websitePos?: { x: number; y: number };
}

interface BillBookPreviewProps {
  image: string; // product image URL
  customization?: Customization;
  width: number; // container width in pixels
  height: number; // container height in pixels
  onCustomizationChange?: (partial: Partial<Customization>) => void;
}

function useDraggable(
  initialPos: { x: number; y: number } | undefined,
  setPos: (pos: { x: number; y: number }) => void,
  boundsRef: React.RefObject<HTMLDivElement | null>,
  scaleFactor: number,
  templateWidth = 600,
  templateHeight = 800
) {
  const [position, setPosition] = useState(initialPos || { x: 0, y: 0 });
  const dragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (initialPos && (initialPos.x !== position.x || initialPos.y !== position.y)) {
      setPosition(initialPos);
    }
  }, [initialPos]);

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const bounds = boundsRef.current?.getBoundingClientRect();
      if (!bounds) return;

      // offset is in screen pixels, so we subtract it from client position
      // then divide by scaleFactor to get template-relative pixels
      const newX = (clientX - bounds.left - offset.current.x) / scaleFactor;
      const newY = (clientY - bounds.top - offset.current.y) / scaleFactor;

      const clampedX = Math.max(0, Math.min(newX, templateWidth));
      const clampedY = Math.max(0, Math.min(newY, templateHeight));

      setPosition({ x: clampedX, y: clampedY });
    };

    const handleUp = () => {
      if (dragging.current) {
        dragging.current = false;
        setPos(position);
      }
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleUp);
    };
  }, [position, setPos, boundsRef, scaleFactor, templateWidth, templateHeight]);

  const onPointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    dragging.current = true;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const bounds = boundsRef.current?.getBoundingClientRect();
    if (!bounds) return;

    // We store the mouse offset relative to the element's top-left corner in screen space
    const currentPxScreen = position.x * scaleFactor;
    const currentPyScreen = position.y * scaleFactor;

    const offsetX = clientX - bounds.left - currentPxScreen;
    const offsetY = clientY - bounds.top - currentPyScreen;
    
    offset.current = { x: offsetX, y: offsetY };
  };

  const style: CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    cursor: dragging.current ? 'grabbing' : 'grab',
    userSelect: 'none',
  };

  return { style, onPointerDown };
}

export default function BillBookPreview({
  image,
  customization = {},
  width,
  height,
  onCustomizationChange,
}: BillBookPreviewProps) {
  const {
    companyName = "",
    companyAddress = "",
    gstNumber = "",
    phoneNumber = "",
    email = "",
    website = "",
    logoImage,
    logoPos,
    companyNamePos,
    companyAddressPos,
    gstNumberPos,
    phoneNumberPos,
    emailPos,
    websitePos,
  } = customization;

  const scaleWrapperRef = useRef<HTMLDivElement>(null);
  const printableRef = useRef<HTMLDivElement>(null);
  const [scaleFactor, setScaleFactor] = useState(1);

  // Responsive scale manager (Vistaprint style architecture)
  useEffect(() => {
    if (!scaleWrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const currentWidth = entry.contentRect.width;
        // Template natively is 600px wide
        setScaleFactor(currentWidth / 600);
      }
    });
    observer.observe(scaleWrapperRef.current);
    return () => observer.disconnect();
  }, []);

  // Template Configuration Object (Coordinates relative to 600x800 template)
  const TEMPLATE_CONFIG = {
    businessName: { x: 300, y: 160, width: 220, fontSize: 16, fontWeight: 700, maskW: 240, maskH: 26 },
    address: { x: 300, y: 205, width: 220, fontSize: 8, fontWeight: 500, maskW: 240, maskH: 24 },
    phone: { x: 300, y: 232, width: 220, fontSize: 8, fontWeight: 500, maskW: 240, maskH: 14 },
    email: { x: 250, y: 247, width: 100, fontSize: 8, fontWeight: 500, maskW: 110, maskH: 14 },
    website: { x: 350, y: 247, width: 100, fontSize: 8, fontWeight: 500, maskW: 110, maskH: 14 },
    gst: { x: 300, y: 260, width: 220, fontSize: 8, fontWeight: 500, maskW: 240, maskH: 14 },
    logo: { x: 135, y: 155, width: 55, height: 55 },
  };

  // Helper to ignore corrupted 0,0 positions from old cache
  const getPos = (pos: { x: number; y: number } | undefined, defaultPos: { x: number; y: number }) => {
    if (!pos) return defaultPos;
    if (pos.x === 0 && pos.y === 0) return defaultPos;
    return pos;
  };

  const logoDrag = useDraggable(getPos(logoPos, TEMPLATE_CONFIG.logo), (p) => {
    if (onCustomizationChange) onCustomizationChange({ logoPos: p });
  }, printableRef, scaleFactor);

  const nameDrag = useDraggable(getPos(companyNamePos, TEMPLATE_CONFIG.businessName), (p) => {
    if (onCustomizationChange) onCustomizationChange({ companyNamePos: p });
  }, printableRef, scaleFactor);

  const addressDrag = useDraggable(getPos(companyAddressPos, TEMPLATE_CONFIG.address), (p) => {
    if (onCustomizationChange) onCustomizationChange({ companyAddressPos: p });
  }, printableRef, scaleFactor);

  const gstDrag = useDraggable(getPos(gstNumberPos, TEMPLATE_CONFIG.gst), (p) => {
    if (onCustomizationChange) onCustomizationChange({ gstNumberPos: p });
  }, printableRef, scaleFactor);

  const phoneDrag = useDraggable(getPos(phoneNumberPos, TEMPLATE_CONFIG.phone), (p) => {
    if (onCustomizationChange) onCustomizationChange({ phoneNumberPos: p });
  }, printableRef, scaleFactor);

  const emailDrag = useDraggable(getPos(emailPos, TEMPLATE_CONFIG.email), (p) => {
    if (onCustomizationChange) onCustomizationChange({ emailPos: p });
  }, printableRef, scaleFactor);

  const websiteDrag = useDraggable(getPos(websitePos, TEMPLATE_CONFIG.website), (p) => {
    if (onCustomizationChange) onCustomizationChange({ websitePos: p });
  }, printableRef, scaleFactor);

  // Auto-Scaling Typography Component (Works purely in 600x800 pixel space)
  const AutoScaleText = ({
    text,
    className,
    config,
    dragProps
  }: {
    text: string,
    className: string,
    config: { x: number, y: number, width: number, fontSize: number, fontWeight: number },
    dragProps: any
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
      if (!containerRef.current || !textRef.current) return;
      setScale(1);

      const frameId = requestAnimationFrame(() => {
        if (!containerRef.current || !textRef.current) return;
        const containerWidth = containerRef.current.clientWidth;
        const textWidth = textRef.current.scrollWidth;

        if (textWidth > containerWidth && containerWidth > 0) {
          setScale(containerWidth / textWidth);
        }
      });
      return () => cancelAnimationFrame(frameId);
    }, [text, config.width]);

    if (!text) return null;

    return (
      <div
        {...dragProps}
        ref={containerRef}
        className={`absolute z-20 flex items-center justify-center pointer-events-auto -translate-x-1/2 -translate-y-1/2 rounded-sm cursor-grab active:cursor-grabbing hover:outline hover:outline-1 hover:outline-purple-400 p-0.5 ${className}`}
        style={{
          ...dragProps.style,
          width: `${config.width}px`,
        }}
      >
        <span
          ref={textRef}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            whiteSpace: 'nowrap',
            display: 'inline-block',
            fontSize: `${config.fontSize}px`,
            fontWeight: config.fontWeight,
          }}
        >
          {text}
        </span>
      </div>
    );
  };

  return (
    <div className="relative w-full h-full max-w-[600px] mx-auto rounded-2xl border border-neutral-200 bg-[#f8f9fa] p-4 sm:p-8 overflow-hidden shadow-[inset_0_2px_20px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center min-h-[450px]">
      
      {/* 
        Responsive Canvas Wrapper
        Listens to ResizeObserver and tracks intrinsic width relative to max-width
      */}
      <div ref={scaleWrapperRef} className="relative w-full overflow-hidden flex items-center justify-center" style={{ aspectRatio: '600/800' }}>
        
        {/*
          Printable Card Canvas (Layer 0 Base)
          Strictly fixed to 600x800 pixels. Scaled dynamically using transform.
        */}
        <div
          id="printable-invoice-card"
          ref={printableRef}
          className="absolute bg-white shadow-lg overflow-hidden origin-top-left"
          style={{
            width: "600px",
            height: "800px",
            transform: `scale(${scaleFactor})`,
            top: 0,
            left: 0,
          }}
        >
          {/* Layer 0: Background Template */}
          <div className="absolute inset-0 bg-white pointer-events-none z-0 flex flex-col">
            {/* Top Banner */}
            <div className="flex h-6 w-full">
              <div className="w-[140px] bg-[#274b6a]"></div>
              <div className="w-[140px] bg-[#6bd3ed]"></div>
              <div className="flex-1 bg-[#6086c6]"></div>
            </div>

            <div className="flex-1 px-8 py-8 relative flex flex-col">
              {/* Header Section */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1"></div>
                {/* Right side static text */}
                <div className="text-right flex flex-col gap-1.5 items-start w-32 mt-2">
                  <h2 className="text-[22px] font-bold text-[#6086c6] tracking-wide mb-1">INVOICE</h2>
                  <div className="text-[11px] text-[#274b6a] font-semibold">Invoice No.</div>
                  <div className="text-[11px] text-[#274b6a] font-semibold">Invoice Date:</div>
                </div>
              </div>

              {/* Name and Address */}
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex items-end gap-2">
                  <span className="text-[11px] font-semibold text-[#274b6a] w-14">Name</span>
                  <div className="flex-1 border-b border-gray-400"></div>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-[11px] font-semibold text-[#274b6a] w-14">Address</span>
                  <div className="flex-1 border-b border-gray-400"></div>
                </div>
              </div>

              {/* Table */}
              <div className="border border-gray-400 flex flex-col flex-1 mb-2">
                {/* Table Header */}
                <div className="flex border-b border-gray-400 text-[11px] font-semibold text-[#274b6a] text-center">
                  <div className="w-12 py-1.5 border-r border-gray-400">S.No.</div>
                  <div className="flex-1 py-1.5 border-r border-gray-400">Description</div>
                  <div className="w-12 py-1.5 border-r border-gray-400">Qty.</div>
                  <div className="w-16 py-1.5 border-r border-gray-400">Rate</div>
                  <div className="w-20 py-1.5">Amount</div>
                </div>
                {/* Table Body */}
                <div className="flex flex-1 min-h-[300px]">
                  <div className="w-12 border-r border-gray-400"></div>
                  <div className="flex-1 border-r border-gray-400"></div>
                  <div className="w-12 border-r border-gray-400"></div>
                  <div className="w-16 border-r border-gray-400"></div>
                  <div className="w-20"></div>
                </div>
                {/* Total Row */}
                <div className="flex border-t border-gray-400">
                  <div className="flex-1 border-r border-gray-400"></div>
                  <div className="w-16 py-1.5 border-r border-gray-400 text-[11px] font-bold text-[#274b6a] text-center">Total</div>
                  <div className="w-20 py-1.5"></div>
                </div>
              </div>

              {/* Footer content */}
              <div className="mt-1 flex flex-col gap-1.5 text-[11px] font-semibold text-[#274b6a]">
                <div className="flex items-end">
                  <span className="w-24">Rupees in words:</span>
                  <div className="flex-1 border-b border-gray-400"></div>
                </div>
                <div className="flex items-end mt-1 border-b border-gray-400 pb-2">
                  <span className="w-32">Terms & Conditions</span>
                  <div className="flex-1"></div>
                </div>
              </div>

              {/* Signature */}
              <div className="absolute bottom-10 right-8 text-[11px] font-semibold text-[#274b6a]">
                Signature
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="flex h-6 w-full mt-auto">
              <div className="w-[140px] bg-[#274b6a]"></div>
              <div className="w-[140px] bg-[#6bd3ed]"></div>
              <div className="flex-1 bg-[#6086c6]"></div>
            </div>
          </div>

          {/* Layer 3: Dynamic Text Elements */}
          <AutoScaleText
            text={companyName || ''}
            config={TEMPLATE_CONFIG.businessName}
            dragProps={nameDrag}
            className="text-neutral-900"
          />

          <AutoScaleText
            text={email || ''}
            config={TEMPLATE_CONFIG.email}
            dragProps={emailDrag}
            className="text-neutral-800"
          />

          <AutoScaleText
            text={companyAddress || ''}
            config={TEMPLATE_CONFIG.address}
            dragProps={addressDrag}
            className="text-neutral-800"
          />

          <AutoScaleText
            text={gstNumber || ''}
            config={TEMPLATE_CONFIG.gst}
            dragProps={gstDrag}
            className="text-neutral-800"
          />

          <AutoScaleText
            text={phoneNumber || ''}
            config={TEMPLATE_CONFIG.phone}
            dragProps={phoneDrag}
            className="text-neutral-800"
          />

          <AutoScaleText
            text={website || ''}
            config={TEMPLATE_CONFIG.website}
            dragProps={websiteDrag}
            className="text-neutral-800"
          />

          {/* Layer 4: Logo Area */}
          {logoImage && (
            <div
              {...logoDrag}
              className="absolute z-30 pointer-events-auto -translate-x-1/2 -translate-y-1/2"
              style={{
                ...logoDrag.style,
                width: `${TEMPLATE_CONFIG.logo.width}px`,
                height: `${TEMPLATE_CONFIG.logo.height}px`
              }}
            >
              <img
                src={logoImage}
                alt="Logo"
                className="w-full h-full object-contain bg-transparent pointer-events-none select-none cursor-grab active:cursor-grabbing hover:outline hover:outline-1 hover:outline-purple-400 rounded-sm"
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
