// contexts/TripContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Stop {
  location: string;
  date: string;
}

interface TripData {
  tripType: "single" | "return" | "multi";
  persons: number;
  luggageCount: number,
  pickupLocation: string;
  returnLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  returnDateTime: string;
  multiStops: Stop[];
  returnTrip: {
    location: string;
    date: string;
  };
  accessibleVehicle: boolean;
  eventType: string;
  tripName: string;
}

interface TripContextType {
  tripData: TripData;
  updateTripData: (newData: Partial<TripData>) => void;
  resetTripData: () => void;
}

const defaultTripData: TripData = {
  tripType: "return",
  persons: 1,
  luggageCount: 1,
  pickupLocation: "",
  returnLocation: "",
  dropoffLocation: "",
  pickupDateTime: "",
  returnDateTime: "",
  multiStops: [],
  returnTrip: {
    location: "",
    date: ""
  },
  accessibleVehicle: false,
  eventType: "",
  tripName: ""
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tripData, setTripData] = useState<TripData>(defaultTripData);

  const updateTripData = (newData: Partial<TripData>) => {
    setTripData(prev => ({ ...prev, ...newData }));
  };

  const resetTripData = () => {
    setTripData(defaultTripData);
  };

  return (
    <TripContext.Provider value={{ tripData, updateTripData, resetTripData }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextType => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};