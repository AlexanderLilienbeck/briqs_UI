// Mock Transcription Service - Fallback for API failures
export interface MockTranscriptionResponse {
  transcript: string;
  playbookData: any;
  confidence: number;
}

// Sample voice inputs with corresponding playbook analysis
const mockTranscriptionResponses: MockTranscriptionResponse[] = [
  {
    transcript: "I am searching for an excavator. The ideal price would be at 165,000 but no more than 175,000. I want Net 60 terms for payment and 0% down payment. A free delivery to our site would be great.",
    confidence: 94,
    playbookData: {
      product_type: "excavator",
      product_details: {
        seller_playbook: {
          Criteria: {
            Product: {
              "Walk-Away-Price (USD)": 175000.0,
              "Target Price (USD)": 165000.0,
              "Starting Price (USD)": 165000.0
            },
            Buyer: {
              "Credit Worthiness": "Mandatory credit check performed by a third-party agency for ALL customers seeking any form of credit terms (i.e., not paying 100% upfront).",
              "History": "Is this a repeat customer? If so, review their full payment and service history. Only a multi-year, perfect record qualifies for the best terms.",
              risk_profile_definition: {
                low_risk: "Established company with a multi-year, perfect payment history with us. Strong credit report and a history of multiple equipment purchases.",
                medium_risk: "A repeat customer with an excellent, but short (< 2 years), payment history, or an established company with impeccable credit but who is new to us.",
                high_risk: "All new businesses, any customer with a limited or poor credit history, or any customer with a single instance of late payment in their history with us."
              }
            }
          },
          "Negotiation rules": [
            "Prioritize securing favorable payment terms over achieving the absolute maximum price. A secure deal at a slightly lower price is better than a risky deal at the Target Price.",
            "When a buyer asks for a concession, always ask for a concession in return that reduces our risk (e.g., larger down payment, shorter terms).",
            "Always anchor the negotiation with the Target Price. Never reveal the Walk-Away-Price.",
            "Maintain a professional, firm, and principled tone. Our terms are based on prudent financial management, not a lack of trust.",
            "If a buyer's initial offer is below the Walk-Away-Price, state that it is significantly below our valuation and we cannot proceed on that basis. Invite a revised offer.",
            "If a high-risk buyer will not pre-pay 100% or provide an Irrevocable Letter of Credit, politely and firmly end the negotiation. There is no fallback.",
            "Any request for credit terms beyond Net 30, regardless of buyer risk profile, requires management approval."
          ],
          Tradables: {
            "Primary Goal": "Secure 100% of the agreed price with minimal to zero payment risk. Achieving the Target Price is secondary to ensuring payment is guaranteed. Building a long-term relationship is contingent on the buyer accepting our risk-mitigation terms.",
            "Give (Low-cost to us)": [
              "Free local delivery (within a 50-mile radius, logistics permitting).",
              "A small toolkit or set of high-quality, company-branded merchandise (e.g., jackets, hats).",
              "Priority scheduling for their first paid service."
            ],
            "Get (High value to us)": [
              "Pre-payment in full, even from low-risk customers.",
              "A larger-than-required, non-refundable down payment.",
              "Agreement to a pre-paid, multi-year service and maintenance contract.",
              "A formal, signed waiver of consequential damages, limiting our liability strictly to the standard equipment warranty.",
              "Commitment to act as a formal, positive reference for future potential buyers."
            ]
          },
          "Ideal & Acceptable Terms": {
            "Medium risk buyer": {
              "Payment Terms": {
                Ideal: "Minimum 50% non-refundable down payment, balance due via cleared funds upon delivery (before offloading).",
                "Fallback Position": "Increase down payment to 60%. Alternatively, we will hold the 50% down payment and accept an ILOC or Bank Guarantee for the final 50%."
              }
            },
            "Low risk buyer": {
              "Payment Terms": {
                Ideal: "Minimum 10% down payment with an approved Purchase Order, balance due Net 30. Standard warranty and liability terms apply.",
                "Fallback Position": "If Net 45 terms are requested, it will only be considered in exchange for a 1.5% price increase to cover the cost of capital OR a pre-paid 2-year service contract. Net 60 is not offered."
              }
            }
          }
        },
        buyer_playbook: {
          "Negotiation Strategy": [
            "Never reveal your Maximum Budget. Always anchor the negotiation to your Target Purchase Price or lower.",
            "An aggressive but realistic opening offer can significantly lower the final price.",
            "Question the value of every seller 'concession'. Unbundle their packages to understand the true cost and benefit of each item.",
            "Always bundle your requests. For example, 'If you can meet our price, we'll also need you to include the extended warranty and free delivery.'",
            "Always be professional and polite, but be prepared to walk away if your core requirements on price and terms are not met."
          ],
          Tradables: {
            "Primary Goal": "Achieve the lowest possible Total Cost of Ownership (TCO). The sticker price is important, but favorable terms, an extended warranty, and included service are equally critical for minimizing long-term expenses.",
            "Get (High value to us)": [
              "A significant discount off the list price.",
              "A comprehensive, multi-year warranty (especially on powertrain and hydraulics).",
              "The first 2-3 scheduled maintenance services included (parts and labor).",
              "Favorable payment terms (e.g., Net 60 or Net 90) to improve cash flow.",
              "Free delivery to our primary worksite."
            ],
            "Give (Low-cost to us)": [
              "A public, positive customer testimonial or case study.",
              "A commitment to a future parts & service contract (if the rates are competitive).",
              "Flexibility on the delivery date (if our project schedule allows).",
              "A slightly larger-than-standard down payment in exchange for a major price discount or extended warranty."
            ]
          },
          "Ideal & Acceptable Terms": {
            Price: {
              "Target Purchase Price (USD)": 160000.0,
              "Maximum Budget (USD)": 170000.0,
              Ideal: "A final price at or below our Target Purchase Price of $160,000.",
              "Fallback Position": "A price up to our Maximum Budget of $170,000, but only if it includes significant 'Gets' like a 3-year warranty."
            },
            "Payment Terms": {
              Ideal: "Net 60 terms with 0% down payment required.",
              "Fallback Position": "Net 30 terms with no more than a 5% down payment required to secure the machine."
            },
            Warranty: {
              Ideal: "3-year / 3,000-hour comprehensive warranty. First two scheduled services (250hr, 500hr) fully included.",
              "Fallback Position": "Minimum 2-year / 2,000-hour powertrain warranty. First scheduled service included (labor only)."
            },
            Delivery: {
              Ideal: "Free delivery to our site",
              "Fallback Position": "Delivery cost capped at a pre-agreed, reasonable flat fee."
            }
          }
        }
      },
      buyer_profile: {
        "Buyer ID": 1,
        "Credit Worthiness": 8,
        "Recurring Customer": true
      }
    }
  },
  {
    transcript: "Looking for 100 tons of steel rebar, grade 60, various sizes from 10mm to 25mm diameter. Need it delivered to our warehouse in Houston within 2 weeks. Budget is around 600 to 650 per ton. Can pay 50% upfront and balance on delivery.",
    confidence: 92,
    playbookData: {
      product_type: "steel_rebar",
      product_details: {
        buyer_playbook: {
          "Negotiation Strategy": [
            "Focus on bulk pricing advantages for large quantities",
            "Emphasize the immediate payment of 50% upfront as a concession",
            "Request material certificates and quality guarantees",
            "Bundle delivery and offloading services into the negotiation"
          ],
          Tradables: {
            "Primary Goal": "Secure high-quality steel rebar at competitive bulk pricing with reliable delivery schedules.",
            "Get (High value to us)": [
              "Bulk quantity discount for 100+ ton orders",
              "Material test certificates and quality documentation",
              "Flexible delivery scheduling within the 2-week window",
              "Free delivery and offloading services",
              "Extended payment terms for future orders"
            ],
            "Give (Low-cost to us)": [
              "50% upfront payment to secure better pricing",
              "Flexibility on exact delivery date within 2-week window",
              "Commitment to future bulk orders",
              "Positive supplier reference for other projects"
            ]
          },
          "Ideal & Acceptable Terms": {
            Price: {
              "Target Purchase Price (USD)": 600.0,
              "Maximum Budget (USD)": 650.0,
              Ideal: "Bulk pricing at $600/ton or lower",
              "Fallback Position": "Up to $650/ton if includes delivery and quality certifications"
            },
            "Payment Terms": {
              Ideal: "50% upfront, 50% on delivery",
              "Fallback Position": "60% upfront for additional discount"
            },
            Quality: {
              Ideal: "Grade 60 rebar with full material certificates",
              "Fallback Position": "Grade 60 with basic quality documentation"
            },
            Delivery: {
              Ideal: "Free delivery and offloading within 2 weeks",
              "Fallback Position": "Delivery costs capped at $50/ton"
            }
          }
        }
      },
      buyer_profile: {
        "Buyer ID": 2,
        "Credit Worthiness": 9,
        "Recurring Customer": false
      }
    }
  },
  {
    transcript: "I need chemical storage tanks, 10,000 gallon capacity, stainless steel 316L, for petroleum products. Need 5 units total. Budget is flexible around 50 to 70 thousand per unit. Timeline is not urgent, can wait 6-8 weeks for delivery. Payment terms negotiable.",
    confidence: 96,
    playbookData: {
      product_type: "chemical_storage_tanks",
      product_details: {
        buyer_playbook: {
          "Negotiation Strategy": [
            "Leverage flexible timeline for better pricing",
            "Emphasize the large order quantity (5 units)",
            "Focus on long-term maintenance and service agreements",
            "Request comprehensive warranty and compliance certifications"
          ],
          Tradables: {
            "Primary Goal": "Acquire high-quality chemical storage tanks with comprehensive warranty and compliance documentation at the best possible unit price.",
            "Get (High value to us)": [
              "Volume discount for 5-unit order",
              "Extended warranty coverage (5+ years)",
              "All required compliance certifications (API, ASME, etc.)",
              "Installation and commissioning services",
              "Preventive maintenance agreement"
            ],
            "Give (Low-cost to us)": [
              "Flexible delivery timeline (6-8 weeks)",
              "Payment terms flexibility",
              "Commitment to long-term service relationship",
              "Reference for future similar projects",
              "Site preparation coordination"
            ]
          },
          "Ideal & Acceptable Terms": {
            Price: {
              "Target Purchase Price (USD)": 50000.0,
              "Maximum Budget (USD)": 70000.0,
              Ideal: "Volume pricing at $50,000/unit for 5 units",
              "Fallback Position": "Up to $70,000/unit if includes installation and extended warranty"
            },
            "Payment Terms": {
              Ideal: "Net 60 terms with milestone payments",
              "Fallback Position": "30% down, 70% on delivery and acceptance"
            },
            Warranty: {
              Ideal: "5-year comprehensive warranty with annual inspections",
              "Fallback Position": "3-year warranty with maintenance support"
            },
            Delivery: {
              Ideal: "Free delivery and installation within 6-8 weeks",
              "Fallback Position": "Delivery costs included, installation at additional cost"
            }
          }
        }
      },
      buyer_profile: {
        "Buyer ID": 3,
        "Credit Worthiness": 10,
        "Recurring Customer": true
      }
    }
  }
];

