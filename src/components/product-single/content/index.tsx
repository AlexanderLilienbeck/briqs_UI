import { some } from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import { addProduct } from "@/store/reducers/cart";
import { toggleFavProduct } from "@/store/reducers/user";
import type { ProductStoreType } from "@/types";
import type { UnifiedProduct } from "@/types/api-products";



type ProductContent = {
  product: UnifiedProduct;
};

const Content = ({ product }: ProductContent) => {
  const dispatch = useDispatch();
  const [count, setCount] = useState<number>(1);

  const { favProducts } = useSelector((state: RootState) => state.user);
  const isFavourite = some(
    favProducts,
    (productId) => productId === product.id,
  );

  const toggleFav = () => {
    dispatch(
      toggleFavProduct({
        id: product.id,
      }),
    );
  };

  const addToCart = () => {
    const productToSave: ProductStoreType = {
      id: product.id,
      name: product.name,
      thumb: product.images ? product.images[0] : "",
      price: product.price,
      count: count,
      color: "",
      size: ""
    };

    const productStore = {
      count,
      product: productToSave,
    };

    dispatch(addProduct(productStore));
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get product type and category
  const getProductCategory = () => {
    switch (product.productType) {
      case 'excavator':
        return 'Excavator';
      case 'aluminum_sheet':
        return 'Aluminum Sheet';
      default:
        return 'Industrial Product';
    }
  };

  const getProductType = () => {
    switch (product.productType) {
      case 'excavator':
        return 'Heavy Machinery';
      case 'aluminum_sheet':
        return 'Industrial Materials';
      default:
        return 'Industrial Product';
    }
  };

  return (
    <section className="product-content">
      <div className="product-content__intro">
        <h5 className="product__id">
          Product ID:
          <br />
          {product.id}
        </h5>
        <span className="product-type-badge">{getProductCategory()}</span>
        <h2 className="product__name">{product.name}</h2>

        <div className="product__prices">
          <h4>{formatPrice(product.price)}</h4>
        </div>
      </div>

      <div className="product-content__filters">
        <div className="product-filter-item">
          <h5>
            Seller: <strong>{product.seller_name}</strong>
          </h5>
          <h5>
            Type: <strong>{getProductType()}</strong>
          </h5>
          {product.productType === 'excavator' && (
            <>
              <h5>
                Condition: <strong>{product.condition}</strong>
              </h5>
              <h5>
                Year: <strong>{product.year}</strong>
              </h5>
            </>
          )}
          {product.productType === 'aluminum_sheet' && (
            <>
              <h5>
                Availability: <strong>{product.availability} units available</strong>
              </h5>
              <h5>
                Thickness: <strong>{product.thickness_mm}mm thick</strong>
              </h5>
            </>
          )}
        </div>
        <div className="product-filter-item">
          <h5>Quantity:</h5>
          <div className="quantity-buttons">
            <div className="quantity-button">
              <button
                type="button"
                onClick={() => setCount(Math.max(1, count - 1))}
                className="quantity-button__btn"
                disabled={count <= 1}
              >
                -
              </button>
              <span>{count}</span>
              <button
                type="button"
                onClick={() => setCount(count + 1)}
                className="quantity-button__btn"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={toggleFav}
              className={`btn-heart ${isFavourite ? "btn-heart--active" : ""}`}
              title={isFavourite ? "Remove from favorites" : "Add to favorites"}
              aria-label={isFavourite ? "Remove from favorites" : "Add to favorites"}
            >
              <i className="icon-heart" />
            </button>
          </div>
          <div>
            <br />
            <h3>Start direct negotiation with this supplier</h3>
            <br />
            <a href="/negotiation">
              <button className="btn btn--rounded btn--yellow">
                Start Negotiation
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Content;
