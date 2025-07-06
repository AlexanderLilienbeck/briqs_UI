import { v4 as uuidv4 } from "uuid";

import type { B2BProduct, BuyerRequest } from "../types/b2b";
import type {
  AgentConstraints,
  AgentPersonality,
  DecisionContext,
  DecisionResult,
  NegotiationAgent,
  NegotiationEvent,
  NegotiationOffer,
  NegotiationRound,
  NegotiationSession,
  NegotiationStrategy,
} from "../types/negotiation";

// Base AI Agent Implementation
export abstract class BaseNegotiationAgent implements NegotiationAgent {
  public id: string;
  public type: "buyer" | "supplier";
  public personality: AgentPersonality;
  public constraints: AgentConstraints;

  constructor(
    type: "buyer" | "supplier",
    personality: AgentPersonality,
    constraints: AgentConstraints,
  ) {
    this.id = uuidv4();
    this.type = type;
    this.personality = personality;
    this.constraints = constraints;
  }

  // Abstract methods that must be implemented by subclasses
  abstract generateInitialOffer(context: DecisionContext): NegotiationOffer;
  abstract evaluateOffer(
    offer: NegotiationOffer,
    context: DecisionContext,
  ): DecisionResult;
  abstract generateCounterOffer(
    incomingOffer: NegotiationOffer,
    _context: DecisionContext,
  ): NegotiationOffer;

  // Common utility methods
  updateStrategy(negotiationHistory: NegotiationRound[]): void {
    // Analyze negotiation history and adjust strategy
    if (negotiationHistory.length > 3) {
      const recentRounds = negotiationHistory.slice(-3);
      const convergenceRate = this.calculateConvergenceRate(recentRounds);

      if (convergenceRate < 0.1) {
        // Low convergence - become more flexible
        this.personality.priceFlexibility = Math.min(
          this.personality.priceFlexibility + 0.1,
          1.0,
        );
      }
    }
  }

  calculateWalkAwayPoint(context: DecisionContext): number {
    const baseValue = this.assessDealValue(context.currentOffer);
    const timeMultiplier = context.timeRemaining
      ? Math.max(0.5, context.timeRemaining / 60)
      : 1.0;
    const alternativeMultiplier = context.alternativeOptions
      ? Math.max(0.7, 1 - context.alternativeOptions * 0.1)
      : 1.0;

    return baseValue * timeMultiplier * alternativeMultiplier;
  }

  assessDealValue(offer: NegotiationOffer): number {
    // Basic deal value assessment - can be overridden by subclasses
    const priceScore =
      this.type === "buyer"
        ? 1 - offer.pricePerUnit / 1000
        : offer.pricePerUnit / 1000;
    const quantityScore = offer.quantity / 10000;
    const deliveryScore = 1 - offer.deliveryDays / 30;

    return (priceScore + quantityScore + deliveryScore) / 3;
  }

  protected calculateConvergenceRate(rounds: NegotiationRound[]): number {
    if (rounds.length < 2) return 0;

    const firstRound = rounds[0];
    const lastRound = rounds[rounds.length - 1];

    if (
      !firstRound.buyerOffer ||
      !firstRound.supplierOffer ||
      !lastRound.buyerOffer ||
      !lastRound.supplierOffer
    ) {
      return 0;
    }

    const initialDiff = Math.abs(
      firstRound.buyerOffer.pricePerUnit -
        firstRound.supplierOffer.pricePerUnit,
    );
    const currentDiff = Math.abs(
      lastRound.buyerOffer.pricePerUnit - lastRound.supplierOffer.pricePerUnit,
    );

    return initialDiff > 0 ? (initialDiff - currentDiff) / initialDiff : 1;
  }

  protected generateReasoningText(
    action: string,
    offer: NegotiationOffer,
    factors: string[],
  ): string {
    const strategyContext = `Following ${this.personality.strategy} strategy`;
    const factorsList = factors.join(", ");
    return `${strategyContext}: ${action} based on ${factorsList}. Price: €${offer.pricePerUnit}, Quantity: ${offer.quantity}, Delivery: ${offer.deliveryDays} days.`;
  }
}

// Buyer Agent Implementation
export class BuyerAgent extends BaseNegotiationAgent {
  constructor(
    personality: AgentPersonality,
    constraints: AgentConstraints,
    private buyerRequest: BuyerRequest,
  ) {
    super("buyer", personality, constraints);
  }

