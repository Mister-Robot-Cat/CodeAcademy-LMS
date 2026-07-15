"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Invalid email or password.");
      }

      const data = await response.json();
      
      // Store token in local storage (or secure session storage)
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("user", JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles
      }));

      setSuccess(true);
      // In real-world, we would redirect here:
      // window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-950 py-12 sm:py-24">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-slate-900 border border-slate-800 shadow-2xl rounded-3xl sm:p-20 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-80">
          <div className="max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6">
                <span className="text-white font-extrabold text-2xl">CA</span>
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight text-center">CodeAcademy LMS</h1>
              <p className="mt-2 text-sm text-slate-400 text-center">Enter your details to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {error && (
                <div className="p-4 bg-red-950/50 border border-red-900/50 rounded-xl text-red-200 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-emerald-950/50 border border-emerald-900/50 rounded-xl text-emerald-200 text-sm">
                  Success! Logging you in...
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="name@academy.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1" htmlFor="password">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <p className="mt-4 text-xs text-center text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-indigo-400 hover:underline font-semibold">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
