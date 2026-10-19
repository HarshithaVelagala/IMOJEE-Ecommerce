import { CustomizationProvider } from "./CustomizationContext";
import CustomizationForm from "./CustomizationForm";
import DesignCanvas from "./DesignCanvas";
import React from "react";

type CustomizationModalProps = {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  closeModal: () => void;
  // All specific customization fields passed from parent
  companyName: string;
  setCompanyName: (v: string) => void;
  companyAddress: string;
  setCompanyAddress: (v: string) => void;
  gstNumber: string;
  setGstNumber: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  website: string;
  setWebsite: (v: string) => void;
  logoImage: string | null;
  setLogoImage: (v: string | null) => void;
  
  logoPos?: { x: number; y: number };
  setLogoPos?: (p: { x: number; y: number }) => void;
  companyNamePos?: { x: number; y: number };
  setCompanyNamePos?: (p: { x: number; y: number }) => void;
  companyAddressPos?: { x: number; y: number };
  setCompanyAddressPos?: (p: { x: number; y: number }) => void;
  gstNumberPos?: { x: number; y: number };
  setGstNumberPos?: (p: { x: number; y: number }) => void;
  phoneNumberPos?: { x: number; y: number };
  setPhoneNumberPos?: (p: { x: number; y: number }) => void;
  emailPos?: { x: number; y: number };
  setEmailPos?: (p: { x: number; y: number }) => void;
  websitePos?: { x: number; y: number };
  setWebsitePos?: (p: { x: number; y: number }) => void;

  setSavedCustomization: (c: any) => void;
  onReset?: () => void;
  [key: string]: any;
};

export default function CustomizationModal({
  product,
  isOpen,
  onClose,
  closeModal,
  companyName, setCompanyName,
  companyAddress, setCompanyAddress,
  gstNumber, setGstNumber,
  phoneNumber, setPhoneNumber,
  email, setEmail,
  website, setWebsite,
  logoImage, setLogoImage,
  logoPos, companyNamePos, companyAddressPos, gstNumberPos, phoneNumberPos, emailPos, websitePos,
  setSavedCustomization,
}: CustomizationModalProps) {
  
  if (!isOpen) return null;

  return (
    <CustomizationProvider initialState={{
      companyName,
      companyAddress,
      gstNumber,
      phoneNumber,
      email,
      website,
      logoImage,
      logoPos,
      companyNamePos,
      companyAddressPos,
      gstNumberPos,
      phoneNumberPos,
      emailPos,
      websitePos,
    }}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 sm:p-6 overflow-hidden transition-all">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full h-full max-h-[90vh] overflow-y-auto lg:overflow-hidden p-8 flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-8 relative">
          
          {/* Left side: Preview Canvas */}
          <div className="w-full lg:w-[65%] flex flex-col items-center justify-center bg-gray-50 rounded-xl p-4 lg:p-8">
            <DesignCanvas product={product} />
          </div>

          {/* Right side: Controls Form */}
          <div className="w-full lg:w-[35%] overflow-y-auto pr-2">
            <CustomizationForm
              product={product}
              setSavedCustomization={setSavedCustomization}
              setClose={closeModal}
              
              setCompanyName={setCompanyName}
              setCompanyAddress={setCompanyAddress}
              setGstNumber={setGstNumber}
              setPhoneNumber={setPhoneNumber}
              setEmail={setEmail}
              setWebsite={setWebsite}
              setLogoImage={setLogoImage}
            />
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </CustomizationProvider>
  );
}