  generateInitialOffer(context: DecisionContext): NegotiationOffer {
    const targetPrice = this.calculateTargetPrice();
    const targetQuantity =
      this.buyerRequest.quantity.max || this.buyerRequest.quantity.min;
    const targetDelivery = this.calculateTargetDelivery();

    const offer: NegotiationOffer = {
      id: uuidv4(),
      negotiationId: context.currentOffer?.negotiationId || "",
      agentId: this.id,
      agentType: "buyer",
      roundNumber: 1,
      timestamp: new Date(),
      pricePerUnit: targetPrice,
      currency: this.buyerRequest.budget.currency,
      quantity: targetQuantity,
      deliveryDays: targetDelivery,
      paymentTerms: this.buyerRequest.paymentPreferences.terms,
      reasoning: this.generateReasoningText(
        "Initial offer",
        {
          pricePerUnit: targetPrice,
          quantity: targetQuantity,
          deliveryDays: targetDelivery,
        } as NegotiationOffer,
        ["budget constraints", "quantity requirements", "delivery needs"],
      ),
      confidence: 0.8,
      isCounterOffer: false,
    };

    return offer;
  }

  evaluateOffer(
    offer: NegotiationOffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: DecisionContext,
  ): DecisionResult {
    const priceAcceptable = this.isPriceAcceptable(offer.pricePerUnit);
    const quantityAcceptable = this.isQuantityAcceptable(offer.quantity);
    const deliveryAcceptable = this.isDeliveryAcceptable(offer.deliveryDays);

    if (priceAcceptable && quantityAcceptable && deliveryAcceptable) {
      return {
        action: "accept",
        reasoning: "Offer meets all requirements within acceptable ranges",
        confidence: 0.9,
      };
    }

    if (this.isOfferImprovable(offer)) {
      return {
        action: "counter",
        reasoning: "Offer has potential but needs adjustment in price or terms",
        confidence: 0.7,
      };
    }

    return {
      action: "reject",
      reasoning: "Offer exceeds budget constraints or unacceptable terms",
      confidence: 0.8,
    };
  }

  generateCounterOffer(
    incomingOffer: NegotiationOffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: DecisionContext,
  ): NegotiationOffer {
    const adjustedPrice = this.calculateCounterPrice(
      incomingOffer.pricePerUnit,
    );
    const adjustedQuantity = this.calculateCounterQuantity(
      incomingOffer.quantity,
    );
    const adjustedDelivery = this.calculateCounterDelivery(
      incomingOffer.deliveryDays,
    );

    return {
      id: uuidv4(),
      negotiationId: incomingOffer.negotiationId,
      agentId: this.id,
      agentType: "buyer",
      roundNumber: incomingOffer.roundNumber + 1,
      timestamp: new Date(),
      pricePerUnit: adjustedPrice,
      currency: incomingOffer.currency,
      quantity: adjustedQuantity,
      deliveryDays: adjustedDelivery,
      paymentTerms: this.buyerRequest.paymentPreferences.terms,
      reasoning: this.generateReasoningText(
        "Counter offer",
        {
          pricePerUnit: adjustedPrice,
          quantity: adjustedQuantity,
          deliveryDays: adjustedDelivery,
        } as NegotiationOffer,
        ["price optimization", "quantity adjustment", "delivery requirements"],
      ),
      confidence: 0.75,
      isCounterOffer: true,
      previousOfferId: incomingOffer.id,
    };
  }

  private calculateTargetPrice(): number {
    const maxBudget = this.buyerRequest.budget.max || 0;
    const quantity =
      this.buyerRequest.quantity.max || this.buyerRequest.quantity.min;
    const maxPricePerUnit = maxBudget / quantity;

    // Start with aggressive pricing based on strategy
    switch (this.personality.strategy) {
      case "aggressive":
        return maxPricePerUnit * 0.7;
      case "price_focused":
        return maxPricePerUnit * 0.6;
      case "time_sensitive":
        return maxPricePerUnit * 0.9;
      default:
        return maxPricePerUnit * 0.8;
    }
  }

  private calculateTargetDelivery(): number {
    const urgencyMap: Record<string, number> = {
      low: 30,
      medium: 21,
      high: 14,
      critical: 7,
      urgent: 7,
    };
    return urgencyMap[this.buyerRequest.urgency] || 21;
  }

  private isPriceAcceptable(pricePerUnit: number): boolean {
    const maxBudget = this.buyerRequest.budget.max || 0;
    const maxPricePerUnit = maxBudget / this.buyerRequest.quantity.min;
    return pricePerUnit <= maxPricePerUnit;
  }

  private isQuantityAcceptable(quantity: number): boolean {
    const maxQuantity =
      this.buyerRequest.quantity.max || Number.MAX_SAFE_INTEGER;
    return (
      quantity >= this.buyerRequest.quantity.min && quantity <= maxQuantity
    );
  }

