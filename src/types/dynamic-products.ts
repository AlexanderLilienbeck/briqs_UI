// ========================================
// DYNAMIC PRODUCT TYPE SYSTEM
// ========================================
// Enhanced product types for dynamic description generation
// Based on Pydantic schema requirements

// Base product interface - common fields for all product types
export interface BaseProduct {
  id: string;
  name: string;
  seller_name?: string;
  price: number;
  images: string[];
  
  // Optional fields for compatibility
  category?: string;
  subcategory?: string;
  description?: string;
  keywords?: string[];
  
  // Metadata for product type detection
  productType?: string;
}

// Excavator product type
export interface Excavator extends BaseProduct {
  productType: 'excavator';
  brand: string;
  model: string;
  year: number;
  condition: string;
  lifting_capacity_tons: number;
  operating_weight_tons: number;
  max_digging_depth_m: number;
  bucket_capacity_m3: number;
}

// Aluminum Sheet product type
export interface AluminumSheet extends BaseProduct {
  productType: 'aluminum_sheet';
  availability: number;
  thickness_mm: number;
  total_weight_kg: number;
}

// B2C Product type (existing t-shirts, etc.)
export interface B2CProduct extends BaseProduct {
  productType: 'b2c';
  sizes?: string[];
  colors?: string[];
  quantityAvailable?: number;
  currentPrice?: number;
  discount?: number;
  
  // Legacy fields for backward compatibility
  punctuation?: {
    countOpinions: number;
    punctuation: number;
    votes: Array<{
      value: number;
      count: number;
    }>;
  };
  reviews?: Array<{
    name: string;
    avatar: string;
    description: string;
    punctuation: number;
  }>;
}

// Union type for all product types
export type UnifiedProduct = Excavator | AluminumSheet | B2CProduct;

// Product type detection utility
export function getProductType(product: UnifiedProduct): string {
  if ('productType' in product && product.productType) {
    return product.productType;
  }
  
  // Fallback detection based on properties
  if ('lifting_capacity_tons' in product) return 'excavator';
  if ('thickness_mm' in product) return 'aluminum_sheet';
  if ('sizes' in product || 'colors' in product) return 'b2c';
  
  return 'unknown';
}

// Product type validation
export function isExcavator(product: UnifiedProduct): product is Excavator {
  return getProductType(product) === 'excavator';
}

export function isAluminumSheet(product: UnifiedProduct): product is AluminumSheet {
  return getProductType(product) === 'aluminum_sheet';
}

export function isB2CProduct(product: UnifiedProduct): product is B2CProduct {
  return getProductType(product) === 'b2c';
}

// Attribute categorization for description generation
export interface AttributeCategory {
  title: string;
  icon: string;
  importance: 'high' | 'medium' | 'low';
  attributes: Array<{
    key: string;
    label: string;
    value: string | number;
    unit?: string;
    format?: 'number' | 'text' | 'currency' | 'percentage';
  }>;
}

// Get categorized attributes for a product
export function getCategorizedAttributes(product: UnifiedProduct): AttributeCategory[] {
  const productType = getProductType(product);
  
  switch (productType) {
    case 'excavator':
      return getExcavatorAttributes(product as Excavator);
    case 'aluminum_sheet':
      return getAluminumSheetAttributes(product as AluminumSheet);
    case 'b2c':
      return getB2CAttributes(product as B2CProduct);
    default:
      return getGenericAttributes(product);
  }
}

// Excavator attribute categorization
function getExcavatorAttributes(excavator: Excavator): AttributeCategory[] {
  return [
    {
      title: 'Machine Specifications',
      icon: 'icon-settings',
      importance: 'high',
      attributes: [
        { key: 'brand', label: 'Brand', value: excavator.brand, format: 'text' },
        { key: 'model', label: 'Model', value: excavator.model, format: 'text' },
        { key: 'year', label: 'Year', value: excavator.year, format: 'number' },
        { key: 'condition', label: 'Condition', value: excavator.condition, format: 'text' }
      ]
    },
    {
      title: 'Performance Specifications',
      icon: 'icon-energy',
      importance: 'high',
      attributes: [
        { key: 'lifting_capacity_tons', label: 'Lifting Capacity', value: excavator.lifting_capacity_tons, unit: 'tons', format: 'number' },
        { key: 'operating_weight_tons', label: 'Operating Weight', value: excavator.operating_weight_tons, unit: 'tons', format: 'number' },
        { key: 'max_digging_depth_m', label: 'Max Digging Depth', value: excavator.max_digging_depth_m, unit: 'm', format: 'number' },
        { key: 'bucket_capacity_m3', label: 'Bucket Capacity', value: excavator.bucket_capacity_m3, unit: 'm³', format: 'number' }
      ]
    },
    {
      title: 'Commercial Information',
      icon: 'icon-dollar',
      importance: 'medium',
      attributes: [
        { key: 'seller_name', label: 'Seller', value: excavator.seller_name || 'Not specified', format: 'text' },
        { key: 'price', label: 'Price', value: excavator.price, format: 'currency' }
      ]
    }
  ];
}

// Aluminum sheet attribute categorization
function getAluminumSheetAttributes(sheet: AluminumSheet): AttributeCategory[] {
  return [
    {
      title: 'Material Specifications',
      icon: 'icon-layers',
      importance: 'high',
      attributes: [
        { key: 'thickness_mm', label: 'Thickness', value: sheet.thickness_mm, unit: 'mm', format: 'number' },
        { key: 'total_weight_kg', label: 'Total Weight', value: sheet.total_weight_kg, unit: 'kg', format: 'number' }
      ]
    },
    {
      title: 'Availability & Pricing',
      icon: 'icon-package',
      importance: 'high',
      attributes: [
        { key: 'availability', label: 'Available Quantity', value: sheet.availability, format: 'number' },
        { key: 'price', label: 'Price', value: sheet.price, format: 'currency' },
        { key: 'seller_name', label: 'Seller', value: sheet.seller_name || 'Not specified', format: 'text' }
      ]
    }
  ];
}

