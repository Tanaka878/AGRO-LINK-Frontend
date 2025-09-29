'use client';
import React, { ReactNode, useState } from 'react';
import { Home, MapPin, ShoppingCart, MessageCircle, Settings } from 'lucide-react';
import Navbar from '../../navbar/page';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [active, setActive] = useState('Home');

  const menuItems = [
    { name: 'Home', icon: <Home size={20} /> },
    { name: 'My Farm', icon: <MapPin size={20} /> },
    { name: 'Market', icon: <ShoppingCart size={20} /> },
    { name: 'Messages', icon: <MessageCircle size={20} /> },
    { name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen flex bg-[#FAFAFA]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E0E0E0] flex flex-col">
        <div className="text-2xl font-extrabold text-[#4CAF50] text-center py-6 tracking-widest">
          AGRO<span className="text-[#FBC02D]">LINK</span>
        </div>

        <nav className="flex-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActive(item.name)}
              className={`flex items-center gap-3 w-full px-6 py-3 text-left hover:bg-[#F5F5DC] ${
                active === item.name ? 'bg-[#E8F5E9] font-semibold text-[#2E7D32]' : 'text-[#6D4C41]'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
