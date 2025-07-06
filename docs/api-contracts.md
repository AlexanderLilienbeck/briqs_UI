# API Contracts: B2B AI Marketplace

## Authentication & Authorization

### POST /api/auth/register
Register a new business user account.

**Request Body:**
```typescript
{
  email: string;
  password: string;
  companyName: string;
  role: 'buyer' | 'supplier' | 'both';
  companySize: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
  industry: string;
  country: string; // ISO 3166-1 alpha-2
}
```

**Response (201):**
```typescript
{
  success: true;
  data: {
    userId: string;
    email: string;
    companyName: string;
    role: string;
    verificationRequired: boolean;
  };
  message: "Registration successful. Please verify your email.";
}
```

### POST /api/auth/login
Authenticate user and receive JWT tokens.

**Request Body:**
```typescript
{
  email: string;
  password: string;
  rememberMe?: boolean;
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      companyName: string;
      role: string;
      verified: boolean;
    };
    expiresIn: number;
  };
}
```

## Request Management

### POST /api/requests
Create a new procurement request.

**Request Body:**
```typescript
{
  title: string;
  description: string;
  voiceTranscript?: string;
  requirements: {
    product: {
      category: string;
      specifications: Record<string, any>;
      quantity: { min: number; max: number; unit: string; };
    };
    commercial: {
      budget: { min: number; max: number; currency: string; };
      delivery: { location: string; timeframe: string; urgency: string; };
      payment: { terms: string; methods: string[]; };
    };
  };
  constraints: {
    maxNegotiationTime: number;
    autoAcceptThreshold?: number;
    dealBreakers: string[];
  };
}
```

**Response (201):**
```typescript
{
  success: true;
  data: {
    requestId: string;
    status: 'pending';
    matchingResults: {
      totalMatches: number;
      topMatches: Array<{
        supplierId: string;
        productId: string;
        matchScore: number;
        estimatedPrice: number;
      }>;
    };
    estimatedNegotiationTime: number;
  };
}
```

### GET /api/requests
List user's procurement requests.

**Query Parameters:**
```typescript
{
  page?: number;
  limit?: number;
  status?: 'pending' | 'matching' | 'negotiating' | 'completed' | 'cancelled';
  category?: string;
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    requests: Array<{
      id: string;
      title: string;
      status: string;
      category: string;
      createdAt: string;
      activeNegotiations: number;
    }>;
    pagination: {
      page: number;
      total: number;
      totalPages: number;
    };
  };
}
```

## Negotiation Management

### POST /api/negotiations
Start negotiation process.

**Request Body:**
```typescript
{
  requestId: string;
  selectedSuppliers: string[];
  negotiationStrategy: 'conservative' | 'balanced' | 'aggressive';
  parameters: {
    maxRounds: number;
    timeoutMinutes: number;
    priorityWeights: {
      price: number;
      delivery: number;
      quality: number;
      terms: number;
    };
  };
}
```

**Response (201):**
```typescript
{
  success: true;
  data: {
    negotiations: Array<{
      negotiationId: string;
      supplierId: string;
      status: 'pending';
      estimatedDuration: number;
      websocketUrl: string;
    }>;
    totalNegotiations: number;
  };
}
```

### GET /api/negotiations/{negotiationId}
Get detailed negotiation information.

**Response (200):**
```typescript
{
  success: true;
  data: {
    id: string;
    requestId: string;
    status: string;
    progress: number;
    currentTerms: {
      price: number;
      currency: string;
      deliveryTime: string;
      paymentTerms: string;
    };
    negotiationHistory: Array<{
      round: number;
      timestamp: string;
      agentType: 'buyer' | 'supplier';
      action: string;
      terms: Record<string, any>;
      reasoning: string;
    }>;
    startedAt: string;
    estimatedCompletion?: string;
  };
}
```

### POST /api/negotiations/{negotiationId}/accept
Accept final negotiated terms.

**Request Body:**
```typescript
{
  finalTerms: Record<string, any>;
  acceptanceNote?: string;
}
```

**Response (200):**
```typescript
{
  success: true;
  data: {
    negotiationId: string;
    contractId: string;
    status: 'accepted';
    contractUrl: string;
    acceptedAt: string;
  };
}
```

## WebSocket Events

### Server-to-Client Events

#### negotiation_update
```typescript
{
  event: 'negotiation_update';
  data: {
    negotiationId: string;
    status: string;
    progress: number;
    currentTerms: Record<string, any>;
    timeRemaining: number;
  };
}
```

#### agent_message
```typescript
{
  event: 'agent_message';
  data: {
    negotiationId: string;
    agentType: 'buyer' | 'supplier';
    message: string;
    reasoning: string;
    timestamp: string;
    round: number;
  };
}
```

#### negotiation_completed
```typescript
{
  event: 'negotiation_completed';
  data: {
    negotiationId: string;
    outcome: 'success' | 'failure' | 'timeout';
    finalTerms?: Record<string, any>;
    contractId?: string;
    completedAt: string;
  };
}
```

## Error Responses

### Standard Error Format
```typescript
{
  success: false;
  error: {
    code: string;
    message: string;
    timestamp: string;
    requestId: string;
  };
}
```

### Common Error Codes
- `AUTH_REQUIRED` - Authentication required
- `AUTH_INVALID` - Invalid authentication token
- `VALIDATION_ERROR` - Request validation failed
- `RESOURCE_NOT_FOUND` - Requested resource not found
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `NEGOTIATION_EXPIRED` - Negotiation has expired
- `SERVICE_UNAVAILABLE` - External service unavailable

---

*Document Version: 1.0*
*Created: [2024-12-30]*
*Status: Ready for Implementation* 