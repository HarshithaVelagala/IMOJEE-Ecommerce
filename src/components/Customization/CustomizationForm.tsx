import React, { useEffect, useRef } from "react";
import { useCustomization } from "./CustomizationContext";
import { Upload, X } from "lucide-react";

type CustomizationFormProps = {
  product: any;
  setSavedCustomization: (c: any) => void;
  setClose: () => void;
  [key: string]: any;
};

export default function CustomizationForm({
  product,
  setSavedCustomization,
  setClose,
  setCompanyName,
  setCompanyAddress,
  setGstNumber,
  setPhoneNumber,
  setEmail,
  setWebsite,
  setLogoImage,
}: CustomizationFormProps) {
  const { customization, setCustomization } = useCustomization();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync context to parent component's state
  useEffect(() => {
    // We update individual states if they exist
    if (setCompanyName) setCompanyName(customization.companyName);
    if (setCompanyAddress) setCompanyAddress(customization.companyAddress);
    if (setGstNumber) setGstNumber(customization.gstNumber);
    if (setPhoneNumber) setPhoneNumber(customization.phoneNumber);
    if (setEmail) setEmail(customization.email);
    if (setWebsite) setWebsite(customization.website);
    if (setLogoImage) setLogoImage(customization.logoImage);

    // Save everything in one object for the preview in ProductDetails
    setSavedCustomization({
      ...customization,
    });
  }, [
    customization,
    setSavedCustomization,
    setCompanyName,
    setCompanyAddress,
    setGstNumber,
    setPhoneNumber,
    setEmail,
    setWebsite,
    setLogoImage,
  ]);

  const handleChange = (field: keyof typeof customization, value: string | null) => {
    setCustomization((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        alert("File size exceeds 15MB limit.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        handleChange("logoImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pb-10 w-full">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold text-neutral-900">Personalize</h2>
        <p className="text-sm text-neutral-500">Fill out your business details below.</p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-neutral-600 tracking-wide">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Business Name"
            value={customization.companyName || ""}
            onChange={(e) => handleChange("companyName", e.target.value)}
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-neutral-600 tracking-wide">
            Address
          </label>
          <textarea
            placeholder="Enter Business Address"
            value={customization.companyAddress || ""}
            onChange={(e) => handleChange("companyAddress", e.target.value)}
            rows={3}
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm font-medium resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-neutral-600 tracking-wide">
              Mobile Number
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98765 43210"
              value={customization.phoneNumber || ""}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm font-medium"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-neutral-600 tracking-wide">
              GST Number
            </label>
            <input
              type="text"
              placeholder="GSTIN"
              value={customization.gstNumber || ""}
              onChange={(e) => handleChange("gstNumber", e.target.value)}
              className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-neutral-600 tracking-wide">
            Email Address
          </label>
          <input
            type="email"
            placeholder="business@example.com"
            value={customization.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-neutral-600 tracking-wide">
            Website
          </label>
          <input
            type="url"
            placeholder="www.example.com"
            value={customization.website || ""}
            onChange={(e) => handleChange("website", e.target.value)}
            className="w-full p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm font-medium"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-neutral-600 tracking-wide">
            Company Logo
          </label>
          {!customization.logoImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-6 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-xl hover:bg-neutral-100 hover:border-purple-400 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:bg-purple-100 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-neutral-700">Click to upload logo</p>
                <p className="text-xs text-neutral-500 mt-1">PNG, JPG, SVG up to 15MB</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full p-4 border border-neutral-200 rounded-xl bg-neutral-50 flex items-center gap-4">
              <div className="w-16 h-16 relative bg-white border border-neutral-200 rounded overflow-hidden flex-shrink-0">
                <img src={customization.logoImage} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-800 truncate">Logo Uploaded</p>
                <button 
                  onClick={() => handleChange("logoImage", null)}
                  className="text-xs font-semibold text-red-500 hover:text-red-700 mt-1"
                >
                  Remove Logo
                </button>
              </div>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".png,.jpg,.jpeg,.svg"
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </div>
  );
}
