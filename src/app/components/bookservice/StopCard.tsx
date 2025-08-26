"use client";

import React from "react";

interface StopCardProps {
  id: string | number;
  location: string;
  date: string;
  onAdd: (id: string | number) => void;
  onRemove: (id: string | number) => void;
  onChange: (
    id: string | number,
    data: { location: string; date: string }
  ) => void;
}

const StopCard: React.FC<StopCardProps> = ({
  id,
  location,
  date,
  onAdd,
  onRemove,
  onChange,
}) => {
  // Function to handle adding a stop
  return (
    <article className="mt-6 p-4 bg-[#FCFCFC] border border-[#DBDBDB] rounded-2xl stop-card">
      {/* Header row */}
      <div className="sm:flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex items-center justify-center">
            <img
              src="/images/Mask group.png"
              alt="pickup"
              className="w-4 h-4 sm:w-5 sm:h-5"
            />
          </div>
          <h3 className="text-base sm:text-lg text-[#3DC1C4] font-semibold">
            Stop
          </h3>
        </div>
        <div className="sm:flex items-center">
          <button
            className="px-6 mt-[10px] md:mt-[0] sm:px-4 py-2 bg-[#3DC1C4] hover:bg-[#2da8ab] text-white text-xs sm:text-sm font-medium rounded-full"
            type="button"
            onClick={() => onAdd(id)}
          >
            + Add Stop
          </button>
          <button
            className="px-6 ml-[15px] mt-[10px] md:mt-[0] sm:px-4 py-2 text-white bg-[#FF6363] t   ext-white text-xs sm:text-sm font-medium rounded-full transition hover:brightness-110 focus:outline-none"
            type="button"
            onClick={() => onRemove(id)}
          >
            Remove Stop
          </button>
        </div>
      </div>

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
