import type { NextApiRequest, NextApiResponse } from "next";
import { apiService } from "../../../utils/api-service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { pid },
  } = req;

  try {
    console.log(`API /product/${pid} called - fetching from external API`);
    
    // Find product by ID from external API
    const product = await apiService.findProductById(pid as string);
    
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ 
        error: "Product not found",
        productId: pid 
      });
    }
    
  } catch (error) {
    console.error(`Error in /api/product/${pid}:`, error);
    res.status(500).json({ 
      error: 'Failed to fetch product',
      message: error instanceof Error ? error.message : 'Unknown error',
      productId: pid
    });
  }
};
