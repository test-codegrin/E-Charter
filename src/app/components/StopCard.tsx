"use client";

import React from "react";

interface StopCardProps {
  id: string | number;
  location: string;
  date: string;
  onAdd: (id: string | number) => void;
  onRemove: (id: string | number) => void;
  onChange: (id: string | number, data: { location: string; date: string }) => void;
}

const StopCard: React.FC<StopCardProps> = ({
  id,
  location,
  date,
  onAdd,
  onRemove,
  onChange,
}) => {
  return (
    <article className="mt-6 p-4 border border-[#DBDBDB] rounded-2xl stop-card">
      {/* Header row */}
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <div
          aria-hidden
          className="bg-[#3DC1C4] w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        >
          <img
            className="w-5 h-5"
            src="/images/Mask group.png"
            alt="stop icon"
            loading="lazy"
          />
        </div>

        <h2 className="text-lg font-bold text-[#3DC1C4]">Stop</h2>

        <div className="flex gap-2 max-md:w-full max-md:justify-end md:ml-auto">
          <button
            type="button"
            onClick={() => onAdd(id)}
            className="bg-[#3DBEC8] text-white text-sm rounded-full px-4 py-1.5 h-9 transition hover:brightness-110 focus:outline-none"
          >
            + Add Stop
          </button>

          <button
            type="button"
            onClick={() => onRemove(id)}
            className="bg-[#FF6363] text-white text-sm rounded-full px-4 py-1.5 h-9 transition hover:brightness-110 focus:outline-none"
          >
            Remove Stop
          </button>
        </div>
      </header>

      {/* Inputs section */}
      <section className="flex flex-col max-sm:gap-y-4 sm:flex-row sm:gap-4 mt-6">
        {/* Stop location */}
        <label className="flex items-center gap-3 w-full sm:w-1/2 border-b border-[#DBDBDB] py-3">
          <img
            src="/images/Mask group1.png"
            alt="location"
            className="w-6 h-6 shrink-0"
            loading="lazy"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => onChange(id, { location: e.target.value, date })}
            placeholder="Stop Location"
            className="w-full bg-transparent text-sm placeholder-[#9C9C9C] focus:outline-none"
          />
        </label>

        {/* Date & Time */}
        <label className="flex items-center gap-3 w-full sm:w-1/2 border-b border-[#DBDBDB] py-3">
          <img
            src="/images/Clock.png"
            alt="date-time"
            className="w-6 h-6 shrink-0"
            loading="lazy"
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => onChange(id, { location, date: e.target.value })}
            className="w-full bg-transparent text-sm text-[#9C9C9C] focus:outline-none"
          />
        </label>
      </section>
    </article>
  );
};

export default StopCard;
