/* eslint-disable */
"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Layer } from "./LayerTypes";

interface LayerContextType {
layers: Layer[];
setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;

selectedLayerId: string | null;
setSelectedLayerId: (id: string | null) => void;

selectLayer: (id: string) => void;
clearSelection: () => void;

updateLayer: (id: string, updates: Partial<Layer>) => void;
deleteLayer: (id: string) => void;
duplicateLayer: (id: string) => void;

copiedLayer: Layer | null;
copyLayer: () => void;
pasteLayer: () => void;

undo: () => void;
redo: () => void;
canUndo: boolean;
canRedo: boolean;

resetLayers: () => void;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export const LayerProvider = ({
children,
initialLayers = [],
}: {
children: React.ReactNode;
initialLayers?: Layer[];
}) => {
const [layers, setLayers] = useState<Layer[]>(initialLayers);
const [selectedLayerId, setSelectedLayerIdRaw] = useState<string | null>(null);
const setSelectedLayerId = (id: string | null) => {
console.log("[LayerContext] setSelectedLayerId called with:", id);
setSelectedLayerIdRaw(id);
};
const [copiedLayer, setCopiedLayer] = useState<Layer | null>(null);

// History State Stack (max 100 states)
const [past, setPast] = useState<Layer[][]>([]);
const [future, setFuture] = useState<Layer[][]>([]);
const lastSavedLayers = useRef<Layer[]>(initialLayers);
const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

// Sync initialLayers if they change (e.g. from a data fetch)
useEffect(() => {
if (initialLayers.length > 0 && layers.length === 0) {
setLayers(initialLayers);
lastSavedLayers.current = initialLayers;
setPast([]);
setFuture([]);
}
}, [initialLayers]);

// History tracking effect
useEffect(() => {
if (JSON.stringify(layers) === JSON.stringify(lastSavedLayers.current)) {
return;
}

const isStructural = layers.length !== lastSavedLayers.current.length;

if (isStructural) {
if (debounceTimeout.current) {
clearTimeout(debounceTimeout.current);
}
setPast((prev) => [...prev, lastSavedLayers.current].slice(-100));
setFuture([]);
lastSavedLayers.current = layers;
} else {
if (debounceTimeout.current) {
clearTimeout(debounceTimeout.current);
}

debounceTimeout.current = setTimeout(() => {
setPast((prev) => [...prev, lastSavedLayers.current].slice(-100));
setFuture([]);
lastSavedLayers.current = layers;
}, 400);
}

return () => {
if (debounceTimeout.current) {
clearTimeout(debounceTimeout.current);
}
};
}, [layers]);

const undo = () => {
if (past.length === 0) return;

if (debounceTimeout.current) {
clearTimeout(debounceTimeout.current);
}

const previous = past[past.length - 1];
const newPast = past.slice(0, past.length - 1);

setFuture((prev) => [layers, ...prev]);
setPast(newPast);
setLayers(previous);
lastSavedLayers.current = previous;
};

const redo = () => {
if (future.length === 0) return;

if (debounceTimeout.current) {
clearTimeout(debounceTimeout.current);
}

const next = future[0];
const newFuture = future.slice(1);

setPast((prev) => [...prev, layers].slice(-100));
setFuture(newFuture);
setLayers(next);
lastSavedLayers.current = next;
};

const resetLayers = () => {
  setLayers(initialLayers);
  setSelectedLayerId(null);
  setPast([]);
  setFuture([]);
  lastSavedLayers.current = initialLayers;
};

const selectLayer = (id: string) => {
console.log("[LayerContext] selectLayer called with:", id);
const layer = layers.find((l) => l.id === id);
if (layer?.locked) {
console.log("[LayerContext] selectLayer ignored because layer is locked");
return;
}
setSelectedLayerId(id);
};

const clearSelection = () => {
console.log("[LayerContext] clearSelection called");
setSelectedLayerId(null);
};

const updateLayer = (id: string, updates: Partial<Layer>) => {
    console.log("[LayerContext] updateLayer called with id:", id, "updates:", updates);
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id !== id) return layer;
        return {
          ...layer,
          ...updates,
        } as Layer;
      })
    );
  };

