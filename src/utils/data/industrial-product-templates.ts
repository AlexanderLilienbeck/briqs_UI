import { ProductTemplate, NegotiationVariable } from "../../types/industrial-products";

// Common negotiation variables that can be reused across products
const commonNegotiationVariables: Record<string, NegotiationVariable> = {
  coilWeight: {
    id: "coil_weight",
    name: "Coil Weight Split",
    type: "range",
    description: "Split large coils into smaller weights for easier handling",
    priceImpact: "low",
    leadTimeImpact: "low",
    range: {
      min: 500,
      max: 5000,
      step: 100,
      unit: "kg",
      default: 2000
    }
  },
  
  cutLength: {
    id: "cut_length",
    name: "Cut to Length",
    type: "range",
    description: "Custom cutting to specific lengths",
    priceImpact: "low",
    leadTimeImpact: "medium",
    range: {
      min: 100,
      max: 12000,
      step: 50,
      unit: "mm",
      default: 6000
    }
  },
  
  surfaceFinish: {
    id: "surface_finish",
    name: "Surface Finish",
    type: "options",
    description: "Surface treatment and finish options",
    priceImpact: "medium",
    leadTimeImpact: "medium",
    options: [
      { value: "mill_finish", label: "Mill Finish", priceModifier: 0, leadTimeModifier: 0 },
      { value: "anodized", label: "Anodized", priceModifier: 15, leadTimeModifier: 7 },
      { value: "powder_coated", label: "Powder Coated", priceModifier: 20, leadTimeModifier: 10 },
      { value: "galvanized", label: "Galvanized", priceModifier: 12, leadTimeModifier: 5 }
    ]
  },
  
  deliveryMethod: {
    id: "delivery_method",
    name: "Delivery Method",
    type: "options",
    description: "Packaging and delivery options",
    priceImpact: "medium",
    leadTimeImpact: "low",
    options: [
      { value: "bulk", label: "Bulk Delivery", priceModifier: 0, leadTimeModifier: 0 },
      { value: "bagged", label: "Bagged (25kg)", priceModifier: 8, leadTimeModifier: 2 },
      { value: "silo", label: "Silo Delivery", priceModifier: -5, leadTimeModifier: 0, description: "Minimum 20 tons" }
    ]
  },
  
  certification: {
    id: "additional_certification",
    name: "Additional Certifications",
    type: "options",
    description: "Optional certifications and documentation",
    priceImpact: "low",
    leadTimeImpact: "medium",
    options: [
      { value: "kosher", label: "Kosher Certification", priceModifier: 3, leadTimeModifier: 7 },
      { value: "halal", label: "Halal Certification", priceModifier: 3, leadTimeModifier: 7 },
      { value: "organic", label: "Organic Certification", priceModifier: 15, leadTimeModifier: 14 }
    ]
  },
  
  installation: {
    id: "installation_service",
    name: "Installation Service",
    type: "options",
    description: "Professional installation and setup",
    priceImpact: "high",
    leadTimeImpact: "medium",
    options: [
      { value: "none", label: "No Installation", priceModifier: 0, leadTimeModifier: 0 },
      { value: "basic", label: "Basic Installation", priceModifier: 800, leadTimeModifier: 3 },
      { value: "full", label: "Full Installation & Commissioning", priceModifier: 2500, leadTimeModifier: 7 },
      { value: "training", label: "Installation + Training", priceModifier: 3500, leadTimeModifier: 10 }
    ]
  },
  
  warranty: {
    id: "warranty_extension",
    name: "Warranty Extension",
    type: "options",
    description: "Extended warranty options",
    priceImpact: "medium",
    leadTimeImpact: "none",
    options: [
      { value: "standard", label: "Standard Warranty", priceModifier: 0, leadTimeModifier: 0 },
      { value: "extended_2y", label: "2 Year Extended", priceModifier: 5, leadTimeModifier: 0 },
      { value: "extended_5y", label: "5 Year Extended", priceModifier: 12, leadTimeModifier: 0 },
      { value: "comprehensive", label: "Comprehensive Coverage", priceModifier: 18, leadTimeModifier: 0 }
    ]
  },
  
  customization: {
    id: "customization_level",
    name: "Customization Level",
    type: "options",
    description: "Level of product customization",
    priceImpact: "high",
    leadTimeImpact: "high",
    options: [
      { value: "standard", label: "Standard Product", priceModifier: 0, leadTimeModifier: 0 },
      { value: "modified", label: "Modified Standard", priceModifier: 15, leadTimeModifier: 14 },
      { value: "custom", label: "Fully Custom", priceModifier: 35, leadTimeModifier: 28 }
    ]
  }
};

