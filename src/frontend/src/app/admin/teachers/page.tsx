"use client";

import React, { useEffect, useState } from "react";

interface Teacher {
  id: string;
  fullName: string;
  email: string;
  specialization: string;
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTeachers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      
      const response = await fetch(`${apiUrl}/api/teacher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load teachers list.");
      }

      const data = await response.json();
      setTeachers(data.items || data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Academy Teachers</h3>
        <p className="text-sm text-slate-400">View and coordinate all assigned teachers and subject specializations.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-900 rounded-xl text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Name</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Specialization / Subject</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/50 text-sm text-slate-200">
            {teachers.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-8 text-center text-slate-500 font-semibold">
                  No teacher records found in the database.
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">{teacher.fullName}</td>
                  <td className="py-4 px-6 text-slate-400">{teacher.email}</td>
                  <td className="py-4 px-6">
                    {teacher.specialization ? (
                      <span className="px-2.5 py-1 rounded-full bg-violet-950/50 border border-violet-900/40 text-violet-300 text-xs font-semibold">
                        {teacher.specialization}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs font-medium italic">General Curriculum</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
