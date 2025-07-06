# Negotiation Flow Implementation Plan

## Branch Name
`feature/negotiation-flow-implementation`

## Background and Motivation

### Current State Analysis
The negotiation page (`./negotiation`) currently exists as a basic placeholder with minimal content. We need to transform this into a complete 5-step user experience that demonstrates the core value proposition of AI-powered negotiations.

### Vision: Complete AI Negotiation Experience
We're implementing a sophisticated user flow that guides users through:
1. **Voice Input** - Natural language product requests with microphone interface
2. **Text Alternative** - Manual text input for users who prefer typing
3. **Requirement Review** - Parsed contract positions with edit capabilities  
4. **AI Negotiation** - Engaging loading screen during agent negotiations
5. **Deal Selection** - List of negotiated deals with approval interface

### Business Value
- **Demonstrates Core Innovation:** Shows AI agents negotiating autonomously
- **User-Friendly Interface:** Voice-first interaction reduces friction
- **Professional UX:** Builds trust through polished, enterprise-grade interface
- **Scalable Foundation:** Establishes patterns for future AI features

## Key Challenges and Analysis

### 1. Voice Interface Integration
**Challenge:** Implementing reliable speech-to-text with professional UI
- **Technical:** Web Speech API integration with fallback options
- **UX:** Pulsing microphone button animation, clear feedback states
- **Accessibility:** Keyboard navigation, screen reader compatibility

**Solution Approach:**
- Reuse existing pulsing button animation from intro page
- Implement Web Speech API with graceful degradation
- Add visual feedback for recording states
- Provide clear text alternative

### 2. Progressive Disclosure Design
**Challenge:** Revealing each step only after previous completion
- **State Management:** Complex UI state across multiple steps
- **Navigation:** Allowing users to go back and edit previous steps
- **Validation:** Ensuring each step is complete before proceeding

**Solution Approach:**
- Use React state management for step progression
- Implement step validation with clear error states
- Add breadcrumb navigation for step overview
- Store intermediate data for back navigation

### 3. Realistic Static Data
**Challenge:** Creating convincing dummy data that demonstrates value
- **Negotiation Results:** Realistic deal variations with different terms
- **AI Behavior:** Convincing negotiation progress simulation
- **Commercial Terms:** Authentic B2B contract language

**Solution Approach:**
- Create diverse product scenarios with varying negotiation outcomes
- Implement realistic timing for negotiation simulation
- Use authentic commercial terms and pricing structures
- Add variety in supplier responses and deal structures

### 4. Consistent Styling Integration
**Challenge:** Maintaining design consistency with existing codebase
- **CSS Architecture:** Following established SCSS patterns
- **Component Patterns:** Reusing existing button and form styles
- **Responsive Design:** Ensuring mobile compatibility

**Solution Approach:**
- Extend existing CSS classes rather than creating new ones
- Follow established component patterns from other pages
- Use existing color palette and typography
- Implement responsive breakpoints consistently

## High-level Task Breakdown

### Phase 1: Foundation & Step 1 (Voice Interface)
**Goal:** Implement voice recording interface with pulsing microphone button

#### Task 1.1: Create Feature Branch & Component Structure
- [ ] Create feature branch `feature/negotiation-flow-implementation`
- [ ] Set up negotiation page component structure
- [ ] Create step-based state management system
- [ ] Add TypeScript interfaces for negotiation flow
- **Success Criteria:** Clean component structure, TypeScript interfaces defined, step navigation working

#### Task 1.2: Voice Recording Interface Implementation
- [ ] Create pulsing microphone button component (reuse intro page animation)
- [ ] Implement Web Speech API integration
- [ ] Add recording state management (idle, recording, processing)
- [ ] Create voice input feedback UI
- **Success Criteria:** Microphone button pulses, voice recording works, clear visual feedback

#### Task 1.3: Standard Terms Checkbox & Controls
- [ ] Add "Apply your standard terms" checkbox (checked by default)
- [ ] Implement "adjust standard terms" link/button
- [ ] Add "continue without voice" button
- [ ] Create "next" button with proper state management
- **Success Criteria:** All controls functional, proper state management, consistent styling

### Phase 2: Step 2 (Text Alternative Interface)
**Goal:** Implement manual text input for users who skip voice

