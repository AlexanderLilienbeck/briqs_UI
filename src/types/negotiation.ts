// Negotiation Strategy Types
export type NegotiationStrategy =
  | "aggressive"
  | "balanced"
  | "conservative"
  | "time_sensitive"
  | "price_focused"
  | "quality_focused";

export type NegotiationPhase =
  | "initial_offer"
  | "counter_negotiation"
  | "final_terms"
  | "contract_review"
  | "completed"
  | "failed";

// Agent Types
export interface AgentPersonality {
  strategy: NegotiationStrategy;
  priceFlexibility: number; // 0-1 scale
  timeConstraints: number; // 0-1 scale (1 = very urgent)
  qualityFocus: number; // 0-1 scale
  relationshipFocus: number; // 0-1 scale
  riskTolerance: number; // 0-1 scale
}

export interface AgentConstraints {
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  maxDeliveryTime?: number; // days
  requiredPaymentTerms?: string[];
  dealBreakers?: string[]; // List of unacceptable terms
}

// Negotiation Offer Types
export interface NegotiationOffer {
  id: string;
  negotiationId: string;
  agentId: string;
  agentType: "buyer" | "supplier";
  roundNumber: number;
  timestamp: Date;

  // Commercial terms being offered
  pricePerUnit: number;
  currency: string;
  quantity: number;
  deliveryDays: number;
  paymentTerms: string;

  // Additional terms
  warranty?: {
    duration: number;
    unit: "months" | "years";
  };
  qualityStandards?: string[];
  customTerms?: Record<string, string>;

  // Negotiation context
  reasoning: string; // AI's explanation for this offer
  confidence: number; // 0-1 scale
  isCounterOffer: boolean;
  previousOfferId?: string;
}

// Negotiation Round Management
export interface NegotiationRound {
  roundNumber: number;
  buyerOffer?: NegotiationOffer;
  supplierOffer?: NegotiationOffer;
  startTime: Date;
  endTime?: Date;
  status: "active" | "completed" | "failed";
  convergenceScore: number; // 0-1 how close offers are
}

// Main Negotiation Session
export interface NegotiationSession {
  id: string;
  buyerRequestId: string;
  productId: string;
  supplierId: string;

  // Participants
  buyerAgent: {
    id: string;
    personality: AgentPersonality;
    constraints: AgentConstraints;
  };
  supplierAgent: {
    id: string;
    personality: AgentPersonality;
    constraints: AgentConstraints;
  };

  // Session state
  status: "initializing" | "active" | "paused" | "completed" | "failed";
  currentPhase: NegotiationPhase;
  currentRound: number;
  rounds: NegotiationRound[];

  // Timing
  startTime: Date;
  lastActivity: Date;
  maxDuration?: number; // minutes

  // Results
  finalOffer?: NegotiationOffer;
  agreementReached: boolean;
  failureReason?: string;

  // Metadata
  priority: "low" | "medium" | "high" | "urgent";
  tags?: string[];
}

// Decision Making Types
export interface DecisionContext {
  currentOffer: NegotiationOffer;
  previousOffers: NegotiationOffer[];
  marketData?: {
    averagePrice: number;
    priceRange: { min: number; max: number };
    typicalDeliveryTime: number;
  };
  timeRemaining?: number; // minutes
  alternativeOptions?: number; // count of other potential deals
}

export interface DecisionResult {
  action: "accept" | "counter" | "reject" | "request_info";
  counterOffer?: Partial<NegotiationOffer>;
  reasoning: string;
  confidence: number;
  requestedInfo?: string[];
}

// Agent Base Interface
export interface NegotiationAgent {
  id: string;
  type: "buyer" | "supplier";
  personality: AgentPersonality;
  constraints: AgentConstraints;

  // Core methods
  generateInitialOffer(context: DecisionContext): NegotiationOffer;
  evaluateOffer(
    offer: NegotiationOffer,
    context: DecisionContext,
  ): DecisionResult;
  generateCounterOffer(
    incomingOffer: NegotiationOffer,
    context: DecisionContext,
  ): NegotiationOffer;

