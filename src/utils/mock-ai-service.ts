import type { B2BProduct, BuyerRequest } from "../types/b2b";
import type {
  AgentPersonality,
  GeneratedContract,
  NegotiationOffer,
  NegotiationStrategy,
} from "../types/negotiation";

// Mock AI Response Types
export interface MockAIResponse {
  reasoning: string;
  confidence: number;
  factors: string[];
  decision: "accept" | "counter" | "reject";
  suggestedOffer?: Partial<NegotiationOffer>;
}

export interface MockNegotiationContext {
  agentType: "buyer" | "supplier";
  personality: AgentPersonality;
  currentOffer: NegotiationOffer;
  negotiationHistory: NegotiationOffer[];
  buyerRequest?: BuyerRequest;
  product?: B2BProduct;
  roundNumber: number;
  timeElapsed: number; // minutes
}

// Mock AI Service - Simulates OpenAI/Anthropic API responses
export class MockAIService {
  private static readonly RESPONSE_DELAY_MS = 1500; // Simulate API latency
  private static readonly REASONING_TEMPLATES = {
    buyer: {
      accept: [
        "This offer meets our budget constraints and delivery requirements. The price point is acceptable for the specified quantity.",
        "The supplier's terms align well with our project timeline. Quality specifications match our requirements.",
        "Given the competitive pricing and reasonable delivery schedule, this represents good value for our organization.",
      ],
      counter: [
        "While the offer shows promise, we need better pricing to fit our budget allocation for this procurement.",
        "The delivery timeline needs adjustment to meet our project milestones. Price could also be more competitive.",
        "We're interested but require modifications to payment terms and slight quantity adjustments for operational efficiency.",
      ],
      reject: [
        "The pricing exceeds our budget parameters by a significant margin. Delivery timeline is also too extended.",
        "Quality specifications don't meet our minimum requirements. Price point is not competitive for this market.",
        "Terms are not favorable for our business model. We need more flexible payment and delivery arrangements.",
      ],
    },
    supplier: {
      accept: [
        "This order meets our minimum profitability requirements and aligns with our production capacity.",
        "The quantity and pricing provide good margins while maintaining competitive positioning in the market.",
        "Payment terms are acceptable and the delivery schedule fits our current production planning.",
      ],
      counter: [
        "We need higher pricing to maintain sustainable margins on this order size. Delivery timeline may need adjustment.",
        "The quantity requires some modification to optimize our production efficiency. Price needs slight adjustment.",
        "We can accommodate most terms but need better pricing to cover increased material costs in current market conditions.",
      ],
      reject: [
        "The pricing falls below our minimum profitability threshold. Quantity requirements exceed our current capacity.",
        "Payment terms create cash flow challenges for our operations. Delivery timeline is not operationally feasible.",
        "Order specifications require capabilities we don't currently have. Pricing doesn't justify the operational complexity.",
      ],
    },
  };

  // Simulate AI decision-making for offer evaluation
  static async evaluateOffer(
    context: MockNegotiationContext,
  ): Promise<MockAIResponse> {
    // Simulate API call delay
    await this.delay(this.RESPONSE_DELAY_MS);

    const { agentType, personality } = context;

    // Analyze offer based on agent type and constraints
    const analysis = this.analyzeOffer(context);
    const decision = this.makeDecision(analysis, personality);
    const reasoning = this.generateReasoning(agentType, decision, analysis);

    return {
      reasoning,
      confidence: analysis.confidence,
      factors: analysis.factors,
      decision,
      suggestedOffer:
        decision === "counter"
          ? this.generateCounterOffer(context, analysis)
          : undefined,
    };
  }

  // Simulate AI contract generation
  static async generateContract(
    finalOffer: NegotiationOffer,
    buyerRequest: BuyerRequest,
    product: B2BProduct,
  ): Promise<GeneratedContract> {
    await this.delay(2000); // Longer delay for contract generation

    const totalPrice = finalOffer.pricePerUnit * finalOffer.quantity;
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + finalOffer.deliveryDays);

    // Convert specifications to string only
    const specificationsAsStrings: Record<string, string> = {};
    Object.entries(product.specifications).forEach(([key, value]) => {
      specificationsAsStrings[key] = String(value);
    });

