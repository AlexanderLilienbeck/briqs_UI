// ========================================
// EXTERNAL API PRODUCT TYPES
// ========================================
// TypeScript interfaces matching the external API response structure

// External API Response structure
export interface FeaturedProductsResponse {
  buyer_id: number;
  recommended_excavators: ExcavatorAPI[];
  recommended_aluminum_sheets: AluminumSheetAPI[];
  total_recommendations: number;
}

// Base product interface from external API
interface BaseProductAPI {
  id: string;
  name: string;
  seller_name: string;
  price: number;
  seller_playbook: string;
}

// Excavator product type (matching API response exactly)
export interface ExcavatorAPI extends BaseProductAPI {
  brand: string;
  model: string;
  year: number;
  condition: string;
  lifting_capacity_tons: number;
  operating_weight_tons: number;
  max_digging_depth_m: number;
  bucket_capacity_m3: number;
}

// Aluminum sheet product type (matching API response exactly)
export interface AluminumSheetAPI extends BaseProductAPI {
  availability: number;
  thickness_mm: number;
  total_weight_kg: number;
}

// Internal product types (with added fields for frontend)
export interface Excavator extends ExcavatorAPI {
  productType: 'excavator';
  images: string[];
}

export interface AluminumSheet extends AluminumSheetAPI {
  productType: 'aluminum_sheet';
  images: string[];
}

// Union type for all product types
export type UnifiedProduct = Excavator | AluminumSheet;

// Product type detection utility
export function getProductType(product: UnifiedProduct): string {
  return product.productType;
}

// Type guards
export function isExcavator(product: UnifiedProduct): product is Excavator {
  return product.productType === 'excavator';
}

export function isAluminumSheet(product: UnifiedProduct): product is AluminumSheet {
  return product.productType === 'aluminum_sheet';
}

// Transform API response to internal format
export function transformAPIResponse(apiResponse: FeaturedProductsResponse): UnifiedProduct[] {
  const products: UnifiedProduct[] = [];
  
  // Add excavators
  apiResponse.recommended_excavators.forEach(excavator => {
    products.push({
      ...excavator,
      productType: 'excavator',
      images: getRandomProductImages('excavator')
    });
  });
  
  // Add aluminum sheets
  apiResponse.recommended_aluminum_sheets.forEach(sheet => {
    products.push({
      ...sheet,
      productType: 'aluminum_sheet',
      images: getRandomProductImages('aluminum_sheet')
    });
  });
  
  return products;
}

// Random image assignment utility
export function getRandomProductImages(productType?: 'excavator' | 'aluminum_sheet'): string[] {
  let availableImages: string[] = [];
  
  if (productType === 'excavator') {
    availableImages = [
      "/images/products/excevator/product-01.jpg",
      "/images/products/excevator/product-04.jpg", 
      "/images/products/excevator/product-013.jpg",
      "/images/products/excevator/construction-equipment-product-02.jpg"
    ];
  } else if (productType === 'aluminum_sheet') {
    availableImages = [
      "/images/products/aluminium/product-01.jpg",
      "/images/products/aluminium/product-02.jpg",
      "/images/products/aluminium/product-03.jpg",
      "/images/products/aluminium/product-04.jpg",
      "/images/products/aluminium/product-05.jpg"
    ];
  } else {
    // Fallback to generic product images
    availableImages = [
      "/images/products/product-1.jpg",
      "/images/products/product-2.jpg",
      "/images/products/product-3.jpg",
      "/images/products/product-4.jpg",
      "/images/products/product-5.jpg",
      "/images/products/product-6.jpg",
      "/images/products/product-7.jpg"
    ];
  }
  
  // Return 1-3 random images
  const numImages = Math.floor(Math.random() * 3) + 1;
  const selectedImages: string[] = [];
  const shuffledImages = [...availableImages].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(numImages, shuffledImages.length); i++) {
    selectedImages.push(shuffledImages[i]);
  }
  
  return selectedImages.length > 0 ? selectedImages : [availableImages[0]];
} 