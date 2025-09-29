'use client';
import Base_URL from "@/app/api/route";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSignUp() {
    router.push("/views/sign-up/");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${Base_URL}/api/user/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Store JWT token & email
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.username);

      // Redirect based on role
      if (data.role === "FARMER") {
        router.push("/views/farmer/layout/");
      } else if (data.role === "USER") {
        router.push("/views/buyer/layout/");
      } else {
        setError("Unknown role. Cannot redirect.");
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FAFAFA]">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-[#E0E0E0]">
        <h1 className="text-4xl font-extrabold tracking-widest text-center mb-6">
          <span className="text-[#4CAF50]">AGRO</span>
          <span className="text-[#FBC02D]">LINK</span>
        </h1>

        <h2 className="text-2xl font-semibold text-center text-[#2E7D32] mb-6">
          Login
        </h2>

        {error && (
          <p className="bg-red-100 text-red-600 text-sm p-2 rounded mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[#6D4C41] font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-[#6D4C41] font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4CAF50] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#2E7D32] transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-[#6D4C41] mt-4">
          Don’t have an account?{" "}
          <a onClick={handleSignUp} className="text-[#4CAF50] cursor-pointer">
            Sign Up
          </a>
        </p>

        <p className="text-center text-sm text-[#6D4C41] mt-2">
          ☀️ Fresh harvest awaits you!
        </p>
      </div>
    </div>
  );
}
