"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { ActionModal } from "@/components/ActionModal";
import { FloatingLabelInput } from "@/components/FloatingLabelInput";
import { SearchableCombobox, ComboboxOption } from "@/components/SearchableCombobox";
import { BookOpen, Calendar, Plus, Save, UserCheck, Edit3 } from "lucide-react";

interface Lesson {
  id: string;
  groupId: string;
  teacherProfileId: string;
  teacherName: string;
  title: string;
  date: string;
  homework: string | null;
}

interface GroupDetail {
  id: string;
  name: string;
  teachers: { id: string; fullName: string; specialization: string }[];
}

interface AttendanceRecord {
  studentProfileId: string;
  studentName: string;
  status: number | null;
  notes: string | null;
}

export default function GroupJournalPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const groupId = resolvedParams.id;
  const router = useRouter();
  const { showToast } = useToast();

  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isLessonModalOpen, setLessonModalOpen] = useState(false);
  const [isAttendanceModalOpen, setAttendanceModalOpen] = useState(false);

  // Lesson Form
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDate, setLessonDate] = useState("");
  const [lessonHomework, setLessonHomework] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Attendance Form
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [attendances, setAttendances] = useState<AttendanceRecord[]>([]);

  const getHeaders = () => {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const fetchData = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
    try {
      const [groupRes, lessonsRes] = await Promise.all([
        fetch(`${apiUrl}/api/group/${groupId}`, { headers: getHeaders() }),
        fetch(`${apiUrl}/api/lessons/group/${groupId}?pageSize=100`, { headers: getHeaders() })
      ]);

      if (groupRes.ok) {
        setGroup(await groupRes.json());
      }
      if (lessonsRes.ok) {
        const d = await lessonsRes.json();
        setLessons(d.items || []);
      }
    } catch (e) {
      showToast("Failed to load journal data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/lessons`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          groupId,
          teacherProfileId: selectedTeacherId,
          title: lessonTitle,
          date: lessonDate ? new Date(lessonDate).toISOString() : new Date().toISOString(),
          homework: lessonHomework
        }),
      });

      if (!response.ok) throw new Error(await response.text());

      showToast("Lesson created successfully!", "success");
      setLessonModalOpen(false);
      setLessonTitle("");
      setLessonHomework("");
      fetchData();
    } catch (err: any) {
      showToast(err.message || "Failed to create lesson", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAttendance = async (lesson: Lesson) => {
    setActiveLesson(lesson);
    setAttendanceModalOpen(true);
    setAttendances([]); // Reset while loading

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
    try {
      const response = await fetch(`${apiUrl}/api/attendances/lesson/${lesson.id}`, { headers: getHeaders() });
      if (response.ok) {
        setAttendances(await response.json());
      }
    } catch (e) {
      showToast("Failed to load attendance", "error");
    }
  };

  const handleSaveAttendance = async () => {
    if (!activeLesson) return;
    setIsSubmitting(true);
    
    // Mapping back to the Dto: Guid StudentProfileId, AttendanceStatus Status, string? Notes
    // AttendanceStatus Enum: Present = 0, Absent = 1, Late = 2, Excused = 3, Online = 4
    const payload = attendances.map(a => ({
      studentProfileId: a.studentProfileId,
      status: a.status ?? 0, // default Present if null for saving
      notes: a.notes
    }));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost:7109";
      const response = await fetch(`${apiUrl}/api/attendances`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          lessonId: activeLesson.id,
          attendances: payload
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      showToast("Attendance saved successfully!", "success");
      setAttendanceModalOpen(false);
    } catch (err: any) {
      showToast("Failed to save attendance", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const teacherOptions: ComboboxOption[] = group?.teachers?.map(t => ({
    value: t.id,
    label: t.fullName,
    sublabel: t.specialization,
  })) || [];

  if (loading) {
    return <div className="text-white p-8">Loading journal...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-gradient-to-r from-indigo-950/20 to-slate-900/50 p-6 rounded-3xl border border-indigo-500/10">
        <div>
          <button onClick={() => router.back()} className="text-xs font-bold text-indigo-400 mb-2 uppercase hover:underline">&larr; Back to Groups</button>
          <h3 className="text-2xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <BookOpen className="text-indigo-500" /> Class Journal
          </h3>
          <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
            {group?.name} • Manage lessons, homework, and student attendance.
          </p>
        </div>
        
        <div>
          <button
            onClick={() => setLessonModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} /> New Lesson
          </button>
        </div>
      </div>

      {/* Lessons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
            <BookOpen size={48} className="text-slate-700 mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">No lessons yet</h4>
            <p className="text-slate-400 text-sm">Create the first lesson to start tracking attendance.</p>
          </div>
        ) : (
          lessons.map(lesson => (
            <div key={lesson.id} className="relative overflow-hidden flex flex-col justify-between p-6 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md hover:border-indigo-500/50 transition-all">
              <div>
                <h4 className="text-xl font-bold text-white mb-1 truncate">{lesson.title}</h4>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
                  <Calendar size={14} className="text-indigo-400" />
                  {new Date(lesson.date).toLocaleDateString()} 
                  <span className="mx-1">•</span>
                  {lesson.teacherName}
                </div>
                
                {lesson.homework && (
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider mb-1 block">Homework</span>
                    <p className="text-sm text-slate-300">{lesson.homework}</p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => openAttendance(lesson)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-colors"
              >
                <UserCheck size={16} /> Mark Attendance
              </button>
            </div>
          ))
        )}
      </div>

      {/* New Lesson Modal */}
      <ActionModal isOpen={isLessonModalOpen} onClose={() => setLessonModalOpen(false)} title="Create Lesson" icon={<BookOpen />}>
        <form onSubmit={handleCreateLesson} className="space-y-6">
          <FloatingLabelInput 
            label="Lesson Title (Topic)" 
            value={lessonTitle} 
            onChange={(e) => setLessonTitle(e.target.value)} 
            icon={<Edit3 size={18} />}
            required 
          />
          <FloatingLabelInput 
            label="Date" 
            type="date"
            value={lessonDate} 
            onChange={(e) => setLessonDate(e.target.value)} 
            icon={<Calendar size={18} />}
            required 
          />
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 ml-1 uppercase tracking-wider">Teacher</label>
            <SearchableCombobox 
              options={teacherOptions} 
              value={selectedTeacherId} 
              onChange={setSelectedTeacherId} 
              placeholder="Select teacher..." 
            />
          </div>
          <FloatingLabelInput 
            label="Homework (optional)" 
            value={lessonHomework} 
            onChange={(e) => setLessonHomework(e.target.value)} 
            icon={<BookOpen size={18} />}
          />
          <button type="submit" disabled={isSubmitting || !lessonTitle || !selectedTeacherId} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all disabled:opacity-50">
            {isSubmitting ? "Creating..." : "Save Lesson"}
          </button>
        </form>
      </ActionModal>

      {/* Attendance Modal */}
      <ActionModal isOpen={isAttendanceModalOpen} onClose={() => setAttendanceModalOpen(false)} title={`Attendance: ${activeLesson?.title}`} icon={<UserCheck />}>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {attendances.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-8">No students in this group or loading...</p>
          ) : (
            attendances.map((att, idx) => (
              <div key={att.studentProfileId} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{att.studentName}</span>
                  <select 
                    className="bg-slate-950 border border-slate-800 text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                    value={att.status ?? 0}
                    onChange={(e) => {
                      const newAtt = [...attendances];
                      newAtt[idx].status = parseInt(e.target.value);
                      setAttendances(newAtt);
                    }}
                  >
                    <option value={0}>✅ Present</option>
                    <option value={1}>❌ Absent</option>
                    <option value={2}>⏱️ Late</option>
                    <option value={3}>📝 Excused</option>
                    <option value={4}>🌐 Online</option>
                  </select>
                </div>
                <input 
                  type="text" 
                  placeholder="Optional notes..." 
                  value={att.notes || ""}
                  onChange={(e) => {
                    const newAtt = [...attendances];
                    newAtt[idx].notes = e.target.value;
                    setAttendances(newAtt);
                  }}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))
          )}
        </div>
        <div className="mt-6">
          <button 
            onClick={handleSaveAttendance} 
            disabled={isSubmitting || attendances.length === 0} 
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-sm transition-all disabled:opacity-50"
          >
            <Save size={18} /> {isSubmitting ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </ActionModal>
    </div>
  );
}