#### Task 2.1: Text Input Interface
- [ ] Create large textarea for manual product request
- [ ] Add instructional text above textarea
- [ ] Implement character count and input validation
- [ ] Add same standard terms checkbox as voice step
- **Success Criteria:** Professional text input interface, validation working, consistent with voice step

#### Task 2.2: Input Processing & Validation
- [ ] Create text parsing logic (simple keyword extraction initially)
- [ ] Add input validation and error handling
- [ ] Implement next button state management
- [ ] Add progress indicators between steps
- **Success Criteria:** Text input processed correctly, validation feedback clear, smooth progression

### Phase 3: Step 3 (Contract Position Review)
**Goal:** Display parsed requirements with edit capabilities

#### Task 3.1: Requirement Display Component
- [ ] Create contract position display component
- [ ] Implement editable fields for each requirement
- [ ] Add "edit" buttons for individual positions
- [ ] Create "let AI Agent negotiate" button
- **Success Criteria:** Requirements displayed clearly, edit functionality working, professional layout

#### Task 3.2: Requirement Management System
- [ ] Implement requirement editing logic
- [ ] Add validation for edited requirements
- [ ] Create requirement categorization (product, price, terms, etc.)
- [ ] Add save/cancel functionality for edits
- **Success Criteria:** Requirements can be edited and saved, validation prevents invalid data

### Phase 4: Step 4 (AI Negotiation Loading)
**Goal:** Engaging loading screen showing negotiation progress

#### Task 4.1: Negotiation Loading Interface
- [ ] Create loading screen with progress indicators
- [ ] Add animated text showing negotiation progress
- [ ] Implement realistic timing simulation (2-3 minutes)
- [ ] Add "negotiating with X suppliers" counter
- **Success Criteria:** Engaging loading screen, realistic timing, professional animation

#### Task 4.2: Progress Simulation Logic
- [ ] Create negotiation progress simulation
- [ ] Add realistic status updates ("Reviewing terms...", "Negotiating price...")
- [ ] Implement supplier response simulation
- [ ] Add progress bar or percentage indicator
- **Success Criteria:** Convincing negotiation simulation, varied status updates, smooth progression

### Phase 5: Step 5 (Deal Approval Interface)
**Goal:** Display negotiated deals with approval options

#### Task 5.1: Deal List Component
- [ ] Create negotiated deals list component
- [ ] Implement "Approve Deal" Yes/No buttons
- [ ] Add "pending: 48h" status indicators
- [ ] Create "show Deal Details" buttons
- **Success Criteria:** Professional deal list, clear approval options, consistent styling

#### Task 5.2: Deal Details & Management
- [ ] Implement deal details modal/expansion
- [ ] Add deal comparison functionality
- [ ] Create approval confirmation flow
- [ ] Add deal status management
- **Success Criteria:** Deal details accessible, comparison possible, approval flow complete

### Phase 6: Integration & Polish
**Goal:** Connect all steps and add professional polish

#### Task 6.1: Step Navigation & State Management
- [ ] Implement step-to-step navigation
- [ ] Add breadcrumb navigation
- [ ] Create back/forward functionality
- [ ] Add data persistence across steps
- **Success Criteria:** Smooth navigation between steps, data preserved, user can go back and edit

#### Task 6.2: Responsive Design & Accessibility
- [ ] Ensure mobile responsiveness for all steps
- [ ] Add keyboard navigation support
- [ ] Implement screen reader accessibility
- [ ] Add loading states and error handling
- **Success Criteria:** Works on mobile, keyboard accessible, screen reader compatible

## Project Status Board

### 🔄 **CURRENT PRIORITY: Negotiation Flow Implementation**
**Status**: Planning Complete - Ready for Implementation

#### Phase 1: Core Implementation ✅
- [x] Set up project structure and types
- [x] Create negotiation page with 5-step flow
- [x] Implement voice recording interface
- [x] Add text input alternative
- [x] Build requirements review interface
- [x] Create AI negotiation loading screen
- [x] Implement deal approval interface
- [x] Add comprehensive CSS styling

#### Phase 2: UI/UX Improvements (Current Focus)
- [ ] Replace emoji microphone with proper icon
- [ ] Implement proper audio recording to .wav file with stop button
- [ ] Fix standard terms checkbox styling and functionality
- [ ] Remove priority badges from contract position review
- [ ] Replace loading screen emojis with professional icons
- [ ] Ensure step progress indicators remain visible