  private isDeliveryAcceptable(deliveryDays: number): boolean {
    const maxDeliveryDays = this.calculateTargetDelivery() + 7; // Some flexibility
    return deliveryDays <= maxDeliveryDays;
  }

  private isOfferImprovable(offer: NegotiationOffer): boolean {
    if (!this.buyerRequest?.budget?.max || !this.buyerRequest?.quantity?.min) {
      return false;
    }
    const priceMargin =
      this.buyerRequest.budget.max / this.buyerRequest.quantity.min;
    const priceGap = offer.pricePerUnit - priceMargin;
    return priceGap > 0 && priceGap < priceMargin * 0.3; // Within 30% of acceptable range
  }

  private calculateCounterPrice(incomingPrice: number): number {
    const targetPrice = this.calculateTargetPrice();
    const flexibility = this.personality.priceFlexibility;

    // Move towards supplier's price but maintain negotiation position
    return targetPrice + (incomingPrice - targetPrice) * flexibility * 0.5;
  }

  private calculateCounterQuantity(incomingQuantity: number): number {
    // Prefer higher quantities for better unit prices
    return Math.max(incomingQuantity, this.buyerRequest.quantity.min);
  }

  private calculateCounterDelivery(incomingDelivery: number): number {
    const targetDelivery = this.calculateTargetDelivery();
    return Math.min(incomingDelivery, targetDelivery + 3); // Small flexibility
  }
}

// Supplier Agent Implementation
export class SupplierAgent extends BaseNegotiationAgent {
  constructor(
    personality: AgentPersonality,
    constraints: AgentConstraints,
    private product: B2BProduct,
  ) {
    super("supplier", personality, constraints);
  }

  generateInitialOffer(context: DecisionContext): NegotiationOffer {
    const targetPrice = this.calculateTargetPrice();
    const targetQuantity = this.calculateTargetQuantity();
    const targetDelivery = this.calculateTargetDelivery();

    return {
      id: uuidv4(),
      negotiationId: context.currentOffer?.negotiationId || "",
      agentId: this.id,
      agentType: "supplier",
      roundNumber: 1,
      timestamp: new Date(),
      pricePerUnit: targetPrice,
      currency: this.product.commercialTerms.currency,
      quantity: targetQuantity,
      deliveryDays: targetDelivery,
      paymentTerms: this.product.commercialTerms.paymentTerms,
      reasoning: this.generateReasoningText(
        "Initial offer",
        {
          pricePerUnit: targetPrice,
          quantity: targetQuantity,
          deliveryDays: targetDelivery,
        } as NegotiationOffer,
        ["market pricing", "production capacity", "delivery logistics"],
      ),
      confidence: 0.85,
      isCounterOffer: false,
    };
  }

  evaluateOffer(
    offer: NegotiationOffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: DecisionContext,
  ): DecisionResult {
    const priceAcceptable = this.isPriceAcceptable(
      offer.pricePerUnit,
      offer.quantity,
    );
    const quantityFeasible = this.isQuantityFeasible(offer.quantity);
    const deliveryFeasible = this.isDeliveryFeasible(offer.deliveryDays);

    if (priceAcceptable && quantityFeasible && deliveryFeasible) {
      return {
        action: "accept",
        reasoning: "Offer meets profitability and operational requirements",
        confidence: 0.9,
      };
    }

    if (this.canImproveOffer(offer)) {
      return {
        action: "counter",
        reasoning:
          "Offer needs adjustment for profitability or operational feasibility",
        confidence: 0.75,
      };
    }

    return {
      action: "reject",
      reasoning:
        "Offer below minimum profitability threshold or operationally infeasible",
      confidence: 0.85,
    };
  }

  generateCounterOffer(
    incomingOffer: NegotiationOffer,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context: DecisionContext,
  ): NegotiationOffer {
    const adjustedPrice = this.calculateCounterPrice(
      incomingOffer.pricePerUnit,
      incomingOffer.quantity,
    );
    const adjustedQuantity = this.calculateCounterQuantity(
      incomingOffer.quantity,
    );
    const adjustedDelivery = this.calculateCounterDelivery(
      incomingOffer.deliveryDays,
    );

    return {
      id: uuidv4(),
      negotiationId: incomingOffer.negotiationId,
      agentId: this.id,
      agentType: "supplier",
      roundNumber: incomingOffer.roundNumber + 1,
      timestamp: new Date(),
      pricePerUnit: adjustedPrice,
      currency: this.product.commercialTerms.currency,
      quantity: adjustedQuantity,
      deliveryDays: adjustedDelivery,
      paymentTerms: this.product.commercialTerms.paymentTerms,
      reasoning: this.generateReasoningText(
        "Counter offer",
        {
          pricePerUnit: adjustedPrice,
          quantity: adjustedQuantity,
          deliveryDays: adjustedDelivery,
        } as NegotiationOffer,
        [
          "profitability requirements",
          "production constraints",
          "delivery optimization",
        ],
      ),
      confidence: 0.8,
      isCounterOffer: true,
      previousOfferId: incomingOffer.id,
    };
  }

