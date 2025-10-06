"use client";

import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";
import Image from "next/image";
import React, { useRef, useEffect, useState, useMemo } from "react";
import tt from '@tomtom-international/web-sdk-maps';
import ttServices from '@tomtom-international/web-sdk-services';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import { useTrip } from "@/app/context/tripContext";

interface Stop {
  location: string;
  date: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const MapCard: React.FC = () => {
  const mapElement = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<tt.Map | null>(null);
  const [markers, setMarkers] = useState<tt.Marker[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;
  const { tripData, updateRouteSummary } = useTrip();

  // Memoize only route-relevant data to prevent unnecessary re-renders
  const routeRelevantData = useMemo(() => ({
    pickupLocation: tripData.pickupLocation,
    pickupDateTime: tripData.pickupDateTime,
    dropoffLocation: tripData.dropoffLocation,
    returnDateTime: tripData.returnDateTime,
    tripType: tripData.tripType,
    multiStops: tripData.multiStops,
  }), [
    tripData.pickupLocation,
    tripData.pickupDateTime,
    tripData.dropoffLocation,
    tripData.returnDateTime,
    tripData.tripType,
    JSON.stringify(tripData.multiStops),
  ]);

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
      return null;
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
    console.log("Map cleared of markers and routes");
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
    console.log(`Added marker: ${label || 'Unnamed'} at [${coordinates[0]}, ${coordinates[1]}]`);
    return marker;
  };

  const isLocationValid = (location?: string, dateTime?: string) => {
    return location && location.trim() !== "" && (dateTime || routeRelevantData.tripType !== "round");
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

    // Build valid locations without duplicates
    const validLocations: { location: string; type: 'pickup' | 'stop' | 'dropoff' | 'return' }[] = [];
    
    if (isLocationValid(routeRelevantData.pickupLocation, routeRelevantData.pickupDateTime)) {
      validLocations.push({ location: routeRelevantData.pickupLocation!, type: 'pickup' });
    }

    if (routeRelevantData.tripType === "multi" && routeRelevantData.multiStops.length > 0) {
      routeRelevantData.multiStops.forEach((stop, index) => {
        if (isStopValid(stop) && !validLocations.some(loc => loc.location === stop.location)) {
          validLocations.push({ location: stop.location, type: 'stop' });
        }
      });
    }

    if (isLocationValid(routeRelevantData.dropoffLocation, routeRelevantData.tripType === "round" ? routeRelevantData.returnDateTime : undefined)) {
      if (!validLocations.some(loc => loc.location === routeRelevantData.dropoffLocation)) {
        validLocations.push({ location: routeRelevantData.dropoffLocation!, type: 'dropoff' });
      }
    }

    // FOR ROUND TRIPS: Add pickup location again as the final destination
    if (routeRelevantData.tripType === "round" && 
        isLocationValid(routeRelevantData.pickupLocation, routeRelevantData.pickupDateTime) &&
        isLocationValid(routeRelevantData.dropoffLocation, routeRelevantData.returnDateTime)) {
      validLocations.push({ location: routeRelevantData.pickupLocation!, type: 'return' });
    }

    console.log("Valid locations:", validLocations);

    if (validLocations.length < 2) {
      console.warn("Not enough valid locations to draw a route:", validLocations);
      setIsRouteLoading(false);
      return;
    }

    const coordinates: [number, number][] = [];
    for (const loc of validLocations) {
      const coords = await geocodeLocation(loc.location);
      if (coords) {
        coordinates.push(coords);
      }
    }

    console.log("Geocoded coordinates:", coordinates);

    if (coordinates.length < 2) {
      console.warn("Not enough valid coordinates to draw a route:", coordinates);
      setIsRouteLoading(false);
      return;
    }

    // Add markers with explicit type-based checks
    validLocations.forEach((loc, index) => {
      const isFirst = loc.type === 'pickup';
      const isLast = loc.type === 'dropoff' || loc.type === 'return';
      const isReturn = loc.type === 'return';
      
      // For round trips, don't show return marker (it's same as pickup)
      if (routeRelevantData.tripType === "round" && isReturn) {
        return;
      }
      
      const color = isFirst ? '#C0FFED' : isLast ? '#FFD1D1' : '#FFF4CC';
      const label = isFirst ? 'Pickup' : 
                    loc.type === 'dropoff' ? 'Dropoff' : 
                    `Stop ${validLocations.filter(l => l.type === 'stop').indexOf(loc) + 1}`;
      addMarker(coordinates[index], color, label, isFirst, isLast);
    });

    try {
      const locationsString = coordinates.map(coord => `${coord[1]},${coord[0]}`).join(':');
      console.log("Calculating route with locations:", locationsString);

      const apiUrl = `https://api.tomtom.com/routing/1/calculateRoute/${locationsString}/json?key=${TOMTOM_API_KEY}&avoid=borderCrossings`;
      const response = await fetch(apiUrl);
      const routeResponse = await response.json();
      const routeColor = '#0040ff';

      console.log("Route response:", JSON.stringify(routeResponse, null, 2));

      if (routeResponse.routes && routeResponse.routes.length > 0) {
        const route = routeResponse.routes[0];

        // EXTRACT AND STORE ROUTE SUMMARY IN CONTEXT
        if (route.summary) {
          const routeSummary = {
            lengthInMeters: route.summary.lengthInMeters,
            travelTimeInSeconds: route.summary.travelTimeInSeconds,
          };
          
          // Update context with route summary
          updateRouteSummary(routeSummary);
          
          console.log("Route summary stored in context:", routeSummary);
        }

        const routeGeoJson: GeoJSON.Feature<GeoJSON.LineString> = {
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
          properties: {},
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

  // Updated useEffect - only triggers when route-relevant data changes
  useEffect(() => {
    if (map && isMapLoaded) {
      console.log("Triggering displayRoute with routeRelevantData:", routeRelevantData);
      displayRoute();
    }
  }, [map, isMapLoaded, routeRelevantData]);

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

  const renderRouteSummary = () => {
    const { routeSummary } = tripData;
    
    if (!routeSummary || !routeSummary.lengthInMeters || !routeSummary.travelTimeInSeconds) {
      return null;
    }

    const distanceKm = (routeSummary.lengthInMeters / 1000).toFixed(1);
    const hours = Math.floor(routeSummary.travelTimeInSeconds / 3600);
    const minutes = Math.floor((routeSummary.travelTimeInSeconds % 3600) / 60);
    
    const timeString = hours > 0 
      ? `${hours}h ${minutes}m` 
      : `${minutes}m`;

    return (
      <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="text-sm font-semibold">{distanceKm} km</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-semibold">{timeString}</span>
        </div>
      </div>
    );
  };

  const renderLocationLabels = () => {
    if (routeRelevantData.tripType === "multi" && routeRelevantData.multiStops.length > 0) {
      const validStops = routeRelevantData.multiStops.filter(stop => isStopValid(stop));
      
      const allLocations: { location: string; date?: string; type: 'pickup' | 'stop' | 'dropoff' }[] = [];
      
      if (isLocationValid(routeRelevantData.pickupLocation, routeRelevantData.pickupDateTime)) {
        allLocations.push({ location: routeRelevantData.pickupLocation || "Pickup", date: routeRelevantData.pickupDateTime, type: 'pickup' });
      }
      
      validStops.forEach((stop, index) => {
        if (!allLocations.some(loc => loc.location === stop.location)) {
          allLocations.push({
            location: stop.location || `Stop ${index + 1}`,
            date: stop.date,
            type: 'stop',
          });
        }
      });
      
      if (isLocationValid(routeRelevantData.dropoffLocation, routeRelevantData.tripType === "multi" ? routeRelevantData.returnDateTime : undefined)) {
        if (!allLocations.some(loc => loc.location === routeRelevantData.dropoffLocation)) {
          allLocations.push({ 
            location: routeRelevantData.dropoffLocation || "Dropoff", 
            date: routeRelevantData.tripType === "multi" ? routeRelevantData.returnDateTime : undefined,
            type: 'dropoff',
          });
        }
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
  
            const isFirst = item.type === 'pickup';
            const isLast = item.type === 'dropoff';
  
            return (
              <div
                key={`${item.type}-${index}`}
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
  
    if (!isLocationValid(routeRelevantData.pickupLocation, routeRelevantData.pickupDateTime)) {
      return (
        <div className="mt-2 text-center text-gray-500 text-sm">
          Set pickup location and time to see route
        </div>
      );
    }

    // ROUND TRIP DISPLAY
    if (routeRelevantData.tripType === "round") {
      return (
        <div className="mt-2">
          <div className="flex justify-between items-center text-sm font-medium md:font-semibold">
            <div className="flex flex-col max-w-[40%]">
              <p className="truncate whitespace-nowrap">{routeRelevantData.pickupLocation || "Pickup"}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(routeRelevantData.pickupDateTime)}</p>
            </div>
            
            <div className="flex flex-col items-center px-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              <p className="text-xs text-gray-500 mt-1">Round Trip</p>
            </div>
            
            <div className="flex flex-col max-w-[40%] text-right">
              <p className="truncate whitespace-nowrap">{routeRelevantData.dropoffLocation || "Dropoff"}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatDateTime(routeRelevantData.returnDateTime)}</p>
            </div>
          </div>
        </div>
      );
    }

    // ONE-WAY TRIP DISPLAY
    return (
      <div className="mt-2">
        <div className="flex justify-between text-sm font-medium md:font-semibold">
          <p className="truncate max-w-[40%] whitespace-nowrap">{routeRelevantData.pickupLocation || "Pickup"}</p>
          <p className="truncate max-w-[40%] text-right whitespace-nowrap">
            {routeRelevantData.dropoffLocation || "Dropoff"}
          </p>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-0.5">
          <p className="truncate max-w-[40%] whitespace-nowrap">{formatDateTime(routeRelevantData.pickupDateTime)}</p>
          <p className="truncate max-w-[40%] text-right whitespace-nowrap">Arrival time</p>
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
        
        {!isMapLoaded || isRouteLoading && (
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

       

        {routeRelevantData.tripType !== "multi" && isLocationValid(routeRelevantData.pickupLocation, routeRelevantData.pickupDateTime) && routeRelevantData.tripType !== "round" && renderRouteVisualization()}

        {renderLocationLabels()}
      </div>
    </div>
  );
};

export default MapCard;
