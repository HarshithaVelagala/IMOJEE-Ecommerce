"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Pin, X, Share2, MessageSquareShare, Send, ChevronLeft, ChevronRight, Scale, Heart, Search, ArrowLeftRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getProductByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useToast } from "@/components/ToastProvider";
import { useWishlist } from "@/hooks/useWishlist";
import { useCompare } from "@/hooks/useCompare";
import type { Product } from "@/data/products";
import BillBookPreview from "@/components/BillBookPreview";
import BookletSpecificationsModal from "@/components/BookletSpecificationsModal";

import { useRouter } from "next/navigation";

export default function ProductDetails({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const { toggle: toggleWishlist, has: hasWish } = useWishlist();
  const { add: addCompare, has: hasCompare } = useCompare();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isBookletSpecsModalOpen, setIsBookletSpecsModalOpen] = useState(false);
  const [bookletSpecs, setBookletSpecs] = useState<{ pages: number; lamination: string; thickness: string } | null>(null);

  const [logoPos, setLogoPos] = useState<{ x: number; y: number } | undefined>(undefined);
  const [companyNamePos, setCompanyNamePos] = useState<{ x: number; y: number } | undefined>(undefined);
  const [companyAddressPos, setCompanyAddressPos] = useState<{ x: number; y: number } | undefined>(undefined);
  const [gstNumberPos, setGstNumberPos] = useState<{ x: number; y: number } | undefined>(undefined);
  const [phoneNumberPos, setPhoneNumberPos] = useState<{ x: number; y: number } | undefined>(undefined);
  const [emailPos, setEmailPos] = useState<{ x: number; y: number } | undefined>(undefined);
  const [websitePos, setWebsitePos] = useState<{ x: number; y: number } | undefined>(undefined);
  // Customization states
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0] ?? null);

  useEffect(() => {
    const savedVariantId = sessionStorage.getItem(`imojee-selected-variant-${product.id}`);
    if (savedVariantId && product.variants) {
      const v = product.variants.find(v => v.id === savedVariantId);
      if (v) setSelectedVariant(v);
    }
  }, [product.id, product.variants]);

  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [logoImage, setLogoImage] = useState<string | null>(null);
