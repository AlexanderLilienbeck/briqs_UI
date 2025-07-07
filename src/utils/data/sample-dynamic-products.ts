import { Excavator, AluminumSheet, B2CProduct, UnifiedProduct } from '../../types/dynamic-products';
import { getRandomProductImages } from '../../types/api-products';

// Sample Excavator Products
export const sampleExcavators: Excavator[] = [
  {
    id: "exc-001",
    name: "Caterpillar 320D2 Hydraulic Excavator",
    seller_name: "Heavy Equipment Solutions",
    price: 180000,
    images: getRandomProductImages('excavator'),
    productType: "excavator",
    category: "Heavy Machinery",
    subcategory: "Excavators",
    description: "Reliable hydraulic excavator perfect for construction and earthmoving projects",
    keywords: ["excavator", "caterpillar", "construction", "hydraulic", "earthmoving"],
    brand: "Caterpillar",
    model: "320D2",
    year: 2022,
    condition: "Used - Excellent",
    lifting_capacity_tons: 20.5,
    operating_weight_tons: 20.8,
    max_digging_depth_m: 6.5,
    bucket_capacity_m3: 1.2
  },
  {
    id: "exc-002",
    name: "Komatsu PC210LC-10 Excavator",
    seller_name: "Construction Equipment Direct",
    price: 165000,
    images: getRandomProductImages('excavator'),
    productType: "excavator",
    category: "Heavy Machinery",
    subcategory: "Excavators",
    description: "High-performance excavator with advanced hydraulic system",
    keywords: ["excavator", "komatsu", "hydraulic", "construction", "mining"],
    brand: "Komatsu",
    model: "PC210LC-10",
    year: 2021,
    condition: "Used - Good",
    lifting_capacity_tons: 19.8,
    operating_weight_tons: 21.2,
    max_digging_depth_m: 6.7,
    bucket_capacity_m3: 1.18
  },
  {
    id: "exc-003",
    name: "Volvo EC220E Crawler Excavator",
    seller_name: "Nordic Machinery",
    price: 195000,
    images: getRandomProductImages('excavator'),
    productType: "excavator",
    category: "Heavy Machinery",
    subcategory: "Excavators",
    description: "Fuel-efficient crawler excavator with excellent stability",
    keywords: ["excavator", "volvo", "crawler", "fuel-efficient", "construction"],
    brand: "Volvo",
    model: "EC220E",
    year: 2023,
    condition: "New",
    lifting_capacity_tons: 21.0,
    operating_weight_tons: 22.3,
    max_digging_depth_m: 6.8,
    bucket_capacity_m3: 1.25
  }
];

// Sample Aluminum Sheet Products
export const sampleAluminumSheets: AluminumSheet[] = [
  {
    id: "alu-001",
    name: "6061-T6 Aluminum Sheet - 3mm Thickness",
    seller_name: "Industrial Metals Supply",
    price: 125.50,
    images: getRandomProductImages('aluminum_sheet'),
    productType: "aluminum_sheet",
    category: "Raw Materials",
    subcategory: "Aluminum Sheets",
    description: "High-grade 6061-T6 aluminum sheet suitable for aerospace and automotive applications",
    keywords: ["aluminum", "6061-T6", "sheet", "aerospace", "automotive", "metal"],
    availability: 100,
    thickness_mm: 3.0,
    total_weight_kg: 22.5
  },
  {
    id: "alu-002",
    name: "5052-H32 Marine Grade Aluminum Sheet",
    seller_name: "Marine Materials Corp",
    price: 98.75,
    images: getRandomProductImages('aluminum_sheet'),
    productType: "aluminum_sheet",
    category: "Raw Materials",
    subcategory: "Aluminum Sheets",
    description: "Corrosion-resistant marine grade aluminum sheet perfect for boat building and marine applications",
    keywords: ["aluminum", "5052-H32", "marine", "corrosion-resistant", "boat", "sheet"],
    availability: 75,
    thickness_mm: 2.5,
    total_weight_kg: 18.8
  },
  {
    id: "alu-003",
    name: "1100-O Pure Aluminum Sheet - Ultra Thin",
    seller_name: "Precision Alloys Ltd",
    price: 65.25,
    images: getRandomProductImages('aluminum_sheet'),
    productType: "aluminum_sheet",
    category: "Raw Materials",
    subcategory: "Aluminum Sheets",
    description: "Ultra-thin pure aluminum sheet ideal for electrical and packaging applications",
    keywords: ["aluminum", "1100-O", "pure", "thin", "electrical", "packaging"],
    availability: 200,
    thickness_mm: 0.5,
    total_weight_kg: 3.75
  }
];

// Convert existing B2C product to new format (example)
export const sampleB2CProducts: B2CProduct[] = [
  {
    id: "b2c-001",
    name: "T-Shirt Summer Vibes",
    seller_name: "Fashion Forward Ltd.",
    price: 119.99,
    images: ["/images/products/product-1.jpg"],
    productType: "b2c",
    category: "Clothing",
    subcategory: "T-Shirts",
    description: "White Summer Vibes T-shirt in the uiKit line with a colorful print. Made of jersey cotton.",
    keywords: ["t-shirt", "summer", "cotton", "fashion", "casual"],
    sizes: ["xl", "l", "m", "s"],
    colors: ["#000", "#6F3E18", "#D4BE8D", "#FFF"],
    quantityAvailable: 2,
    currentPrice: 89.99,
    discount: 30,
    punctuation: {
      countOpinions: 81,
      punctuation: 4.5,
      votes: [
        { value: 1, count: 1 },
        { value: 2, count: 10 },
        { value: 3, count: 10 },
        { value: 4, count: 20 },
        { value: 5, count: 40 }
      ]
    },
    reviews: [
      {
        name: "John Doe",
        avatar: "/images/featured-1.jpg",
        description: "<p>Great quality t-shirt, fits perfectly and the print is vibrant!</p>",
        punctuation: 5
      },
      {
        name: "Jane Smith",
        avatar: "/images/featured-2.jpg",
        description: "<p>Love the material and the summer vibes design. Highly recommend!</p>",
        punctuation: 4
      }
    ]
  }
];

// Combined sample products for testing
export const allSampleProducts: UnifiedProduct[] = [
  ...sampleExcavators,
  ...sampleAluminumSheets,
  ...sampleB2CProducts
];

// Helper function to get product by ID
export function getProductById(id: string): UnifiedProduct | undefined {
  return allSampleProducts.find(product => product.id === id);
}

// Helper function to get products by type
export function getProductsByType(type: 'excavator' | 'aluminum_sheet' | 'b2c'): UnifiedProduct[] {
  return allSampleProducts.filter(product => product.productType === type);
} 