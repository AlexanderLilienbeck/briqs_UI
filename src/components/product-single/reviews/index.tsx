import type { UnifiedProduct } from "@/types/api-products";

type SpecificationsProductType = {
  show: boolean;
  product: UnifiedProduct;
};

const Reviews = ({ show, product }: SpecificationsProductType) => {
  const style = {
    display: show ? "flex" : "none",
  };

  const renderSpecifications = () => {
    if (product.productType === 'excavator') {
      return (
        <div className="product-specifications">
          <h3>Technical Specifications</h3>
          <div className="specifications-grid">
            <div className="spec-item">
              <span className="spec-label">Brand:</span>
              <span className="spec-value">{product.brand}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Model:</span>
              <span className="spec-value">{product.model}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Year:</span>
              <span className="spec-value">{product.year}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Condition:</span>
              <span className="spec-value">{product.condition}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Lifting Capacity:</span>
              <span className="spec-value">{product.lifting_capacity_tons} tons</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Operating Weight:</span>
              <span className="spec-value">{product.operating_weight_tons} tons</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Max Digging Depth:</span>
              <span className="spec-value">{product.max_digging_depth_m} meters</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Bucket Capacity:</span>
              <span className="spec-value">{product.bucket_capacity_m3} m³</span>
            </div>
          </div>
        </div>
      );
    } else if (product.productType === 'aluminum_sheet') {
      return (
        <div className="product-specifications">
          <h3>Material Specifications</h3>
          <div className="specifications-grid">
            <div className="spec-item">
              <span className="spec-label">Material:</span>
              <span className="spec-value">Aluminum Sheet</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Thickness:</span>
              <span className="spec-value">{product.thickness_mm} mm</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Total Weight:</span>
              <span className="spec-value">{product.total_weight_kg} kg</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Availability:</span>
              <span className="spec-value">{product.availability} units</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Seller:</span>
              <span className="spec-value">{product.seller_name}</span>
            </div>
          </div>
        </div>
      );
    }
    
    return <div>No specifications available</div>;
  };

  return (
    <section style={style} className="product-single__reviews">
      {renderSpecifications()}
    </section>
  );
};

export default Reviews;
