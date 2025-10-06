"use client";

import React, { forwardRef, useState, useRef, useEffect } from "react";
import Button from "../ui/Button";
import { ICON_DATA } from "@/app/constants/IconConstants";
import { Icon } from "@iconify/react";
import tt from "@tomtom-international/web-sdk-maps";
import toast from "react-hot-toast";

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
  pickupCoordinates?: { latitude: number; longitude: number } | null;
}

const StopCard = forwardRef<HTMLInputElement, StopCardProps>(({
  id,
  location,
  date,
  totalStops,
  onAdd,
  onRemove,
  onChange,
  pickupCoordinates = null,
}, ref) => {
  
  // TomTom API Key from environment
  const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;

  // Calgary, AB default coordinates
  const CALGARY_COORDS = { lat: 51.0447, lng: -114.0719 };

  // Search functionality state
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(location || "");

  // Date state
  const [dateValue, setDateValue] = useState(date || "");

  // Keyboard navigation state
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

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

  // Map address display states
  const [currentMapAddress, setCurrentMapAddress] = useState<string>("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const addressFetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize map when modal opens
  useEffect(() => {
    if (isMapOpen && mapContainerRef.current && TOMTOM_API_KEY) {
      // Determine initial coordinates - Use pickup coordinates if available, otherwise Calgary
      let initialLat = CALGARY_COORDS.lat;
      let initialLng = CALGARY_COORDS.lng;

      if (pickupCoordinates) {
        initialLat = pickupCoordinates.latitude;
        initialLng = pickupCoordinates.longitude;
      }

      // Initialize TomTom map with determined coordinates
      mapRef.current = tt.map({
        key: TOMTOM_API_KEY,
        container: mapContainerRef.current,
        center: [initialLng, initialLat], // TomTom uses [lng, lat] format
        zoom: 16,
      });

      setSelectedCoordinates({ lat: initialLat, lng: initialLng });

      // Resize map after centering
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      }, 200);

      // Function to fetch and update address
      const fetchAddressForCoordinates = async (lat: number, lng: number) => {
        if (!TOMTOM_API_KEY) return;
        
        setIsLoadingAddress(true);
        
        try {
          const response = await fetch(
            `https://api.tomtom.com/search/2/reverseGeocode/${lat},${lng}.json?key=${TOMTOM_API_KEY}`
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.addresses && data.addresses.length > 0) {
              const address = data.addresses[0].address.freeformAddress;
              setCurrentMapAddress(address);
            }
          }
        } catch (error) {
          console.error("Error fetching address:", error);
        } finally {
          setIsLoadingAddress(false);
        }
      };

      // Fetch initial address for the displayed location
      fetchAddressForCoordinates(initialLat, initialLng);

      // Function to update coordinates with debounced address fetch
      const updateCoordinates = () => {
        if (mapRef.current) {
          const center = mapRef.current.getCenter();
          setSelectedCoordinates({ lat: center.lat, lng: center.lng });
          
          // Clear previous timeout
          if (addressFetchTimeoutRef.current) {
            clearTimeout(addressFetchTimeoutRef.current);
          }
          
          // Debounce address fetching to avoid too many API calls
          addressFetchTimeoutRef.current = setTimeout(() => {
            fetchAddressForCoordinates(center.lat, center.lng);
          }, 500); // Wait 500ms after user stops moving
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
        // Clear timeout on cleanup
        if (addressFetchTimeoutRef.current) {
          clearTimeout(addressFetchTimeoutRef.current);
        }
      };
    }
  }, [isMapOpen, TOMTOM_API_KEY, pickupCoordinates]);

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
            const country = data.addresses[0].address.country;
            if (country !== "Canada") {
              toast.error("Selected location must be in Canada.");
              return;
            }
            const coordinates = { latitude: lat, longitude: lng };
            setSearchValue(address);
            setValidated(true);
            setError("");
            setIsMapOpen(false);

            // Call onChange with location and current date
            onChange(id, { location: address, date: dateValue, coordinates });
          }
        }
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        toast.error("Could not get address for the selected location.");
      }
    }
  };

  // Handle Close button click
  const handleCloseClick = () => {
    setIsMapOpen(false);
    setSelectedCoordinates(null);
    setCurrentMapAddress("");
  };

  // Get current location using Geolocation API
  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
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
                const country = data.addresses[0].address.country;
                if (country !== "Canada") {
                  toast.error("Current location must be in Canada.");
                  setIsGettingCurrentLocation(false);
                  setIsSelectingFromDropdown(false);
                  return;
                }
                const coordinates = { latitude, longitude };

                setSearchValue(address);
                setValidated(true);
                setError("");
                setIsDropdownOpen(false);

                // Call onChange with location and current date
                onChange(id, { location: address, date: dateValue, coordinates });
              }
            }
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          toast.error("Could not get address for your location. Please try again.");
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
        
        toast.error(errorMessage);
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
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(query)}.json?key=${TOMTOM_API_KEY}&limit=5&typeahead=true&countrySet=CA`
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
    setHighlightedIndex(-1);

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

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen) return;

    // Add 1 for "Use current location" option
    const totalOptions = suggestions.length + 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < totalOptions - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : totalOptions - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex === 0) {
          // Select "Use current location"
          getCurrentLocation();
        } else if (highlightedIndex > 0) {
          // Select suggestion
          const suggestion = suggestions[highlightedIndex - 1];
          if (suggestion) {
            handleLocationSelect(suggestion);
          }
        }
        break;
      case "Escape":
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle location selection
  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setIsSelectingFromDropdown(true);
    setSearchValue(suggestion.address);
    setValidated(true);
    setError("");
    setIsDropdownOpen(false);
    setSuggestions([]);
    setHighlightedIndex(-1);
    
    // Call onChange with location and current date
    onChange(id, { location: suggestion.address, date: dateValue, coordinates: suggestion.coordinates });
    
    setTimeout(() => {
      setIsSelectingFromDropdown(false);
    }, 100);
  };

  // Handle date change - Store date and trigger onChange if location is validated
  const handleDateChange = (newDate: string) => {
    setDateValue(newDate);
    
    // If location is already validated, update context with new date
    if (validated && searchValue) {
      onChange(id, { location: searchValue, date: newDate });
    }
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

  // Initialize search value and date from props
  useEffect(() => {
    if (location && !searchValue) {
      setSearchValue(location);
      setValidated(true);
    }
    if (date && !dateValue) {
      setDateValue(date);
    }
  }, [location, date]);

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
      if (addressFetchTimeoutRef.current) {
        clearTimeout(addressFetchTimeoutRef.current);
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
              onKeyDown={handleKeyDown}
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
                className="w-4 h-4 text-green-500 flex-shrink-0"
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
                onMouseEnter={() => setHighlightedIndex(0)}
                disabled={isGettingCurrentLocation}
                className={`w-full text-left px-4 py-3 transition-colors border-b border-gray-100 disabled:opacity-50 ${
                  highlightedIndex === 0
                    ? "bg-primary/10"
                    : "hover:bg-primary-gray/10"
                }`}
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
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      onMouseDown={() => setIsSelectingFromDropdown(true)}
                      onClick={() => handleLocationSelect(suggestion)}
                      onMouseEnter={() => setHighlightedIndex(index + 1)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        highlightedIndex === index + 1
                          ? "bg-primary/10"
                          : "hover:bg-primary-gray/10"
                      }`}
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
                  No locations found in Canada. Try a different search term.
                </div>
              )}

              {/* Initial message */}
              {searchValue.length < 3 && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Type at least 3 characters to search for locations in Canada
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
            className="text-primary text-xs mt-1 ml-2 self-start  hover:text-primary-dark cursor-pointer"
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
              value={dateValue}
              onChange={(e) => handleDateChange(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#9C9C9C] focus:outline-none cursor-text"
            />
          </label>
        </div>
      </section>

      {/* Map Modal with Real-time Address Display */}
      {isMapOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90vw] sm:max-w-3xl min-h-[60vh] max-h-[90vh] flex flex-col">
            <div className="flex flex-row justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Select Stop Location
                </h3>
                {/* Real-time Address Display */}
                <div className="mt-2 flex items-center gap-2">
                  {isLoadingAddress ? (
                    <>
                      <Icon icon="mdi:loading" className="w-4 h-4 text-primary animate-spin" />
                      <p className="text-sm text-gray-500">Loading address...</p>
                    </>
                  ) : (
                    <>
                      <Icon icon={ICON_DATA.LOCATION} className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="text-sm text-gray-700 font-medium truncate">
                        {currentMapAddress || "Move the map to select a location"}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <Icon
                onClick={handleCloseClick}
                icon="mdi:close"
                className="w-6 h-6 cursor-pointer hover:bg-gray-100 rounded-full p-1 flex-shrink-0"
              />
            </div>

            <div
              id="map"
              ref={mapContainerRef}
              className="w-full flex-1 bg-gray-200 rounded-lg relative"
            >
              <Icon
                icon={ICON_DATA.MAP_LOCATION}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-red-600 z-10 pointer-events-none"
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
