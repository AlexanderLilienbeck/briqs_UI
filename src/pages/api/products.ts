import type { NextApiRequest, NextApiResponse } from "next";

// Import combined products (original + industrial)
import combinedProducts from "../../utils/data/combined-products";

export default (_req: NextApiRequest, res: NextApiResponse) => {
  // fake loading time
  setTimeout(() => {
    res.status(200).json(combinedProducts);
  }, 800);
};
