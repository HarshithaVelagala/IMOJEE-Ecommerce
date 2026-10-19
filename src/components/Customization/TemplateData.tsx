import React, { useState } from "react";
import { CustomizationData } from "./CustomizationContext";

export interface Template {
  id: string;
  name: string;
  previewImage: string;
  category: string;
  colors: string[];
  isFavourite: boolean;
}

// Sample template data – in real app this could be fetched
export const templates: Template[] = [
  {
    id: "template1",
    name: "Classic Invoice",
    previewImage: "/products/business-collaterals/Black and White Bill Book.png",
    category: "Invoice",
    colors: ["blue", "gray"],
    isFavourite: true,
  },
  {
    id: "template2",
    name: "Modern Business",
    previewImage: "/products/business-collaterals/Multicolour Bill Book.png",
    category: "Business",
    colors: ["purple", "white"],
    isFavourite: false,
  },
  {
    id: "template3",
    name: "Minimalist Bill",
    previewImage: "/products/business-collaterals/Notepads.png",
    category: "Bill",
    colors: ["black"],
    isFavourite: false,
  },
];
