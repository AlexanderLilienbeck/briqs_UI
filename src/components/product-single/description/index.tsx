import React from 'react';
import { UnifiedProduct, generateProductDescription, getCategorizedAttributes } from '../../../types/dynamic-products';

type ProductDescriptionType = {
  show: boolean;
  product: UnifiedProduct;
};

const Description = ({ show, product }: ProductDescriptionType) => {
  const style = {
    display: show ? "flex" : "none",
  };

  // Generate dynamic description sections
  const descriptionSections = generateProductDescription(product);
  
  // Get categorized attributes for specifications
  const attributeCategories = getCategorizedAttributes(product);

  // Format value based on type with consistent formatting
  const formatValue = (value: string | number, format?: string, unit?: string): string => {
    if (format === 'currency') {
      // Use consistent formatting to avoid hydration errors
      const numValue = typeof value === 'number' ? value : parseFloat(value.toString());
      // Format as simple decimal without locale-dependent formatting
      return `€${numValue.toFixed(2)}`;
    }
    if (format === 'number' && typeof value === 'number') {
      // Use simple number formatting without locale
      return value.toString();
    }
    const formattedValue = typeof value === 'number' ? value.toString() : value;
    return unit ? `${formattedValue} ${unit}` : formattedValue;
  };

  return (
    <section style={style} className="product-single__description">
      {/* Hero Description */}
      <div className="additional-details">
      <h3>Description</h3>
        <div className="description-overview">
          <p className="product-summary">
            {product.description || descriptionSections[0]?.content || `${product.name} - Professional grade product for industrial applications.`}
          </p>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="specifications-container">
        <h3>Technical Specifications</h3>
        <div className="specifications-grid">
          {attributeCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="spec-category">
              <div className="spec-category-header">
                <i className={category.icon} />
                <h4>{category.title}</h4>
              </div>
              <div className="spec-items">
                {category.attributes.map((attr, attrIndex) => (
                  <div key={attrIndex} className="spec-item">
                    <span className="spec-label">{attr.label}</span>
                    <span className="spec-value">
                      {formatValue(attr.value, attr.format, attr.unit)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Details */}
      {descriptionSections.length > 1 && (
        <div className="additional-details">
          <h3>Additional Information</h3>
          <div className="details-grid">
            {descriptionSections.slice(1).map((section, index) => (
              <div key={index} className="detail-card">
                <div className="detail-header">
                  <i className={section.icon} />
                  <h4>{section.title}</h4>
                </div>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Features */}
      <div className="key-features">
        <h3>Key Features</h3>
        <div className="features-list">
          {product.keywords && product.keywords.slice(0, 5).map((keyword, index) => (
            <span key={index} className="feature-tag">
              {keyword.charAt(0).toUpperCase() + keyword.slice(1)}
            </span>
          ))}
          {!product.keywords && (
            <span className="feature-tag">Professional Grade</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default Description;
