'use client';
import React, { useState } from 'react';
import { Bell, User, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // ✅ Get user data from localStorage (token + email + username)
  const email =
    typeof window !== 'undefined'
      ? localStorage.getItem('email') || 'F'
      : 'F';

  // Get first letter of email for "avatar"
  const avatarLetter = email.charAt(0).toUpperCase();

  return (
    <nav className="w-full bg-[#4CAF50] px-6 py-3 flex items-center justify-end shadow-md gap-6 relative">
      {/* Notifications */}
      <button className="relative text-white hover:text-[#FBC02D] transition-colors">
        <Bell size={24} />
        {/* Example: show unread notification dot */}
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
      </button>

      {/* Profile circle */}
      <div className="relative">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-full bg-[#2E7D32] text-white font-bold cursor-pointer hover:bg-[#388E3C] transition-all hover:shadow-lg"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {avatarLetter}
        </div>

        {/* Dropdown menu */}
        {dropdownOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            ></div>

            {/* Dropdown */}
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              {/* User info header */}
              <div className="px-4 py-3 bg-gradient-to-r from-[#4CAF50] to-[#66BB6A] text-white">
                <p className="text-sm font-semibold truncate">{email}</p>
                <p className="text-xs opacity-90">Farmer Account</p>
              </div>

              {/* Menu items */}
              <ul className="py-2">
                <li>
                  <button className="w-full text-gray-700 text-left px-4 py-2.5 hover:bg-[#E8F5E9] transition-colors flex items-center gap-3 group">
                    <User size={18} className="text-[#4CAF50] group-hover:text-[#2E7D32]" />
                    <span className="font-medium">Profile</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-gray-700 text-left px-4 py-2.5 hover:bg-[#E8F5E9] transition-colors flex items-center gap-3 group">
                    <Settings size={18} className="text-[#4CAF50] group-hover:text-[#2E7D32]" />
                    <span className="font-medium">Settings</span>
                  </button>
                </li>

                {/* Divider */}
                <li className="my-2 border-t border-gray-200"></li>

                <li>
                  <button
                    className="w-full text-red-600 text-left px-4 py-2.5 hover:bg-red-50 transition-colors flex items-center gap-3 group"
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = '/login';
                    }}
                  >
                    <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
                    <span className="font-medium">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}