'use client';
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#2E7D32]">Settings</h2>

      <div className="grid gap-4">
        {/* Profile Settings Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-[#E0E0E0] hover:bg-[#F5F5DC] transition">
          <h3 className="font-semibold text-[#4CAF50] mb-2">Profile Settings</h3>
          <p className="text-[#6D4C41]">
            Update your personal information, change your password, and manage your account details.
          </p>
        </div>

        {/* Notification Settings Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-[#E0E0E0] hover:bg-[#F5F5DC] transition">
          <h3 className="font-semibold text-[#4CAF50] mb-2">Notification Settings</h3>
          <p className="text-[#6D4C41]">
            Customize how you receive alerts about orders, messages, and market updates.
          </p>
        </div>

        {/* Privacy Settings Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-[#E0E0E0] hover:bg-[#F5F5DC] transition">
          <h3 className="font-semibold text-[#4CAF50] mb-2">Privacy Settings</h3>
          <p className="text-[#6D4C41]">
            Manage who can see your farm details, listings, and contact information.
          </p>
        </div>

        {/* Other Settings Card */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-[#E0E0E0] hover:bg-[#F5F5DC] transition">
          <h3 className="font-semibold text-[#4CAF50] mb-2">Other Settings</h3>
          <p className="text-[#6D4C41]">
            Configure language preferences, app theme, and other miscellaneous settings.
          </p>
        </div>
      </div>
    </div>
  );
}
