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
      {/* Dynamic Description Sections */}
      {descriptionSections.map((section, index) => (
        <div key={index} className="product-description-block">
          <i className={section.icon} />
          <h4>{section.title}</h4>
          <p>{section.content}</p>
        </div>
      ))}

      {/* Dynamic Specifications */}
      {attributeCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="product-description-block">
          <i className={category.icon} />
          <h4>{category.title}</h4>
          <div className="product-specifications">
            {category.attributes.map((attr, attrIndex) => (
              <div key={attrIndex} className="specification-item">
                <span className="spec-label">{attr.label}:</span>
                <span className="spec-value">
                  {formatValue(attr.value, attr.format, attr.unit)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Description;
