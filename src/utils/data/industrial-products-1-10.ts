import { IndustrialProduct, NegotiationVariable } from "../../types/industrial-products";

// Products 1-10: Core Industrial Materials & Equipment
export const industrialProducts1to10: IndustrialProduct[] = [
  // Product 1: Cold-Rolled Steel Coil (SPCC, 1 mm)
  {
    id: "ind-001",
    supplierId: "supplier-steel-001",
    name: "Cold-Rolled Steel Coil SPCC 1.0mm",
    description: "High-quality cold-rolled steel coil in SPCC grade, 1.0mm thickness. Excellent surface finish and dimensional accuracy. Suitable for automotive, appliances, and general manufacturing applications. Available with various coil weight splits and coating options.",
    category: "Raw Materials",
    subcategory: "Metals",
    sku: "CR-SPCC-1.0-STD",
    images: [
      "/images/products/steel-coil-1.jpg",
      "/images/products/steel-coil-2.jpg",
      "/images/products/steel-coil-surface.jpg"
    ],
    
    // Basic specifications (legacy format for compatibility)
    specifications: {
      "Material Grade": "SPCC (JIS G3141)",
      "Thickness": "1.0mm",
      "Width": "1000mm - 1500mm",
      "Coil Weight": "3-8 tons",
      "Surface Finish": "Mill finish, oiled",
      "Tensile Strength": "270-370 MPa",
      "Yield Strength": "≤ 205 MPa",
      "Elongation": "≥ 34%"
    },
    
    // Enhanced material properties
    materialProperties: {
      grade: "SPCC",
      composition: {
        "Carbon": 0.12,
        "Manganese": 0.50,
        "Phosphorus": 0.030,
        "Sulfur": 0.030
      },
      density: 7850, // kg/m³
      tensileStrength: 320, // MPa (typical)
      yieldStrength: 180, // MPa (typical)
      elongation: 36, // %
      hardness: "HRB 65-75"
    },
    
    physicalProperties: {
      dimensions: {
        thickness: 1.0,
        width: 1250, // typical
        unit: "mm"
      },
      weight: {
        value: 5.5, // typical coil weight
        unit: "t"
      },
      surfaceFinish: "Mill finish, light oil coating",
      packaging: "Steel strapping, wooden pallets, protective covering"
    },
    
    performanceSpecs: {
      operatingTemperature: {
        min: -40,
        max: 200,
        unit: "°C"
      }
    },
    
    // Industrial-specific fields
    manufacturingProcess: "Cold rolling, annealing, temper rolling",
    qualityGrade: "Commercial Quality",
    applicationAreas: ["automotive", "appliances", "construction", "general_manufacturing"],
    industryStandards: ["JIS G3141", "EN 10130", "ASTM A1008"],
    countryOfOrigin: "Germany",
    
    // Regulatory compliance
    environmentalCompliance: ["REACH", "RoHS"],
    
    // Negotiation variables specific to steel coils
    negotiationVariables: [
      {
        id: "coil_weight_split",
        name: "Coil Weight Split",
        type: "range",
        description: "Split coils into smaller weights for easier handling",
        priceImpact: "low",
        leadTimeImpact: "low",
        range: {
          min: 1.5,
          max: 8.0,
          step: 0.5,
          unit: "tons",
          default: 5.5
        }
      },
      {
        id: "coating_option",
        name: "Coating Type",
        type: "options",
        description: "Surface coating options for enhanced protection",
        priceImpact: "medium",
        leadTimeImpact: "medium",
        options: [
          { value: "none", label: "No Coating (Mill Finish)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "oiled", label: "Light Oil Coating", priceModifier: 15, leadTimeModifier: 1 },
          { value: "galvanized", label: "Hot-Dip Galvanized", priceModifier: 180, leadTimeModifier: 7 },
          { value: "electrogalvanized", label: "Electro-Galvanized", priceModifier: 120, leadTimeModifier: 5 }
        ]
      },
      {
        id: "lme_pricing",
        name: "LME Price Indexing",
        type: "boolean",
        description: "Link pricing to London Metal Exchange steel price index",
        priceImpact: "high",
        leadTimeImpact: "none",
        booleanDefault: false
      },
      {
        id: "edge_condition",
        name: "Edge Condition",
        type: "options",
        description: "Edge trimming and conditioning",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "mill_edge", label: "Mill Edge", priceModifier: 0, leadTimeModifier: 0 },
          { value: "slit_edge", label: "Slit Edge", priceModifier: 25, leadTimeModifier: 2 },
          { value: "trimmed", label: "Trimmed Edge", priceModifier: 45, leadTimeModifier: 3 }
        ]
      }
    ],
    
    certifications: [
      "EN 10204 3.1 Material Certificate",
      "ISO 9001:2015",
      "ISO 14001:2015",
      "OHSAS 18001"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 5, maxQuantity: 19, unitPrice: 720, currency: "EUR" }, // per ton
        { minQuantity: 20, maxQuantity: 49, unitPrice: 695, currency: "EUR" },
        { minQuantity: 50, maxQuantity: 99, unitPrice: 675, currency: "EUR" },
        { minQuantity: 100, unitPrice: 650, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "ex_works",
      leadTime: {
        min: 14,
        max: 28,
        unit: "days"
      },
      minimumOrderQuantity: 5,
      validUntil: new Date("2025-06-30"),
      currency: "EUR",
      includesVAT: false,
      warrantyPeriod: {
        duration: 12,
        unit: "months"
      },
      
      // Industrial-specific terms
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.5,
        qualityDocumentation: ["Material Certificate 3.1", "Dimensional Report", "Surface Quality Report"],
        returnPolicy: "Defective material replacement within 30 days"
      },
      
      packagingRequirements: {
        type: "Steel strapping with protective covering",
        markingRequirements: ["Heat number", "Grade", "Dimensions", "Weight"],
        specialHandling: true,
        returnablePackaging: false
      },
      
      shippingTerms: {
        specialTransport: true,
        insuranceRequired: true,
        trackingRequired: true
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 8, // 8% price flexibility
      quantityFlexibility: 15, // 15% quantity flexibility  
      deliveryFlexibility: 10, // 10 days delivery flexibility
      paymentTermsFlexible: true
    },
    
    keywords: [
      "cold rolled steel",
      "SPCC",
      "steel coil",
      "automotive steel",
      "1mm steel",
      "coil splitting",
      "galvanized option",
      "JIS G3141"
    ],
    
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 2: Aluminium 6061 Extrusion Profiles
  {
    id: "ind-002",
    supplierId: "supplier-aluminum-001", 
    name: "Aluminum 6061-T6 Extrusion Profiles",
    description: "High-strength aluminum 6061-T6 extrusion profiles with excellent corrosion resistance and machinability. Available in various shapes and sizes with custom cutting and anodizing options. Ideal for structural, automotive, and aerospace applications.",
    category: "Raw Materials",
    subcategory: "Metals",
    sku: "AL-6061-T6-EXT",
    images: [
      "/images/products/aluminum-extrusion-1.jpg",
      "/images/products/aluminum-profiles-2.jpg",
      "/images/products/aluminum-anodized-3.jpg"
    ],
    
    specifications: {
      "Alloy": "6061-T6",
      "Temper": "T6 (Solution heat treated and artificially aged)",
      "Profile Types": "Angle, Channel, Tube, Custom shapes",
      "Length": "Up to 6000mm",
      "Tolerance": "±0.1mm",
      "Surface Finish": "Mill finish or anodized"
    },
    
    materialProperties: {
      grade: "6061-T6",
      composition: {
        "Aluminum": 97.9,
        "Magnesium": 1.0,
        "Silicon": 0.6,
        "Iron": 0.7,
        "Copper": 0.25,
        "Chromium": 0.2
      },
      density: 2700, // kg/m³
      tensileStrength: 310, // MPa
      yieldStrength: 275, // MPa
      elongation: 12, // %
      hardness: "HB 95",
      thermalConductivity: 167 // W/m·K
    },
    
    physicalProperties: {
      dimensions: {
        length: 6000,
        unit: "mm"
      },
      surfaceFinish: "Mill finish (natural aluminum color)",
      packaging: "Bundled with protective film"
    },
    
    performanceSpecs: {
      operatingTemperature: {
        min: -200,
        max: 200,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Hot extrusion, solution heat treatment, artificial aging",
    qualityGrade: "Aerospace Grade",
    applicationAreas: ["aerospace", "automotive", "construction", "marine"],
    industryStandards: ["EN 755", "ASTM B221", "AS 1734", "JIS H4100"],
    countryOfOrigin: "Netherlands",
    
    environmentalCompliance: ["RoHS", "REACH", "Recyclable"],
    
    negotiationVariables: [
      {
        id: "cut_to_length",
        name: "Cut to Length Service",
        type: "range",
        description: "Custom cutting to specific lengths",
        priceImpact: "low",
        leadTimeImpact: "medium",
        range: {
          min: 100,
          max: 6000,
          step: 10,
          unit: "mm",
          default: 6000
        }
      },
      {
        id: "temper_selection",
        name: "Temper Selection",
        type: "options",
        description: "Different temper conditions available",
        priceImpact: "medium",
        leadTimeImpact: "medium",
        options: [
          { value: "t6", label: "T6 (Standard)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "t4", label: "T4 (Solution treated)", priceModifier: -5, leadTimeModifier: -3 },
          { value: "t651", label: "T651 (Stress relieved)", priceModifier: 8, leadTimeModifier: 5 }
        ]
      },
      {
        id: "anodizing_finish",
        name: "Anodizing Finish",
        type: "options",
        description: "Anodizing thickness and color options",
        priceImpact: "medium",
        leadTimeImpact: "medium",
        options: [
          { value: "none", label: "Mill Finish", priceModifier: 0, leadTimeModifier: 0 },
          { value: "clear_10", label: "Clear Anodize 10μm", priceModifier: 180, leadTimeModifier: 7 },
          { value: "clear_20", label: "Clear Anodize 20μm", priceModifier: 280, leadTimeModifier: 7 },
          { value: "black_20", label: "Black Anodize 20μm", priceModifier: 320, leadTimeModifier: 10 },
          { value: "custom_color", label: "Custom Color", priceModifier: 450, leadTimeModifier: 14 }
        ]
      },
      {
        id: "machining_service",
        name: "Machining Service",
        type: "options",
        description: "Additional machining operations",
        priceImpact: "high",
        leadTimeImpact: "high",
        options: [
          { value: "none", label: "No Machining", priceModifier: 0, leadTimeModifier: 0 },
          { value: "drilling", label: "Drilling", priceModifier: 50, leadTimeModifier: 3 },
          { value: "milling", label: "CNC Milling", priceModifier: 150, leadTimeModifier: 7 },
          { value: "complete", label: "Complete Machining", priceModifier: 300, leadTimeModifier: 14 }
        ]
      }
    ],
    
    certifications: [
      "EN 755-2",
      "ASTM B221",
      "AS9100",
      "ISO 9001:2015",
      "Material Certificate 3.1"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 100, maxQuantity: 499, unitPrice: 4.20, currency: "EUR" }, // per kg
        { minQuantity: 500, maxQuantity: 999, unitPrice: 3.95, currency: "EUR" },
        { minQuantity: 1000, maxQuantity: 2499, unitPrice: 3.75, currency: "EUR" },
        { minQuantity: 2500, unitPrice: 3.50, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "ex_works",
      leadTime: {
        min: 10,
        max: 21,
        unit: "days"
      },
      minimumOrderQuantity: 100,
      validUntil: new Date("2025-05-31"),
      currency: "EUR",
      includesVAT: false,
      warrantyPeriod: {
        duration: 24,
        unit: "months"
      },
      
      qualityTerms: {
        inspectionLevel: "tightened",
        acceptanceRate: 99.8,
        qualityDocumentation: ["Material Certificate", "Dimensional Report", "Alloy Verification"],
        returnPolicy: "Full replacement for dimensional or alloy non-conformance"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 12,
      quantityFlexibility: 20,
      deliveryFlexibility: 7,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "aluminum 6061",
      "T6 temper",
      "extrusion profiles",
      "anodizing",
      "aerospace grade",
      "cut to length",
      "custom machining",
      "structural aluminum"
    ],
    
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 3: HDPE Resin Pellets (Injection Grade)
  {
    id: "ind-003",
    supplierId: "supplier-polymer-001",
    name: "HDPE Resin Pellets - Injection Molding Grade",
    description: "High-density polyethylene (HDPE) resin pellets specifically formulated for injection molding applications. Excellent flow properties, chemical resistance, and impact strength. Available in natural and custom colors with various additive packages. Food contact approved grades available.",
    category: "Raw Materials", 
    subcategory: "Polymers & Plastics",
    sku: "HDPE-INJ-001",
    images: [
      "/images/products/hdpe-pellets-1.jpg",
      "/images/products/polymer-bags-2.jpg",
      "/images/products/hdpe-silo-3.jpg"
    ],
    
    specifications: {
      "Polymer Type": "High Density Polyethylene (HDPE)",
      "Grade": "Injection Molding",
      "Melt Index": "5-25 g/10min (190°C/2.16kg)",
      "Density": "0.950-0.965 g/cm³",
      "Additive Package": "Standard stabilization",
      "Color": "Natural (translucent white)"
    },
    
    materialProperties: {
      grade: "Injection Grade HDPE",
      density: 958, // kg/m³
      thermalConductivity: 0.45, // W/m·K
      electricalResistivity: 1e16 // Ω·m (excellent insulator)
    },
    
    physicalProperties: {
      weight: {
        value: 25,
        unit: "kg"
      },
      packaging: "25kg bags on pallets or bulk silo delivery"
    },
    
    performanceSpecs: {
      operatingTemperature: {
        min: -50,
        max: 80,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Polymerization, pelletizing, quality control",
    qualityGrade: "Prime Virgin",
    applicationAreas: ["packaging", "automotive", "consumer_goods", "medical"],
    industryStandards: ["ASTM D1238", "ISO 1133", "EN 12086"],
    countryOfOrigin: "Belgium",
    
    regulatoryApprovals: ["FDA 21 CFR 177.1520", "EU 10/2011"],
    environmentalCompliance: ["REACH", "Recyclable"],
    
    negotiationVariables: [
      {
        id: "delivery_method",
        name: "Delivery Method",
        type: "options",
        description: "Packaging and delivery options",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "bags", label: "25kg Bags on Pallets", priceModifier: 0, leadTimeModifier: 0 },
          { value: "big_bags", label: "1000kg Big Bags", priceModifier: -25, leadTimeModifier: 1 },
          { value: "silo", label: "Bulk Silo Delivery", priceModifier: -45, leadTimeModifier: 0, description: "Minimum 20 tons" }
        ]
      },
      {
        id: "melt_index",
        name: "Melt Index Selection",
        type: "options",
        description: "Melt flow rate for different applications",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "mi_5", label: "MI 5 (Thick wall molding)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "mi_12", label: "MI 12 (Standard)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "mi_25", label: "MI 25 (Thin wall molding)", priceModifier: 15, leadTimeModifier: 3 }
        ]
      },
      {
        id: "additive_package",
        name: "Additive Package",
        type: "options",
        description: "Special additive formulations",
        priceImpact: "medium",
        leadTimeImpact: "medium",
        options: [
          { value: "standard", label: "Standard Stabilization", priceModifier: 0, leadTimeModifier: 0 },
          { value: "uv_stabilized", label: "UV Stabilized", priceModifier: 80, leadTimeModifier: 5 },
          { value: "antistatic", label: "Antistatic", priceModifier: 120, leadTimeModifier: 7 },
          { value: "food_grade", label: "Food Contact Grade", priceModifier: 150, leadTimeModifier: 10 }
        ]
      },
      {
        id: "color_option",
        name: "Color Option",
        type: "options",
        description: "Color masterbatch options",
        priceImpact: "medium",
        leadTimeImpact: "medium",
        options: [
          { value: "natural", label: "Natural", priceModifier: 0, leadTimeModifier: 0 },
          { value: "black", label: "Black", priceModifier: 35, leadTimeModifier: 3 },
          { value: "white", label: "White", priceModifier: 45, leadTimeModifier: 3 },
          { value: "custom", label: "Custom Color", priceModifier: 120, leadTimeModifier: 14 }
        ]
      }
    ],
    
    certifications: [
      "ISO 9001:2015",
      "FDA 21 CFR 177.1520",
      "EU 10/2011",
      "REACH Registration",
      "Kosher Certification"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, maxQuantity: 9, unitPrice: 1.45, currency: "EUR" }, // per kg
        { minQuantity: 10, maxQuantity: 24, unitPrice: 1.35, currency: "EUR" }, // full truck ~25 tons
        { minQuantity: 25, maxQuantity: 49, unitPrice: 1.28, currency: "EUR" },
        { minQuantity: 50, unitPrice: 1.22, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "dap",
      leadTime: {
        min: 7,
        max: 14,
        unit: "days"
      },
      minimumOrderQuantity: 1, // 1 ton minimum
      validUntil: new Date("2025-04-30"),
      currency: "EUR",
      includesVAT: false,
      warrantyPeriod: {
        duration: 12,
        unit: "months"
      },
      
      minimumCommitment: {
        quantity: 100,
        period: "yearly",
        unit: "tons"
      },
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.0,
        qualityDocumentation: ["Certificate of Analysis", "Migration Test Report"],
        returnPolicy: "Quality claims within 6 months of delivery"
      },
      
      packagingRequirements: {
        type: "PE bags with identification labels",
        markingRequirements: ["Grade", "Lot number", "Production date", "Specifications"],
        specialHandling: false,
        returnablePackaging: false
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 10,
      quantityFlexibility: 25,
      deliveryFlexibility: 5,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "HDPE",
      "injection molding",
      "polymer pellets",
      "food grade",
      "full truck",
      "silo delivery",
      "UV stabilized",
      "custom colors"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 4: Industrial Isopropyl Alcohol 99.9%
  {
    id: "ind-004",
    supplierId: "supplier-chemical-001",
    name: "Industrial Isopropyl Alcohol 99.9% Pure",
    description: "High-purity industrial grade isopropyl alcohol (IPA) for cleaning, degreasing, and solvent applications. Available in drums and IBCs with hazmat shipping compliance. Ideal for electronics, pharmaceutical, and precision cleaning applications.",
    category: "Raw Materials",
    subcategory: "Chemicals", 
    sku: "IPA-999-IND",
    images: [
      "/images/products/ipa-drum-1.jpg",
      "/images/products/chemical-ibc-2.jpg",
      "/images/products/hazmat-label-3.jpg"
    ],
    
    specifications: {
      "Chemical Name": "Isopropyl Alcohol (2-Propanol)",
      "Purity": "99.9% min",
      "Water Content": "0.1% max",
      "Packaging": "200L drums or 1000L IBCs",
      "Flash Point": "12°C",
      "Boiling Point": "82.3°C"
    },
    
    materialProperties: {
      grade: "Technical Grade 99.9%",
      density: 786, // kg/m³ at 20°C
    },
    
    physicalProperties: {
      volume: {
        value: 200,
        unit: "l"
      },
      packaging: "Steel drums with UN specification"
    },
    
    performanceSpecs: {
      operatingTemperature: {
        min: -89,
        max: 82,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Distillation and purification",
    qualityGrade: "Technical Grade",
    applicationAreas: ["electronics", "pharmaceutical", "cleaning", "chemical_processing"],
    industryStandards: ["USP", "Ph. Eur.", "ASTM D770"],
    countryOfOrigin: "Germany",
    
    regulatoryApprovals: ["USP Grade", "Ph. Eur.", "FDA Listed"],
    environmentalCompliance: ["REACH"],
    
    safetyDataSheet: {
      url: "/documents/ipa-sds.pdf",
      version: "1.2",
      lastUpdated: new Date("2024-06-15")
    },
    
    negotiationVariables: [
      {
        id: "container_type",
        name: "Container Type",
        type: "options",
        description: "Packaging container options",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "drum_200l", label: "200L Steel Drums", priceModifier: 0, leadTimeModifier: 0 },
          { value: "ibc_1000l", label: "1000L IBC Containers", priceModifier: -25, leadTimeModifier: 1 },
          { value: "iso_tank", label: "ISO Tank (20,000L)", priceModifier: -85, leadTimeModifier: 7, description: "Minimum 20,000L" }
        ]
      },
      {
        id: "hazmat_surcharge",
        name: "Hazmat Freight Surcharge",
        type: "options",
        description: "Hazardous material shipping options",
        priceImpact: "medium",
        leadTimeImpact: "medium",
        options: [
          { value: "standard", label: "Standard Hazmat Shipping", priceModifier: 150, leadTimeModifier: 2 },
          { value: "expedited", label: "Expedited Hazmat", priceModifier: 300, leadTimeModifier: 0 },
          { value: "pickup", label: "Customer Pickup", priceModifier: 0, leadTimeModifier: 0 }
        ]
      },
      {
        id: "purity_grade",
        name: "Purity Grade",
        type: "options",
        description: "Different purity levels available",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "technical", label: "Technical 99.9%", priceModifier: 0, leadTimeModifier: 0 },
          { value: "usp", label: "USP Grade", priceModifier: 180, leadTimeModifier: 3 },
          { value: "electronic", label: "Electronic Grade 99.99%", priceModifier: 420, leadTimeModifier: 7 }
        ]
      }
    ],
    
    certifications: [
      "ISO 9001:2015",
      "USP Monograph",
      "Ph. Eur. Monograph", 
      "REACH Registration",
      "UN Packaging Certification"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, maxQuantity: 9, unitPrice: 2.85, currency: "EUR" }, // per liter
        { minQuantity: 10, maxQuantity: 49, unitPrice: 2.65, currency: "EUR" },
        { minQuantity: 50, maxQuantity: 199, unitPrice: 2.45, currency: "EUR" },
        { minQuantity: 200, unitPrice: 2.25, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "dap",
      leadTime: {
        min: 5,
        max: 10,
        unit: "days"
      },
      minimumOrderQuantity: 1,
      validUntil: new Date("2025-03-31"),
      currency: "EUR",
      includesVAT: false,
      
      shippingTerms: {
        hazmatClassification: "UN1219 Class 3",
        specialTransport: true,
        insuranceRequired: true,
        trackingRequired: true
      },
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.5,
        qualityDocumentation: ["Certificate of Analysis", "Purity Report", "Water Content Report"],
        returnPolicy: "Quality claims within 30 days"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 8,
      quantityFlexibility: 15,
      deliveryFlexibility: 3,
      paymentTermsFlexible: false
    },
    
    keywords: [
      "isopropyl alcohol",
      "IPA",
      "99.9% pure",
      "hazmat",
      "electronics grade",
      "USP grade",
      "cleaning solvent",
      "pharmaceutical"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 5: Food-grade Citric Acid (25 kg bags)
  {
    id: "ind-005",
    supplierId: "supplier-food-001",
    name: "Food Grade Citric Acid Monohydrate 25kg",
    description: "High-quality food grade citric acid monohydrate for food and beverage applications. Kosher and Halal certified. Available in 25kg bags with custom pallet configurations. Excellent for acidification, preservation, and flavor enhancement.",
    category: "Raw Materials",
    subcategory: "Chemicals",
    sku: "CA-FOOD-25KG",
    images: [
      "/images/products/citric-acid-bags-1.jpg",
      "/images/products/food-grade-pallet-2.jpg",
      "/images/products/kosher-halal-cert-3.jpg"
    ],
    
    specifications: {
      "Chemical Name": "Citric Acid Monohydrate",
      "Grade": "Food Grade",
      "Purity": "99.5-100.5%",
      "Moisture": "7.5-9.0%",
      "Heavy Metals": "≤ 5 ppm",
      "Mesh Size": "8-80 mesh"
    },
    
    materialProperties: {
      grade: "Food Grade",
      density: 1665, // kg/m³
    },
    
    physicalProperties: {
      weight: {
        value: 25,
        unit: "kg"
      },
      packaging: "PE-lined paper bags on wooden pallets"
    },
    
    performanceSpecs: {
      operatingTemperature: {
        min: 5,
        max: 25,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Fermentation, crystallization, drying",
    qualityGrade: "Food Grade",
    applicationAreas: ["food_processing", "beverages", "pharmaceutical", "cosmetics"],
    industryStandards: ["FCC", "USP", "Ph. Eur.", "E330"],
    countryOfOrigin: "China",
    
    regulatoryApprovals: ["FDA GRAS", "EU E330", "Kosher", "Halal"],
    environmentalCompliance: ["Organic certified available"],
    
    negotiationVariables: [
      {
        id: "certification_type",
        name: "Certification Options",
        type: "options",
        description: "Religious and organic certifications",
        priceImpact: "low",
        leadTimeImpact: "medium",
        options: [
          { value: "standard", label: "Standard Food Grade", priceModifier: 0, leadTimeModifier: 0 },
          { value: "kosher", label: "Kosher Certified", priceModifier: 25, leadTimeModifier: 5 },
          { value: "halal", label: "Halal Certified", priceModifier: 25, leadTimeModifier: 5 },
          { value: "kosher_halal", label: "Kosher + Halal", priceModifier: 35, leadTimeModifier: 7 },
          { value: "organic", label: "Organic Certified", priceModifier: 180, leadTimeModifier: 14 }
        ]
      },
      {
        id: "pallet_config",
        name: "Pallet Configuration",
        type: "options",
        description: "Pallet height and bag arrangement",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard (40 bags/pallet)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "low_profile", label: "Low Profile (32 bags/pallet)", priceModifier: 15, leadTimeModifier: 1 },
          { value: "high_stack", label: "High Stack (48 bags/pallet)", priceModifier: -8, leadTimeModifier: 0 }
        ]
      },
      {
        id: "mesh_size",
        name: "Mesh Size",
        type: "options",
        description: "Particle size options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard 8-80 mesh", priceModifier: 0, leadTimeModifier: 0 },
          { value: "fine", label: "Fine 20-80 mesh", priceModifier: 35, leadTimeModifier: 3 },
          { value: "coarse", label: "Coarse 8-40 mesh", priceModifier: 15, leadTimeModifier: 2 }
        ]
      }
    ],
    
    certifications: [
      "ISO 9001:2015",
      "HACCP",
      "BRC Food Safety",
      "Kosher Certification",
      "Halal Certification",
      "FDA Registration"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, maxQuantity: 19, unitPrice: 1.25, currency: "EUR" }, // per kg
        { minQuantity: 20, maxQuantity: 99, unitPrice: 1.18, currency: "EUR" }, // full pallet
        { minQuantity: 100, maxQuantity: 499, unitPrice: 1.12, currency: "EUR" },
        { minQuantity: 500, unitPrice: 1.05, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "dap",
      leadTime: {
        min: 10,
        max: 21,
        unit: "days"
      },
      minimumOrderQuantity: 1, // 1 ton minimum
      validUntil: new Date("2025-07-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "tightened",
        acceptanceRate: 99.8,
        qualityDocumentation: ["Certificate of Analysis", "Heavy Metals Report", "Microbiological Report"],
        returnPolicy: "Full replacement for quality non-conformance"
      },
      
      packagingRequirements: {
        type: "Food grade PE-lined paper bags",
        markingRequirements: ["Lot number", "Production date", "Best before date", "Certifications"],
        specialHandling: false,
        returnablePackaging: false
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 6,
      quantityFlexibility: 20,
      deliveryFlexibility: 7,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "citric acid",
      "food grade",
      "kosher",
      "halal",
      "25kg bags",
      "pallet configuration",
      "organic option",
      "E330"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 6: 4-Axis CNC Machining Centre
  {
    id: "ind-006",
    supplierId: "supplier-cnc-001",
    name: "DMG MORI DMU 50 4-Axis CNC Machining Centre",
    description: "High-precision 4-axis CNC machining centre with automatic tool changer and workpiece clamping system. Features advanced control system, 24-tool capacity, and integrated workpiece measurement for complex component manufacturing.",
    category: "Machinery & Equipment",
    subcategory: "CNC Machines",
    sku: "DMU50-4AXIS",
    images: [
      "/images/products/cnc-machine-1.jpg",
      "/images/products/dmg-mori-control-2.jpg",
      "/images/products/tool-changer-3.jpg"
    ],
    
    specifications: {
      "Working Envelope X": "500 mm",
      "Working Envelope Y": "420 mm", 
      "Working Envelope Z": "400 mm",
      "A-Axis Range": "±120°",
      "Spindle Speed": "12,000 RPM",
      "Tool Capacity": "24 tools"
    },
    
    materialProperties: {
      workingMaterials: ["Steel", "Aluminum", "Titanium", "Plastics", "Composites"],
      maxHardness: "HRC 65"
    },
    
    physicalProperties: {
      weight: {
        value: 8500,
        unit: "kg"
      },
      dimensions: "3200 x 2800 x 2600 mm"
    },
    
    performanceSpecs: {
      positioningAccuracy: "±0.005 mm",
      repeatability: "±0.003 mm",
      powerConsumption: 25, // kW
      operatingTemperature: {
        min: 18,
        max: 22,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Precision machining",
    qualityGrade: "Industrial",
    applicationAreas: ["aerospace", "automotive", "medical", "tooling"],
    industryStandards: ["ISO 230-2", "VDI/DGQ 3441"],
    countryOfOrigin: "Germany",
    
    regulatoryApprovals: ["CE Marking", "UL Listed"],
    environmentalCompliance: ["RoHS"],
    
    negotiationVariables: [
      {
        id: "tooling_package",
        name: "Tooling Package",
        type: "options",
        description: "Tool holder and cutting tool packages",
        priceImpact: "high",
        leadTimeImpact: "medium",
        options: [
          { value: "basic", label: "Basic Package (10 tools)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "standard", label: "Standard Package (24 tools)", priceModifier: 8500, leadTimeModifier: 2 },
          { value: "premium", label: "Premium Package (40 tools)", priceModifier: 18500, leadTimeModifier: 4 }
        ]
      },
      {
        id: "installation_service",
        name: "Installation & Commissioning",
        type: "boolean",
        description: "Professional installation and commissioning service",
        priceImpact: "medium",
        leadTimeImpact: "low",
        priceModifier: 12000,
        leadTimeModifier: 7
      },
      {
        id: "warranty_extension",
        name: "Extended Warranty",
        type: "options",
        description: "Warranty extension options",
        priceImpact: "medium",
        leadTimeImpact: "none",
        options: [
          { value: "12months", label: "12 Months Standard", priceModifier: 0, leadTimeModifier: 0 },
          { value: "24months", label: "24 Months Extended", priceModifier: 9500, leadTimeModifier: 0 },
          { value: "36months", label: "36 Months Premium", priceModifier: 18500, leadTimeModifier: 0 }
        ]
      },
      {
        id: "training_hours",
        name: "Operator Training",
        type: "range",
        description: "Operator training hours",
        priceImpact: "low",
        leadTimeImpact: "low",
        min: 16,
        max: 80,
        step: 8,
        unit: "hours",
        pricePerUnit: 125
      }
    ],
    
    certifications: [
      "DMG MORI Authorized",
      "ISO 9001:2015",
      "CE Marking"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, unitPrice: 185000, currency: "EUR" }
      ],
      paymentTerms: "30_advance_70_delivery",
      deliveryTerms: "ddp",
      leadTime: {
        min: 84,
        max: 112,
        unit: "days"
      },
      minimumOrderQuantity: 1,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "factory_acceptance",
        acceptanceRate: 100,
        qualityDocumentation: ["Factory Acceptance Test", "Calibration Certificate", "Performance Report"],
        returnPolicy: "Full warranty coverage"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 12,
      quantityFlexibility: 0,
      deliveryFlexibility: 14,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "cnc machine",
      "4-axis",
      "dmg mori",
      "machining centre",
      "precision manufacturing",
      "automatic tool changer"
    ],
    
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 7: Air-Cooled Screw Compressor 75 kW
  {
    id: "ind-007",
    supplierId: "supplier-compressor-001",
    name: "Atlas Copco GA 75 VSD+ Air-Cooled Screw Compressor",
    description: "75 kW variable speed drive air-cooled screw compressor with integrated dryer and smart controls. Energy-efficient design with remote monitoring capabilities for continuous industrial operation.",
    category: "Machinery & Equipment",
    subcategory: "Compressors",
    sku: "GA75VSD-AC",
    images: [
      "/images/products/atlas-copco-compressor-1.jpg",
      "/images/products/vsd-control-panel-2.jpg",
      "/images/products/integrated-dryer-3.jpg"
    ],
    
    specifications: {
      "Motor Power": "75 kW (100 HP)",
      "Air Flow": "13.1 m³/min at 7 bar",
      "Working Pressure": "5-13 bar",
      "Noise Level": "68 dB(A) at 1m",
      "Air Quality": "ISO 8573-1 Class 1.4.1"
    },
    
    materialProperties: {
      airQuality: "ISO 8573-1 Class 1.4.1",
      oilContent: "<3 ppm"
    },
    
    physicalProperties: {
      weight: {
        value: 1850,
        unit: "kg"
      },
      dimensions: "1760 x 1400 x 1940 mm"
    },
    
    performanceSpecs: {
      motorPower: 75, // kW
      energyEfficiency: "IE4 Premium",
      specificPower: 5.7, // kW/(m³/min)
      operatingTemperature: {
        min: -10,
        max: 46,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Precision assembly",
    qualityGrade: "Industrial",
    applicationAreas: ["manufacturing", "automotive", "food_processing", "pharmaceuticals"],
    industryStandards: ["ISO 1217", "ASME"],
    countryOfOrigin: "Belgium",
    
    regulatoryApprovals: ["CE Marking", "ASME Certified"],
    environmentalCompliance: ["Energy Efficiency Directive"],
    
    negotiationVariables: [
      {
        id: "voltage_option",
        name: "Voltage Configuration",
        type: "options",
        description: "Electrical voltage options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "400v_50hz", label: "400V/50Hz (Standard EU)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "480v_60hz", label: "480V/60Hz (US/Canada)", priceModifier: 850, leadTimeModifier: 7 },
          { value: "380v_50hz", label: "380V/50Hz (Asia/Pacific)", priceModifier: 450, leadTimeModifier: 5 }
        ]
      },
      {
        id: "startup_service",
        name: "On-site Startup & Commissioning",
        type: "boolean",
        description: "Professional startup and commissioning service",
        priceImpact: "low",
        leadTimeImpact: "low",
        priceModifier: 1850,
        leadTimeModifier: 3
      },
      {
        id: "spare_parts_kit",
        name: "Spare Parts Kit",
        type: "options",
        description: "Maintenance spare parts packages",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "none", label: "No Spare Kit", priceModifier: 0, leadTimeModifier: 0 },
          { value: "basic", label: "Basic Kit (1 year)", priceModifier: 1250, leadTimeModifier: 0 },
          { value: "extended", label: "Extended Kit (2 years)", priceModifier: 2850, leadTimeModifier: 0 }
        ]
      },
      {
        id: "remote_monitoring",
        name: "SMARTLINK Remote Monitoring",
        type: "boolean",
        description: "Remote monitoring and diagnostics system",
        priceImpact: "low",
        leadTimeImpact: "low",
        priceModifier: 950,
        leadTimeModifier: 0
      }
    ],
    
    certifications: [
      "Atlas Copco Authorized",
      "ISO 9001:2015",
      "BAFA Energy Efficiency"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, unitPrice: 28500, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "fca",
      leadTime: {
        min: 42,
        max: 56,
        unit: "days"
      },
      minimumOrderQuantity: 1,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.5,
        qualityDocumentation: ["Performance Test Report", "Noise Level Certificate", "Energy Efficiency Report"],
        returnPolicy: "2-year manufacturer warranty"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 8,
      quantityFlexibility: 0,
      deliveryFlexibility: 7,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "air compressor",
      "screw compressor",
      "75kw",
      "atlas copco",
      "variable speed",
      "energy efficient"
    ],
    
    isActive: true,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 8: Hydraulic Hose (SAE 100 R2, bulk reels)
  {
    id: "ind-008",
    supplierId: "supplier-hydraulic-001",
    name: "Parker 387TC SAE 100 R2AT Hydraulic Hose - Bulk Reel",
    description: "High-pressure hydraulic hose SAE 100 R2AT specification with two-wire braid reinforcement. Available in bulk reels with cut-to-length and fitting crimping services for industrial hydraulic applications.",
    category: "Components & Parts",
    subcategory: "Hydraulic Components",
    sku: "PARKER-387TC-R2",
    images: [
      "/images/products/hydraulic-hose-reel-1.jpg",
      "/images/products/parker-hose-spec-2.jpg",
      "/images/products/crimping-service-3.jpg"
    ],
    
    specifications: {
      "Inner Diameter": "12.7 mm (1/2\")",
      "Working Pressure": "280 bar (4060 psi)",
      "Burst Pressure": "1120 bar (16240 psi)",
      "Temperature Range": "-40°C to +100°C",
      "Bend Radius": "102 mm minimum"
    },
    
    materialProperties: {
      tubeType: "Synthetic rubber (NBR)",
      reinforcement: "Two high-tensile steel wire braids",
      coverType: "Synthetic rubber, oil and weather resistant"
    },
    
    physicalProperties: {
      weight: {
        value: 0.42,
        unit: "kg/meter"
      },
      dimensions: "20.6 mm outer diameter"
    },
    
    performanceSpecs: {
      workingPressure: 280, // bar
      burstPressure: 1120, // bar
      impulseRating: 1000000, // cycles
      operatingTemperature: {
        min: -40,
        max: 100,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Extrusion and braiding",
    qualityGrade: "Industrial",
    applicationAreas: ["construction", "mining", "manufacturing", "mobile_hydraulics"],
    industryStandards: ["SAE 100 R2AT", "EN 853 2SN", "ISO 1436"],
    countryOfOrigin: "USA",
    
    regulatoryApprovals: ["SAE Certified"],
    environmentalCompliance: ["RoHS"],
    
    negotiationVariables: [
      {
        id: "cut_length_service",
        name: "Cut-to-Length Service",
        type: "boolean",
        description: "Professional cutting service with clean cuts",
        priceImpact: "low",
        leadTimeImpact: "low",
        priceModifier: 0.45, // per meter
        leadTimeModifier: 1
      },
      {
        id: "fitting_crimping",
        name: "Hydraulic Fitting Crimping",
        type: "options",
        description: "Hydraulic fitting crimping service",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "none", label: "No Fittings", priceModifier: 0, leadTimeModifier: 0 },
          { value: "basic_jic", label: "JIC Fittings (both ends)", priceModifier: 8.50, leadTimeModifier: 1 },
          { value: "basic_bsp", label: "BSP Fittings (both ends)", priceModifier: 9.20, leadTimeModifier: 1 },
          { value: "custom", label: "Custom Fitting Configuration", priceModifier: 12.80, leadTimeModifier: 2 }
        ]
      },
      {
        id: "testing_certification",
        name: "Pressure Test Certificate",
        type: "boolean",
        description: "Individual pressure test certificate",
        priceImpact: "low",
        leadTimeImpact: "low",
        priceModifier: 2.50,
        leadTimeModifier: 1
      },
      {
        id: "quantity_discount",
        name: "Volume Discount",
        type: "range",
        description: "Volume discount for large quantities",
        priceImpact: "medium",
        leadTimeImpact: "none",
        min: 100,
        max: 2000,
        step: 100,
        unit: "meters",
        pricePerUnit: -0.05 // discount per meter
      }
    ],
    
    certifications: [
      "Parker Authorized",
      "ISO 9001:2015",
      "EN ISO 18752"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 10, maxQuantity: 99, unitPrice: 4.85, currency: "EUR" }, // per meter
        { minQuantity: 100, maxQuantity: 499, unitPrice: 4.65, currency: "EUR" },
        { minQuantity: 500, maxQuantity: 999, unitPrice: 4.35, currency: "EUR" },
        { minQuantity: 1000, unitPrice: 4.15, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "cpt",
      leadTime: {
        min: 3,
        max: 5,
        unit: "days"
      },
      minimumOrderQuantity: 10, // meters
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.8,
        qualityDocumentation: ["Batch Certificate", "Pressure Test Report"],
        returnPolicy: "Quality claims within 30 days"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 10,
      quantityFlexibility: 25,
      deliveryFlexibility: 3,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "hydraulic hose",
      "sae 100 r2",
      "parker",
      "bulk reel",
      "cut to length",
      "fitting crimping"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 9: NEMA 3-phase Induction Motors 5 HP
  {
    id: "ind-009",
    supplierId: "supplier-motors-001",
    name: "WEG W22 Premium Efficiency 5 HP 3-Phase Induction Motor",
    description: "NEMA Premium Efficiency 5 HP three-phase induction motor with cast iron TEFC frame. Features high efficiency, robust construction, and versatile mounting for industrial applications including pumps, fans, and conveyors.",
    category: "Components & Parts",
    subcategory: "Electric Motors",
    sku: "WEG-W22-5HP-184T",
    images: [
      "/images/products/weg-motor-1.jpg",
      "/images/products/motor-nameplate-2.jpg",
      "/images/products/tefc-design-3.jpg"
    ],
    
    specifications: {
      "Power": "5 HP (3.7 kW)",
      "Voltage": "230/460V",
      "Speed": "1765 RPM",
      "Frame Size": "184T",
      "Efficiency": "89.5% (NEMA Premium)",
      "Service Factor": "1.15"
    },
    
    materialProperties: {
      frameType: "Cast iron TEFC",
      rotorType: "Squirrel cage, aluminum die-cast",
      bearingType: "Deep groove ball bearings",
      insulationClass: "Class F (155°C)"
    },
    
    physicalProperties: {
      weight: {
        value: 52,
        unit: "kg"
      },
      dimensions: "368 x 305 x 279 mm"
    },
    
    performanceSpecs: {
      motorPower: 3.7, // kW
      efficiency: 89.5, // %
      powerFactor: 0.84,
      startingTorque: 250, // % of rated
      operatingTemperature: {
        min: -20,
        max: 40,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Precision assembly",
    qualityGrade: "Industrial",
    applicationAreas: ["pumps", "fans", "conveyors", "general_industrial"],
    industryStandards: ["NEMA MG 1", "IEEE 841", "UL 1004"],
    countryOfOrigin: "Brazil",
    
    regulatoryApprovals: ["UL Listed", "CSA Approved", "NEMA Premium"],
    environmentalCompliance: ["RoHS"],
    
    negotiationVariables: [
      {
        id: "shaft_key_spec",
        name: "Shaft Key Specification",
        type: "options",
        description: "Shaft keyway specification options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard Key (0.25\" x 0.125\")", priceModifier: 0, leadTimeModifier: 0 },
          { value: "metric", label: "Metric Key (6mm x 3mm)", priceModifier: 25, leadTimeModifier: 3 },
          { value: "custom", label: "Custom Key Specification", priceModifier: 65, leadTimeModifier: 7 }
        ]
      },
      {
        id: "ip_rating",
        name: "IP Protection Rating",
        type: "options",
        description: "Ingress protection rating options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "ip55", label: "IP55 Standard", priceModifier: 0, leadTimeModifier: 0 },
          { value: "ip56", label: "IP56 Enhanced", priceModifier: 85, leadTimeModifier: 5 },
          { value: "ip65", label: "IP65 Washdown Duty", priceModifier: 195, leadTimeModifier: 10 }
        ]
      },
      {
        id: "paint_color",
        name: "Frame Paint Color",
        type: "options",
        description: "Motor frame paint color options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "blue_standard", label: "WEG Blue (Standard)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "gray_ral7035", label: "Light Gray RAL 7035", priceModifier: 45, leadTimeModifier: 7 },
          { value: "custom_color", label: "Custom Color (RAL Chart)", priceModifier: 125, leadTimeModifier: 14 }
        ]
      },
      {
        id: "mounting_options",
        name: "Additional Mounting Options",
        type: "multiselect",
        description: "Additional mounting and protection options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "drip_cover", label: "Drip Cover", priceModifier: 35, leadTimeModifier: 0 },
          { value: "mounting_feet", label: "Stainless Steel Mounting Feet", priceModifier: 75, leadTimeModifier: 3 },
          { value: "vibration_pads", label: "Vibration Isolation Pads", priceModifier: 25, leadTimeModifier: 0 }
        ]
      }
    ],
    
    certifications: [
      "WEG Authorized",
      "UL Listed",
      "NEMA Premium"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, maxQuantity: 4, unitPrice: 1285, currency: "USD" },
        { minQuantity: 5, maxQuantity: 19, unitPrice: 1225, currency: "USD" },
        { minQuantity: 20, unitPrice: 1165, currency: "USD" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "fob",
      leadTime: {
        min: 14,
        max: 21,
        unit: "days"
      },
      minimumOrderQuantity: 1,
      validUntil: new Date("2025-12-31"),
      currency: "USD",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.5,
        qualityDocumentation: ["Test Report", "Efficiency Certificate"],
        returnPolicy: "3-year manufacturer warranty"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 6,
      quantityFlexibility: 15,
      deliveryFlexibility: 7,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "electric motor",
      "induction motor",
      "5hp",
      "weg",
      "nema premium",
      "three phase",
      "tefc"
    ],
    
    isActive: true,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 10: High-precision Angular Bearings (ABEC-7)
  {
    id: "ind-010",
    supplierId: "supplier-bearings-001",
    name: "SKF 7208 BECBP Angular Contact Ball Bearing ABEC-7",
    description: "High-precision angular contact ball bearing manufactured to ABEC-7 standards with polyamide cage. Optimized for machine tool applications requiring high speed and precision with ceramic ball upgrade option available.",
    category: "Components & Parts",
    subcategory: "Bearings",
    sku: "SKF-7208-ABEC7",
    images: [
      "/images/products/skf-bearing-1.jpg",
      "/images/products/abec7-precision-2.jpg",
      "/images/products/ceramic-balls-3.jpg"
    ],
    
    specifications: {
      "Inner Diameter": "40 mm",
      "Outer Diameter": "80 mm",
      "Width": "18 mm",
      "Contact Angle": "40°",
      "Precision Grade": "ABEC-7 (ISO P4)",
      "Speed Rating": "28,000 RPM (grease)"
    },
    
    materialProperties: {
      ringMaterial: "Through-hardened bearing steel (100Cr6)",
      ballMaterial: "Bearing steel (ceramic option available)",
      cageMaterial: "Glass fiber reinforced polyamide",
      lubricationType: "High-performance synthetic grease"
    },
    
    physicalProperties: {
      weight: {
        value: 0.37,
        unit: "kg"
      },
      dimensions: "40 x 80 x 18 mm"
    },
    
    performanceSpecs: {
      dynamicLoadRating: 22.5, // kN
      staticLoadRating: 16.6, // kN
      speedRating: 28000, // RPM with grease
      runningAccuracy: "±2.5 μm radial",
      operatingTemperature: {
        min: -40,
        max: 150,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Precision grinding and assembly",
    qualityGrade: "Precision",
    applicationAreas: ["machine_tools", "spindles", "precision_equipment", "aerospace"],
    industryStandards: ["ISO 492", "ABEC-7", "DIN 620"],
    countryOfOrigin: "Sweden",
    
    regulatoryApprovals: ["ISO 9001", "AS9100"],
    environmentalCompliance: ["RoHS"],
    
    negotiationVariables: [
      {
        id: "grease_type",
        name: "Lubrication Grease Type",
        type: "options",
        description: "Specialized grease options for different applications",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard Lithium Complex (MT33)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "high_temp", label: "High Temperature (LGMT 2)", priceModifier: 8.50, leadTimeModifier: 3 },
          { value: "low_temp", label: "Low Temperature (LGLT 2)", priceModifier: 12.50, leadTimeModifier: 5 },
          { value: "food_grade", label: "Food Grade (LGFP 2)", priceModifier: 18.50, leadTimeModifier: 7 }
        ]
      },
      {
        id: "batch_traceability",
        name: "Batch Traceability Certificate",
        type: "boolean",
        description: "Individual batch traceability documentation",
        priceImpact: "low",
        leadTimeImpact: "low",
        priceModifier: 15.00,
        leadTimeModifier: 2
      },
      {
        id: "ceramic_balls",
        name: "Ceramic Ball Upgrade",
        type: "boolean",
        description: "Silicon Nitride ceramic balls for higher speed and longer life",
        priceImpact: "high",
        leadTimeImpact: "medium",
        priceModifier: 285.00,
        leadTimeModifier: 14
      },
      {
        id: "quantity_sets",
        name: "Matched Bearing Sets",
        type: "options",
        description: "Precision matched bearing sets",
        priceImpact: "high",
        leadTimeImpact: "medium",
        options: [
          { value: "single", label: "Single Bearing", priceModifier: 0, leadTimeModifier: 0 },
          { value: "pair_db", label: "Matched Pair (DB)", priceModifier: 165.50, leadTimeModifier: 7 },
          { value: "pair_df", label: "Matched Pair (DF)", priceModifier: 165.50, leadTimeModifier: 7 },
          { value: "quad_set", label: "Matched Quad Set", priceModifier: 485.50, leadTimeModifier: 14 }
        ]
      }
    ],
    
    certifications: [
      "SKF Authorized",
      "ISO 9001:2015",
      "AS9100D Aerospace"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 2, maxQuantity: 9, unitPrice: 145.50, currency: "EUR" },
        { minQuantity: 10, maxQuantity: 49, unitPrice: 138.25, currency: "EUR" },
        { minQuantity: 50, maxQuantity: 99, unitPrice: 131.00, currency: "EUR" },
        { minQuantity: 100, unitPrice: 123.75, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "ddp",
      leadTime: {
        min: 28,
        max: 42,
        unit: "days"
      },
      minimumOrderQuantity: 2,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "tightened",
        acceptanceRate: 99.9,
        qualityDocumentation: ["Individual Inspection Certificate", "Precision Measurement Report"],
        returnPolicy: "Full replacement for precision non-conformance"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 8,
      quantityFlexibility: 20,
      deliveryFlexibility: 14,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "angular contact bearing",
      "abec-7",
      "precision bearing",
      "skf",
      "machine tool",
      "high speed",
      "ceramic option"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-12-30")
  }
];

export default industrialProducts1to10; 