'use client';

import React, { useEffect, useState } from 'react';

interface Farmer {
  id: number;
  fullname: string;
  username: string;
  email: string;
  gender: string;
  farmName: string;
  farmLocation: string;
  farmSize: number;
  farmingMethods: string;
  experienceLevel: string;
  cropsGrown: string[];
  livestockOwned: string[];
  equipmentAvailable: string[];
  certifications: string[];
  marketPreferences: string[];
}

export default function MyFarmPage() {
  const [farmData, setFarmData] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (!email) {
      setError('No logged-in user found.');
      setLoading(false);
      return;
    }

    const fetchFarmData = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/farmers/getByEmail/${encodeURIComponent(email)}`
        );
        if (!response.ok) throw new Error('Failed to fetch farm data');
        const data: Farmer = await response.json();
        setFarmData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmData();
  }, []);

  if (loading) return <p className="text-black bg-white">Loading farm data...</p>;
  if (error) return <p className="text-red-600 bg-white">{error}</p>;
  if (!farmData) return null;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="space-y-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[#2E7D32]">My Farm Overview</h2>

        {/* Farmer Info */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
          <p><span className="font-semibold text-black">Full Name:</span> <span className="text-black">{farmData.fullname}</span></p>
          <p><span className="font-semibold text-black">Email:</span> <span className="text-black">{farmData.email}</span></p>
          <p><span className="font-semibold text-black">Username:</span> <span className="text-black">{farmData.username}</span></p>
          <p><span className="font-semibold text-black">Gender:</span> <span className="text-black">{farmData.gender}</span></p>
        </div>

        {/* Farm Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
          <p><span className="font-semibold text-black">Farm Name:</span> <span className="text-black">{farmData.farmName}</span></p>
          <p><span className="font-semibold text-black">Location:</span> <span className="text-black">{farmData.farmLocation}</span></p>
          <p><span className="font-semibold text-black">Farm Size:</span> <span className="text-black">{farmData.farmSize} hectares</span></p>
          <p><span className="font-semibold text-black">Farming Methods:</span> <span className="text-black">{farmData.farmingMethods}</span></p>
          <p><span className="font-semibold text-black">Experience Level:</span> <span className="text-black">{farmData.experienceLevel}</span></p>
        </div>

        {/* Crops & Livestock */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
            <h3 className="font-semibold mb-2 text-[#4CAF50]">Crops Grown</h3>
            <ul className="list-disc list-inside text-black">
              {farmData.cropsGrown?.length > 0 ? (
                farmData.cropsGrown.map((crop, index) => <li key={index}>{crop}</li>)
              ) : (
                <li>No crops listed</li>
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
            <h3 className="font-semibold mb-2 text-[#4CAF50]">Livestock Owned</h3>
            <ul className="list-disc list-inside text-black">
              {farmData.livestockOwned?.length > 0 ? (
                farmData.livestockOwned.map((animal, index) => <li key={index}>{animal}</li>)
              ) : (
                <li>No livestock listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* Equipment & Certifications */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
            <h3 className="font-semibold mb-2  text-[#4CAF50]">Equipment Available</h3>
            <ul className="list-disc list-inside text-black">
              {farmData.equipmentAvailable?.length > 0 ? (
                farmData.equipmentAvailable.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>No equipment listed</li>
              )}
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
            <h3 className="font-semibold mb-2 text-[#4CAF50]">Certifications & Market Preferences</h3>
            <p>
              <span className="font-semibold text-black">Certifications:</span>{' '}
              <span className="text-black">
                {farmData.certifications?.length > 0 ? farmData.certifications.join(', ') : 'None'}
              </span>
            </p>
            <p>
              <span className="font-semibold text-black">Market Preferences:</span>{' '}
              <span className="text-black">
                {farmData.marketPreferences?.length > 0 ? farmData.marketPreferences.join(', ') : 'None'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
