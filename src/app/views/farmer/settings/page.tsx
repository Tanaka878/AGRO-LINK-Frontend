'use client';
import React, { useState } from 'react';
import { User, Bell, Lock, Sliders, ChevronRight } from 'lucide-react';

export default function SettingsPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const settingsCards = [
    {
      id: 'profile',
      icon: User,
      title: 'Profile Settings',
      description: 'Update your personal information, change your password, and manage your account details.',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notification Settings',
      description: 'Customize how you receive alerts about orders, messages, and market updates.',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'privacy',
      icon: Lock,
      title: 'Privacy Settings',
      description: 'Manage who can see your farm details, listings, and contact information.',
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'other',
      icon: Sliders,
      title: 'Other Settings',
      description: 'Configure language preferences, app theme, and other miscellaneous settings.',
      color: 'from-lime-500 to-lime-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and configurations</p>
        </div>

        {/* Settings Cards Grid */}
        <div className="grid gap-5 md:grid-cols-2">
          {settingsCards.map((card) => {
            const Icon = card.icon;
            const isHovered = hoveredCard === card.id;
            
            return (
              <div
                key={card.id}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="relative p-6">
                  {/* Icon and Title Row */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-700 transition-colors">
                        {card.title}
                      </h3>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-all duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed pl-14">
                    {card.description}
                  </p>
                </div>

                {/* Bottom Border Accent */}
                <div className={`h-1 bg-gradient-to-r ${card.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </div>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 text-center">
            Need help? Visit our{' '}
            <span className="text-emerald-600 font-medium hover:text-emerald-700 cursor-pointer">
              Support Center
            </span>{' '}
            or contact us directly.
          </p>
        </div>
      </div>
    </div>
  );
}