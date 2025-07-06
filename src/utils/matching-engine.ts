import type {
  B2BProduct,
  BuyerRequest,
  MatchScore,
  ProductMatch,
} from "../types/b2b";

/**
 * Simple matching engine for connecting buyer requests with supplier products
 * This is a basic implementation that will be enhanced with AI in later phases
 */

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class B2BMatchingEngine {
  /**
   * Calculate match score between a buyer request and a supplier product
   */
  static calculateMatchScore(
    request: BuyerRequest,
    product: B2BProduct,
  ): MatchScore {
    let overall = 0;
    const explanations: string[] = [];

    // 1. Category Match (25% weight)
    const categoryScore = this.calculateCategoryScore(request, product);
    overall += categoryScore * 0.25;
    if (categoryScore > 80) {
      explanations.push(`Excellent category match (${categoryScore}%)`);
    } else if (categoryScore > 60) {
      explanations.push(`Good category match (${categoryScore}%)`);
    } else {
      explanations.push(`Limited category match (${categoryScore}%)`);
    }

    // 2. Specifications Match (30% weight)
    const specsScore = this.calculateSpecificationsScore(request, product);
    overall += specsScore * 0.3;
    if (specsScore > 80) {
      explanations.push(`Specifications align well (${specsScore}%)`);
    } else if (specsScore > 60) {
      explanations.push(`Partial specifications match (${specsScore}%)`);
    } else {
      explanations.push(`Limited specifications alignment (${specsScore}%)`);
    }

    // 3. Price Match (25% weight)
    const priceScore = this.calculatePriceScore(request, product);
    overall += priceScore * 0.25;
    if (priceScore > 80) {
      explanations.push(`Price within budget range (${priceScore}%)`);
    } else if (priceScore > 60) {
      explanations.push(`Price slightly above budget (${priceScore}%)`);
    } else {
      explanations.push(`Price significantly above budget (${priceScore}%)`);
    }

    // 4. Delivery Match (20% weight)
    const deliveryScore = this.calculateDeliveryScore(request, product);
    overall += deliveryScore * 0.2;
    if (deliveryScore > 80) {
      explanations.push(
        `Delivery timeline meets requirements (${deliveryScore}%)`,
      );
    } else {
      explanations.push(
        `Delivery timeline may be challenging (${deliveryScore}%)`,
      );
    }

    return {
      overall: Math.round(overall),
      price: Math.round(priceScore),
      specifications: Math.round(specsScore),
      delivery: Math.round(deliveryScore),
      supplier: 85, // Placeholder - would be based on supplier reputation
      explanation: explanations.join(". "),
    };
  }

  /**
   * Find matching products for a buyer request
   */
  static findMatches(
    request: BuyerRequest,
    products: B2BProduct[],
    minScore: number = 50,
  ): ProductMatch[] {
    const matches: ProductMatch[] = [];

    for (const product of products) {
      if (!product.isActive) continue;

      const score = this.calculateMatchScore(request, product);

      if (score.overall >= minScore) {
        const estimatedOutcome = this.estimateNegotiationOutcome(
          request,
          product,
          score,
        );

        matches.push({
          product,
          request,
          score,
          estimatedNegotiationOutcome: estimatedOutcome,
        });
      }
    }

    // Sort by overall score (highest first)
    return matches.sort((a, b) => b.score.overall - a.score.overall);
  }

  // Private helper methods

  private static calculateCategoryScore(
    request: BuyerRequest,
    product: B2BProduct,
  ): number {
    let score = 0;

    // Exact category match
    if (request.category.toLowerCase() === product.category.toLowerCase()) {
      score += 70;
    } else if (
      request.category.toLowerCase().includes(product.category.toLowerCase()) ||
      product.category.toLowerCase().includes(request.category.toLowerCase())
    ) {
      score += 40;
    }

    // Subcategory match
    if (request.subcategory && product.subcategory) {
      if (
        request.subcategory.toLowerCase() === product.subcategory.toLowerCase()
      ) {
        score += 30;
      } else if (
        request.subcategory
          .toLowerCase()
          .includes(product.subcategory.toLowerCase()) ||
        product.subcategory
          .toLowerCase()
          .includes(request.subcategory.toLowerCase())
      ) {
        score += 15;
      }
    }

    return Math.min(score, 100);
  }

  private static calculateSpecificationsScore(
    request: BuyerRequest,
    product: B2BProduct,
  ): number {
    const requestSpecs = request.specifications;
    const productSpecs = product.specifications;

    if (!requestSpecs || Object.keys(requestSpecs).length === 0) {
      return 70; // Default score if no specific requirements
    }

    let totalSpecs = 0;
    let matchingSpecs = 0;

    for (const [key, value] of Object.entries(requestSpecs)) {
      totalSpecs++;

      // Check if product has this specification
      const productValue = productSpecs[key];
      if (productValue) {
        // Simple string/number matching (would be enhanced with AI)
        if (
          String(value)
            .toLowerCase()
            .includes(String(productValue).toLowerCase()) ||
          String(productValue)
            .toLowerCase()
            .includes(String(value).toLowerCase())
        ) {
          matchingSpecs++;
        }
      }
    }

    // Also check keyword matching
    const requestKeywords = this.extractKeywords(
      request.description + " " + request.title,
    );
    const productKeywords = product.keywords;

    let keywordMatches = 0;
    for (const keyword of requestKeywords) {
      if (
        productKeywords.some((pk) =>
          pk.toLowerCase().includes(keyword.toLowerCase()),
        )
      ) {
        keywordMatches++;
      }
    }

    const specScore = totalSpecs > 0 ? (matchingSpecs / totalSpecs) * 100 : 70;
    const keywordScore = Math.min(keywordMatches * 10, 30); // Max 30 points from keywords

    return Math.min(specScore + keywordScore, 100);
  }

  private static calculatePriceScore(
    request: BuyerRequest,
    product: B2BProduct,
  ): number {
    if (!request.budget.max) {
      return 70; // Default if no budget specified
    }

    const requestQuantity = request.quantity.min;
    const pricing = product.commercialTerms.pricing;

    // Find applicable price tier
    let unitPrice = pricing[pricing.length - 1].unitPrice; // Default to highest tier
    for (const tier of pricing) {
      if (
        requestQuantity >= tier.minQuantity &&
        (!tier.maxQuantity || requestQuantity <= tier.maxQuantity)
      ) {
        unitPrice = tier.unitPrice;
        break;
      }
    }

    const totalCost = unitPrice * requestQuantity;
    const budgetMax = request.budget.max;

    if (totalCost <= budgetMax) {
      // Within budget - score based on how much budget is left
      const budgetUtilization = totalCost / budgetMax;
      return Math.max(100 - budgetUtilization * 20, 80); // 80-100 range
    } else {
      // Over budget - score based on how much over
      const overBudget = (totalCost - budgetMax) / budgetMax;
      if (overBudget <= 0.1) return 70; // 10% over
      if (overBudget <= 0.2) return 50; // 20% over
      if (overBudget <= 0.3) return 30; // 30% over
      return 10; // More than 30% over
    }
  }

  private static calculateDeliveryScore(
    request: BuyerRequest,
    product: B2BProduct,
  ): number {
    const requestDeadline = request.deliveryRequirements.deadline;
    const leadTime = product.commercialTerms.leadTime;

    // Convert lead time to days
    let leadTimeDays = leadTime.max;
    if (leadTime.unit === "weeks") {
      leadTimeDays *= 7;
    } else if (leadTime.unit === "months") {
      leadTimeDays *= 30;
    }

    const today = new Date();
    const availableDays = Math.ceil(
      (requestDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (leadTimeDays <= availableDays) {
      // Can deliver on time
      const bufferTime = availableDays - leadTimeDays;
      return Math.min(80 + (bufferTime / availableDays) * 20, 100);
    } else {
      // Cannot deliver on time
      const daysLate = leadTimeDays - availableDays;
      const latenessPenalty = (daysLate / availableDays) * 100;
      return Math.max(80 - latenessPenalty, 0);
    }
  }

  public static estimateNegotiationOutcome(
    request: BuyerRequest,
    product: B2BProduct,
    score: MatchScore,
  ) {
    const pricing = product.commercialTerms.pricing;
    const requestQuantity = request.quantity.min;

    // Find base price
    let basePrice = pricing[pricing.length - 1].unitPrice;
    for (const tier of pricing) {
      if (
        requestQuantity >= tier.minQuantity &&
        (!tier.maxQuantity || requestQuantity <= tier.maxQuantity)
      ) {
        basePrice = tier.unitPrice;
        break;
      }
    }

    // Estimate negotiation range based on flexibility
    const priceFlexibility =
      product.negotiationBoundaries.priceFlexibility / 100;
    const minPrice = basePrice * (1 - priceFlexibility);
    const maxPrice = basePrice;

    // Estimate delivery range
    const leadTime = product.commercialTerms.leadTime;
    const deliveryFlexibility =
      product.negotiationBoundaries.deliveryFlexibility;

    let baseDays = leadTime.min;
    if (leadTime.unit === "weeks") baseDays *= 7;
    else if (leadTime.unit === "months") baseDays *= 30;

    const today = new Date();
    const minDelivery = new Date(
      today.getTime() + baseDays * 24 * 60 * 60 * 1000,
    );
    const maxDelivery = new Date(
      today.getTime() + (baseDays + deliveryFlexibility) * 24 * 60 * 60 * 1000,
    );

    // Success probability based on overall match score
    const successProbability = Math.min((score.overall / 100) * 0.9, 0.95);

    return {
      priceRange: {
        min: Math.round(minPrice * 100) / 100,
        max: Math.round(maxPrice * 100) / 100,
      },
      deliveryRange: {
        min: minDelivery,
        max: maxDelivery,
      },
      successProbability,
    };
  }

  private static extractKeywords(text: string): string[] {
    // Simple keyword extraction (would be enhanced with NLP)
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter(
        (word) =>
          ![
            "with",
            "from",
            "that",
            "this",
            "they",
            "have",
            "will",
            "been",
            "were",
          ].includes(word),
      )
      .slice(0, 10); // Take first 10 relevant words
  }
}

// Utility functions for testing
export const testMatching = (request: BuyerRequest, products: B2BProduct[]) => {
  console.log("🔍 Testing B2B Matching Engine");
  console.log("Request:", request.title);
  console.log("Products to match:", products.length);

  const matches = B2BMatchingEngine.findMatches(request, products, 40);

  console.log(`\n📊 Found ${matches.length} matches:`);
  matches.forEach((match, index) => {
    console.log(`\n${index + 1}. ${match.product.name}`);
    console.log(
      `   Score: ${match.score.overall}% (Price: ${match.score.price}%, Specs: ${match.score.specifications}%, Delivery: ${match.score.delivery}%)`,
    );
    console.log(
      `   Estimated Price Range: €${match.estimatedNegotiationOutcome.priceRange.min} - €${match.estimatedNegotiationOutcome.priceRange.max}`,
    );
    console.log(
      `   Success Probability: ${Math.round(match.estimatedNegotiationOutcome.successProbability * 100)}%`,
    );
    console.log(`   Explanation: ${match.score.explanation}`);
  });

  return matches;
};
