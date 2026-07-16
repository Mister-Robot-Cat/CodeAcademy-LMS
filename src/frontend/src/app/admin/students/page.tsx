"use client";

import React, { useEffect, useState } from "react";

interface Student {
  id: string;
  fullName: string;
  email: string;
  groupName: string | null;
  gpa: number;
  enrollmentDate: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      
      const response = await fetch(`${apiUrl}/api/student`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load students list.");
      }

      const data = await response.json();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
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
        <h3 className="text-xl font-bold text-white mb-2">Academy Students</h3>
        <p className="text-sm text-slate-400">View and manage all registered student profiles across academic cohorts.</p>
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
              <th className="py-4 px-6">Enrolled Group</th>
              <th className="py-4 px-6 text-center">GPA</th>
              <th className="py-4 px-6 text-right">Enrollment Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/50 text-sm text-slate-200">
            {students.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 font-semibold">
                  No student records found in the database.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="py-4 px-6 font-bold text-white">{student.fullName}</td>
                  <td className="py-4 px-6 text-slate-400">{student.email}</td>
                  <td className="py-4 px-6">
                    {student.groupName ? (
                      <span className="px-2.5 py-1 rounded-full bg-indigo-950/50 border border-indigo-900/40 text-indigo-300 text-xs font-semibold">
                        {student.groupName}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs font-medium italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center font-semibold text-emerald-400">
                    {student.gpa.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-right text-slate-450">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
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
