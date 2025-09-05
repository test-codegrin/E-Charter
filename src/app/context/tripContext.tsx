"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

type TripType = "single" | "round" | "multi";

interface TripData {
  activeTab: TripType;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  personCount: number;
  luggageCount: number;
  agreeTerms: boolean;
}

interface TripContextProps {
  tripData: TripData;
  setTripData: React.Dispatch<React.SetStateAction<TripData>>;
}

const TripContext = createContext<TripContextProps | undefined>(undefined);

export const TripProvider = ({ children }: { children: ReactNode }) => {
  const [tripData, setTripData] = useState<TripData>({
    activeTab: "single",
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    returnDate: "",
    personCount: 1,
    luggageCount: 1,
    agreeTerms: false,
  });

  return (
    <TripContext.Provider value={{ tripData, setTripData }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = (): TripContextProps => {
  const context = useContext(TripContext);
  if (!context) throw new Error("useTrip must be used inside TripProvider");
  return context;
};
