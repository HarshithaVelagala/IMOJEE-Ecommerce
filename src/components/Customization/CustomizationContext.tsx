import React, { createContext, useContext, useState, ReactNode } from "react";

export type DesignSource = "template" | "upload";

export type LayerType = 'text' | 'image';

export interface Layer {
  id: string;
  type: LayerType;
  name: string;
  text: string;
  x: number;
  y: number;
  isCentered?: boolean;
}

export interface CustomizationData {
  designSource: "template" | "upload";
  selectedTemplate: string | null;
  uploadedDesign: string | null;
  selectedProductImage: string | null;
  selectedOptions: Record<string, string>;
  layers: Layer[];
  
  // Structured fields for Bill Book Personalization
  companyName: string;
  companyAddress: string;
  gstNumber: string;
  phoneNumber: string;
  email: string;
  website: string;
  logoImage: string | null;

  logoPos?: { x: number; y: number };
  companyNamePos?: { x: number; y: number };
  companyAddressPos?: { x: number; y: number };
  gstNumberPos?: { x: number; y: number };
  phoneNumberPos?: { x: number; y: number };
  emailPos?: { x: number; y: number };
  websitePos?: { x: number; y: number };
}

interface CustomizationContextProps {
  customization: CustomizationData;
  setCustomization: React.Dispatch<React.SetStateAction<CustomizationData>>;
}

const defaultCustomization: CustomizationData = {
  designSource: "template",
  selectedTemplate: null,
  uploadedDesign: null,
  selectedProductImage: null,
  selectedOptions: {},
  layers: [{ id: '1', type: 'text', name: 'Name', text: 'Add Name', x: 50, y: 50, isCentered: true }],
  
  companyName: "",
  companyAddress: "",
  gstNumber: "",
  phoneNumber: "",
  email: "",
  website: "",
  logoImage: null,
};

const CustomizationContext = createContext<CustomizationContextProps | undefined>(undefined);

export const CustomizationProvider = ({ children, initialState }: { children: ReactNode, initialState?: Partial<CustomizationData> }) => {
  const [customization, setCustomization] = useState<CustomizationData>({
    ...defaultCustomization,
    ...initialState
  });
  return (
    <CustomizationContext.Provider value={{ customization, setCustomization }}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error("useCustomization must be used within a CustomizationProvider");
  }
  return context;
};
