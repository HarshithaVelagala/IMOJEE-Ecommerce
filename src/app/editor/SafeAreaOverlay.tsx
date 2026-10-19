"use client";

import { useLayer } from "./LayerContext";

interface Props {
    width?: number;
    height?: number;
}

export default function SafeAreaOverlay({
    width = 600,
    height = 800,
}: Props) {
    const { isOutsideSafe } = useLayer();
    const bleed = 10;
    const safe = 30;

    return (
        <>
            {/* Bleed */}
            <div
                className="absolute border border-cyan-400/60 pointer-events-none editor-overlay"
                style={{
                    left: bleed,
                    top: bleed,
                    width: width - bleed * 2,
                    height: height - bleed * 2,
                }}
            />

            {/* Safe Area */}
            <div
                className={`absolute border border-dashed pointer-events-none editor-overlay transition-colors duration-200 ${
                    isOutsideSafe ? "border-red-500 bg-red-500/5 ring-1 ring-red-500/10" : "border-green-400/60"
                }`}
                style={{
                    left: safe,
                    top: safe,
                    width: width - safe * 2,
                    height: height - safe * 2,
                }}
            />

            {/* Labels */}
            <div
                className="absolute bg-cyan-400/80 backdrop-blur-xs text-white text-[9px] font-semibold tracking-wide px-1.5 py-0.5 rounded-md editor-overlay select-none"
                style={{
                    top: bleed + 5,
                    right: bleed + 5,
                }}
            >
                Bleed
            </div>

            <div
                className={`absolute text-white text-[9px] font-semibold tracking-wide px-1.5 py-0.5 rounded-md editor-overlay select-none transition-colors duration-200 ${
                    isOutsideSafe ? "bg-red-500" : "bg-green-400/80 backdrop-blur-xs"
                }`}
                style={{
                    top: safe + 5,
                    left: safe + 5,
                }}
            >
                {isOutsideSafe ? "Outside Safe Area!" : "Safe Area"}
            </div>
        </>
    );
}