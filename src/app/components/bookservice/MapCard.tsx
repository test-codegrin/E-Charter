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
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface MapCardProps {
  pickupLocation?: string;
  dropoffLocation?: string;
  multiStops?: Stop[];
  tripType?: "single" | "round" | "multi";
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
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;

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

  useEffect(() => {
    if (!mapElement.current || map || !TOMTOM_API_KEY) {
      if (!TOMTOM_API_KEY) console.error("TomTom API key is missing!");
      return;
    }

    const newMap = tt.map({
      key: TOMTOM_API_KEY,
      container: mapElement.current,
      center: [-106.3468, 56.1304],
      zoom: 4,
    });

    newMap.on('load', () => {
      console.log("Map loaded successfully");
      setIsMapLoaded(true);
    });

    setMap(newMap);

    return () => {
      if (newMap) {
        newMap.remove();
      }
    };
  }, [TOMTOM_API_KEY]);

  const geocodeLocation = async (locationString: string): Promise<[number, number] | null> => {
    if (!locationString.trim() || !TOMTOM_API_KEY) {
      console.error(`Invalid location or API key: ${locationString}`);
      return null;
    }

    try {
      const response = await ttServices.services.fuzzySearch({
        key: TOMTOM_API_KEY,
        query: locationString,
        limit: 1,
      });

      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.position && typeof result.position.lng === 'number' && typeof result.position.lat === 'number') {
          console.log(`Geocoded ${locationString}: [${result.position.lng}, ${result.position.lat}]`);
          return [result.position.lng, result.position.lat];
        } else {
          console.warn(`No valid position data for ${locationString}`);
          return null;
        }
      } else {
        console.warn(`No geocoding results for ${locationString}`);
      }
    } catch (error) {
      // console.error(`Geocoding error for ${locationString}:`, error);
    }

    return null;
  };

  const clearMap = () => {
    markers.forEach(marker => marker.remove());
    setMarkers([]);

    if (map) {
      if (map.getLayer('route')) {
        map.removeLayer('route');
      }
      if (map.getSource('route')) {
        map.removeSource('route');
      }
    }
  };

  const createCustomMarker = (color: string, isFirst: boolean = false, isLast: boolean = false) => {
    const markerElement = document.createElement('div');
    markerElement.style.cssText = `
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      background-color: ${color};
      position: relative;
      cursor: pointer;
    `;

    const innerDot = document.createElement('div');
    innerDot.style.cssText = `
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${isFirst ? '#1FC091' : isLast ? '#D21313' : '#FFB800'};
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `;

    markerElement.appendChild(innerDot);
    return markerElement;
  };

  const addMarker = (coordinates: [number, number], color: string, label?: string, isFirst?: boolean, isLast?: boolean) => {
    if (!map) return;

    const markerElement = createCustomMarker(color, isFirst, isLast);

    const marker = new tt.Marker({ element: markerElement })
      .setLngLat(coordinates)
      .addTo(map);

    if (label) {
      const popup = new tt.Popup({
        offset: 25,
        closeButton: false,
        className: 'custom-popup',
      }).setHTML(`<div style="font-size: 12px; padding: 4px; font-weight: 500;">${label}</div>`);

      marker.setPopup(popup);
    }

    setMarkers(prev => [...prev, marker]);
    return marker;
  };

  const isLocationValid = (location?: string, dateTime?: string) => {
    return location && location.trim() !== "" && dateTime && dateTime.trim() !== "";
  };

  const isStopValid = (stop: Stop) => {
    return stop.location && stop.location.trim() !== "" && stop.date && stop.date.trim() !== "";
  };

  const displayRoute = async () => {
    if (!map || !isMapLoaded) {
      console.warn("Map not loaded yet, skipping route display");
      return;
    }

    if (!TOMTOM_API_KEY) {
      console.error("Cannot calculate route: TomTom API key is missing");
      return;
    }

    setIsRouteLoading(true);
    clearMap();

    const validLocations: string[] = [];
    const coordinates: [number, number][] = [];

    if (isLocationValid(pickupLocation, pickupDateTime)) {
      validLocations.push(pickupLocation!);
    }

    if (tripType === "multi" && multiStops.length > 0) {
      multiStops.forEach(stop => {
        if (isStopValid(stop)) {
          validLocations.push(stop.location);
        }
      });
    }

    if (dropoffLocation && dropoffLocation.trim() !== "") {
      validLocations.push(dropoffLocation);
    }

    if (validLocations.length < 2) {
      console.warn("Not enough valid locations to draw a route:", validLocations);
      setIsRouteLoading(false);
      return;
    }

    for (const location of validLocations) {
      const coords = await geocodeLocation(location);
      if (coords) {
        coordinates.push(coords);
      }
    }

    if (coordinates.length < 2) {
      console.warn("Not enough valid coordinates to draw a route:", coordinates);
      setIsRouteLoading(false);
      return;
    }

    // Add markers with explicit check for first and last (ensures dropoff is always last)
    const lastIndex = coordinates.length - 1;
    coordinates.forEach((coord, index) => {
      const isFirst = index === 0;
      const isLast = index === lastIndex;
      let color: string;
      let label: string;

      if (isFirst) {
        color = '#C0FFED'; // Pickup
        label = 'Pickup';
      } else if (isLast) {
        color = '#FFD1D1'; // Dropoff
        label = 'Dropoff';
      } else {
        color = '#FFF4CC'; // Stop
        label = `Stop ${index}`;
      }

      addMarker(coord, color, label, isFirst, isLast);
    });

    try {
      const locationsString = coordinates.map(coord => `${coord[1]},${coord[0]}`).join(':');
      console.log("Calculating route with locations:", locationsString);

      const apiUrl = `https://api.tomtom.com/routing/1/calculateRoute/${locationsString}/json?key=${TOMTOM_API_KEY}`;
      const response = await fetch(apiUrl);
      const routeResponse = await response.json();
      const routeColor = '#0040ff';

      console.log("Route response:", JSON.stringify(routeResponse, null, 2));

      if (routeResponse.routes && routeResponse.routes.length > 0) {
        const route = routeResponse.routes[0];

        const routeGeoJson = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: route.legs.reduce((acc: [number, number][], leg: any) => {
              if (leg.points) {
                return acc.concat(
                  leg.points.map((point: { longitude: number; latitude: number }) => [
                    point.longitude,
                    point.latitude,
                  ])
                );
              }
              return acc;
            }, []),
          },
        };

        if (routeGeoJson.geometry.coordinates.length < 2) {
          console.warn("Route GeoJSON has insufficient coordinates:", routeGeoJson);
          setIsRouteLoading(false);
          return;
        }

        const addRouteToMap = () => {
          if (!map.getSource('route')) {
            map.addSource('route', {
              type: 'geojson',
              data: routeGeoJson,
            });

            map.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': routeColor,
                'line-width': 4,
              },
            });
            console.log("Route added to map");
          }
        };

        if (map.loaded()) {
          addRouteToMap();
        } else {
          map.on('load', addRouteToMap);
        }
      } else {
        console.warn("No routes returned from TomTom API");
      }
    } catch (error: any) {
      console.error("Route calculation error:", {
        message: error.message,
        stack: error.stack,
        response: error.response ? JSON.stringify(error.response, null, 2) : 'No response data',
      });
    }

    if (coordinates.length > 0) {
      const bounds = new tt.LngLatBounds();
      coordinates.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50 });
      console.log("Map bounds adjusted to:", bounds);
    }

    setIsRouteLoading(false);
  };

  useEffect(() => {
    if (map && isMapLoaded) {
      console.log("Triggering displayRoute with:", { pickupLocation, dropoffLocation, multiStops, tripType });
      displayRoute();
    }
  }, [map, isMapLoaded, pickupLocation, dropoffLocation, multiStops, tripType, pickupDateTime, returnDateTime]);

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
      const validStops = multiStops.filter(stop => isStopValid(stop));
      
      const allLocations = [];
      
      if (isLocationValid(pickupLocation, pickupDateTime)) {
        allLocations.push({ location: pickupLocation || "Pickup", date: pickupDateTime });
      }
      
      validStops.forEach((stop) => {
        allLocations.push({
          location: stop.location || "Stop",
          date: stop.date,
        });
      });
      
      if (dropoffLocation && dropoffLocation.trim() !== "") {
        allLocations.push({ location: dropoffLocation || "Dropoff", date: undefined });
      }
      
      if (allLocations.length === 0) {
        return (
          <div className="mt-2 text-center text-gray-500 text-sm">
            Set pickup location and time to see route
          </div>
        );
      }
  
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
  
                {tooMany && !isFirst && !isLast ? (
                  <>
                    <div className="hidden sm:block">
                      <div className="hidden group-hover:block absolute top-8 left-1/2 -translate-x-1/2 bg-white shadow-lg border border-gray-200 rounded-md p-2 w-40 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="text-xs font-medium">{item.location}</p>
                        <p className="text-[10px] text-gray-500">
                          {formatDateTime(item.date)}
                        </p>
                      </div>
                    </div>
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
  
    if (!isLocationValid(pickupLocation, pickupDateTime)) {
      return (
        <div className="mt-2 text-center text-gray-500 text-sm">
          Set pickup location and time to see route
        </div>
      );
    }

    return (
      <div className="mt-2">
        <div className="flex justify-between text-sm font-medium md:font-semibold">
          <p className="truncate max-w-[40%] whitespace-nowrap">{pickupLocation || "Pickup"}</p>
          <p className="truncate max-w-[40%] text-right whitespace-nowrap">
            {dropoffLocation || "Dropoff"}
          </p>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <p className="truncate max-w-[40%] whitespace-nowrap">{formatDateTime(pickupDateTime)}</p>
          <p className="truncate max-w-[40%] text-right whitespace-nowrap">
            {tripType === "round"
              ? formatDateTime(returnDateTime)
              : "Arrival time"}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-h-[877px] lg:mt-[0] mt-[30px] h-full">
      <div className="relative w-full h-full rounded-lg md:rounded-xl overflow-hidden">
        <div 
          ref={mapElement} 
          className="w-full h-full rounded-xl"
          style={{ minHeight: '400px' }}
        />
        
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
            <div className="text-gray-500">Loading map...</div>
          </div>
        )}

        {isRouteLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 rounded-xl">
            <div className="text-white text-lg font-medium">Loading Route...</div>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm md:shadow-md rounded-md md:rounded-lg px-3 py-2 md:px-4 md:py-3 absolute bottom-10 md:bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[95%] max-w-[1177px]">
        <div className="hidden sm:flex justify-between items-center">
          <Image src={IMAGES_ASSETS.CAR} alt="car" width={40} height={24} />
          <Image src={IMAGES_ASSETS.LOCATION} alt="pin" width={20} height={20} />
        </div>

        {tripType !== "multi" && isLocationValid(pickupLocation, pickupDateTime) && renderRouteVisualization()}

        {renderLocationLabels()}
      </div>
    </div>
  );
};

export default MapCard;