// Mock successful negotiation results for different scenarios
export const mockNegotiationResults = {
  success: [
    {
      status: "DEAL_REACHED",
      price: "$175,000",
      payment_terms: "10% down payment with balance due Net45",
      warranty: "3-year /3,000-hour comprehensive warranty, including the first two scheduled services (250hr,500hr) fully covered",
      delivery: "Free delivery to buyer's site, within a 50-mile radius; for delivery beyond this radius, a reasonable flat fee will be discussed and capped",
      maintenance_services: "Inclusion of the first 2 scheduled maintenance services (parts and labor) as part of the warranty",
      additional_terms: "The buyer agrees to provide a public, positive customer testimonial and commit to a future parts & service contract, if the rates are competitive"
    },
    {
      status: "DEAL_REACHED",
      price: "$620/ton (Total: $62,000)",
      payment_terms: "50% upfront payment, 50% on delivery",
      warranty: "Grade 60 certification with full material test certificates",
      delivery: "Free delivery and offloading to Houston warehouse within 14 days",
      maintenance_services: "Quality inspection and documentation included",
      additional_terms: "Supplier agrees to priority scheduling for future bulk orders and extended payment terms for repeat business"
    },
    {
      status: "DEAL_REACHED",
      price: "$58,000/unit (Total: $290,000 for 5 units)",
      payment_terms: "Net 60 terms with milestone payments: 20% on order, 60% on delivery, 20% on commissioning",
      warranty: "5-year comprehensive warranty with annual inspections and preventive maintenance",
      delivery: "Free delivery and complete installation within 7 weeks, including all compliance certifications",
      maintenance_services: "Comprehensive 5-year preventive maintenance agreement included",
      additional_terms: "Supplier provides ongoing technical support and training for operations staff"
    }
  ],
  failure: [
    {
      status: "NO_DEAL_REACHED",
      reason: "Seller made a counter-offer with different payment terms. The buyer's offer specified 'Net60 terms with 5% down payment required', but the seller's response changed this to '50% non-refundable down payment, balance due via cleared funds upon delivery'."
    },
    {
      status: "NO_DEAL_REACHED",
      reason: "Price gap too significant. Buyer's maximum budget of $650/ton could not meet seller's minimum acceptable price of $680/ton, even with bulk quantity considerations."
    },
    {
      status: "NO_DEAL_REACHED",
      reason: "Timeline mismatch. Buyer required delivery within 2 weeks but seller's minimum production and delivery time is 4-6 weeks due to current order backlog."
    }
  ]
};

