'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface Product {
  id: number;
  productType: string;
  quantity: number;
  price: number; // Changed from pricePerUnit to price to match your DTO
  farmerEmail: string;
  farmerComments: string[] | null;
}

interface Order {
  id: number;
  productType: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  farmerEmail: string;
  buyerEmail: string;
  status: string;
  orderTime: string;
}

function FarmerProfileModal({
  farmerEmail,
  comments,
  onClose,
  onNewComment,
}: {
  farmerEmail: string;
  comments: string[] | null;
  onClose: () => void;
  onNewComment: (newComment: string) => void;
}) {
  const [newComment, setNewComment] = useState('');
  const safeComments = comments || [];

  const handleSubmit = async () => {
    const authorName = localStorage.getItem('userName') || 'Anonymous';
    if (!newComment.trim()) return;

    try {
      const encodedEmail = encodeURIComponent(farmerEmail);
      const response = await fetch(
        `http://localhost:8080/api/farmers/${encodedEmail}/addComment`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newComment, authorName }),
        }
      );

      if (!response.ok) throw new Error('Failed to save comment');

      await response.text();
      onNewComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error(error);
      alert('Failed to save comment. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Farmer Profile</h2>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Email Address</p>
            <p className="text-gray-800 font-medium">{farmerEmail || 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-sm text-gray-500 uppercase tracking-wide mb-3">Comments & Reviews</h3>
            {safeComments.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                {safeComments.map((c, i) => (
                  <div key={i} className="bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                    {c}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic mb-4">No comments available.</p>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Leave a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-400"
              />
              <button
                onClick={handleSubmit}
                className="bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-700 text-white px-6 py-2 rounded-md hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function BuyModal({
  product,
  onClose,
  onOrderCreated,
}: {
  product: Product;
  onClose: () => void;
  onOrderCreated: () => void;
}) {
  const [quantity, setQuantity] = useState(1);
  const [specification, setSpecification] = useState('');

  const handleConfirmOrder = async () => {
    const buyerEmail = localStorage.getItem('email') || 'anonymous@example.com';
    const pricePerUnit = product.price; // Use the actual product price from the product

    const orderData = {
      productType: product.productType,
      quantity,
      pricePerUnit,
      farmerEmail: product.farmerEmail,
      buyerEmail,
      status: 'PENDING',
    };

    try {
      const response = await fetch('http://localhost:8080/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error('Failed to create order');

      const createdOrder: Order = await response.json();
      alert(`Order created successfully! Order ID: ${createdOrder.id}\nSpecification: ${specification}`);
      onOrderCreated();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to create order. Please try again.');
    }
  };

  const totalPrice = (quantity * product.price).toFixed(2);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Buy {product.productType}</h2>

        <div className="mb-4 space-y-2">
          <p className="text-gray-600">Available: {product.quantity} units</p>
          <p className="text-green-600 font-semibold">Price: ${product.price?.toFixed(2)} per unit</p>
          
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input
            type="number"
            min={1}
            max={product.quantity}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-400"
          />
          
          {quantity > 0 && (
            <p className="text-lg font-semibold text-blue-600">
              Total: ${totalPrice}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Specification / Notes</label>
          <textarea
            value={specification}
            onChange={(e) => setSpecification(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-400"
          ></textarea>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmOrder}
            className="bg-slate-700 text-white px-4 py-2 rounded-md hover:bg-slate-800 transition-colors font-medium text-sm"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MarketPlace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/listed-products/all')
      .then((res) => res.json())
      .then((data: Product[]) => {
        const normalizedData = Array.isArray(data)
          ? data.map((product) => ({
              ...product,
              farmerComments: product.farmerComments || [],
              farmerEmail: product.farmerEmail || 'Unknown',
              productType: product.productType || 'Unknown Product',
              quantity: product.quantity || 0,
              price: product.price || 0, // Ensure price is included
            }))
          : [];
        setProducts(normalizedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setProducts([]);
        setLoading(false);
      });
  }, []);

  const getProductImage = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('maize')) return '/images/maize.jpg';
    if (lowerType.includes('mango')) return '/images/mango.jpg';
    if (lowerType.includes('beef')) return '/images/beef.webp';
    if (lowerType.includes('fertilizer')) return '/images/fertilizer.jpg';
    if (lowerType.includes('beans')) return '/images/beans.jpg';
    if (lowerType.includes('tomato')) return '/images/tomatoes.webp';
    return '/images/default.jpg';
  };

  const farmerDefaultImage = '/images/profile.avif';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="mt-2 text-gray-600">Browse available products from local farmers</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden flex flex-col"
            >
              <div className="relative w-full h-44">
                <Image
                  src={getProductImage(product.productType)}
                  alt={product.productType}
                  className="object-cover"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.productType}</h3>
                <p className="text-sm text-gray-600 mb-1">Available: {product.quantity} units</p>
                <p className="text-green-600 font-semibold mb-3">
                  ${product.price?.toFixed(2)} per unit
                </p>

                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <Image
                    src={farmerDefaultImage}
                    alt="Farmer"
                    className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 hover:border-slate-600 transition-colors"
                    onClick={() => setSelectedFarmer(product)}
                    width={32}
                    height={32}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 truncate">{product.farmerEmail}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProduct(product)}
                  className="w-full bg-slate-700 text-white py-2.5 rounded-md hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        )}
      </div>

      {selectedFarmer && (
        <FarmerProfileModal
          farmerEmail={selectedFarmer.farmerEmail}
          comments={selectedFarmer.farmerComments}
          onClose={() => setSelectedFarmer(null)}
          onNewComment={(newComment) => {
            setSelectedFarmer((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                farmerComments: [...(prev.farmerComments || []), newComment],
              };
            });
            setProducts((prev) =>
              prev.map((p) =>
                p.id === selectedFarmer.id
                  ? { ...p, farmerComments: [...(p.farmerComments || []), newComment] }
                  : p
              )
            );
          }}
        />
      )}

      {selectedProduct && (
        <BuyModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOrderCreated={() => {}}
        />
      )}
    </div>
  );
}