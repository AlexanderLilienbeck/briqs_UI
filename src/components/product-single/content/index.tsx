import { some } from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { RootState } from "@/store";
import { addProduct } from "@/store/reducers/cart";
import { toggleFavProduct } from "@/store/reducers/user";
import type { ProductStoreType, ProductType } from "@/types";

import productsColors from "../../../utils/data/products-colors";
import productsSizes from "../../../utils/data/products-sizes";
import CheckboxColor from "../../products-filter/form-builder/checkbox-color";

type ProductContent = {
  product: ProductType;
};

const Content = ({ product }: ProductContent) => {
  const dispatch = useDispatch();
  const [count, setCount] = useState<number>(1);
  const [color, setColor] = useState<string>("");
  const [itemSize, setItemSize] = useState<string>("");

  const onColorSet = (e: string) => setColor(e);
  const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setItemSize(e.target.value);

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
      price: product.currentPrice,
    };

    const productStore = {
      count,
      product: productToSave,
    };

    dispatch(addProduct(productStore));
  };

  return (
    <section className="product-content">
      <div className="product-content__intro">
        <h5 className="product__id">
          Product ID:
          <br />
          {product.id}
        </h5>
        <span className="product-on-sale">Sale</span>
        <h2 className="product__name">{product.name}</h2>

        <div className="product__prices">
          <h4>${product.currentPrice}</h4>
          {product.discount && <span>${product.price}</span>}
        </div>
      </div>

      <div className="product-content__filters">
 
        <div className="product-filter-item">
          <h5>
            Options: <strong>This product has no options</strong>
          </h5>
          <div className="checkbox-color-wrapper">
            <div className="select-wrapper">
              <select onChange={onSelectChange}>
                <option>Standard</option>
              </select>
            </div>
          </div>
        </div>
        <div className="product-filter-item">
          <h5>Quantity:</h5>
          <div className="quantity-buttons">
            <div className="quantity-button">
              <button
                type="button"
                onClick={() => setCount(count - 1)}
                className="quantity-button__btn"
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
            >
              <i className="icon-heart" />
            </button>
            </div>
            <div>
              <br />
              <h3>Start dicrect negotiation with that Supplier</h3>
              <br />
              <a href="/negotiation">
                <button
                className="btn btn--rounded btn--yellow"
              >
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
