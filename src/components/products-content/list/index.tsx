import useSwr from "swr";

import type { UnifiedProduct } from "@/types/api-products";

import ProductItem, { convertToProductItemProps } from "../../product-item";
import ProductsLoading from "./loading";

const ProductsContent = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSwr("/api/products", fetcher);

  if (error) return <div>Failed to load products</div>;
  return (
    <>
      {!data && <ProductsLoading />}

      {data && (
        <section className="products-list">
          {data.map((item: UnifiedProduct) => (
            <ProductItem
              {...convertToProductItemProps(item)}
              key={item.id}
            />
          ))}
        </section>
      )}
    </>
  );
};

export default ProductsContent;
