// Combined Products Data - Industrial Products
// Showcases our 20 target industrial products in the standard format

import { getRandomProductImages } from '@/types/api-products';

// Industrial Products in standard format - showcasing our 20 target products
const industrialProducts = [
  // Product 1: Hydraulic Excavator
  {
    id: "ind-001",
    name: "Caterpillar 320D Hydraulic Excavator",
    price: 185000,
    currentPrice: 185000,
    discount: 0,
    quantityAvailable: 1,
    category: "Heavy Machinery",
    sizes: [],
    colors: ["#152934"],
    images: getRandomProductImages('excavator'),
    punctuation: {
      countOpinions: 12,
      punctuation: 4.7,
      votes: [
        { value: 1, count: 0 },
        { value: 2, count: 0 },
        { value: 3, count: 1 },
        { value: 4, count: 3 },
        { value: 5, count: 8 },
      ],
    },
    reviews: [
      {
        name: "Construction Manager",
        avatar: "/images/featured-1.jpg",
        description: "<p>Excellent hydraulic excavator with outstanding performance and reliability. The operating weight and lifting capacity exceeded our expectations for this model year.</p>",
        punctuation: 5,
      },
    ],
    industrial: {
      sku: "CAT-320D-2022",
      category: "Heavy Machinery",
      subcategory: "Excavators",
      specifications: {
        "Brand": "Caterpillar",
        "Model": "320D",
        "Year": "2022",
        "Condition": "Used - Excellent"
      },
      certifications: ["CE Marking", "ISO 9001"],
      leadTime: "7-14 days",
      minimumOrder: 1,
      currency: "USD"
    }
  },

  // Product 2: Aluminum Sheet 6061-T6
  {
    id: "ind-002", 
    name: "Aluminum Sheet 6061-T6 Marine Grade",
    price: 125,
    currentPrice: 125,
    discount: 0,
    quantityAvailable: 200,
    category: "Raw Materials",
    sizes: [],
    colors: ["#C0C0C0"],
    images: getRandomProductImages('aluminum_sheet'),
    punctuation: {
      countOpinions: 28,
      punctuation: 4.4,
      votes: [
        { value: 1, count: 0 },
        { value: 2, count: 1 },
        { value: 3, count: 2 },
        { value: 4, count: 12 },
        { value: 5, count: 13 },
      ],
    },
    reviews: [
      {
        name: "Marine Engineer",
        avatar: "/images/featured-1.jpg",
        description: "<p>High-quality marine grade aluminum with excellent corrosion resistance. Perfect thickness and surface finish for our marine applications.</p>",
        punctuation: 4,
      },
    ],
    industrial: {
      sku: "AL6061-T6-3MM",
      category: "Raw Materials", 
      subcategory: "Aluminum Sheets",
      specifications: {
        "Alloy": "6061-T6",
        "Thickness": "3.0mm",
        "Dimensions": "1200mm x 2400mm",
        "Surface": "Mill Finish"
      },
      certifications: ["EN AW-6061", "ASTM B209"],
      leadTime: "5-10 days",
      minimumOrder: 10,
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