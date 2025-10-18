'use client';
import React, { useEffect, useState } from 'react';

interface Order {
  id: number;
  productType: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  buyerEmail: string;
  status: string;
  orderTime: string;
}

const BASE_URL = 'http://localhost:8080'; // adjust if needed

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const email = localStorage.getItem('email');
      if (!email) return;

      const response = await fetch(`${BASE_URL}/api/orders/farmer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markAsCollected = async (orderId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/update-status/${orderId}?status=COLLECTED`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to update order status');

      setMessage('Order marked as collected successfully ✅');
      fetchOrders(); // refresh list
    } catch (err) {
      console.error('Error updating order:', err);
      setMessage('Failed to mark as collected ❌');
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-800">Loading orders...</div>;
  }

  return (
    <div className="p-6 text-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">My Orders</h1>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-900 text-sm text-center">
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-gray-700">No orders found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200 text-gray-800">
            <thead className="bg-[#E8F5E9] text-gray-900 uppercase text-sm">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Product</th>
                <th className="py-3 px-4 text-left">Quantity (kg)</th>
                <th className="py-3 px-4 text-left">Buyer</th>
                <th className="py-3 px-4 text-left">Total ($)</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-gray-800">{order.id}</td>
                  <td className="py-3 px-4 text-gray-800">{order.productType}</td>
                  <td className="py-3 px-4 text-gray-800">{order.quantity}</td>
                  <td className="py-3 px-4 text-gray-800">{order.buyerEmail}</td>
                  <td className="py-3 px-4 text-gray-800">{order.totalPrice.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 text-sm font-semibold rounded ${
                        order.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => markAsCollected(order.id)}
                        className="px-3 py-1.5 text-sm bg-green-700 hover:bg-green-800 text-white rounded transition"
                      >
                        Mark as Collected
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-3 py-1.5 text-sm bg-blue-700 hover:bg-blue-800 text-white rounded transition"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Order Details</h2>
            </div>
            <div className="p-6 space-y-2 text-gray-800">
              <p>
                <span className="font-semibold">Order ID:</span> {selectedOrder.id}
              </p>
              <p>
                <span className="font-semibold">Product:</span> {selectedOrder.productType}
              </p>
              <p>
                <span className="font-semibold">Quantity:</span> {selectedOrder.quantity} kg
              </p>
              <p>
                <span className="font-semibold">Price per Unit:</span> ${selectedOrder.pricePerUnit.toFixed(2)}
              </p>
              <p>
                <span className="font-semibold">Total Price:</span> ${selectedOrder.totalPrice.toFixed(2)}
              </p>
              <p>
                <span className="font-semibold">Buyer Email:</span> {selectedOrder.buyerEmail}
              </p>
              <p>
                <span className="font-semibold">Status:</span>{' '}
                <span
                  className={`inline-block px-2 py-1 text-sm font-semibold rounded ${
                    selectedOrder.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
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
