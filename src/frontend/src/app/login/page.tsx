"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 6;

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
      setTimeout(() => {
        router.push("/admin");
      }, 800);
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
                  <label className="block text-sm font-semibold text-slate-350 mb-1" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${
                      emailTouched
                        ? isEmailValid
                          ? "border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20"
                          : "border-red-500/80 focus:ring-2 focus:ring-red-500/20"
                        : "border-slate-800 focus:ring-2 focus:ring-indigo-500"
                    }`}
                    placeholder="name@academy.com"
                  />
                  {emailTouched && !isEmailValid && (
                    <p className="mt-1.5 text-xs text-red-400 font-medium">Please enter a valid email address.</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-350 mb-1" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setPasswordTouched(true)}
                      className={`w-full pl-4 pr-12 py-3 bg-slate-950 border rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${
                        passwordTouched
                          ? isPasswordValid
                            ? "border-emerald-500/80 focus:ring-2 focus:ring-emerald-500/20"
                            : "border-red-500/80 focus:ring-2 focus:ring-red-500/20"
                          : "border-slate-800 focus:ring-2 focus:ring-indigo-500"
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 hover:text-slate-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3a8.2 8.2 0 0 1-4.89 1.53c-1.393 0-2.707-.344-3.865-.952M12 9a3 3 0 0 0-3 3c0 .324.051.636.145.929m3.843-3.843a3 3 0 0 1 3.75 3.75" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-400 hover:text-slate-300">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {passwordTouched && !isPasswordValid && (
                    <p className="mt-1.5 text-xs text-red-400 font-medium">Password must be at least 6 characters long.</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || (emailTouched && !isEmailValid) || (passwordTouched && !isPasswordValid)}
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
