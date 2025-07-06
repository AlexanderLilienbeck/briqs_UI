import { z } from "zod";

// ========================================
// CORE B2B ENTITIES
// ========================================

// User Role Types (for future Clerk integration)
export type UserRole = "supplier" | "buyer" | "admin";

export type CompanyProfile = {
  id: string;
  name: string;
  taxId: string; // Steuernummer/VAT
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    email: string;
    phone: string;
    position: string;
  };
  industry: string;
  website?: string;
  logo?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ========================================
// COMMERCIAL TERMS & PRICING
// ========================================

export type PaymentTerms =
  | "immediate"
  | "net_7"
  | "net_14"
  | "net_30"
  | "net_60"
  | "net_90"
  | "custom";

export type DeliveryTerms =
  | "ex_works"
  | "fob"
  | "cif"
  | "dap"
  | "ddp"
  | "custom";

export type PricingTier = {
  minQuantity: number;
  maxQuantity?: number;
  unitPrice: number;
  currency: string;
};

export type CommercialTerms = {
  pricing: PricingTier[];
  paymentTerms: PaymentTerms;
  customPaymentTerms?: string;
  deliveryTerms: DeliveryTerms;
  customDeliveryTerms?: string;
  leadTime: {
    min: number;
    max: number;
    unit: "days" | "weeks" | "months";
  };
  minimumOrderQuantity: number;
  validUntil: Date;
  currency: string;
  includesVAT: boolean;
  warrantyPeriod?: {
    duration: number;
    unit: "months" | "years";
  };
};

// ========================================
// B2B PRODUCT LISTING
// ========================================

export type B2BProduct = {
  id: string;
  supplierId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  sku: string;
  images: string[];
  specifications: Record<string, string | number>;
  certifications: string[];
  commercialTerms: CommercialTerms;
  negotiationBoundaries: {
    priceFlexibility: number; // percentage (0-100)
    quantityFlexibility: number; // percentage
    deliveryFlexibility: number; // days
    paymentTermsFlexible: boolean;
  };
  keywords: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ========================================
// BUYER REQUESTS & MATCHING
// ========================================

export type BuyerRequest = {
  id: string;
  buyerId: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  specifications: Record<string, string | number>;
  quantity: {
    min: number;
    max?: number;
    unit: string;
  };
  budget: {
    min?: number;
    max?: number;
    currency: string;
  };
  deliveryRequirements: {
    location: {
      city: string;
      country: string;
    };
    deadline: Date;
    terms: DeliveryTerms;
  };
  paymentPreferences: {
    terms: PaymentTerms;
    customTerms?: string;
  };
  additionalRequirements?: string;
  urgency: "low" | "medium" | "high" | "urgent";
  status: "draft" | "active" | "negotiating" | "completed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
};

// ========================================
// AI NEGOTIATION SYSTEM
// ========================================

export type NegotiationAgent = {
  id: string;
  type: "buyer" | "supplier";
  userId: string;
  personality: "aggressive" | "balanced" | "conservative";
  priorities: {
    price: number; // weight 0-1
    quality: number;
    delivery: number;
    terms: number;
  };
  constraints: {
    maxPrice?: number;
    minPrice?: number;
    maxDeliveryTime?: number;
    requiredCertifications?: string[];
  };
  isActive: boolean;
};

export type NegotiationRound = {
  id: string;
  negotiationId: string;
  round: number;
  agentId: string;
  agentType: "buyer" | "supplier";
  offer: {
    price: number;
    quantity: number;
    deliveryDate: Date;
    paymentTerms: PaymentTerms;
    additionalTerms?: string;
  };
  reasoning: string; // AI's explanation for the offer
  timestamp: Date;
};

export type Negotiation = {
  id: string;
  requestId: string;
  productId: string;
  buyerAgentId: string;
  supplierAgentId: string;
  status: "active" | "completed" | "failed" | "cancelled";
  rounds: NegotiationRound[];
  finalContract?: Contract;
  startedAt: Date;
  completedAt?: Date;
  maxRounds: number;
  currentRound: number;
};

// ========================================
// CONTRACTS & AGREEMENTS
// ========================================

export type ContractTerms = {
  price: number;
  quantity: number;
  currency: string;
  deliveryDate: Date;
  deliveryLocation: string;
  paymentTerms: PaymentTerms;
  deliveryTerms: DeliveryTerms;
  warrantyPeriod?: {
    duration: number;
    unit: "months" | "years";
  };
  penalties: {
    lateDelivery?: number; // percentage or fixed amount
    qualityIssues?: string;
  };
  additionalTerms?: string;
};

export type Contract = {
  id: string;
  negotiationId: string;
  buyerId: string;
  supplierId: string;
  productId: string;
  requestId: string;
  terms: ContractTerms;
  status:
    | "pending_approval"
    | "approved"
    | "rejected"
    | "executed"
    | "cancelled";
  buyerApproval?: {
    approved: boolean;
    timestamp: Date;
    signature?: string;
  };
  supplierApproval?: {
    approved: boolean;
    timestamp: Date;
    signature?: string;
  };
  executionDetails?: {
    orderPlaced: Date;
    delivered?: Date;
    paymentReceived?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};

// ========================================
// REAL-TIME UPDATES & NOTIFICATIONS
// ========================================

export type NotificationType =
  | "new_request_match"
  | "negotiation_started"
  | "negotiation_update"
  | "negotiation_completed"
  | "contract_pending"
  | "contract_approved"
  | "contract_rejected";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown>; // Additional context data
  read: boolean;
  createdAt: Date;
};

export type WebSocketMessage = {
  type: "negotiation_update" | "new_match" | "contract_update" | "notification";
  data: unknown;
  timestamp: Date;
};

// ========================================
// ZOD VALIDATION SCHEMAS
// ========================================

export const BuyerRequestSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  category: z.string().min(2),
  subcategory: z.string().optional(),
  specifications: z.record(z.union([z.string(), z.number()])),
  quantity: z.object({
    min: z.number().positive(),
    max: z.number().positive().optional(),
    unit: z.string(),
  }),
  budget: z.object({
    min: z.number().positive().optional(),
    max: z.number().positive().optional(),
    currency: z.string().length(3),
  }),
  deliveryRequirements: z.object({
    location: z.object({
      city: z.string(),
      country: z.string(),
    }),
    deadline: z.date(),
    terms: z.enum(["ex_works", "fob", "cif", "dap", "ddp", "custom"]),
  }),
  paymentPreferences: z.object({
    terms: z.enum([
      "immediate",
      "net_7",
      "net_14",
      "net_30",
      "net_60",
      "net_90",
      "custom",
    ]),
    customTerms: z.string().optional(),
  }),
  additionalRequirements: z.string().optional(),
  urgency: z.enum(["low", "medium", "high", "urgent"]),
});

