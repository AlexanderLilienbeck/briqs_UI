// ========================================
// EXTERNAL API SERVICE
// ========================================
// Service for fetching products from external API with error handling

import { FeaturedProductsResponse, UnifiedProduct, transformAPIResponse } from '../types/api-products';

// External API configuration
const EXTERNAL_API_BASE_URL = 'https://web-u7lq49qv2x24.up-de-fra1-k8s-1.apps.run-on-seenode.com';
const BUYER_ID = 1; // MVP: Always use buyer_id=1

// Import the image utility function
const getRandomProductImages = (productType?: 'excavator' | 'aluminum_sheet'): string[] => {
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
  
  const numImages = Math.floor(Math.random() * 3) + 1;
  const shuffledImages = [...availableImages].sort(() => Math.random() - 0.5);
  return shuffledImages.slice(0, numImages);
};

// API service class
export class ExternalAPIService {
  private static instance: ExternalAPIService;
  private cache: Map<string, { data: UnifiedProduct[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ExternalAPIService {
    if (!ExternalAPIService.instance) {
      ExternalAPIService.instance = new ExternalAPIService();
    }
    return ExternalAPIService.instance;
  }

  // Fetch featured products from external API
  async fetchFeaturedProducts(): Promise<UnifiedProduct[]> {
    const cacheKey = `featured-products-${BUYER_ID}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Returning cached products');
      return cached.data;
    }

    try {
      const url = `${EXTERNAL_API_BASE_URL}/api/featuredProducts?buyer_id=${BUYER_ID}`;
      console.log('Fetching from external API:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout
        signal: AbortSignal.timeout(10000), // 10 seconds timeout
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const apiResponse: FeaturedProductsResponse = await response.json();
      
      // Validate response structure
      if (!this.validateAPIResponse(apiResponse)) {
        throw new Error('Invalid API response structure');
      }

      // Transform API response to internal format
      const products = transformAPIResponse(apiResponse);
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: products,
        timestamp: Date.now()
      });

      console.log(`Successfully fetched ${products.length} products from external API`);
      return products;

    } catch (error) {
      console.error('Error fetching from external API:', error);
      
      // Return fallback data if API fails
      return this.getFallbackProducts();
    }
  }

  // Validate API response structure
  private validateAPIResponse(response: any): response is FeaturedProductsResponse {
    return (
      response &&
      typeof response.buyer_id === 'number' &&
      Array.isArray(response.recommended_excavators) &&
      Array.isArray(response.recommended_aluminum_sheets) &&
      typeof response.total_recommendations === 'number'
    );
  }

  // Fallback products when API is unavailable
  private getFallbackProducts(): UnifiedProduct[] {
    return [
      {
        id: 'fallback-exc-001',
        name: 'Caterpillar 320D Hydraulic Excavator (Fallback)',
        seller_name: 'Demo Equipment',
        price: 85000.0,
        brand: 'Caterpillar',
        model: '320D',
        year: 2018,
        condition: 'Used - Good',
        lifting_capacity_tons: 20.5,
        operating_weight_tons: 20.8,
        max_digging_depth_m: 6.5,
        bucket_capacity_m3: 1.2,
        seller_playbook: 'fallback_playbook.json',
        productType: 'excavator',
        images: getRandomProductImages('excavator')
      },
      {
        id: 'fallback-alu-001',
        name: 'Aluminum Sheet 6061-T6 (Fallback)',
        seller_name: 'Demo Materials',
        price: 95.0,
        availability: 50,
        thickness_mm: 1.5,
        total_weight_kg: 15.0,
        seller_playbook: 'fallback_playbook.json',
        productType: 'aluminum_sheet',
        images: getRandomProductImages('aluminum_sheet')
      },
      {
        id: 'fallback-alu-002',
        name: 'Aluminum Sheet 2024-T3 (Fallback)',
        seller_name: 'Demo Supplier',
        price: 120.0,
        availability: 30,
        thickness_mm: 2.0,
        total_weight_kg: 20.0,
        seller_playbook: 'fallback_playbook.json',
        productType: 'aluminum_sheet',
        images: getRandomProductImages('aluminum_sheet')
      }
    ];
  }

  // Find single product by ID
  async findProductById(id: string): Promise<UnifiedProduct | null> {
    const products = await this.fetchFeaturedProducts();
    return products.find(product => product.id === id) || null;
  }

  // Clear cache (useful for testing)
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const apiService = ExternalAPIService.getInstance(); 