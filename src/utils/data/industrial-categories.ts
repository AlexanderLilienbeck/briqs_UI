// Industrial Product Category Taxonomy
// Hierarchical structure designed for B2B industrial marketplace

export interface IndustrialCategory {
  id: string;
  name: string;
  description: string;
  subcategories?: IndustrialSubcategory[];
  productCount: number;
  icon?: string;
  filterTags: string[];
}

export interface IndustrialSubcategory {
  id: string;
  name: string;
  description: string;
  productCount: number;
  filterTags: string[];
  commonSpecifications: string[];
}

export const industrialCategories: IndustrialCategory[] = [
  {
    id: "raw-materials",
    name: "Raw Materials",
    description: "Base materials for manufacturing and production",
    productCount: 5,
    icon: "material-icon",
    filterTags: ["bulk-orders", "material-certificates", "grade-specifications"],
    subcategories: [
      {
        id: "metals",
        name: "Metals",
        description: "Steel, aluminum, and specialty metal products",
        productCount: 2,
        filterTags: ["steel", "aluminum", "coated", "precision-cut"],
        commonSpecifications: [
          "Material Grade",
          "Thickness",
          "Width",
          "Coating",
          "Surface Finish",
          "Tensile Strength",
          "Yield Strength",
          "Elongation"
        ]
      },
      {
        id: "polymers",
        name: "Polymers & Plastics",
        description: "Engineering plastics and polymer resins",
        productCount: 1,
        filterTags: ["hdpe", "injection-grade", "food-contact", "recycled"],
        commonSpecifications: [
          "Polymer Type",
          "Melt Index",
          "Density",
          "Additive Package",
          "Color",
          "UV Stabilization",
          "Food Contact Approval"
        ]
      },
      {
        id: "chemicals",
        name: "Chemicals",
        description: "Industrial chemicals and specialty compounds",
        productCount: 2,
        filterTags: ["hazmat", "food-grade", "pharma-grade", "high-purity"],
        commonSpecifications: [
          "Purity",
          "Water Content",
          "pH Level",
          "Heavy Metals",
          "Mesh Size",
          "Packaging",
          "Storage Requirements"
        ]
      }
    ]
  },
  {
    id: "machinery-equipment",
    name: "Machinery & Equipment",
    description: "Industrial machinery and production equipment",
    productCount: 4,
    icon: "machinery-icon",
    filterTags: ["ce-marking", "warranty", "installation", "training"],
    subcategories: [
      {
        id: "manufacturing-equipment",
        name: "Manufacturing Equipment",
        description: "CNC machines, cutting equipment, and production tools",
        productCount: 2,
        filterTags: ["cnc", "precision", "automation", "tooling"],
        commonSpecifications: [
          "Work Envelope",
          "Spindle Speed",
          "Accuracy",
          "Power Rating",
          "Control System",
          "Tooling Capacity",
          "Safety Features"
        ]
      },
      {
        id: "compressors-pumps",
        name: "Compressors & Pumps",
        description: "Air compressors, pumps, and fluid handling equipment",
        productCount: 1,
        filterTags: ["air-cooled", "energy-efficient", "variable-speed"],
        commonSpecifications: [
          "Power Rating",
          "Pressure Rating",
          "Flow Rate",
          "Efficiency Class",
          "Noise Level",
          "Voltage",
          "Cooling Method"
        ]
      },
      {
        id: "motors-drives",
        name: "Motors & Drives",
        description: "Electric motors, drives, and motion control systems",
        productCount: 1,
        filterTags: ["three-phase", "nema", "variable-frequency", "servo"],
        commonSpecifications: [
          "Power Rating",
          "RPM",
          "Voltage",
          "Efficiency Class",
          "Mounting Type",
          "IP Rating",
          "Shaft Configuration"
        ]
      }
    ]
  },
  {
    id: "components-parts",
    name: "Components & Parts",
    description: "Industrial components and replacement parts",
    productCount: 4,
    icon: "components-icon",
    filterTags: ["precision", "certified", "oem-quality", "long-life"],
    subcategories: [
      {
        id: "mechanical-components",
        name: "Mechanical Components",
        description: "Bearings, fasteners, and mechanical parts",
        productCount: 1,
        filterTags: ["precision-bearings", "abec-rated", "sealed", "grease-lubricated"],
        commonSpecifications: [
          "Bore Size",
          "Outer Diameter",
          "Width",
          "Precision Class",
          "Load Rating",
          "Speed Rating",
          "Lubrication",
          "Seal Type"
        ]
      },
      {
        id: "hydraulic-pneumatic",
        name: "Hydraulic & Pneumatic",
        description: "Hoses, fittings, and fluid power components",
        productCount: 1,
        filterTags: ["sae-rated", "high-pressure", "flexible", "crimped-fittings"],
        commonSpecifications: [
          "Pressure Rating",
          "Diameter",
          "Length",
          "Temperature Range",
          "Bend Radius",
          "End Fittings",
          "Standards Compliance"
        ]
      },
      {
        id: "electrical-components",
        name: "Electrical Components",
        description: "Cables, sensors, and electrical components",
        productCount: 2,
        filterTags: ["low-smoke", "fire-rated", "iot-enabled", "wireless"],
        commonSpecifications: [
          "Voltage Rating",
          "Current Rating",
          "Conductor Size",
          "Insulation Type",
          "Fire Rating",
          "Operating Temperature",
          "Connectivity"
        ]
      }
    ]
  },
  {
    id: "process-equipment",
    name: "Process Equipment",
    description: "Specialized process and pharmaceutical equipment",
    productCount: 1,
    icon: "process-icon",
    filterTags: ["pharma-grade", "stainless-steel", "validated", "cip-sip"],
    subcategories: [
      {
        id: "reactors-vessels",
        name: "Reactors & Vessels",
        description: "Process reactors, pressure vessels, and tanks",
        productCount: 1,
        filterTags: ["stainless-steel", "pharmaceutical", "pressure-rated", "surface-finish"],
        commonSpecifications: [
          "Volume",
          "Material Grade",
          "Pressure Rating",
          "Temperature Rating",
          "Surface Finish",
          "Connections",
          "Agitation",
          "Heating/Cooling"
        ]
      }
    ]
  },
  {
    id: "packaging-materials",
    name: "Packaging & Materials",
    description: "Industrial packaging and material handling products",
    productCount: 3,
    icon: "packaging-icon",
    filterTags: ["recyclable", "custom-printing", "load-tested", "sustainable"],
    subcategories: [
      {
        id: "corrugated-packaging",
        name: "Corrugated Packaging",
        description: "Boxes, containers, and corrugated materials",
        productCount: 1,
        filterTags: ["custom-size", "printed", "recyclable", "crush-resistant"],
        commonSpecifications: [
          "Board Grade",
          "Dimensions",
          "Print Quality",
          "Edge Crush Test",
          "Burst Strength",
          "Moisture Resistance",
          "Recycled Content"
        ]
      },
      {
        id: "pallets-handling",
        name: "Pallets & Handling",
        description: "Pallets, containers, and material handling equipment",
        productCount: 1,
        filterTags: ["epal-certified", "heat-treated", "exchange-program", "load-tested"],
        commonSpecifications: [
          "Dimensions",
          "Load Capacity",
          "Wood Grade",
          "Heat Treatment",
          "Certification",
          "Exchange Scheme",
          "Stacking Height"
        ]
      },
      {
        id: "specialty-inks",
        name: "Specialty Inks & Coatings",
        description: "Industrial inks, paints, and specialty coatings",
        productCount: 1,
        filterTags: ["uv-curable", "food-contact", "custom-viscosity", "long-shelf-life"],
        commonSpecifications: [
          "Viscosity",
          "Cure Speed",
          "Color Gamut",
          "Adhesion",
          "Chemical Resistance",
          "Shelf Life",
          "Application Method"
        ]
      }
    ]
  },
  {
    id: "services",
    name: "Industrial Services",
    description: "Manufacturing services and equipment rental",
    productCount: 3,
    icon: "services-icon",
    filterTags: ["rental", "maintenance", "installation", "training"],
    subcategories: [
      {
        id: "equipment-rental",
        name: "Equipment Rental",
        description: "Forklift rental, equipment leasing, and temporary solutions",
        productCount: 1,
        filterTags: ["short-term", "maintenance-included", "operator-training", "transport"],
        commonSpecifications: [
          "Rental Duration",
          "Equipment Type",
          "Capacity",
          "Maintenance SLA",
          "Training Included",
          "Transport Costs",
          "Insurance Coverage"
        ]
      },
      {
        id: "manufacturing-services",
        name: "Manufacturing Services",
        description: "Cutting, machining, and custom manufacturing services",
        productCount: 1,
        filterTags: ["laser-cutting", "precision", "quick-turnaround", "scrap-return"],
        commonSpecifications: [
          "Material Types",
          "Thickness Range",
          "Tolerance",
          "Lead Time",
          "Minimum Order",
          "Nesting Efficiency",
          "Quality Standards"
        ]
      },
      {
        id: "specialty-coatings",
        name: "Specialty Coatings & Paints",
        description: "Fire retardant paints and specialty coating services",
        productCount: 1,
        filterTags: ["fire-retardant", "custom-tinting", "guaranteed-pot-life", "msds"],
        commonSpecifications: [
          "Fire Rating",
          "Coverage",
          "Application Method",
          "Dry Time",
          "Color Options",
          "Environmental Compliance",
          "Pot Life"
        ]
      }
    ]
  }
];

