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
          <Button
            label="+ Add Stop"
            onClick={() => onAdd(id)}
            size="sm"
            className="mr-3 mb-3 sm:mb-0"
          />
          <Button
            label="Remove Stop"
            onClick={() => onRemove(id)}
            variant="danger"
            size="sm"
          />
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