#### Phase 3: Integration & Testing
- [ ] Integrate with backend APIs
- [ ] Add comprehensive error handling
- [ ] Implement data persistence
- [ ] Add mobile responsiveness testing
- [ ] Performance optimization

## Technical Implementation Details

### Component Architecture
```typescript
// Main negotiation flow component
const NegotiationFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [negotiationData, setNegotiationData] = useState<NegotiationData>();
  
  return (
    <div className="negotiation-flow">
      <StepProgress currentStep={currentStep} totalSteps={5} />
      {currentStep === 1 && <VoiceInputStep />}
      {currentStep === 2 && <TextInputStep />}
      {currentStep === 3 && <RequirementReviewStep />}
      {currentStep === 4 && <NegotiationLoadingStep />}
      {currentStep === 5 && <DealApprovalStep />}
    </div>
  );
};
```

### Voice Interface Implementation
```typescript
// Pulsing microphone button (reusing intro page pattern)
const VoiceRecordingButton: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  
  return (
    <motion.button
      className="voice-recording-btn"
      animate={{
        scale: isRecording ? [1, 1.05, 1] : 1,
        boxShadow: isRecording ? [
          '0 0 0 0 rgba(251, 176, 59, 0)',
          '0 0 0 8px rgba(251, 176, 59, 0.3)',
          '0 0 0 0 rgba(251, 176, 59, 0)'
        ] : 'none'
      }}
      transition={{
        duration: 2,
        repeat: isRecording ? Infinity : 0,
        ease: "easeInOut"
      }}
    >
      <i className="icon-microphone" />
    </motion.button>
  );
};
```

### Static Data Structure
```typescript
interface NegotiationDeal {
  id: string;
  supplier: {
    name: string;
    rating: number;
    location: string;
  };
  product: {
    name: string;
    specifications: string[];
  };
  terms: {
    price: number;
    quantity: number;
    deliveryTime: string;
    paymentTerms: string;
    warranty: string;
  };
  status: 'pending' | 'approved' | 'declined';
  expiresIn: string; // "48h"
}

// Dummy data for development
const mockNegotiationResults: NegotiationDeal[] = [
  {
    id: "deal-001",
    supplier: {
      name: "Industrial Steel Solutions GmbH",
      rating: 4.8,
      location: "Hamburg, Germany"
    },
    product: {
      name: "Cold-Rolled Steel Coil SPCC 1.0mm",
      specifications: ["1.0mm thickness", "1250mm width", "SPCC grade"]
    },
    terms: {
      price: 850,
      quantity: 50,
      deliveryTime: "14 days",
      paymentTerms: "Net 30",
      warranty: "12 months"
    },
    status: 'pending',
    expiresIn: "48h"
  }
  // ... more deals
];
```

### CSS Integration Strategy
```scss
// Extend existing CSS patterns
.negotiation-flow {
  // Use existing container and layout patterns
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  // Reuse existing button styles
  .voice-recording-btn {
    @extend .btn;
    @extend .btn--rounded;
    @extend .btn--yellow;
    
    // Add specific voice button styling
    width: 80px;
    height: 80px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .icon-microphone {
      font-size: 24px;
    }
  }
  
  // Follow existing form patterns
  .negotiation-form {
    @extend .b2b-request-form;
    
    .form-section {
      margin-bottom: 30px;
      padding: 25px;
      background: #f8f9fa;
      border-radius: 12px;
    }
  }
}
```

## Executor's Feedback or Assistance Requests

### Ready for Implementation
**Status**: All planning complete, ready to begin implementation

**Next Steps:**
1. Create feature branch
2. Begin with Task 1.1 (Component structure)
3. Implement voice interface first (highest user impact)
4. Progress through phases systematically

**Technical Considerations:**
- Use existing CSS patterns to maintain consistency
- Implement with static data first, API integration later
- Focus on professional, enterprise-grade UI
- Ensure mobile responsiveness from the start

**Dependencies:**
- No external dependencies required
- Can use existing codebase patterns and components
- Web Speech API is browser-native (no additional packages needed)

---
*Last Updated: [2024-12-30] - Complete implementation plan created* 