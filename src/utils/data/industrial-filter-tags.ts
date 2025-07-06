// Smart Filter Tag System for Industrial Products
// Designed for sophisticated B2B industrial filtering

export interface FilterTag {
  id: string;
  name: string;
  category: string;
  description: string;
  color?: string;
  icon?: string;
  relatedTags?: string[];
  exclusiveTags?: string[]; // Tags that cannot be selected together
}

export interface FilterCategory {
  id: string;
  name: string;
  description: string;
  tags: FilterTag[];
  allowMultiple: boolean;
  displayOrder: number;
}

// Material Categories
export const materialFilterTags: FilterTag[] = [
  // Metals
  {
    id: "steel",
    name: "Steel",
    category: "materials",
    description: "Carbon steel, alloy steel products",
    color: "#708090",
    relatedTags: ["carbon-steel", "alloy-steel", "coated"]
  },
  {
    id: "stainless-steel",
    name: "Stainless Steel",
    category: "materials", 
    description: "Corrosion-resistant stainless steel",
    color: "#C0C0C0",
    relatedTags: ["316l", "304", "pharma-grade"]
  },
  {
    id: "aluminum",
    name: "Aluminum",
    category: "materials",
    description: "Aluminum alloys and extrusions",
    color: "#D3D3D3",
    relatedTags: ["6061", "anodized", "precision-cut"]
  },
  {
    id: "carbon-steel",
    name: "Carbon Steel",
    category: "materials",
    description: "Low to high carbon steel grades",
    color: "#2F4F4F"
  },
  
  // Polymers
  {
    id: "hdpe",
    name: "HDPE",
    category: "materials",
    description: "High-density polyethylene",
    color: "#4169E1",
    relatedTags: ["injection-grade", "food-contact"]
  },
  {
    id: "engineering-plastics",
    name: "Engineering Plastics",
    category: "materials",
    description: "High-performance polymer materials",
    color: "#9932CC"
  },
  {
    id: "injection-grade",
    name: "Injection Grade",
    category: "materials",
    description: "Suitable for injection molding",
    color: "#4682B4"
  }
];

// Technical Specifications
export const technicalFilterTags: FilterTag[] = [
  // Pressure Ratings
  {
    id: "low-pressure",
    name: "Low Pressure",
    category: "technical",
    description: "Up to 150 PSI",
    exclusiveTags: ["medium-pressure", "high-pressure"]
  },
  {
    id: "medium-pressure",
    name: "Medium Pressure",
    category: "technical", 
    description: "150-1000 PSI",
    exclusiveTags: ["low-pressure", "high-pressure"]
  },
  {
    id: "high-pressure",
    name: "High Pressure",
    category: "technical",
    description: "Above 1000 PSI",
    exclusiveTags: ["low-pressure", "medium-pressure"]
  },
  
  // Temperature Ranges
  {
    id: "cryogenic",
    name: "Cryogenic",
    category: "technical",
    description: "Below -150°C operation",
    exclusiveTags: ["high-temperature"]
  },
  {
    id: "high-temperature",
    name: "High Temperature",
    category: "technical",
    description: "Above 200°C operation",
    exclusiveTags: ["cryogenic"]
  },
  
  // Precision Classes
  {
    id: "standard-precision",
    name: "Standard Precision",
    category: "technical",
    description: "General industrial tolerance",
    exclusiveTags: ["high-precision", "ultra-precision"]
  },
  {
    id: "high-precision",
    name: "High Precision",
    category: "technical",
    description: "Tight tolerance applications",
    exclusiveTags: ["standard-precision", "ultra-precision"]
  },
  {
    id: "ultra-precision",
    name: "Ultra Precision",
    category: "technical",
    description: "Critical precision applications",
    exclusiveTags: ["standard-precision", "high-precision"]
  },
  
  // Power Ratings
  {
    id: "low-power",
    name: "Low Power",
    category: "technical",
    description: "Up to 10 kW",
    exclusiveTags: ["medium-power", "high-power"]
  },
  {
    id: "medium-power",
    name: "Medium Power", 
    category: "technical",
    description: "10-100 kW",
    exclusiveTags: ["low-power", "high-power"]
  },
  {
    id: "high-power",
    name: "High Power",
    category: "technical",
    description: "Above 100 kW",
    exclusiveTags: ["low-power", "medium-power"]
  }
];

