'use client';
import Base_URL from "@/app/api/route";
import React, { useState } from "react";

export default function SignUpPage() {
  const [userType, setUserType] = useState<"FARMER" | "BUYER">("FARMER");
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    gender: "MALE",
    role: "FARMER",
    // Farmer-specific fields
    farmName: "",
    farmLocation: "",
    farmSize: "",
    farmingMethods: "",
    experienceLevel: "",
    cropsGrown: "",
    livestockOwned: "",
    equipmentAvailable: "",
    certifications: "",
    marketPreferences: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (type: "FARMER" | "BUYER") => {
    setUserType(type);
    setFormData(prev => ({
      ...prev,
      role: type === "FARMER" ? "FARMER" : "USER"
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let payload;
      let endpoint;

      if (userType === "FARMER") {
        // Farmer registration
        endpoint = `${Base_URL}/api/farmers/register`;
        payload = {
          ...formData,
          farmSize: parseFloat(formData.farmSize),
          cropsGrown: formData.cropsGrown.split(",").map(s => s.trim()),
          livestockOwned: formData.livestockOwned.split(",").map(s => s.trim()),
          equipmentAvailable: formData.equipmentAvailable.split(",").map(s => s.trim()),
          certifications: formData.certifications.split(",").map(s => s.trim()),
          marketPreferences: formData.marketPreferences.split(",").map(s => s.trim()),
        };
      } else {
        // Buyer registration using your user endpoint
        endpoint = `${Base_URL}/api/user/sign-up`;
        payload = {
          fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          role: "USER" // Regular user/buyer
        };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Registration failed");
      }

      const data = await response.json();
      alert(`${userType === "FARMER" ? "Farmer" : "Buyer"} ${data.fullname || data.username} registered successfully!`);
      
      // Reset form
      setFormData({
        fullname: "",
        username: "",
        email: "",
        password: "",
        gender: "MALE",
        role: userType === "FARMER" ? "FARMER" : "USER",
        farmName: "",
        farmLocation: "",
        farmSize: "",
        farmingMethods: "",
        experienceLevel: "",
        cropsGrown: "",
        livestockOwned: "",
        equipmentAvailable: "",
        certifications: "",
        marketPreferences: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA]">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl border border-[#E0E0E0]">
        {/* 🌿 Text-based logo */}
        <h1 className="text-4xl font-extrabold tracking-widest text-center mb-6">
          <span className="text-[#4CAF50]">AGRO</span>
          <span className="text-[#FBC02D]">LINK</span>
        </h1>

        <h2 className="text-2xl font-semibold text-center text-[#2E7D32] mb-6">
          Create Your Account
        </h2>

        {/* User Type Selection */}
        <div className="mb-6">
          <label className="block text-[#6D4C41] font-medium mb-3 text-center">I want to register as:</label>
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => handleUserTypeChange("FARMER")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                userType === "FARMER" 
                  ? "bg-[#4CAF50] text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🌱 Farmer
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange("BUYER")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                userType === "BUYER" 
                  ? "bg-[#2196F3] text-white shadow-md" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🛒 Buyer
            </button>
          </div>
        </div>

        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Common Fields for Both User Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#6D4C41] font-medium mb-1">Full Name *</label>
              <input 
                type="text" 
                name="fullname" 
                value={formData.fullname} 
                onChange={handleChange} 
                required
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                placeholder="John Doe" 
              />
            </div>

            {userType === "BUYER" && (
              <div>
                <label className="block text-[#6D4C41] font-medium mb-1">Username *</label>
                <input 
                  type="text" 
                  name="username" 
                  value={formData.username} 
                  onChange={handleChange} 
                  required
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  placeholder="johndoe" 
                />
              </div>
            )}

            <div>
              <label className="block text-[#6D4C41] font-medium mb-1">Email *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                placeholder="example@mail.com" 
              />
            </div>

            <div>
              <label className="block text-[#6D4C41] font-medium mb-1">Password *</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                placeholder="********" 
              />
            </div>

            <div>
              <label className="block text-[#6D4C41] font-medium mb-1">Gender</label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleChange}
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
          </div>

          {/* Farmer-Specific Fields */}
          {userType === "FARMER" && (
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold text-[#2E7D32] mb-4">Farm Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#6D4C41] font-medium mb-1">Farm Name *</label>
                  <input 
                    type="text" 
                    name="farmName" 
                    value={formData.farmName} 
                    onChange={handleChange} 
                    required
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Green Valley Farm" 
                  />
                </div>

                <div>
                  <label className="block text-[#6D4C41] font-medium mb-1">Farm Location *</label>
                  <input 
                    type="text" 
                    name="farmLocation" 
                    value={formData.farmLocation} 
                    onChange={handleChange} 
                    required
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Harare, Zimbabwe" 
                  />
                </div>

                <div>
                  <label className="block text-[#6D4C41] font-medium mb-1">Farm Size (hectares) *</label>
                  <input 
                    type="number" 
                    name="farmSize" 
                    value={formData.farmSize} 
                    onChange={handleChange} 
                    required
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="10" 
                  />
                </div>

                <div>
                  <label className="block text-[#6D4C41] font-medium mb-1">Farming Methods *</label>
                  <input 
                    type="text" 
                    name="farmingMethods" 
                    value={formData.farmingMethods} 
                    onChange={handleChange} 
                    required
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Organic, Conventional" 
                  />
                </div>

                <div>
                  <label className="block text-[#6D4C41] font-medium mb-1">Experience Level *</label>
                  <input 
                    type="text" 
                    name="experienceLevel" 
                    value={formData.experienceLevel} 
                    onChange={handleChange} 
                    required
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Beginner, Intermediate, Expert" 
                  />
                </div>

                <div>
                  <label className="block text-[#6D4C41] font-medium mb-1">Crops Grown (comma separated)</label>
                  <input 
                    type="text" 
                    name="cropsGrown" 
                    value={formData.cropsGrown} 
                    onChange={handleChange}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Maize, Tomatoes" 
                  />
                </div>

                <div>
                  <label className="block text-[#6D4C41] font-medium mb-1">Livestock Owned (comma separated)</label>
                  <input 
                    type="text" 
                    name="livestockOwned" 
                    value={formData.livestockOwned} 
                    onChange={handleChange}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Cows, Chickens" 
                  />
                </div>

                <div>
                  <label className="block text-[#6D4C41] font-medium mb-1">Equipment Available (comma separated)</label>
                  <input 
                    type="text" 
                    name="equipmentAvailable" 
                    value={formData.equipmentAvailable} 
                    onChange={handleChange}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Tractor, Plough" 
                  />
                </div>

                <div>
                  <label className="block text-[#6D4C41] font-medium mb-1">Certifications (comma separated)</label>
                  <input 
                    type="text" 
                    name="certifications" 
                    value={formData.certifications} 
                    onChange={handleChange}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Organic Certified" 
                  />
                </div>

                <div>
                  <label className="block text-[#6D4C41] font-medium mb-1">Market Preferences (comma separated)</label>
                  <input 
                    type="text" 
                    name="marketPreferences" 
                    value={formData.marketPreferences} 
                    onChange={handleChange}
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
                    placeholder="Local, Export" 
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white font-semibold py-2 px-4 rounded-lg transition ${
                userType === "FARMER" 
                  ? "bg-[#4CAF50] hover:bg-[#2E7D32]" 
                  : "bg-[#2196F3] hover:bg-[#1976D2]"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? "Registering..." : `Sign Up as ${userType === "FARMER" ? "Farmer" : "Buyer"}`}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-[#6D4C41] mt-4">
          Already have an account?{" "}
          <a href="/views/login-page/" className="text-[#FBC02D] font-semibold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}