export class MockTranscriptionService {
  private static lastUsedIndex = -1;
  
  static getRandomResponse(): MockTranscriptionResponse {
    const randomIndex = Math.floor(Math.random() * mockTranscriptionResponses.length);
    return mockTranscriptionResponses[randomIndex];
  }

  static getResponseByIndex(index: number): MockTranscriptionResponse {
    if (index >= 0 && index < mockTranscriptionResponses.length) {
      return mockTranscriptionResponses[index];
    }
    return this.getRandomResponse();
  }

  static getNextResponse(): MockTranscriptionResponse {
    // Cycle through responses to provide variety in testing
    this.lastUsedIndex = (this.lastUsedIndex + 1) % mockTranscriptionResponses.length;
    return mockTranscriptionResponses[this.lastUsedIndex];
  }

  static async simulateTranscription(audioBlob: Blob, useNext = false): Promise<[string, { result: any }]> {
    // Simulate API delay with some variability
    const delay = 1000 + Math.random() * 2000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const response = useNext ? this.getNextResponse() : this.getRandomResponse();
    
    // Log for debugging
    console.log('📝 Mock transcription result:', {
      transcript: response.transcript.substring(0, 50) + '...',
      confidence: response.confidence,
      productType: response.playbookData.product_type
    });
    
    return [response.transcript, { result: response.playbookData }];
  }

