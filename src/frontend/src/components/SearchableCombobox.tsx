import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
}

interface SearchableComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
}

export function SearchableCombobox({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  emptyText = "No options found.",
}: SearchableComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()) ||
    o.sublabel?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-left text-sm text-white transition-all hover:bg-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
      >
        <div className="flex items-center gap-3 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon}
              <div className="flex flex-col">
                <span className="font-semibold text-white">{selectedOption.label}</span>
                {selectedOption.sublabel && (
                  <span className="text-xs text-slate-400">{selectedOption.sublabel}</span>
                )}
              </div>
            </>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50">
          <div className="flex items-center border-b border-slate-800 px-4 py-3">
            <Search size={16} className="text-slate-500 mr-3" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto p-2">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">{emptyText}</div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors hover:bg-slate-800/80 ${
                    value === option.value ? "bg-indigo-500/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    {option.icon}
                    <div className="flex flex-col">
                      <span className={`text-sm ${value === option.value ? "font-bold text-indigo-400" : "font-medium text-slate-200"}`}>
                        {option.label}
                      </span>
                      {option.sublabel && <span className="text-xs text-slate-400">{option.sublabel}</span>}
                    </div>
                  </div>
                  {value === option.value && <Check size={16} className="text-indigo-500" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
