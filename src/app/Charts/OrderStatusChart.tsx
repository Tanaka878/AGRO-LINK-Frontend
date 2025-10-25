"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface OrderStats {
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

// Professional agricultural color palette
const COLORS = ["#F59E0B", "#10B981", "#EF4444"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-sm text-gray-600">
          Orders: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function OrderStatusChart() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) {
      setError("No email found");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8081/api/farmers/statistics/${email}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch statistics");
        return res.json();
      })
      .then((stats: OrderStats) => {
        setData([
          { name: "Pending", value: stats.pendingOrders },
          { name: "Completed", value: stats.completedOrders },
          { name: "Cancelled", value: stats.cancelledOrders },
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  const totalOrders = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800">Order Status Overview</h2>
        <p className="text-sm text-gray-600 mt-1">
          Track your order distribution and performance
        </p>
      </div>

      {/* Content Section */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading statistics...</p>
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
        ) : totalOrders === 0 ? (
          <div className="flex items-center justify-center h-80">
            <div className="text-center text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="font-semibold">No orders yet</p>
              <p className="text-sm mt-2">Your order statistics will appear here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {data.map((item, index) => (
                <div key={item.name} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    ></div>
                    <p className="text-xs font-medium text-gray-600">{item.name}</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{item.value}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {((item.value / totalOrders) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(Number(percent) * 100).toFixed(0)}%`
                    }
                    strokeWidth={2}
                    stroke="#fff"
                  >
                    {data.map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Total Summary */}
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Total Orders</p>
                  <p className="text-xs text-green-600 mt-1">All time statistics</p>
                </div>
                <p className="text-3xl font-bold text-green-700">{totalOrders}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}