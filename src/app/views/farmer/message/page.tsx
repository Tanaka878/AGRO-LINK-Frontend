'use client';
import React from 'react';

export default function MessagesPage() {
  // Hardcoded messages data
  const messages = [
    {
      sender: 'Maria',
      message: 'Has anyone tried the new organic fertilizer?',
      time: 'Today, 09:15 AM',
    },
    {
      sender: 'Coffee Growers Group',
      message: 'New event: Workshop on sustainable farming techniques.',
      time: 'Yesterday, 04:30 PM',
    },
    {
      sender: 'Agro Expert',
      message: 'Soil Health Tips: Rotate crops to improve yield.',
      time: 'Yesterday, 11:00 AM',
    },
    {
      sender: 'Buyer CityMart',
      message: 'Hello, is the maize still available?',
      time: 'Today, 08:45 AM',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#2E7D32]">Messages</h2>

      <div className="grid gap-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md border border-[#E0E0E0] hover:bg-[#F5F5DC] transition"
          >
            <div className="flex justify-between items-center mb-1">
              <p className="font-semibold text-[#4CAF50]">{msg.sender}</p>
              <span className="text-sm text-gray-500">{msg.time}</span>
            </div>
            <p className="text-[#6D4C41]">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
