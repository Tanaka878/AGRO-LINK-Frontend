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
  paymentStatus?: string; // Add payment status to the interface
}

const BASE_URL = 'http://localhost:8081'; // adjust if needed

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [loadingProof, setLoadingProof] = useState(false);

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

  // Fetch proof of payment when an order is selected
  const fetchProofOfPayment = async (orderId: number) => {
    try {
      setLoadingProof(true);
      setProofImage(null);
      
      const response = await fetch(`/api/orders/upload-proof?orderId=${orderId}`);
      
      if (response.ok) {
        const data = await response.json();
        setProofImage(data.proofUrl);
      } else {
        console.log('No proof found for order:', orderId);
        setProofImage(null);
      }
    } catch (err) {
      console.error('Error fetching proof:', err);
      setProofImage(null);
    } finally {
      setLoadingProof(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // When selected order changes, fetch its proof
  useEffect(() => {
    if (selectedOrder) {
      fetchProofOfPayment(selectedOrder.id);
    }
  }, [selectedOrder]);

  const markAsCollected = async (orderId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/update-status/${orderId}?status=COMPLETED`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to update order status');

      setMessage('Order marked as collected successfully ✅');
      fetchOrders();
    } catch (err) {
      console.error(err);
      setMessage('Failed to mark as collected ❌');
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const cancelOrder = async (orderId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/orders/cancel/${orderId}`, {
        method: 'PUT',
      });

      if (!response.ok) throw new Error('Failed to cancel order');

      setMessage('Order cancelled successfully ❌');
      fetchOrders();
    } catch (err) {
      console.error(err);
      setMessage('Failed to cancel order ❌');
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Complete function for Confirm Payment
  const confirmPayment = async (orderId: number) => {
    try {
      console.log('Confirming payment for order:', orderId);
      
      const response = await fetch(`${BASE_URL}/api/orders/update-payment-status/${orderId}?paymentStatus=PAID`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      setMessage('Payment confirmed successfully ✅');
      fetchOrders(); // Refresh orders to get updated payment status
      setSelectedOrder(null); // Close the modal
      
    } catch (error) {
      console.error('Error confirming payment:', error);
      setMessage('Failed to confirm payment ❌');
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
                <th className="py-3 px-4 text-left">Payment Status</th>
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
                          : order.status === 'COLLECTED'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 text-sm font-semibold rounded ${
                        order.paymentStatus === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : order.paymentStatus === 'REFUNDED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.paymentStatus || 'PENDING'}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex gap-2">
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => markAsCollected(order.id)}
                          className="px-3 py-1.5 text-sm bg-green-700 hover:bg-green-800 text-white rounded transition"
                        >
                          Mark as Collected
                        </button>
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded transition"
                        >
                          Cancel Order
                        </button>
                      </>
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
                    selectedOrder.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : selectedOrder.status === 'COLLECTED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedOrder.status}
                </span>
              </p>
              <p>
                <span className="font-semibold">Payment Status:</span>{' '}
                <span
                  className={`inline-block px-2 py-1 text-sm font-semibold rounded ${
                    selectedOrder.paymentStatus === 'PAID'
                      ? 'bg-green-100 text-green-800'
                      : selectedOrder.paymentStatus === 'CANCELLED'
                      ? 'bg-red-100 text-red-800'
                      : selectedOrder.paymentStatus === 'REFUNDED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedOrder.paymentStatus || 'PENDING'}
                </span>
              </p>
              <p>
                <span className="font-semibold">Order Time:</span>{' '}
                {new Date(selectedOrder.orderTime).toLocaleString()}
              </p>

              {/* Proof of Payment Section */}
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Proof of Payment</h3>
                
                {loadingProof ? (
                  <div className="text-gray-500 text-sm">Loading proof of payment...</div>
                ) : proofImage ? (
                  <div>
                    <p className="text-green-600 font-medium mb-2">Proof Available ✅</p>
                    <img
                      src={proofImage}
                      alt="Proof of Payment"
                      className="w-full max-w-xs h-auto object-cover rounded-md border shadow-sm"
                    />
                    <p className="text-gray-500 text-sm mt-2">
                      Buyer has uploaded proof of payment for this order.
                    </p>
                    
                    {/* Confirm Payment Button - Only show when proof is available AND payment is not already confirmed */}
                    {selectedOrder.paymentStatus !== 'PAID' && (
                      <button
                        onClick={() => confirmPayment(selectedOrder.id)}
                        className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm"
                      >
                        Confirm Payment
                      </button>
                    )}
                    {selectedOrder.paymentStatus === 'PAID' && (
                      <p className="text-green-600 font-medium mt-3">Payment Already Confirmed ✅</p>
                    )}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm">
                    <p>No proof of payment uploaded yet.</p>
                    <p className="text-yellow-600 mt-1">
                      Waiting for buyer to upload payment proof.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-2">
              {selectedOrder.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => {
                      markAsCollected(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                    className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors font-medium text-sm"
                  >
                    Mark as Collected
                  </button>
                  <button
                    onClick={() => {
                      cancelOrder(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium text-sm"
                  >
                    Cancel Order
                  </button>
                </>
              )}
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setProofImage(null);
                }}
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