    const legalDocument = `
**COMMERCIAL SUPPLY AGREEMENT**

**Buyer:** ${buyerRequest.title || "Buyer Company"}
**Supplier:** ${product.name} Supplier
**Product:** ${product.name}

**COMMERCIAL TERMS:**
- Unit Price: €${finalOffer.pricePerUnit.toFixed(2)} ${finalOffer.currency}
- Quantity: ${finalOffer.quantity.toLocaleString()} units
- Total Value: €${totalPrice.toLocaleString()}
- Payment Terms: ${finalOffer.paymentTerms}
- Delivery: ${finalOffer.deliveryDays} days from order confirmation

**PRODUCT SPECIFICATIONS:**
${Object.entries(product.specifications)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join("\n")}

**DELIVERY TERMS:**
- Delivery Location: ${buyerRequest.deliveryRequirements?.location?.city || "To be specified"}
- Delivery Terms: ${buyerRequest.deliveryRequirements?.terms || "dap"}
- Lead Time: ${finalOffer.deliveryDays} business days

**QUALITY & COMPLIANCE:**
${product.certifications.map((cert) => `- ${cert}`).join("\n")}

**VALIDITY:**
This agreement is valid for 30 days from generation date.
Generated on: ${new Date().toLocaleDateString()}

**AI NEGOTIATION SUMMARY:**
This contract was automatically negotiated by AI agents representing both parties.
Final terms reflect optimized balance of buyer requirements and supplier constraints.
    `.trim();

    const contract: GeneratedContract = {
      id: `contract_${Date.now()}`,
      negotiationId: finalOffer.negotiationId,
      buyer: {
        id: buyerRequest.buyerId,
        companyName: buyerRequest.title || "Buyer Company",
        contactPerson: "Contact Person",
        address: "Buyer Address",
      },
      supplier: {
        id: product.supplierId,
        companyName: `${product.name} Supplier`,
        contactPerson: "Supplier Contact",
        address: "Supplier Address",
      },
      product: {
        name: product.name,
        description: product.description,
        specifications: specificationsAsStrings,
        quantity: finalOffer.quantity,
        unitPrice: finalOffer.pricePerUnit,
        totalPrice,
        currency: finalOffer.currency,
      },
      terms: {
        price: totalPrice,
        quantity: finalOffer.quantity,
        currency: finalOffer.currency,
        deliveryDate,
        deliveryLocation:
          buyerRequest.deliveryRequirements?.location?.city ||
          "To be specified",
        paymentTerms: finalOffer.paymentTerms,
        deliveryTerms: buyerRequest.deliveryRequirements?.terms || "dap",
        warrantyPeriod: finalOffer.warranty
          ? {
              duration: finalOffer.warranty.duration,
              unit: finalOffer.warranty.unit,
            }
          : undefined,
        penalties: {
          lateDelivery: 0.5, // 0.5% per day
          qualityIssues: "Standard quality remediation terms apply",
        },
        additionalTerms: finalOffer.customTerms
          ? Object.entries(finalOffer.customTerms)
              .map(([key, value]) => `${key}: ${value}`)
              .join("; ")
          : undefined,
        // Additional fields from negotiation
        pricePerUnit: finalOffer.pricePerUnit,
        deliveryDays: finalOffer.deliveryDays,
        warrantyMonths:
          finalOffer.warranty?.unit === "months"
            ? finalOffer.warranty.duration
            : finalOffer.warranty?.unit === "years"
              ? finalOffer.warranty.duration * 12
              : undefined,
      },
      legalDocument,
      status: "pending_approval",
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      approvals: {
        buyerApproval: false,
        supplierApproval: false,
      },
    };

