"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { SkeletonCard, SkeletonTable } from "@/components/Skeleton";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  groupCount: number;
}

export default function SemestersPage() {
  const { showToast } = useToast();
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create Form
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Delete Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [targetSemester, setTargetSemester] = useState<{ id: string; name: string } | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchSemesters = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/semester`, { headers: getHeaders() });
      if (!response.ok) throw new Error("Failed to load semesters");
      const data = await response.json();
      setSemesters(data.items || data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSemesters();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/semester`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name, startDate, endDate }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create semester.");
      }

      showToast(`Semester "${name}" created successfully!`, "success");
      setName("");
      setStartDate("");
      setEndDate("");
      fetchSemesters();
    } catch (err: any) {
      showToast(err.message || "An error occurred.", "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteTrigger = (id: string, name: string) => {
    setTargetSemester({ id, name });
    setIsDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!targetSemester) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/semester/${targetSemester.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete semester.");
      }

      showToast(`Semester "${targetSemester.name}" deleted successfully.`, "success");
      setIsDialogOpen(false);
      setTargetSemester(null);
      fetchSemesters();
    } catch (err: any) {
      showToast(err.message || "An error occurred.", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Semesters</h3>
          <p className="text-sm text-slate-400">Loading semester records...</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkeletonCard />
          <SkeletonTable rows={3} cols={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Academic Semesters</h3>
        <p className="text-sm text-slate-400">Manage terms, dates, and track active groups per semester.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-900 rounded-xl text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1 p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md">
          <h4 className="text-md font-bold text-white mb-4 flex items-center gap-2">
            <span>📅</span> Create New Semester
          </h4>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-350 mb-1">Semester Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Fall 2026"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-350 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-350 mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={createLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-55"
            >
              {createLoading ? "Creating..." : "Create Semester"}
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Timeline</th>
                <th className="py-4 px-6 text-center">Groups</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/50 text-sm text-slate-200">
              {semesters.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 font-semibold">
                    No semesters found.
                  </td>
                </tr>
              ) : (
                semesters.map((sem) => (
                  <tr key={sem.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-white flex items-center gap-2">
                        {sem.name}
                        {sem.isActive && (
                          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-emerald-950 border border-emerald-900 text-emerald-400">
                            Active
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400">
                      {new Date(sem.startDate).toLocaleDateString()} - {new Date(sem.endDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-indigo-950/50 border border-indigo-900/40 text-indigo-300 font-bold">
                        {sem.groupCount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteTrigger(sem.id, sem.name)}
                        className="p-1.5 rounded-lg border border-slate-800 hover:border-red-900/40 bg-slate-900 hover:bg-red-950/20 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Semester"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDialogOpen}
        title="Delete Semester"
        message={`Are you sure you want to delete "${targetSemester?.name}"? This action cannot be undone and may fail if there are groups attached to it.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDialogOpen(false);
          setTargetSemester(null);
        }}
      />
    </div>
  );
}
