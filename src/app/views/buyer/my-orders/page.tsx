'use client';
import React from 'react';

interface Order {
  id: number;
  product: string;
  quantity: number;
  status: string;
  datePlaced: string;
}

export default function MyOrders() {
  // Sample hardcoded data
  const pendingOrders: Order[] = [
    { id: 1, product: '50kg Maize', quantity: 1, status: 'Pending', datePlaced: '2025-09-29' },
    { id: 2, product: '30kg Fertilizer', quantity: 2, status: 'Pending', datePlaced: '2025-09-28' },
  ];

  const collectedOrders: Order[] = [
    { id: 3, product: '20kg Beans', quantity: 1, status: 'Collected', datePlaced: '2025-09-25' },
    { id: 4, product: '10kg Rice', quantity: 3, status: 'Collected', datePlaced: '2025-09-24' },
  ];

  return (
    <div className="p-6 bg-[#FAFAFA] min-h-screen">
      <h2 className="text-2xl font-bold text-[#2E7D32] mb-4">My Orders</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold text-[#4CAF50] mb-2">Pending Orders</h3>
        <ul className="space-y-2">
          {pendingOrders.map((order) => (
            <li
              key={order.id}
              className="bg-white shadow rounded p-4 flex justify-between items-center border border-[#E0E0E0]"
            >
              <span>{order.product}</span>
              <span>{order.quantity} pcs</span>
              <span className="text-yellow-600 font-semibold">{order.status}</span>
              <span className="text-gray-500 text-sm">{order.datePlaced}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-[#4CAF50] mb-2">Collected Orders</h3>
        <ul className="space-y-2">
          {collectedOrders.map((order) => (
            <li
              key={order.id}
              className="bg-white shadow rounded p-4 flex justify-between items-center border border-[#E0E0E0]"
            >
              <span>{order.product}</span>
              <span>{order.quantity} pcs</span>
              <span className="text-green-600 font-semibold">{order.status}</span>
              <span className="text-gray-500 text-sm">{order.datePlaced}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
