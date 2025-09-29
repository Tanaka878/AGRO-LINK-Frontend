'use client';
import React from 'react';

export default function MarketPage() {
  // Hardcoded market listings data
  const marketListings = [
    {
      product: 'Tomatoes',
      quantity: '100kg',
      price: '$1.2/kg',
      location: 'Nairobi',
      status: 'Available',
    },
    {
      product: 'Maize',
      quantity: '200kg',
      price: '$0.9/kg',
      location: 'Kisumu',
      status: 'Available',
    },
    {
      product: 'Beans',
      quantity: '150kg',
      price: '$1.5/kg',
      location: 'Eldoret',
      status: 'Pending',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#2E7D32]">
        Market Listings
      </h2>

      <div className="grid gap-6">
        {marketListings.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0] flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-[#4CAF50]">{item.product}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.price}</p>
              <p>Location: {item.location}</p>
            </div>
            <div>
              <span
                className={`px-3 py-1 rounded-full font-semibold ${
                  item.status === 'Available'
                    ? 'bg-green-100 text-[#2E7D32]'
                    : 'bg-yellow-100 text-[#FBC02D]'
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
