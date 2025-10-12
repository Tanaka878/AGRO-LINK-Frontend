'use client';
import React, { useState, useEffect } from 'react';
import Base_URL from '@/app/api/route';
import { Order } from '../../Interface/Orders';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productType, setProductType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [farmerEmail, setFarmerEmail] = useState(''); 
  const [farmerName, setFarmerName] = useState('Farmer'); 
  const [orders, setOrders] = useState<Order[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Run only on client - single useEffect for mounting
  useEffect(() => {
    setIsMounted(true);
    const email = localStorage.getItem('email') || '';
    const name = localStorage.getItem('name') || 'Farmer';
    setFarmerEmail(email);
    setFarmerName(name);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${Base_URL}/api/listed-products/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType,
          quantity: parseInt(quantity, 10),
          farmerEmail,
        }),
      });

      if (!response.ok) throw new Error('Failed to list product');

      setMessage('✅ Product listed successfully!');
      setProductType('');
      setQuantity('');
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`❌ ${error.message}`);
      } else {
        setMessage('❌ An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders after farmerEmail is set
  useEffect(() => {
    if (!farmerEmail || !isMounted) return;

    const fetchOrders = async () => {
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

    fetchOrders();
  }, [farmerEmail, isMounted]);

  return (
    <div className="space-y-6 relative">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2E7D32]">
          Good Morning, {farmerName}!
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FBC02D] text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          SELL PRODUCE
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex gap-6 text-[#6D4C41]">
        <div>Pending Orders: 3</div>
        <div>Unread Messages: 5</div>
        <div>Live Listings: 12</div>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-2 gap-6">
        {/* Market Insights */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-[#E0E0E0] space-y-3">
          <h2 className="font-semibold text-[#2E7D32]">MARKET INSIGHTS</h2>
          <ul className="list-disc list-inside text-[#6D4C41]">
            <li>Tomato Price +15% 🔺 (Nairobi)</li>
            <li>Alert: High demand for maize in Eldoret</li>
          </ul>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#4CAF50] text-white px-3 py-1 rounded-md hover:bg-[#2E7D32] transition"
          >
            List Now
          </button>
        </div>

        {/* Recent Orders & Messages */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-[#E0E0E0] space-y-3">
          <h2 className="font-semibold text-[#2E7D32]">RECENT ORDERS & MESSAGES</h2>
          <ul className="list-decimal list-inside text-[#6D4C41] space-y-1">
            {!isMounted ? (
              <li className="text-gray-500">Loading...</li>
            ) : orders.length === 0 ? (
              <li className="text-gray-500">Nothing to display</li>
            ) : (
              orders.map((order) => (
                <li key={order.id}>
                  {order.quantity}kg {order.productType} - Buyer: {order.buyerName || 'N/A'} | Status: {order.status === 'COLLECTED' ? 'Collected ✅' : 'Pending ⏳'}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-[#2E7D32] mb-4 text-center">
              List Your Product
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[#6D4C41] font-medium mb-1">
                  Product Type
                </label>
                <input
                  type="text"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  required
                  className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#4CAF50] outline-none"
                  placeholder="e.g. Maize, Tomatoes"
                />
              </div>

              <div>
                <label className="block text-[#6D4C41] font-medium mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full border text-black border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#4CAF50] outline-none"
                  placeholder="e.g. 50"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg text-gray-800 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#4CAF50] text-white rounded-lg hover:bg-[#2E7D32] transition"
                >
                  {loading ? 'Listing...' : 'Submit'}
                </button>
              </div>
            </form>

            {message && (
              <p className="text-center mt-3 text-sm text-[#6D4C41]">{message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}