  // Strategy methods
  updateStrategy(negotiationHistory: NegotiationRound[]): void;
  calculateWalkAwayPoint(context: DecisionContext): number;
  assessDealValue(offer: NegotiationOffer): number;
}

// Negotiation Events for Real-time Updates
export interface NegotiationEvent {
  id: string;
  negotiationId: string;
  type:
    | "session_started"
    | "offer_made"
    | "offer_received"
    | "counter_offer"
    | "offer_accepted"
    | "offer_rejected"
    | "negotiation_completed"
    | "negotiation_failed"
    | "agent_thinking"
    | "phase_changed";

  timestamp: Date;
  agentId?: string;
  data?: unknown;
  message?: string;
}

// Contract Generation Types
export interface GeneratedContract {
  id: string;
  negotiationId: string;

  // Parties
  buyer: {
    id: string;
    companyName: string;
    contactPerson: string;
    address: string;
  };
  supplier: {
    id: string;
    companyName: string;
    contactPerson: string;
    address: string;
  };

  // Commercial terms (from final negotiated offer)
  product: {
    name: string;
    description: string;
    specifications: Record<string, string>;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currency: string;
  };

  // Align with ContractTerms from b2b.ts
  terms: {
    price: number;
    quantity: number;
    currency: string;
    deliveryDate: Date;
    deliveryLocation: string;
    paymentTerms: string;
    deliveryTerms: string;
    warrantyPeriod?: {
      duration: number;
      unit: "months" | "years";
    };
    penalties: {
      lateDelivery?: number;
      qualityIssues?: string;
    };
    additionalTerms?: string;
    // Additional fields from negotiation
    pricePerUnit: number;
    deliveryDays: number;
    warrantyMonths?: number;
  };

  // Legal document content
  legalDocument: string;

  // Contract lifecycle
  status: "draft" | "pending_approval" | "approved" | "signed" | "executed";
  generatedAt: Date;
  expiresAt?: Date;
  signedAt?: Date;

  // Approval workflow
  approvals: {
    buyerApproval: boolean;
    supplierApproval: boolean;
    buyerSignedAt?: Date;
    supplierSignedAt?: Date;
  };
}

// Negotiation Analytics
export interface NegotiationAnalytics {
  sessionId: string;
  duration: number; // minutes
  totalRounds: number;
  convergenceRate: number; // how quickly offers converged
  finalDiscount: number; // percentage from initial offer

  agentPerformance: {
    buyerAgent: {
      averageResponseTime: number; // seconds
      offerAcceptanceRate: number;
      strategicEffectiveness: number; // 0-1 scale
    };
    supplierAgent: {
      averageResponseTime: number;
      offerAcceptanceRate: number;
      strategicEffectiveness: number;
    };
  };

  outcomeQuality: {
    dealValue: number; // total contract value
    timeToClose: number; // minutes
    satisfactionScore: number; // 0-1 scale
  };
}

// API Response Types
export interface NegotiationApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface StartNegotiationRequest {
  buyerRequestId: string;
  productId: string;
  buyerStrategy?: NegotiationStrategy;
  maxDuration?: number; // minutes
  priority?: "low" | "medium" | "high" | "urgent";
}

export interface StartNegotiationResponse {
  negotiationId: string;
  estimatedDuration: number; // minutes
  participatingAgents: {
    buyerAgent: { id: string; strategy: NegotiationStrategy };
    supplierAgent: { id: string; strategy: NegotiationStrategy };
  };
}

// Contract Types (compatible with b2b.ts)
export interface Contract {
  id: string;
  negotiationId: string;
  buyerId: string;
  supplierId: string;
  terms: {
    price: number;
    quantity: number;
    currency: string;
    deliveryDate: Date;
    deliveryLocation: string;
    paymentTerms: string;
    deliveryTerms: string;
    warrantyPeriod?: {
      duration: number;
      unit: "months" | "years";
    };
    penalties: {
      lateDelivery?: number;
      qualityIssues?: string;
    };
    additionalTerms?: string;
  };
  status:
    | "pending_approval"
    | "approved"
    | "rejected"
    | "executed"
    | "cancelled";
  buyerSignature?: string;
  supplierSignature?: string;
  legalDocument: string;
  createdAt: Date;
  approvedAt?: Date;
  executionDeadline?: Date;
}

