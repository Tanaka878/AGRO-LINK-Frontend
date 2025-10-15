"use client";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import Base_URL from "@/app/api/route";

interface ProductStat {
  productType: string;
  totalQuantity: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-800 mb-1">{label}</p>
        <p className="text-sm text-gray-600">
          Quantity Sold: <span className="font-bold text-green-700">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function TopSellingProductsChart() {
  const [data, setData] = useState<ProductStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const email = localStorage.getItem("email");
    if (!email) {
      setError("No email found");
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`${Base_URL}/api/farmers/statistics/${email}`, {
          method: "GET",
        });
        
        if (!res.ok) throw new Error("Failed to fetch statistics");
        
        const stats = await res.json();
        setData(stats.topSellingProducts || []);
      } catch (err) {
        console.error("Error fetching top-selling products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const totalQuantity = data.reduce((sum, item) => sum + item.totalQuantity, 0);
  const topProduct = data.length > 0 ? data.reduce((prev, current) => 
    (prev.totalQuantity > current.totalQuantity) ? prev : current
  ) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Top-Selling Products</h2>
            <p className="text-sm text-gray-600 mt-1">
              Your best performing products by quantity
            </p>
          </div>
          {!loading && !error && data.length > 0 && (
            <div className="bg-white rounded-lg px-4 py-2 border border-green-200">
              <p className="text-xs text-gray-600">Total Sold</p>
              <p className="text-2xl font-bold text-green-700">{totalQuantity}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading product data...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center text-red-600">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="font-semibold">No sales data yet</p>
              <p className="text-sm mt-2">Start selling products to see your statistics</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top Performer Badge */}
            {topProduct && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-4 border border-green-300">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 rounded-full p-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Top Performer</p>
                    <p className="text-lg font-bold text-gray-800">{topProduct.productType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-700">{topProduct.totalQuantity}</p>
                    <p className="text-xs text-gray-600">units sold</p>
                  </div>
                </div>
              </div>
            )}

            {/* Chart */}
            <div className="h-80 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={data} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="productType" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    style={{ fontSize: '12px', fill: '#6b7280' }}
                  />
                  <YAxis 
                    style={{ fontSize: '12px', fill: '#6b7280' }}
                    label={{ value: 'Quantity Sold', angle: -90, position: 'insideLeft', style: { fill: '#6b7280' } }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '10px' }}
                    iconType="circle"
                  />
                  <Bar 
                    dataKey="totalQuantity" 
                    fill="#10B981" 
                    name="Quantity Sold"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={80}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Product Summary List */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Product Breakdown</h3>
              <div className="space-y-2">
                {data.map((product, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{product.productType}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-800">{product.totalQuantity}</span>
                      <span className="text-xs text-gray-500 ml-1">units</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}