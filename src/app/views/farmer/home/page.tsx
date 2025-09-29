'use client';
import React from 'react';

export default function HomePage() {
  return (
    <div className="space-y-6">
      {/* Top Section: Greeting + Sell Produce */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#2E7D32]">
          Good Morning, Wanjiku!
        </h1>
        <button className="bg-[#FBC02D] text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition">
          SELL PRODUCE
        </button>
      </div>

      {/* Stats Row */}
      <div className="flex gap-6 text-[#6D4C41]">
        <div>Pending Orders: 3</div>
        <div>Unread Messages: 5</div>
        <div>Live Listings: 12</div>
      </div>

      {/* Market Insights & Recent Orders */}
      <div className="grid grid-cols-2 gap-6">
        {/* Market Insights */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-[#E0E0E0] space-y-3">
          <h2 className="font-semibold text-[#2E7D32]">MARKET INSIGHTS</h2>
          <ul className="list-disc list-inside text-[#6D4C41]">
            <li>Tomato Price +15% 🔺 (Nairobi)</li>
            <li>Alert: High demand for maize in Eldoret</li>
          </ul>
          <button className="bg-[#4CAF50] text-white px-3 py-1 rounded-md hover:bg-[#2E7D32] transition">
            List Now
          </button>

          {/* Upcoming Live Session */}
          <div className="mt-4">
            <h3 className="font-semibold text-[#2E7D32]">UPCOMING LIVE SESSION</h3>
            <p>Pest Control Webinar (Tomorrow)</p>
            <button className="bg-[#FBC02D] text-white px-3 py-1 rounded-md mt-1 hover:bg-yellow-500 transition">
              Join Tomorrow 10AM
            </button>
          </div>
        </div>

        {/* Recent Orders & Messages */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-[#E0E0E0] space-y-3">
          <h2 className="font-semibold text-[#2E7D32]">RECENT ORDERS & MESSAGES</h2>
          {/* Orders */}
          <ul className="list-decimal list-inside text-[#6D4C41] space-y-1">
            <li>
              100kg Avocados - Buyer: CityMart | Status: Confirmed ✅
            </li>
            <li>
              50kg Fertilizer - Seller: AgroInput | Status: In Transit 🚚
            </li>
          </ul>

          {/* Messages */}
          <h3 className="font-semibold text-[#2E7D32] mt-3">MESSAGES:</h3>
          <ul className="list-disc list-inside text-[#6D4C41] space-y-1">
            <li>&quot;Hello, is the maize still available?&quot;</li>
            <li>&quot;Your question was answered in the forum.&quot;</li>
          </ul>
        </div>
      </div>

      {/* Community Feed & Farm Summary */}
      <div className="grid grid-cols-2 gap-6">
        {/* Community Feed */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-[#E0E0E0] space-y-2">
          <h2 className="font-semibold text-[#2E7D32]">MY COMMUNITY FEED</h2>
          <ul className="list-disc list-inside text-[#6D4C41] space-y-1">
            <li>Maria: &quot;Has anyone tried organic pest control?&quot;</li>
            <li>Group: Coffee Growers - New Event</li>
            <li>Expert Post: &quot;Soil Health Tips&quot;</li>
          </ul>
        </div>

        {/* Farm Summary */}
        <div className="bg-white shadow-md p-4 rounded-lg border border-[#E0E0E0] space-y-2">
          <h2 className="font-semibold text-[#2E7D32]">MY FARM SUMMARY</h2>
          <p>Live Listings: 5</p>
          <p>Crops: Maize, Beans, Coffee</p>
          <p>Livestock: 20 Chickens</p>
        </div>
      </div>
    </div>
  );
}
