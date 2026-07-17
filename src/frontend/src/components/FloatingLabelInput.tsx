import React, { useState } from "react";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export function FloatingLabelInput({ label, icon, value, ...props }: FloatingLabelInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && value.toString().length > 0;
  const isFloating = isFocused || hasValue;

  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors peer-focus:text-indigo-400 z-10 pointer-events-none">
          {icon}
        </div>
      )}
      <input
        value={value}
        {...props}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        className={`peer w-full rounded-2xl border border-slate-800 bg-slate-950/50 ${
          icon ? "pl-12" : "pl-4"
        } pr-4 pt-6 pb-2 text-sm text-white transition-all focus:border-indigo-500 focus:bg-slate-900/80 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 disabled:opacity-50`}
      />
      <label
        className={`pointer-events-none absolute left-0 top-4 transition-all duration-200 ease-in-out ${
          icon ? "ml-12" : "ml-4"
        } ${
          isFloating
            ? "-translate-y-2 text-[10px] font-bold text-indigo-400 uppercase tracking-wider"
            : "translate-y-0 text-sm text-slate-500"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
