"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PersonCounter from "../../components/bookservice/PersonCounter";
import MapCard from "../../components/bookservice/MapCard";
import StopCard from "../../components/bookservice/StopCard";
import Button from "../../components/ui/Button";
import Inputs from "../../components/ui/Inputs";
import { useTrip } from "../../context/tripContext";
import { Icon } from "@iconify/react";
import { ICON_DATA } from "@/app/constants/IconConstants";
import { ROUTES } from "@/app/constants/RoutesConstant";
import tt from "@tomtom-international/web-sdk-maps";

interface Stop {
  location: string;
  date: string;
}

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

const PlanJourney = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    tripData, 
    updateTripData, 
    updatePickupCoordinates, 
    updateDropoffCoordinates,
    updateReturnCoordinates 
  } = useTrip();
  const stopInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // TomTom API Key from environment
  const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;

  // Search functionality state
  const [pickupSuggestions, setPickupSuggestions] = useState<LocationSuggestion[]>([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<LocationSuggestion[]>([]);
  const [returnSuggestions, setReturnSuggestions] = useState<LocationSuggestion[]>([]);
  
  const [isPickupDropdownOpen, setIsPickupDropdownOpen] = useState(false);
  const [isDropoffDropdownOpen, setIsDropoffDropdownOpen] = useState(false);
  const [isReturnDropdownOpen, setIsReturnDropdownOpen] = useState(false);
  
  const [pickupSearchValue, setPickupSearchValue] = useState("");
  const [dropoffSearchValue, setDropoffSearchValue] = useState("");
  const [returnSearchValue, setReturnSearchValue] = useState("");

  // Validation states
  const [pickupValidated, setPickupValidated] = useState(false);
  const [dropoffValidated, setDropoffValidated] = useState(false);
  const [returnValidated, setReturnValidated] = useState(false);
  
  const [pickupError, setPickupError] = useState("");
  const [dropoffError, setDropoffError] = useState("");
  const [returnError, setReturnError] = useState("");

  // Current location states
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] = useState(false);
  const [currentLocationFor, setCurrentLocationFor] = useState<'pickup' | 'dropoff' | 'return' | null>(null);

  // Add flag to track if user is selecting from dropdown
  const [isSelectingFromDropdown, setIsSelectingFromDropdown] = useState(false);

  // Map modal states
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapType, setMapType] = useState<"pickup" | "dropoff" | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<tt.Map | null>(null);

  // Refs for dropdowns
  const pickupDropdownRef = useRef<HTMLDivElement>(null);
  const dropoffDropdownRef = useRef<HTMLDivElement>(null);
  const returnDropdownRef = useRef<HTMLDivElement>(null);
  
  const pickupSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropoffSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const returnSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we should focus on stop input from URL params
  const shouldFocusStop = searchParams.get('focusStop') === 'true';

  // Initialize map when modal opens
  useEffect(() => {
    if (isMapOpen && mapContainerRef.current && TOMTOM_API_KEY) {
      // Initialize TomTom map
      mapRef.current = tt.map({
        key: TOMTOM_API_KEY,
        container: mapContainerRef.current,
        center: [0, 0], // Default center
        zoom: 12,
      });

      // Check for existing coordinates
      let initialCoordinates: { lat: number; lng: number } | null = null;
      if (mapType === "pickup" && tripData.pickupCoordinates) {
        initialCoordinates = {
          lat: tripData.pickupCoordinates.latitude,
          lng: tripData.pickupCoordinates.longitude,
        };
      } else if (mapType === "dropoff" && tripData.dropoffCoordinates) {
        initialCoordinates = {
          lat: tripData.dropoffCoordinates.latitude,
          lng: tripData.dropoffCoordinates.longitude,
        };
      }

      if (initialCoordinates) {
        // Use existing coordinates from tripData
        mapRef.current.setCenter([initialCoordinates.lng, initialCoordinates.lat]);
        setSelectedCoordinates(initialCoordinates);
      } else {
        // Fallback to default location (London)
        mapRef.current.setCenter([-0.1278, 51.5074]);
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
  }, [isMapOpen, TOMTOM_API_KEY, mapType, tripData.pickupCoordinates, tripData.dropoffCoordinates]);

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
            if (mapType === "pickup") {
              setPickupSearchValue(address);
              updateTripData({ pickupLocation: address });
              updatePickupCoordinates(coordinates);
              setPickupValidated(true);
              setPickupError("");
            } else if (mapType === "dropoff") {
              setDropoffSearchValue(address);
              updateTripData({ dropoffLocation: address });
              updateDropoffCoordinates(coordinates);
              setDropoffValidated(true);
              setDropoffError("");
            }
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
  const getCurrentLocation = async (type: 'pickup' | 'dropoff' | 'return') => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setIsGettingCurrentLocation(true);
    setCurrentLocationFor(type);
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

                if (type === 'pickup') {
                  setPickupSearchValue(address);
                  updateTripData({ pickupLocation: address });
                  updatePickupCoordinates(coordinates);
                  setPickupValidated(true);
                  setPickupError("");
                  setIsPickupDropdownOpen(false);
                } else if (type === 'dropoff') {
                  setDropoffSearchValue(address);
                  updateTripData({ dropoffLocation: address });
                  updateDropoffCoordinates(coordinates);
                  setDropoffValidated(true);
                  setDropoffError("");
                  setIsDropoffDropdownOpen(false);
                } else if (type === 'return') {
                  setReturnSearchValue(address);
                  updateTripData({ returnLocation: address });
                  updateReturnCoordinates(coordinates);
                  setReturnValidated(true);
                  setReturnError("");
                  setIsReturnDropdownOpen(false);
                }
              }
            }
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error);
          alert("Could not get address for your location. Please try again.");
        } finally {
          setIsGettingCurrentLocation(false);
          setCurrentLocationFor(null);
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
        setCurrentLocationFor(null);
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

  // Handle pickup search with validation
  const handlePickupSearch = (value: string) => {
    setPickupSearchValue(value);
    setPickupValidated(false);
    setPickupError("");
    updateTripData({ pickupLocation: value });

    if (pickupSearchTimeoutRef.current) {
      clearTimeout(pickupSearchTimeoutRef.current);
    }

    pickupSearchTimeoutRef.current = setTimeout(async () => {
      if (value.length >= 3) {
        const suggestions = await searchTomTomLocations(value);
        setPickupSuggestions(suggestions);
        setIsPickupDropdownOpen(suggestions.length > 0);
      } else {
        setPickupSuggestions([]);
        setIsPickupDropdownOpen(false);
      }
    }, 300);
  };

  // Handle dropoff search with validation
  const handleDropoffSearch = (value: string) => {
    setDropoffSearchValue(value);
    setDropoffValidated(false);
    setDropoffError("");
    updateTripData({ dropoffLocation: value });

    if (dropoffSearchTimeoutRef.current) {
      clearTimeout(dropoffSearchTimeoutRef.current);
    }

    dropoffSearchTimeoutRef.current = setTimeout(async () => {
      if (value.length >= 3) {
        const suggestions = await searchTomTomLocations(value);
        setDropoffSuggestions(suggestions);
        setIsDropoffDropdownOpen(suggestions.length > 0);
      } else {
        setDropoffSuggestions([]);
        setIsDropoffDropdownOpen(false);
      }
    }, 300);
  };

  // Handle return search with validation
  const handleReturnSearch = (value: string) => {
    setReturnSearchValue(value);
    setReturnValidated(false);
    setReturnError("");
    updateTripData({ returnLocation: value });

    if (returnSearchTimeoutRef.current) {
      clearTimeout(returnSearchTimeoutRef.current);
    }

    returnSearchTimeoutRef.current = setTimeout(async () => {
      if (value.length >= 3) {
        const suggestions = await searchTomTomLocations(value);
        setReturnSuggestions(suggestions);
        setIsReturnDropdownOpen(suggestions.length > 0);
      } else {
        setReturnSuggestions([]);
        setIsReturnDropdownOpen(false);
      }
    }, 300);
  };

  // Handle pickup location selection
  const handlePickupSelect = (suggestion: LocationSuggestion) => {
    setIsSelectingFromDropdown(true);
    setPickupSearchValue(suggestion.address);
    updateTripData({ pickupLocation: suggestion.address });
    updatePickupCoordinates(suggestion.coordinates);
    setPickupValidated(true);
    setPickupError("");
    setIsPickupDropdownOpen(false);
    setPickupSuggestions([]);
    
    setTimeout(() => {
      setIsSelectingFromDropdown(false);
    }, 100);
  };

  // Handle dropoff location selection
  const handleDropoffSelect = (suggestion: LocationSuggestion) => {
    setIsSelectingFromDropdown(true);
    setDropoffSearchValue(suggestion.address);
    updateTripData({ dropoffLocation: suggestion.address });
    updateDropoffCoordinates(suggestion.coordinates);
    setDropoffValidated(true);
    setDropoffError("");
    setIsDropoffDropdownOpen(false);
    setDropoffSuggestions([]);
    
    setTimeout(() => {
      setIsSelectingFromDropdown(false);
    }, 100);
  };

  // Handle return location selection
  const handleReturnSelect = (suggestion: LocationSuggestion) => {
    setIsSelectingFromDropdown(true);
    setReturnSearchValue(suggestion.address);
    updateTripData({ returnLocation: suggestion.address });
    updateReturnCoordinates(suggestion.coordinates);
    setReturnValidated(true);
    setReturnError("");
    setIsReturnDropdownOpen(false);
    setReturnSuggestions([]);
    
    setTimeout(() => {
      setIsSelectingFromDropdown(false);
    }, 100);
  };

  // Validation on blur
  const handlePickupBlur = () => {
    if (pickupSearchValue && !pickupValidated && !isSelectingFromDropdown) {
      setPickupError("Please select a location from the dropdown suggestions.");
    }
  };

  const handleDropoffBlur = () => {
    if (dropoffSearchValue && !dropoffValidated && !isSelectingFromDropdown) {
      setDropoffError("Please select a location from the dropdown suggestions.");
    }
  };

  // Open map for pickup or dropoff
  const openMap = (type: "pickup" | "dropoff") => {
    setMapType(type);
    setIsMapOpen(true);
  };

  // Initialize search values from context
  useEffect(() => {
    if (tripData.pickupLocation && !pickupSearchValue) {
      setPickupSearchValue(tripData.pickupLocation || "");
      setPickupValidated(true);
    }
    if (tripData.dropoffLocation && !dropoffSearchValue) {
      setDropoffSearchValue(tripData.dropoffLocation || "");
      setDropoffValidated(true);
    }
  }, [tripData.pickupLocation, tripData.dropoffLocation]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickupDropdownRef.current &&
        !pickupDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPickupDropdownOpen(false);
        if (!isSelectingFromDropdown) {
          setTimeout(() => handlePickupBlur(), 50);
        }
      }

      if (
        dropoffDropdownRef.current &&
        !dropoffDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropoffDropdownOpen(false);
        if (!isSelectingFromDropdown) {
          setTimeout(() => handleDropoffBlur(), 50);
        }
      }
    };

    if (isPickupDropdownOpen || isDropoffDropdownOpen || isReturnDropdownOpen || isMapOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isPickupDropdownOpen, isDropoffDropdownOpen, isReturnDropdownOpen, isMapOpen, isSelectingFromDropdown, pickupSearchValue, dropoffSearchValue, pickupValidated, dropoffValidated]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (pickupSearchTimeoutRef.current) {
        clearTimeout(pickupSearchTimeoutRef.current);
      }
      if (dropoffSearchTimeoutRef.current) {
        clearTimeout(dropoffSearchTimeoutRef.current);
      }
      if (returnSearchTimeoutRef.current) {
        clearTimeout(returnSearchTimeoutRef.current);
      }
    };
  }, []);

  // Render location dropdown
  const renderLocationDropdown = (
    type: 'pickup' | 'dropoff' | 'return',
    suggestions: LocationSuggestion[],
    isOpen: boolean,
    searchValue: string,
    onSelect: (suggestion: LocationSuggestion) => void
  ) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50 max-h-60 overflow-y-auto">
        <button
          onMouseDown={() => setIsSelectingFromDropdown(true)}
          onClick={() => getCurrentLocation(type)}
          disabled={isGettingCurrentLocation && currentLocationFor === type}
          className="w-full text-left px-4 py-3 hover:bg-primary-gray/10 transition-colors border-b border-gray-100 disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            {isGettingCurrentLocation && currentLocationFor === type ? (
              <Icon icon="mdi:loading" className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
            ) : (
              <Icon
                icon="mdi:crosshairs-gps"
                className="w-4 h-4 text-primary flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary">
                {isGettingCurrentLocation && currentLocationFor === type 
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

        {suggestions.length > 0 && (
          <>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onMouseDown={() => setIsSelectingFromDropdown(true)}
                onClick={() => onSelect(suggestion)}
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

        {searchValue.length >= 3 && suggestions.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No locations found. Try a different search term.
          </div>
        )}

        {searchValue.length < 3 && suggestions.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            Type at least 3 characters to search for locations
          </div>
        )}
      </div>
    );
  };

  // Add stop
  const handleAddStop = (index?: number) => {
    const updated = [...tripData.multiStops];
    if (typeof index === "number") {
      updated.splice(index + 1, 0, { location: "", date: "" });
    } else {
      updated.push({ location: "", date: "" });
    }
    updateTripData({ multiStops: updated });
    
    setTimeout(() => {
      const newIndex = typeof index === "number" ? index + 1 : updated.length - 1;
      if (stopInputRefs.current[newIndex]) {
        stopInputRefs.current[newIndex]?.focus();
      }
    }, 50);
  };

  // Update stop
  const handleUpdateStop = (index: number, data: Stop) => {
    const updated = [...tripData.multiStops];
    updated[index] = data;
    updateTripData({ multiStops: updated });
  };

  // Remove stop
  const handleRemoveStop = (index: number) => {
    const updated = [...tripData.multiStops];
    updated.splice(index, 1);
    updateTripData({ multiStops: updated });
  };

  // Handle trip type change with automatic stop card addition
  const handleTripTypeChange = (value: "single" | "return" | "multi") => {
    updateTripData({ tripType: value });
    
    if (value === "multi") {
      if (tripData.multiStops.length === 0) {
        updateTripData({ multiStops: [{ location: "", date: "" }] });
      }
    } else {
      updateTripData({ multiStops: [] });
    }
  };

  // Ensure default stop card exists when component mounts and tripType is multi
  useEffect(() => {
    if (tripData.tripType === "multi" && tripData.multiStops.length === 0) {
      updateTripData({ multiStops: [{ location: "", date: "" }] });
    }
  }, [tripData.tripType, tripData.multiStops.length, updateTripData]);

  // Focus on first stop input when coming from Hero "Add Stop" button
  useEffect(() => {
    if (shouldFocusStop && tripData.tripType === "multi") {
      const timer = setTimeout(() => {
        if (stopInputRefs.current[0]) {
          stopInputRefs.current[0].focus();
          console.log("Focused on stop input");
        }
      }, 300);
      
      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
      
      return () => clearTimeout(timer);
    }
  }, [shouldFocusStop, tripData.tripType, tripData.multiStops]);

  // Next button handler
  const handleNext = () => {
    if (!tripData.pickupLocation || !pickupValidated) {
      setPickupError("Please select a pickup location from the suggestions.");
      return;
    }
    if (!tripData.dropoffLocation || !dropoffValidated) {
      setDropoffError("Please select a dropoff location from the suggestions.");
      return;
    }

    router.push(ROUTES.RESERVE_CAR);
  };

  // Helper function to set stop input ref
  const setStopInputRef = (index: number) => (el: HTMLInputElement | null) => {
    stopInputRefs.current[index] = el;
  };

  return (
    <section className="w-full max-w-[1320px] mx-auto mt-[75px] px-4 sm:px-6 md:px-4 2xl:px-[0px] bg-white">
      <div className="flex flex-col xl:flex-row lg:flex-col max-w-screen-3xl mx-auto sm:px-0 md:px-0 py-6 md:py-10 lg:py-10 lg:gap-8 xl:gap-10 2xl:gap-10">
        {/* Left Panel */}
        <div className="w-full 2xl:w-[580px] xl:w-[600px] md:w-full">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="flex items-center cursor-pointer mb-4 text-[#3DC1C4] hover:text-[#2da8ab] font-medium transition-colors duration-200"
          >
            <i className="fa-solid fa-arrow-left-long mr-2" />
            Back
          </button>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Plan Your Journey
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-600">
            Create your perfect travel itinerary with our premium chauffeur
            service
          </p>

          {/* Itinerary Accordion */}
          <details className="group mt-6 md:mt-8" open>
            <summary className="flex justify-between items-center py-4 cursor-pointer select-none list-none">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Itinerary
              </h2>
              <div className="flex items-center gap-2 sm:gap-4">
               <div className="border-2 border-primary-border/10 rounded-full px-2">
               <select
                  value={tripData.tripType}
                  onChange={(e) =>
                    handleTripTypeChange(
                      e.target.value as "single" | "return" | "multi"
                    )
                  }
                  className="w-35 bg-white text-sm font-medium rounded-full px-2 py-2 focus:outline-none cursor-pointer transition-all duration-100"
                >
                  <option value="single">Single Trip</option>
                  <option value="return">Round-Trip</option>
                  <option value="multi">Multi Stop</option>
                </select>
               </div>
                <i className="fa-solid fa-chevron-down transition-transform duration-200 group-open:rotate-180" />
              </div>
            </summary>

            {/* Pickup Section */}
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 mt-4 bg-[#FCFCFC] space-y-4 sm:space-y-6">
              <div className="sm:flex flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center">
                   <Icon icon={ICON_DATA.HOME} className="text-white w-4 h-4 sm:w-5 sm:h-5"/>
                  </div>
                  <h3 className="text-base sm:text-lg text-[#3DC1C4] font-semibold">
                    Pickup
                  </h3>
                </div>
                <div className="sm:flex flex flex-wrap items-center gap-3">
                  <PersonCounter value={tripData.persons} onChange={(value) => updateTripData({ persons: value })} />
                  {tripData.tripType === "multi" && (
                    <button
                      onClick={() => handleAddStop()}
                      className="text-white font-semibold bg-primary w-[119px] h-[36px] rounded-full cursor-pointer"
                    >
                      + Add Stop
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Pickup Location with Search Dropdown */}
                <div className="relative" ref={pickupDropdownRef}>
                  <label className={`flex items-center gap-2 sm:gap-3 ${pickupError ? 'text-red-600' : ''}`}>
                    <Icon icon={ICON_DATA.LOCATION} className="text-primary-gray w-4 h-4 sm:w-5 sm:h-5"/>
                    <input
                      type="text"
                      value={pickupSearchValue}
                      onChange={(e) => handlePickupSearch(e.target.value)}
                      onFocus={() => {
                        if (!isPickupDropdownOpen) {
                          setIsPickupDropdownOpen(true);
                        }
                      }}
                      onBlur={(e) => {
                        setTimeout(() => {
                          if (!pickupDropdownRef.current?.contains(document.activeElement)) {
                            if (!isSelectingFromDropdown) {
                              handlePickupBlur();
                            }
                            setIsPickupDropdownOpen(false);
                          }
                        }, 150);
                      }}
                      placeholder="Pickup Location"
                      className="w-full bg-transparent focus:outline-none text-base placeholder-gray-400"
                      autoComplete="off"
                    />
                    {pickupValidated && (
                      <Icon
                        icon="mdi:check-circle"
                        className="w-4 h-4 text-green-500"
                      />
                    )}
                  </label>
                  <div className={`border-b ${pickupError ? 'border-red-500' : 'border-gray-300'}`} />
                  <button
                    onClick={() => openMap("pickup")}
                    className="text-primary text-xs mt-1 ml-2 underline hover:text-primary-dark"
                  >
                    Open Map
                  </button>
                  <div className="h-5 mt-1">
                    {pickupError && (
                      <p className="text-red-500 text-xs ml-2">{pickupError}</p>
                    )}
                  </div>
                  {renderLocationDropdown(
                    'pickup',
                    pickupSuggestions,
                    isPickupDropdownOpen,
                    pickupSearchValue,
                    handlePickupSelect
                  )}
                </div>

                <div>
                  <div className="col-span-1 sm:col-span-1">
                    <label className="flex items-center gap-3 w-full">
                      <Icon icon={ICON_DATA.CALENDAR_PICKUP} className="text-primary-gray w-4 h-4 sm:w-5 sm:h-5"/>
                      <Inputs
                        name="Pickup Date & Time"
                        type="datetime-local"
                        value={tripData.pickupDateTime}
                        onChange={(e) => updateTripData({ pickupDateTime: e.target.value })}
                        className="w-full bg-transparent text-sm text-[#9C9C9C] focus:outline-none"
                      />
                    </label>
                  </div>
                  <div className="border-b border-gray-300" />
                </div>
              </div>
            </div>

            {/* Multi Stops */}
            {tripData.tripType === "multi" && tripData.multiStops.length > 0 &&
              tripData.multiStops.map((s, index) => (
                <StopCard
                  key={`stop-${index}`}
                  id={index}
                  location={s.location}
                  date={s.date}
                  totalStops={tripData.multiStops.length}
                  onChange={(id, data) => handleUpdateStop(id as number, data)}
                  onRemove={(id) => handleRemoveStop(id as number)}
                  onAdd={(id) => handleAddStop(id as number)}
                  ref={setStopInputRef(index)}
                />
              ))}

            {/* Dropoff Section */}
            {(tripData.tripType === "single" ||
              tripData.tripType === "return" ||
              tripData.tripType === "multi") && (
              <div className="border bg-[#FCFCFC] border-gray-200 rounded-2xl p-4 sm:p-6 mt-6 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center">
                    <Icon icon={ICON_DATA.DROP_LOCATION} className="text-white w-4 h-4 sm:w-5 sm:h-5"/>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#3DC1C4]">
                    Dropoff
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="col-span-1 sm:col-span-2 relative" ref={dropoffDropdownRef}>
                    <label className={`flex items-center gap-2 sm:gap-3 ${dropoffError ? 'text-red-600' : ''}`}>
                      <Icon icon={ICON_DATA.LOCATION} className="text-primary-gray w-4 h-4 sm:w-5 sm:h-5"/>
                      <input
                        type="text"
                        value={dropoffSearchValue}
                        onChange={(e) => handleDropoffSearch(e.target.value)}
                        onFocus={() => {
                          if (!isDropoffDropdownOpen) {
                            setIsDropoffDropdownOpen(true);
                          }
                        }}
                        onBlur={(e) => {
                          setTimeout(() => {
                            if (!dropoffDropdownRef.current?.contains(document.activeElement)) {
                              if (!isSelectingFromDropdown) {
                                handleDropoffBlur();
                              }
                              setIsDropoffDropdownOpen(false);
                            }
                          }, 150);
                        }}
                        placeholder="Dropoff Location"
                        className="w-full bg-transparent focus:outline-none py-1 sm:py-2 text-sm sm:text-base placeholder-gray-400"
                        autoComplete="off"
                      />
                      {dropoffValidated && (
                        <Icon
                          icon="mdi:check-circle"
                          className="w-4 h-4 text-green-500"
                        />
                      )}
                    </label>
                    <div className={`border-b ${dropoffError ? 'border-red-500' : 'border-gray-300'}`} />
                    <button
                      onClick={() => openMap("dropoff")}
                      className="text-primary text-xs mt-1 ml-2 underline hover:text-primary-dark"
                    >
                      Open Map
                    </button>
                    <div className="h-5 mt-1">
                      {dropoffError && (
                        <p className="text-red-500 text-xs ml-2">{dropoffError}</p>
                      )}
                    </div>
                    {renderLocationDropdown(
                      'dropoff',
                      dropoffSuggestions,
                      isDropoffDropdownOpen,
                      dropoffSearchValue,
                      handleDropoffSelect
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Return Section (only in round trip) */}
            {tripData.tripType === "return" && (
              <div className="border bg-[#FCFCFC] border-gray-200 rounded-2xl p-4 sm:p-6 mt-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center">
                    <Icon icon={ICON_DATA.HOME} className="text-white w-4 h-4 sm:w-5 sm:h-5"/>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#3DC1C4]">
                    Return
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="relative" ref={returnDropdownRef}>
                    <label className={`flex items-center gap-2 sm:gap-3 ${returnError ? 'text-red-600' : ''}`}>
                      <Icon icon={ICON_DATA.LOCATION} className="text-primary-gray w-4 h-4 sm:w-5 sm:h-5"/>
                      <input
                        type="text"
                        value={pickupSearchValue}
                        placeholder="Return Location"
                        className="w-full bg-transparent focus:outline-none text-sm placeholder-gray-400"
                        autoComplete="off"
                        disabled
                      />
                      {returnValidated && (
                        <Icon
                          icon="mdi:check-circle"
                          className="w-4 h-4 text-green-500"
                        />
                      )}
                    </label>
                    <div className={`border-b ${returnError ? 'border-red-500' : 'border-gray-300'}`} />
                    {returnError && (
                      <p className="text-red-500 text-xs mt-1">{returnError}</p>
                    )}
                    {renderLocationDropdown(
                      'return',
                      returnSuggestions,
                      isReturnDropdownOpen,
                      returnSearchValue,
                      handleReturnSelect
                    )}
                  </div>

                  <div>
                    <div className="col-span-1 sm:col-span-1">
                      <label className="flex items-center gap-3 w-full">
                        <Icon icon={ICON_DATA.CALENDAR_RETURN} className="text-primary-gray w-4 h-4 sm:w-5 sm:h-5"/>
                        <Inputs
                          name="Return Date & Time"
                          type="datetime-local"
                          value={tripData.returnDateTime}
                          onChange={(e) => updateTripData({ returnDateTime: e.target.value })}
                          className="w-full bg-transparent text-sm text-[#9C9C9C] focus:outline-none"
                        />
                      </label>
                    </div>
                    <div className="border-b border-gray-300" />
                  </div>
                </div>
              </div>
            )}
          </details>

          <div className="border-t border-gray-200 my-6 md:my-8" />

          {/* Trip Details Accordion */}
          <details className="group md:w-[580px] w-full overflow-hidden" open>
            <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer select-none list-none">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trip Details</h2>
              <i className="fa-solid fa-chevron-down w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="border border-[#DBDBDB] bg-[#FCFCFC] mt-4 rounded-2xl p-5 space-y-6">
              <div>
                <p className="font-medium text-lg text-[#040401]">Trip Name</p>
                <Inputs
                  type="text"
                  value={tripData.tripName || ""}
                  onChange={(e) => updateTripData({ tripName: e.target.value })}
                  placeholder="Round trip"
                  className="text-sm text-[#333] mt-2 focus:border-[#3DC1C4] focus:outline-none w-full bg-transparent"
                  name="Trip Name"
                />
                <div className="border-b border-[#DBDBDB] mt-4"></div>
              </div>

              <div className="flex flex-col md:flex-row md:gap-4 gap-6">
                <div className="w-full md:w-1/2">
                  <p className="font-medium text-lg text-[#040401]">Luggage</p>
                  <Inputs
                    type="number"
                    value={tripData.luggageCount.toString() || ""}
                    onChange={(e) => updateTripData({ luggageCount: parseInt(e.target.value) || 0 })}
                    placeholder="2"
                    className="text-sm mt-2 focus:border-[#3DC1C4] focus:outline-none w-full bg-transparent"
                    name="Luggage"
                  />
                  <div className="border-b border-[#DBDBDB] mt-4"></div>
                </div>
                <div className="w-full md:w-1/2">
                  <p className="font-medium text-lg text-[#040401]">
                    Event Types
                  </p>
                  <select
                    value={tripData.eventType || ""}
                    onChange={(e) => updateTripData({ eventType: e.target.value })}
                    className="text-sm text-[#333] focus:border-[#3DC1C4] focus:outline-none mt-2 w-full bg-transparent cursor-pointer"
                  >
                    <option value="">Select event type</option>
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                    <option value="airport">Airport Transfer</option>
                    <option value="wedding">Wedding</option>
                    <option value="corporate">Corporate</option>
                  </select>
                  <div className="border-b border-[#DBDBDB] mt-4"></div>
                </div>
              </div>

              <div>
                <p className="font-medium text-lg text-[#040401] mb-3">
                  Accessible Vehicle
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={tripData.accessibleVehicle || false}
                    onChange={(e) => updateTripData({ accessibleVehicle: e.target.checked })}
                    className="w-6 h-6 border border-[#D9D9D9] rounded-sm accent-[#3DC1C4]"
                  />
                  <p className="text-sm lg:w-[350px]">
                    ADA standards Compliant
                  </p>
                  <img
                    src="/images/wheel-chair.png"
                    alt="wheelchair"
                    className="w-[39px] h-[39px] lg:ml-auto"
                  />
                </div>
              </div>
            </div>
          </details>

          <Button label="Next" onClick={handleNext} size="full" className="mt-[30px]" />
        </div>

        {/* Right Panel */}
        <div className="w-full lg:mx-auto lg:w-[100%] xl:w-[60%] 2xl:w-[55%] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 rounded-xl overflow-hidden">
          <MapCard
            pickupLocation={tripData.pickupLocation}
            dropoffLocation={tripData.dropoffLocation}
            multiStops={tripData.multiStops}
            tripType={tripData.tripType}
            pickupDateTime={tripData.pickupDateTime}
            returnDateTime={tripData.returnDateTime}
          />
        </div>
      </div>

      {/* Map Modal */}
      {isMapOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90vw] sm:max-w-3xl min-h-[60vh] max-h-[90vh] flex flex-col">
            <button
              onClick={handleCloseClick}
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-800 rounded-full p-2 transition-colors"
            >
              <Icon icon="mdi:close" className="w-6 h-6" />
            </button>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Select {mapType === "pickup" ? "Pickup" : "Dropoff"} Location
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Move or zoom the map to select a location and click Done.
            </p>
            <div className="flex gap-2 mb-4">
              <Button
                label="Done"
                onClick={handleDoneClick}
                variant="primary"
                className="text-xs sm:text-sm"
                size="sm"
              />
              <Button
                label="Close"
                onClick={handleCloseClick}
                variant="secondary"
                className="text-xs sm:text-sm"
                size="sm"
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
          </div>
        </div>
      )}
    </section>
  );
};

export default PlanJourney;
