# Technical Specification: B2B AI Marketplace

## System Architecture Overview

The B2B AI Marketplace is built as a modern web application with microservices architecture, supporting real-time AI-powered negotiations between buyers and suppliers.

### High-Level Architecture
```
Frontend (Next.js) ↔ Backend API (Node.js) ↔ AI Services (Python)
       ↓                     ↓                      ↓
   CDN/Assets          Database Layer        External APIs
                      (PostgreSQL/Redis)    (OpenAI/Speech)
```

### Technology Stack

#### Frontend Layer
- **Framework:** Next.js 15.0.3 with React 18.3.1
- **Language:** TypeScript 5.7.2
- **State Management:** Redux Toolkit with persistence
- **Styling:** SCSS with CSS Modules
- **Real-time Communication:** WebSocket client
- **Voice Processing:** Web Speech API with fallbacks
- **Testing:** Jest + React Testing Library

#### Backend Layer
- **Runtime:** Node.js 18+ with Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL 15+ with Prisma ORM
- **Cache:** Redis 7+ for sessions and real-time data
- **Authentication:** JWT with refresh tokens
- **WebSocket:** Socket.io for real-time updates
- **Queue System:** Bull Queue with Redis
- **Testing:** Jest + Supertest

#### AI Services Layer
- **Runtime:** Python 3.11+ with FastAPI
- **AI/ML:** OpenAI GPT-4, Anthropic Claude
- **NLP Processing:** spaCy, transformers
- **Queue System:** Celery with Redis broker
- **Testing:** pytest + httpx

## Database Schema Design

### Core Entity Relationships
```
Users (1:N) → Products
Users (1:N) → Requests
Requests (1:N) → Negotiations
Negotiations (1:1) → Contracts
```

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_size company_size_enum,
    industry VARCHAR(100),
    country VARCHAR(2),
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('buyer', 'supplier', 'both');
CREATE TYPE company_size_enum AS ENUM ('startup', 'small', 'medium', 'large', 'enterprise');
```

### Products Table
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    specifications JSONB,
    base_price DECIMAL(12,2),
    currency VARCHAR(3) DEFAULT 'EUR',
    minimum_quantity INTEGER DEFAULT 1,
    lead_time_days INTEGER,
    status product_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Requests Table
```sql
CREATE TABLE requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    voice_transcript TEXT,
    parsed_requirements JSONB NOT NULL,
    commercial_terms JSONB NOT NULL,
    constraints JSONB,
    status request_status DEFAULT 'pending',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Negotiations Table
```sql
CREATE TABLE negotiations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES requests(id),
    buyer_id UUID NOT NULL REFERENCES users(id),
    supplier_id UUID NOT NULL REFERENCES users(id),
    product_id UUID NOT NULL REFERENCES products(id),
    buyer_agent_id VARCHAR(100) NOT NULL,
    supplier_agent_id VARCHAR(100) NOT NULL,
    status negotiation_status DEFAULT 'pending',
    current_terms JSONB,
    final_terms JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```

## API Design Specification

### Authentication System

#### JWT Token Structure
```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  companyName: string;
  permissions: string[];
  iat: number;
  exp: number;
}
```

### REST API Endpoints

#### Request Management
```typescript
// POST /api/requests - Create new procurement request
interface CreateRequestBody {
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
      payment: { terms: string; method: string[]; };
    };
  };
  constraints: {
    maxNegotiationTime: number;
    autoAcceptThreshold?: number;
    dealBreakers: string[];
  };
}

// GET /api/requests - List user's requests
// GET /api/requests/{id} - Get specific request
// PUT /api/requests/{id} - Update request
// DELETE /api/requests/{id} - Cancel request
```

#### Negotiation Management
```typescript
// POST /api/negotiations - Start negotiation
interface StartNegotiationBody {
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

// GET /api/negotiations - List negotiations
// GET /api/negotiations/{id} - Get negotiation details
// GET /api/negotiations/{id}/events - Get negotiation history
// POST /api/negotiations/{id}/accept - Accept final terms
// POST /api/negotiations/{id}/reject - Reject final terms
```

### WebSocket API

