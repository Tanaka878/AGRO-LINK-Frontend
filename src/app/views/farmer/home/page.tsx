'use client';
import React, { useState, useEffect } from 'react';
import Base_URL from '@/app/api/route';
import { Order } from '../../Interface/Orders';
import OrderStatusChart from '@/app/Charts/OrderStatusChart';
import TopSellingProductsChart from '@/app/Charts/TopSellingProducts';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [farmerEmail, setFarmerEmail] = useState<string | null>(null);
  const [farmerName, setFarmerName] = useState<string>('Farmer');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ pendingOrders: 0, listedProducts: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedEmail = localStorage.getItem('email');
      const storedName = localStorage.getItem('name');
      if (storedEmail) setFarmerEmail(storedEmail);
      if (storedName) setFarmerName(storedName);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!farmerEmail) return;
    fetchStatistics();
    fetchOrders();
  }, [farmerEmail]);

  const fetchStatistics = async () => {
    if (!farmerEmail) return;
    try {
      const res = await fetch(`${Base_URL}/api/farmers/statistics/${farmerEmail}`);
      if (!res.ok) throw new Error('Failed to fetch statistics');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const fetchOrders = async () => {
    if (!farmerEmail) return;
    try {
      const res = await fetch(`${Base_URL}/api/orders/farmer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: farmerEmail }),
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // ✅ Handle submitting the "List Product" form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!farmerEmail) return;

    const productType = (document.getElementById('productType') as HTMLInputElement).value;
    const quantity = Number((document.getElementById('quantity') as HTMLInputElement).value);
    const price = Number((document.getElementById('price') as HTMLInputElement).value);
    const description = (document.getElementById('description') as HTMLTextAreaElement).value;

    try {
      const res = await fetch(`${Base_URL}/api/listed-products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productType, quantity, price, description, farmerEmail }),
      });

      if (!res.ok) throw new Error('Failed to list product');

      setMessage('✅ Product listed successfully!');
      setIsModalOpen(false);
      fetchStatistics(); // Refresh stats
    } catch (err) {
      console.error(err);
      setMessage('❌ Failed to list product.');
    }
  };

  if (loading || farmerEmail === null) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6 space-y-6">
      {/* Header Section */}
      <div className="border-b pb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {getGreeting()}, {farmerName}
            </h1>
            <p className="text-gray-600 text-sm">Dashboard Overview</p>
          </div>
      
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded p-6">
          <p className="text-sm text-gray-600 mb-2">Pending Orders</p>
          <p className="text-3xl font-semibold text-gray-900">{stats.pendingOrders}</p>
        </div>
        <div className="border rounded p-6">
          <p className="text-sm text-gray-600 mb-2">Listed Products</p>
          <p className="text-3xl font-semibold text-gray-900">{stats.listedProducts}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart />
        <TopSellingProductsChart />
      </div>

      {/* Orders List Section */}
      <div className="border rounded">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="p-6">
          {(() => {
        const pending = orders.filter((o) => o.status !== 'COMPLETED').slice(0, 3);
        if (pending.length === 0) {
          return (
            <div className="text-center py-12">
          <p className="text-gray-500">No pending orders</p>
            </div>
          );
        }
        return (
          <div className="space-y-3">
            {pending.map((order, idx) => (
          <div
            key={order.id ?? `${order.productType}-${idx}`}
            className="flex items-center justify-between p-4 border rounded hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="text-gray-400 text-sm font-medium w-6">{idx + 1}</div>
              <div>
            <p className="font-medium text-gray-900">
              {order.quantity}kg {order.productType}
            </p>
            <p className="text-sm text-gray-600">{order.buyerName || 'N/A'}</p>
              </div>
            </div>
            <div>
              <span className="inline-block bg-orange-50 text-orange-700 px-3 py-1 rounded text-sm font-medium">
            Pending
              </span>
            </div>
          </div>
            ))}
          </div>
        );
          })()}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="p-6 border-b bg-gray-50 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">List Product</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Product Type
                  </label>
                  <input
                    type="text"
                    id="productType"
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="e.g., Tomatoes, Maize"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Price per kg ($)
                  </label>
                  <input
                    type="number"
                    id="price"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 text-black rounded focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 resize-none"
                    placeholder="Add product details..."
                  ></textarea>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded font-medium hover:bg-gray-800 transition-colors"
                  >
                    List Product
                  </button>
                </div>
              </form>

              {message && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700 text-center">{message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
