import { B2BProduct, CommercialTerms, PricingTier } from "./b2b";

// ========================================
// INDUSTRIAL PRODUCT ENHANCEMENTS
// ========================================

// Material and Technical Properties
export interface MaterialProperties {
  grade?: string;
  composition?: Record<string, number>; // e.g., {"Carbon": 0.15, "Chromium": 18.5}
  density?: number; // kg/m³
  tensileStrength?: number; // MPa
  yieldStrength?: number; // MPa
  elongation?: number; // %
  hardness?: string; // e.g., "HRC 45-50"
  thermalConductivity?: number; // W/m·K
  electricalResistivity?: number; // Ω·m
}

export interface PhysicalProperties {
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    diameter?: number;
    thickness?: number;
    unit: "mm" | "cm" | "m" | "inch" | "ft";
  };
  weight?: {
    value: number;
    unit: "g" | "kg" | "t" | "lb" | "oz";
  };
  volume?: {
    value: number;
    unit: "ml" | "l" | "m³" | "ft³" | "gal";
  };
  surfaceFinish?: string; // e.g., "Ra 0.8", "Mirror finish", "Anodized"
  color?: string;
  packaging?: string; // e.g., "Bulk bags", "Palletized", "Drums"
}

export interface PerformanceSpecs {
  operatingTemperature?: {
    min: number;
    max: number;
    unit: "°C" | "°F" | "K";
  };
  pressure?: {
    working: number;
    maximum: number;
    unit: "bar" | "psi" | "Pa" | "MPa";
  };
  flowRate?: {
    value: number;
    unit: "l/min" | "m³/h" | "gpm" | "cfm";
  };
  efficiency?: number; // percentage
  powerRating?: {
    value: number;
    unit: "W" | "kW" | "MW" | "HP";
  };
  voltage?: {
    value: number;
    type: "AC" | "DC";
    frequency?: number; // Hz
  };
  speed?: {
    value: number;
    unit: "rpm" | "m/s" | "ft/min";
  };
}

// Negotiation Variables for Industrial Products
export interface NegotiationVariable {
  id: string;
  name: string;
  type: "range" | "options" | "boolean" | "text";
  description: string;
  priceImpact: "none" | "low" | "medium" | "high";
  leadTimeImpact: "none" | "low" | "medium" | "high";
  
  // For range variables (e.g., coil weight, cut length)
  range?: {
    min: number;
    max: number;
    step: number;
    unit: string;
    default: number;
  };
  
  // For option variables (e.g., coating type, grade selection)
  options?: Array<{
    value: string;
    label: string;
    priceModifier: number; // percentage or fixed amount
    leadTimeModifier: number; // days
    description?: string;
  }>;
  
  // For boolean variables (e.g., certification required)
  booleanDefault?: boolean;
  
  // Dependencies on other variables
  dependencies?: Array<{
    variableId: string;
    condition: string; // e.g., "coating_type == 'anodized'"
    effect: "show" | "hide" | "require" | "disable";
  }>;
}

// Industrial-specific Commercial Terms
export interface IndustrialCommercialTerms extends CommercialTerms {
  // Additional industrial-specific terms
  toolingCosts?: {
    amount: number;
    currency: string;
    description: string;
    amortizedOver?: number; // pieces
  };
  
  setupCosts?: {
    amount: number;
    currency: string;
    description: string;
  };
  
  minimumCommitment?: {
    quantity: number;
    period: "monthly" | "quarterly" | "yearly";
    unit: string;
  };
  
  blanketOrderTerms?: {
    totalQuantity: number;
    deliverySchedule: "call-off" | "scheduled" | "jit";
    validityPeriod: number; // months
    priceProtection: boolean;
  };
  
  qualityTerms?: {
    inspectionLevel: "normal" | "tightened" | "reduced";
    acceptanceRate: number; // percentage
    qualityDocumentation: string[];
    returnPolicy: string;
  };
  
  packagingRequirements?: {
    type: string;
    markingRequirements: string[];
    specialHandling: boolean;
    returnablePackaging: boolean;
  };
  
  shippingTerms?: {
    hazmatClassification?: string;
    specialTransport: boolean;
    insuranceRequired: boolean;
    trackingRequired: boolean;
  };
}

// Enhanced Industrial Product
export interface IndustrialProduct extends Omit<B2BProduct, 'commercialTerms'> {
  // Enhanced specifications
  materialProperties?: MaterialProperties;
  physicalProperties?: PhysicalProperties;
  performanceSpecs?: PerformanceSpecs;
  
