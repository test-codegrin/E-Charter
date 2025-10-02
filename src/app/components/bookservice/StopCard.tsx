"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import Inputs from "../ui/Inputs";
import { ICON_DATA } from "@/app/constants/IconConstants";
import { Icon } from "@iconify/react";

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

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen, isSelectingFromDropdown, searchValue, validated]);

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
              className="text-[#FFFFFF] font-semibold bg-danger w-[120px] h-[36px] rounded-full cursor-pointer"
            >
              Remove Stop
            </button>
          </div>
        )}
      </div>

      {/* Inputs section */}
      <section className="flex flex-col max-sm:gap-y-4 sm:flex-row sm:gap-4 mt-6">
        {/* Stop location with Search Dropdown */}
        <div className="w-full sm:w-1/2 relative" ref={dropdownRef}>
          <label className={`flex items-center gap-3 w-full border-b ${error ? 'border-red-500' : 'border-[#DBDBDB]'}`}>
            <Icon icon={ICON_DATA.LOCATION} className="text-primary-gray w-4 h-4 sm:w-5 sm:h-5"/>
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
              className={`w-full bg-transparent text-sm placeholder-[#9C9C9C] focus:outline-none ${error ? 'text-red-600' : ''}`}
              autoComplete="off"
            />
            {validated && (
              <Icon
                icon="mdi:check-circle"
                className="w-4 h-4 text-green-500"
              />
            )}
          </label>
          
          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}

          {/* Location Search Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50 max-h-60 overflow-y-auto">
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
            onChange={(e) => onChange(id, { location: searchValue, date: e.target.value })}
            className="w-full bg-transparent text-sm text-[#9C9C9C] focus:outline-none"
          />
        </label>
      </section>
    </div>
  );
});

StopCard.displayName = "StopCard";

export default StopCard;
