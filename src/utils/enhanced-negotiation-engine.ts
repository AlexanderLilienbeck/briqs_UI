import { v4 as uuidv4 } from "uuid";

import type { B2BProduct, BuyerRequest } from "../types/b2b";
import type {
  GeneratedContract,
  NegotiationEvent,
  NegotiationOffer,
  NegotiationRound,
  NegotiationSession,
  NegotiationStrategy,
} from "../types/negotiation";
import { mockAI, type MockNegotiationContext } from "./mock-ai-service";
import { BuyerAgent, SupplierAgent } from "./negotiation-engine";

// Enhanced negotiation result
export interface NegotiationResult {
  success: boolean;
  finalContract?: GeneratedContract;
  finalOffer?: NegotiationOffer;
  rounds: NegotiationRound[];
  totalDuration: number; // minutes
  reason: string;
  metrics: NegotiationMetrics;
}

export interface NegotiationMetrics {
  totalRounds: number;
  priceMovement: {
    initialBuyerOffer: number;
    initialSupplierOffer: number;
    finalPrice: number;
    buyerSavings: number; // percentage
    supplierMargin: number; // percentage
  };
  timeToAgreement: number; // minutes
  convergenceRate: number; // how quickly they reached agreement
  satisfactionScores: {
    buyer: number; // 0-1
    supplier: number; // 0-1
  };
}

// Enhanced negotiation engine with AI integration
export class EnhancedNegotiationEngine {
  private activeSessions: Map<string, NegotiationSession> = new Map();
  private eventListeners: ((event: NegotiationEvent) => void)[] = [];
  private readonly MAX_ROUNDS = 8;
  private readonly MAX_DURATION_MINUTES = 30;

  // Start automated negotiation with AI agents
  async startAutomatedNegotiation(
    buyerRequest: BuyerRequest,
    product: B2BProduct,
    buyerStrategy: NegotiationStrategy = "balanced",
    supplierStrategy?: NegotiationStrategy,
  ): Promise<NegotiationResult> {
    const sessionId = uuidv4();
    const startTime = Date.now();

    // Create session
    const session = this.createNegotiationSession(
      sessionId,
      buyerRequest,
      product,
      buyerStrategy,
      supplierStrategy,
    );

    this.activeSessions.set(sessionId, session);
    this.emitEvent({
      id: uuidv4(),
      negotiationId: sessionId,
      type: "session_started",
      timestamp: new Date(),
      message: `AI negotiation started: ${buyerRequest.title} with ${product.name}`,
    });

    try {
      // Run the negotiation
      const result = await this.runNegotiationLoop(
        session,
        buyerRequest,
        product,
      );

      // Calculate final metrics
      const endTime = Date.now();
      const totalDuration = (endTime - startTime) / (1000 * 60); // minutes

      result.totalDuration = totalDuration;
      result.metrics = this.calculateMetrics(result);

      // Generate contract if successful
      if (result.success && result.finalOffer) {
        result.finalContract = await mockAI.generateContract(
          result.finalOffer,
          buyerRequest,
          product,
        );
      }

      this.emitEvent({
        id: uuidv4(),
        negotiationId: sessionId,
        type: result.success ? "negotiation_completed" : "negotiation_failed",
        timestamp: new Date(),
        message: result.reason,
      });

      return result;
    } finally {
      this.activeSessions.delete(sessionId);
    }
  }

