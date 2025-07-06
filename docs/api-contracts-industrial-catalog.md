# API Contracts: Industrial Product Catalog Enhancement

## Base Configuration

**Base URL**: `/api/v1`  
**Authentication**: Bearer token (JWT)  
**Content-Type**: `application/json`  
**API Version**: `1.0`

## Common Data Models

### Core Types

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface Measurement {
  value: number;
  unit: string;
  tolerance?: number;
  min?: number;
  max?: number;
}

interface FilterOption {
  value: string;
  label: string;
  count: number;
  description?: string;
}
```

### Industrial Product Models

```typescript
interface IndustrialProduct {
  id: string;
  supplierId: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  sku: string;
  images: ProductImage[];
  
  specifications: IndustrialSpecifications;
  certifications: Certification[];
  commercialTerms: CommercialTerms;
  negotiationVariables: NegotiationVariable[];
  
  industryApplications: string[];
  technicalDocuments: TechnicalDocument[];
  complianceRequirements: ComplianceRequirement[];
  
  searchKeywords: string[];
  filterTags: string[];
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  dataQualityScore: number;
}

interface IndustrialSpecifications {
  dimensions?: {
    length?: Measurement;
    width?: Measurement;
    height?: Measurement;
    diameter?: Measurement;
    thickness?: Measurement;
    weight?: Measurement;
  };
  
  material?: {
    type: string;
    grade?: string;
    composition?: MaterialComposition[];
    properties?: MaterialProperty[];
  };
  
  performance?: {
    pressureRating?: Measurement;
    temperatureRange?: { min: number; max: number; unit: string };
    electricalRating?: ElectricalRating;
    mechanicalProperties?: MechanicalProperty[];
    chemicalResistance?: string[];
  };
  
  manufacturing?: {
    tolerance?: Tolerance[];
    surfaceFinish?: SurfaceFinish;
    heatTreatment?: string;
    coatingOptions?: CoatingOption[];
  };
  
  custom?: Record<string, any>;
}

interface NegotiationVariable {
  id: string;
  name: string;
  description: string;
  type: 'selection' | 'range' | 'boolean' | 'text' | 'calculated';
  
  options?: VariableOption[];
  range?: { min: number; max: number; step?: number; unit: string };
  defaultValue: any;
  
  impactOnPrice: 'none' | 'low' | 'medium' | 'high';
  priceAdjustment?: PriceAdjustment;
  impactOnLeadTime?: number;
  impactOnMOQ?: number;
  
  dependencies?: VariableDependency[];
  constraints?: VariableConstraint[];
  
  displayOrder: number;
  isRequired: boolean;
  helpText?: string;
  category: 'technical' | 'commercial' | 'delivery' | 'service';
}

interface SearchFilters {
  categories?: string[];
  subcategories?: string[];
  materialTypes?: string[];
  pressureRange?: { min?: number; max?: number };
  temperatureRange?: { min?: number; max?: number };
  certifications?: string[];
  deliveryTerms?: string[];
  paymentTerms?: string[];
  priceRange?: { min?: number; max?: number; currency: string };
  leadTimeMax?: number;
  moqRange?: { min?: number; max?: number };
  tags?: string[];
  industryApplications?: string[];
}
```

---

## Product Catalog Endpoints

### GET /products/industrial
**Description**: Retrieve industrial products with filtering and search

#### Request Parameters
```typescript
interface ProductListRequest {
  // Search
  q?: string;                    // Full-text search query
  
  // Filtering
  category?: string[];           // Product categories
  subcategory?: string[];        // Product subcategories
  materialType?: string[];       // Material types (Steel, Aluminum, etc.)
  pressureMin?: number;          // Minimum pressure rating
  pressureMax?: number;          // Maximum pressure rating
  tempMin?: number;              // Minimum temperature rating
  tempMax?: number;              // Maximum temperature rating
  certifications?: string[];     // Required certifications
  deliveryTerms?: string[];      // Acceptable delivery terms
  paymentTerms?: string[];       // Acceptable payment terms
  priceMin?: number;             // Minimum price
  priceMax?: number;             // Maximum price
  currency?: string;             // Price currency (default: EUR)
  leadTimeMax?: number;          // Maximum lead time (days)
  moqMin?: number;               // Minimum MOQ
  moqMax?: number;               // Maximum MOQ
  tags?: string[];               // Filter tags
  industryApplication?: string[]; // Industry applications
  
  // Sorting
  sortBy?: 'name' | 'price' | 'leadTime' | 'relevance' | 'rating';
  sortDirection?: 'asc' | 'desc';
  
