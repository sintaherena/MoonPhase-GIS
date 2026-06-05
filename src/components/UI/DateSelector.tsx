'use client';

import { useRef, useState } from 'react';

export interface DateSelectorProps {
  date: Date;
  onChange: (date: Date) => void;
}

/**
 * Format a date in English style: "Thursday, June 5, 2026"
 */
function formatDateEnglish(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Convert Date to input type="date" value string (YYYY-MM-DD)
 */
function toInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * DateSelector - A date picker with prev/next navigation and calendar toggle.
 */
export function DateSelector({ date, onChange }: DateSelectorProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const goToPreviousDay = () => {
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    onChange(prev);
  };

  const goToNextDay = () => {
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    onChange(next);
  };

  const toggleCalendar = () => {
    if (showCalendar) {
      setShowCalendar(false);
    } else {
      setShowCalendar(true);
      // Trigger the native date picker
      setTimeout(() => {
        inputRef.current?.showPicker?.();
      }, 100);
    }
  };

  const handleDateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const parts = value.split('-');
      const newDate = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
      );
      onChange(newDate);
    }
    setShowCalendar(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Previous day button */}
      <button
        type="button"
        onClick={goToPreviousDay}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-space-elevated text-moonlight-muted transition-colors hover:border-cyber-cyan/30 hover:text-cyber-cyan"
        aria-label="Previous day"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Date display / calendar toggle */}
      <button
        type="button"
        onClick={toggleCalendar}
        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-space-elevated px-3 py-2 text-sm text-moonlight transition-colors hover:border-cyber-cyan/30"
        aria-label="Pilih tanggal"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-moonlight-muted"
        >
          <path
            d="M4.375 1.75V3.5M9.625 1.75V3.5M1.75 5.25H12.25M2.625 2.625H11.375C11.878 2.625 12.25 2.997 12.25 3.5V11.375C12.25 11.878 11.878 12.25 11.375 12.25H2.625C2.122 12.25 1.75 11.878 1.75 11.375V3.5C1.75 2.997 2.122 2.625 2.625 2.625Z"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-sans text-xs font-medium">{formatDateEnglish(date)}</span>
      </button>

      {/* Next day button */}
      <button
        type="button"
        onClick={goToNextDay}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-space-elevated text-moonlight-muted transition-colors hover:border-cyber-cyan/30 hover:text-cyber-cyan"
        aria-label="Next day"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Hidden native date input */}
      {showCalendar && (
        <input
          ref={inputRef}
          type="date"
          value={toInputValue(date)}
          onChange={handleDateInput}
          className="absolute opacity-0"
          style={{ pointerEvents: 'none' }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
