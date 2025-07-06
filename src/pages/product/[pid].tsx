import type { GetServerSideProps } from "next";
import { useState } from "react";

import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import Content from "@/components/product-single/content";
import Description from "@/components/product-single/description";
import Gallery from "@/components/product-single/gallery";
import Reviews from "@/components/product-single/reviews";
import ProductsFeatured from "@/components/products-featured";
// types
import type { UnifiedProduct } from "@/types/dynamic-products";
import type { ProductType } from "@/types";

import Layout from "../../layouts/Main";
import { server } from "../../utils/server";

type ProductPageType = {
  product: UnifiedProduct;
};

// Convert UnifiedProduct to legacy ProductType format for compatibility
function convertToLegacyFormat(product: UnifiedProduct): ProductType {
  return {
    id: product.id,
    name: product.name,
    thumb: product.images[0] || "",
    price: product.price.toString(),
    count: 1,
    color: "",
    size: "",
    images: product.images,
    discount: (product as any).discount?.toString() || "",
    currentPrice: (product as any).currentPrice || product.price,
    punctuation: (product as any).punctuation || {
      countOpinions: 0,
      punctuation: 0,
      votes: []
    },
    reviews: (product as any).reviews || [],
    // Add seller name compatibility
    sellerName: product.seller_name || "Industrial Supplier"
  } as ProductType;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { pid } = query;
  const res = await fetch(`${server}/api/product/${pid}`);
  const product = await res.json();

  return {
    props: {
      product,
    },
  };
};

const Product = ({ product }: ProductPageType) => {
  const [showBlock, setShowBlock] = useState("description");

  // Convert to legacy format for Gallery and Content components
  const legacyProduct = convertToLegacyFormat(product);

  return (
    <Layout>
      <Breadcrumb />

      <section className="product-single">
        <div className="container">
          <div className="product-single__content">
            <Gallery images={product.images} />
            <Content product={legacyProduct} />
          </div>

          <div className="product-single__info">
            <div className="product-single__info-btns">
              <button
                type="button"
                onClick={() => setShowBlock("description")}
                className={`btn btn--rounded ${showBlock === "description" ? "btn--active" : ""}`}
              >
                Description
              </button>
              <button
                type="button"
                onClick={() => setShowBlock("reviews")}
                className={`btn btn--rounded ${showBlock === "reviews" ? "btn--active" : ""}`}
              >
                Reviews
              </button>
            </div>

            <Description show={showBlock === "description"} product={product} />
            <Reviews product={legacyProduct} show={showBlock === "reviews"} />
          </div>
        </div>
      </section>

      <div className="product-single-page">
        <ProductsFeatured />
      </div>
      <Footer />
    </Layout>
  );
};

export default Product;
