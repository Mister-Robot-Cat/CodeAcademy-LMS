import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-950 py-12 sm:py-24">
      {/* Background blur decorative circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-950/40 text-indigo-300 text-xs font-semibold mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Now live: Phase 2 Academic Core
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none mb-6">
          CodeAcademy <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">LMS</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          A modern, unified learning management system designed for academies, teachers, students, and parent communication.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/20 text-center"
          >
            Go to Login
          </Link>
          <a
            href="https://github.com/Mister-Robot-Cat/CodeAcademy-LMS"
            target="_blank"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/60 hover:bg-slate-900 text-slate-300 font-bold transition-all text-center"
          >
            GitHub Repository
          </a>
        </div>
      </div>
    </div>
  );
}
