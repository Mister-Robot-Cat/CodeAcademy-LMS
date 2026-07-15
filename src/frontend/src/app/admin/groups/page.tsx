"use client";

import React, { useState } from "react";

export default function GroupsPage() {
  // Create Group States
  const [groupName, setGroupName] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [createMsg, setCreateMsg] = useState({ text: "", isError: false });
  const [createLoading, setCreateLoading] = useState(false);

  // Add Student States
  const [studentGroupId, setStudentGroupId] = useState("");
  const [studentProfileId, setStudentProfileId] = useState("");
  const [studentMsg, setStudentMsg] = useState({ text: "", isError: false });
  const [studentLoading, setStudentLoading] = useState(false);

  // Assign Teacher States
  const [teacherProfileId, setTeacherProfileId] = useState("");
  const [teacherSpec, setTeacherSpec] = useState("");
  const [teacherMsg, setTeacherMsg] = useState({ text: "", isError: false });
  const [teacherLoading, setTeacherLoading] = useState(false);

  const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg({ text: "", isError: false });
    setCreateLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/group`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name: groupName, semesterId: semesterId || "00000000-0000-0000-0000-000000000000" }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create group.");
      }

      const groupId = await response.json();
      setCreateMsg({ text: `Success! Group created with ID: ${groupId}`, isError: false });
      setGroupName("");
      setSemesterId("");
    } catch (err: any) {
      setCreateMsg({ text: err.message || "An error occurred.", isError: true });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentMsg({ text: "", isError: false });
    setStudentLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/group/add-student`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ groupId: studentGroupId, studentProfileId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to add student to group.");
      }

      setStudentMsg({ text: "Success! Student added to the group.", isError: false });
      setStudentGroupId("");
      setStudentProfileId("");
    } catch (err: any) {
      setStudentMsg({ text: err.message || "An error occurred.", isError: true });
    } finally {
      setStudentLoading(false);
    }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherMsg({ text: "", isError: false });
    setTeacherLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/group/assign-teacher`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ teacherProfileId, specialization: teacherSpec }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to assign teacher.");
      }

      setTeacherMsg({ text: "Success! Teacher assigned.", isError: false });
      setTeacherProfileId("");
      setTeacherSpec("");
    } catch (err: any) {
      setTeacherMsg({ text: err.message || "An error occurred.", isError: true });
    } finally {
      setTeacherLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h3 className="text-xl font-bold text-white mb-2">Academic Operations Dashboard</h3>
        <p className="text-sm text-slate-400">Perform administration workflows to initialize and modify educational cohorts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Create Group */}
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md">
          <h4 className="text-md font-bold text-white mb-4 flex items-center gap-2">
            <span>➕</span> Create Academic Group
          </h4>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Group Name</label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. C# Web Development"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Semester ID (Guid)</label>
              <input
                type="text"
                required
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
                placeholder="e.g. e2cf8b43-43b8-4c28-97ba-2a078ea22f1b"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {createMsg.text && (
              <div className={`p-3.5 rounded-xl border text-xs ${createMsg.isError ? "bg-red-950/40 border-red-900 text-red-200" : "bg-emerald-950/40 border-emerald-900 text-emerald-200"}`}>
                {createMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={createLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-55"
            >
              {createLoading ? "Creating Group..." : "Create Group"}
            </button>
          </form>
        </div>

        {/* Card 2: Add Student to Group */}
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md">
          <h4 className="text-md font-bold text-white mb-4 flex items-center gap-2">
            <span>🔗</span> Enroll Student in Group
          </h4>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Group ID (Guid)</label>
              <input
                type="text"
                required
                value={studentGroupId}
                onChange={(e) => setStudentGroupId(e.target.value)}
                placeholder="e.g. a60df1a5-82b1-4f32-8419-f538ee598124"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Student Profile ID (Guid)</label>
              <input
                type="text"
                required
                value={studentProfileId}
                onChange={(e) => setStudentProfileId(e.target.value)}
                placeholder="e.g. 5d57cc88-cfae-44db-86d6-d0833a6f1d2e"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>

            {studentMsg.text && (
              <div className={`p-3.5 rounded-xl border text-xs ${studentMsg.isError ? "bg-red-950/40 border-red-900 text-red-200" : "bg-emerald-950/40 border-emerald-900 text-emerald-200"}`}>
                {studentMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={studentLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-55"
            >
              {studentLoading ? "Enrolling..." : "Enroll Student"}
            </button>
          </form>
        </div>

        {/* Card 3: Assign Teacher Profile */}
        <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-md lg:col-span-2">
          <h4 className="text-md font-bold text-white mb-4 flex items-center gap-2">
            <span>👨‍🏫</span> Configure Teacher Assignment
          </h4>
          <form onSubmit={handleAssignTeacher} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Teacher Profile ID (Guid)</label>
                <input
                  type="text"
                  required
                  value={teacherProfileId}
                  onChange={(e) => setTeacherProfileId(e.target.value)}
                  placeholder="e.g. fd492984-7a1a-45c1-9034-7a1b9b65e23c"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Specialization / Subject</label>
                <input
                  type="text"
                  required
                  value={teacherSpec}
                  onChange={(e) => setTeacherSpec(e.target.value)}
                  placeholder="e.g. ASP.NET Core, DevOps"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
            </div>

            {teacherMsg.text && (
              <div className={`p-3.5 rounded-xl border text-xs ${teacherMsg.isError ? "bg-red-950/40 border-red-900 text-red-200" : "bg-emerald-950/40 border-emerald-900 text-emerald-200"}`}>
                {teacherMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={teacherLoading}
              className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-colors disabled:opacity-55"
            >
              {teacherLoading ? "Assigning..." : "Assign Teacher Specialization"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
