"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { SkeletonCard } from "@/components/Skeleton";
import { ActionModal } from "@/components/ActionModal";
import { FloatingLabelInput } from "@/components/FloatingLabelInput";
import { SearchableCombobox, ComboboxOption } from "@/components/SearchableCombobox";
import { Users, GraduationCap, Briefcase, Plus, Network, Shapes, Library, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ConfirmDialog";

interface Semester {
  id: string;
  name: string;
}

interface Group {
  id: string;
  name: string;
  semesterName: string | null;
  studentCount: number;
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
  const { showToast } = useToast();

  // Data States
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pageLoading, setPageLoading] = useState(true);

  // Modal States
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isStudentModalOpen, setStudentModalOpen] = useState(false);
  const [isTeacherModalOpen, setTeacherModalOpen] = useState(false);

  // Form States
  const [groupName, setGroupName] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const [studentGroupId, setStudentGroupId] = useState("");
  const [studentProfileId, setStudentProfileId] = useState("");
  const [studentLoading, setStudentLoading] = useState(false);

  const [teacherGroupId, setTeacherGroupId] = useState("");
  const [teacherProfileId, setTeacherProfileId] = useState("");
  const [teacherSpec, setTeacherSpec] = useState("");
  const [teacherLoading, setTeacherLoading] = useState(false);

  const [isDeleteDialog, setDeleteDialog] = useState(false);
  const [targetGroup, setTargetGroup] = useState<{ id: string; name: string } | null>(null);

  const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchResources = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
    const headers = getHeaders();

    try {
      const [semRes, groupRes, studRes, teachRes] = await Promise.all([
        fetch(`${apiUrl}/api/group/semesters`, { headers }),
        fetch(`${apiUrl}/api/group`, { headers }),
        fetch(`${apiUrl}/api/student`, { headers }),
        fetch(`${apiUrl}/api/teacher`, { headers }),
      ]);

      if (semRes.ok) setSemesters(await semRes.json());
      if (groupRes.ok) {
        const d = await groupRes.json();
        setGroups(d.items || d);
      }
      if (studRes.ok) {
        const d = await studRes.json();
        setStudents(d.items || d);
      }
      if (teachRes.ok) {
        const d = await teachRes.json();
        setTeachers(d.items || d);
      }
    } catch (e) {
      console.error("Failed to load list resources", e);
      showToast("Error loading academy resources.", "error");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/group`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ name: groupName, semesterId }),
      });
      if (!response.ok) throw new Error(await response.text());
      
      showToast(`Group "${groupName}" created successfully!`, "success");
      setGroupName("");
      setSemesterId("");
      setCreateModalOpen(false);
      fetchResources();
    } catch (err: any) {
      showToast(err.message || "Failed to create group", "error");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/group/${studentGroupId}/students`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ groupId: studentGroupId, studentProfileId }),
      });
      if (!response.ok) throw new Error(await response.text());

      showToast("Student enrolled successfully!", "success");
      setStudentProfileId("");
      setStudentModalOpen(false);
      fetchResources();
    } catch (err: any) {
      showToast(err.message || "Failed to enroll student", "error");
    } finally {
      setStudentLoading(false);
    }
  };

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/group/${teacherGroupId}/teachers`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ groupId: teacherGroupId, teacherProfileId, subject: teacherSpec }),
      });
      if (!response.ok) throw new Error(await response.text());

      showToast("Teacher assignment saved!", "success");
      setTeacherProfileId("");
      setTeacherSpec("");
      setTeacherModalOpen(false);
      fetchResources();
    } catch (err: any) {
      showToast(err.message || "Failed to assign teacher", "error");
    } finally {
      setTeacherLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!targetGroup) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/group/${targetGroup.id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error(await response.text());

      showToast(`Group "${targetGroup.name}" has been disbanded.`, "success");
      setDeleteDialog(false);
      setTargetGroup(null);
      fetchResources();
    } catch (err: any) {
      showToast(err.message || "An error occurred.", "error");
    }
  };

  // Combobox Options Maps
  const groupOptions: ComboboxOption[] = groups.map((g) => ({
    value: g.id,
    label: g.name,
    sublabel: g.semesterName || "No semester",
    icon: <Users className="text-indigo-400" size={18} />,
  }));

  const semesterOptions: ComboboxOption[] = semesters.map((s) => ({
    value: s.id,
    label: s.name,
    icon: <Library className="text-emerald-400" size={18} />,
  }));

  const studentOptions: ComboboxOption[] = students.map((s) => ({
    value: s.id,
    label: s.fullName,
    sublabel: `${s.email} • ${s.groupName || 'Unassigned'}`,
    icon: <GraduationCap className="text-blue-400" size={18} />,
  }));

  const teacherOptions: ComboboxOption[] = teachers.map((t) => ({
    value: t.id,
    label: t.fullName,
    sublabel: `${t.email} • ${t.specialization || 'General'}`,
    icon: <Briefcase className="text-amber-400" size={18} />,
  }));


  if (pageLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">Academic Cohorts</h3>
          <p className="text-sm text-slate-400">Loading interactive interface...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-gradient-to-r from-indigo-950/20 to-slate-900/50 p-6 rounded-3xl border border-indigo-500/10">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <Shapes className="text-indigo-500" /> Academic Cohorts
          </h3>
          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
            Beautifully manage your study groups. Add students, assign expert teachers, and organize cohorts securely.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} /> New Group
          </button>
          <button
            onClick={() => setStudentModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-white text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5"
          >
            <GraduationCap size={18} className="text-blue-400" /> Enroll Student
          </button>
          <button
            onClick={() => setTeacherModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 text-white text-sm font-bold rounded-xl transition-all hover:-translate-y-0.5"
          >
            <Briefcase size={18} className="text-amber-400" /> Assign Teacher
          </button>
        </div>
      </div>

      {/* Interactive Group Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <Shapes size={48} className="text-slate-700 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">No active groups</h4>
            <p className="text-slate-400 text-sm max-w-md">Get started by creating a new academic cohort and enrolling your first batch of students.</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="group relative overflow-hidden flex flex-col justify-between p-6 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md hover:bg-slate-900 hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/20">
              <div className="absolute -right-6 -top-6 text-slate-800/50 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                <Users size={120} strokeWidth={1} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-black uppercase tracking-wider rounded-lg">
                    {group.semesterName || 'No Term'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => window.location.href = `/admin/groups/${group.id}/journal`}
                      title="View Journal"
                      className="p-1.5 text-slate-500 hover:bg-indigo-500/20 hover:text-indigo-400 rounded-lg transition-colors"
                    >
                      <Library size={16} />
                    </button>
                    <button 
                      onClick={() => { setTargetGroup({id: group.id, name: group.name}); setDeleteDialog(true); }}
                      className="p-1.5 text-slate-500 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-1 truncate pr-4">{group.name}</h4>
                <p className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <GraduationCap size={16} /> {group.studentCount} Students
                </p>
              </div>

              <div className="relative z-10 mt-8 flex gap-2">
                <button 
                  onClick={() => { setStudentGroupId(group.id); setStudentModalOpen(true); }}
                  className="flex-1 py-2 bg-slate-950/50 hover:bg-blue-500/20 border border-slate-800 hover:border-blue-500/50 text-slate-300 hover:text-blue-400 text-xs font-bold rounded-xl transition-colors text-center"
                >
                  + Student
                </button>
                <button 
                  onClick={() => { setTeacherGroupId(group.id); setTeacherModalOpen(true); }}
                  className="flex-1 py-2 bg-slate-950/50 hover:bg-amber-500/20 border border-slate-800 hover:border-amber-500/50 text-slate-300 hover:text-amber-400 text-xs font-bold rounded-xl transition-colors text-center"
                >
                  + Teacher
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <ActionModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} title="Create New Cohort" icon={<Plus />}>
        <form onSubmit={handleCreateGroup} className="space-y-6">
          <FloatingLabelInput 
            label="Group Name (e.g. CS-101)" 
            value={groupName} 
            onChange={(e) => setGroupName(e.target.value)} 
            icon={<Shapes size={18} />}
            required 
          />
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Academic Term</label>
            <SearchableCombobox 
              options={semesterOptions} 
              value={semesterId} 
              onChange={setSemesterId} 
              placeholder="Select semester..." 
            />
          </div>
          <button type="submit" disabled={createLoading || !semesterId || !groupName} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all disabled:opacity-50">
            {createLoading ? "Creating Group..." : "Initialize Group"}
          </button>
        </form>
      </ActionModal>

      <ActionModal isOpen={isStudentModalOpen} onClose={() => setStudentModalOpen(false)} title="Enroll Student" icon={<GraduationCap />}>
        <form onSubmit={handleAddStudent} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Target Group</label>
            <SearchableCombobox options={groupOptions} value={studentGroupId} onChange={setStudentGroupId} placeholder="Search target group..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Student Profile</label>
            <SearchableCombobox options={studentOptions} value={studentProfileId} onChange={setStudentProfileId} placeholder="Search by name or email..." />
          </div>
          <button type="submit" disabled={studentLoading || !studentGroupId || !studentProfileId} className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-sm transition-all disabled:opacity-50">
            {studentLoading ? "Enrolling..." : "Confirm Enrollment"}
          </button>
        </form>
      </ActionModal>

      <ActionModal isOpen={isTeacherModalOpen} onClose={() => setTeacherModalOpen(false)} title="Assign Teacher" icon={<Briefcase />}>
        <form onSubmit={handleAssignTeacher} className="space-y-6">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Target Group</label>
            <SearchableCombobox options={groupOptions} value={teacherGroupId} onChange={setTeacherGroupId} placeholder="Search target group..." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Teacher Profile</label>
            <SearchableCombobox options={teacherOptions} value={teacherProfileId} onChange={setTeacherProfileId} placeholder="Search by name or email..." />
          </div>
          <FloatingLabelInput 
            label="Specialization / Subject" 
            value={teacherSpec} 
            onChange={(e) => setTeacherSpec(e.target.value)} 
            icon={<Network size={18} />}
            required 
          />
          <button type="submit" disabled={teacherLoading || !teacherGroupId || !teacherProfileId} className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-2xl text-sm transition-all disabled:opacity-50">
            {teacherLoading ? "Assigning..." : "Lock Assignment"}
          </button>
        </form>
      </ActionModal>

      <ConfirmDialog
        isOpen={isDeleteDialog}
        title="Disband Cohort"
        message={`Are you sure you want to disband "${targetGroup?.name}"? Students will be unassigned automatically.`}
        confirmText="Disband"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteDialog(false); setTargetGroup(null); }}
      />
    </div>
  );
}
