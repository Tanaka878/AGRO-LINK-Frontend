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

const BASE_URL = 'http://localhost:8080';

export default function MarketPage() {
  const [products, setProducts] = useState<ListedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredProducts = products.filter(product =>
    product.productType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-green-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">My Market Listings</h1>
          <p className="text-gray-600 text-sm">Manage your agricultural products</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-lg border-2 border-green-200 focus:border-green-500 focus:outline-none bg-white text-sm"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg className="w-16 h-16 mx-auto text-green-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-gray-600 font-medium">No products found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-green-100 p-4"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-green-50">
                    <Image
                      src={getProductImage(item.productType)}
                      alt={item.productType}
                      className="w-full h-full object-cover"
                      width={96}
                      height={96}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{item.productType}</h3>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-xs whitespace-nowrap">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Available
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="font-bold text-lg">{item.quantity} kg</span>
                    </div>

                    {item.farmerComments && item.farmerComments.length > 0 && (
                      <div className="bg-green-50 rounded px-3 py-2">
                        <p className="text-xs text-gray-700">
                          {item.farmerComments.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}