  // Industrial-specific fields
  manufacturingProcess?: string;
  qualityGrade?: string;
  applicationAreas: string[]; // e.g., ["automotive", "aerospace", "marine"]
  industryStandards: string[]; // e.g., ["ASTM A240", "EN 10088", "JIS G4305"]
  
  // Regulatory and Compliance
  regulatoryApprovals?: string[]; // e.g., ["FDA 21 CFR 177.1520", "EU 10/2011"]
  environmentalCompliance?: string[]; // e.g., ["RoHS", "REACH", "WEEE"]
  safetyDataSheet?: {
    url: string;
    version: string;
    lastUpdated: Date;
  };
  
  // Supply Chain Information
  countryOfOrigin: string;
  leadTimeFactors?: {
    manufacturing: number; // days
    testing: number; // days
    packaging: number; // days
    shipping: number; // days
  };
  
  // Negotiation Variables
  negotiationVariables: NegotiationVariable[];
  
  // Enhanced Commercial Terms
  commercialTerms: IndustrialCommercialTerms;
  
  // Technical Documentation
  technicalDocuments?: Array<{
    type: "datasheet" | "manual" | "certificate" | "drawing" | "sds";
    title: string;
    url: string;
    version?: string;
    language: string;
  }>;
  
  // Alternative Products
  alternatives?: Array<{
    productId: string;
    relationship: "substitute" | "upgrade" | "downgrade" | "complement";
    description: string;
  }>;
  
  // Lifecycle Information
  productLifecycle?: {
    stage: "introduction" | "growth" | "maturity" | "decline" | "obsolete";
    expectedEOL?: Date; // End of Life
    replacementProduct?: string;
  };
}

// Product Template for specific industrial categories
export interface ProductTemplate {
  categoryId: string;
  subcategoryId: string;
  name: string;
  description: string;
  requiredSpecifications: string[];
  optionalSpecifications: string[];
  commonNegotiationVariables: NegotiationVariable[];
  typicalCertifications: string[];
  industryStandards: string[];
  applicationAreas: string[];
}

// Market Index Integration (for metals, commodities)
export interface MarketIndexData {
  indexName: string; // e.g., "LME Aluminum", "Steel HRC"
  currentPrice: number;
  currency: string;
  unit: string; // e.g., "$/MT", "€/kg"
  lastUpdated: Date;
  priceHistory?: Array<{
    date: Date;
    price: number;
  }>;
}

export interface IndexLinkedPricing {
  basePrice: number;
  indexId: string;
  formula: string; // e.g., "basePrice + (currentIndex - 2000) * 0.8"
  updateFrequency: "daily" | "weekly" | "monthly";
  priceProtection?: {
    maxIncrease: number; // percentage
    maxDecrease: number; // percentage
  };
}

// Enhanced Pricing with Industrial Features
export interface IndustrialPricingTier extends PricingTier {
  // Volume-based pricing
  volumeDiscounts?: Array<{
    threshold: number;
    discountPercentage: number;
  }>;
  
  // Time-based pricing
  contractLength?: {
    months: number;
    discountPercentage: number;
  };
  
  // Index-linked pricing for commodities
  indexLinkedPricing?: IndexLinkedPricing;
  
  // Additional costs
  additionalCosts?: Array<{
    type: "tooling" | "setup" | "testing" | "certification" | "shipping";
    amount: number;
    description: string;
    oneTime: boolean;
  }>;
}

// Search and Filter Types for Industrial Products
export interface IndustrialSearchFilters {
  // Basic filters
  categories?: string[];
  subcategories?: string[];
  keywords?: string[];
  
  // Technical filters
  materialGrades?: string[];
  pressureRange?: { min: number; max: number };
  temperatureRange?: { min: number; max: number };
  powerRange?: { min: number; max: number };
  
  // Certification filters
  certifications?: string[];
  industryStandards?: string[];
  regulatoryApprovals?: string[];
  
  // Commercial filters
  priceRange?: { min: number; max: number; currency: string };
  leadTimeMax?: number; // days
  minimumOrderQuantity?: { min: number; max: number };
  
  // Application filters
  applicationAreas?: string[];
  industrySegments?: string[];
  
  // Supplier filters
  supplierCountries?: string[];
  supplierCertifications?: string[];
  
  // Availability filters
  stockAvailable?: boolean;
  customManufacturing?: boolean;
}

export default IndustrialProduct; 