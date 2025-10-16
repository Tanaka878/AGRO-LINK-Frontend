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

  const fetchOrders = async () => {
    try {
      const email = localStorage.getItem('farmerEmail');
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
    return <div className="p-6 text-gray-700">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h1>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-700 text-sm text-center">
          {message}
        </div>
      )}

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-[#E8F5E9] text-gray-700 uppercase text-sm">
              <tr>
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
                  <td className="py-3 px-4">{order.productType}</td>
                  <td className="py-3 px-4">{order.quantity}</td>
                  <td className="py-3 px-4">{order.buyerEmail}</td>
                  <td className="py-3 px-4">{order.totalPrice.toFixed(2)}</td>
                  <td
                    className={`py-3 px-4 font-medium ${
                      order.status === 'PENDING'
                        ? 'text-yellow-600'
                        : 'text-green-700'
                    }`}
                  >
                    {order.status}
                  </td>
                  <td className="py-3 px-4">
                    {order.status === 'PENDING' ? (
                      <button
                        onClick={() => markAsCollected(order.id)}
                        className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded transition"
                      >
                        Mark as Collected
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">Already Collected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
