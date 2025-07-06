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

  // Format value based on type
  const formatValue = (value: string | number, format?: string, unit?: string): string => {
    if (format === 'currency') {
      return `€${typeof value === 'number' ? value.toLocaleString() : value}`;
    }
    if (format === 'number' && typeof value === 'number') {
      return value.toLocaleString();
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
