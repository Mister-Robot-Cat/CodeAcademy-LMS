"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalGroups: number;
  totalSemesters: number;
}

interface Group {
  id: string;
  name: string;
  semesterName: string | null;
  studentCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalGroups: 0,
    totalSemesters: 0,
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchDashboardData = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
    const headers = getHeaders();

    try {
      // Fetch stats
      const statsRes = await fetch(`${apiUrl}/api/admin/stats`, { headers });
      if (!statsRes.ok) {
        throw new Error("Failed to load dashboard metrics.");
      }
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch groups
      const groupsRes = await fetch(`${apiUrl}/api/group`, { headers });
      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        setGroups(groupsData);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Students", value: stats.totalStudents, icon: "🎓", change: "Enrolled in profile", color: "from-blue-600/10 to-indigo-600/10 border-blue-500/20 text-blue-400" },
    { title: "Active Groups", value: stats.totalGroups, icon: "👥", change: "Formed cohorts", color: "from-violet-600/10 to-purple-600/10 border-purple-500/20 text-purple-400" },
    { title: "Total Teachers", value: stats.totalTeachers, icon: "💼", change: "Assigned staff", color: "from-fuchsia-600/10 to-pink-600/10 border-pink-500/20 text-pink-400" },
    { title: "Academic Semesters", value: stats.totalSemesters, icon: "📅", change: "Active terms", color: "from-indigo-600/10 to-violet-600/10 border-indigo-500/20 text-indigo-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 md:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 to-violet-950/30 bg-clip-padding backdrop-filter backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 max-w-xl">
          <h3 className="text-2xl font-bold text-white mb-2">Welcome to Academy Management Portal</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Manage student registrations, academic groups, coordinate teacher assignments, and track attendance reports across all educational courses.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-900 rounded-xl text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className={`p-6 rounded-2xl border bg-gradient-to-b ${card.color}`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">{card.icon}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-slate-450 border border-slate-800">
                {card.change}
              </span>
            </div>
            <h4 className="text-slate-400 text-sm font-semibold mb-1">{card.title}</h4>
            <span className="text-3xl font-extrabold text-white">{card.value}</span>
          </div>
        ))}
      </div>

      {/* Recent Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Groups List */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-md font-bold text-white">Active Educational Groups</h4>
            <Link href="/admin/groups" className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">
              Manage groups
            </Link>
          </div>
          <div className="space-y-4">
            {groups.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-medium italic border border-dashed border-slate-800 rounded-xl">
                No active educational groups created yet. Click &quot;Manage groups&quot; to add one.
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-950 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-white mb-1">{group.name}</h5>
                    <div className="flex items-center gap-3 text-xs text-slate-450">
                      <span>🎓 {group.studentCount} Students</span>
                      <span>•</span>
                      <span>📅 Semester: {group.semesterName || "None"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: "10%" }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-350">Active</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions panel */}
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md">
          <h4 className="text-md font-bold text-white mb-6">Quick Actions</h4>
          <div className="space-y-3">
            {[
              { title: "Create New Group", desc: "Define name and link to semester", action: "/admin/groups", color: "bg-indigo-650 hover:bg-indigo-600 text-white" },
              { title: "Register Student Profile", desc: "Add student to active groups", action: "/admin/students", color: "bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200" },
              { title: "Assign Teacher Profile", desc: "Link teacher to group modules", action: "/admin/teachers", color: "bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200" },
            ].map((act) => (
              <Link
                key={act.title}
                href={act.action}
                className={`block p-4 rounded-xl transition-all ${act.color}`}
              >
                <h5 className="font-bold text-sm mb-1">{act.title}</h5>
                <p className="text-xs text-slate-400 leading-normal">{act.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