const deleteLayer = (id: string) => {
if (id === "logo") {
updateLayer(id, { src: "" });
} else {
setLayers((prev) => prev.filter((layer) => layer.id !== id));
if (selectedLayerId === id) {
setSelectedLayerId(null);
}
}
};

const duplicateLayer = (id: string) => {
if (id === "logo") return;

const layerToDup = layers.find((l) => l.id === id);
if (!layerToDup) return;

const newId = `${layerToDup.type}_${Date.now()}`;
const duplicated: Layer = {
...layerToDup,
id: newId,
x: Math.min(600, layerToDup.x + 20),
y: Math.min(800, layerToDup.y + 20),
} as Layer;

setLayers((prev) => [...prev, duplicated]);
setSelectedLayerId(newId);
};

const copyLayer = () => {
if (selectedLayerId && selectedLayerId !== "logo") {
const layerToCopy = layers.find((l) => l.id === selectedLayerId);
if (layerToCopy) {
setCopiedLayer(layerToCopy);
}
}
};

const pasteLayer = () => {
if (copiedLayer) {
const newId = `${copiedLayer.type}_${Date.now()}`;
const pasted: Layer = {
...copiedLayer,
id: newId,
x: Math.min(600, copiedLayer.x + 20),
y: Math.min(800, copiedLayer.y + 20),
} as Layer;
setLayers((prev) => [...prev, pasted]);
setSelectedLayerId(newId);
}
};

// Keyboard Shortcuts
useEffect(() => {
const handleKeyDown = (e: KeyboardEvent) => {
const activeEl = document.activeElement;
const isTyping = activeEl && (
activeEl.tagName === 'INPUT' || 
activeEl.tagName === 'TEXTAREA' || 
(activeEl as HTMLElement).isContentEditable
);

const isZ = e.key.toLowerCase() === 'z';
const isY = e.key.toLowerCase() === 'y';
const isD = e.key.toLowerCase() === 'd';
const isDelete = e.key === 'Delete';
const isBackspace = e.key === 'Backspace';
const isC = e.key.toLowerCase() === 'c';
const isV = e.key.toLowerCase() === 'v';

if ((e.ctrlKey || e.metaKey) && isZ) {
e.preventDefault();
if (e.shiftKey) {
redo();
} else {
undo();
}
} else if ((e.ctrlKey || e.metaKey) && isY) {
e.preventDefault();
redo();
} else if ((e.ctrlKey || e.metaKey) && isD) {
if (selectedLayerId && selectedLayerId !== "logo") {
e.preventDefault();
duplicateLayer(selectedLayerId);
}
} else if ((e.ctrlKey || e.metaKey) && isC && !isTyping) {
e.preventDefault();
copyLayer();
} else if ((e.ctrlKey || e.metaKey) && isV && !isTyping) {
e.preventDefault();
pasteLayer();
} else if ((isDelete || isBackspace) && !isTyping) {
if (selectedLayerId) {
if (isBackspace) {
e.preventDefault();
}
deleteLayer(selectedLayerId);
}
}
};

window.addEventListener('keydown', handleKeyDown);
return () => window.removeEventListener('keydown', handleKeyDown);
}, [layers, past, future, selectedLayerId, copiedLayer]);

  if (typeof window !== "undefined") {
    (window as any).__layerContext = {
      layers,
      selectedLayerId,
      selectLayer,
      clearSelection,
      updateLayer,
    };
  }

return (
<LayerContext.Provider
value={{
layers,
setLayers,
selectedLayerId,
setSelectedLayerId,
selectLayer,
clearSelection,
updateLayer,
deleteLayer,
duplicateLayer,
copiedLayer,
copyLayer,
pasteLayer,
undo,
redo,
canUndo: past.length > 0,
canRedo: future.length > 0,
resetLayers,
}}
>
{children}
</LayerContext.Provider>
);
};

export const useLayer = () => {
const context = useContext(LayerContext);
if (!context) {
throw new Error("useLayer must be used inside LayerProvider");
}
return context;
};