  private calculateTargetPrice(): number {
    // Get the highest tier price as starting point
    const pricing = this.product.commercialTerms.pricing;
    const highestTierPrice = pricing[0].unitPrice;

    // Adjust based on strategy
    switch (this.personality.strategy) {
      case "aggressive":
        return highestTierPrice * 1.2;
      case "price_focused":
        return highestTierPrice * 1.15;
      case "time_sensitive":
        return highestTierPrice * 0.95;
      default:
        return highestTierPrice * 1.1;
    }
  }

  private calculateTargetQuantity(): number {
    return this.product.commercialTerms.minimumOrderQuantity;
  }

  private calculateTargetDelivery(): number {
    const leadTime = this.product.commercialTerms.leadTime;
    const baseDelivery = leadTime.max;

    // Adjust based on strategy
    switch (this.personality.strategy) {
      case "time_sensitive":
        return Math.max(leadTime.min, baseDelivery - 3);
      case "conservative":
        return baseDelivery + 2;
      default:
        return baseDelivery;
    }
  }

  private isPriceAcceptable(pricePerUnit: number, quantity: number): boolean {
    const applicableTier = this.findPricingTier(quantity);
    const minimumPrice = applicableTier.unitPrice * 0.9; // 10% margin minimum
    return pricePerUnit >= minimumPrice;
  }

  private isQuantityFeasible(quantity: number): boolean {
    return quantity >= this.product.commercialTerms.minimumOrderQuantity;
  }

  private isDeliveryFeasible(deliveryDays: number): boolean {
    return deliveryDays >= this.product.commercialTerms.leadTime.min;
  }

  private canImproveOffer(offer: NegotiationOffer): boolean {
    const applicableTier = this.findPricingTier(offer.quantity);
    const breakEvenPrice = applicableTier.unitPrice * 0.85; // 15% margin minimum
    return offer.pricePerUnit >= breakEvenPrice;
  }

  private calculateCounterPrice(
    incomingPrice: number,
    quantity: number,
  ): number {
    const targetPrice = this.calculateTargetPrice();
    const applicableTier = this.findPricingTier(quantity);
    const minimumPrice = applicableTier.unitPrice * 0.95; // 5% margin minimum

    const flexibility = this.personality.priceFlexibility;
    const adjustedPrice =
      targetPrice - (targetPrice - incomingPrice) * flexibility * 0.6;

    return Math.max(adjustedPrice, minimumPrice);
  }

  private calculateCounterQuantity(incomingQuantity: number): number {
    // Encourage larger quantities for better margins
    const minQuantity = this.product.commercialTerms.minimumOrderQuantity;
    return Math.max(incomingQuantity, minQuantity);
  }

  private calculateCounterDelivery(incomingDelivery: number): number {
    const minDelivery = this.product.commercialTerms.leadTime.min;
    const maxDelivery = this.product.commercialTerms.leadTime.max;

    // Try to meet buyer's timeline while maintaining operational feasibility
    return Math.max(minDelivery, Math.min(incomingDelivery + 2, maxDelivery));
  }

  private findPricingTier(quantity: number) {
    const pricing = this.product.commercialTerms.pricing;

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
}

// Negotiation Engine - Orchestrates the negotiation process
export class NegotiationEngine {
  private activeSessions: Map<string, NegotiationSession> = new Map();
  private eventListeners: ((event: NegotiationEvent) => void)[] = [];