// B2C product attribute categorization
function getB2CAttributes(product: B2CProduct): AttributeCategory[] {
  const categories: AttributeCategory[] = [
    {
      title: 'Product Details',
      icon: 'icon-tag',
      importance: 'high',
      attributes: [
        { key: 'name', label: 'Product Name', value: product.name, format: 'text' }
      ]
    }
  ];

  // Add size and color info if available
  if (product.sizes && product.sizes.length > 0) {
    categories[0].attributes.push({
      key: 'sizes',
      label: 'Available Sizes',
      value: product.sizes.join(', '),
      format: 'text'
    });
  }

  if (product.colors && product.colors.length > 0) {
    categories[0].attributes.push({
      key: 'colors',
      label: 'Available Colors',
      value: `${product.colors.length} colors`,
      format: 'text'
    });
  }

  // Add pricing information
  categories.push({
    title: 'Pricing & Availability',
    icon: 'icon-dollar',
    importance: 'high',
    attributes: [
      { key: 'price', label: 'Price', value: product.price, format: 'currency' }
    ]
  });

  if (product.currentPrice && product.currentPrice !== product.price) {
    categories[1].attributes.push({
      key: 'currentPrice',
      label: 'Current Price',
      value: product.currentPrice,
      format: 'currency'
    });
  }

  if (product.quantityAvailable) {
    categories[1].attributes.push({
      key: 'quantityAvailable',
      label: 'Quantity Available',
      value: product.quantityAvailable,
      format: 'number'
    });
  }

  return categories;
}

// Generic attribute categorization for unknown product types
function getGenericAttributes(product: BaseProduct): AttributeCategory[] {
  return [
    {
      title: 'Product Information',
      icon: 'icon-info',
      importance: 'high',
      attributes: [
        { key: 'name', label: 'Product Name', value: product.name, format: 'text' },
        { key: 'price', label: 'Price', value: product.price, format: 'currency' },
        { key: 'seller_name', label: 'Seller', value: product.seller_name || 'Not specified', format: 'text' }
      ]
    }
  ];
}

// Description generation utilities
export interface DescriptionSection {
  title: string;
  content: string;
  icon: string;
}

// Generate dynamic description based on product type
export function generateProductDescription(product: UnifiedProduct): DescriptionSection[] {
  const productType = getProductType(product);
  
  switch (productType) {
    case 'excavator':
      return generateExcavatorDescription(product as Excavator);
    case 'aluminum_sheet':
      return generateAluminumSheetDescription(product as AluminumSheet);
    case 'b2c':
      return generateB2CDescription(product as B2CProduct);
    default:
      return generateGenericDescription(product);
  }
}

// Excavator description generation
function generateExcavatorDescription(excavator: Excavator): DescriptionSection[] {
  return [
    {
      title: 'Equipment Overview',
      icon: 'icon-settings',
      content: `This ${excavator.year} ${excavator.brand} ${excavator.model} excavator is in ${excavator.condition.toLowerCase()} condition. With a lifting capacity of ${excavator.lifting_capacity_tons} tons and an operating weight of ${excavator.operating_weight_tons} tons, this machine is designed for heavy-duty construction and excavation work.`
    },
    {
      title: 'Technical Specifications',
      icon: 'icon-energy',
      content: `The excavator features a maximum digging depth of ${excavator.max_digging_depth_m} meters and a bucket capacity of ${excavator.bucket_capacity_m3} cubic meters. These specifications make it suitable for a wide range of earthmoving and construction applications, from site preparation to material handling.`
    }
  ];
}

// Aluminum sheet description generation
function generateAluminumSheetDescription(sheet: AluminumSheet): DescriptionSection[] {
  return [
    {
      title: 'Material Specifications',
      icon: 'icon-layers',
      content: `High-quality aluminum sheet with a thickness of ${sheet.thickness_mm}mm and total weight of ${sheet.total_weight_kg}kg. This material is suitable for various industrial applications including construction, automotive, and manufacturing sectors.`
    },
    {
      title: 'Availability & Supply',
      icon: 'icon-package',
      content: `Currently available in quantities of ${sheet.availability} units. The aluminum sheet offers excellent corrosion resistance, lightweight properties, and versatile applications across multiple industries.`
    }
  ];
}

// B2C description generation
function generateB2CDescription(product: B2CProduct): DescriptionSection[] {
  return [
    {
      title: 'Product Details',
      icon: 'icon-tag',
      content: `${product.name} ${product.sizes ? `available in sizes: ${product.sizes.join(', ')}` : ''}${product.colors ? ` and ${product.colors.length} different colors` : ''}. ${product.description || 'A quality product designed for everyday use.'}`
    },
    {
      title: 'Pricing & Availability',
      icon: 'icon-dollar',
      content: `${product.currentPrice && product.currentPrice !== product.price ? `Special offer: Now ${product.currentPrice} (was ${product.price})` : `Priced at ${product.price}`}${product.quantityAvailable ? `. ${product.quantityAvailable} units available` : ''}.`
    }
  ];
}

// Generic description generation
function generateGenericDescription(product: BaseProduct): DescriptionSection[] {
  return [
    {
      title: 'Product Information',
      icon: 'icon-info',
      content: `${product.name} ${product.description || 'is available for purchase'}. ${product.seller_name ? `Offered by ${product.seller_name}` : 'Contact seller for more details'}.`
    }
  ];
} 