// duplicate customImage state removed
  const [savedCustomization, setSavedCustomization] = useState<null | {
    companyName: string;
    companyAddress: string;
    gstNumber: string;
    phoneNumber: string;
    email: string;
    website: string;
    logoImage: string | null;
    // Position objects
    logoPos?: { x: number; y: number };
    companyNamePos?: { x: number; y: number };
    companyAddressPos?: { x: number; y: number };
    gstNumberPos?: { x: number; y: number };
    phoneNumberPos?: { x: number; y: number };
    emailPos?: { x: number; y: number };
    websitePos?: { x: number; y: number };
  }>(null);

  // ── localStorage draft persistence ──
  const DRAFT_KEY = `imojee-draft-${product.id}`;
  const skipSaveRef = useRef(true);

  // Restore saved draft on mount
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.companyName) setCompanyName(draft.companyName);
      if (draft.companyAddress) setCompanyAddress(draft.companyAddress);
      if (draft.gstNumber) setGstNumber(draft.gstNumber);
      if (draft.phoneNumber) setPhoneNumber(draft.phoneNumber);
      if (draft.email) setEmail(draft.email);
      if (draft.website) setWebsite(draft.website);
      if (draft.logoImage) setLogoImage(draft.logoImage);
      if (draft.logoPos) setLogoPos(draft.logoPos);
      if (draft.companyNamePos) setCompanyNamePos(draft.companyNamePos);
      if (draft.companyAddressPos) setCompanyAddressPos(draft.companyAddressPos);
      if (draft.gstNumberPos) setGstNumberPos(draft.gstNumberPos);
      if (draft.phoneNumberPos) setPhoneNumberPos(draft.phoneNumberPos);
      if (draft.emailPos) setEmailPos(draft.emailPos);
      if (draft.websitePos) setWebsitePos(draft.websitePos);
    } catch {
      // Ignore corrupt data
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    // Enable saving after restore settles
    const timer = setTimeout(() => { skipSaveRef.current = false; }, 200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save draft to localStorage on every change
  useEffect(() => {
    if (skipSaveRef.current) return;
    try {
      const draft = {
        companyName, companyAddress, gstNumber, phoneNumber, email, website,
        logoImage,
        logoPos, companyNamePos, companyAddressPos,
        gstNumberPos, phoneNumberPos, emailPos, websitePos,
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Storage full or unavailable – silent fail
    }
  }, [
    companyName, companyAddress, gstNumber, phoneNumber, email, website,
    logoImage, logoPos, companyNamePos, companyAddressPos,
    gstNumberPos, phoneNumberPos, emailPos, websitePos, DRAFT_KEY,
  ]);

  // Related products (same category, exclude current, limit 4)
  const relatedProducts = getProductByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  // Handler for logo upload in customization modal
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler for custom image upload (for product preview)
  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeImage = customImage ?? (selectedVariant ? selectedVariant.image : (product.images?.[activeImageIndex] ?? product.image));
  // Determine if the product is the Bill Book we want to customize
  const isBillBook = product.name.toLowerCase().includes("bill book");
  const hasMultipleImages = (product.images?.length ?? 0) > 1;
  const images = product.images?.length ? product.images : [product.image];

  const addToCart = () => {
    const productToAdd = { ...product, customImage, customizations: savedCustomization, selectedVariant };
    const addedNew = addItem(productToAdd, quantity);
    showToast(
      addedNew ? "Product added to cart successfully" : "Quantity updated in cart",
      [
        { label: "Continue Shopping", onClick: () => window.history.back() },
        { label: "View Cart", onClick: () => (window.location.href = "/cart") },
      ]
    );
  };

  // ── Reset all customisation fields & localStorage ──
  const handleResetAll = () => {
    setCompanyName("");
    setCompanyAddress("");
    setGstNumber("");
    setPhoneNumber("");
    setEmail("");
    setWebsite("");
    setLogoImage(null);
    setLogoPos({ x: 0, y: 0 });
    setCompanyNamePos({ x: 0, y: 0 });
    setCompanyAddressPos({ x: 0, y: 0 });
    setGstNumberPos({ x: 0, y: 0 });
    setPhoneNumberPos({ x: 0, y: 0 });
    setEmailPos({ x: 0, y: 0 });
    setWebsitePos({ x: 0, y: 0 });
    setSavedCustomization(null);
    try { localStorage.removeItem(DRAFT_KEY); } catch {}
  };

  const handlePreviousImage = () => {
    setActiveImageIndex((current) => (current - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setActiveImageIndex((current) => (current + 1) % images.length);
  };

  return (
    <>
      <div className="mx-auto px-4 py-10" style={{ maxWidth: 1200 }}>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* LEFT: Image gallery */}
          <div className="w-full flex justify-center">
            <div className="flex items-start" style={{ maxWidth: 650 }}>
              {/* Thumbnails column (desktop) */}
              <div className="hidden lg:flex flex-col gap-3 mr-4" style={{ width: 90 }}>
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`shrink-0 rounded-lg overflow-hidden ${index === activeImageIndex ? "border-2 border-purple-600" : "border border-neutral-200 hover:border-purple-600"
                      }`}
                    style={{ width: 80, height: 80 }}
                  >
                    <Image src={image} alt={`${product.name} thumbnail ${index + 1}`} width={80} height={80} className="object-contain w-full h-full bg-white" />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <div style={{ width: 550 }} className="shrink-0">
                <div className="relative overflow-hidden rounded-2xl border border-neutral-200 shadow-sm bg-white transition-all duration-300" style={{ height: 450, maxHeight: 450 }}>
                    {isBillBook && savedCustomization ? (
                      <BillBookPreview image={product.image} customization={savedCustomization} height={450} width={550} />
                    ) : (
                      <Image src={activeImage} alt={product.name} width={550} height={450} style={{ objectFit: "contain" }} className="w-full h-full bg-white" />
                    )}
                  {hasMultipleImages && (
                    <>
                      <button type="button" onClick={handlePreviousImage} className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white" aria-label="Previous image">
                        <ChevronLeft className="w-4 h-4 text-neutral-700" />
                      </button>
                      <button type="button" onClick={handleNextImage} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition hover:bg-white" aria-label="Next image">
                        <ChevronRight className="w-4 h-4 text-neutral-700" />
                      </button>
                    </>
                  )}
                </div>

                {/* Mobile thumbnails */}
                {hasMultipleImages && (
                  <div className="flex lg:hidden gap-3 overflow-x-auto mt-4">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`shrink-0 rounded-lg overflow-hidden ${index === activeImageIndex ? "border-2 border-purple-600" : "border border-neutral-200 hover:border-purple-600"
                          }`}
                        style={{ width: 80, height: 80 }}
                      >
                        <Image src={image} alt={`${product.name} thumbnail ${index + 1}`} width={80} height={80} className="object-contain w-full h-full bg-white" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Product info */}
          <div className="w-full lg:w-[55%] space-y-6">
            <div className="text-sm text-neutral-500">
              <nav className="flex flex-wrap items-center gap-2">
                <Link href="/" className="hover:text-purple-700">Home</Link>
                <span>/</span>
                <Link href={`/products?category=${product.category}`} className="hover:text-purple-700">{product.categoryTitle}</Link>
                <span>/</span>
                <span>{product.subcategory}</span>
                <span>/</span>
                <span className="font-semibold text-neutral-900">{product.name}</span>
              </nav>
            </div>
            <div className="space-y-3">
              <h1 className="font-bold tracking-tight text-neutral-900 text-[28px] md:text-[36px] lg:text-[48px]">{product.name}</h1>
              <p className="text-purple-600 font-semibold text-[24px] md:text-[32px]">₹{product.price.toFixed(2)}</p>
              <p className="text-neutral-600 max-w-2xl">{product.description}</p>
            </div>
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Product Highlights</h2>
              <ul className="space-y-3 text-neutral-700 list-disc list-inside">
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            
            {/* Size Selection Section */}
            {product.variants && product.variants.length > 0 && (
              <section className="bg-white">
                <h2 className="text-xl font-semibold text-neutral-900 mb-3">Select Size</h2>
                <div className="flex flex-col gap-3 mb-6">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected 
                            ? 'border-purple-600 bg-purple-50/50 shadow-sm' 
                            : 'border-neutral-200 hover:border-purple-300 hover:bg-neutral-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'border-purple-600 bg-purple-600' : 'border-neutral-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <span className={`text-base font-medium ${isSelected ? 'text-purple-900' : 'text-neutral-700'}`}>
                          {variant.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Customize Your Design Section */}
            <section className="bg-white">
              <h2 className="text-xl font-semibold text-neutral-900 mb-3">Customize Your Design</h2>
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleCustomImageUpload}
                className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all cursor-pointer border border-neutral-200 p-2 rounded-xl bg-neutral-50/50 mb-3"
              />
              {customImage && (
                <div className="mt-3">
                  <img src={customImage} alt="Custom preview" className="max-w-full h-auto border border-neutral-200 rounded-md" />
                </div>
              )}
            </section>

            {/* Quantity Section */}
            <div className="space-y-3">
              <span className="text-sm font-medium text-neutral-600 block">Quantity</span>
              <div className="flex items-center gap-4">
                <button 
                  type="button" 
                  onClick={() => setQuantity((c) => Math.max(1, c - 1))} 
                  className="h-10 w-10 rounded-full bg-neutral-100 text-lg font-bold text-neutral-700 flex items-center justify-center transition hover:bg-neutral-200 cursor-pointer" 
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center text-base font-semibold text-neutral-900">{quantity}</span>
                <button 
                  type="button" 
                  onClick={() => setQuantity((c) => c + 1)} 
                  className="h-10 w-10 rounded-full bg-neutral-100 text-lg font-bold text-neutral-700 flex items-center justify-center transition hover:bg-neutral-200 cursor-pointer" 
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-4 w-full items-center">
              <button 
                onClick={addToCart} 
                className="flex-1 flex items-center justify-center w-full h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:from-purple-700 hover:to-purple-800 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer whitespace-nowrap"
              >
                Add To Cart
              </button>
              <button 
                onClick={() => {
                  if (product.id === "booklet-printing") {
                    setIsBookletSpecsModalOpen(true);
                  } else {
                    const availableTemplates = product.templates?.filter(t => t.variantId === selectedVariant?.id) || [];
                    if (availableTemplates.length > 0) {
                      setIsTemplateModalOpen(true);
                    } else {
                      router.push(`/editor?productId=${product.id}${selectedVariant ? `&variant=${selectedVariant.id}` : ''}`);
                    }
                  }
                }}
                className="flex-1 flex items-center justify-center w-full h-12 rounded-2xl border border-purple-600 bg-white text-sm font-semibold text-purple-600 shadow-sm transition-all duration-300 hover:bg-purple-50/50 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 whitespace-nowrap cursor-pointer"
              >
                Customize Design
              </button>
            </div>

            {/* Compare & Wishlist */}
            <div className="flex items-center gap-6 pt-2">
              <button 
                type="button" 
                onClick={() => {
  const added = addCompare(product.id);
  showToast(
    added ? "Added to compare" : "Already added or compare list is full",
    []
  );
}}
                className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
              >
                <ArrowLeftRight className="w-4 h-4" />
                Add To Compare
              </button>
              <button 
                type="button" 
                onClick={() => toggleWishlist(product.id)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <Heart className={`w-4 h-4 ${hasWish(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                Add To Wishlist
              </button>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-3 text-sm text-neutral-500 pt-2">
              <span className="font-semibold text-neutral-750">Categories:</span>
              <span className="rounded-full border border-neutral-200 bg-neutral-100 px-4 py-1.5 text-xs font-medium text-neutral-700 flex items-center h-8">{product.categoryTitle}</span>
              <span className="rounded-full border border-neutral-200 bg-neutral-100 px-4 py-1.5 text-xs font-medium text-neutral-700 flex items-center h-8">{product.subcategory}</span>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm mt-10">
          <h2 className="text-sm font-semibold text-neutral-900 mb-4">Share</h2>
          <div className="flex flex-wrap gap-4">
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-purple-600 hover:text-purple-600"><Share2 className="h-5 w-5" aria-hidden="true" /><span className="sr-only">Share</span></button>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-purple-600 hover:text-purple-600"><X className="h-5 w-5" aria-hidden="true" /><span className="sr-only">Share on X</span></button>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-purple-600 hover:text-purple-600"><Pin className="h-5 w-5" aria-hidden="true" /><span className="sr-only">Share on Pinterest</span></button>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-purple-600 hover:text-purple-600"><MessageSquareShare className="h-5 w-5" aria-hidden="true" /><span className="sr-only">Share on LinkedIn</span></button>
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-purple-600 hover:text-purple-600"><Send className="h-5 w-5" aria-hidden="true" /><span className="sr-only">Share on Telegram</span></button>
          </div>
        </div>
      </div>




      <section className="mt-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((relProd) => (
            <ProductCard key={relProd.id} product={relProd} />
          ))}
        </div>
      </section>

      {/* Template Selection Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-bold text-neutral-900">Choose a Template</h3>
                <p className="text-sm text-neutral-500 mt-1">Select a starting design for your {selectedVariant?.name}</p>
              </div>
              <button 
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-900 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body - Template Grid */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {product.templates?.filter(t => t.variantId === selectedVariant?.id).map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      sessionStorage.setItem(`imojee-selected-template-${product.id}`, template.id);
                      sessionStorage.setItem(`imojee-selected-variant-${product.id}`, selectedVariant?.id || '');
                      let url = `/editor?productId=${product.id}&variant=${selectedVariant?.id}&templateId=${template.id}`;
                      if (bookletSpecs) {
                        url += `&pages=${bookletSpecs.pages}&lamination=${encodeURIComponent(bookletSpecs.lamination)}&thickness=${encodeURIComponent(bookletSpecs.thickness)}`;
                      }
                      router.push(url);
                    }}
                    className="group flex flex-col text-left bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className="aspect-[3/4] relative bg-neutral-100 w-full overflow-hidden">
                      {template.image ? (
                        <Image 
                          src={template.image}
                          alt={template.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                          No Preview
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-neutral-100 bg-white">
                      <h4 className="font-semibold text-neutral-900">{template.name}</h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booklet Specifications Modal */}
      <BookletSpecificationsModal
        isOpen={isBookletSpecsModalOpen}
        onClose={() => setIsBookletSpecsModalOpen(false)}
        variantName={selectedVariant?.name || "Standard Size"}
        onContinue={(specs) => {
          setBookletSpecs(specs);
          setIsBookletSpecsModalOpen(false);
          const availableTemplates = product.templates?.filter(t => t.variantId === selectedVariant?.id) || [];
          if (availableTemplates.length > 0) {
            setIsTemplateModalOpen(true);
          } else {
            let url = `/editor?productId=${product.id}${selectedVariant ? `&variant=${selectedVariant.id}` : ''}`;
            url += `&pages=${specs.pages}&lamination=${encodeURIComponent(specs.lamination)}&thickness=${encodeURIComponent(specs.thickness)}`;
            router.push(url);
          }
        }}
      />

    </>
  );
}