// Product templates for each category/subcategory
export const industrialProductTemplates: ProductTemplate[] = [
  // RAW MATERIALS - METALS
  {
    categoryId: "raw-materials",
    subcategoryId: "metals",
    name: "Steel Products Template",
    description: "Template for steel coils, sheets, and profiles",
    requiredSpecifications: [
      "Material Grade",
      "Thickness",
      "Width",
      "Surface Finish",
      "Tensile Strength",
      "Yield Strength",
      "Elongation"
    ],
    optionalSpecifications: [
      "Coating",
      "Edge Condition",
      "Flatness Tolerance",
      "Chemical Composition",
      "Hardness"
    ],
    commonNegotiationVariables: [
      commonNegotiationVariables.coilWeight,
      commonNegotiationVariables.cutLength,
      commonNegotiationVariables.surfaceFinish
    ],
    typicalCertifications: [
      "EN 10204 3.1 Certificate",
      "ISO 9001:2015",
      "ASTM Standards",
      "CE Marking"
    ],
    industryStandards: [
      "EN 10025",
      "ASTM A36",
      "JIS G3101",
      "DIN 17100"
    ],
    applicationAreas: [
      "construction",
      "automotive",
      "shipbuilding",
      "machinery"
    ]
  },
  
  {
    categoryId: "raw-materials",
    subcategoryId: "metals",
    name: "Aluminum Products Template",
    description: "Template for aluminum extrusions and sheets",
    requiredSpecifications: [
      "Alloy Grade",
      "Temper",
      "Dimensions",
      "Surface Finish",
      "Tolerance"
    ],
    optionalSpecifications: [
      "Anodizing Thickness",
      "Color",
      "Machining",
      "Welding Requirements"
    ],
    commonNegotiationVariables: [
      commonNegotiationVariables.cutLength,
      commonNegotiationVariables.surfaceFinish,
      commonNegotiationVariables.customization
    ],
    typicalCertifications: [
      "EN 755",
      "ASTM B221",
      "ISO 9001:2015",
      "AS9100"
    ],
    industryStandards: [
      "EN 573",
      "ASTM B209",
      "JIS H4000",
      "AA Standards"
    ],
    applicationAreas: [
      "aerospace",
      "automotive",
      "construction",
      "electronics"
    ]
  },
  
  // RAW MATERIALS - POLYMERS
  {
    categoryId: "raw-materials",
    subcategoryId: "polymers",
    name: "Polymer Resins Template",
    description: "Template for plastic resins and pellets",
    requiredSpecifications: [
      "Polymer Type",
      "Melt Index",
      "Density",
      "Additive Package",
      "Color"
    ],
    optionalSpecifications: [
      "UV Stabilization",
      "Flame Retardancy",
      "Recycled Content",
      "Food Contact Approval"
    ],
    commonNegotiationVariables: [
      commonNegotiationVariables.deliveryMethod,
      commonNegotiationVariables.certification
    ],
    typicalCertifications: [
      "FDA 21 CFR 177",
      "EU 10/2011",
      "ISO 9001:2015",
      "REACH Compliance"
    ],
    industryStandards: [
      "ASTM D1238",
      "ISO 1133",
      "DIN 53735"
    ],
    applicationAreas: [
      "packaging",
      "automotive",
      "medical",
      "consumer_goods"
    ]
  },
  
  // RAW MATERIALS - CHEMICALS
  {
    categoryId: "raw-materials",
    subcategoryId: "chemicals",
    name: "Industrial Chemicals Template",
    description: "Template for industrial chemicals and solvents",
    requiredSpecifications: [
      "Purity",
      "Water Content",
      "pH Level",
      "Packaging",
      "Storage Requirements"
    ],
    optionalSpecifications: [
      "Heavy Metals",
      "Mesh Size",
      "Particle Size",
      "Solubility"
    ],
    commonNegotiationVariables: [
      commonNegotiationVariables.deliveryMethod,
      commonNegotiationVariables.certification
    ],
    typicalCertifications: [
      "USP Grade",
      "Ph. Eur.",
      "FCC Grade",
      "REACH Registration"
    ],
    industryStandards: [
      "USP",
      "Ph. Eur.",
      "FCC",
      "ASTM Standards"
    ],
    applicationAreas: [
      "pharmaceutical",
      "food_processing",
      "chemical_processing",
      "cosmetics"
    ]
  },
  
  // MACHINERY & EQUIPMENT
  {
    categoryId: "machinery-equipment",
    subcategoryId: "manufacturing-equipment",
    name: "CNC Machinery Template",
    description: "Template for CNC machines and manufacturing equipment",
    requiredSpecifications: [
      "Work Envelope",
      "Spindle Speed",
      "Accuracy",
      "Power Rating",
      "Control System"
    ],
    optionalSpecifications: [
      "Tooling Capacity",
      "Automatic Tool Changer",
      "Coolant System",
      "Safety Features"
    ],
    commonNegotiationVariables: [
      commonNegotiationVariables.installation,
      commonNegotiationVariables.warranty,
      commonNegotiationVariables.customization
    ],
    typicalCertifications: [
      "CE Marking",
      "ISO 9001:2015",
      "Machine Safety Directive",
      "EMC Compliance"
    ],
    industryStandards: [
      "ISO 230",
      "VDI/DGQ 3441",
      "NIST Standards"
    ],
    applicationAreas: [
      "automotive",
      "aerospace",
      "medical",
      "general_machining"
    ]
  },
  
  {
    categoryId: "machinery-equipment",
    subcategoryId: "compressors-pumps",
    name: "Compressors Template",
    description: "Template for air compressors and pumps",
    requiredSpecifications: [
      "Power Rating",
      "Pressure Rating",
      "Flow Rate",
      "Efficiency Class",
      "Noise Level"
    ],
    optionalSpecifications: [
      "Voltage Options",
      "Cooling Method",
      "Control System",
      "Variable Speed Drive"
    ],
    commonNegotiationVariables: [
      commonNegotiationVariables.installation,
      commonNegotiationVariables.warranty
    ],
    typicalCertifications: [
      "CE Marking",
      "Energy Efficiency Directive",
      "Pressure Equipment Directive",
      "ISO 9001:2015"
    ],
    industryStandards: [
      "ISO 1217",
      "ASME BPVC",
      "EN 1012"
    ],
    applicationAreas: [
      "manufacturing",
      "automotive",
      "food_processing",
      "general_industry"
    ]
  },
  
  // COMPONENTS & PARTS
  {
    categoryId: "components-parts",
    subcategoryId: "mechanical-components",
    name: "Precision Bearings Template",
    description: "Template for high-precision bearings",
    requiredSpecifications: [
      "Bore Size",
      "Outer Diameter",
      "Width",
      "Precision Class",
      "Load Rating"
    ],
    optionalSpecifications: [
      "Speed Rating",
      "Lubrication",
      "Seal Type",
      "Cage Material"
    ],
    commonNegotiationVariables: [
      commonNegotiationVariables.customization
    ],
    typicalCertifications: [
      "ISO 9001:2015",
      "ABEC Standards",
      "DIN 620",
      "Material Certificates"
    ],
    industryStandards: [
      "ISO 492",
      "ABEC",
      "DIN 620",
      "JIS B1514"
    ],
    applicationAreas: [
      "aerospace",
      "automotive",
      "machine_tools",
      "robotics"
    ]
  },
  
  // SERVICES
  {
    categoryId: "services",
    subcategoryId: "equipment-rental",
    name: "Equipment Rental Template",
    description: "Template for equipment rental services",
    requiredSpecifications: [
      "Equipment Type",
      "Capacity",
      "Rental Duration",
      "Maintenance SLA"
    ],
    optionalSpecifications: [
      "Operator Training",
      "Transport Costs",
      "Insurance Coverage",
      "Backup Equipment"
    ],
    commonNegotiationVariables: [
      {
        id: "rental_duration",
        name: "Rental Duration",
        type: "range",
        description: "Length of rental period",
        priceImpact: "high",
        leadTimeImpact: "low",
        range: {
          min: 1,
          max: 365,
          step: 1,
          unit: "days",
          default: 30
        }
      }
    ],
    typicalCertifications: [
      "Equipment Safety Certification",
      "Insurance Coverage",
      "Operator Training Certification"
    ],
    industryStandards: [
      "OSHA Standards",
      "Equipment Manufacturer Standards"
    ],
    applicationAreas: [
      "construction",
      "manufacturing",
      "logistics",
      "maintenance"
    ]
  }
];

// Helper functions
export const getTemplateByCategory = (categoryId: string, subcategoryId: string): ProductTemplate | undefined => {
  return industrialProductTemplates.find(
    template => template.categoryId === categoryId && template.subcategoryId === subcategoryId
  );
};

export const getTemplatesByCategory = (categoryId: string): ProductTemplate[] => {
  return industrialProductTemplates.filter(template => template.categoryId === categoryId);
};

export const getAllTemplates = (): ProductTemplate[] => {
  return industrialProductTemplates;
};

export default industrialProductTemplates; 