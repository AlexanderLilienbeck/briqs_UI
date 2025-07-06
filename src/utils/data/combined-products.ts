// Combined Products Data - Industrial Products
// Showcases our 20 target industrial products in the standard format

// Industrial Products in standard format - showcasing our 20 target products
const industrialProducts = [
  // Product 1: Cold-Rolled Steel Coil SPCC 1.0mm
  {
    id: "ind-001",
    name: "Cold-Rolled Steel Coil SPCC 1.0mm",
    price: 750.00,
    currentPrice: 750.00,
    discount: 0,
    quantityAvailable: 5,
    category: "Raw Materials",
    sizes: [],
    colors: ["#2C5282"],
    images: ["/images/products/product-1.jpg"],
    punctuation: {
      countOpinions: 12,
      punctuation: 4.5,
      votes: [
        { value: 1, count: 0 },
        { value: 2, count: 1 },
        { value: 3, count: 1 },
        { value: 4, count: 4 },
        { value: 5, count: 6 },
      ],
    },
    reviews: [
      {
        name: "Manufacturing Manager",
        avatar: "/images/featured-1.jpg",
        description: "<p>High-quality cold-rolled steel with excellent surface finish. Perfect for our automotive parts manufacturing. Consistent thickness and coating options available.</p>",
        punctuation: 5,
      },
    ],
    industrial: {
      sku: "SPCC-CR-1.0MM",
      category: "Raw Materials",
      subcategory: "Steel Products",
      specifications: {
        "Material Grade": "SPCC (Commercial)",
        "Thickness": "1.0mm ±0.05mm",
        "Width": "1000-1500mm",
        "Coil Weight": "5-25 tons"
      },
      certifications: ["ISO 9001:2015", "JIS G 3141"],
      leadTime: "14-21 days",
      minimumOrder: 5,
      currency: "EUR"
    }
  },

  // Product 2: Aluminum 6061-T6 Extrusion Profiles
  {
    id: "ind-002",
    name: "Aluminum 6061-T6 Extrusion Profiles",
    price: 3.85,
    currentPrice: 3.85,
    discount: 0,
    quantityAvailable: 100,
    category: "Raw Materials",
    sizes: [],
    colors: ["#C0C0C0"],
    images: ["/images/products/product-2.jpg"],
    punctuation: {
      countOpinions: 18,
      punctuation: 4.7,
      votes: [
        { value: 1, count: 0 },
        { value: 2, count: 0 },
        { value: 3, count: 2 },
        { value: 4, count: 4 },
        { value: 5, count: 12 },
      ],
    },
    reviews: [
      {
        name: "Design Engineer",
        avatar: "/images/featured-1.jpg",
        description: "<p>Excellent aluminum profiles with precise dimensions. T6 temper provides perfect strength-to-weight ratio for our architectural projects. Cut-to-length service is very convenient.</p>",
        punctuation: 5,
      },
    ],
    industrial: {
      sku: "AL6061-T6-PROFILE",
      category: "Raw Materials",
      subcategory: "Aluminum Products",
      specifications: {
        "Alloy": "6061-T6",
        "Temper": "T6 (solution treated and aged)",
        "Length": "6000mm standard (cut-to-length available)",
        "Surface Finish": "Mill finish or anodized"
      },
      certifications: ["EN 755-2", "ASTM B221"],
      leadTime: "7-14 days",
      minimumOrder: 100,
      currency: "EUR"
    }
  },

  // Product 3: HDPE Resin Pellets (Injection Grade)
  {
    id: "ind-003",
    name: "HDPE Resin Pellets - Injection Molding Grade",
    price: 1.35,
    currentPrice: 1.35,
    discount: 0,
    quantityAvailable: 1000,
    category: "Raw Materials",
    sizes: [],
    colors: ["#FFFFFF"],
    images: ["/images/products/product-3.jpg"],
    punctuation: {
      countOpinions: 25,
      punctuation: 4.4,
      votes: [
        { value: 1, count: 1 },
        { value: 2, count: 1 },
        { value: 3, count: 3 },
        { value: 4, count: 8 },
        { value: 5, count: 12 },
      ],
    },
    reviews: [
      {
        name: "Production Manager",
        avatar: "/images/featured-1.jpg",
        description: "<p>Consistent quality HDPE pellets perfect for injection molding. Good melt flow properties and excellent impact resistance in final products. Delivery scheduling works well.</p>",
        punctuation: 4,
      },
    ],
    industrial: {
      sku: "HDPE-INJ-GRADE",
      category: "Raw Materials",
      subcategory: "Polymer Resins",
      specifications: {
        "Density": "0.954 g/cm³",
        "Melt Flow Index": "12 g/10min (190°C/2.16kg)",
        "Tensile Strength": "28 MPa",
        "Packaging": "25kg bags or bulk silo"
      },
      certifications: ["FDA 21 CFR 177.1520", "EU 10/2011"],
      leadTime: "10-14 days",
      minimumOrder: 1000,
      currency: "EUR"
    }
  },

  // Product 4: Industrial Isopropyl Alcohol 99.9%
  {
    id: "ind-004",
    name: "Industrial Isopropyl Alcohol 99.9%",
    price: 2.75,
    currentPrice: 2.75,
    discount: 0,
    quantityAvailable: 50,
    category: "Raw Materials",
    sizes: [],
    colors: ["#E6F3FF"],
    images: ["/images/products/product-4.jpg"],
    punctuation: {
      countOpinions: 8,
      punctuation: 4.6,
      votes: [
        { value: 1, count: 0 },
        { value: 2, count: 0 },
        { value: 3, count: 1 },
        { value: 4, count: 2 },
        { value: 5, count: 5 },
      ],
    },
    reviews: [
      {
        name: "Quality Control Manager",
        avatar: "/images/featured-1.jpg",
        description: "<p>High purity isopropyl alcohol perfect for electronics cleaning and laboratory applications. Consistent 99.9% purity with proper hazmat documentation.</p>",
        punctuation: 5,
      },
    ],
    industrial: {
      sku: "IPA-999-INDUSTRIAL",
      category: "Raw Materials",
      subcategory: "Specialty Chemicals",
      specifications: {
        "Purity": "99.9% min",
        "Water Content": "0.1% max",
        "Acidity": "0.002% max as acetic acid",
        "Container": "200L drums or 1000L IBC"
      },
      certifications: ["ISO 9001:2015", "REACH Registered"],
      leadTime: "5-10 days",
      minimumOrder: 50,
      currency: "EUR"
    }
  },

  // Product 5: Food Grade Citric Acid
  {
    id: "ind-005",
    name: "Food Grade Citric Acid - 25kg Bags",
    price: 1.85,
    currentPrice: 1.85,
    discount: 0,
    quantityAvailable: 40,
    category: "Raw Materials",
    sizes: [],
    colors: ["#FFFACD"],
    images: ["/images/products/product-5.jpg"],
    punctuation: {
      countOpinions: 15,
      punctuation: 4.3,
      votes: [
        { value: 1, count: 0 },
        { value: 2, count: 1 },
        { value: 3, count: 2 },
        { value: 4, count: 6 },
        { value: 5, count: 6 },
      ],
    },
    reviews: [
      {
        name: "Food Technologist",
        avatar: "/images/featured-1.jpg",
        description: "<p>Excellent food grade citric acid with proper kosher and halal certifications. Perfect for beverage production. Clean taste and reliable supply chain.</p>",
        punctuation: 4,
      },
    ],
    industrial: {
      sku: "CITRIC-ACID-FG-25KG",
      category: "Raw Materials",
      subcategory: "Food Ingredients",
      specifications: {
        "Purity": "99.5-100.5% (anhydrous basis)",
        "pH": "1.85 (0.5% solution)",
        "Heavy Metals": "≤5 ppm",
        "Packaging": "25kg bags, pallet configuration available"
      },
      certifications: ["Kosher", "Halal", "FDA GRAS"],
      leadTime: "7-14 days",
      minimumOrder: 40,
      currency: "EUR"
    }
  },

  // Product 11: Pharma-Grade Stainless Reactor
  {
    id: "ind-011",
    name: "Pharma-Grade Stainless Steel Reactor 500L",
    price: 48500,
    currentPrice: 48500,
    discount: 0,
    quantityAvailable: 1,
    category: "Process Equipment",
    sizes: [],
    colors: ["#C0C0C0"],
    images: ["/images/products/product-6.jpg"],
    punctuation: {
      countOpinions: 6,
      punctuation: 4.8,
      votes: [
        { value: 1, count: 0 },
        { value: 2, count: 0 },
        { value: 3, count: 0 },
        { value: 4, count: 1 },
        { value: 5, count: 5 },
      ],
    },
    reviews: [
      {
        name: "Process Engineer",
        avatar: "/images/featured-1.jpg",
        description: "<p>Outstanding pharmaceutical reactor with perfect surface finish and complete GMP documentation. Material certificates and validation package exceeded expectations.</p>",
        punctuation: 5,
      },
    ],
    industrial: {
      sku: "SS316L-REACTOR-500L",
      category: "Process Equipment",
      subcategory: "Reactors",
      specifications: {
        "Volume": "500L working volume",
        "Material": "SS316L pharmaceutical grade",
        "Surface Finish": "Ra ≤ 0.4 μm (electropolished)",
        "Design Pressure": "6 bar / Full vacuum"
      },
      certifications: ["ASME BPE", "FDA Compliant", "3-A Sanitary"],
      leadTime: "84-126 days",
      minimumOrder: 1,
      currency: "EUR"
    }
  },

  // Product 15: Forklift Rental Service
  {
    id: "ind-015",
    name: "Forklift Rental - 3 Ton Diesel Counterbalance",
    price: 125,
    currentPrice: 125,
    discount: 0,
    quantityAvailable: 10,
    category: "Industrial Services",
    sizes: [],
    colors: ["#FFD700"],
    images: ["/images/products/product-7.jpg"],
    punctuation: {
      countOpinions: 22,
      punctuation: 4.5,
      votes: [
        { value: 1, count: 0 },
        { value: 2, count: 1 },
        { value: 3, count: 2 },
        { value: 4, count: 8 },
        { value: 5, count: 11 },
      ],
    },
    reviews: [
      {
        name: "Warehouse Manager",
        avatar: "/images/featured-1.jpg",
        description: "<p>Excellent forklift rental service with reliable equipment and responsive maintenance. Transport service and setup were professional and timely.</p>",
        punctuation: 5,
      },
    ],
    industrial: {
      sku: "FORK-RENTAL-3T-DIESEL",
      category: "Industrial Services",
      subcategory: "Equipment Rental",
      specifications: {
        "Lift Capacity": "3000 kg at 500mm load center",
        "Lift Height": "4500 mm standard",
        "Engine Type": "Diesel 4-cylinder turbo",
        "Rental Period": "Daily/Weekly/Monthly rates available"
      },
      certifications: ["CE Certified", "ISO 9001:2015"],
      leadTime: "1-3 days",
      minimumOrder: 1,
      currency: "EUR"
    }
  },

  // Product 20: Industrial IoT Vibration Sensor
  {
    id: "ind-020",
    name: "Industrial IoT Vibration Sensor with Gateway",
    price: 385,
    currentPrice: 385,
    discount: 0,
    quantityAvailable: 25,
    category: "Components & Parts",
    sizes: [],
    colors: ["#4A90E2"],
    images: ["/images/products/product-1.jpg"],
    punctuation: {
      countOpinions: 9,
      punctuation: 4.4,
      votes: [
        { value: 1, count: 0 },
        { value: 2, count: 0 },
        { value: 3, count: 1 },
        { value: 4, count: 4 },
        { value: 5, count: 4 },
      ],
    },
    reviews: [
      {
        name: "Maintenance Engineer",
        avatar: "/images/featured-1.jpg",
        description: "<p>Advanced IoT sensor with excellent wireless connectivity and customizable firmware. Perfect for predictive maintenance applications with reliable data transmission.</p>",
        punctuation: 4,
      },
    ],
    industrial: {
      sku: "IOT-VIBRATION-SENSOR",
      category: "Components & Parts",
      subcategory: "Sensors & Instrumentation",
      specifications: {
        "Measurement Range": "±16g acceleration",
        "Frequency Range": "0.5 Hz to 10 kHz",
        "Wireless Protocol": "LoRaWAN / NB-IoT",
        "Battery Life": "5+ years (lithium)"
      },
      certifications: ["CE Marking", "FCC Certified", "LoRa Alliance"],
      leadTime: "14-28 days",
      minimumOrder: 1,
      currency: "EUR"
    }
  }
];

// Combine all products - put industrial products first to showcase them
export const combinedProducts = [
  ...industrialProducts
];

export default combinedProducts; 