// Certifications & Compliance
export const certificationFilterTags: FilterTag[] = [
  // Safety Certifications
  {
    id: "ce-marking",
    name: "CE Marking",
    category: "certifications",
    description: "European Conformity marking",
    color: "#0066CC"
  },
  {
    id: "ul-listed",
    name: "UL Listed",
    category: "certifications",
    description: "Underwriters Laboratories certified",
    color: "#FF6600"
  },
  {
    id: "atex-certified",
    name: "ATEX Certified",
    category: "certifications",
    description: "Explosive atmosphere certified",
    color: "#FF0000"
  },
  
  // Quality Standards
  {
    id: "iso-9001",
    name: "ISO 9001",
    category: "certifications",
    description: "Quality management system",
    color: "#008000"
  },
  {
    id: "as9100",
    name: "AS9100",
    category: "certifications",
    description: "Aerospace quality standard",
    color: "#000080"
  },
  
  // Environmental
  {
    id: "rohs-compliant",
    name: "RoHS Compliant",
    category: "certifications",
    description: "Restriction of Hazardous Substances",
    color: "#32CD32"
  },
  {
    id: "reach-compliant",
    name: "REACH Compliant",
    category: "certifications",
    description: "EU chemical regulation compliance",
    color: "#228B22"
  },
  
  // Industry Specific
  {
    id: "fda-approved",
    name: "FDA Approved",
    category: "certifications",
    description: "Food and Drug Administration approved",
    color: "#DC143C"
  },
  {
    id: "food-grade",
    name: "Food Grade",
    category: "certifications",
    description: "Safe for food contact",
    color: "#FFD700"
  },
  {
    id: "pharma-grade",
    name: "Pharma Grade",
    category: "certifications",
    description: "Pharmaceutical industry compliant",
    color: "#4B0082"
  },
  {
    id: "kosher",
    name: "Kosher",
    category: "certifications",
    description: "Kosher certified",
    color: "#8B4513"
  },
  {
    id: "halal",
    name: "Halal",
    category: "certifications",
    description: "Halal certified",
    color: "#006400"
  }
];

// Commercial Terms
export const commercialFilterTags: FilterTag[] = [
  // Order Quantities
  {
    id: "small-batch",
    name: "Small Batch",
    category: "commercial",
    description: "Low minimum order quantities",
    exclusiveTags: ["bulk-orders"]
  },
  {
    id: "bulk-orders",
    name: "Bulk Orders",
    category: "commercial",
    description: "Large quantity discounts available",
    exclusiveTags: ["small-batch"]
  },
  
  // Delivery Terms
  {
    id: "quick-delivery",
    name: "Quick Delivery",
    category: "commercial",
    description: "Fast lead times available",
    relatedTags: ["stock-items"]
  },
  {
    id: "stock-items",
    name: "Stock Items",
    category: "commercial",
    description: "Available from stock",
    relatedTags: ["quick-delivery"]
  },
  {
    id: "custom-sizing",
    name: "Custom Sizing",
    category: "commercial",
    description: "Cut-to-length or custom dimensions",
    relatedTags: ["made-to-order"]
  },
  {
    id: "made-to-order",
    name: "Made to Order",
    category: "commercial",
    description: "Custom manufactured products",
    relatedTags: ["custom-sizing"]
  },
  
  // Payment & Terms
  {
    id: "volume-discounts",
    name: "Volume Discounts",
    category: "commercial",
    description: "Quantity-based pricing available",
    relatedTags: ["bulk-orders"]
  },
  {
    id: "long-term-contract",
    name: "Long-term Contract",
    category: "commercial",
    description: "Multi-year agreements available"
  },
  
  // Services
  {
    id: "technical-support",
    name: "Technical Support",
    category: "commercial",
    description: "Engineering support included"
  },
  {
    id: "installation-included",
    name: "Installation Included",
    category: "commercial",
    description: "Professional installation service"
  },
  {
    id: "training-included",
    name: "Training Included",
    category: "commercial",
    description: "Operator training provided"
  },
  {
    id: "warranty-extended",
    name: "Extended Warranty",
    category: "commercial",
    description: "Extended warranty options available"
  }
];