  static getRandomNegotiationResult(): any {
    const isSuccess = Math.random() > 0.3; // 70% success rate
    if (isSuccess) {
      const successResults = mockNegotiationResults.success;
      const randomIndex = Math.floor(Math.random() * successResults.length);
      return successResults[randomIndex];
    } else {
      const failureResults = mockNegotiationResults.failure;
      const randomIndex = Math.floor(Math.random() * failureResults.length);
      return failureResults[randomIndex];
    }
  }

  // Additional utility methods for testing different scenarios
  static getSpecificResponse(productType: 'excavator' | 'steel_rebar' | 'chemical_storage_tanks'): MockTranscriptionResponse {
    const response = mockTranscriptionResponses.find(r => r.playbookData.product_type === productType);
    return response || this.getRandomResponse();
  }

  static getSuccessfulNegotiationResult(): any {
    const successResults = mockNegotiationResults.success;
    const randomIndex = Math.floor(Math.random() * successResults.length);
    return successResults[randomIndex];
  }

  static getFailedNegotiationResult(): any {
    const failureResults = mockNegotiationResults.failure;
    const randomIndex = Math.floor(Math.random() * failureResults.length);
    return failureResults[randomIndex];
  }

  // Network simulation methods
  static async simulateNetworkFailure(): Promise<never> {
    await new Promise(resolve => setTimeout(resolve, 500));
    throw new Error('Network connection failed');
  }

  static async simulateServerError(): Promise<never> {
    await new Promise(resolve => setTimeout(resolve, 800));
    throw new Error('Server temporarily unavailable (503)');
  }

  static async simulateTimeout(): Promise<never> {
    await new Promise(resolve => setTimeout(resolve, 10000));
    throw new Error('Request timeout');
  }
} 