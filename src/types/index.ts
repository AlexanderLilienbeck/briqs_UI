export type VotesType = {
  count: number;
  value: number;
};

export type PunctuationType = {
  countOpinions: number;
  punctuation: number;
  votes: VotesType[];
};

export type ReviewType = {
  name: string;
  avatar: string;
  description: string;
  punctuation: number;
};

export type ProductType = {
  id: string;
  name: string;
  thumb: string;
  price: string;
  count: number;
  color: string;
  size: string;
  images: string[];
  discount?: string;
  currentPrice: number;
  punctuation: PunctuationType;
  reviews: ReviewType[];
};

export type ProductTypeList = {
  id: string;
  name: string;
  price: string;
  color: string;
  images: string[];
  discount?: string;
  currentPrice?: number;
};

export type ProductStoreType = {
  id: string;
  name: string;
  thumb: string;
  price: number;
  count: number;
  color: string;
  size: string;
};

export type GtagEventType = {
  action: string;
  category: string;
  label: string;
  value: string;
};

// ========================================
// B2B TYPE EXPORTS
// ========================================

// Re-export all B2B types for easy access
export * from "./b2b";

// ========================================
// EXTENDED TYPES FOR B2B COMPATIBILITY
// ========================================

// Extended product type that can handle both B2C and B2B products
export type UnifiedProductType = ProductType & {
  // B2B specific fields (optional for backwards compatibility)
  supplierId?: string;
  sku?: string;
  specifications?: Record<string, string | number>;
  certifications?: string[];
  category?: string;
  subcategory?: string;
  keywords?: string[];
  isB2B?: boolean;
};

// Extended user type for role-based access (future Clerk integration)
export type ExtendedUserType = {
  id: string;
  email: string;
  name: string;
  role?: "supplier" | "buyer" | "admin";
  companyId?: string;
  isB2BUser?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};

// Request/Response wrapper for API consistency
export type ApiRequestType<T = unknown> = {
  data: T;
  timestamp: Date;
  requestId?: string;
};

export type ApiResponseType<T = unknown> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: Date;
  requestId?: string;
};