// Application Areas
export const applicationFilterTags: FilterTag[] = [
  {
    id: "automotive",
    name: "Automotive",
    category: "applications",
    description: "Automotive industry applications",
    color: "#FF4500"
  },
  {
    id: "aerospace",
    name: "Aerospace",
    category: "applications",
    description: "Aerospace and aviation applications",
    color: "#4169E1"
  },
  {
    id: "pharmaceutical",
    name: "Pharmaceutical",
    category: "applications",
    description: "Pharmaceutical and biotech applications",
    color: "#9932CC",
    relatedTags: ["pharma-grade", "fda-approved"]
  },
  {
    id: "food-processing",
    name: "Food Processing",
    category: "applications",
    description: "Food and beverage industry",
    color: "#FFD700",
    relatedTags: ["food-grade", "kosher", "halal"]
  },
  {
    id: "chemical-processing",
    name: "Chemical Processing",
    category: "applications",
    description: "Chemical and petrochemical industries",
    color: "#32CD32"
  },
  {
    id: "marine",
    name: "Marine",
    category: "applications",
    description: "Marine and offshore applications",
    color: "#20B2AA",
    relatedTags: ["corrosion-resistant"]
  },
  {
    id: "oil-gas",
    name: "Oil & Gas",
    category: "applications",
    description: "Oil and gas industry applications",
    color: "#8B4513"
  },
  {
    id: "construction",
    name: "Construction",
    category: "applications",
    description: "Construction and building industry",
    color: "#D2691E"
  },
  {
    id: "electronics",
    name: "Electronics",
    category: "applications",
    description: "Electronics and semiconductor industry",
    color: "#4682B4"
  }
];

// Special Properties
export const propertyFilterTags: FilterTag[] = [
  {
    id: "corrosion-resistant",
    name: "Corrosion Resistant",
    category: "properties",
    description: "Resistant to corrosion and oxidation",
    relatedTags: ["stainless-steel", "marine"]
  },
  {
    id: "chemical-resistant",
    name: "Chemical Resistant",
    category: "properties",
    description: "Resistant to chemical attack",
    relatedTags: ["chemical-processing"]
  },
  {
    id: "fire-resistant",
    name: "Fire Resistant",
    category: "properties",
    description: "Fire retardant or fire resistant",
    relatedTags: ["low-smoke"]
  },
  {
    id: "low-smoke",
    name: "Low Smoke",
    category: "properties",
    description: "Low smoke emission when heated",
    relatedTags: ["fire-resistant"]
  },
  {
    id: "weatherproof",
    name: "Weatherproof",
    category: "properties",
    description: "Suitable for outdoor use",
    relatedTags: ["uv-resistant"]
  },
  {
    id: "uv-resistant",
    name: "UV Resistant",
    category: "properties",
    description: "Resistant to UV degradation",
    relatedTags: ["weatherproof"]
  },
  {
    id: "electrically-conductive",
    name: "Electrically Conductive",
    category: "properties",
    description: "Provides electrical conductivity"
  },
  {
    id: "electrically-insulating",
    name: "Electrically Insulating",
    category: "properties",
    description: "Provides electrical insulation",
    exclusiveTags: ["electrically-conductive"]
  }
];

