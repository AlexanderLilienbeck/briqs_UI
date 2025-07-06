import type { B2BProduct } from "../../types/b2b";

// Sample B2B products for testing and development
export const sampleB2BProducts: B2BProduct[] = [
  {
    id: "b2b-001",
    supplierId: "supplier-001",
    name: "Industrial Stainless Steel Bolts M8x50",
    description:
      "High-grade stainless steel bolts suitable for industrial applications. Grade 316 material with excellent corrosion resistance. Perfect for marine and chemical environments.",
    category: "Industrial Hardware",
    subcategory: "Fasteners",
    sku: "SSB-M8-50-316",
    images: [
      "/images/products/industrial-bolts-1.jpg",
      "/images/products/industrial-bolts-2.jpg",
    ],
    specifications: {
      Material: "Stainless Steel 316",
      "Thread Size": "M8",
      Length: "50mm",
      "Head Type": "Hex",
      "Tensile Strength": "700 MPa",
      "Corrosion Resistance": "Excellent",
      "Temperature Range": "-200°C to +400°C",
      Coating: "None (Natural Finish)",
      Standards: "DIN 912, ISO 4762",
    },
    certifications: [
      "ISO 9001:2015",
      "CE Marking",
      "Material Certificate 3.1",
      "REACH Compliance",
    ],
    commercialTerms: {
      pricing: [
        {
          minQuantity: 100,
          maxQuantity: 999,
          unitPrice: 0.85,
          currency: "EUR",
        },
        {
          minQuantity: 1000,
          maxQuantity: 4999,
          unitPrice: 0.72,
          currency: "EUR",
        },
        {
          minQuantity: 5000,
          maxQuantity: 19999,
          unitPrice: 0.65,
          currency: "EUR",
        },
        { minQuantity: 20000, unitPrice: 0.58, currency: "EUR" },
      ],
      paymentTerms: "net_30",
      deliveryTerms: "ex_works",
      leadTime: {
        min: 7,
        max: 14,
        unit: "days",
      },
      minimumOrderQuantity: 100,
      validUntil: new Date("2025-06-30"),
      currency: "EUR",
      includesVAT: false,
      warrantyPeriod: {
        duration: 24,
        unit: "months",
      },
    },
    negotiationBoundaries: {
      priceFlexibility: 15, // 15% price flexibility
      quantityFlexibility: 20, // 20% quantity flexibility
      deliveryFlexibility: 7, // 7 days delivery flexibility
      paymentTermsFlexible: true,
    },
    keywords: [
      "stainless steel",
      "bolts",
      "industrial",
      "fasteners",
      "M8",
      "316 grade",
      "corrosion resistant",
      "marine grade",
    ],
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-30"),
  },
  {
    id: "b2b-002",
    supplierId: "supplier-002",
    name: "Premium Office Chairs - Ergonomic Series",
    description:
      "Professional ergonomic office chairs designed for long-term comfort and productivity. Features adjustable lumbar support, breathable mesh back, and premium materials. Ideal for corporate environments.",
    category: "Office Furniture",
    subcategory: "Seating",
    sku: "EOC-PREM-001",
    images: [
      "/images/products/office-chair-1.jpg",
      "/images/products/office-chair-2.jpg",
      "/images/products/office-chair-3.jpg",
    ],
    specifications: {
      Material: "Mesh Back, Fabric Seat",
      Frame: "Aluminum Alloy",
      "Weight Capacity": "150kg",
      "Seat Height": "42-52cm adjustable",
      "Backrest Height": "65cm",
      Armrests: "Adjustable 3D",
      Base: "5-Point Nylon with Casters",
      Warranty: "5 Years",
      Certifications: "BIFMA, GREENGUARD",
      "Colors Available": "Black, Gray, Navy Blue",
    },
    certifications: [
      "BIFMA X5.1",
      "GREENGUARD Gold",
      "ISO 14001",
      "FSC Certified Materials",
    ],
    commercialTerms: {
      pricing: [
        { minQuantity: 10, maxQuantity: 49, unitPrice: 285.0, currency: "EUR" },
        { minQuantity: 50, maxQuantity: 99, unitPrice: 265.0, currency: "EUR" },
        {
          minQuantity: 100,
          maxQuantity: 249,
          unitPrice: 245.0,
          currency: "EUR",
        },
        { minQuantity: 250, unitPrice: 225.0, currency: "EUR" },
      ],
      paymentTerms: "net_30",
      deliveryTerms: "dap",
      leadTime: {
        min: 14,
        max: 21,
        unit: "days",
      },
      minimumOrderQuantity: 10,
      validUntil: new Date("2025-03-31"),
      currency: "EUR",
      includesVAT: false,
      warrantyPeriod: {
        duration: 5,
        unit: "years",
      },
    },
    negotiationBoundaries: {
      priceFlexibility: 12,
      quantityFlexibility: 15,
      deliveryFlexibility: 10,
      paymentTermsFlexible: true,
    },
    keywords: [
      "office chairs",
      "ergonomic",
      "corporate furniture",
      "adjustable",
      "mesh back",
      "professional",
      "workplace",
      "comfort",
    ],
    isActive: true,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "b2b-003",
    supplierId: "supplier-003",
    name: "Industrial LED Lighting Systems - 200W",
    description:
      "High-efficiency LED lighting systems designed for industrial and warehouse applications. IP65 rated for harsh environments, with smart controls and energy monitoring capabilities.",
    category: "Industrial Equipment",
    subcategory: "Lighting",
    sku: "ILS-LED-200W-IP65",
    images: [
      "/images/products/led-industrial-1.jpg",
      "/images/products/led-industrial-2.jpg",
    ],
    specifications: {
      Power: "200W",
      "Luminous Flux": "26000 lm",
      Efficacy: "130 lm/W",
      "Color Temperature": "5000K (Daylight)",
      "IP Rating": "IP65",
      "Operating Temperature": "-30°C to +50°C",
      "Beam Angle": "120°",
      Dimming: "0-10V, DALI",
      Lifespan: "50,000 hours",
      Mounting: "Ceiling/Wall/Pole",
      Weight: "4.2kg",
    },
    certifications: [
      "CE Marking",
      "RoHS Compliant",
      "Energy Star",
      "IES LM-80",
      "UL Listed",
    ],
    commercialTerms: {
      pricing: [
        { minQuantity: 5, maxQuantity: 19, unitPrice: 165.0, currency: "EUR" },
        { minQuantity: 20, maxQuantity: 49, unitPrice: 155.0, currency: "EUR" },
        { minQuantity: 50, maxQuantity: 99, unitPrice: 145.0, currency: "EUR" },
        { minQuantity: 100, unitPrice: 135.0, currency: "EUR" },
      ],
      paymentTerms: "net_30",
      deliveryTerms: "fob",
      leadTime: {
        min: 10,
        max: 18,
        unit: "days",
      },
      minimumOrderQuantity: 5,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      warrantyPeriod: {
        duration: 5,
        unit: "years",
      },
    },
    negotiationBoundaries: {
      priceFlexibility: 10,
      quantityFlexibility: 25,
      deliveryFlexibility: 5,
      paymentTermsFlexible: false,
    },
    keywords: [
      "LED lighting",
      "industrial",
      "warehouse",
      "high bay",
      "energy efficient",
      "IP65",
      "smart controls",
      "200W",
    ],
    isActive: true,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-12-29"),
  },
];