// Contract Terms (simplified for negotiation use)
export interface ContractTerms {
  pricePerUnit: number;
  quantity: number;
  currency: string;
  deliveryDays: number;
  paymentTerms: string;
  deliveryTerms?: string;
  warrantyMonths?: number;
  additionalTerms?: string;
}

// Negotiation Flow Types
export interface NegotiationData {
  step: number;
  voiceInput?: string;
  textInput?: string;
  applyStandardTerms: boolean;
  requirements: ContractPosition[];
  negotiationId?: string;
  deals: NegotiationDeal[];
  playbookData?: any; // API response data structure
}

export interface ContractPosition {
  id: string;
  category: 'product' | 'price' | 'quantity' | 'delivery' | 'payment' | 'warranty' | 'pricing' | 'logistics' | 'quality';
  title: string;
  value: string;
  isEditable: boolean;
}

export interface NegotiationDeal {
  id: string;
  supplier: {
    name: string;
    rating: number;
    location: string;
    logo?: string;
  };
  product: {
    name: string;
    specifications: string[];
    category: string;
  };
  terms: {
    price: number;
    priceUnit: string;
    quantity: number;
    quantityUnit: string;
    deliveryTime: string;
    paymentTerms: string;
    warranty: string;
    totalValue: number;
  };
  negotiationDetails: {
    originalPrice: number;
    finalPrice: number;
    savings: number;
    savingsPercentage: number;
    negotiationRounds: number;
    keyCompromises: string[];
  };
  status: 'pending' | 'approved' | 'declined' | 'expired';
  expiresIn: string;
  confidence: number; // 0-100
}

export interface NegotiationStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
  isActive: boolean;
}

export interface VoiceRecordingState {
  isRecording: boolean;
  isProcessing: boolean;
  transcript: string;
  confidence: number;
  error?: string;
  audioBlob?: Blob;
  audioUrl?: string;
  mediaRecorder?: MediaRecorder;
}

export interface NegotiationProgress {
  currentStep: string;
  progress: number; // 0-100
  suppliersContacted: number;
  responsesReceived: number;
  activeNegotiations: number;
  completedDeals: number;
  estimatedTimeRemaining: string;
  statusMessages: string[];
}

// API Response Types for the negotiation endpoint
export interface DealReachedResponse {
  status: "DEAL_REACHED";
  price: string;
  payment_terms: string;
  warranty: string;
  delivery: string;
  maintenance_services?: string;
  additional_terms?: string;
}

export interface NoDealReachedResponse {
  status: "NO_DEAL_REACHED";
  reason: string;
}

export interface ContinueNegotiationResponse {
  status: "CONTINUE";
  reason: string;
}

export type NegotiationResultApiResponse = DealReachedResponse | NoDealReachedResponse | ContinueNegotiationResponse;

