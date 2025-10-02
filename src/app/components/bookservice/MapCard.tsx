"use client";

import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import tt from '@tomtom-international/web-sdk-maps';
import ttServices from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

interface Stop {
  location: string;
  date: string;
}

interface MapCardProps {
  pickupLocation?: string;
  dropoffLocation?: string;
  multiStops?: Stop[];
  tripType?: "single" | "return" | "multi";
  pickupDateTime?: string;
  returnDateTime?: string;
}

const MapCard: React.FC<MapCardProps> = ({
  pickupLocation,
  dropoffLocation,
  multiStops = [],
  tripType = "single",
  pickupDateTime,
  returnDateTime,
}) => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  
  // TomTom API Key - Replace with your actual API key
  const API_KEY = "ddFpxxGJhInyWJ4RxeDSFkvhLf3IUlXV";

  // Format datetime
  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return "Not set";
    try {
      const date = new Date(dateTimeString);
      const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleDateString("en-US", options);
    } catch {
      return "Invalid date";
    }
  };

  // Initialize TomTom Map
  useEffect(() => {
    if (!mapElement.current || map) return;

    const newMap = tt.map({
      key: API_KEY,
      container: mapElement.current,
      center: [-121.91599, 37.36765], // Default center (San Francisco)
      zoom: 12,
      style: {
        map: 'basic_main',
        poi: 'poi_main'
      }
    });

    setMap(newMap);

    return () => {
      if (newMap) {
        newMap.remove();
      }
    };
  }, []);

  // Geocode location string to coordinates
  const geocodeLocation = async (locationString: string): Promise<[number, number] | null> => {
    if (!locationString.trim()) return null;
    
    try {
      const response = await ttServices.services.fuzzySearch({
        key: API_KEY,
        query: locationString,
        limit: 1
      });

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        return [result.position.lng, result.position.lat];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    
    return null;
  };

  // Clear existing markers
  const clearMarkers = () => {
    markers.forEach(marker => marker.remove());
    setMarkers([]);
  };

  // Add marker to map
  const addMarker = (coordinates: [number, number], color: string, label?: string) => {
    if (!map) return;

    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      background-color: ${color};
    `;

    const marker = new tt.Marker({ element: markerElement })
      .setLngLat(coordinates)
      .addTo(map);

    if (label) {
      const popup = new tt.Popup({ offset: 25, closeButton: false })
        .setHTML(`<div style="font-size: 12px; padding: 4px;">${label}</div>`);
      
      marker.setPopup(popup);
    }

    setMarkers(prev => [...prev, marker]);
    return marker;
  };

  // Calculate route and display on map
  const displayRoute = async (locations: string[]) => {
    if (!map || locations.length < 2) return;

    // Geocode all locations
    const coordinates: [number, number][] = [];
    for (const location of locations) {
      const coords = await geocodeLocation(location);
      if (coords) {
        coordinates.push(coords);
      }
    }

    if (coordinates.length < 2) return;

    // Clear existing markers and routes
    clearMarkers();
    
    // Add markers for pickup, stops, and dropoff
    coordinates.forEach((coord, index) => {
      let color: string;
      let label: string;
      
      if (index === 0) {
        color = '#1FC091'; // Pickup - Green
        label = 'Pickup';
      } else if (index === coordinates.length - 1) {
        color = '#D21313'; // Dropoff - Red  
        label = 'Dropoff';
      } else {
        color = '#FFB800'; // Stop - Yellow
        label = `Stop ${index}`;
      }
      
      addMarker(coord, color, label);
    });

    // Calculate and display route if more than one location
    if (coordinates.length >= 2) {
      try {
        const routeResponse = await ttServices.services.calculateRoute({
          key: API_KEY,
          locations: coordinates.map(coord => `${coord[1]},${coord[0]}`).join(':')
        });

        if (routeResponse.routes && routeResponse.routes.length > 0) {
          const route = routeResponse.routes[0];
          const routeGeoJson = route.toGeoJson();

          // Add route line to map
          map.addLayer({
            id: 'route',
            type: 'line',
            source: {
              type: 'geojson',
              data: routeGeoJson
            },
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3DC1C4',
              'line-width': 4
            }
          });
        }
      } catch (error) {
        console.error('Route calculation error:', error);
      }
    }

    // Fit map to show all markers
    if (coordinates.length > 0) {
      const bounds = new tt.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50 });
    }
  };

  // Update map when locations change
  useEffect(() => {
    if (!map) return;

    const locations: string[] = [];
    
    if (pickupLocation) {
      locations.push(pickupLocation);
    }

    if (tripType === "multi" && multiStops.length > 0) {
      multiStops.forEach(stop => {
        if (stop.location) {
          locations.push(stop.location);
        }
      });
    }

    if (dropoffLocation) {
      locations.push(dropoffLocation);
    }

    if (locations.length > 0) {
      displayRoute(locations);
    }
  }, [map, pickupLocation, dropoffLocation, multiStops, tripType]);

  // Route visualization for single/return
  const renderRouteVisualization = () => {
    return (
      <div className="flex items-center w-full mt-2 md:mt-3">
        <div className="bg-[#C0FFED] w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0">
          <div className="bg-[#1FC091] w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" />
        </div>
        <div className="flex-grow border-b-2 border-gray-200" />
        <div className="bg-[#FFD1D1] w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0">
          <div className="bg-[#D21313] w-2 h-2 md:w-2.5 md:h-2.5 rounded-full" />
        </div>
      </div>
    );
  };

  const renderLocationLabels = () => {
    if (tripType === "multi" && multiStops.length > 0) {
      const allLocations = [
        { location: pickupLocation || "Pickup", date: pickupDateTime },
        ...multiStops.map((stop) => ({
          location: stop.location || "Stop",
          date: stop.date,
        })),
        { location: dropoffLocation || "Dropoff", date: undefined },
      ];
  
      const tooMany = allLocations.length > 5;
  
      return (
        <div className="relative flex flex-col sm:flex-row sm:justify-between items-start mt-1 md:mt-2 flex-wrap">
          <div className="absolute top-2 sm:w-[calc(100%-50px)] left-1/2 -translate-x-1/2 h-0.5 bg-primary-gray/30 z-[-1]" />
  
          {allLocations.map((item, index) => {
            const truncatedLocation =
              item.location.length > 10
                ? item.location.substring(0, 10) + "..."
                : item.location;
  
            const isFirst = index === 0;
            const isLast = index === allLocations.length - 1;
  
            return (
              <div
                key={index}
                className={`flex flex-row sm:flex-col ${
                  isFirst ? "sm:items-start" : isLast ? "sm:items-end" : "sm:items-center"
                } text-center relative group`}
              >
                {/* Dot */}
                <div className="flex items-center mb-2 cursor-pointer">
                  <div
                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex justify-center items-center flex-shrink-0 ${
                      isFirst
                        ? "bg-[#C0FFED]"
                        : isLast
                        ? "bg-[#FFD1D1]"
                        : "bg-[#FFF4CC]"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${
                        isFirst
                          ? "bg-[#1FC091]"
                          : isLast
                          ? "bg-[#D21313]"
                          : "bg-[#FFB800]"
                      }`}
                    />
                  </div>
                </div>
  
                {/* Labels */}
                {tooMany && !isFirst && !isLast ? (
                  <>
                    {/* Desktop/Tablet → Tooltip on hover */}
                    <div className="hidden sm:block">
                      <div className="hidden group-hover:block absolute top-8 left-1/2 -translate-x-1/2 bg-white shadow-lg border border-gray-200 rounded-md p-2 w-40 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-xs font-medium">{item.location}</p>
                        <p className="text-[10px] text-gray-500">
                          {formatDateTime(item.date)}
                        </p>
                      </div>
                    </div>
  
                    {/* Mobile → Always show full label */}
                    <div className="flex flex-row sm:hidden text-center">
                      <p
                        className="text-xs md:text-sm font-medium md:font-semibold px-1 whitespace-nowrap"
                        title={item.location}
                      >
                        {item.location}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">
                        {isLast ? "Arrival time" : formatDateTime(item.date)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p
                      className="text-sm ml-2 font-medium md:font-semibold whitespace-nowrap"
                      title={item.location}
                    >
                      {truncatedLocation}
                    </p>
                    <p className="text-xs ml-2 text-gray-500 mt-0.5 whitespace-nowrap">
                      {isLast ? "Arrival time" : formatDateTime(item.date)}
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  
    // Default for single/return
    return (
      <div className="mt-2">
        <div className="flex justify-between text-sm  font-medium md:font-semibold">
          <p className="truncate max-w-[40%] whitespace-nowrap">{pickupLocation || "Pickup"}</p>
          <p className="truncate max-w-[40%] text-right  whitespace-nowrap">
            {dropoffLocation || "Dropoff"}
          </p>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <p className="truncate max-w-[40%] whitespace-nowrap">{formatDateTime(pickupDateTime)}</p>
          <p className="truncate max-w-[40%] text-right whitespace-nowrap">
            {tripType === "return"
              ? formatDateTime(returnDateTime)
              : "Arrival time"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-h-[877px] lg:mt-[0] mt-[30px] h-full">
      {/* TomTom Map Container */}
      <div className="relative w-full h-full rounded-lg md:rounded-xl overflow-hidden">
        <div 
          ref={mapElement} 
          className="w-full h-full rounded-xl"
          style={{ minHeight: '400px' }}
        />
      </div>

      {/* Overlay */}
      <div className="bg-white shadow-sm md:shadow-md rounded-md md:rounded-lg px-3 py-2 md:px-4 md:py-3 absolute bottom-10 md:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[95%] max-w-[1177px]">
        {/* Top icons */}
        <div className="hidden sm:flex justify-between items-center">
          <Image src={IMAGES_ASSETS.CAR} alt="car" width={40} height={24} />
          <Image src={IMAGES_ASSETS.LOCATION} alt="pin" width={20} height={20} />
        </div>

        {/* Route */}
        {tripType !== "multi" && renderRouteVisualization()}

        {/* Labels */}
        {renderLocationLabels()}
      </div>

      {/* Loading indicator (optional) */}
      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}
    </div>
  );
};

export default MapCard;
