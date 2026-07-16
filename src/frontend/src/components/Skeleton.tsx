import React from "react";

export function SkeletonCard() {
  return (
    <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/10 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-10 h-10 rounded-xl bg-slate-800"></div>
        <div className="w-16 h-4 rounded bg-slate-800"></div>
      </div>
      <div className="h-4 w-24 bg-slate-800 rounded"></div>
      <div className="h-8 w-12 bg-slate-800 rounded"></div>
    </div>
  );
}

export function SkeletonTable({ rows = 4, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full rounded-2xl border border-slate-900 bg-slate-900/10 p-6 space-y-4 animate-pulse">
      <div className="flex space-x-4 border-b border-slate-900 pb-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-800 rounded flex-1"></div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 py-2">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 bg-slate-800/60 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
}