    return contract;
  }

  // Generate realistic negotiation commentary
  static async generateNegotiationCommentary(
    offer: NegotiationOffer,
    agentType: "buyer" | "supplier",
    strategy: NegotiationStrategy,
  ): Promise<string> {
    await this.delay(800);

    const strategyComments = {
      buyer: {
        aggressive:
          "Pushing for maximum cost savings while maintaining quality standards.",
        balanced:
          "Seeking fair terms that provide good value while respecting supplier constraints.",
        price_focused:
          "Prioritizing cost optimization as the primary negotiation objective.",
        time_sensitive:
          "Emphasizing delivery speed to meet critical project timelines.",
        quality_focused:
          "Ensuring premium quality standards are maintained throughout.",
        conservative: "Taking measured approach to minimize procurement risks.",
      },
      supplier: {
        aggressive:
          "Maximizing profit margins while remaining competitive in the market.",
        balanced:
          "Offering fair pricing that ensures sustainable business relationship.",
        price_focused:
          "Optimizing pricing strategy based on current market conditions.",
        time_sensitive:
          "Prioritizing quick order fulfillment to meet customer needs.",
        quality_focused:
          "Emphasizing superior product quality and service standards.",
        conservative:
          "Maintaining stable margins with proven operational capabilities.",
      },
    };

    const baseComment = strategyComments[agentType][strategy];
    const offerDetails = `Current offer: €${offer.pricePerUnit}/unit, ${offer.quantity} units, ${offer.deliveryDays} days delivery.`;

    return `${baseComment} ${offerDetails}`;
  }

  // Private helper methods
  private static async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private static analyzeOffer(context: MockNegotiationContext): OfferAnalysis {
    const { agentType, currentOffer, buyerRequest, product, roundNumber } =
      context;

    if (agentType === "buyer" && buyerRequest) {
      return this.analyzeBuyerOffer(currentOffer, buyerRequest, roundNumber);
    } else if (agentType === "supplier" && product) {
      return this.analyzeSupplierOffer(currentOffer, product, roundNumber);
    }

    // Fallback analysis
    return {
      priceScore: 0.5,
      quantityScore: 0.5,
      deliveryScore: 0.5,
      overallScore: 0.5,
      confidence: 0.3,
      factors: ["Insufficient context for analysis"],
    };
  }

  private static analyzeBuyerOffer(
    offer: NegotiationOffer,
    buyerRequest: BuyerRequest,
    roundNumber: number,
  ): OfferAnalysis {
    // Price analysis
    const maxBudget = buyerRequest.budget.max || 0;
    const totalCost = offer.pricePerUnit * offer.quantity;
    const priceScore = Math.max(
      0,
      Math.min(1, (maxBudget - totalCost) / maxBudget + 0.5),
    );

    // Quantity analysis
    const quantityInRange =
      offer.quantity >= buyerRequest.quantity.min &&
      (!buyerRequest.quantity.max ||
        offer.quantity <= buyerRequest.quantity.max);
    const quantityScore = quantityInRange ? 0.8 : 0.3;

    // Delivery analysis
    const urgencyDays = this.getUrgencyDays(buyerRequest.urgency);
    const deliveryScore = Math.max(
      0,
      Math.min(1, (urgencyDays - offer.deliveryDays) / urgencyDays + 0.5),
    );

    const overallScore = (priceScore + quantityScore + deliveryScore) / 3;

    // Adjust confidence based on round number (more decisive in later rounds)
    const confidence = Math.min(0.95, 0.6 + roundNumber * 0.1);

    const factors = [
      `Budget utilization: ${((totalCost / maxBudget) * 100).toFixed(1)}%`,
      `Quantity ${quantityInRange ? "within" : "outside"} requested range`,
      `Delivery timeline ${offer.deliveryDays <= urgencyDays ? "acceptable" : "too long"}`,
    ];

    return {
      priceScore,
      quantityScore,
      deliveryScore,
      overallScore,
      confidence,
      factors,
    };
  }

  private static analyzeSupplierOffer(
    offer: NegotiationOffer,
    product: B2BProduct,
    roundNumber: number,
  ): OfferAnalysis {
    // Find applicable pricing tier
    const pricingTier = this.findPricingTier(offer.quantity, product);
    const minAcceptablePrice = pricingTier.unitPrice * 0.9; // 10% margin minimum
    const priceScore = Math.max(
      0,
      Math.min(
        1,
        (offer.pricePerUnit - minAcceptablePrice) / pricingTier.unitPrice,
      ),
    );

    // Quantity analysis
    const quantityFeasible =
      offer.quantity >= product.commercialTerms.minimumOrderQuantity;
    const quantityScore = quantityFeasible ? 0.8 : 0.2;

    // Delivery analysis
    const minLeadTime = product.commercialTerms.leadTime.min;
    const deliveryFeasible = offer.deliveryDays >= minLeadTime;
    const deliveryScore = deliveryFeasible ? 0.8 : 0.3;

    const overallScore = (priceScore + quantityScore + deliveryScore) / 3;
    const confidence = Math.min(0.95, 0.7 + roundNumber * 0.08);

    const factors = [
      `Price ${offer.pricePerUnit >= minAcceptablePrice ? "above" : "below"} minimum margin`,
      `Quantity ${quantityFeasible ? "meets" : "below"} minimum order requirement`,
      `Delivery ${deliveryFeasible ? "feasible" : "too fast"} for production schedule`,
    ];

    return {
      priceScore,
      quantityScore,
      deliveryScore,
      overallScore,
      confidence,
      factors,
    };
  }

  private static makeDecision(
    analysis: OfferAnalysis,
    personality: AgentPersonality,
  ): "accept" | "counter" | "reject" {
    const { overallScore } = analysis;

    // Adjust thresholds based on personality
    const acceptThreshold = this.getAcceptThreshold(personality);
    const rejectThreshold = this.getRejectThreshold(personality);

    if (overallScore >= acceptThreshold) return "accept";
    if (overallScore <= rejectThreshold) return "reject";
    return "counter";
  }

  private static getAcceptThreshold(personality: AgentPersonality): number {
    const base = 0.75;

    switch (personality.strategy) {
      case "aggressive":
        return base + 0.1;
      case "conservative":
        return base - 0.1;
      case "time_sensitive":
        return base - 0.15;
      default:
        return base;
    }
  }

  private static getRejectThreshold(personality: AgentPersonality): number {
    const base = 0.3;

    switch (personality.strategy) {
      case "aggressive":
        return base + 0.1;
      case "conservative":
        return base - 0.05;
      case "price_focused":
        return base + 0.15;
      default:
        return base;
    }
  }

  private static generateReasoning(
    agentType: "buyer" | "supplier",
    decision: "accept" | "counter" | "reject",
    analysis: OfferAnalysis,
  ): string {
    const templates = this.REASONING_TEMPLATES[agentType][decision];
    const template = templates[Math.floor(Math.random() * templates.length)];

    // Add analysis-specific details
    const scoreContext =
      analysis.overallScore > 0.7
        ? "strong"
        : analysis.overallScore > 0.4
          ? "moderate"
          : "weak";

    return `${template} Overall assessment shows ${scoreContext} alignment with our requirements.`;
  }

  private static generateCounterOffer(
    context: MockNegotiationContext,
    analysis: OfferAnalysis,
  ): Partial<NegotiationOffer> {
    const { agentType, currentOffer, personality } = context;

    // Calculate adjustments based on analysis and personality
    const priceAdjustment = this.calculatePriceAdjustment(
      analysis.priceScore,
      personality,
      agentType,
    );
    const deliveryAdjustment = this.calculateDeliveryAdjustment(personality);

    return {
      pricePerUnit: Math.max(
        0.1,
        currentOffer.pricePerUnit * (1 + priceAdjustment),
      ),
      deliveryDays: Math.max(
        1,
        Math.round(currentOffer.deliveryDays * (1 + deliveryAdjustment)),
      ),
      quantity: currentOffer.quantity, // Usually keep quantity stable
    };
  }

  private static calculatePriceAdjustment(
    priceScore: number,
    personality: AgentPersonality,
    agentType: "buyer" | "supplier",
  ): number {
    const baseAdjustment = agentType === "buyer" ? -0.05 : 0.05; // Buyers try to reduce, suppliers increase
    const scoreAdjustment = (0.5 - priceScore) * 0.1; // Adjust based on how far from ideal
    const flexibilityAdjustment = personality.priceFlexibility * 0.05;

    return (
      baseAdjustment +
      scoreAdjustment +
      (agentType === "buyer" ? -flexibilityAdjustment : flexibilityAdjustment)
    );
  }

  private static calculateDeliveryAdjustment(
    personality: AgentPersonality,
  ): number {
    if (personality.timeConstraints > 0.7) {
      return -0.1; // Push for faster delivery
    } else if (personality.timeConstraints < 0.3) {
      return 0.1; // Allow slower delivery
    }
    return 0; // No change
  }

  private static findPricingTier(quantity: number, product: B2BProduct) {
    const pricing = product.commercialTerms.pricing;

    for (const tier of pricing) {
      if (
        quantity >= tier.minQuantity &&
        (!tier.maxQuantity || quantity <= tier.maxQuantity)
      ) {
        return tier;
      }
    }

    // Return highest volume tier if quantity exceeds all tiers
    return pricing[pricing.length - 1];
  }

  private static getUrgencyDays(
    urgency: "low" | "medium" | "high" | "urgent",
  ): number {
    const urgencyMap = {
      low: 30,
      medium: 21,
      high: 14,
      urgent: 7,
    };
    return urgencyMap[urgency] || 21;
  }
}

// Helper interface for offer analysis
interface OfferAnalysis {
  priceScore: number;
  quantityScore: number;
  deliveryScore: number;
  overallScore: number;
  confidence: number;
  factors: string[];
}

// Export mock AI service instance
export const mockAI = MockAIService;
