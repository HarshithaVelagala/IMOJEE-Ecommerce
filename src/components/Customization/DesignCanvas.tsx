import Image from "next/image";
import { useCustomization } from "./CustomizationContext";
import BillBookPreview from "../BillBookPreview";

type DesignCanvasProps = {
  product: any;
  [key: string]: any; 
};

export default function DesignCanvas({ product }: DesignCanvasProps) {
  const { customization, setCustomization } = useCustomization();
  
  // Use uploaded design if available, otherwise selected template, otherwise default product image
  const displayImage = customization.designSource === "upload" && customization.uploadedDesign 
    ? customization.uploadedDesign 
    : customization.selectedTemplate || product.image;

  // We pass the context's setCustomization directly so BillBookPreview's draggable elements can update state natively.
  const handleCustomizationChange = (partial: Partial<typeof customization>) => {
    setCustomization((prev) => ({ ...prev, ...partial }));
  };

  return (
    <div id="printable-invoice-card" className="relative w-full h-full max-h-[600px] flex items-center justify-center bg-transparent rounded-lg overflow-hidden">
      <BillBookPreview 
        image={displayImage} 
        customization={customization} 
        width={550} 
        height={450} 
        onCustomizationChange={handleCustomizationChange}
      />
    </div>
  );
}