  // Pagination
  page?: number;                 // Page number (default: 1)
  limit?: number;                // Items per page (default: 20, max: 100)
  
  // Response options
  includeAggregations?: boolean; // Include filter aggregations
  includeRelated?: boolean;      // Include related products
}
```

#### Response
```typescript
interface ProductListResponse {
  products: IndustrialProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  aggregations?: {
    categories: { name: string; count: number }[];
    materialTypes: { name: string; count: number }[];
    priceRanges: { range: string; count: number }[];
    leadTimeRanges: { range: string; count: number }[];
    certifications: { name: string; count: number }[];
  };
  appliedFilters: AppliedFilter[];
}
```

#### Example Request
```bash
GET /api/v1/products/industrial?category=Raw%20Materials&materialType=Steel&pressureMin=1000&sortBy=price&page=1&limit=20
```

#### Example Response
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "steel-001",
        "name": "Cold-Rolled Steel Coil (SPCC, 1 mm)",
        "category": "Raw Materials",
        "subcategory": "Metals",
        "specifications": {
          "material": {
            "type": "Steel",
            "grade": "SPCC",
            "properties": [
              {
                "name": "Tensile Strength",
                "value": 270,
                "unit": "MPa"
              }
            ]
          },
          "dimensions": {
            "thickness": {
              "value": 1,
              "unit": "mm",
              "tolerance": 0.05
            }
          }
        },
        "negotiationVariables": [
          {
            "id": "coil-weight",
            "name": "Coil Weight Split",
            "type": "selection",
            "options": [
              { "value": "standard", "label": "Standard (5-25 tons)" },
              { "value": "split", "label": "Split Coils (2-5 tons)" }
            ],
            "impactOnPrice": "medium"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3,
      "hasNext": true,
      "hasPrevious": false
    }
  },
  "meta": {
    "timestamp": "2024-12-30T10:00:00Z",
    "requestId": "req_123456",
    "version": "1.0"
  }
}
```

### GET /products/industrial/{id}
**Description**: Get detailed information for a specific industrial product

#### Path Parameters
- `id` (string, required): Product ID

#### Query Parameters
```typescript
interface ProductDetailRequest {
  includeRelated?: boolean;      // Include related products
  includeSupplier?: boolean;     // Include supplier information
  includeMarketData?: boolean;   // Include market intelligence
}
```

#### Response
```typescript
interface ProductDetailResponse {
  product: IndustrialProduct;
  supplier?: SupplierInfo;
  relatedProducts?: IndustrialProduct[];
  marketData?: MarketInsight[];
  negotiationHistory?: NegotiationSummary[];
}
```

### GET /products/industrial/{id}/negotiation-variables
**Description**: Get negotiation variables and their current impact calculations

#### Response
```typescript
interface NegotiationVariablesResponse {
  variables: NegotiationVariable[];
  constraints: {
    dependencies: VariableDependency[];
    pricing: {
      basePrice: number;
      currency: string;
      adjustments: PriceAdjustment[];
    };
  };
  calculator: {
    endpoint: string; // URL for real-time calculations
    method: 'POST';
  };
}
```

### POST /products/industrial/{id}/calculate-impact
**Description**: Calculate pricing and lead time impact for selected negotiation variables

#### Request Body
```typescript
interface CalculateImpactRequest {
  variables: Record<string, any>; // Variable ID -> selected value
  quantity: number;
  deliveryLocation?: {
    country: string;
    city: string;
  };
}
```

#### Response
```typescript
interface CalculateImpactResponse {
  pricing: {
    basePrice: number;
    adjustments: {
      variableId: string;
      variableName: string;
      adjustment: number;
      type: 'percentage' | 'fixed';
    }[];
    totalPrice: number;
    currency: string;
  };
  leadTime: {
    baseDays: number;
    adjustments: {
      variableId: string;
      adjustment: number; // days
    }[];
    totalDays: number;
  };
  warnings?: string[];
  recommendations?: string[];
}
```

---

## Search and Filter Endpoints

### GET /search/products
**Description**: Advanced search across industrial products

#### Request Parameters
```typescript
interface AdvancedSearchRequest {
  query: string;                 // Search query
  searchFields?: string[];       // Fields to search in
  filters?: SearchFilters;       // Applied filters
  boost?: {                      // Search result boosting
    exactMatch?: number;
    titleMatch?: number;
    specificationMatch?: number;
  };
  sortBy?: 'relevance' | 'name' | 'price' | 'leadTime';
  page?: number;
  limit?: number;
}
```