#### Real-time Events
```typescript
interface ServerToClientEvents {
  negotiation_update: (data: {
    negotiationId: string;
    status: NegotiationStatus;
    currentTerms: CommercialTerms;
    progress: number;
  }) => void;
  
  agent_message: (data: {
    negotiationId: string;
    agentType: 'buyer' | 'supplier';
    message: string;
    timestamp: string;
    reasoning?: string;
  }) => void;
  
  negotiation_completed: (data: {
    negotiationId: string;
    finalTerms: CommercialTerms;
    outcome: 'success' | 'failure' | 'timeout';
    contractId?: string;
  }) => void;
}
```

## AI Agent Architecture

### Agent System Design

#### Negotiation Agent Interface
```typescript
interface NegotiationAgent {
  id: string;
  type: 'buyer' | 'supplier';
  strategy: AgentStrategy;
  constraints: NegotiationConstraints;
  state: AgentState;
  personality: AgentPersonality;
}

interface AgentStrategy {
  concessionRate: number; // 0-1
  riskTolerance: number; // 0-1
  cooperativeness: number; // 0-1
  patience: number; // minutes
}
```

#### Negotiation Engine
```python
class NegotiationEngine:
    def __init__(self, buyer_agent: Agent, supplier_agent: Agent):
        self.buyer_agent = buyer_agent
        self.supplier_agent = supplier_agent
        self.negotiation_state = NegotiationState()
        self.llm_client = LLMClient()
    
    async def negotiate_round(self) -> NegotiationRound:
        """Execute one round of negotiation between agents"""
        buyer_offer = await self.buyer_agent.generate_offer(self.negotiation_state)
        supplier_offer = await self.supplier_agent.generate_offer(self.negotiation_state)
        compromise = await self.evaluate_compromise(buyer_offer, supplier_offer)
        
        self.negotiation_state.add_round(buyer_offer, supplier_offer, compromise)
        
        return NegotiationRound(
            buyer_offer=buyer_offer,
            supplier_offer=supplier_offer,
            compromise=compromise,
            status=self.negotiation_state.status
        )
```

### Voice Processing System

#### Speech-to-Text Integration
```typescript
class VoiceProcessor {
  private speechRecognition: SpeechRecognition;
  private fallbackSTT: ExternalSTTService;
  
  async processVoiceRequest(audioBlob: Blob): Promise<ProcessedRequest> {
    try {
      const transcript = await this.transcribeWithWebAPI(audioBlob);
      const parsedRequest = await this.parseNaturalLanguage(transcript);
      
      return {
        transcript,
        parsedRequest,
        confidence: this.calculateConfidence(transcript, parsedRequest)
      };
    } catch (error) {
      return this.fallbackSTT.process(audioBlob);
    }
  }
}
```

## Security & Compliance

### Authentication & Authorization
- **Multi-Factor Authentication:** TOTP-based 2FA for business accounts
- **Session Management:** JWT tokens with 15-minute expiry + refresh tokens
- **Rate Limiting:** Per-user and per-IP API rate limits
- **Password Security:** Minimum 12 characters with complexity requirements

### Data Protection
- **Encryption:** AES-256 at rest, TLS 1.3 in transit
- **GDPR Compliance:** Data minimization, right to deletion
- **Audit Logging:** Complete negotiation and decision audit trails
- **Access Control:** Role-based permissions with least privilege

## Performance & Scalability

### Performance Targets
- **Page Load Time:** <2 seconds initial load
- **API Response Time:** <500ms for standard endpoints
- **WebSocket Latency:** <100ms for real-time updates
- **Negotiation Processing:** <30 minutes average completion

### Scalability Architecture
- **Horizontal Scaling:** Stateless API servers with load balancing
- **Database Optimization:** Read replicas, connection pooling
- **Caching Strategy:** Redis for sessions, CDN for static assets
- **Background Processing:** Queue-based AI operations
- **Monitoring:** Real-time performance and error tracking

### Infrastructure Requirements
- **Concurrent Users:** Support 1000+ simultaneous users
- **Concurrent Negotiations:** Handle 10000+ active negotiations
- **Data Storage:** PostgreSQL with automated backups
- **Cache Layer:** Redis cluster for high availability
- **CDN:** Global content delivery for optimal performance

---

*Document Version: 1.0*
*Created: [2024-12-30]*
*Last Updated: [2024-12-30]*
*Status: Technical Review Required* 