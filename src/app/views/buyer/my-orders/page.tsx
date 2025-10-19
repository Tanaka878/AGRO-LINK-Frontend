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
  proofOfPaymentUrl?: string;
}

const BASE_URL = 'http://localhost:8080';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch proof for a single order using GET request with query parameter
  const fetchProofForOrder = async (orderId: number): Promise<string | null> => {
    try {
      const res = await fetch(`/api/orders/upload-proof?orderId=${orderId}`);
      if (res.ok) {
        const data = await res.json();
        return data.proofUrl;
      }
      return null;
    } catch (err) {
      console.log('No proof found for order:', orderId);
      return null;
    }
  };

  // Delete order function
  const deleteOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setMessage('Order deleted successfully ✅');
      
      // Remove the order from local state
      setOrders(orders.filter(order => order.id !== orderId));
      
      // Close modal if the deleted order was selected
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(null);
      }
      
    } catch (err) {
      console.error('Error deleting order:', err);
      setMessage('Failed to delete order ❌');
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Fetch orders and their proofs
  useEffect(() => {
    const fetchOrdersAndProofs = async () => {
      const buyerEmail = localStorage.getItem('email');
      if (!buyerEmail) {
        setLoading(false);
        return;
      }

      try {
        const encodedEmail = encodeURIComponent(buyerEmail);
        const ordersRes = await fetch(`http://localhost:8080/api/orders/buyer/${encodedEmail}`);
        
        if (!ordersRes.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const ordersData: Order[] = await ordersRes.json();
        
        // Set orders immediately (without proofs)
        setOrders(ordersData);
        
        // Then load proofs for each order individually
        const ordersWithProofs = await Promise.all(
          ordersData.map(async (order) => {
            const proofUrl = await fetchProofForOrder(order.id);
            return { ...order, proofOfPaymentUrl: proofUrl || undefined };
          })
        );
        
        setOrders(ordersWithProofs);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndProofs();
  }, []);

  // Handle proof upload using POST request
  const handleFileUpload = async () => {
    if (!selectedOrder || !selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('orderId', selectedOrder.id.toString());

    try {
      setUploading(true);

      const res = await fetch('/api/orders/upload-proof', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await res.json();

      alert('✅ Proof of payment uploaded successfully!');
      setSelectedFile(null);
      setSelectedOrder(null);

      // Update proof URL locally in state
      const updatedOrders = orders.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, proofOfPaymentUrl: data.proofUrl }
          : o
      );
      setOrders(updatedOrders);
      
    } catch (err: any) {
      console.error('Upload error:', err);
      alert(err.message || 'An error occurred while uploading.');
    } finally {
      setUploading(false);
    }
  };

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

      {message && (
        <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-900 text-sm text-center">
          {message}
        </div>
      )}

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
              <span className="font-semibold">
                #{order.id} - {order.productType}
              </span>
              <span className="text-gray-500 text-sm">{order.quantity} pcs</span>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`font-semibold ${
                  order.status === 'PENDING'
                    ? 'text-yellow-600'
                    : order.status === 'CANCELLED'
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {order.status}
              </span>
              <span className="text-gray-500 text-sm">
                {new Date(order.orderTime).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setSelectedOrder(order)}
                className="bg-slate-700 text-white px-3 py-1 rounded-md hover:bg-slate-800 transition-colors text-sm"
              >
                View Order
              </button>
              <button
                onClick={() => deleteOrder(order.id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
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
            <div className="p-6 space-y-3">
              <p><span className="font-semibold">Order ID:</span> {selectedOrder.id}</p>
              <p><span className="font-semibold">Product:</span> {selectedOrder.productType}</p>
              <p><span className="font-semibold">Quantity:</span> {selectedOrder.quantity} pcs</p>
              <p><span className="font-semibold">Price per Unit:</span> ${selectedOrder.pricePerUnit}</p>
              <p><span className="font-semibold">Total Price:</span> ${selectedOrder.totalPrice}</p>
              <p><span className="font-semibold">Farmer Email:</span> {selectedOrder.farmerEmail}</p>
              <p>
                <span className="font-semibold">Status:</span>{' '}
                <span className={`font-semibold ${
                  selectedOrder.status === 'PENDING' ? 'text-yellow-600' :
                  selectedOrder.status === 'CANCELLED' ? 'text-red-600' : 'text-green-600'
                }`}>
                  {selectedOrder.status}
                </span>
              </p>

              {/* Upload Proof Section */}
              <div className="mt-4 border-t pt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Upload Proof of Payment</h3>

                {selectedOrder.proofOfPaymentUrl ? (
                  <div>
                    <p className="text-green-600 font-medium mb-2">Proof Uploaded ✅</p>
                    <img
                      src={selectedOrder.proofOfPaymentUrl}
                      alt="Proof of Payment"
                      className="w-40 h-40 object-cover rounded-md border"
                    />
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="mb-2 w-full border border-gray-300 rounded p-2"
                    />
                    <button
                      onClick={handleFileUpload}
                      disabled={!selectedFile || uploading}
                      className={`w-full py-2 rounded-md text-white transition-colors ${
                        uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {uploading ? 'Uploading...' : 'Upload Proof'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-between">
              <button
                onClick={() => deleteOrder(selectedOrder.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors font-medium text-sm"
              >
                Delete Order
              </button>
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setSelectedFile(null);
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