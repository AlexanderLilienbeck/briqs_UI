import React, { useCallback, useState } from "react";

import type { B2BProduct, DeliveryTerms, PaymentTerms } from "../../types/b2b";
import { getAllCategories, getSubcategoriesForCategory } from "../../utils/data/industrial-categories";

interface SupplierProductFormProps {
  onProductSubmit?: (
    product: Omit<B2BProduct, "id" | "createdAt" | "updatedAt">,
  ) => void;
  onCancel?: () => void;
  className?: string;
}

interface FormData {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  sku: string;
  images: string[];
  specifications: Record<string, string>;
  certifications: string[];
  // Commercial Terms
  pricingTiers: Array<{
    minQuantity: number;
    maxQuantity?: number;
    unitPrice: number;
  }>;
  paymentTerms: PaymentTerms[];
  customPaymentTerms: string;
  deliveryTerms: DeliveryTerms[];
  customDeliveryTerms: string;
  leadTimeMin: number;
  leadTimeMax: number;
  leadTimeUnit: "days" | "weeks" | "months";
  minimumOrderQuantity: number;
  currency: string;
  includesVAT: boolean;
  warrantyDuration: number;
  warrantyUnit: "months" | "years";
  // Negotiation Boundaries
  priceFlexibility: number;
  quantityFlexibility: number;
  deliveryFlexibility: number;
  paymentTermsFlexible: boolean;
  keywords: string[];
}

const initialFormData: FormData = {
  name: "",
  description: "",
  category: "",
  subcategory: "",
  sku: "",
  images: [],
  specifications: {},
  certifications: [],
  pricingTiers: [{ minQuantity: 1, unitPrice: 0 }],
  paymentTerms: ["net_30"],
  customPaymentTerms: "",
  deliveryTerms: ["ex_works"],
  customDeliveryTerms: "",
  leadTimeMin: 1,
  leadTimeMax: 7,
  leadTimeUnit: "days",
  minimumOrderQuantity: 1,
  currency: "EUR",
  includesVAT: true,
  warrantyDuration: 12,
  warrantyUnit: "months",
  priceFlexibility: 5,
  quantityFlexibility: 10,
  deliveryFlexibility: 3,
  paymentTermsFlexible: true,
  keywords: [],
};

const categories = getAllCategories();

const paymentTermsOptions: PaymentTerms[] = [
  "immediate",
  "net_7",
  "net_14",
  "net_30",
  "net_60",
  "net_90",
  "custom",
];

const deliveryTermsOptions: DeliveryTerms[] = [
  "ex_works",
  "fob",
  "cif",
  "dap",
  "ddp",
  "custom",
];

