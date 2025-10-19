'use client';
import React, { useState } from 'react';
import { User, Bell, Lock, Sliders, ChevronRight, Key, Mail } from 'lucide-react';

export default function SettingsPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/user/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('If the email exists, a reset link has been sent to your email.');
        setEmail('');
      } else {
        setMessage('Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmPassword) {
      setMessage('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/user/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword,
          resetToken: 'direct-reset' // Since we're doing direct reset
        }),
      });

      const data = await response.text();

      if (response.ok) {
        setMessage('Password reset successfully!');
        setEmail('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          setActiveModal(null);
          setMessage('');
        }, 2000);
      } else {
        setMessage(data || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const PasswordResetModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Key className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Password Reset</h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Confirm new password"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.includes('successfully') 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => {
                setActiveModal(null);
                setMessage('');
                setEmail('');
                setNewPassword('');
                setConfirmPassword('');
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>

          <div className="border-t pt-4">
            <button
              onClick={handleForgotPassword}
              disabled={isLoading || !email}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail className="w-4 h-4" />
              <span>Send Reset Link via Email</span>
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              This will send a password reset link to your email instead
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const handleCardClick = (cardId: string) => {
    if (cardId === 'profile') {
      setActiveModal('password-reset');
    }
    // Add handlers for other cards here
  };

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
                onClick={() => handleCardClick(card.id)}
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

        {/* Password Reset Modal */}
        {activeModal === 'password-reset' && <PasswordResetModal />}
      </div>
    </div>
  );
}