"use client";

import React from "react";
import Button from "../ui/Button";
import Inputs from "../ui/Inputs";

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
      <div className="sm:flex flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <div className="w-10 h-10 rounded-full bg-[#3DC1C4] flex items-center justify-center">
            <img
              src="/images/Mask group.png"
              alt="pickup"
              className="w-5 h-5"
            />
          </div>
          <div className="">
            <h3 className="text-lg text-[#3DC1C4] font-semibold">Stop</h3>
          </div>
        </div>
        <div className="sm:flex flex flex-wrap gap-3 items-center justify-between w-[250px] mt-[20px]">
          <div>
            <button
              onClick={() => onAdd(id)}
              className="text-[#FFFFFF] font-semibold bg-[#3DBEC8] w-[119px] h-[36px] rounded-full"
            >
              + Add Stop
            </button>
          </div>
          <div className="">
            <button
              onClick={() => onRemove(id)}
              className="text-[#FFFFFF] font-semibold bg-[#FF6363] w-[119px] h-[36px] rounded-full"
            >
              Remove Stop
            </button>
          </div>
        </div>
      </div>

      {/* Inputs section */}
      <section className="flex flex-col max-sm:gap-y-4 sm:flex-row sm:gap-4 mt-6">
        {/* Stop location */}
        <label className="flex items-center gap-3 w-full sm:w-1/2 border-b border-[#DBDBDB]">
          <img
            src="/images/Mask group1.png"
            alt="location"
            className="w-6 h-6 shrink-0"
            loading="lazy"
          />
          <Inputs
            name="Stop Location"
            type="text"
            value={location}
            onChange={(e) => onChange(id, { location: e.target.value, date })}
            placeholder="Stop Location"
            className="w-full bg-transparent text-sm placeholder-[#9C9C9C] focus:outline-none"
          />
        </label>

        {/* Date & Time */}
        <label className="flex items-center gap-3 w-full sm:w-1/2 border-b border-[#DBDBDB]">
          <img
            src="/images/Clock.png"
            alt="date-time"
            className="w-6 h-6 shrink-0"
            loading="lazy"
          />
          <Inputs
            name="Stop Date & Time"
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
