'use client';
import React, { useEffect, useState } from 'react';

interface ListedProduct {
  id: number;
  productType: string;
  quantity: number;
  pricePerUnit: number; // Add this
  farmerEmail: string;
}

const BASE_URL = 'http://localhost:8080';

// Predefined list of products
const PRODUCT_TYPES = [
  'MAIZE',
  'TOMATOES', 
  'BEANS',
  'BEEF'
];

export default function MyProducts() {
  const [products, setProducts] = useState<ListedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productType: '',
    quantity: '',
    pricePerUnit: '', // Add this
  });

  // Fetch farmer's products
  const fetchMyProducts = async () => {
    try {
      const farmerEmail = localStorage.getItem('email');
      if (!farmerEmail) {
        setLoading(false);
        return;
      }

      const encodedEmail = encodeURIComponent(farmerEmail);
      const response = await fetch(`${BASE_URL}/api/listed-products/farmer/${encodedEmail}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: ListedProduct[] = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setMessage('Failed to load products ❌');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  // Delete product function
  const deleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/listed-products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setMessage('Product deleted successfully ✅');
      
      // Remove the product from local state
      setProducts(products.filter(product => product.id !== productId));
      
    } catch (err) {
      console.error('Error deleting product:', err);
      setMessage('Failed to delete product ❌');
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Add new product function
  const addProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const farmerEmail = localStorage.getItem('email');
      if (!farmerEmail) {
        setMessage('Please log in to add products ❌');
        return;
      }

      if (!newProduct.productType) {
        setMessage('Please select a product type ❌');
        return;
      }

      const productData = {
        productType: newProduct.productType,
        quantity: parseInt(newProduct.quantity),
        pricePerUnit: parseFloat(newProduct.pricePerUnit), // Add this
        farmerEmail: farmerEmail,
      };

      const response = await fetch(`${BASE_URL}/api/listed-products/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      const savedProduct: ListedProduct = await response.json();
      
      setMessage('Product added successfully ✅');
      setProducts([...products, savedProduct]);
      setShowAddForm(false);
      setNewProduct({ productType: '', quantity: '', pricePerUnit: '' });
      
    } catch (err) {
      console.error('Error adding product:', err);
      setMessage('Failed to add product ❌');
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="text-gray-600">Loading your products...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#FAFAFA] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#2E7D32]">My Listed Products</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium"
        >
          Add New Product
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 rounded bg-green-50 border border-green-200 text-green-900 text-sm text-center">
          {message}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven&apos;t listed any products yet.</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors font-medium"
          >
            List Your First Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md border border-[#E0E0E0] p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{product.productType}</h3>
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                  ID: #{product.id}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-gray-600">
                  <span className="font-medium">Quantity:</span> {product.quantity} units
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Price per Unit:</span> ${product.pricePerUnit?.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Total Value:</span> ${(product.quantity * product.pricePerUnit)?.toFixed(2)}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Farmer Email:</span> {product.farmerEmail}
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Add New Product</h2>
            </div>
            
            <form onSubmit={addProduct} className="p-6 space-y-4">
              <div>
                <label htmlFor="productType" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Type
                </label>
                <select
                  id="productType"
                  required
                  value={newProduct.productType}
                  onChange={(e) => setNewProduct({ ...newProduct, productType: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a product type</option>
                  {PRODUCT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity (units)
                </label>
                <input
                  type="number"
                  id="quantity"
                  required
                  min="1"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>

              <div>
                <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Unit ($)
                </label>
                <input
                  type="number"
                  id="pricePerUnit"
                  required
                  min="0.01"
                  step="0.01"
                  value={newProduct.pricePerUnit}
                  onChange={(e) => setNewProduct({ ...newProduct, pricePerUnit: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter price per unit"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewProduct({ productType: '', quantity: '', pricePerUnit: '' });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors font-medium text-sm"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}