// Static dummy data for development
export const mockNegotiationResults: NegotiationDeal[] = [
  {
    id: "deal-001",
    supplier: {
      name: "Industrial Steel Solutions GmbH",
      rating: 4.8,
      location: "Hamburg, Germany"
    },
    product: {
      name: "Cold-Rolled Steel Coil SPCC 1.0mm",
      specifications: ["1.0mm thickness", "1250mm width", "SPCC grade", "Coil weight: 5-15 tons"],
      category: "Industrial Materials"
    },
    terms: {
      price: 850,
      priceUnit: "€/ton",
      quantity: 50,
      quantityUnit: "tons",
      deliveryTime: "14 days",
      paymentTerms: "Net 30",
      warranty: "12 months material warranty",
      totalValue: 42500
    },
    negotiationDetails: {
      originalPrice: 920,
      finalPrice: 850,
      savings: 70,
      savingsPercentage: 7.6,
      negotiationRounds: 3,
      keyCompromises: ["Reduced delivery time from 21 to 14 days", "Agreed to standard coil weights"]
    },
    status: 'pending',
    expiresIn: "47h 23m",
    confidence: 92
  },
  {
    id: "deal-002",
    supplier: {
      name: "Precision Engineering Ltd.",
      rating: 4.6,
      location: "Manchester, UK"
    },
    product: {
      name: "CNC Machined Aluminum Parts",
      specifications: ["6061-T6 aluminum", "±0.1mm tolerance", "Anodized finish", "Custom geometry"],
      category: "Machined Components"
    },
    terms: {
      price: 45,
      priceUnit: "€/piece",
      quantity: 500,
      quantityUnit: "pieces",
      deliveryTime: "21 days",
      paymentTerms: "Net 45",
      warranty: "6 months manufacturing warranty",
      totalValue: 22500
    },
    negotiationDetails: {
      originalPrice: 52,
      finalPrice: 45,
      savings: 7,
      savingsPercentage: 13.5,
      negotiationRounds: 4,
      keyCompromises: ["Extended payment terms to Net 45", "Bulk quantity discount applied"]
    },
    status: 'pending',
    expiresIn: "46h 12m",
    confidence: 87
  },
  {
    id: "deal-003",
    supplier: {
      name: "ChemSupply Europe B.V.",
      rating: 4.9,
      location: "Rotterdam, Netherlands"
    },
    product: {
      name: "Industrial Isopropyl Alcohol 99.9%",
      specifications: ["99.9% purity", "200L drums", "UN1219 certified", "MSDS included"],
      category: "Chemical Products"
    },
    terms: {
      price: 2.8,
      priceUnit: "€/L",
      quantity: 2000,
      quantityUnit: "liters",
      deliveryTime: "7 days",
      paymentTerms: "Net 15",
      warranty: "Quality guarantee",
      totalValue: 5600
    },
    negotiationDetails: {
      originalPrice: 3.2,
      finalPrice: 2.8,
      savings: 0.4,
      savingsPercentage: 12.5,
      negotiationRounds: 2,
      keyCompromises: ["Fast delivery in 7 days", "Hazmat handling included"]
    },
    status: 'pending',
    expiresIn: "48h 0m",
    confidence: 95
  }
];

export const mockContractPositions: ContractPosition[] = [
  {
    id: "product-spec",
    title: "Product Specifications",
    value: "Cold-rolled steel coil, SPCC grade, 1.0mm thickness, 1250mm width",
    category: "product",
    isEditable: true
  },
  {
    id: "quantity",
    title: "Quantity Requirements",
    value: "50 tons minimum order, up to 100 tons preferred",
    category: "quantity",
    isEditable: true
  },
  {
    id: "price-target",
    title: "Price Target",
    value: "Target price around €850/ton, maximum €900/ton",
    category: "pricing",
    isEditable: true
  },
  {
    id: "delivery",
    title: "Delivery Requirements",
    value: "Delivery within 2-3 weeks to Hamburg port",
    category: "logistics",
    isEditable: true
  },
  {
    id: "payment",
    title: "Payment Terms",
    value: "Net 30 preferred, can accept Net 45 for better pricing",
    category: "payment",
    isEditable: true
  },
  {
    id: "quality",
    title: "Quality Standards",
    value: "ISO 9001 certified supplier, material certificates required",
    category: "quality",
    isEditable: true
  }
];

export const negotiationSteps: NegotiationStep[] = [
  {
    id: 1,
    title: 'Voice Input',
    description: 'Tell us what you need',
    isComplete: false,
    isActive: true
  },
  {
    id: 2,
    title: 'Text Input',
    description: 'Describe your requirements',
    isComplete: false,
    isActive: false
  },
  {
    id: 3,
    title: 'Review Requirements',
    description: 'Confirm contract positions',
    isComplete: false,
    isActive: false
  },
  {
    id: 4,
    title: 'AI Negotiation',
    description: 'Watch agents negotiate',
    isComplete: false,
    isActive: false
  },
  {
    id: 5,
    title: 'Deal Approval',
    description: 'Review and approve deals',
    isComplete: false,
    isActive: false
  }
];
