export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryTitle: string;
  subcategory: string;
  image: string;
  images: string[];
  price: number;
  description: string;
  features: string[];
  editableFields?: any[];
  variants?: { id: string; name: string; image: string; }[];
  templates?: { id: string; variantId?: string; name: string; image: string; configUrl: string; }[];
};

export const products: Product[] = [
  {
    id: "black-white-bill-book",
    slug: "black-white-bill-book",
    name: "Black and White Bill Book",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Bill Books",
    image: "/products/business-collaterals/Black and White Bill Book.png",
    images: [
      "/products/business-collaterals/Black and White Bill Book.png",
      "/products/business-collaterals/Black and White Bill Book.png",
      "/products/business-collaterals/Black and White Bill Book.png",
    ],
    price: 231.42,
    description: "Professional black and white bill book for business invoicing and accounting.",
    features: [
      "Black & white printed sheets available in A4 and A5 sizes",
      "Multiple duplicate sheet options available",
      "Upload your own artwork/design",
      "Suitable for business invoicing",
    ],
    editableFields: [
      {
        "id": "logo",
        "type": "image",
        "src": "",
        "x": 60,
        "y": 60,
        "width": 60,
        "height": 60,
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "top_banner1",
        "type": "shape",
        "shapeType": "rect",
        "x": 50,
        "y": 15,
        "width": 100,
        "height": 30,
        "fill": "#315475",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "top_banner2",
        "type": "shape",
        "shapeType": "rect",
        "x": 175,
        "y": 15,
        "width": 150,
        "height": 30,
        "fill": "#75d0e7",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "top_banner3",
        "type": "shape",
        "shapeType": "rect",
        "x": 425,
        "y": 15,
        "width": 350,
        "height": 30,
        "fill": "#658cc7",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "companyName",
        "type": "text",
        "text": "Company Name",
        "x": 150,
        "y": 80,
        "width": 200,
        "height": 30,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 24,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#658cc7"
      },
      {
        "id": "companyMessage",
        "type": "text",
        "text": "Company Message",
        "x": 140,
        "y": 110,
        "width": 200,
        "height": 20,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 14,
        "fontFamily": "Arial",
        "fontStyle": "italic",
        "fontWeight": "normal",
        "color": "#658cc7"
      },
      {
        "id": "invoiceTitle",
        "type": "text",
        "text": "INVOICE",
        "x": 480,
        "y": 80,
        "width": 100,
        "height": 20,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 16,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#658cc7"
      },
      {
        "id": "invoiceNo",
        "type": "text",
        "text": "Invoice No.",
        "x": 480,
        "y": 100,
        "width": 100,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "normal",
        "color": "#315475"
      },
      {
        "id": "invoiceDate",
        "type": "text",
        "text": "Invoice Date:",
        "x": 480,
        "y": 120,
        "width": 100,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "normal",
        "color": "#315475"
      },
      {
        "id": "labelName",
        "type": "text",
        "text": "Name",
        "x": 70,
        "y": 150,
        "width": 50,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "lineName",
        "type": "shape",
        "shapeType": "line",
        "x": 330,
        "y": 156,
        "width": 420,
        "height": 1,
        "strokeWidth": 1,
        "stroke": "#315475",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "labelAddress",
        "type": "text",
        "text": "Address",
        "x": 75,
        "y": 180,
        "width": 60,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "lineAddress1",
        "type": "shape",
        "shapeType": "line",
        "x": 330,
        "y": 186,
        "width": 420,
        "height": 1,
        "strokeWidth": 1,
        "stroke": "#315475",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "lineAddress2",
        "type": "shape",
        "shapeType": "line",
        "x": 330,
        "y": 210,
        "width": 420,
        "height": 1,
        "strokeWidth": 1,
        "stroke": "#315475",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "tableBorder",
        "type": "shape",
        "shapeType": "rect",
        "x": 300,
        "y": 445,
        "width": 500,
        "height": 410,
        "fill": "transparent",
        "strokeWidth": 1,
        "stroke": "#315475",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "tableHeaderLine",
        "type": "shape",
        "shapeType": "line",
        "x": 300,
        "y": 270,
        "width": 500,
        "height": 1,
        "strokeWidth": 1,
        "stroke": "#315475",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "tableTotalLine",
        "type": "shape",
        "shapeType": "line",
        "x": 300,
        "y": 620,
        "width": 500,
        "height": 1,
        "strokeWidth": 1,
        "stroke": "#315475",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "vLine1",
        "type": "shape",
        "shapeType": "rect",
        "x": 100,
        "y": 445,
        "width": 1,
        "height": 410,
        "fill": "#315475",
        "strokeWidth": 0,
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "vLine2",
        "type": "shape",
        "shapeType": "rect",
        "x": 320,
        "y": 445,
        "width": 1,
        "height": 410,
        "fill": "#315475",
        "strokeWidth": 0,
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "vLine3",
        "type": "shape",
        "shapeType": "rect",
        "x": 370,
        "y": 445,
        "width": 1,
        "height": 410,
        "fill": "#315475",
        "strokeWidth": 0,
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "vLine4",
        "type": "shape",
        "shapeType": "rect",
        "x": 440,
        "y": 445,
        "width": 1,
        "height": 410,
        "fill": "#315475",
        "strokeWidth": 0,
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "thSNo",
        "type": "text",
        "text": "S.No.",
        "x": 75,
        "y": 255,
        "width": 40,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "thDesc",
        "type": "text",
        "text": "Description",
        "x": 210,
        "y": 255,
        "width": 80,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "thQty",
        "type": "text",
        "text": "Qty.",
        "x": 345,
        "y": 255,
        "width": 40,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "thRate",
        "type": "text",
        "text": "Rate",
        "x": 405,
        "y": 255,
        "width": 40,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "thAmount",
        "type": "text",
        "text": "Amount",
        "x": 495,
        "y": 255,
        "width": 60,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "totalLabel",
        "type": "text",
        "text": "Total",
        "x": 405,
        "y": 635,
        "width": 50,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "rupeesLabel",
        "type": "text",
        "text": "Rupees in words:",
        "x": 120,
        "y": 670,
        "width": 120,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "rupeesLine",
        "type": "shape",
        "shapeType": "line",
        "x": 300,
        "y": 685,
        "width": 500,
        "height": 1,
        "strokeWidth": 1,
        "stroke": "#315475",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "termsLabel",
        "type": "text",
        "text": "Terms & Conditions",
        "x": 125,
        "y": 700,
        "width": 150,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "signatureLabel",
        "type": "text",
        "text": "Signature",
        "x": 480,
        "y": 750,
        "width": 80,
        "height": 16,
        "rotation": 0,
        "visible": true,
        "locked": false,
        "fontSize": 12,
        "fontFamily": "Arial",
        "fontWeight": "bold",
        "color": "#315475"
      },
      {
        "id": "bot_banner1",
        "type": "shape",
        "shapeType": "rect",
        "x": 50,
        "y": 785,
        "width": 100,
        "height": 30,
        "fill": "#315475",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "bot_banner2",
        "type": "shape",
        "shapeType": "rect",
        "x": 175,
        "y": 785,
        "width": 150,
        "height": 30,
        "fill": "#75d0e7",
        "rotation": 0,
        "visible": true,
        "locked": false
      },
      {
        "id": "bot_banner3",
        "type": "shape",
        "shapeType": "rect",
        "x": 425,
        "y": 785,
        "width": 350,
        "height": 30,
        "fill": "#658cc7",
        "rotation": 0,
        "visible": true,
        "locked": false
      }
    ],
  },
  {
    id: "flyer-printing",
    slug: "flyer-printing",
    name: "Flyer Printing",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Flyers",
    image: "/products/business-collaterals/A4 Flyer Printing.png",
    images: ["/products/business-collaterals/A4 Flyer Printing.png"],
    price: 290,
    description: "High-quality flyer printing available in multiple sizes.",
    features: ["Premium print", "Full color", "Custom design", "Fast delivery"],
    variants: [
      { id: "A4", name: "A4 Size", image: "/products/business-collaterals/A4 Flyer Printing.png" },
      { id: "A5", name: "A5 Size", image: "/products/business-collaterals/A5 Flyer Printing.png" },
      { id: "DL", name: "DL Size", image: "/products/business-collaterals/DL Flyer Printing.png" }
    ],
    templates: [
      { id: "A4_template", variantId: "A4", name: "Modern Flyer (A4)", image: "/products/business-collaterals/A4 Flyer Printing.png", configUrl: "/templates/flyer-printing/A4.json" },
      { id: "A5_template", variantId: "A5", name: "Floral Flyer (A5)", image: "/products/business-collaterals/A5 Flyer Printing.png", configUrl: "/templates/flyer-printing/A5.json" },
      { id: "DL_template", variantId: "DL", name: "Elegant Flyer (DL)", image: "/products/business-collaterals/DL Flyer Printing.png", configUrl: "/templates/flyer-printing/DL.json" }
    ],
  },
  {
    id: "booklet-printing",
    slug: "booklet-printing",
    name: "Booklet Printing",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Booklets",
    image: "/products/business-collaterals/A4 Booklets.png",
    images: ["/products/business-collaterals/A4 Booklets.png"],
    price: 194.45,
    description: "Premium booklet printing available in multiple sizes.",
    features: ["Multi-page", "Professional finish", "Custom design", "Premium paper"],
    variants: [
      { id: "A4", name: "A4 Size", image: "/products/business-collaterals/A4 Booklets.png" },
      { id: "A5", name: "A5 Size", image: "/products/business-collaterals/A5 Booklet.png" }
    ],
    templates: [
      { id: "A4_booklet_template", variantId: "A4", name: "Standard Booklet (A4)", image: "/products/business-collaterals/A4 Booklets.png", configUrl: "/templates/booklet/A4/template.json" },
      { id: "A5_booklet_template", variantId: "A5", name: "Standard Booklet (A5)", image: "/products/business-collaterals/A5 Booklet.png", configUrl: "/templates/booklet/A5/template.json" }
    ],
  },
  {
    id: "bond-paper-letterheads",
    slug: "bond-paper-letterheads",
    name: "Bond Paper Letterheads",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Letterheads",
    image: "/products/business-collaterals/Bond Paper Letterheads.png",
    images: ["/products/business-collaterals/Bond Paper Letterheads.png"],
    price: 199,
    description: "Professional bond paper letterheads.",
    features: ["Corporate branding", "Premium paper", "Custom logo", "Sharp print"],
  },
  {
    id: "business-cards",
    slug: "business-cards",
    name: "Business Cards",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Business Cards",
    image: "/products/business-collaterals/Business Cards.png",
    images: ["/products/business-collaterals/Business Cards.png"],
    price: 149,
    description: "Professional business cards.",
    features: ["Double-sided", "Premium stock", "Custom design", "High quality"],
  },
  {
    id: "c5-full-colour-print",
    slug: "c5-full-colour-print",
    name: "C5 Full Colour Print",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Printing",
    image: "/products/business-collaterals/C5 Full Colour Print.png",
    images: ["/products/business-collaterals/C5 Full Colour Print.png"],
    price: 220,
    description: "Vibrant C5 full colour printing.",
    features: ["High resolution", "Premium color", "Custom artwork", "Professional output"],
  },
  {
    id: "canvas-diaries",
    slug: "canvas-diaries",
    name: "Canvas Diaries",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Diaries",
    image: "/products/business-collaterals/Canvas Diaries.png",
    images: ["/products/business-collaterals/Canvas Diaries.png"],
    price: 399,
    description: "Elegant canvas diaries.",
    features: ["Durable cover", "Premium pages", "Custom branding", "Professional look"],
  },

  {
    id: "dl-notepads",
    slug: "dl-notepads",
    name: "DL Notepads",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Notepads",
    image: "/products/business-collaterals/DL Notepads.png",
    images: ["/products/business-collaterals/DL Notepads.png"],
    price: 159,
    description: "Custom DL notepads.",
    features: ["Corporate branding", "Premium paper", "Custom printing", "Professional finish"],
  },

  {
    id: "hardcover-diaries",
    slug: "hardcover-diaries",
    name: "Hardcover Diaries",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Diaries",
    image: "/products/business-collaterals/Hardcover Diaries.png",
    images: ["/products/business-collaterals/Hardcover Diaries.png"],
    price: 499,
    description: "Premium hardcover diaries.",
    features: ["Hard cover", "Premium pages", "Luxury finish", "Corporate gifting"],
  },

  {
    id: "lanyard",
    slug: "lanyard",
    name: "Lanyard",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Accessories",
    image: "/products/business-collaterals/Lanyard.png",
    images: ["/products/business-collaterals/Lanyard.png"],
    price: 99,
    description: "Custom branded lanyards.",
    features: ["Custom logo", "Durable material", "Professional branding", "Bulk orders"],
  },

  {
    id: "multicolour-bill-book",
    slug: "multicolour-bill-book",
    name: "Multicolour Bill Book",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Bill Books",
    image: "/products/business-collaterals/Multicolour Bill Book.png",
    images: ["/products/business-collaterals/Multicolour Bill Book.png"],
    price: 299,
    description: "Multicolour duplicate bill books.",
    features: ["Multiple colors", "Custom branding", "Professional printing", "Business use"],
  },

  {
    id: "no-10-full-colour-print",
    slug: "no-10-full-colour-print",
    name: "No 10 Full Colour Print",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Printing",
    image: "/products/business-collaterals/No 10 Full Colour Print.png",
    images: ["/products/business-collaterals/No 10 Full Colour Print.png"],
    price: 210,
    description: "No 10 full colour print service.",
    features: ["Premium colors", "High resolution", "Custom artwork", "Professional finish"],
  },

  {
    id: "notepads",
    slug: "notepads",
    name: "Notepads",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Notepads",
    image: "/products/business-collaterals/Notepads.png",
    images: ["/products/business-collaterals/Notepads.png"],
    price: 129,
    description: "Custom printed notepads.",
    features: ["Professional branding", "Premium paper", "Custom design", "Office use"],
  },

  {
    id: "personalized-poster-calendar",
    slug: "personalized-poster-calendar",
    name: "Personalized Poster Calendar",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Calendars",
    image: "/products/business-collaterals/Personalized Poster Calendar.png",
    images: ["/products/business-collaterals/Personalized Poster Calendar.png"],
    price: 349,
    description: "Custom poster calendars.",
    features: ["Personalized", "Premium print", "Large format", "Corporate gifting"],
  },

  {
    id: "photo-wall-calendars",
    slug: "photo-wall-calendars",
    name: "Photo Wall Calendars",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Calendars",
    image: "/products/business-collaterals/Photo Wall Calendars.png",
    images: ["/products/business-collaterals/Photo Wall Calendars.png"],
    price: 399,
    description: "Photo wall calendars.",
    features: ["Custom photos", "Premium print", "Wall display", "Gift option"],
  },

  {
    id: "rubber-stamps",
    slug: "rubber-stamps",
    name: "Rubber Stamps",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Office Essentials",
    image: "/products/business-collaterals/Rubber Stamps.png",
    images: ["/products/business-collaterals/Rubber Stamps.png"],
    price: 179,
    description: "Custom rubber stamps.",
    features: ["Custom text", "Durable", "Professional use", "Quick production"],
  },

  {
    id: "softcover-diaries",
    slug: "softcover-diaries",
    name: "Softcover Diaries",
    category: "business-collaterals",
    categoryTitle: "Business Collaterals",
    subcategory: "Diaries",
    image: "/products/business-collaterals/Softcover Diaries.png",
    images: ["/products/business-collaterals/Softcover Diaries.png"],
    price: 299,
    description: "Premium softcover diaries.",
    features: ["Lightweight", "Professional finish", "Custom branding", "Corporate gifting"],
  }
];

