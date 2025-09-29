'use client';
import React from 'react';

export default function MyFarmPage() {
  // Hardcoded example data
  const farmData = {
    farmName: 'Sunrise Farms',
    farmLocation: 'Nairobi, Kenya',
    farmSize: 12.5, // hectares
    farmingMethods: 'Organic',
    experienceLevel: 'Intermediate',
    cropsGrown: ['Maize', 'Beans', 'Tomatoes'],
    livestockOwned: ['20 Chickens', '5 Goats'],
    equipmentAvailable: ['Tractor', 'Plough', 'Irrigation System'],
    certifications: ['Organic Certified', 'Fair Trade'],
    marketPreferences: ['Local Markets', 'Export'],
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#2E7D32]">
        My Farm Overview
      </h2>

      {/* Farm Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
        <p>
          <span className="font-semibold">Farm Name:</span> {farmData.farmName}
        </p>
        <p>
          <span className="font-semibold">Location:</span> {farmData.farmLocation}
        </p>
        <p>
          <span className="font-semibold">Farm Size:</span> {farmData.farmSize} hectares
        </p>
        <p>
          <span className="font-semibold">Farming Methods:</span> {farmData.farmingMethods}
        </p>
        <p>
          <span className="font-semibold">Experience Level:</span> {farmData.experienceLevel}
        </p>
      </div>

      {/* Crops & Livestock */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
          <h3 className="font-semibold mb-2 text-[#4CAF50]">Crops Grown</h3>
          <ul className="list-disc list-inside">
            {farmData.cropsGrown.map((crop, index) => (
              <li key={index}>{crop}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
          <h3 className="font-semibold mb-2 text-[#4CAF50]">Livestock Owned</h3>
          <ul className="list-disc list-inside">
            {farmData.livestockOwned.map((animal, index) => (
              <li key={index}>{animal}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Equipment & Certifications */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
          <h3 className="font-semibold mb-2 text-[#4CAF50]">Equipment Available</h3>
          <ul className="list-disc list-inside">
            {farmData.equipmentAvailable.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border border-[#E0E0E0]">
          <h3 className="font-semibold mb-2 text-[#4CAF50]">Certifications & Market Preferences</h3>
          <p>
            <span className="font-semibold">Certifications:</span> {farmData.certifications.join(', ')}
          </p>
          <p>
            <span className="font-semibold">Market Preferences:</span> {farmData.marketPreferences.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
