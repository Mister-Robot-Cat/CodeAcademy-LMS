"use client";

import React, { useEffect, useState } from "react";

interface Semester {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  semesterName: string | null;
}

interface Student {
  id: string;
  fullName: string;
  email: string;
  groupName: string | null;
}

interface Teacher {
  id: string;
  fullName: string;
  email: string;
  specialization: string;
}

export default function GroupsPage() {
  // Lists fetched from backend
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

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

  // Fetch all resources on mount
  const fetchResources = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
    const headers = getHeaders();

    try {
      // Fetch semesters
      const semRes = await fetch(`${apiUrl}/api/group/semesters`, { headers });
      if (semRes.ok) {
        const data = await semRes.json();
        setSemesters(data);
      }

      // Fetch groups
      const groupRes = await fetch(`${apiUrl}/api/group`, { headers });
      if (groupRes.ok) {
        const data = await groupRes.json();
        setGroups(data);
      }

      // Fetch students
      const studRes = await fetch(`${apiUrl}/api/student`, { headers });
      if (studRes.ok) {
        const data = await studRes.json();
        setStudents(data);
      }

      // Fetch teachers
      const teachRes = await fetch(`${apiUrl}/api/teacher`, { headers });
      if (teachRes.ok) {
        const data = await teachRes.json();
        setTeachers(data);
      }
    } catch (e) {
      console.error("Failed to load list resources", e);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateMsg({ text: "", isError: false });
    setCreateLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/group`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name: groupName, semesterId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create group.");
      }

      const newGroupId = await response.json();
      setCreateMsg({ text: `Success! Group created: "${groupName}"`, isError: false });
      setGroupName("");
      setSemesterId("");
      fetchResources(); // Refresh group list
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

      setStudentMsg({ text: "Success! Student enrolled successfully.", isError: false });
      setStudentGroupId("");
      setStudentProfileId("");
      fetchResources(); // Refresh student group status
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
      fetchResources(); // Refresh teachers
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
        <h3 className="text-xl font-bold text-white mb-2">Academic Operations</h3>
        <p className="text-sm text-slate-400">Perform administration workflows to configure semesters, cohorts, and assignments.</p>
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
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Semester</label>
              <select
                required
                value={semesterId}
                onChange={(e) => setSemesterId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
              >
                <option value="">-- Choose Semester --</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {createMsg.text && (
              <div className={`p-3.5 rounded-xl border text-xs ${createMsg.isError ? "bg-red-950/40 border-red-900 text-red-200" : "bg-emerald-950/40 border-emerald-900 text-emerald-200"}`}>
                {createMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={createLoading || !semesterId}
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
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Academic Group</label>
              <select
                required
                value={studentGroupId}
                onChange={(e) => setStudentGroupId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
              >
                <option value="">-- Choose Group --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} {g.semesterName ? `(${g.semesterName})` : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Student</label>
              <select
                required
                value={studentProfileId}
                onChange={(e) => setStudentProfileId(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
              >
                <option value="">-- Choose Student --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.email}) {s.groupName ? `[Enrolled: ${s.groupName}]` : "[No Group]"}
                  </option>
                ))}
              </select>
            </div>

            {studentMsg.text && (
              <div className={`p-3.5 rounded-xl border text-xs ${studentMsg.isError ? "bg-red-950/40 border-red-900 text-red-200" : "bg-emerald-950/40 border-emerald-900 text-emerald-200"}`}>
                {studentMsg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={studentLoading || !studentGroupId || !studentProfileId}
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
                <label className="block text-xs font-semibold text-slate-400 mb-1">Select Teacher</label>
                <select
                  required
                  value={teacherProfileId}
                  onChange={(e) => setTeacherProfileId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm cursor-pointer"
                >
                  <option value="">-- Choose Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} ({t.email}) {t.specialization ? `[${t.specialization}]` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Specialization / Subject</label>
                <input
                  type="text"
                  required
                  value={teacherSpec}
                  onChange={(e) => setTeacherSpec(e.target.value)}
                  placeholder="e.g. ASP.NET Core, DevOps"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-650 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
              disabled={teacherLoading || !teacherProfileId}
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
