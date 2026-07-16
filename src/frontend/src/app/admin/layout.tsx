"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Simple RBAC check (ensure Admin or SuperAdmin)
      const hasAdminAccess = parsedUser.roles.some(
        (r: string) => r === "Admin" || r === "SuperAdmin"
      );
      if (!hasAdminAccess) {
        router.push("/login");
      }
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!mounted || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <span className="text-sm text-slate-400">Loading admin panel...</span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { name: "Overview", path: "/admin", icon: "📊" },
    { name: "Groups", path: "/admin/groups", icon: "👥" },
    { name: "Students", path: "/admin/students", icon: "🎓" },
    { name: "Teachers", path: "/admin/teachers", icon: "💼" },
  ];

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 bg-slate-900/50 backdrop-blur-xl flex flex-col justify-between p-6">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white font-extrabold text-lg">CA</span>
            </div>
            <div>
              <span className="font-bold text-white block">CodeAcademy</span>
              <span className="text-xs text-indigo-400 font-semibold tracking-wider uppercase">LMS Admin</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                      : "text-slate-450 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile section at the bottom */}
        <div className="border-t border-slate-800 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-900/80 border border-indigo-750 flex items-center justify-center font-bold text-indigo-300">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="truncate">
              <span className="block font-bold text-sm text-white truncate">
                {user.firstName} {user.lastName}
              </span>
              <span className="block text-xs text-slate-400 truncate">{user.email}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-800 hover:border-red-900/50 bg-slate-900 hover:bg-red-950/20 text-slate-400 hover:text-red-400 text-sm font-bold transition-all"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 border-b border-slate-900 flex items-center justify-between px-8 bg-slate-900/20 backdrop-blur-md">
          <h2 className="font-bold text-lg text-white">
            {menuItems.find((item) => item.path === pathname)?.name || "Admin Panel"}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 bg-indigo-950 border border-indigo-500/30 text-indigo-300 rounded-full">
              {user.roles.includes("SuperAdmin") ? "Super Admin" : "Academy Admin"}
            </span>
          </div>
        </header>
        <div className="p-8 flex-1">
          <Breadcrumbs />
          {children}
        </div>
      </main>
    </div>
  );
}
