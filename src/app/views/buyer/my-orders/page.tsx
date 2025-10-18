'use client';
import React, { useEffect, useState } from 'react';

interface Order {
  id: number;
  productType: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  farmerEmail: string;
  status: string;
  orderTime: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const buyerEmail = localStorage.getItem('email');
    if (!buyerEmail) {
      setLoading(false);
      return;
    }

    const encodedEmail = encodeURIComponent(buyerEmail);
    fetch(`http://localhost:8080/api/orders/buyer/${encodedEmail}`)
      .then((res) => res.json())
      .then((data: Order[]) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#FAFAFA] min-h-screen">
      <h2 className="text-2xl font-bold text-[#2E7D32] mb-4">My Orders</h2>

      {orders.length === 0 && (
        <p className="text-gray-500">You have not placed any orders yet.</p>
      )}

      <ul className="space-y-2">
        {orders.map((order) => (
          <li
            key={order.id}
            className="bg-white shadow rounded p-4 flex justify-between items-center border border-[#E0E0E0]"
          >
            <div className="flex flex-col">
              <span className="font-semibold">#{order.id} - {order.productType}</span>
              <span className="text-gray-500 text-sm">{order.quantity} pcs</span>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`font-semibold ${
                  order.status === 'PENDING' ? 'text-yellow-600' : 'text-green-600'
                }`}
              >
                {order.status}
              </span>
              <span className="text-gray-500 text-sm">
                {new Date(order.orderTime).toLocaleDateString()}
              </span>
            </div>
            <button
              onClick={() => setSelectedOrder(order)}
              className="ml-4 bg-slate-700 text-white px-3 py-1 rounded-md hover:bg-slate-800 transition-colors text-sm"
            >
              View Order
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Order Details</h2>
            </div>
            <div className="p-6 space-y-2">
              <p>
                <span className="font-semibold">Order ID:</span> {selectedOrder.id}
              </p>
              <p>
                <span className="font-semibold">Product:</span> {selectedOrder.productType}
              </p>
              <p>
                <span className="font-semibold">Quantity:</span> {selectedOrder.quantity} pcs
              </p>
              <p>
                <span className="font-semibold">Price per Unit:</span> ${selectedOrder.pricePerUnit}
              </p>
              <p>
                <span className="font-semibold">Total Price:</span> ${selectedOrder.totalPrice}
              </p>
              <p>
                <span className="font-semibold">Farmer Email:</span> {selectedOrder.farmerEmail}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{' '}
                <span
                  className={`font-semibold ${
                    selectedOrder.status === 'PENDING' ? 'text-yellow-600' : 'text-green-600'
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Order Time:</span>{' '}
                {new Date(selectedOrder.orderTime).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-700 text-white px-6 py-2 rounded-md hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