const SupplierProductForm: React.FC<SupplierProductFormProps> = ({
  onProductSubmit,
  onCancel,
  className = "",
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentSpec, setCurrentSpec] = useState({ key: "", value: "" });
  const [currentCertification, setCurrentCertification] = useState("");
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.sku.trim()) newErrors.sku = "SKU is required";
    if (formData.pricingTiers.length === 0)
      newErrors.pricing = "At least one pricing tier is required";
    if (formData.minimumOrderQuantity < 1)
      newErrors.moq = "Minimum order quantity must be at least 1";
    if (formData.leadTimeMin < 1)
      newErrors.leadTime = "Lead time must be at least 1";
    if (formData.leadTimeMax < formData.leadTimeMin)
      newErrors.leadTimeMax = "Max lead time must be >= min lead time";

    // Validate pricing tiers
    formData.pricingTiers.forEach((tier, index) => {
      if (tier.minQuantity < 1) {
        newErrors[`tier_${index}_min`] = "Minimum quantity must be at least 1";
      }
      if (tier.unitPrice <= 0) {
        newErrors[`tier_${index}_price`] = "Unit price must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const productData: Omit<B2BProduct, "id" | "createdAt" | "updatedAt"> =
          {
            supplierId: "current_supplier_id", // Would come from auth context
            name: formData.name,
            description: formData.description,
            category: formData.category,
            subcategory: formData.subcategory || undefined,
            sku: formData.sku,
            images: formData.images,
            specifications: formData.specifications,
            certifications: formData.certifications,
            commercialTerms: {
              pricing: formData.pricingTiers.map((tier) => ({
                ...tier,
                currency: formData.currency,
              })),
              paymentTerms: formData.paymentTerms[0], // Use first selected term
              customPaymentTerms: formData.customPaymentTerms || undefined,
              deliveryTerms: formData.deliveryTerms[0], // Use first selected term
              customDeliveryTerms: formData.customDeliveryTerms || undefined,
              leadTime: {
                min: formData.leadTimeMin,
                max: formData.leadTimeMax,
                unit: formData.leadTimeUnit,
              },
              minimumOrderQuantity: formData.minimumOrderQuantity,
              validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
              currency: formData.currency,
              includesVAT: formData.includesVAT,
              warrantyPeriod: {
                duration: formData.warrantyDuration,
                unit: formData.warrantyUnit,
              },
            },
            negotiationBoundaries: {
              priceFlexibility: formData.priceFlexibility,
              quantityFlexibility: formData.quantityFlexibility,
              deliveryFlexibility: formData.deliveryFlexibility,
              paymentTermsFlexible: formData.paymentTermsFlexible,
            },
            keywords: formData.keywords,
            isActive: true,
          };

        onProductSubmit?.(productData);

        // Reset form
        setFormData(initialFormData);
        alert("Product submitted successfully!");
      } catch (error) {
        console.error("Error submitting product:", error);
        alert("Error submitting product. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, onProductSubmit],
  );

  // Add specification
  const addSpecification = useCallback(() => {
    if (currentSpec.key.trim() && currentSpec.value.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [currentSpec.key.trim()]: currentSpec.value.trim(),
        },
      }));
      setCurrentSpec({ key: "", value: "" });
    }
  }, [currentSpec]);

  // Remove specification
  const removeSpecification = useCallback((key: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  }, []);

  // Add certification
  const addCertification = useCallback(() => {
    if (
      currentCertification.trim() &&
      !formData.certifications.includes(currentCertification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, currentCertification.trim()],
      }));
      setCurrentCertification("");
    }
  }, [currentCertification, formData.certifications]);

  // Remove certification
  const removeCertification = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  }, []);

  // Add keyword
  const addKeyword = useCallback(() => {
    if (
      currentKeyword.trim() &&
      !formData.keywords.includes(currentKeyword.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...prev.keywords, currentKeyword.trim()],
      }));
      setCurrentKeyword("");
    }
  }, [currentKeyword, formData.keywords]);

  // Remove keyword
  const removeKeyword = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }));
  }, []);

  // Add pricing tier
  const addPricingTier = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: [...prev.pricingTiers, { minQuantity: 1, unitPrice: 0 }],
    }));
  }, []);

  // Remove pricing tier
  const removePricingTier = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      pricingTiers: prev.pricingTiers.filter((_, i) => i !== index),
    }));
  }, []);

  // Update pricing tier
  const updatePricingTier = useCallback(
    (index: number, field: string, value: number | undefined) => {
      setFormData((prev) => ({
        ...prev,
        pricingTiers: prev.pricingTiers.map((tier, i) =>
          i === index ? { ...tier, [field]: value } : tier,
        ),
      }));
    },
    [],
  );

  return (
    <div className={`supplier-product-form ${className}`}>
      <div className="form-header">
        <h2>📦 Add New Product</h2>
        <p>
          List your product on the B2B marketplace with detailed specifications
          and commercial terms
        </p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>📋 Basic Information</h3>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="product-name">Product Name *</label>
              <input
                id="product-name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Industrial Grade Stainless Steel Bolts"
                className={errors.name ? "error" : ""}
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sku">SKU *</label>
              <input
                id="sku"
                type="text"
                value={formData.sku}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sku: e.target.value }))
                }
                placeholder="e.g., SSB-M12-80-316L"
                className={errors.sku ? "error" : ""}
              />
              {errors.sku && (
                <span className="error-message">{errors.sku}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detailed product description including key features and benefits..."
              rows={4}
              className={errors.description ? "error" : ""}
            />
            {errors.description && (
              <span className="error-message">{errors.description}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => {
                  setFormData((prev) => ({ 
                    ...prev, 
                    category: e.target.value,
                    subcategory: "" // Reset subcategory when category changes
                  }));
                }}
                className={errors.category ? "error" : ""}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <span className="error-message">{errors.category}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="subcategory">Subcategory</label>
              <select
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subcategory: e.target.value,
                  }))
                }
                disabled={!formData.category}
              >
                <option value="">Select subcategory</option>
                {formData.category && getSubcategoriesForCategory(formData.category).map((subcat) => (
                  <option key={subcat} value={subcat}>
                    {subcat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="form-section">
          <h3>🔧 Specifications</h3>

          <div className="spec-input">
            <input
              type="text"
              value={currentSpec.key}
              onChange={(e) =>
                setCurrentSpec((prev) => ({ ...prev, key: e.target.value }))
              }
              placeholder="Specification name (e.g., Material)"
            />
            <input
              type="text"
              value={currentSpec.value}
              onChange={(e) =>
                setCurrentSpec((prev) => ({ ...prev, value: e.target.value }))
              }
              placeholder="Specification value (e.g., 316L Stainless Steel)"
            />
            <button type="button" onClick={addSpecification}>
              Add
            </button>
          </div>

          <div className="spec-list">
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="spec-item">
                <span>
                  <strong>{key}:</strong> {value}
                </span>
                <button type="button" onClick={() => removeSpecification(key)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="form-section">
          <h3>🏆 Certifications</h3>

          <div className="cert-input">
            <input
              type="text"
              value={currentCertification}
              onChange={(e) => setCurrentCertification(e.target.value)}
              placeholder="e.g., ISO 9001:2015, CE Marking"
            />
            <button type="button" onClick={addCertification}>
              Add
            </button>
          </div>

          <div className="cert-list">
            {formData.certifications.map((cert, index) => (
              <div key={index} className="cert-item">
                <span>{cert}</span>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="form-section">
          <h3>💰 Pricing Tiers</h3>

          {formData.pricingTiers.map((tier, index) => (
            <div key={index} className="pricing-tier">
              <div className="tier-inputs">
                <div className="form-group">
                  <label>Min Quantity</label>
                  <input
                    type="number"
                    value={tier.minQuantity}
                    onChange={(e) =>
                      updatePricingTier(
                        index,
                        "minQuantity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    min="1"
                    className={errors[`tier_${index}_min`] ? "error" : ""}
                  />
                  {errors[`tier_${index}_min`] && (
                    <span className="error-message">
                      {errors[`tier_${index}_min`]}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label>Max Quantity (optional)</label>
                  <input
                    type="number"
                    value={tier.maxQuantity || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      const numValue =
                        value === "" ? undefined : parseInt(value) || undefined;
                      updatePricingTier(index, "maxQuantity", numValue);
                    }}
                    min={tier.minQuantity}
                  />
                </div>

                <div className="form-group">
                  <label>Unit Price ({formData.currency})</label>
                  <input
                    type="number"
                    step="0.01"
                    value={tier.unitPrice}
                    onChange={(e) =>
                      updatePricingTier(
                        index,
                        "unitPrice",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    min="0"
                    className={errors[`tier_${index}_price`] ? "error" : ""}
                  />
                  {errors[`tier_${index}_price`] && (
                    <span className="error-message">
                      {errors[`tier_${index}_price`]}
                    </span>
                  )}
                </div>

                {formData.pricingTiers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePricingTier(index)}
                    className="remove-tier"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}

          <button type="button" onClick={addPricingTier} className="add-tier">
            + Add Pricing Tier
          </button>
        </div>

        {/* Commercial Terms */}
        <div className="form-section">
          <h3>📋 Commercial Terms</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Currency</label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, currency: e.target.value }))
                }
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div className="form-group">
              <label>Minimum Order Quantity</label>
              <input
                type="number"
                value={formData.minimumOrderQuantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    minimumOrderQuantity: parseInt(e.target.value) || 1,
                  }))
                }
                min="1"
                className={errors.moq ? "error" : ""}
              />
              {errors.moq && (
                <span className="error-message">{errors.moq}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Payment Terms</label>
              <div className="checkbox-group">
                {paymentTermsOptions.map((term) => (
                  <label key={term} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.paymentTerms.includes(term)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            paymentTerms: [...prev.paymentTerms, term],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            paymentTerms: prev.paymentTerms.filter(
                              (t) => t !== term,
                            ),
                          }));
                        }
                      }}
                    />
                    {term.replace("_", " ").toUpperCase()}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Delivery Terms</label>
              <div className="checkbox-group">
                {deliveryTermsOptions.map((term) => (
                  <label key={term} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.deliveryTerms.includes(term)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData((prev) => ({
                            ...prev,
                            deliveryTerms: [...prev.deliveryTerms, term],
                          }));
                        } else {
                          setFormData((prev) => ({
                            ...prev,
                            deliveryTerms: prev.deliveryTerms.filter(
                              (t) => t !== term,
                            ),
                          }));
                        }
                      }}
                    />
                    {term.replace("_", " ").toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Lead Time (Min)</label>
              <input
                type="number"
                value={formData.leadTimeMin}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    leadTimeMin: parseInt(e.target.value) || 1,
                  }))
                }
                min="1"
                className={errors.leadTime ? "error" : ""}
              />
              {errors.leadTime && (
                <span className="error-message">{errors.leadTime}</span>
              )}
            </div>

            <div className="form-group">
              <label>Lead Time (Max)</label>
              <input
                type="number"
                value={formData.leadTimeMax}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    leadTimeMax: parseInt(e.target.value) || 1,
                  }))
                }
                min={formData.leadTimeMin}
                className={errors.leadTimeMax ? "error" : ""}
              />
              {errors.leadTimeMax && (
                <span className="error-message">{errors.leadTimeMax}</span>
              )}
            </div>

            <div className="form-group">
              <label>Time Unit</label>
              <select
                value={formData.leadTimeUnit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    leadTimeUnit: e.target.value as "days" | "weeks" | "months",
                  }))
                }
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Warranty Duration</label>
              <input
                type="number"
                value={formData.warrantyDuration}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    warrantyDuration: parseInt(e.target.value) || 1,
                  }))
                }
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Warranty Unit</label>
              <select
                value={formData.warrantyUnit}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    warrantyUnit: e.target.value as "months" | "years",
                  }))
                }
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.includesVAT}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      includesVAT: e.target.checked,
                    }))
                  }
                />
                Prices include VAT
              </label>
            </div>
          </div>
        </div>

        {/* Negotiation Boundaries */}
        <div className="form-section">
          <h3>🤝 Negotiation Boundaries</h3>
          <p className="section-description">
            Set your flexibility limits for AI negotiations
          </p>

          <div className="form-row">
            <div className="form-group">
              <label>Price Flexibility (%)</label>
              <input
                type="number"
                value={formData.priceFlexibility}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priceFlexibility: parseInt(e.target.value) || 0,
                  }))
                }
                min="0"
                max="50"
              />
              <small>Maximum discount you can offer</small>
            </div>

            <div className="form-group">
              <label>Quantity Flexibility (%)</label>
              <input
                type="number"
                value={formData.quantityFlexibility}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantityFlexibility: parseInt(e.target.value) || 0,
                  }))
                }
                min="0"
                max="100"
              />
              <small>How much quantity can vary from request</small>
            </div>

            <div className="form-group">
              <label>Delivery Flexibility (days)</label>
              <input
                type="number"
                value={formData.deliveryFlexibility}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deliveryFlexibility: parseInt(e.target.value) || 0,
                  }))
                }
                min="0"
                max="30"
              />
              <small>Extra days you can accommodate</small>
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.paymentTermsFlexible}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentTermsFlexible: e.target.checked,
                  }))
                }
              />
              Payment terms are negotiable
            </label>
          </div>
        </div>

        {/* Keywords */}
        <div className="form-section">
          <h3>🏷️ Keywords</h3>

          <div className="keyword-input">
            <input
              type="text"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              placeholder="e.g., marine grade, corrosion resistant"
            />
            <button type="button" onClick={addKeyword}>
              Add
            </button>
          </div>

          <div className="keyword-list">
            {formData.keywords.map((keyword, index) => (
              <div key={index} className="keyword-item">
                <span>{keyword}</span>
                <button type="button" onClick={() => removeKeyword(index)}>
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={onCancel}
            className="cancel-btn"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Product"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .supplier-product-form {
          max-width: 1000px;
          margin: 0 auto;
          padding: 20px;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .form-header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 2px solid var(--color-border-light);
        }

        .form-header h2 {
          font-size: 2rem;
          margin-bottom: 10px;
          color: var(--color-text-primary);
        }

        .form-header p {
          color: var(--color-text-secondary);
          font-size: 1.1rem;
          margin: 0;
        }

        .product-form {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .form-section {
          padding: 30px;
          border-bottom: 1px solid var(--color-border-light);
        }

        .form-section:last-child {
          border-bottom: none;
        }

        .form-section h3 {
          margin-top: 0;
          margin-bottom: 20px;
          color: var(--color-text-primary);
          font-size: 1.3rem;
        }

        .section-description {
          color: var(--color-text-secondary);
          margin-bottom: 20px;
          font-style: italic;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--color-text-primary);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #dc3545;
        }

        .form-group small {
          margin-top: 5px;
          color: var(--color-text-secondary);
          font-size: 0.85rem;
        }

        .error-message {
          color: #dc3545;
          font-size: 0.85rem;
          margin-top: 5px;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin-top: 8px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: normal;
          margin-bottom: 0;
        }

        .checkbox-label input[type="checkbox"] {
          margin: 0;
          width: auto;
        }

        .spec-input,
        .cert-input,
        .keyword-input {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .spec-input input,
        .cert-input input,
        .keyword-input input {
          flex: 1;
          padding: 10px;
          border: 1px solid var(--color-border);
          border-radius: 5px;
        }

        .spec-input button,
        .cert-input button,
        .keyword-input button {
          padding: 10px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
        }

        .spec-input button:hover,
        .cert-input button:hover,
        .keyword-input button:hover {
          background: #0056b3;
        }

        .spec-list,
        .cert-list,
        .keyword-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .spec-item,
        .cert-item,
        .keyword-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: var(--color-background);
          border: 1px solid var(--color-border);
          border-radius: 20px;
          font-size: 0.9rem;
        }

        .spec-item button,
        .cert-item button,
        .keyword-item button {
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
        }

        .pricing-tier {
          background: var(--color-background);
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 15px;
          position: relative;
        }

        .tier-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          align-items: end;
        }

        .remove-tier {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          cursor: pointer;
          font-size: 18px;
        }

        .add-tier {
          padding: 12px 24px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .add-tier:hover {
          background: #218838;
        }

        .form-actions {
          padding: 30px;
          display: flex;
          gap: 15px;
          justify-content: flex-end;
          background: var(--color-background);
          border-radius: 0 0 10px 10px;
        }

        .cancel-btn {
          padding: 12px 24px;
          background: var(--color-text-secondary);
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
        }

        .cancel-btn:hover:not(:disabled) {
          background: var(--color-text-secondary);
        }

        .submit-btn {
          padding: 12px 30px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .submit-btn:hover:not(:disabled) {
          background: #0056b3;
        }

        .cancel-btn:disabled,
        .submit-btn:disabled {
          background: var(--color-text-secondary);
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .tier-inputs {
            grid-template-columns: 1fr;
          }

          .checkbox-group {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .spec-input,
          .cert-input,
          .keyword-input {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default SupplierProductForm;
