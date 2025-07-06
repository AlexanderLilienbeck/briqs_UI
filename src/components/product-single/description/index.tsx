type ProductDescriptionType = {
  show: boolean;
};

const Description = ({ show }: ProductDescriptionType) => {
  const style = {
    display: show ? "flex" : "none",
  };

  return (
    <section style={style} className="product-single__description">
      <div className="product-description-block">
        <i className="icon-cart" />
        <h4>Details</h4>
        <p>
          White Summer Vibes T-shirt in the uiKit line with a colorful print.{" "}
          <br />
          Made of jersey cotton. T-shirt fits perfectly with jeans, pants or
          shorts.
        </p>
      </div>
      <div className="product-description-block">
        <i className="icon-cart" />
        <h4>Product Description</h4>
        <p>
          White Summer Vibes T-shirt in the uiKit line with a colorful print.{" "}
          <br />
          Made of jersey cotton. T-shirt fits perfectly with jeans, pants or
          shorts.
        </p>
      </div>
    </section>
  );
};

export default Description;
