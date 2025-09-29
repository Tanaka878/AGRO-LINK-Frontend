'use client';
import React from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export default function MarketPlace() {
  const products: Product[] = [
    { id: 1, name: '50kg Maize', price: 30, stock: 10, category: 'Grains' },
    { id: 2, name: '30kg Fertilizer', price: 50, stock: 5, category: 'Fertilizers' },
    { id: 3, name: '20kg Beans', price: 25, stock: 15, category: 'Grains' },
    { id: 4, name: 'Tomato Seeds Pack', price: 5, stock: 50, category: 'Seeds' },
    { id: 5, name: 'Chicken Feed 10kg', price: 12, stock: 20, category: 'Animal Feed' },
  ];

  return (
    <div className="p-6 bg-[#FAFAFA] min-h-screen">
      <h2 className="text-2xl font-bold text-[#2E7D32] mb-4">MarketPlace</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow p-4 border border-[#E0E0E0] flex flex-col justify-between"
          >
            <h3 className="text-lg font-semibold text-[#4CAF50]">{product.name}</h3>
            <p className="text-gray-600">Category: {product.category}</p>
            <p className="text-gray-600">Stock: {product.stock}</p>
            <p className="text-gray-800 font-bold">Price: ${product.price}</p>
            <button className="mt-4 bg-[#4CAF50] text-white py-2 rounded-lg hover:bg-[#2E7D32] transition">
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