// Sample buyer requests for testing matching algorithms
export const sampleBuyerRequests = [
  {
    id: "req-001",
    buyerId: "buyer-001",
    title: "Need 2000 units of stainless steel bolts M8",
    description:
      "Looking for high-quality stainless steel bolts for marine application. Must be corrosion resistant and suitable for saltwater environment.",
    category: "Industrial Hardware",
    subcategory: "Fasteners",
    specifications: {
      Material: "Stainless Steel",
      "Thread Size": "M8",
      Length: "45-55mm",
      "Corrosion Resistance": "Marine Grade",
    },
    quantity: {
      min: 2000,
      max: 3000,
      unit: "pieces",
    },
    budget: {
      min: 1200,
      max: 1800,
      currency: "EUR",
    },
    deliveryRequirements: {
      location: {
        city: "Hamburg",
        country: "Germany",
      },
      deadline: new Date("2025-02-15"),
      terms: "dap" as const,
    },
    paymentPreferences: {
      terms: "net_30" as const,
    },
    additionalRequirements:
      "Material certificates required. Prefer German or EU suppliers.",
    urgency: "medium" as const,
    status: "active" as const,
    createdAt: new Date("2024-12-28"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "req-002",
    buyerId: "buyer-002",
    title: "Office furniture for new headquarters - 150 chairs",
    description:
      "Setting up new office space and need high-quality ergonomic chairs for employees. Focus on comfort and durability.",
    category: "Office Furniture",
    subcategory: "Seating",
    specifications: {
      Type: "Ergonomic Office Chair",
      Features: "Adjustable lumbar support",
      Material: "Mesh or fabric",
      Warranty: "Minimum 3 years",
    },
    quantity: {
      min: 150,
      max: 180,
      unit: "pieces",
    },
    budget: {
      min: 30000,
      max: 45000,
      currency: "EUR",
    },
    deliveryRequirements: {
      location: {
        city: "Munich",
        country: "Germany",
      },
      deadline: new Date("2025-03-01"),
      terms: "dap" as const,
    },
    paymentPreferences: {
      terms: "net_30" as const,
    },
    additionalRequirements:
      "Installation service preferred. Bulk discount expected.",
    urgency: "high" as const,
    status: "active" as const,
    createdAt: new Date("2024-12-29"),
    updatedAt: new Date("2024-12-29"),
  },
];

// Helper functions for working with B2B data
export const getProductsByCategory = (category: string): B2BProduct[] => {
  return sampleB2BProducts.filter((product) =>
    product.category.toLowerCase().includes(category.toLowerCase()),
  );
};

export const getProductsBySupplier = (supplierId: string): B2BProduct[] => {
  return sampleB2BProducts.filter(
    (product) => product.supplierId === supplierId,
  );
};

export const getActiveProducts = (): B2BProduct[] => {
  return sampleB2BProducts.filter((product) => product.isActive);
};

export const searchProducts = (query: string): B2BProduct[] => {
  const searchTerm = query.toLowerCase();
  return sampleB2BProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm),
      ),
  );
};