  // Start a new negotiation session
  startNegotiation(
    buyerRequest: BuyerRequest,
    product: B2BProduct,
    buyerStrategy: NegotiationStrategy = "balanced",
    maxDuration: number = 30, // minutes
  ): NegotiationSession {
    const sessionId = uuidv4();

    // Create agents with appropriate personalities
    const buyerPersonality = this.createBuyerPersonality(buyerStrategy);
    const supplierPersonality = this.createSupplierPersonality(product);

    const buyerConstraints = this.createBuyerConstraints(buyerRequest);
    const supplierConstraints = this.createSupplierConstraints(product);

    const buyerAgent = new BuyerAgent(
      buyerPersonality,
      buyerConstraints,
      buyerRequest,
    );
    const supplierAgent = new SupplierAgent(
      supplierPersonality,
      supplierConstraints,
      product,
    );

    const session: NegotiationSession = {
      id: sessionId,
      buyerRequestId: buyerRequest.id,
      productId: product.id,
      supplierId: product.supplierId,
      buyerAgent: {
        id: buyerAgent.id,
        personality: buyerPersonality,
        constraints: buyerConstraints,
      },
      supplierAgent: {
        id: supplierAgent.id,
        personality: supplierPersonality,
        constraints: supplierConstraints,
      },
      status: "initializing",
      currentPhase: "initial_offer",
      currentRound: 1,
      rounds: [],
      startTime: new Date(),
      lastActivity: new Date(),
      maxDuration,
      agreementReached: false,
      priority: buyerRequest.urgency === "urgent" ? "urgent" : "medium",
    };

    this.activeSessions.set(sessionId, session);
    this.emitEvent({
      id: uuidv4(),
      negotiationId: sessionId,
      type: "session_started",
      timestamp: new Date(),
      message: `Negotiation started between ${buyerAgent.id} and ${supplierAgent.id}`,
    });

    return session;
  }

  // Get session by ID
  getSession(sessionId: string): NegotiationSession | undefined {
    return this.activeSessions.get(sessionId);
  }

  // Add event listener for real-time updates
  addEventListener(listener: (event: NegotiationEvent) => void): void {
    this.eventListeners.push(listener);
  }

  // Remove event listener
  removeEventListener(listener: (event: NegotiationEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  private createBuyerPersonality(
    strategy: NegotiationStrategy,
  ): AgentPersonality {
    const basePersonality: AgentPersonality = {
      strategy,
      priceFlexibility: 0.3,
      timeConstraints: 0.5,
      qualityFocus: 0.7,
      relationshipFocus: 0.6,
      riskTolerance: 0.4,
    };

    // Adjust based on strategy
    switch (strategy) {
      case "aggressive":
        return {
          ...basePersonality,
          priceFlexibility: 0.1,
          timeConstraints: 0.8,
        };
      case "price_focused":
        return { ...basePersonality, priceFlexibility: 0.2, qualityFocus: 0.4 };
      case "time_sensitive":
        return {
          ...basePersonality,
          priceFlexibility: 0.6,
          timeConstraints: 0.9,
        };
      case "quality_focused":
        return { ...basePersonality, qualityFocus: 0.9, priceFlexibility: 0.5 };
      default:
        return basePersonality;
    }
  }

  private createSupplierPersonality(product: B2BProduct): AgentPersonality {
    // Determine strategy based on product characteristics
    const hasHighFlexibility =
      product.negotiationBoundaries.priceFlexibility > 10;
    const strategy: NegotiationStrategy = hasHighFlexibility
      ? "balanced"
      : "conservative";

    return {
      strategy,
      priceFlexibility: product.negotiationBoundaries.priceFlexibility / 100,
      timeConstraints: 0.4,
      qualityFocus: 0.8,
      relationshipFocus: 0.7,
      riskTolerance: 0.3,
    };
  }

  private createBuyerConstraints(buyerRequest: BuyerRequest): AgentConstraints {
    const maxPrice =
      buyerRequest.budget?.max && buyerRequest.quantity?.min
        ? buyerRequest.budget.max / buyerRequest.quantity.min
        : 1000; // Default fallback price

    return {
      maxPrice,
      minQuantity: buyerRequest.quantity?.min || 1,
      maxQuantity: buyerRequest.quantity?.max || 1000,
      maxDeliveryTime: 30, // days
      requiredPaymentTerms: [
        buyerRequest.paymentPreferences?.terms || "net_30",
      ],
    };
  }

  private createSupplierConstraints(product: B2BProduct): AgentConstraints {
    const lowestTierPrice =
      product.commercialTerms.pricing[
        product.commercialTerms.pricing.length - 1
      ];

    return {
      minPrice: lowestTierPrice.unitPrice * 0.9,
      minQuantity: product.commercialTerms.minimumOrderQuantity,
      maxDeliveryTime: product.commercialTerms.leadTime.max,
      requiredPaymentTerms: [product.commercialTerms.paymentTerms],
    };
  }

  private emitEvent(event: NegotiationEvent): void {
    this.eventListeners.forEach((listener) => listener(event));
  }
}

// Export singleton instance
export const negotiationEngine = new NegotiationEngine();
