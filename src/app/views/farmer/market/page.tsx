'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface ListedProduct {
  id: number;
  productType: string;
  quantity: number;
  farmerEmail: string;
  farmerComments: string[];
}

const BASE_URL = 'http://localhost:8080'; // adjust if needed

export default function MarketPage() {
  const [products, setProducts] = useState<ListedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Function to get product image based on type
  const getProductImage = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('maize')) return '/images/maize.jpg';
    if (lowerType.includes('mango')) return '/images/mango.jpg';
    if (lowerType.includes('beef')) return '/images/beef.webp';
    if (lowerType.includes('fertilizer')) return '/images/fertilizer.jpg';
    if (lowerType.includes('beans')) return '/images/beans.jpg';
    if (lowerType.includes('tomato')) return '/images/tomatoes.webp';
    return '/images/default.jpg';
  };

  // Fetch all listed products from backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/listed-products/all`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data: ListedProduct[] = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-6 text-gray-700">Loading products...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-[#2E7D32]">Market Listings</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0] flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={getProductImage(item.productType)}
                  alt={item.productType}
                  className="w-20 h-20 object-cover rounded-md border"
                  width={50}
                  height={50}
                />
                <div>
                  <p className="font-semibold text-[#4CAF50]">{item.productType}</p>
                  <p>Quantity: {item.quantity} kg</p>
                  <p>Farmer: {item.farmerEmail}</p>
                  {item.farmerComments && item.farmerComments.length > 0 && (
                    <p className="text-gray-500 text-sm">
                      Comments: {item.farmerComments.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <span className="px-3 py-1 rounded-full font-semibold bg-green-100 text-[#2E7D32]">
                  Available
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
