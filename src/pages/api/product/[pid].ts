import type { NextApiRequest, NextApiResponse } from "next";

// Import combined products (original + industrial)
import combinedProducts from "../../../utils/data/combined-products";

export default (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { pid },
  } = req;

  const product = combinedProducts.find((x) => x.id === pid);
  res.status(200).json(product);
};
