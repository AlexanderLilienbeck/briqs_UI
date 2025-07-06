// Industrial Products Data - Products 11-20 (Specialized Products & Services)
// Enhanced B2B product specifications for industrial procurement
// Supports complex negotiation variables and technical specifications

import { IndustrialProduct } from '../../types/industrial-products';

const industrialProducts11to20: IndustrialProduct[] = [
  // Product 11: Pharma-grade Stainless Reactor 500 L
  {
    id: "ind-011",
    supplierId: "supplier-pharma-001",
    name: "Pharma-Grade Stainless Steel Reactor 500L",
    description: "Pharmaceutical-grade stainless steel reactor vessel with material test reports and surface Ra finish certification. Features jacketed design, agitation system, and full documentation package for GMP compliance.",
    category: "Process Equipment",
    subcategory: "Reactors",
    sku: "SS316L-REACTOR-500L",
    images: [
      "/images/products/pharma-reactor-1.jpg",
      "/images/products/surface-finish-2.jpg",
      "/images/products/material-certs-3.jpg"
    ],
    
    specifications: {
      "Volume": "500 L working volume",
      "Material": "SS316L pharmaceutical grade",
      "Surface Finish": "Ra ≤ 0.4 μm (electropolished)",
      "Design Pressure": "6 bar / Full vacuum",
      "Temperature Range": "-10°C to +200°C",
      "Agitation": "Variable speed 10-200 RPM"
    },
    
    materialProperties: {
      vesselMaterial: "SS316L pharmaceutical grade",
      surfaceFinish: "Ra ≤ 0.4 μm electropolished",
      sealMaterials: "EPDM FDA approved"
    },
    
    physicalProperties: {
      weight: {
        value: 850,
        unit: "kg"
      },
      dimensions: "1200 x 1200 x 1800 mm"
    },
    
    performanceSpecs: {
      workingVolume: 500, // L
      designPressure: 6, // bar
      vacuumRating: "Full vacuum capable",
      operatingTemperature: {
        min: -10,
        max: 200,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Precision welding and electropolishing",
    qualityGrade: "Pharmaceutical",
    applicationAreas: ["pharmaceutical", "biotechnology", "fine_chemicals", "cosmetics"],
    industryStandards: ["ASME BPE", "3-A Sanitary", "FDA 21 CFR 177"],
    countryOfOrigin: "Germany",
    
    regulatoryApprovals: ["FDA", "EU GMP", "ASME Certified"],
    environmentalCompliance: ["ATEX Zone 1"],
    
    negotiationVariables: [
      {
        id: "material_test_reports",
        name: "Material Test Reports",
        type: "options",
        description: "Material certification and traceability documentation",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard Mill Certificates", priceModifier: 0, leadTimeModifier: 0 },
          { value: "enhanced", label: "Enhanced 3.1 Certificates", priceModifier: 850, leadTimeModifier: 3 },
          { value: "full_trace", label: "Full Traceability Package", priceModifier: 2150, leadTimeModifier: 7 }
        ]
      },
      {
        id: "surface_finish",
        name: "Surface Finish Specification",
        type: "options",
        description: "Interior surface finish options",
        priceImpact: "high",
        leadTimeImpact: "medium",
        options: [
          { value: "standard", label: "Standard Ra 0.8 μm", priceModifier: 0, leadTimeModifier: 0 },
          { value: "enhanced", label: "Enhanced Ra 0.4 μm", priceModifier: 4500, leadTimeModifier: 10 },
          { value: "mirror", label: "Mirror Ra 0.2 μm", priceModifier: 8500, leadTimeModifier: 14 }
        ]
      },
      {
        id: "agitation_system",
        name: "Agitation System",
        type: "options",
        description: "Mixing and agitation options",
        priceImpact: "high",
        leadTimeImpact: "medium",
        options: [
          { value: "basic", label: "Basic Paddle Agitator", priceModifier: 0, leadTimeModifier: 0 },
          { value: "turbine", label: "Rushton Turbine System", priceModifier: 5500, leadTimeModifier: 7 },
          { value: "magnetic", label: "Magnetic Drive System", priceModifier: 12500, leadTimeModifier: 14 }
        ]
      },
      {
        id: "documentation_package",
        name: "GMP Documentation Package",
        type: "boolean",
        description: "Complete GMP validation documentation",
        priceImpact: "medium",
        leadTimeImpact: "medium",
        priceModifier: 3500,
        leadTimeModifier: 10
      }
    ],
    
    certifications: [
      "ASME BPE Certified",
      "FDA Compliant",
      "3-A Sanitary Standards"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, unitPrice: 48500, currency: "EUR" }
      ],
      paymentTerms: "50_advance_50_delivery",
      deliveryTerms: "ddp",
      leadTime: {
        min: 84,
        max: 126,
        unit: "days"
      },
      minimumOrderQuantity: 1,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "tightened",
        acceptanceRate: 100,
        qualityDocumentation: ["Material Certificates", "Pressure Test Report", "Surface Finish Report"],
        returnPolicy: "Full GMP compliance guarantee"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 15,
      quantityFlexibility: 0,
      deliveryFlexibility: 21,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "pharma reactor",
      "stainless steel",
      "gmp compliant",
      "surface finish",
      "material certs",
      "pharmaceutical"
    ],
    
    isActive: true,
    createdAt: new Date("2024-01-30"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 12: Printed Corrugated Boxes (custom size)
  {
    id: "ind-012",
    supplierId: "supplier-packaging-001",
    name: "Custom Printed Corrugated Boxes - Multi-color",
    description: "Custom-sized corrugated packaging boxes with multi-color printing capabilities. Various board grades available with delivery wave scheduling for optimal inventory management.",
    category: "Packaging & Materials",
    subcategory: "Corrugated Packaging",
    sku: "CUSTOM-CORR-BOX",
    images: [
      "/images/products/corrugated-boxes-1.jpg",
      "/images/products/custom-printing-2.jpg",
      "/images/products/board-grades-3.jpg"
    ],
    
    specifications: {
      "Board Grade": "Single/Double/Triple wall",
      "Print Colors": "Up to 6 colors",
      "Size Range": "100x100x50 to 1200x800x600 mm",
      "Edge Crush": "4-8 kN/m (depending on grade)",
      "Burst Strength": "500-1400 kPa",
      "Moisture Content": "7-9%"
    },
    
    materialProperties: {
      boardType: "Recycled kraft/virgin kraft blend",
      printInk: "Water-based flexographic inks",
      adhesive: "Corn starch based"
    },
    
    physicalProperties: {
      weight: {
        value: 0.45,
        unit: "kg/m²"
      },
      dimensions: "Custom dimensions per specification"
    },
    
    performanceSpecs: {
      edgeCrushStrength: 6, // kN/m
      burstStrength: 900, // kPa
      compressionStrength: 5.5, // kN
      operatingTemperature: {
        min: -20,
        max: 50,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Flexographic printing and die-cutting",
    qualityGrade: "Commercial",
    applicationAreas: ["ecommerce", "retail", "industrial_packaging", "food_packaging"],
    industryStandards: ["FEFCO", "TAPPI", "ISO 12048"],
    countryOfOrigin: "Poland",
    
    regulatoryApprovals: ["FSC Certified", "PEFC"],
    environmentalCompliance: ["Recyclable", "Biodegradable"],
    
    negotiationVariables: [
      {
        id: "board_grade",
        name: "Board Grade Selection",
        type: "options",
        description: "Corrugated board strength and construction",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "single_wall", label: "Single Wall (3-4mm)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "double_wall", label: "Double Wall (6-7mm)", priceModifier: 0.35, leadTimeModifier: 2 },
          { value: "triple_wall", label: "Triple Wall (15mm)", priceModifier: 0.85, leadTimeModifier: 5 }
        ]
      },
      {
        id: "print_plates",
        name: "Printing Plate Setup",
        type: "options",
        description: "Printing plate creation and setup costs",
        priceImpact: "high",
        leadTimeImpact: "medium",
        options: [
          { value: "new_plates", label: "New Plate Creation", priceModifier: 450, leadTimeModifier: 7 },
          { value: "existing_plates", label: "Use Existing Plates", priceModifier: 0, leadTimeModifier: 0 },
          { value: "plate_revision", label: "Plate Modification", priceModifier: 180, leadTimeModifier: 3 }
        ]
      },
      {
        id: "delivery_waves",
        name: "Delivery Wave Schedule",
        type: "options",
        description: "Delivery scheduling options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "single_delivery", label: "Single Delivery", priceModifier: 0, leadTimeModifier: 0 },
          { value: "weekly_waves", label: "Weekly Delivery Waves", priceModifier: 0.08, leadTimeModifier: 0 },
          { value: "monthly_waves", label: "Monthly Delivery Waves", priceModifier: 0.05, leadTimeModifier: 0 }
        ]
      },
      {
        id: "custom_dimensions",
        name: "Custom Size Premium",
        type: "range",
        description: "Premium for non-standard dimensions",
        priceImpact: "medium",
        leadTimeImpact: "low",
        min: 0,
        max: 25,
        step: 5,
        unit: "% premium",
        pricePerUnit: 0.01
      }
    ],
    
    certifications: [
      "FSC Chain of Custody",
      "ISO 9001:2015",
      "BRC Packaging"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 500, maxQuantity: 4999, unitPrice: 1.25, currency: "EUR" },
        { minQuantity: 5000, maxQuantity: 24999, unitPrice: 0.95, currency: "EUR" },
        { minQuantity: 25000, maxQuantity: 99999, unitPrice: 0.75, currency: "EUR" },
        { minQuantity: 100000, unitPrice: 0.65, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "dap",
      leadTime: {
        min: 14,
        max: 21,
        unit: "days"
      },
      minimumOrderQuantity: 500,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.0,
        qualityDocumentation: ["Print Quality Report", "Dimension Check Report"],
        returnPolicy: "Quality defects replaced within 7 days"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 12,
      quantityFlexibility: 20,
      deliveryFlexibility: 7,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "corrugated boxes",
      "custom printing",
      "packaging",
      "board grades",
      "delivery waves",
      "fsc certified"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 13: EPAL Euro-Pallets (Heat-treated)
  {
    id: "ind-013",
    supplierId: "supplier-pallets-001",
    name: "EPAL Euro-Pallets Heat-Treated (1200x800mm)",
    description: "Standard EPAL Euro-pallets with heat treatment certification for international shipping. Exchange scheme available with load test certificates for quality assurance.",
    category: "Packaging & Materials",
    subcategory: "Pallets",
    sku: "EPAL-HT-1200x800",
    images: [
      "/images/products/epal-pallets-1.jpg",
      "/images/products/heat-treatment-2.jpg",
      "/images/products/load-test-3.jpg"
    ],
    
    specifications: {
      "Dimensions": "1200 x 800 x 144 mm",
      "Weight": "20-25 kg",
      "Load Capacity": "1500 kg static, 1000 kg dynamic",
      "Wood Type": "Softwood (pine, spruce, fir)",
      "Treatment": "ISPM-15 heat treatment",
      "Quality Grade": "EPAL certified new"
    },
    
    materialProperties: {
      woodType: "European softwood",
      treatment: "Heat treatment ISPM-15",
      nails: "Ring shank nails",
      moisture: "≤22% moisture content"
    },
    
    physicalProperties: {
      weight: {
        value: 22.5,
        unit: "kg"
      },
      dimensions: "1200 x 800 x 144 mm"
    },
    
    performanceSpecs: {
      staticLoad: 1500, // kg
      dynamicLoad: 1000, // kg
      rackingLoad: 750, // kg
      operatingTemperature: {
        min: -30,
        max: 60,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Precision cutting and assembly",
    qualityGrade: "EPAL Certified",
    applicationAreas: ["logistics", "warehousing", "international_shipping", "food_industry"],
    industryStandards: ["EPAL", "ISPM-15", "UIC 435-2"],
    countryOfOrigin: "Germany",
    
    regulatoryApprovals: ["EPAL License", "ISPM-15 Certified"],
    environmentalCompliance: ["PEFC Certified", "Sustainable Forestry"],
    
    negotiationVariables: [
      {
        id: "exchange_scheme",
        name: "Pallet Exchange Program",
        type: "options",
        description: "Pallet exchange and return options",
        priceImpact: "medium",
        leadTimeImpact: "none",
        options: [
          { value: "purchase", label: "Purchase Only", priceModifier: 0, leadTimeModifier: 0 },
          { value: "exchange", label: "Exchange Program", priceModifier: -3.50, leadTimeModifier: 0 },
          { value: "rental", label: "Rental Program", priceModifier: -8.50, leadTimeModifier: 0 }
        ]
      },
      {
        id: "load_test_cert",
        name: "Load Test Certificate",
        type: "boolean",
        description: "Individual load test certification",
        priceImpact: "low",
        leadTimeImpact: "low",
        priceModifier: 2.50,
        leadTimeModifier: 3
      },
      {
        id: "quality_grade",
        name: "Quality Grade",
        type: "options",
        description: "Pallet quality and condition grade",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "new", label: "New EPAL Pallets", priceModifier: 0, leadTimeModifier: 0 },
          { value: "grade_a", label: "Grade A (Like New)", priceModifier: -2.50, leadTimeModifier: 0 },
          { value: "grade_b", label: "Grade B (Good Condition)", priceModifier: -4.50, leadTimeModifier: 0 }
        ]
      },
      {
        id: "delivery_stacking",
        name: "Delivery Stacking",
        type: "options",
        description: "Pallet stacking and delivery options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard Stacking (20 high)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "low_stack", label: "Low Stacking (10 high)", priceModifier: 0.25, leadTimeModifier: 0 },
          { value: "banded", label: "Banded Stacks", priceModifier: 0.15, leadTimeModifier: 1 }
        ]
      }
    ],
    
    certifications: [
      "EPAL Licensed",
      "ISPM-15 Certified",
      "PEFC Chain of Custody"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 50, maxQuantity: 199, unitPrice: 12.50, currency: "EUR" },
        { minQuantity: 200, maxQuantity: 499, unitPrice: 11.75, currency: "EUR" },
        { minQuantity: 500, maxQuantity: 999, unitPrice: 11.25, currency: "EUR" },
        { minQuantity: 1000, unitPrice: 10.85, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "dap",
      leadTime: {
        min: 5,
        max: 10,
        unit: "days"
      },
      minimumOrderQuantity: 50,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 98.0,
        qualityDocumentation: ["EPAL Certificate", "Heat Treatment Certificate"],
        returnPolicy: "Defective pallets replaced within 14 days"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 8,
      quantityFlexibility: 30,
      deliveryFlexibility: 5,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "epal pallets",
      "euro pallets",
      "heat treated",
      "ispm-15",
      "exchange scheme",
      "load test"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-08"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 14: Industrial UV-Curable Ink 20 kg pails
  {
    id: "ind-014",
    supplierId: "supplier-inks-001",
    name: "Industrial UV-Curable Ink 20kg Pails",
    description: "High-performance UV-curable printing ink for industrial applications. Available in 20kg pails with viscosity adjustment services and shelf-life extension options for optimal performance.",
    category: "Raw Materials",
    subcategory: "Specialty Chemicals",
    sku: "UV-INK-20KG",
    images: [
      "/images/products/uv-ink-pails-1.jpg",
      "/images/products/viscosity-test-2.jpg",
      "/images/products/color-matching-3.jpg"
    ],
    
    specifications: {
      "Viscosity": "800-1200 cP at 25°C",
      "Cure Speed": "100-300 mJ/cm²",
      "Adhesion": "Cross-hatch Grade 0",
      "Color Gamut": "Pantone matching available",
      "Shelf Life": "12 months unopened",
      "Flash Point": ">100°C"
    },
    
    materialProperties: {
      baseResin: "Urethane acrylate oligomer",
      photoinitiator: "Proprietary blend",
      pigments: "Lightfast organic/inorganic",
      additives: "Anti-foam, flow agents"
    },
    
    physicalProperties: {
      weight: {
        value: 20,
        unit: "kg"
      },
      dimensions: "Ø285 x 350mm pail"
    },
    
    performanceSpecs: {
      viscosity: 1000, // cP at 25°C
      cureEnergy: 200, // mJ/cm²
      adhesionGrade: 0, // Cross-hatch test
      operatingTemperature: {
        min: 15,
        max: 35,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "High-speed dispersion",
    qualityGrade: "Industrial",
    applicationAreas: ["packaging_printing", "label_printing", "commercial_printing", "industrial_marking"],
    industryStandards: ["ISO 2813", "ASTM D3359", "ISO 4628"],
    countryOfOrigin: "Netherlands",
    
    regulatoryApprovals: ["REACH Registered", "Food Contact Approved"],
    environmentalCompliance: ["Low VOC", "Heavy Metal Free"],
    
    negotiationVariables: [
      {
        id: "viscosity_tweak",
        name: "Viscosity Adjustment",
        type: "options",
        description: "Custom viscosity modification for specific applications",
        priceImpact: "low",
        leadTimeImpact: "medium",
        options: [
          { value: "standard", label: "Standard Viscosity (1000 cP)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "low_visc", label: "Low Viscosity (800 cP)", priceModifier: 45, leadTimeModifier: 5 },
          { value: "high_visc", label: "High Viscosity (1200 cP)", priceModifier: 35, leadTimeModifier: 3 },
          { value: "custom", label: "Custom Viscosity", priceModifier: 85, leadTimeModifier: 10 }
        ]
      },
      {
        id: "shelf_life_extension",
        name: "Shelf-Life Extension",
        type: "options",
        description: "Extended shelf-life formulation options",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard 12 Months", priceModifier: 0, leadTimeModifier: 0 },
          { value: "extended_18", label: "Extended 18 Months", priceModifier: 125, leadTimeModifier: 3 },
          { value: "extended_24", label: "Extended 24 Months", priceModifier: 225, leadTimeModifier: 5 }
        ]
      },
      {
        id: "color_matching",
        name: "Color Matching Service",
        type: "options",
        description: "Custom color matching and development",
        priceImpact: "high",
        leadTimeImpact: "high",
        options: [
          { value: "standard_colors", label: "Standard Color Range", priceModifier: 0, leadTimeModifier: 0 },
          { value: "pantone_match", label: "Pantone Color Matching", priceModifier: 185, leadTimeModifier: 7 },
          { value: "custom_color", label: "Custom Color Development", priceModifier: 450, leadTimeModifier: 14 }
        ]
      },
      {
        id: "packaging_options",
        name: "Packaging Configuration",
        type: "options",
        description: "Alternative packaging options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "standard_pail", label: "Standard 20kg Pail", priceModifier: 0, leadTimeModifier: 0 },
          { value: "small_pails", label: "4x 5kg Pails", priceModifier: 25, leadTimeModifier: 2 },
          { value: "drums", label: "200kg Drums", priceModifier: -45, leadTimeModifier: 0 }
        ]
      }
    ],
    
    certifications: [
      "ISO 9001:2015",
      "REACH Registered",
      "BfR Recommendation"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, maxQuantity: 9, unitPrice: 185, currency: "EUR" },
        { minQuantity: 10, maxQuantity: 49, unitPrice: 175, currency: "EUR" },
        { minQuantity: 50, maxQuantity: 99, unitPrice: 165, currency: "EUR" },
        { minQuantity: 100, unitPrice: 155, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "cpt",
      leadTime: {
        min: 7,
        max: 14,
        unit: "days"
      },
      minimumOrderQuantity: 1,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.5,
        qualityDocumentation: ["Certificate of Analysis", "Viscosity Report", "Color Specification"],
        returnPolicy: "Quality issues resolved within 48 hours"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 10,
      quantityFlexibility: 25,
      deliveryFlexibility: 7,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "uv curable ink",
      "printing ink",
      "viscosity adjustment",
      "shelf life extension",
      "color matching",
      "industrial printing"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 15: Forklift Rental (3 t, diesel)
  {
    id: "ind-015",
    supplierId: "supplier-rental-001",
    name: "Forklift Rental - 3 Ton Diesel Counterbalance",
    description: "Professional forklift rental service featuring 3-ton diesel counterbalance forklifts. Flexible hire terms with comprehensive maintenance SLA and transport in/out services included.",
    category: "Industrial Services",
    subcategory: "Equipment Rental",
    sku: "FORK-RENTAL-3T-DIESEL",
    images: [
      "/images/products/forklift-3ton-1.jpg",
      "/images/products/maintenance-service-2.jpg",
      "/images/products/transport-delivery-3.jpg"
    ],
    
    specifications: {
      "Lift Capacity": "3000 kg at 500mm load center",
      "Lift Height": "4500 mm standard",
      "Engine Type": "Diesel 4-cylinder turbo",
      "Fuel Consumption": "3.5 L/hour average",
      "Operating Weight": "4200 kg",
      "Tire Type": "Pneumatic"
    },
    
    materialProperties: {
      frameConstruction: "Welded steel frame",
      mastType: "Triple stage duplex",
      hydraulicSystem: "Load sensing hydraulics",
      fuelSystem: "Diesel with DEF system"
    },
    
    physicalProperties: {
      weight: {
        value: 4200,
        unit: "kg"
      },
      dimensions: "3200 x 1225 x 2100 mm"
    },
    
    performanceSpecs: {
      liftCapacity: 3000, // kg
      liftHeight: 4500, // mm
      travelSpeed: 20, // km/h
      operatingTemperature: {
        min: -20,
        max: 50,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "N/A - Rental Service",
    qualityGrade: "Industrial",
    applicationAreas: ["warehousing", "construction", "manufacturing", "logistics"],
    industryStandards: ["CE Marking", "ISO 3691", "ANSI B56.1"],
    countryOfOrigin: "Various (Fleet Management)",
    
    regulatoryApprovals: ["CE Certified", "Emissions Compliant"],
    environmentalCompliance: ["Stage V Emissions", "DEF System"],
    
    negotiationVariables: [
      {
        id: "hire_term",
        name: "Rental Duration",
        type: "options",
        description: "Rental period options with different rates",
        priceImpact: "high",
        leadTimeImpact: "low",
        options: [
          { value: "daily", label: "Daily Rate", priceModifier: 0, leadTimeModifier: 0 },
          { value: "weekly", label: "Weekly Rate (15% discount)", priceModifier: -0.15, leadTimeModifier: 0 },
          { value: "monthly", label: "Monthly Rate (25% discount)", priceModifier: -0.25, leadTimeModifier: 0 },
          { value: "long_term", label: "Long-term (6+ months, 35% discount)", priceModifier: -0.35, leadTimeModifier: 0 }
        ]
      },
      {
        id: "maintenance_sla",
        name: "Maintenance Service Level",
        type: "options",
        description: "Maintenance and support service levels",
        priceImpact: "medium",
        leadTimeImpact: "none",
        options: [
          { value: "basic", label: "Basic Maintenance (8-hour response)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "priority", label: "Priority Service (4-hour response)", priceModifier: 25, leadTimeModifier: 0 },
          { value: "premium", label: "Premium 24/7 Service (2-hour response)", priceModifier: 65, leadTimeModifier: 0 }
        ]
      },
      {
        id: "transport_service",
        name: "Transport In/Out Service",
        type: "options",
        description: "Delivery and collection service options",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard Transport (within 50km)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "extended", label: "Extended Range (50-100km)", priceModifier: 85, leadTimeModifier: 1 },
          { value: "nationwide", label: "Nationwide Transport", priceModifier: 185, leadTimeModifier: 2 },
          { value: "customer_collect", label: "Customer Collection", priceModifier: -45, leadTimeModifier: 0 }
        ]
      },
      {
        id: "additional_equipment",
        name: "Additional Equipment",
        type: "multiselect",
        description: "Optional additional equipment and accessories",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "side_shift", label: "Side Shift Attachment", priceModifier: 15, leadTimeModifier: 0 },
          { value: "fork_positioner", label: "Fork Positioner", priceModifier: 25, leadTimeModifier: 0 },
          { value: "work_lights", label: "LED Work Lights", priceModifier: 8, leadTimeModifier: 0 },
          { value: "beacon_light", label: "Safety Beacon", priceModifier: 5, leadTimeModifier: 0 }
        ]
      }
    ],
    
    certifications: [
      "ISO 9001:2015",
      "OHSAS 18001",
      "Fleet Management Certified"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, unitPrice: 125, currency: "EUR" } // per day
      ],
      paymentTerms: "net_30",
      deliveryTerms: "delivered_to_site",
      leadTime: {
        min: 1,
        max: 3,
        unit: "days"
      },
      minimumOrderQuantity: 1,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.0,
        qualityDocumentation: ["Pre-delivery Inspection", "Maintenance Records", "Operator Manual"],
        returnPolicy: "Equipment issues resolved within SLA timeframes"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 15,
      quantityFlexibility: 50,
      deliveryFlexibility: 2,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "forklift rental",
      "3 ton capacity",
      "diesel forklift",
      "maintenance sla",
      "transport service",
      "equipment rental"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-18"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 16: Low-smoke Zero-halogen Cable 1 kV
  {
    id: "ind-016",
    supplierId: "supplier-cable-001",
    name: "Low-Smoke Zero-Halogen Cable 1kV LSZH",
    description: "Low-smoke zero-halogen power cable rated at 1kV for safety-critical applications. Available in various reel sizes with CPR class certification and comprehensive test report timing.",
    category: "Components & Parts",
    subcategory: "Electrical Components",
    sku: "LSZH-1KV-CABLE",
    images: [
      "/images/products/lszh-cable-1.jpg",
      "/images/products/cpr-certification-2.jpg",
      "/images/products/cable-reel-3.jpg"
    ],
    
    specifications: {
      "Voltage Rating": "1000V AC / 1500V DC",
      "Conductor": "Stranded copper Class 5",
      "Insulation": "XLPE cross-linked polyethylene",
      "Sheath": "LSZH compound",
      "Temperature Rating": "-40°C to +90°C",
      "CPR Class": "Cca-s1b,d1,a1"
    },
    
    materialProperties: {
      conductorMaterial: "Oxygen-free copper",
      insulationMaterial: "XLPE cross-linked polyethylene",
      sheathMaterial: "Low-smoke zero-halogen compound",
      flameRetardant: "Halogen-free flame retardant"
    },
    
    physicalProperties: {
      weight: {
        value: 1.85,
        unit: "kg/m"
      },
      dimensions: "25mm overall diameter (4x16mm²)"
    },
    
    performanceSpecs: {
      voltageRating: 1000, // V AC
      currentRating: 85, // A per core
      resistivity: 0.0175, // Ohm·mm²/m at 20°C
      operatingTemperature: {
        min: -40,
        max: 90,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Extrusion and cross-linking",
    qualityGrade: "Industrial",
    applicationAreas: ["building_wiring", "industrial_installations", "public_buildings", "transportation"],
    industryStandards: ["IEC 60502", "EN 50575", "CPR Regulation"],
    countryOfOrigin: "Italy",
    
    regulatoryApprovals: ["CPR Certified", "CE Marking", "BASEC Approved"],
    environmentalCompliance: ["RoHS", "REACH", "Halogen Free"],
    
    negotiationVariables: [
      {
        id: "reel_size",
        name: "Cable Reel Size",
        type: "options",
        description: "Standard reel lengths available",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "100m", label: "100m Reel", priceModifier: 0, leadTimeModifier: 0 },
          { value: "250m", label: "250m Reel", priceModifier: -0.05, leadTimeModifier: 0 },
          { value: "500m", label: "500m Reel", priceModifier: -0.12, leadTimeModifier: 2 },
          { value: "custom", label: "Custom Length", priceModifier: 0.08, leadTimeModifier: 5 }
        ]
      },
      {
        id: "cpr_class",
        name: "CPR Fire Classification",
        type: "options",
        description: "Construction Products Regulation fire class",
        priceImpact: "medium",
        leadTimeImpact: "medium",
        options: [
          { value: "cca", label: "Cca-s1b,d1,a1 (Standard)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "b2ca", label: "B2ca-s1a,d1,a1 (Enhanced)", priceModifier: 1.25, leadTimeModifier: 7 },
          { value: "aca", label: "Aca-s1a,d1,a1 (Premium)", priceModifier: 2.15, leadTimeModifier: 14 }
        ]
      },
      {
        id: "test_report_timing",
        name: "Test Report Delivery",
        type: "options",
        description: "Test certificate and documentation timing",
        priceImpact: "low",
        leadTimeImpact: "medium",
        options: [
          { value: "standard", label: "Standard (with shipment)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "advance", label: "Advance Delivery (7 days early)", priceModifier: 25, leadTimeModifier: -7 },
          { value: "express", label: "Express (24h after order)", priceModifier: 85, leadTimeModifier: -13 }
        ]
      },
      {
        id: "conductor_size",
        name: "Conductor Cross-Section",
        type: "options",
        description: "Cable conductor size options",
        priceImpact: "high",
        leadTimeImpact: "low",
        options: [
          { value: "4x16", label: "4x16mm² (Standard)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "4x25", label: "4x25mm²", priceModifier: 2.85, leadTimeModifier: 2 },
          { value: "4x35", label: "4x35mm²", priceModifier: 4.25, leadTimeModifier: 3 },
          { value: "custom", label: "Custom Configuration", priceModifier: 3.50, leadTimeModifier: 10 }
        ]
      }
    ],
    
    certifications: [
      "CPR Certified",
      "BASEC Approved",
      "IEC 60502 Compliant"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 100, maxQuantity: 999, unitPrice: 8.50, currency: "EUR" }, // per meter
        { minQuantity: 1000, maxQuantity: 4999, unitPrice: 7.95, currency: "EUR" },
        { minQuantity: 5000, maxQuantity: 19999, unitPrice: 7.45, currency: "EUR" },
        { minQuantity: 20000, unitPrice: 6.95, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "cpt",
      leadTime: {
        min: 10,
        max: 21,
        unit: "days"
      },
      minimumOrderQuantity: 100, // meters
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.8,
        qualityDocumentation: ["Test Certificate", "CPR Declaration", "Continuity Test Report"],
        returnPolicy: "Electrical defects covered for 24 months"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 12,
      quantityFlexibility: 30,
      deliveryFlexibility: 10,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "lszh cable",
      "low smoke zero halogen",
      "1kv cable",
      "cpr certified",
      "fire safety cable",
      "building wire"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 17: CO₂ Laser Cutting Service (5 mm steel)
  {
    id: "ind-017",
    supplierId: "supplier-laser-001",
    name: "CO₂ Laser Cutting Service - 5mm Steel",
    description: "Professional CO₂ laser cutting service for 5mm steel plates with optimized nesting efficiency. Includes scrap return options and guaranteed lead times for production planning.",
    category: "Industrial Services",
    subcategory: "Manufacturing Services",
    sku: "LASER-CUT-5MM-STEEL",
    images: [
      "/images/products/laser-cutting-1.jpg",
      "/images/products/nesting-software-2.jpg",
      "/images/products/cut-quality-3.jpg"
    ],
    
    specifications: {
      "Material Thickness": "5mm steel (max)",
      "Cutting Accuracy": "±0.1mm tolerance",
      "Edge Quality": "ISO 9013 Quality 2",
      "Kerf Width": "0.2-0.3mm typical",
      "Max Sheet Size": "3000 x 1500mm",
      "Cut Speed": "2-4 m/min (depending on complexity)"
    },
    
    materialProperties: {
      materialTypes: "Mild steel, stainless steel, aluminum",
      maxThickness: "5mm steel equivalent",
      surfaceFinish: "Clean cut edge, minimal heat affected zone",
      edgeQuality: "ISO 9013 Quality 2"
    },
    
    physicalProperties: {
      weight: {
        value: 0, // Service - weight varies by job
        unit: "kg"
      },
      dimensions: "Up to 3000 x 1500mm sheet size"
    },
    
    performanceSpecs: {
      cuttingAccuracy: 0.1, // mm tolerance
      edgeRoughness: 12.5, // μm Ra
      cuttingSpeed: 3, // m/min average
      operatingTemperature: {
        min: 15,
        max: 35,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "CO₂ laser cutting with CNC control",
    qualityGrade: "Precision",
    applicationAreas: ["prototyping", "production_parts", "architectural", "industrial_fabrication"],
    industryStandards: ["ISO 9013", "DIN EN ISO 9013", "Quality Grade 2"],
    countryOfOrigin: "Germany",
    
    regulatoryApprovals: ["ISO 9001:2015", "CE Machinery Directive"],
    environmentalCompliance: ["Fume extraction", "Waste metal recycling"],
    
    negotiationVariables: [
      {
        id: "nesting_efficiency",
        name: "Nesting Optimization",
        type: "options",
        description: "Material utilization and nesting efficiency options",
        priceImpact: "medium",
        leadTimeImpact: "medium",
        options: [
          { value: "standard", label: "Standard Nesting (75% efficiency)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "optimized", label: "Optimized Nesting (85% efficiency)", priceModifier: -0.12, leadTimeModifier: 2 },
          { value: "premium", label: "Premium Nesting (90%+ efficiency)", priceModifier: -0.18, leadTimeModifier: 5 }
        ]
      },
      {
        id: "scrap_return",
        name: "Scrap Material Return",
        type: "options",
        description: "Scrap material handling and return options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "dispose", label: "Dispose of Scrap", priceModifier: 0, leadTimeModifier: 0 },
          { value: "return_sorted", label: "Return Sorted Scrap", priceModifier: -15, leadTimeModifier: 1 },
          { value: "return_unsorted", label: "Return All Material", priceModifier: -8, leadTimeModifier: 0 }
        ]
      },
      {
        id: "lead_time_guarantee",
        name: "Lead Time Guarantee",
        type: "options",
        description: "Guaranteed delivery timeframes",
        priceImpact: "medium",
        leadTimeImpact: "high",
        options: [
          { value: "standard", label: "Standard Lead Time", priceModifier: 0, leadTimeModifier: 0 },
          { value: "express", label: "Express (50% faster)", priceModifier: 0.35, leadTimeModifier: -3 },
          { value: "same_day", label: "Same Day Service", priceModifier: 0.85, leadTimeModifier: -6 }
        ]
      },
      {
        id: "quality_inspection",
        name: "Quality Inspection Level",
        type: "options",
        description: "Quality control and inspection options",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard QC Check", priceModifier: 0, leadTimeModifier: 0 },
          { value: "enhanced", label: "Enhanced Inspection", priceModifier: 25, leadTimeModifier: 1 },
          { value: "full_report", label: "Full Dimensional Report", priceModifier: 65, leadTimeModifier: 2 }
        ]
      }
    ],
    
    certifications: [
      "ISO 9001:2015",
      "DIN EN ISO 9013",
      "Machinery Directive 2006/42/EC"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, maxQuantity: 9, unitPrice: 2.50, currency: "EUR" }, // per linear meter
        { minQuantity: 10, maxQuantity: 49, unitPrice: 2.25, currency: "EUR" },
        { minQuantity: 50, maxQuantity: 199, unitPrice: 2.00, currency: "EUR" },
        { minQuantity: 200, unitPrice: 1.85, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "ex_works",
      leadTime: {
        min: 3,
        max: 7,
        unit: "days"
      },
      minimumOrderQuantity: 1, // linear meter
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.5,
        qualityDocumentation: ["Cutting Report", "Dimensional Check", "Material Certificate"],
        returnPolicy: "Rework guarantee for specification non-conformance"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 15,
      quantityFlexibility: 40,
      deliveryFlexibility: 5,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "laser cutting",
      "co2 laser",
      "steel cutting",
      "nesting efficiency",
      "scrap return",
      "manufacturing service"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-22"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 18: Class D Fire-Retardant Paint 200 L
  {
    id: "ind-018",
    supplierId: "supplier-coatings-001",
    name: "Class D Fire-Retardant Paint 200L",
    description: "Professional fire-retardant paint meeting Class D fire resistance standards. Available in custom tint shades with pot life guarantees and comprehensive MSDS documentation.",
    category: "Raw Materials",
    subcategory: "Specialty Chemicals",
    sku: "FIRE-PAINT-200L-CLASSD",
    images: [
      "/images/products/fire-retardant-paint-1.jpg",
      "/images/products/tint-samples-2.jpg",
      "/images/products/fire-test-cert-3.jpg"
    ],
    
    specifications: {
      "Fire Rating": "Class D (DIN 4102)",
      "Coverage": "8-10 m²/L (2 coats)",
      "Dry Film Thickness": "150-200 μm",
      "Pot Life": "4 hours at 20°C",
      "Recoat Time": "4-6 hours",
      "Service Temperature": "-20°C to +80°C"
    },
    
    materialProperties: {
      baseType: "Acrylic water-based",
      fireRetardant: "Intumescent system",
      pigments: "Titanium dioxide, iron oxides",
      additives: "Anti-foam, rheology modifiers"
    },
    
    physicalProperties: {
      weight: {
        value: 220,
        unit: "kg"
      },
      dimensions: "Ø400 x 650mm drum"
    },
    
    performanceSpecs: {
      fireRating: "Class D DIN 4102",
      coverage: 9, // m²/L
      dryFilmThickness: 175, // μm
      operatingTemperature: {
        min: -20,
        max: 80,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "High-speed dispersion and milling",
    qualityGrade: "Fire Safety",
    applicationAreas: ["building_construction", "industrial_facilities", "public_buildings", "escape_routes"],
    industryStandards: ["DIN 4102", "EN 13501", "ASTM E84"],
    countryOfOrigin: "Germany",
    
    regulatoryApprovals: ["DIN 4102 Certified", "EN 13501 Class D", "CE Marking"],
    environmentalCompliance: ["Low VOC", "Water-based", "Heavy metal free"],
    
    negotiationVariables: [
      {
        id: "tint_shade",
        name: "Custom Tint Color",
        type: "options",
        description: "Color tinting options for aesthetic requirements",
        priceImpact: "medium",
        leadTimeImpact: "medium",
        options: [
          { value: "white", label: "Standard White", priceModifier: 0, leadTimeModifier: 0 },
          { value: "standard_colors", label: "Standard Color Range", priceModifier: 45, leadTimeModifier: 3 },
          { value: "ral_colors", label: "RAL Color Matching", priceModifier: 125, leadTimeModifier: 7 },
          { value: "custom_tint", label: "Custom Color Development", priceModifier: 285, leadTimeModifier: 14 }
        ]
      },
      {
        id: "pot_life_guarantee",
        name: "Pot Life Extension",
        type: "options",
        description: "Extended working time formulations",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard 4 Hours", priceModifier: 0, leadTimeModifier: 0 },
          { value: "extended_6h", label: "Extended 6 Hours", priceModifier: 85, leadTimeModifier: 5 },
          { value: "extended_8h", label: "Extended 8 Hours", priceModifier: 165, leadTimeModifier: 10 }
        ]
      },
      {
        id: "msds_documentation",
        name: "MSDS and Documentation",
        type: "options",
        description: "Safety data sheet and documentation packages",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "standard", label: "Standard MSDS", priceModifier: 0, leadTimeModifier: 0 },
          { value: "multilingual", label: "Multi-language MSDS", priceModifier: 25, leadTimeModifier: 3 },
          { value: "full_package", label: "Complete Documentation Package", priceModifier: 65, leadTimeModifier: 5 }
        ]
      },
      {
        id: "packaging_size",
        name: "Packaging Configuration",
        type: "options",
        description: "Alternative packaging sizes",
        priceImpact: "low",
        leadTimeImpact: "low",
        options: [
          { value: "200l_drum", label: "200L Drum (Standard)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "20l_pails", label: "10x 20L Pails", priceModifier: 35, leadTimeModifier: 2 },
          { value: "1000l_ibc", label: "1000L IBC Container", priceModifier: -85, leadTimeModifier: 5 }
        ]
      }
    ],
    
    certifications: [
      "DIN 4102 Class D",
      "EN 13501 Certified",
      "ISO 9001:2015"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, maxQuantity: 4, unitPrice: 485, currency: "EUR" },
        { minQuantity: 5, maxQuantity: 19, unitPrice: 465, currency: "EUR" },
        { minQuantity: 20, maxQuantity: 49, unitPrice: 445, currency: "EUR" },
        { minQuantity: 50, unitPrice: 425, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "cpt",
      leadTime: {
        min: 7,
        max: 14,
        unit: "days"
      },
      minimumOrderQuantity: 1,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.0,
        qualityDocumentation: ["Certificate of Analysis", "Fire Test Certificate", "MSDS"],
        returnPolicy: "Performance guarantee for fire rating compliance"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 8,
      quantityFlexibility: 20,
      deliveryFlexibility: 7,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "fire retardant paint",
      "class d fire rating",
      "intumescent coating",
      "custom tint",
      "pot life guarantee",
      "fire safety"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 19: Silicone O-Ring Kit (metric)
  {
    id: "ind-019",
    supplierId: "supplier-seals-001",
    name: "Silicone O-Ring Kit - Metric Sizes",
    description: "Comprehensive silicone O-ring kit in metric sizes with various Shore hardness options. Available with private-label trays and custom hardness mixing for specific applications.",
    category: "Components & Parts",
    subcategory: "Sealing Components",
    sku: "SILICONE-ORING-KIT-METRIC",
    images: [
      "/images/products/oring-kit-1.jpg",
      "/images/products/shore-hardness-2.jpg",
      "/images/products/private-label-3.jpg"
    ],
    
    specifications: {
      "Material": "VMQ Silicone",
      "Size Range": "3mm to 150mm ID",
      "Shore Hardness": "40-80 Shore A",
      "Temperature Range": "-60°C to +200°C",
      "Kit Contents": "382 pieces, 30 sizes",
      "Color": "Red (FDA grade available)"
    },
    
    materialProperties: {
      material: "VMQ silicone rubber",
      durometer: "Shore A 70 (standard)",
      temperatureRange: "-60°C to +200°C",
      chemicalResistance: "Excellent ozone and UV resistance"
    },
    
    physicalProperties: {
      weight: {
        value: 2.5,
        unit: "kg"
      },
      dimensions: "Kit box: 350 x 250 x 50mm"
    },
    
    performanceSpecs: {
      shoreHardness: 70, // Shore A
      tensileStrength: 8.5, // MPa
      elongation: 400, // %
      operatingTemperature: {
        min: -60,
        max: 200,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Compression molding",
    qualityGrade: "Industrial",
    applicationAreas: ["automotive", "aerospace", "food_processing", "medical_devices"],
    industryStandards: ["DIN 3771", "ISO 3601", "AS568 (inch equivalents)"],
    countryOfOrigin: "Germany",
    
    regulatoryApprovals: ["FDA 21 CFR 177.2600", "USP Class VI", "3-A Sanitary"],
    environmentalCompliance: ["RoHS", "REACH", "Platinum cured"],
    
    negotiationVariables: [
      {
        id: "shore_hardness_mix",
        name: "Shore Hardness Selection",
        type: "options",
        description: "Durometer hardness options for different applications",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "standard_70", label: "Standard 70 Shore A", priceModifier: 0, leadTimeModifier: 0 },
          { value: "soft_50", label: "Soft 50 Shore A", priceModifier: 35, leadTimeModifier: 3 },
          { value: "hard_80", label: "Hard 80 Shore A", priceModifier: 25, leadTimeModifier: 2 },
          { value: "mixed_kit", label: "Mixed Hardness Kit", priceModifier: 85, leadTimeModifier: 7 }
        ]
      },
      {
        id: "private_label_trays",
        name: "Private Label Packaging",
        type: "options",
        description: "Custom branding and packaging options",
        priceImpact: "medium",
        leadTimeImpact: "high",
        options: [
          { value: "standard", label: "Standard Packaging", priceModifier: 0, leadTimeModifier: 0 },
          { value: "custom_labels", label: "Custom Labels", priceModifier: 45, leadTimeModifier: 10 },
          { value: "private_label", label: "Full Private Label", priceModifier: 125, leadTimeModifier: 21 },
          { value: "custom_tray", label: "Custom Tray Design", priceModifier: 285, leadTimeModifier: 35 }
        ]
      },
      {
        id: "fda_grade",
        name: "FDA Food Grade Option",
        type: "boolean",
        description: "FDA compliant food-grade silicone",
        priceImpact: "medium",
        leadTimeImpact: "low",
        priceModifier: 65,
        leadTimeModifier: 5
      },
      {
        id: "size_customization",
        name: "Custom Size Selection",
        type: "options",
        description: "Customized size assortment options",
        priceImpact: "low",
        leadTimeImpact: "medium",
        options: [
          { value: "standard", label: "Standard Assortment", priceModifier: 0, leadTimeModifier: 0 },
          { value: "automotive", label: "Automotive Focus", priceModifier: 25, leadTimeModifier: 7 },
          { value: "hydraulic", label: "Hydraulic Focus", priceModifier: 35, leadTimeModifier: 10 },
          { value: "custom_mix", label: "Custom Size Mix", priceModifier: 85, leadTimeModifier: 14 }
        ]
      }
    ],
    
    certifications: [
      "ISO 9001:2015",
      "FDA 21 CFR 177.2600",
      "USP Class VI"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, maxQuantity: 9, unitPrice: 125, currency: "EUR" },
        { minQuantity: 10, maxQuantity: 49, unitPrice: 115, currency: "EUR" },
        { minQuantity: 50, maxQuantity: 99, unitPrice: 105, currency: "EUR" },
        { minQuantity: 100, unitPrice: 95, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "cpt",
      leadTime: {
        min: 5,
        max: 14,
        unit: "days"
      },
      minimumOrderQuantity: 1,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.5,
        qualityDocumentation: ["Material Certificate", "Hardness Test Report", "FDA Certificate"],
        returnPolicy: "Defective O-rings replaced within 30 days"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 10,
      quantityFlexibility: 25,
      deliveryFlexibility: 7,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "silicone o-rings",
      "metric sizes",
      "shore hardness",
      "private label",
      "fda grade",
      "sealing kit"
    ],
    
    isActive: true,
    createdAt: new Date("2024-02-28"),
    updatedAt: new Date("2024-12-30")
  },

  // Product 20: Industrial IoT Vibration Sensor
  {
    id: "ind-020",
    supplierId: "supplier-iot-001",
    name: "Industrial IoT Vibration Sensor with Wireless Gateway",
    description: "Advanced industrial IoT vibration sensor with firmware customization capabilities and bulk gateway discount programs. Features wireless connectivity and comprehensive monitoring software.",
    category: "Components & Parts",
    subcategory: "Sensors & Instrumentation",
    sku: "IOT-VIBRATION-SENSOR",
    images: [
      "/images/products/iot-vibration-sensor-1.jpg",
      "/images/products/wireless-gateway-2.jpg",
      "/images/products/monitoring-software-3.jpg"
    ],
    
    specifications: {
      "Measurement Range": "±16g acceleration",
      "Frequency Range": "0.5 Hz to 10 kHz",
      "Resolution": "0.1 mg",
      "Wireless Protocol": "LoRaWAN / NB-IoT",
      "Battery Life": "5+ years (lithium)",
      "Operating Temperature": "-40°C to +85°C"
    },
    
    materialProperties: {
      housing: "IP67 stainless steel",
      sensor: "MEMS accelerometer",
      antenna: "Internal ceramic antenna",
      battery: "Lithium thionyl chloride"
    },
    
    physicalProperties: {
      weight: {
        value: 0.35,
        unit: "kg"
      },
      dimensions: "Ø80 x 45mm"
    },
    
    performanceSpecs: {
      measurementRange: 16, // g
      frequencyRange: 10000, // Hz
      resolution: 0.1, // mg
      operatingTemperature: {
        min: -40,
        max: 85,
        unit: "°C"
      }
    },
    
    manufacturingProcess: "Electronic assembly and calibration",
    qualityGrade: "Industrial IoT",
    applicationAreas: ["predictive_maintenance", "condition_monitoring", "industrial_automation", "asset_management"],
    industryStandards: ["IEC 61508", "ISO 10816", "LoRaWAN 1.0.3"],
    countryOfOrigin: "Finland",
    
    regulatoryApprovals: ["CE Marking", "FCC Certified", "IC Certified"],
    environmentalCompliance: ["RoHS", "IP67 Rated"],
    
    negotiationVariables: [
      {
        id: "firmware_customization",
        name: "Firmware Customization",
        type: "options",
        description: "Custom firmware development options",
        priceImpact: "high",
        leadTimeImpact: "high",
        options: [
          { value: "standard", label: "Standard Firmware", priceModifier: 0, leadTimeModifier: 0 },
          { value: "parameter_config", label: "Parameter Configuration", priceModifier: 85, leadTimeModifier: 14 },
          { value: "custom_algorithm", label: "Custom Algorithm", priceModifier: 450, leadTimeModifier: 42 },
          { value: "full_custom", label: "Full Custom Development", priceModifier: 1250, leadTimeModifier: 84 }
        ]
      },
      {
        id: "bulk_gateway_discount",
        name: "Gateway Bulk Discount",
        type: "options",
        description: "Wireless gateway quantity discounts",
        priceImpact: "medium",
        leadTimeImpact: "low",
        options: [
          { value: "no_gateway", label: "Sensor Only", priceModifier: 0, leadTimeModifier: 0 },
          { value: "single_gateway", label: "1 Gateway (1:100 ratio)", priceModifier: 285, leadTimeModifier: 7 },
          { value: "bulk_5_gateways", label: "5 Gateways (10% discount)", priceModifier: 1285, leadTimeModifier: 10 },
          { value: "bulk_10_gateways", label: "10 Gateways (20% discount)", priceModifier: 2285, leadTimeModifier: 14 }
        ]
      },
      {
        id: "monitoring_software",
        name: "Monitoring Software License",
        type: "options",
        description: "Cloud monitoring and analytics software",
        priceImpact: "medium",
        leadTimeImpact: "none",
        options: [
          { value: "basic", label: "Basic Monitoring (1 year)", priceModifier: 0, leadTimeModifier: 0 },
          { value: "advanced", label: "Advanced Analytics (1 year)", priceModifier: 125, leadTimeModifier: 0 },
          { value: "enterprise", label: "Enterprise Suite (1 year)", priceModifier: 285, leadTimeModifier: 0 },
          { value: "perpetual", label: "Perpetual License", priceModifier: 850, leadTimeModifier: 0 }
        ]
      },
      {
        id: "calibration_certificate",
        name: "Factory Calibration",
        type: "boolean",
        description: "Traceable factory calibration certificate",
        priceImpact: "low",
        leadTimeImpact: "low",
        priceModifier: 85,
        leadTimeModifier: 5
      }
    ],
    
    certifications: [
      "CE Marking",
      "FCC Part 15",
      "LoRa Alliance Certified"
    ],
    
    commercialTerms: {
      pricing: [
        { minQuantity: 1, maxQuantity: 9, unitPrice: 385, currency: "EUR" },
        { minQuantity: 10, maxQuantity: 49, unitPrice: 345, currency: "EUR" },
        { minQuantity: 50, maxQuantity: 199, unitPrice: 315, currency: "EUR" },
        { minQuantity: 200, unitPrice: 285, currency: "EUR" }
      ],
      paymentTerms: "net_30",
      deliveryTerms: "dap",
      leadTime: {
        min: 14,
        max: 28,
        unit: "days"
      },
      minimumOrderQuantity: 1,
      validUntil: new Date("2025-12-31"),
      currency: "EUR",
      includesVAT: false,
      
      qualityTerms: {
        inspectionLevel: "normal",
        acceptanceRate: 99.0,
        qualityDocumentation: ["Calibration Certificate", "Test Report", "Software License"],
        returnPolicy: "24-month warranty on hardware, 12-month software support"
      }
    },
    
    negotiationBoundaries: {
      priceFlexibility: 12,
      quantityFlexibility: 35,
      deliveryFlexibility: 14,
      paymentTermsFlexible: true
    },
    
    keywords: [
      "iot vibration sensor",
      "wireless monitoring",
      "predictive maintenance",
      "firmware customization",
      "bulk gateway discount",
      "industrial iot"
    ],
    
    isActive: true,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-12-30")
  }
];

export default industrialProducts11to20; 