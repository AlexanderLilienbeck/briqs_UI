// ========================================
// EXTERNAL API SERVICE
// ========================================
// Service for fetching products from external API with error handling

import { FeaturedProductsResponse, UnifiedProduct, transformAPIResponse } from '../types/api-products';

// External API configuration
const EXTERNAL_API_BASE_URL = 'http://localhost:8000';
const BUYER_ID = 1; // MVP: Always use buyer_id=1

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
    console.log('Using fallback products due to API unavailability');
    
    return [
      // Fallback excavators
      {
        id: 'fallback-exc-001',
        name: 'Caterpillar 320 (Fallback)',
        seller_name: 'Demo Seller',
        brand: 'Caterpillar',
        model: '320',
        year: 2022,
        price: 180000,
        condition: 'Used',
        lifting_capacity_tons: 20.5,
        operating_weight_tons: 20.8,
        max_digging_depth_m: 6.5,
        bucket_capacity_m3: 1.2,
        seller_playbook: 'fallback_playbook.json',
        productType: 'excavator',
        images: ['/images/products/product-1.jpg', '/images/products/product-2.jpg']
      },
      {
        id: 'fallback-exc-002',
        name: 'Komatsu PC200 (Fallback)',
        seller_name: 'Demo Seller',
        brand: 'Komatsu',
        model: 'PC200',
        year: 2021,
        price: 165000,
        condition: 'Used',
        lifting_capacity_tons: 19.8,
        operating_weight_tons: 19.5,
        max_digging_depth_m: 6.2,
        bucket_capacity_m3: 1.1,
        seller_playbook: 'fallback_playbook.json',
        productType: 'excavator',
        images: ['/images/products/product-3.jpg', '/images/products/product-4.jpg']
      },
      // Fallback aluminum sheets
      {
        id: 'fallback-alu-001',
        name: 'Aluminum Sheet 1100-H14 (Fallback)',
        seller_name: 'Demo Supplier',
        price: 75.0,
        availability: 50,
        thickness_mm: 1.0,
        total_weight_kg: 10.0,
        seller_playbook: 'fallback_playbook.json',
        productType: 'aluminum_sheet',
        images: ['/images/products/product-5.jpg', '/images/products/product-6.jpg']
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
        images: ['/images/products/product-7.jpg', '/images/products/product-1.jpg']
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