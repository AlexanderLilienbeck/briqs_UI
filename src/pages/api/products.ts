import type { NextApiRequest, NextApiResponse } from "next";
import { apiService } from "../../utils/api-service";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('API /products called - fetching from external API');
    
    // Fetch products from external API
    const products = await apiService.fetchFeaturedProducts();
    
    // Add fake loading time to simulate original behavior
    setTimeout(() => {
      res.status(200).json(products);
    }, 800);
    
  } catch (error) {
    console.error('Error in /api/products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
