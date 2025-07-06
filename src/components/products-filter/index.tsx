import Slider from "rc-slider";
import { useState } from "react";

import productsColors from "../../utils/data/products-colors";
import productsSizes from "../../utils/data/products-sizes";
// data
import productsTypes from "../../utils/data/products-types";
import Checkbox from "./form-builder/checkbox";
import CheckboxColor from "./form-builder/checkbox-color";

const { createSliderWithTooltip } = Slider;
const Range = createSliderWithTooltip(Slider.Range);

const ProductsFilter = () => {
  const [filtersOpen, setFiltersOpen] = useState(false);

  const addQueryParams = () => {
    // query params changes
  };

  return (
    <form className="products-filter" onChange={addQueryParams}>
      <button
        type="button"
        onClick={() => setFiltersOpen(!filtersOpen)}
        className={`products-filter__menu-btn ${filtersOpen ? "products-filter__menu-btn--active" : ""}`}
      >
        Add Filter <i className="icon-down-open" />
      </button>

      <div
        className={`products-filter__wrapper ${filtersOpen ? "products-filter__wrapper--open" : ""}`}
      >
        <div className="products-filter__block">
          <button type="button">Category</button>
          <div className="products-filter__block__content">
            {productsTypes.map((type) => (
              <Checkbox key={type.id} name="product-category" label={type.name} />
            ))}
          </div>
        </div>

        <div className="products-filter__block">
          <button type="button">Price Range (EUR)</button>
          <div className="products-filter__block__content">
            <Range
              min={0}
              max={50000}
              defaultValue={[100, 10000]}
              tipFormatter={(value) => `€${value}`}
            />
          </div>
        </div>

        <div className="products-filter__block">
          <button type="button">Order Quantity</button>
          <div className="products-filter__block__content checkbox-square-wrapper">
            {productsSizes.map((type) => (
              <Checkbox
                type="square"
                key={type.id}
                name="order-quantity"
                label={type.label}
              />
            ))}
          </div>
        </div>

        <div className="products-filter__block">
          <button type="button">Certifications</button>
          <div className="products-filter__block__content">
            <div className="checkbox-color-wrapper">
              {productsColors.map((type) => (
                <CheckboxColor
                  key={type.id}
                  valueName={type.id}
                  name="product-certifications"
                  color={type.color}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-submit btn--rounded btn--yellow"
        >
          Apply
        </button>
      </div>
    </form>
  );
};

export default ProductsFilter;