// Combine all filter categories
export const filterCategories: FilterCategory[] = [
  {
    id: "materials",
    name: "Materials",
    description: "Material types and grades",
    tags: materialFilterTags,
    allowMultiple: true,
    displayOrder: 1
  },
  {
    id: "technical",
    name: "Technical Specifications",
    description: "Technical performance parameters",
    tags: technicalFilterTags,
    allowMultiple: true,
    displayOrder: 2
  },
  {
    id: "certifications",
    name: "Certifications & Compliance",
    description: "Industry certifications and standards",
    tags: certificationFilterTags,
    allowMultiple: true,
    displayOrder: 3
  },
  {
    id: "commercial",
    name: "Commercial Terms",
    description: "Commercial and service options",
    tags: commercialFilterTags,
    allowMultiple: true,
    displayOrder: 4
  },
  {
    id: "applications",
    name: "Industry Applications",
    description: "Target industry sectors",
    tags: applicationFilterTags,
    allowMultiple: true,
    displayOrder: 5
  },
  {
    id: "properties",
    name: "Special Properties",
    description: "Special material and performance properties",
    tags: propertyFilterTags,
    allowMultiple: true,
    displayOrder: 6
  }
];

// Utility functions
export const getAllFilterTags = (): FilterTag[] => {
  return filterCategories.flatMap(category => category.tags);
};

export const getFilterTagsByCategory = (categoryId: string): FilterTag[] => {
  const category = filterCategories.find(cat => cat.id === categoryId);
  return category?.tags || [];
};

export const getFilterTagById = (tagId: string): FilterTag | undefined => {
  return getAllFilterTags().find(tag => tag.id === tagId);
};

export const getRelatedTags = (tagId: string): FilterTag[] => {
  const tag = getFilterTagById(tagId);
  if (!tag?.relatedTags) return [];
  
  return tag.relatedTags
    .map(id => getFilterTagById(id))
    .filter((tag): tag is FilterTag => tag !== undefined);
};

export const getExclusiveTags = (tagId: string): FilterTag[] => {
  const tag = getFilterTagById(tagId);
  if (!tag?.exclusiveTags) return [];
  
  return tag.exclusiveTags
    .map(id => getFilterTagById(id))
    .filter((tag): tag is FilterTag => tag !== undefined);
};

export const validateTagSelection = (selectedTags: string[]): {
  valid: boolean;
  conflicts: string[];
} => {
  const conflicts: string[] = [];
  
  for (const tagId of selectedTags) {
    const tag = getFilterTagById(tagId);
    if (tag?.exclusiveTags) {
      const conflictingTags = tag.exclusiveTags.filter(exclusiveId => 
        selectedTags.includes(exclusiveId)
      );
      conflicts.push(...conflictingTags);
    }
  }
  
  return {
    valid: conflicts.length === 0,
    conflicts: [...new Set(conflicts)]
  };
};

// Preset filter combinations for common industrial scenarios
export const filterPresets = {
  automotive: {
    name: "Automotive Industry",
    description: "Common filters for automotive applications",
    tags: ["automotive", "high-precision", "volume-discounts", "technical-support"]
  },
  pharmaceutical: {
    name: "Pharmaceutical Industry", 
    description: "Pharma-compliant products and materials",
    tags: ["pharmaceutical", "pharma-grade", "fda-approved", "stainless-steel"]
  },
  foodProcessing: {
    name: "Food Processing",
    description: "Food-safe materials and equipment",
    tags: ["food-processing", "food-grade", "stainless-steel", "kosher"]
  },
  aerospace: {
    name: "Aerospace Industry",
    description: "High-performance aerospace applications",
    tags: ["aerospace", "ultra-precision", "as9100", "technical-support"]
  },
  chemicalProcessing: {
    name: "Chemical Processing",
    description: "Chemical-resistant materials and equipment",
    tags: ["chemical-processing", "chemical-resistant", "corrosion-resistant", "high-pressure"]
  },
  marine: {
    name: "Marine Applications",
    description: "Marine and offshore environments",
    tags: ["marine", "corrosion-resistant", "weatherproof", "stainless-steel"]
  }
};

export default filterCategories; 