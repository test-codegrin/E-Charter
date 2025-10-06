// contexts/TripContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Coordinates interface for latitude and longitude
interface Coordinates {
  latitude: number;
  longitude: number;
}

interface Stop {
  location: string;
  date: string;
  coordinates?: Coordinates;
}

interface RouteSummary {
  lengthInMeters: number;
  travelTimeInSeconds: number;
}

interface TripData {
  tripType: "single" | "round" | "multi";
  persons: number;
  luggageCount: number;
  pickupLocation: string;
  pickupCoordinates?: Coordinates;
  returnLocation: string;
  returnCoordinates?: Coordinates;
  dropoffLocation: string;
  dropoffCoordinates?: Coordinates;
  pickupDateTime: string;
  returnDateTime: string;
  multiStops: Stop[];
  returnTrip: {
    location: string;
    date: string;
    coordinates?: Coordinates;
  };
  accessibleVehicle: boolean;
  eventType: string;
  tripName: string;
  routeSummary?: RouteSummary;
}

interface TripContextType {
  tripData: TripData;
  updateTripData: (newData: Partial<TripData>) => void;
  resetTripData: () => void;
  // Helper methods for coordinates
  updatePickupCoordinates: (coordinates: Coordinates) => void;
  updateDropoffCoordinates: (coordinates: Coordinates) => void;
  updateReturnCoordinates: (coordinates: Coordinates) => void;
  updateStopCoordinates: (index: number, coordinates: Coordinates) => void;
  updateRouteSummary: (summary: RouteSummary) => void;
  getAllLocationsWithCoordinates: () => Array<{
    location: string;
    coordinates?: Coordinates;
    type: 'pickup' | 'dropoff' | "round" | 'stop';
    index?: number;
  }>;
}

const defaultTripData: TripData = {
  tripType: "single",
  persons: 1,
  luggageCount: 1,
  pickupLocation: "",
  pickupCoordinates: undefined,
  returnLocation: "",
  returnCoordinates: undefined,
  dropoffLocation: "",
  dropoffCoordinates: undefined,
  pickupDateTime: "",
  returnDateTime: "",
  multiStops: [],
  returnTrip: {
    location: "",
    date: "",
    coordinates: undefined
  },
  accessibleVehicle: false,
  eventType: "",
  tripName: "",
  routeSummary: undefined
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

  // Helper method to update pickup coordinates
  const updatePickupCoordinates = (coordinates: Coordinates) => {
    setTripData(prev => ({
      ...prev,
      pickupCoordinates: coordinates
    }));
  };

  // Helper method to update dropoff coordinates
  const updateDropoffCoordinates = (coordinates: Coordinates) => {
    setTripData(prev => ({
      ...prev,
      dropoffCoordinates: coordinates
    }));
  };

  // Helper method to update return coordinates
  const updateReturnCoordinates = (coordinates: Coordinates) => {
    setTripData(prev => ({
      ...prev,
      returnCoordinates: coordinates
    }));
  };

  // Helper method to update stop coordinates
  const updateStopCoordinates = (index: number, coordinates: Coordinates) => {
    setTripData(prev => {
      const updatedStops = [...prev.multiStops];
      if (updatedStops[index]) {
        updatedStops[index] = {
          ...updatedStops[index],
          coordinates: coordinates
        };
      }
      return {
        ...prev,
        multiStops: updatedStops
      };
    });
  };

  // Helper method to update route summary
  const updateRouteSummary = (summary: RouteSummary) => {
    setTripData(prev => ({
      ...prev,
      routeSummary: summary
    }));
  };

  // Helper method to get all locations with their coordinates for map display
  const getAllLocationsWithCoordinates = () => {
    const locations: Array<{
      location: string;
      coordinates?: Coordinates;
      type: 'pickup' | 'dropoff' | "round" | 'stop';
      index?: number;
    }> = [];

    // Add pickup location
    if (tripData.pickupLocation) {
      locations.push({
        location: tripData.pickupLocation,
        coordinates: tripData.pickupCoordinates,
        type: 'pickup'
      });
    }

    // Add multi-stops
    if (tripData.tripType === 'multi' && tripData.multiStops.length > 0) {
      tripData.multiStops.forEach((stop, index) => {
        if (stop.location) {
          locations.push({
            location: stop.location,
            coordinates: stop.coordinates,
            type: 'stop',
            index
          });
        }
      });
    }

    // Add dropoff location
    if (tripData.dropoffLocation) {
      locations.push({
        location: tripData.dropoffLocation,
        coordinates: tripData.dropoffCoordinates,
        type: 'dropoff'
      });
    }

    // Add return location (for return trips)
    if (tripData.tripType === "round" && tripData.returnLocation) {
      locations.push({
        location: tripData.returnLocation,
        coordinates: tripData.returnCoordinates,
        type: "round"
      });
    }

    return locations;
  };

  return (
    <TripContext.Provider value={{ 
      tripData, 
      updateTripData, 
      resetTripData,
      updatePickupCoordinates,
      updateDropoffCoordinates,
      updateReturnCoordinates,
      updateStopCoordinates,
      updateRouteSummary,
      getAllLocationsWithCoordinates
    }}>
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

// Export types for use in other components
export type { Coordinates, Stop, TripData, RouteSummary };
