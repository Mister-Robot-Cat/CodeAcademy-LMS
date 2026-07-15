"use client";

import React, { useEffect, useState } from "react";

interface Stats {
  totalStudents: number;
  totalTeachers: number;
  totalGroups: number;
  totalSemesters: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalGroups: 0,
    totalSemesters: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, we would fetch these stats from the backend.
    // For now we will mock them with numbers to present a beautiful UI, 
    // and load them dynamically as resources are created.
    setTimeout(() => {
      setStats({
        totalStudents: 148,
        totalTeachers: 12,
        totalGroups: 8,
        totalSemesters: 2,
      });
      setLoading(false);
    }, 600);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { title: "Total Students", value: stats.totalStudents, icon: "🎓", change: "+12% this month", color: "from-blue-600/10 to-indigo-600/10 border-blue-500/20 text-blue-400" },
    { title: "Active Groups", value: stats.totalGroups, icon: "👥", change: "+2 new groups", color: "from-violet-600/10 to-purple-600/10 border-purple-500/20 text-purple-400" },
    { title: "Total Teachers", value: stats.totalTeachers, icon: "💼", change: "0 change", color: "from-fuchsia-600/10 to-pink-600/10 border-pink-500/20 text-pink-400" },
    { title: "Academic Semesters", value: stats.totalSemesters, icon: "📅", change: "Active: Autumn 2026", color: "from-indigo-600/10 to-violet-600/10 border-indigo-500/20 text-indigo-400" },
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

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.title} className={`p-6 rounded-2xl border bg-gradient-to-b ${card.color}`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">{card.icon}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800">
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
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-md font-bold text-white">Active Educational Groups</h4>
              <button className="text-xs text-indigo-400 hover:text-indigo-300 font-bold">View all</button>
            </div>
            <div className="space-y-4">
              {[
                { name: "C# Web Development (Autumn 2026)", students: 24, teacher: "D. Johnson", progress: 75 },
                { name: "Frontend Development with Next.js", students: 18, teacher: "S. Miller", progress: 40 },
                { name: "Data Analytics & BigQuery", students: 32, teacher: "A. Kovalenko", progress: 90 },
                { name: "Introduction to DevOps & Docker", students: 15, teacher: "Unassigned", progress: 10 },
              ].map((group) => (
                <div key={group.name} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-950 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-sm text-white mb-1">{group.name}</h5>
                    <div className="flex items-center gap-3 text-xs text-slate-450">
                      <span>🎓 {group.students} Students</span>
                      <span>•</span>
                      <span>👨‍🏫 {group.teacher}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${group.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-slate-300">{group.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
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
              <a
                key={act.title}
                href={act.action}
                className={`block p-4 rounded-xl transition-all ${act.color}`}
              >
                <h5 className="font-bold text-sm mb-1">{act.title}</h5>
                <p className="text-xs text-slate-400 leading-normal">{act.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