#### Response
```typescript
interface SearchResponse {
  results: SearchResult[];
  suggestions?: string[];
  correctedQuery?: string;
  totalResults: number;
  searchTime: number; // milliseconds
  aggregations: SearchAggregations;
}

interface SearchResult {
  product: IndustrialProduct;
  score: number;
  highlights: {
    field: string;
    matches: string[];
  }[];
  explanation?: string;
}
```

### GET /filters/industrial
**Description**: Get available filters and their options

#### Response
```typescript
interface IndustrialFiltersResponse {
  categories: FilterCategory[];
  specifications: SpecificationFilter[];
  commercial: CommercialFilter[];
  compliance: ComplianceFilter[];
  tags: FilterTag[];
}

interface FilterCategory {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
    productCount: number;
  }[];
  productCount: number;
}

interface SpecificationFilter {
  id: string;
  name: string;
  type: 'range' | 'selection' | 'boolean';
  dataType: 'number' | 'string' | 'boolean';
  unit?: string;
  options?: FilterOption[];
  range?: {
    min: number;
    max: number;
    step?: number;
  };
  category: string;
  isAdvanced: boolean;
}
```

### GET /categories/industrial
**Description**: Get industrial product category hierarchy

#### Response
```typescript
interface CategoryHierarchyResponse {
  categories: CategoryNode[];
}

interface CategoryNode {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  subcategories?: CategoryNode[];
  filterTags?: string[];
  icon?: string;
}
```

---

## Product Management Endpoints (Suppliers)

### POST /products/industrial
**Description**: Create a new industrial product listing

#### Request Body
```typescript
interface CreateProductRequest {
  basicInfo: {
    name: string;
    description: string;
    category: string;
    subcategory: string;
    sku: string;
    industryApplications: string[];
  };
  specifications: IndustrialSpecifications;
  commercialTerms: CommercialTerms;
  negotiationVariables: NegotiationVariable[];
  certifications: Certification[];
  images: string[]; // URLs or file upload IDs
  technicalDocuments?: string[]; // Document IDs
  keywords: string[];
}
```

#### Response
```typescript
interface CreateProductResponse {
  product: IndustrialProduct;
  validationResults: {
    isValid: boolean;
    warnings: ValidationWarning[];
    errors: ValidationError[];
  };
  nextSteps: string[];
}
```

### PUT /products/industrial/{id}
**Description**: Update an existing industrial product

#### Request Body
```typescript
interface UpdateProductRequest {
  // Same structure as CreateProductRequest
  // All fields optional for partial updates
}
```

### POST /products/industrial/bulk-import
**Description**: Bulk import industrial products

#### Request Body
```typescript
interface BulkImportRequest {
  products: CreateProductRequest[];
  options: {
    validateOnly?: boolean;
    skipDuplicates?: boolean;
    updateExisting?: boolean;
  };
}
```

#### Response
```typescript
interface BulkImportResponse {
  summary: {
    total: number;
    successful: number;
    failed: number;
    skipped: number;
  };
  results: {
    productIndex: number;
    status: 'success' | 'failed' | 'skipped';
    productId?: string;
    errors?: ValidationError[];
    warnings?: ValidationWarning[];
  }[];
  downloadUrl?: string; // For detailed report
}
```

---

## Negotiation Integration Endpoints

### POST /negotiations/requests
**Description**: Create a negotiation request for an industrial product

#### Request Body
```typescript
interface CreateNegotiationRequest {
  productId: string;
  quantity: {
    value: number;
    unit: string;
  };
  requirements: {
    deliveryDate: string;
    deliveryLocation: {
      country: string;
      city: string;
      address?: string;
    };
    paymentTerms?: string;
    additionalRequirements?: string;
  };
  negotiationVariables: Record<string, any>;
  constraints: {
    maxPrice?: number;
    maxLeadTime?: number;
    requiredCertifications?: string[];
  };
  agentSettings?: {
    personality: 'aggressive' | 'balanced' | 'conservative';
    priorities: {
      price: number;
      quality: number;
      delivery: number;
      terms: number;
    };
  };
}
```

#### Response
```typescript
interface CreateNegotiationResponse {
  negotiationId: string;
  estimatedDuration: number; // minutes
  websocketUrl: string; // For real-time updates
  initialQuote: {
    price: number;
    leadTime: number;
    terms: CommercialTerms;
  };
}
```

### GET /negotiations/{id}/variables-impact
**Description**: Get real-time impact of negotiation variables during negotiation

#### Response
```typescript
interface VariablesImpactResponse {
  currentOffer: {
    price: number;
    leadTime: number;
    variables: Record<string, any>;
  };
  variableImpacts: {
    variableId: string;
    currentValue: any;
    priceImpact: number;
    leadTimeImpact: number;
    negotiabilityScore: number; // 0-100
  }[];
  recommendations: {
    variable: string;
    suggestion: string;
    reasoning: string;
    potentialSavings?: number;
  }[];
}
```