export function getProductById(id: string) {
  return products.find((product) => product.id === id);
}

export function getProductByCategory(category: string) {
  return products.filter((product) => product.category === category);
}

export function getProductsByIds(ids: string[]) {
  const idSet = new Set(ids);
  return products.filter((product) => idSet.has(product.id));
}

const normalizeValue = (value?: string | null) => (value ?? "").trim().toLowerCase();

const createSlug = (value?: string | null) =>
  normalizeValue(value)
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const createCategory = (value?: string | null) =>
  normalizeValue(value)
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const normalizedProducts = products.map((product) => {
  const category = product.category
    ? normalizeValue(product.category)
    : createCategory(product.categoryTitle ?? product.name);
  const slug = product.slug ? normalizeValue(product.slug) : createSlug(product.name);

  return {
    ...product,
    category,
    slug,
  };
});

export function getProductByCategoryAndSlug(category: string, slug: string) {
  const normalizedCategory = normalizeValue(category);
  const normalizedSlug = normalizeValue(slug);

  console.log("[products] Searching Category:", category);
  console.log("[products] Searching Slug:", slug);
  normalizedProducts.forEach((product) => {
    console.log({
      name: product?.name,
      category: product?.category,
      slug: product?.slug,
    });
  });

  const matchedProduct =
    normalizedProducts.find((product) => {
      if (!product?.category || !product?.slug) {
        console.warn("[products] Skipping invalid product:", product);
        return false;
      }

      return (
        normalizeValue(product.category) === normalizedCategory &&
        normalizeValue(product.slug) === normalizedSlug
      );
    }) ?? null;

  console.log("[products] matched=", matchedProduct?.id ?? "none");
  return matchedProduct;
}

const missingCategoryProducts = products.filter((product) => !product?.category);
const missingSlugProducts = products.filter((product) => !product?.slug);
const malformedProducts = products.filter(
  (product) =>
    !product ||
    typeof product !== "object" ||
    Array.isArray(product) ||
    typeof product.id !== "string" ||
    typeof product.name !== "string" ||
    typeof product.category !== "string" ||
    typeof product.slug !== "string"
);

if (missingCategoryProducts.length > 0) {
  console.warn("[products] products missing category:", missingCategoryProducts);
}

if (missingSlugProducts.length > 0) {
  console.warn("[products] products missing slug:", missingSlugProducts);
}

if (malformedProducts.length > 0) {
  console.warn("[products] malformed product objects:", malformedProducts);
}