// Flat list of all categories for easy lookup
export const getAllCategories = (): string[] => {
  return industrialCategories.map(cat => cat.name);
};

// Flat list of all subcategories for easy lookup
export const getAllSubcategories = (): string[] => {
  return industrialCategories.flatMap(cat => 
    cat.subcategories?.map(sub => sub.name) || []
  );
};

// Get subcategories for a specific category
export const getSubcategoriesForCategory = (categoryName: string): string[] => {
  const category = industrialCategories.find(cat => cat.name === categoryName);
  return category?.subcategories?.map(sub => sub.name) || [];
};

// Get category by name
export const getCategoryByName = (name: string): IndustrialCategory | undefined => {
  return industrialCategories.find(cat => cat.name === name);
};

// Get subcategory by name
export const getSubcategoryByName = (categoryName: string, subcategoryName: string): IndustrialSubcategory | undefined => {
  const category = getCategoryByName(categoryName);
  return category?.subcategories?.find(sub => sub.name === subcategoryName);
};

// Get all filter tags
export const getAllFilterTags = (): string[] => {
  const categoryTags = industrialCategories.flatMap(cat => cat.filterTags);
  const subcategoryTags = industrialCategories.flatMap(cat => 
    cat.subcategories?.flatMap(sub => sub.filterTags) || []
  );
  return [...new Set([...categoryTags, ...subcategoryTags])];
};

// Get common specifications for a subcategory
export const getCommonSpecifications = (categoryName: string, subcategoryName: string): string[] => {
  const subcategory = getSubcategoryByName(categoryName, subcategoryName);
  return subcategory?.commonSpecifications || [];
};

export default industrialCategories; 