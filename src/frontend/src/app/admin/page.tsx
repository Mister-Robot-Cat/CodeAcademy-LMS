"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import { SkeletonCard, SkeletonTable } from "@/components/Skeleton";
import ConfirmDialog from "@/components/ConfirmDialog";

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
  const { showToast } = useToast();
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0,
    totalTeachers: 0,
    totalGroups: 0,
    totalSemesters: 0,
  });
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Confirmation dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetGroup, setTargetGroup] = useState<{ id: string; name: string } | null>(null);

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
      showToast("Error loading dashboard metrics.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteTrigger = (id: string, name: string) => {
    setTargetGroup({ id, name });
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetGroup) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/group/${targetGroup.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to disband group.");
      }

      showToast(`Group "${targetGroup.name}" has been disbanded successfully.`, "success");
      setIsDialogOpen(false);
      setTargetGroup(null);
      fetchDashboardData(); // Refresh metrics and lists
    } catch (err: any) {
      showToast(err.message || "An error occurred.", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-slate-900/10 border border-slate-900/50 rounded-3xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonTable rows={3} cols={2} />
          </div>
          <SkeletonCard />
        </div>
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
          <p className="text-slate-350 text-sm leading-relaxed">
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
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-slate-350 border border-slate-800">
                {card.change}
              </span>
            </div>
            <h4 className="text-slate-350 text-sm font-semibold mb-1">{card.title}</h4>
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
              <div className="p-8 text-center text-slate-350 font-medium italic border border-dashed border-slate-800 rounded-xl">
                No active educational groups created yet. Click &quot;Manage groups&quot; to add one.
              </div>
            ) : (
              groups.map((group) => (
                <div key={group.id} className="p-4 rounded-xl border border-slate-900 bg-slate-950/40 hover:bg-slate-950 transition-colors flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h5 className="font-bold text-sm text-white mb-1">{group.name}</h5>
                    <div className="flex items-center gap-3 text-xs text-slate-355">
                      <span>🎓 {group.studentCount} Students</span>
                      <span>•</span>
                      <span>📅 Semester: {group.semesterName || "None"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1 overflow-hidden">
                        <div className="bg-indigo-500 h-1 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-300">Active</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTrigger(group.id, group.name)}
                      className="p-2 rounded-lg border border-slate-850 hover:border-red-900/40 bg-slate-900 hover:bg-red-950/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                      title="Disband Group"
                    >
                      🗑️
                    </button>
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
              { title: "Create New Group", desc: "Define name and link to semester", action: "/admin/groups", color: "bg-indigo-650 hover:bg-indigo-650 text-white" },
              { title: "Register Student Profile", desc: "Add student to active groups", action: "/admin/students", color: "bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200" },
              { title: "Assign Teacher Profile", desc: "Link teacher to group modules", action: "/admin/teachers", color: "bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200" },
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

      {/* Reusable Confirm Dialog */}
      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Disband Educational Group"
        message={`Are you sure you want to disband "${targetGroup?.name}"? All enrolled students will be unassigned from this group, but their profiles will remain intact.`}
        confirmText="Disband"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDialogOpen(false);
          setTargetGroup(null);
        }}
      />
    </div>
  );
}
