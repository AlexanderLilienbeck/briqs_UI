import type { NextApiRequest, NextApiResponse } from "next";

// Import combined products (original + industrial)
import combinedProducts from "../../../utils/data/combined-products";
// Import new dynamic products
import { allSampleProducts } from "../../../utils/data/sample-dynamic-products";
import { UnifiedProduct } from "../../../types/dynamic-products";

// Type compatibility function to convert legacy products to UnifiedProduct format
function convertLegacyProduct(legacyProduct: any): UnifiedProduct {
  // Add productType based on product characteristics
  const productType = legacyProduct.industrial ? 'b2c' : 'b2c'; // Default to b2c for now
  
  return {
    ...legacyProduct,
    productType,
    seller_name: legacyProduct.seller_name || "Industrial Supplier",
    // Ensure required fields are present
    images: legacyProduct.images || [],
    price: legacyProduct.price || legacyProduct.currentPrice || 0
  } as UnifiedProduct;
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { pid },
  } = req;

  // First try to find in dynamic products
  let product: UnifiedProduct | undefined = allSampleProducts.find((x) => x.id === pid);
  
  // If not found, try in legacy products and convert
  if (!product) {
    const legacyProduct = combinedProducts.find((x) => x.id === pid);
    if (legacyProduct) {
      product = convertLegacyProduct(legacyProduct);
    }
  }

  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
};