export const B2BProductSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(20).max(2000),
  category: z.string().min(2),
  subcategory: z.string().optional(),
  sku: z.string().min(3),
  specifications: z.record(z.union([z.string(), z.number()])),
  certifications: z.array(z.string()),
  commercialTerms: z.object({
    pricing: z.array(
      z.object({
        minQuantity: z.number().positive(),
        maxQuantity: z.number().positive().optional(),
        unitPrice: z.number().positive(),
        currency: z.string().length(3),
      }),
    ),
    paymentTerms: z.enum([
      "immediate",
      "net_7",
      "net_14",
      "net_30",
      "net_60",
      "net_90",
      "custom",
    ]),
    deliveryTerms: z.enum(["ex_works", "fob", "cif", "dap", "ddp", "custom"]),
    leadTime: z.object({
      min: z.number().positive(),
      max: z.number().positive(),
      unit: z.enum(["days", "weeks", "months"]),
    }),
    minimumOrderQuantity: z.number().positive(),
    validUntil: z.date(),
    currency: z.string().length(3),
    includesVAT: z.boolean(),
  }),
  negotiationBoundaries: z.object({
    priceFlexibility: z.number().min(0).max(100),
    quantityFlexibility: z.number().min(0).max(100),
    deliveryFlexibility: z.number().min(0),
    paymentTermsFlexible: z.boolean(),
  }),
  keywords: z.array(z.string()),
});

// ========================================
// API RESPONSE TYPES
// ========================================

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}>;

// ========================================
// SEARCH & FILTERING
// ========================================

export type SearchFilters = {
  category?: string;
  subcategory?: string;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  location?: {
    country?: string;
    city?: string;
    radius?: number; // km
  };
  deliveryTime?: {
    max: number;
    unit: "days" | "weeks" | "months";
  };
  certifications?: string[];
  keywords?: string[];
};

export type MatchScore = {
  overall: number; // 0-100
  price: number;
  specifications: number;
  delivery: number;
  supplier: number;
  explanation: string;
};

export type ProductMatch = {
  product: B2BProduct;
  request: BuyerRequest;
  score: MatchScore;
  estimatedNegotiationOutcome: {
    priceRange: {
      min: number;
      max: number;
    };
    deliveryRange: {
      min: Date;
      max: Date;
    };
    successProbability: number; // 0-1
  };
};
