import { some } from "lodash";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import { toggleFavProduct } from "@/store/reducers/user";
import type { UnifiedProduct } from "@/types/api-products";

// Product item props for displaying in lists and carousels
interface ProductItemProps {
  id: string;
  name: string;
  price: number;
  images: string[];
  productType: 'excavator' | 'aluminum_sheet';
  seller_name: string;
  
  // Type-specific fields (optional for display)
  brand?: string;
  model?: string;
  condition?: string;
  availability?: number;
  thickness_mm?: number;
}

const ProductItem = ({
  id,
  name,
  price,
  images,
  productType,
  seller_name,
  brand,
  model,
  condition,
  availability,
  thickness_mm
}: ProductItemProps) => {
  const dispatch = useDispatch();
  const { favProducts } = useSelector((state: RootState) => state.user);

  const isFavourite = some(favProducts, (productId) => productId === id);

  const toggleFav = () => {
    dispatch(
      toggleFavProduct({
        id,
      }),
    );
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

  // Get product type display info
  const getProductTypeInfo = () => {
    switch (productType) {
      case 'excavator':
        return {
          badge: 'Excavator',
          subtitle: brand && model ? `${brand} ${model}` : seller_name,
          condition: condition,
          badgeColor: '#152934'
        };
      case 'aluminum_sheet':
        return {
          badge: 'Aluminum Sheet',
          subtitle: thickness_mm ? `${thickness_mm}mm thick` : seller_name,
          condition: availability ? `${availability} available` : undefined,
          badgeColor: '#273033'
        };
      default:
        return {
          badge: 'Product',
          subtitle: seller_name,
          badgeColor: '#838787'
        };
    }
  };

  const typeInfo = getProductTypeInfo();

  return (
    <div className="product-item">
      <div className="product__image">
        <button
          type="button"
          onClick={toggleFav}
          className={`btn-heart ${isFavourite ? "btn-heart--active" : ""}`}
          title={isFavourite ? "Remove from favorites" : "Add to favorites"}
          aria-label={isFavourite ? "Remove from favorites" : "Add to favorites"}
        >
          <i className="icon-heart" />
        </button>

        <Link href={`/product/${id}`}>
          <img src={images && images[0] ? images[0] : "/images/products/product-1.jpg"} alt={name} />
          <span 
            className="product__type-badge"
            style={{ backgroundColor: typeInfo.badgeColor }}
          >
            {typeInfo.badge}
          </span>
        </Link>
      </div>
      <div className="product__description">
        <h3>{name}</h3>
        <p className="product__subtitle">{typeInfo.subtitle}</p>
        {typeInfo.condition && (
          <p className="product__condition">{typeInfo.condition}</p>
        )}
        <div className="product__price">
          <h4>{formatPrice(price)}</h4>
        </div>
      </div>
    </div>
  );
};

// Helper function to convert UnifiedProduct to ProductItemProps
export const convertToProductItemProps = (product: UnifiedProduct): ProductItemProps => {
  const baseProps = {
    id: product.id,
    name: product.name,
    price: product.price,
    images: product.images,
    productType: product.productType,
    seller_name: product.seller_name,
  };

  if (product.productType === 'excavator') {
    return {
      ...baseProps,
      brand: product.brand,
      model: product.model,
      condition: product.condition,
    };
  } else if (product.productType === 'aluminum_sheet') {
    return {
      ...baseProps,
      availability: product.availability,
      thickness_mm: product.thickness_mm,
    };
  }

  return baseProps;
};

export default ProductItem;