---

## Analytics and Reporting Endpoints

### GET /analytics/products/performance
**Description**: Get product performance analytics

#### Query Parameters
```typescript
interface ProductAnalyticsRequest {
  productIds?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  metrics?: ('views' | 'inquiries' | 'negotiations' | 'conversions')[];
  groupBy?: 'day' | 'week' | 'month';
}
```

#### Response
```typescript
interface ProductAnalyticsResponse {
  products: {
    productId: string;
    productName: string;
    metrics: {
      views: number;
      inquiries: number;
      negotiations: number;
      conversions: number;
      conversionRate: number;
      averageNegotiationDuration: number;
    };
    trends: {
      date: string;
      views: number;
      inquiries: number;
    }[];
  }[];
  summary: {
    totalViews: number;
    totalInquiries: number;
    averageConversionRate: number;
    topPerformingProducts: string[];
  };
}
```

### GET /analytics/search/insights
**Description**: Get search and filter usage analytics

#### Response
```typescript
interface SearchInsightsResponse {
  popularSearches: {
    query: string;
    count: number;
    resultsFound: number;
  }[];
  popularFilters: {
    filter: string;
    usageCount: number;
    conversionRate: number;
  }[];
  searchPerformance: {
    averageResponseTime: number;
    zeroResultsRate: number;
    refinementRate: number;
  };
  recommendations: {
    type: 'add_filter' | 'improve_search' | 'add_product';
    description: string;
    impact: 'high' | 'medium' | 'low';
  }[];
}
```

---

## WebSocket Events (Real-time Updates)

### Connection
```typescript
// WebSocket connection for real-time updates
const ws = new WebSocket('wss://api.example.com/ws/products');

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}
```

### Event Types

#### product_updated
```typescript
interface ProductUpdatedEvent {
  type: 'product_updated';
  data: {
    productId: string;
    changes: string[];
    updatedProduct: IndustrialProduct;
  };
}
```

#### negotiation_update
```typescript
interface NegotiationUpdateEvent {
  type: 'negotiation_update';
  data: {
    negotiationId: string;
    status: 'active' | 'completed' | 'failed';
    currentOffer?: any;
    agentMessage?: string;
  };
}
```

#### price_change
```typescript
interface PriceChangeEvent {
  type: 'price_change';
  data: {
    productId: string;
    oldPrice: number;
    newPrice: number;
    reason: 'market_update' | 'supplier_update' | 'negotiation';
  };
}
```

---

## Error Handling

### Standard Error Codes
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Common error codes
const ERROR_CODES = {
  // Validation errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_FILTER: 'INVALID_FILTER',
  INVALID_SEARCH_QUERY: 'INVALID_SEARCH_QUERY',
  
  // Resource errors
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  SUPPLIER_NOT_FOUND: 'SUPPLIER_NOT_FOUND',
  NEGOTIATION_NOT_FOUND: 'NEGOTIATION_NOT_FOUND',
  
  // Permission errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SUPPLIER_ONLY: 'SUPPLIER_ONLY',
  
  // Business logic errors
  NEGOTIATION_VARIABLES_INVALID: 'NEGOTIATION_VARIABLES_INVALID',
  PRICING_CALCULATION_FAILED: 'PRICING_CALCULATION_FAILED',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  
  // System errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED'
};
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Product validation failed",
    "details": {
      "field": "specifications.material.grade",
      "issue": "Material grade 'XYZ123' is not recognized",
      "validValues": ["SPCC", "SPCD", "SPCE"]
    }
  },
  "meta": {
    "timestamp": "2024-12-30T10:00:00Z",
    "requestId": "req_123456",
    "version": "1.0"
  }
}
```

---

## Rate Limiting

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
X-RateLimit-Window: 3600
```

### Rate Limits by Endpoint
- **Search endpoints**: 100 requests/minute
- **Product list**: 200 requests/minute  
- **Product detail**: 500 requests/minute
- **Product management**: 50 requests/minute
- **Bulk operations**: 10 requests/minute

---

## Authentication & Authorization

### Bearer Token Format
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Required Scopes
- `products:read` - Read product information
- `products:write` - Create/update products (suppliers only)
- `products:manage` - Full product management (admin)
- `negotiations:create` - Create negotiation requests
- `analytics:read` - Access analytics data

---

*Document Version: 1.0*
*Last Updated: [2024-12-30]*
*API Specification: OpenAPI 3.0*
*Next Review: [2025-01-15]* 