  // Run a complete negotiation loop
  private async runNegotiationLoop(
    session: NegotiationSession,
    buyerRequest: BuyerRequest,
    product: B2BProduct,
  ): Promise<NegotiationResult> {
    const rounds: NegotiationRound[] = [];
    let currentRound = 1;
    let lastSupplierOffer: NegotiationOffer | null = null;

    // Create agents
    const buyerAgent = new BuyerAgent(
      session.buyerAgent.personality,
      session.buyerAgent.constraints,
      buyerRequest,
    );
    const supplierAgent = new SupplierAgent(
      session.supplierAgent.personality,
      session.supplierAgent.constraints,
      product,
    );

    while (currentRound <= this.MAX_ROUNDS) {
      this.emitEvent({
        id: uuidv4(),
        negotiationId: session.id,
        type: "offer_made",
        timestamp: new Date(),
        message: `Round ${currentRound} started`,
      });

      // Buyer's turn
      const buyerOffer = await this.generateBuyerOffer(
        buyerAgent,
        lastSupplierOffer,
        rounds,
        currentRound,
      );

      // Supplier evaluates buyer's offer
      const supplierDecision = await this.evaluateOffer(
        "supplier",
        buyerOffer,
        session.supplierAgent.personality,
        rounds,
        product,
        buyerRequest,
        currentRound,
      );

      if (supplierDecision.decision === "accept") {
        // Negotiation successful!
        const round: NegotiationRound = {
          roundNumber: currentRound,
          buyerOffer,
          supplierOffer: undefined,
          startTime: new Date(),
          endTime: new Date(),
          status: "completed",
          convergenceScore: 1.0,
        };
        rounds.push(round);

        return {
          success: true,
          finalOffer: buyerOffer,
          rounds,
          totalDuration: 0, // Will be set by caller
          reason: `Agreement reached in round ${currentRound}. ${supplierDecision.reasoning}`,
          metrics: {} as NegotiationMetrics, // Will be calculated by caller
        };
      }

      if (supplierDecision.decision === "reject") {
        const round: NegotiationRound = {
          roundNumber: currentRound,
          buyerOffer,
          supplierOffer: undefined,
          startTime: new Date(),
          endTime: new Date(),
          status: "failed",
          convergenceScore: 0.0,
        };
        rounds.push(round);

        return {
          success: false,
          rounds,
          totalDuration: 0,
          reason: `Negotiation failed in round ${currentRound}. ${supplierDecision.reasoning}`,
          metrics: {} as NegotiationMetrics,
        };
      }

      // Supplier makes counter-offer
      const supplierOffer = await this.generateSupplierCounterOffer(
        supplierAgent,
        buyerOffer,
        supplierDecision,
        rounds,
        currentRound,
      );

      lastSupplierOffer = supplierOffer;

      // Buyer evaluates supplier's counter-offer
      const buyerDecision = await this.evaluateOffer(
        "buyer",
        supplierOffer,
        session.buyerAgent.personality,
        rounds,
        product,
        buyerRequest,
        currentRound,
      );

      // Record the round
      const round: NegotiationRound = {
        roundNumber: currentRound,
        buyerOffer,
        supplierOffer,
        startTime: new Date(),
        endTime: new Date(),
        status: "completed",
        convergenceScore: this.calculateConvergenceScore(
          buyerOffer,
          supplierOffer,
        ),
      };
      rounds.push(round);

      if (buyerDecision.decision === "accept") {
        return {
          success: true,
          finalOffer: supplierOffer,
          rounds,
          totalDuration: 0,
          reason: `Agreement reached in round ${currentRound}. ${buyerDecision.reasoning}`,
          metrics: {} as NegotiationMetrics,
        };
      }

      if (buyerDecision.decision === "reject") {
        return {
          success: false,
          rounds,
          totalDuration: 0,
          reason: `Negotiation failed in round ${currentRound}. ${buyerDecision.reasoning}`,
          metrics: {} as NegotiationMetrics,
        };
      }

      // Continue to next round
      currentRound++;

      // Update session
      session.currentRound = currentRound;
      session.rounds = rounds;
      session.lastActivity = new Date();

      // Small delay between rounds for realism
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Max rounds reached
    return {
      success: false,
      rounds,
      totalDuration: 0,
      reason: `Negotiation failed: Maximum rounds (${this.MAX_ROUNDS}) reached without agreement`,
      metrics: {} as NegotiationMetrics,
    };
  }

  // Calculate convergence score between two offers
  private calculateConvergenceScore(
    buyerOffer: NegotiationOffer,
    supplierOffer: NegotiationOffer,
  ): number {
    const priceDiff =
      Math.abs(buyerOffer.pricePerUnit - supplierOffer.pricePerUnit) /
      Math.max(buyerOffer.pricePerUnit, supplierOffer.pricePerUnit);
    const quantityDiff =
      Math.abs(buyerOffer.quantity - supplierOffer.quantity) /
      Math.max(buyerOffer.quantity, supplierOffer.quantity);
    const deliveryDiff =
      Math.abs(buyerOffer.deliveryDays - supplierOffer.deliveryDays) /
      Math.max(buyerOffer.deliveryDays, supplierOffer.deliveryDays);

    const avgDiff = (priceDiff + quantityDiff + deliveryDiff) / 3;
    return Math.max(0, 1 - avgDiff);
  }

  // Generate buyer offer using AI
  private async generateBuyerOffer(
    buyerAgent: BuyerAgent,
    lastSupplierOffer: NegotiationOffer | null,
    rounds: NegotiationRound[],
    roundNumber: number,
  ): Promise<NegotiationOffer> {
    if (roundNumber === 1) {
      // Initial offer
      return buyerAgent.generateInitialOffer({
        currentOffer: lastSupplierOffer || ({} as NegotiationOffer),
        previousOffers: [],
        timeRemaining: this.MAX_DURATION_MINUTES,
        alternativeOptions: 2, // Assume some alternatives
      });
    } else {
      // Counter-offer based on supplier's last offer
      return buyerAgent.generateCounterOffer(lastSupplierOffer!, {
        currentOffer: lastSupplierOffer!,
        previousOffers: rounds
          .map((r) => r.supplierOffer)
          .filter(Boolean) as NegotiationOffer[],
        timeRemaining: this.MAX_DURATION_MINUTES - roundNumber * 2,
        alternativeOptions: Math.max(0, 2 - roundNumber),
      });
    }
  }

  // Generate supplier counter-offer
  private async generateSupplierCounterOffer(
    supplierAgent: SupplierAgent,
    buyerOffer: NegotiationOffer,
    supplierDecision: any,
    rounds: NegotiationRound[],
    roundNumber: number,
  ): Promise<NegotiationOffer> {
    // Use AI suggestion if available, otherwise use agent logic
    if (supplierDecision.suggestedOffer) {
      const baseOffer = supplierAgent.generateCounterOffer(buyerOffer, {
        currentOffer: buyerOffer,
        previousOffers: rounds
          .map((r) => r.buyerOffer)
          .filter(Boolean) as NegotiationOffer[],
        timeRemaining: this.MAX_DURATION_MINUTES - roundNumber * 2,
        alternativeOptions: 1,
      });

      // Merge AI suggestions with agent logic
      return {
        ...baseOffer,
        pricePerUnit:
          supplierDecision.suggestedOffer.pricePerUnit ||
          baseOffer.pricePerUnit,
        quantity:
          supplierDecision.suggestedOffer.quantity || baseOffer.quantity,
        deliveryDays:
          supplierDecision.suggestedOffer.deliveryDays ||
          baseOffer.deliveryDays,
        reasoning: supplierDecision.reasoning,
      };
    }

    return supplierAgent.generateCounterOffer(buyerOffer, {
      currentOffer: buyerOffer,
      previousOffers: rounds
        .map((r) => r.buyerOffer)
        .filter(Boolean) as NegotiationOffer[],
      timeRemaining: this.MAX_DURATION_MINUTES - roundNumber * 2,
      alternativeOptions: 1,
    });
  }

  // Evaluate offer using AI
  private async evaluateOffer(
    agentType: "buyer" | "supplier",
    offer: NegotiationOffer,
    personality: any,
    rounds: NegotiationRound[],
    product: B2BProduct,
    buyerRequest: BuyerRequest,
    roundNumber: number,
  ) {
    const context: MockNegotiationContext = {
      agentType,
      personality,
      currentOffer: offer,
      negotiationHistory: rounds.map((r) => r.buyerOffer!).filter(Boolean),
      buyerRequest: agentType === "buyer" ? buyerRequest : undefined,
      product: agentType === "supplier" ? product : undefined,
      roundNumber,
      timeElapsed: roundNumber * 2, // Approximate time
    };

    return await mockAI.evaluateOffer(context);
  }

  // Calculate negotiation metrics
  private calculateMetrics(result: NegotiationResult): NegotiationMetrics {
    const rounds = result.rounds;
    const firstRound = rounds[0];
    const finalOffer = result.finalOffer;

    if (!firstRound || !finalOffer) {
      return {
        totalRounds: rounds.length,
        priceMovement: {
          initialBuyerOffer: 0,
          initialSupplierOffer: 0,
          finalPrice: 0,
          buyerSavings: 0,
          supplierMargin: 0,
        },
        timeToAgreement: result.totalDuration,
        convergenceRate: 0,
        satisfactionScores: { buyer: 0, supplier: 0 },
      };
    }

    const initialBuyerPrice = firstRound.buyerOffer?.pricePerUnit || 0;
    const initialSupplierPrice =
      firstRound.supplierOffer?.pricePerUnit || finalOffer.pricePerUnit;
    const finalPrice = finalOffer.pricePerUnit;

    return {
      totalRounds: rounds.length,
      priceMovement: {
        initialBuyerOffer: initialBuyerPrice,
        initialSupplierOffer: initialSupplierPrice,
        finalPrice,
        buyerSavings:
          initialSupplierPrice > 0
            ? ((initialSupplierPrice - finalPrice) / initialSupplierPrice) * 100
            : 0,
        supplierMargin:
          initialBuyerPrice > 0
            ? ((finalPrice - initialBuyerPrice) / initialBuyerPrice) * 100
            : 0,
      },
      timeToAgreement: result.totalDuration,
      convergenceRate: rounds.length > 0 ? 1 / rounds.length : 0,
      satisfactionScores: {
        buyer: result.success ? 0.8 : 0.2,
        supplier: result.success ? 0.8 : 0.2,
      },
    };
  }

  // Create negotiation session (reusing logic from base engine)
  private createNegotiationSession(
    sessionId: string,
    buyerRequest: BuyerRequest,
    product: B2BProduct,
    buyerStrategy: NegotiationStrategy,
    supplierStrategy?: NegotiationStrategy,
  ): NegotiationSession {
    // Create personalities
    const buyerPersonality = this.createBuyerPersonality(buyerStrategy);
    const supplierPersonality = this.createSupplierPersonality(
      product,
      supplierStrategy,
    );

    // Create constraints
    const buyerConstraints = {
      maxPrice: (buyerRequest.budget.max || 0) / buyerRequest.quantity.min,
      minQuantity: buyerRequest.quantity.min,
      maxQuantity: buyerRequest.quantity.max || Number.MAX_SAFE_INTEGER,
      maxDeliveryTime: 30,
      requiredPaymentTerms: [buyerRequest.paymentPreferences.terms],
    };

    const supplierConstraints = {
      minPrice:
        product.commercialTerms.pricing[
          product.commercialTerms.pricing.length - 1
        ].unitPrice * 0.9,
      minQuantity: product.commercialTerms.minimumOrderQuantity,
      maxDeliveryTime: product.commercialTerms.leadTime.max,
      requiredPaymentTerms: [product.commercialTerms.paymentTerms],
    };

    return {
      id: sessionId,
      buyerRequestId: buyerRequest.id,
      productId: product.id,
      supplierId: product.supplierId,
      buyerAgent: {
        id: uuidv4(),
        personality: buyerPersonality,
        constraints: buyerConstraints,
      },
      supplierAgent: {
        id: uuidv4(),
        personality: supplierPersonality,
        constraints: supplierConstraints,
      },
      status: "active",
      currentPhase: "initial_offer",
      currentRound: 1,
      rounds: [],
      startTime: new Date(),
      lastActivity: new Date(),
      maxDuration: this.MAX_DURATION_MINUTES,
      agreementReached: false,
      priority: buyerRequest.urgency === "urgent" ? "urgent" : "medium",
    };
  }

  // Helper methods for personality creation
  private createBuyerPersonality(strategy: NegotiationStrategy) {
    const basePersonality = {
      strategy,
      priceFlexibility: 0.3,
      timeConstraints: 0.5,
      qualityFocus: 0.7,
      relationshipFocus: 0.6,
      riskTolerance: 0.4,
    };

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

  private createSupplierPersonality(
    product: B2BProduct,
    strategy?: NegotiationStrategy,
  ) {
    const hasHighFlexibility =
      product.negotiationBoundaries.priceFlexibility > 10;
    const defaultStrategy: NegotiationStrategy = hasHighFlexibility
      ? "balanced"
      : "conservative";

    return {
      strategy: strategy || defaultStrategy,
      priceFlexibility: product.negotiationBoundaries.priceFlexibility / 100,
      timeConstraints: 0.4,
      qualityFocus: 0.8,
      relationshipFocus: 0.7,
      riskTolerance: 0.3,
    };
  }

  // Event system
  addEventListener(listener: (event: NegotiationEvent) => void): void {
    this.eventListeners.push(listener);
  }

  removeEventListener(listener: (event: NegotiationEvent) => void): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  private emitEvent(event: NegotiationEvent): void {
    this.eventListeners.forEach((listener) => listener(event));
  }
}

// Export enhanced engine instance
export const enhancedNegotiationEngine = new EnhancedNegotiationEngine();
