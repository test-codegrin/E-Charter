"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import Inputs from "../ui/Inputs";
import { ICON_DATA } from "@/app/constants/IconConstants";
import { Icon } from "@iconify/react";
import tt from "@tomtom-international/web-sdk-maps";

// TomTom Search Result Interface
interface TomTomSearchResult {
  id: string;
  address: {
    freeformAddress: string;
    country: string;
    municipality?: string;
  };
  position: {
    lat: number;
    lon: number;
  };
  poi?: {
    name: string;
  };
}

// Location Suggestion Interface
interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface StopCardProps {
  id: string | number;
  location: string;
  date: string;
  totalStops: number;
  onAdd: (id: string | number) => void;
  onRemove: (id: string | number) => void;
  onChange: (
    id: string | number,
    data: { location: string; date: string; coordinates?: { latitude: number; longitude: number } }
  ) => void;
}

const StopCard = forwardRef<HTMLInputElement, StopCardProps>(({
  id,
  location,
  date,
  totalStops,
  onAdd,
  onRemove,
  onChange,
}, ref) => {
  // TomTom API Key from environment
  const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;

  // Search functionality state
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(location || "");

  // Validation states
  const [validated, setValidated] = useState(!!location);
  const [error, setError] = useState("");

  // Current location states
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);

  // Flag to track dropdown selection
  const [isSelectingFromDropdown, setIsSelectingFromDropdown] = useState(false);

  // Map modal states
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<tt.Map | null>(null);

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize map when modal opens
  useEffect(() => {
    if (isMapOpen && mapContainerRef.current && TOMTOM_API_KEY) {
      // Initialize TomTom map
      mapRef.current = tt.map({
        key: TOMTOM_API_KEY,
        container: mapContainerRef.current,
        center: [0, 0], // Default center
        zoom: 16,
      });

      // Use existing coordinates from location if available
      let initialCoordinates: { lat: number; lng: number } | null = null;
      if (location && validated) {
        // Assuming coordinates are passed via onChange and stored elsewhere (e.g., parent component)
        // Fallback to a default location if coordinates aren't available
        mapRef.current.setCenter([-0.1278, 51.5074]); // Default: London
        setSelectedCoordinates({ lat: 51.5074, lng: -0.1278 });
      } else {
        mapRef.current.setCenter([-0.1278, 51.5074]); // Default: London
        setSelectedCoordinates({ lat: 51.5074, lng: -0.1278 });
      }

      // Resize map after centering
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      }, 200);

      // Update selected coordinates on map move or zoom
      const updateCoordinates = () => {
        if (mapRef.current) {
          const center = mapRef.current.getCenter();
          setSelectedCoordinates({ lat: center.lat, lng: center.lng });
        }
      };

      mapRef.current.on("moveend", updateCoordinates);
      mapRef.current.on("zoomend", updateCoordinates);

      return () => {
        if (mapRef.current) {
          mapRef.current.off("moveend", updateCoordinates);
          mapRef.current.off("zoomend", updateCoordinates);
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }
  }, [isMapOpen, TOMTOM_API_KEY]);

  // Handle Done button click
  const handleDoneClick = async () => {
    if (selectedCoordinates && TOMTOM_API_KEY) {
      try {
        const { lat, lng } = selectedCoordinates;
        const response = await fetch(
          `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${TOMTOM_API_KEY}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.addresses && data.addresses.length > 0) {
            const address = data.addresses[0].address.freeformAddress;
            const coordinates = { latitude: lat, longitude: lng };
            setSearchValue(address);
            onChange(id, { location: address, date, coordinates });
            setValidated(true);
            setError("");
            setIsMapOpen(false);
          }
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        alert("Could not get address for the selected location.");
      }
    }
  };

  // Handle Close button click
  const handleCloseClick = () => {
    setIsMapOpen(false);
    setSelectedCoordinates(null);
  };

  // Get current location using Geolocation API
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingCurrentLocation(true);
    setIsSelectingFromDropdown(true);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          if (TOMTOM_API_KEY) {
            const response = await fetch(
              `https://api.tomtom.com/search/2/reverseGeocode/${latitude},${longitude}.json?key=${TOMTOM_API_KEY}`
            );
            
            if (response.ok) {
              const data = await response.json();
              
              if (data.addresses && data.addresses.length > 0) {
                const address = data.addresses[0].address.freeformAddress;
                const coordinates = { latitude, longitude };

                setSearchValue(address);
                onChange(id, { location: address, date, coordinates });
                setValidated(true);
                setError("");
                setIsDropdownOpen(false);
              }
            }
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          alert("Could not get address for your location. Please try again.");
        } finally {
          setIsGettingCurrentLocation(false);
          setIsSelectingFromDropdown(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMessage = "Could not get your location. ";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Permission denied. Please enable location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Request timeout.";
            break;
          default:
            errorMessage += "An unknown error occurred.";
        }
        
        alert(errorMessage);
        setIsGettingCurrentLocation(false);
        setIsSelectingFromDropdown(false);
      },
      options
    );
  };

  // Search TomTom API for locations
  const searchTomTomLocations = async (query: string): Promise<LocationSuggestion[]> => {
    if (!query || query.length < 3 || !TOMTOM_API_KEY) return [];

    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&limit=5&typeahead=true`
      );

      if (!response.ok) {
        throw new Error('Search request failed');
      }

      const data = await response.json();
      
      return data.results.map((result: TomTomSearchResult) => ({
        id: result.id || Math.random().toString(36),
        name: result.poi?.name || result.address.freeformAddress,
        address: result.address.freeformAddress,
        coordinates: {
          latitude: result.position.lat,
          longitude: result.position.lon,
        },
      }));
    } catch (error) {
      console.error('TomTom search error:', error);
      return [];
    }
  };

  // Handle location search
  const handleLocationSearch = (value: string) => {
    setSearchValue(value);
    setValidated(false);
    setError("");
    onChange(id, { location: value, date });

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (value.length >= 3) {
        const searchSuggestions = await searchTomTomLocations(value);
        setSuggestions(searchSuggestions);
        setIsDropdownOpen(searchSuggestions.length > 0);
      } else {
        setSuggestions([]);
        setIsDropdownOpen(false);
      }
    }, 300);
  };

  // Handle location selection
  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setIsSelectingFromDropdown(true);
    setSearchValue(suggestion.address);
    onChange(id, { location: suggestion.address, date, coordinates: suggestion.coordinates });
    setValidated(true);
    setError("");
    setIsDropdownOpen(false);
    setSuggestions([]);
    
    setTimeout(() => {
      setIsSelectingFromDropdown(false);
    }, 100);
  };

  // Handle blur validation
  const handleBlur = () => {
    if (searchValue && !validated && !isSelectingFromDropdown) {
      setError("Please select a location from the dropdown suggestions.");
    }
  };

  // Open map for stop location
  const openMap = () => {
    setIsMapOpen(true);
  };

  // Initialize search value from props
  useEffect(() => {
    if (location && !searchValue) {
      setSearchValue(location);
      setValidated(true);
    }
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        if (!isSelectingFromDropdown) {
          setTimeout(() => handleBlur(), 50);
        }
      }
    };

    if (isDropdownOpen || isMapOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen, isMapOpen, isSelectingFromDropdown, searchValue, validated]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="mt-6 p-6 bg-[#FCFCFC] border border-[#DBDBDB] rounded-2xl stop-card">
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
        
        {/* Only show remove button if there's more than one stop */}
        {totalStops > 1 && (
          <div className="">
            <button
              onClick={() => onRemove(id)}
              className="text-[#FFFFFF] font-semibold bg-danger w-[125px] h-[36px] rounded-full cursor-pointer"
            >
              Remove Stop
            </button>
          </div>
        )}
      </div>

      {/* Inputs section */}
      <section className="flex flex-col max-sm:gap-y-4 sm:flex-row sm:gap-4 mt-6">
        {/* Stop location with Search Dropdown */}
       <div className="flex flex-col gap-2 w-full sm:w-1/2">
       <div className="w-full relative h-[40px] sm:h-[44px] flex flex-col" ref={dropdownRef}>
       <label
                      className={`flex items-center gap-3 w-full h-full border rounded-xl px-2 py-1 ${
                        error ? "border-red-500" : "border-[#DBDBDB]"
                      }`}
                    >
            <Icon icon={ICON_DATA.LOCATION} className={`text-primary-gray w-5 h-5 flex-shrink-0 ${error ? "text-red-500" : ""}`}/>
            <input
              ref={ref}
              autoFocus={true}
              name="Stop Location"
              type="text"
              value={searchValue}
              onChange={(e) => handleLocationSearch(e.target.value)}
              onFocus={() => {
                if (!isDropdownOpen) {
                  setIsDropdownOpen(true);
                }
              }}
              onBlur={(e) => {
                setTimeout(() => {
                  if (!dropdownRef.current?.contains(document.activeElement)) {
                    if (!isSelectingFromDropdown) {
                      handleBlur();
                    }
                    setIsDropdownOpen(false);
                  }
                }, 150);
              }}
              placeholder="Stop Location"
              className={`flex-1 bg-transparent text-sm placeholder-[#9C9C9C] focus:outline-none ${error ? 'text-red-600' : ''}`}
              autoComplete="off"
            />
            {validated && (
              <Icon
                icon="mdi:check-circle"
                className="w-5 h-5 text-green-500 flex-shrink-0"
              />
            )}
          </label>
          

          {/* Location Search Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-[40px] left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50 max-h-60 overflow-y-auto">
              {/* Current Location Option */}
              <button
                onMouseDown={() => setIsSelectingFromDropdown(true)}
                onClick={() => getCurrentLocation()}
                disabled={isGettingCurrentLocation}
                className="w-full text-left px-4 py-3 hover:bg-primary-gray/10 transition-colors border-b border-gray-100 disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  {isGettingCurrentLocation ? (
                    <Icon icon="mdi:loading" className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
                  ) : (
                    <Icon
                      icon="mdi:crosshairs-gps"
                      className="w-4 h-4 text-primary flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-primary">
                      {isGettingCurrentLocation 
                        ? 'Getting your location...' 
                        : 'Use current location'
                      }
                    </p>
                    <p className="text-xs text-gray-500">
                      Detect your current position
                    </p>
                  </div>
                </div>
              </button>

              {/* Search Results */}
              {suggestions.length > 0 && (
                <>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onMouseDown={() => setIsSelectingFromDropdown(true)}
                      onClick={() => handleLocationSelect(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-primary-gray/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          icon={ICON_DATA.LOCATION}
                          className="w-4 h-4 text-primary-gray flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {suggestion.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {suggestion.address}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}

              {/* No results message */}
              {searchValue.length >= 3 && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No locations found. Try a different search term.
                </div>
              )}

              {/* Initial message */}
              {searchValue.length < 3 && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Type at least 3 characters to search for locations
                </div>
              )}
            </div>
          )}
        </div>
        {error && (
              <p className="text-red-500 text-xs ml-2">{error}</p>
            )}
        <button
            onClick={openMap}
            className="text-primary text-xs mt-1 ml-2 self-start underline hover:text-primary-dark"
          >
            Open Map
          </button>
         
          
       </div>

        {/* Date only */}
        <div className="w-full sm:w-1/2 relative h-[40px] sm:h-[44px] flex flex-col">
          <label className="flex items-center gap-3 w-full h-full border rounded-xl px-2 py-1 border-[#DBDBDB]">
            <img
              src="/images/Clock.png"
              alt="date-time"
              className="w-5 h-5 flex-shrink-0"
              loading="lazy"
            />
            <input
              name="Stop Date"
              type="date"
              value={date}
              onChange={(e) => onChange(id, { location: searchValue, date: e.target.value })}
              className="flex-1 bg-transparent text-sm text-[#9C9C9C] focus:outline-none"
            />
          </label>
        </div>
      </section>

      {/* Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90vw] sm:max-w-3xl min-h-[60vh] max-h-[90vh] flex flex-col">
            <div className="flex flex-row justify-between">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Select Stop Location
              </h3>
              <Icon
                onClick={handleCloseClick}
                icon="mdi:close"
                className="w-6 h-6 cursor-pointer"
              />
            </div>
            <div
              id="map"
              ref={mapContainerRef}
              className="w-full flex-1 bg-gray-200 rounded-lg relative"
            >
              <Icon
                icon={ICON_DATA.MAP_LOCATION}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-red-600 z-10"
              />
            </div>
            <div className="flex mt-2 justify-end">
              <Button
                label="Done"
                onClick={handleDoneClick}
                variant="primary"
                className="text-xs sm:text-sm"
                size="sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

StopCard.displayName = "StopCard";

export default StopCard;