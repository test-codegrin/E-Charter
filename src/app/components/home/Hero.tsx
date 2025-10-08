"use client";
import React, { JSX, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import Inputs from "../ui/Inputs";
import { useTrip } from "../../context/tripContext";
import { Icon } from "@iconify/react";
import { ICON_DATA } from "@/app/constants/IconConstants";
import { ROUTES } from "@/app/constants/RoutesConstant";
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

type TripType = "single" | "round" | "multi";

export default function Hero(): JSX.Element {
  const router = useRouter();
  const {
    tripData,
    updateTripData,
    updatePickupCoordinates,
    updateDropoffCoordinates,
  } = useTrip();
  const [activeTab, setActiveTab] = useState<TripType>("single");
  const [isMobile, setIsMobile] = useState(false);
  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const [isPersonDropdownOpen, setIsPersonDropdownOpen] = useState(false);
  const [isLuggageDropdownOpen, setIsLuggageDropdownOpen] = useState(false);

  // Search functionality state
  const [pickupSuggestions, setPickupSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [isPickupDropdownOpen, setIsPickupDropdownOpen] = useState(false);
  const [isDropoffDropdownOpen, setIsDropoffDropdownOpen] = useState(false);
  const [pickupSearchValue, setPickupSearchValue] = useState("");
  const [dropoffSearchValue, setDropoffSearchValue] = useState("");

  // Keyboard navigation states
  const [pickupHighlightedIndex, setPickupHighlightedIndex] = useState(-1);
  const [dropoffHighlightedIndex, setDropoffHighlightedIndex] = useState(-1);

  // Validation states
  const [pickupValidated, setPickupValidated] = useState(false);
  const [dropoffValidated, setDropoffValidated] = useState(false);
  const [pickupError, setPickupError] = useState("");
  const [dropoffError, setDropoffError] = useState("");

  // Current location states
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] =
    useState(false);
  const [currentLocationFor, setCurrentLocationFor] = useState<
    "pickup" | "dropoff" | null
  >(null);

  // Map modal states
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapType, setMapType] = useState<"pickup" | "dropoff" | null>(null);
  const [isSelectingFromDropdown, setIsSelectingFromDropdown] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // NEW: Map address display states
  const [currentMapAddress, setCurrentMapAddress] = useState<string>("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Local UI states
  const [showDateDropdown, setShowDateDropdown] = useState<boolean>(false);
  const [showReturnDateDropdown, setShowReturnDateDropdown] =
    useState<boolean>(false);

  // Refs for dropdowns, search, and map
  const tabDropdownRef = useRef<HTMLDivElement>(null);
  const personDropdownRef = useRef<HTMLDivElement>(null);
  const luggageDropdownRef = useRef<HTMLDivElement>(null);
  const pickupDropdownRef = useRef<HTMLDivElement>(null);
  const dropoffDropdownRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<tt.Map | null>(null);
  const pickupSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropoffSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const addressFetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to get current datetime in local format
  const getCurrentDateTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // TomTom API Key from environment
  const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;

  // TRIPS configuration
  const TRIPS = [
    {
      id: "single" as TripType,
      label: "Single Trip",
      icon: "/images/single-trip.svg",
      onClick: () => {
        setActiveTab("single");
        setIsTabDropdownOpen(false);
      },
    },
    {
      id: "round" as TripType,
      label: "Round-Trip",
      icon: "/images/round-trip.svg",
      onClick: () => {
        setActiveTab("round");
        setIsTabDropdownOpen(false);
      },
    },
    {
      id: "multi" as TripType,
      label: "Multi Stop",
      icon: "/images/multistop-trip.svg",
      onClick: () => {
        setActiveTab("multi");
        updateTripData({
          tripType: "multi",
          multiStops: [],
        });
        setIsTabDropdownOpen(false);
        router.push(ROUTES.PLAN_JOURNEY);
      },
    },
  ];

  // Initialize map when modal opens
  useEffect(() => {
    if (isMapOpen && mapContainerRef.current && TOMTOM_API_KEY) {
      mapRef.current = tt.map({
        key: TOMTOM_API_KEY,
        container: mapContainerRef.current,
        center: [0, 0],
        zoom: 15,
      });

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
        mapRef.current.setCenter([
          initialCoordinates.lng,
          initialCoordinates.lat,
        ]);
        setSelectedCoordinates(initialCoordinates);
      } else {
        mapRef.current.setCenter([-79.3832, 43.6532]);
        setSelectedCoordinates({ lat: 43.6532, lng: -79.3832 });
      }

      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      }, 200);

      // NEW: Function to fetch and update address
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

      // Fetch initial address
      if (initialCoordinates) {
        fetchAddressForCoordinates(
          initialCoordinates.lat,
          initialCoordinates.lng
        );
      } else {
        fetchAddressForCoordinates(43.6532, -79.3832);
      }

      // UPDATED: Function to update coordinates with debounced address fetch
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
  }, [
    isMapOpen,
    TOMTOM_API_KEY,
    mapType,
    tripData.pickupCoordinates,
    tripData.dropoffCoordinates,
  ]);

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
        toast.error("Could not get address for the selected location.");
      }
    }
  };

  const handleCloseClick = () => {
    setIsMapOpen(false);
    setSelectedCoordinates(null);
    setCurrentMapAddress("");
  };

  const getCurrentLocation = async (type: "pickup" | "dropoff") => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
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
                const country = data.addresses[0].address.country;
                if (country !== "Canada") {
                  toast.error("Current location must be in Canada.");
                  setIsGettingCurrentLocation(false);
                  setCurrentLocationFor(null);
                  setIsSelectingFromDropdown(false);
                  return;
                }
                const coordinates = { latitude, longitude };

                if (type === "pickup") {
                  setPickupSearchValue(address);
                  updateTripData({ pickupLocation: address });
                  updatePickupCoordinates(coordinates);
                  setPickupValidated(true);
                  setPickupError("");
                  setIsPickupDropdownOpen(false);
                } else if (type === "dropoff") {
                  setDropoffSearchValue(address);
                  updateTripData({ dropoffLocation: address });
                  updateDropoffCoordinates(coordinates);
                  setDropoffValidated(true);
                  setDropoffError("");
                  setIsDropoffDropdownOpen(false);
                }
              }
            }
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          toast.error(
            "Could not get address for your location. Please try again."
          );
        } finally {
          setIsGettingCurrentLocation(false);
          setCurrentLocationFor(null);
          setIsSelectingFromDropdown(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
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
        setCurrentLocationFor(null);
        setIsSelectingFromDropdown(false);
      },
      options
    );
  };

  const searchTomTomLocations = async (
    query: string
  ): Promise<LocationSuggestion[]> => {
    if (!query || query.length < 3 || !TOMTOM_API_KEY) return [];
    try {
      const response = await fetch(
        `https://api.tomtom.com/search/2/search/${encodeURIComponent(
          query
        )}.json?key=${TOMTOM_API_KEY}&limit=5&typeahead=true&countrySet=CA`
      );
      if (!response.ok) {
        throw new Error("Search request failed");
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
      console.error("TomTom search error:", error);
      return [];
    }
  };

  const handlePickupSearch = (value: string) => {
    setPickupSearchValue(value);
    setPickupValidated(false);
    setPickupError("");
    setPickupHighlightedIndex(-1);

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

  const handleDropoffSearch = (value: string) => {
    setDropoffSearchValue(value);
    setDropoffValidated(false);
    setDropoffError("");
    setDropoffHighlightedIndex(-1);

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

  const handlePickupKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isPickupDropdownOpen) return;

    const totalOptions = pickupSuggestions.length + 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setPickupHighlightedIndex((prev) =>
          prev < totalOptions - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setPickupHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : totalOptions - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (pickupHighlightedIndex === 0) {
          getCurrentLocation("pickup");
        } else if (pickupHighlightedIndex > 0) {
          const suggestion = pickupSuggestions[pickupHighlightedIndex - 1];
          if (suggestion) {
            handlePickupSelect(suggestion);
          }
        }
        break;
      case "Escape":
        setIsPickupDropdownOpen(false);
        setPickupHighlightedIndex(-1);
        break;
    }
  };

  const handleDropoffKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropoffDropdownOpen) return;

    const totalOptions = dropoffSuggestions.length + 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setDropoffHighlightedIndex((prev) =>
          prev < totalOptions - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setDropoffHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : totalOptions - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (dropoffHighlightedIndex === 0) {
          getCurrentLocation("dropoff");
        } else if (dropoffHighlightedIndex > 0) {
          const suggestion = dropoffSuggestions[dropoffHighlightedIndex - 1];
          if (suggestion) {
            handleDropoffSelect(suggestion);
          }
        }
        break;
      case "Escape":
        setIsDropoffDropdownOpen(false);
        setDropoffHighlightedIndex(-1);
        break;
    }
  };

  const handlePickupSelect = (suggestion: LocationSuggestion) => {
    setIsSelectingFromDropdown(true);
    setPickupSearchValue(suggestion.address);
    updateTripData({ pickupLocation: suggestion.address });
    updatePickupCoordinates(suggestion.coordinates);
    setPickupValidated(true);
    setPickupError("");
    setIsPickupDropdownOpen(false);
    setPickupSuggestions([]);
    setPickupHighlightedIndex(-1);

    setTimeout(() => {
      setIsSelectingFromDropdown(false);
    }, 100);
  };

  const handleDropoffSelect = (suggestion: LocationSuggestion) => {
    setIsSelectingFromDropdown(true);
    setDropoffSearchValue(suggestion.address);
    updateTripData({ dropoffLocation: suggestion.address });
    updateDropoffCoordinates(suggestion.coordinates);
    setDropoffValidated(true);
    setDropoffError("");
    setIsDropoffDropdownOpen(false);
    setDropoffSuggestions([]);
    setDropoffHighlightedIndex(-1);

    setTimeout(() => {
      setIsSelectingFromDropdown(false);
    }, 100);
  };

  const handlePickupBlur = () => {
    if (pickupSearchValue && !pickupValidated && !isSelectingFromDropdown) {
      setPickupError("Please select a location from the dropdown suggestions.");
    }
  };

  const handleDropoffBlur = () => {
    if (dropoffSearchValue && !dropoffValidated && !isSelectingFromDropdown) {
      setDropoffError(
        "Please select a location from the dropdown suggestions."
      );
    }
  };

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

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 621);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tabDropdownRef.current &&
        !tabDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTabDropdownOpen(false);
      }
      if (
        personDropdownRef.current &&
        !personDropdownRef.current.contains(event.target as Node)
      ) {
        setIsPersonDropdownOpen(false);
      }
      if (
        luggageDropdownRef.current &&
        !luggageDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLuggageDropdownOpen(false);
      }
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
    if (
      isTabDropdownOpen ||
      isPersonDropdownOpen ||
      isLuggageDropdownOpen ||
      isPickupDropdownOpen ||
      isDropoffDropdownOpen ||
      isMapOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    isTabDropdownOpen,
    isPersonDropdownOpen,
    isLuggageDropdownOpen,
    isPickupDropdownOpen,
    isDropoffDropdownOpen,
    isMapOpen,
    isSelectingFromDropdown,
    pickupSearchValue,
    dropoffSearchValue,
    pickupValidated,
    dropoffValidated,
  ]);

  useEffect(() => {
    return () => {
      if (pickupSearchTimeoutRef.current) {
        clearTimeout(pickupSearchTimeoutRef.current);
      }
      if (dropoffSearchTimeoutRef.current) {
        clearTimeout(dropoffSearchTimeoutRef.current);
      }
      if (addressFetchTimeoutRef.current) {
        clearTimeout(addressFetchTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = () => {
    if (!tripData.pickupLocation || !pickupValidated) {
      setPickupError("Please select a pickup location from the suggestions.");
      return;
    }
    if (!tripData.dropoffLocation || !dropoffValidated) {
      setDropoffError("Please select a dropoff location from the suggestions.");
      return;
    }
    if (
      activeTab === "round" &&
      (!tripData.pickupDateTime || !tripData.returnDateTime)
    ) {
      toast.error("Please select both pickup and return dates.");
      return;
    }
    if (activeTab === "single" && !tripData.pickupDateTime) {
      toast.error("Please select a departure date.");
      return;
    }
    updateTripData({
      tripType: activeTab,
    });
    router.push(ROUTES.PLAN_JOURNEY);
  };

  const getActiveTab = () => TRIPS.find((tab) => tab.id === activeTab);

  const handlePersonChange = (newCount: number, event: React.MouseEvent) => {
    event.stopPropagation();
    updateTripData({ persons: newCount });
  };

  const handleLuggageChange = (newCount: number, event: React.MouseEvent) => {
    event.stopPropagation();
    updateTripData({ luggageCount: newCount });
  };

  const openMap = (type: "pickup" | "dropoff") => {
    setMapType(type);
    setIsMapOpen(true);
  };

  const renderLocationDropdown = (
    type: "pickup" | "dropoff",
    suggestions: LocationSuggestion[],
    isOpen: boolean,
    searchValue: string,
    onSelect: (suggestion: LocationSuggestion) => void,
    highlightedIndex: number
  ) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-[30px] sm:top-[55px] left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50 max-h-60 overflow-y-auto">
        <button
          onMouseDown={() => setIsSelectingFromDropdown(true)}
          onClick={() => getCurrentLocation(type)}
          onMouseEnter={() => {
            if (type === "pickup") setPickupHighlightedIndex(0);
            if (type === "dropoff") setDropoffHighlightedIndex(0);
          }}
          disabled={isGettingCurrentLocation && currentLocationFor === type}
          className={`w-full text-left px-4 py-3 transition-colors border-b border-gray-100 disabled:opacity-50 ${
            highlightedIndex === 0
              ? "bg-primary/10"
              : "hover:bg-primary-gray/10"
          }`}
        >
          <div className="flex items-center gap-3">
            {isGettingCurrentLocation && currentLocationFor === type ? (
              <Icon
                icon="mdi:loading"
                className="w-4 h-4 text-primary animate-spin flex-shrink-0"
              />
            ) : (
              <Icon
                icon="mdi:crosshairs-gps"
                className="w-4 h-4 text-primary flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary">
                {isGettingCurrentLocation && currentLocationFor === type
                  ? "Getting your location..."
                  : "Use current location"}
              </p>
              <p className="text-xs text-gray-500">
                Detect your current position
              </p>
            </div>
          </div>
        </button>

        {suggestions.length > 0 && (
          <>
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.id}
                onMouseDown={() => setIsSelectingFromDropdown(true)}
                onClick={() => onSelect(suggestion)}
                onMouseEnter={() => {
                  if (type === "pickup") setPickupHighlightedIndex(index + 1);
                  if (type === "dropoff") setDropoffHighlightedIndex(index + 1);
                }}
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

        {searchValue.length >= 3 && suggestions.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No locations found in Canada. Try a different search term.
          </div>
        )}

        {searchValue.length < 3 && suggestions.length === 0 && (
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            Type at least 3 characters to search for locations in Canada
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-8 xl:px-0 2xl:px-0">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src="/images/BG-Car.png"
          alt="Background"
          className="w-full h-full object-cover bg-black"
        />
      </div>
      <div className="relative z-20 w-full max-w-screen-2xl mx-auto mt-16 md:mt-20">
        <div className="flex flex-col items-center text-center px-4 sm:px-6 md:px-8 mb-8 md:mb-12 lg:mb-16">
          <p className="text-primary text-sm md:text-base lg:text-lg font-medium mb-2 md:mb-3">
            ∗ Welcome To e CHARTER
          </p>
          <h1 className="text-white font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight px-2 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto mb-4 md:mb-6">
            Looking to save more on your rental car?
          </h1>
          <p className="text-white text-xs sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl mx-auto">
            Whether you're planning a weekend getaway, a business trip, or just
            need a reliable ride for the day, we offer a wide range of vehicles
            to suit your needs.
          </p>
        </div>
        <div className="w-full max-w-4xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 mt-8 md:mt-12 lg:mt-0">
          <div className="bg-white w-full h-auto rounded-xl md:rounded-2xl lg:rounded-3xl shadow-lg px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6">
            <div className="flex flex-col lg:flex-row items-center pb-4 justify-between border-b border-primary-gray/50">
              <div className="flex flex-col md:flex-row gap-5 items-center sm:items-start">
                <div className="relative w-45 lg:w-50" ref={tabDropdownRef}>
                  <button
                    onClick={() => setIsTabDropdownOpen(!isTabDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-primary-gray/10 hover:bg-primary-gray/20 transition-colors duration-300 cursor-pointer rounded-full text-sm font-semibold text-primary-gray"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getActiveTab()?.icon}
                        alt={getActiveTab()?.label}
                        className="w-6 h-6 color"
                      />
                      <span className="text-black font-medium">
                        {getActiveTab()?.label}
                      </span>
                    </div>
                    <Icon
                      icon={
                        isTabDropdownOpen
                          ? "mdi:chevron-up"
                          : "mdi:chevron-down"
                      }
                      className="w-5 h-5 text-primary"
                    />
                  </button>
                  {isTabDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50">
                      {TRIPS.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={tab.onClick}
                          className={`w-full flex cursor-pointer items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-primary-gray/20 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            activeTab === tab.id
                              ? "text-primary bg-primary/5"
                              : "text-primary-gray"
                          }`}
                        >
                          <img
                            src={tab.icon}
                            alt={tab.label}
                            className="w-5 h-5"
                          />
                          <span>{tab.label}</span>
                          {activeTab === tab.id ? (
                            <Icon
                              icon={ICON_DATA.RADIO_ACTIVE}
                              className="w-5 h-5 text-primary ml-auto"
                            />
                          ) : (
                            <Icon
                              icon={ICON_DATA.RADIO_INACTIVE}
                              className="w-5 h-5 text-primary-gray ml-auto"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className="relative w-30 md:w-40 lg:w-50"
                    ref={personDropdownRef}
                  >
                    <button
                      onClick={() =>
                        setIsPersonDropdownOpen(!isPersonDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-primary-gray/10 hover:bg-primary-gray/20 transition-colors duration-300 cursor-pointer rounded-full text-sm font-semibold text-primary-gray"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-black text-xs md:text-sm">
                          {tripData.persons === 1
                            ? ` ${tripData.persons} Person`
                            : ` ${tripData.persons} Persons`}
                        </span>
                      </div>
                      <Icon
                        icon={
                          isPersonDropdownOpen
                            ? "mdi:chevron-up"
                            : "mdi:chevron-down"
                        }
                        className="w-5 h-5 text-primary"
                      />
                    </button>
                    {isPersonDropdownOpen && (
                      <div className="absolute w-fit top-full left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50">
                        <div className="flex flex-col lg:flex-row items-center lg:gap-3 px-4 py-3">
                          <p>Persons</p>
                          <div className="flex items-center gap-3 px-4 py-3">
                            <button
                              onClick={(e) =>
                                handlePersonChange(
                                  Math.max(1, tripData.persons - 1),
                                  e
                                )
                              }
                              disabled={tripData.persons === 1}
                              className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center ${
                                tripData.persons === 1
                                  ? "bg-primary-gray"
                                  : "bg-primary"
                              } text-white rounded-full cursor-pointer`}
                            >
                              <i className="fa-solid fa-minus text-xs" />
                            </button>
                            <span className="min-w-[16px] sm:min-w-[20px] text-center text-sm sm:text-base">
                              {tripData.persons}
                            </span>
                            <button
                              onClick={(e) =>
                                handlePersonChange(tripData.persons + 1, e)
                              }
                              className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-primary text-white rounded-full"
                            >
                              <i className="fa-solid fa-plus text-xs cursor-pointer" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    className="relative w-30 md:w-40 lg:w-50"
                    ref={luggageDropdownRef}
                  >
                    <button
                      onClick={() =>
                        setIsLuggageDropdownOpen(!isLuggageDropdownOpen)
                      }
                      className="w-full flex items-center justify-between px-4 py-3 bg-primary-gray/10 hover:bg-primary-gray/20 transition-colors duration-300 cursor-pointer rounded-full text-sm font-semibold text-primary-gray"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-black text-xs md:text-sm">
                          {tripData.luggageCount === 1
                            ? ` ${tripData.luggageCount} Luggage`
                            : ` ${tripData.luggageCount} Luggages`}
                        </span>
                      </div>
                      <Icon
                        icon={
                          isLuggageDropdownOpen
                            ? "mdi:chevron-up"
                            : "mdi:chevron-down"
                        }
                        className="w-5 h-5 text-primary"
                      />
                    </button>
                    {isLuggageDropdownOpen && (
                      <div className="absolute w-fit top-full left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50">
                        <div className="flex flex-col lg:flex-row items-center lg:gap-3 px-4 py-3">
                          <p>Luggage</p>
                          <div className="flex items-center gap-3 px-4 py-3">
                            <button
                              onClick={(e) =>
                                handleLuggageChange(
                                  Math.max(0, tripData.luggageCount - 1),
                                  e
                                )
                              }
                              disabled={tripData.luggageCount === 0}
                              className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center ${
                                tripData.luggageCount === 0
                                  ? "bg-primary-gray"
                                  : "bg-primary"
                              } text-white rounded-full cursor-pointer`}
                            >
                              <i className="fa-solid fa-minus text-xs" />
                            </button>
                            <span className="min-w-[16px] sm:min-w-[20px] text-center text-xs sm:text-base">
                              {tripData.luggageCount}
                            </span>
                            <button
                              disabled={tripData.luggageCount === 10}
                              onClick={(e) =>
                                handleLuggageChange(
                                  Math.min(10, tripData.luggageCount + 1),
                                  e
                                )
                              }
                              className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-white rounded-full ${
                                tripData.luggageCount === 10
                                  ? "bg-primary-gray"
                                  : "bg-primary"
                              }`}
                            >
                              <i className="fa-solid fa-plus text-xs cursor-pointer" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Button
                label="Get Quote"
                onClick={handleSubmit}
                variant="primary"
                className="text-xs hidden lg:block mb-2 sm:mb-0 mt-4 lg:mt-0 sm:text-sm min-w-fit sm:min-w-fit"
                size="sm"
              />
            </div>

            {/* Form Fields */}
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2  ${
                activeTab === "round" ? "xl:grid-cols-4" : "xl:grid-cols-3"
              } gap-3 sm:gap-4 py-3 md:py-4 items-start`}
            >
              {(activeTab === "single" || activeTab === "round") && (
                <>
                  <div
                    className="relative sm:min-h-[80px] flex flex-col"
                    ref={pickupDropdownRef}
                  >
                    <div
                      className={`flex items-center border rounded-xl p-1 sm:p-2 h-12 sm:h-14 ${
                        pickupError
                          ? "border-red-500"
                          : "border-primary-gray/50"
                      }`}
                    >
                      <Icon
                        icon={ICON_DATA.HOME}
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-2 text-primary-gray"
                      />
                      <input
                        name="pickup"
                        type="text"
                        placeholder="Pickup Location"
                        value={pickupSearchValue}
                        onChange={(e) => handlePickupSearch(e.target.value)}
                        onKeyDown={handlePickupKeyDown}
                        onFocus={() => {
                          if (!isPickupDropdownOpen) {
                            setIsPickupDropdownOpen(true);
                          }
                        }}
                        onBlur={(e) => {
                          setTimeout(() => {
                            if (
                              !pickupDropdownRef.current?.contains(
                                document.activeElement
                              )
                            ) {
                              if (!isSelectingFromDropdown) {
                                handlePickupBlur();
                              }
                              setIsPickupDropdownOpen(false);
                            }
                          }, 150);
                        }}
                        className={`flex-1 p-1 sm:p-2 focus:outline-none border-none bg-transparent text-xs sm:text-sm md:text-base ${
                          pickupError ? "text-red-600" : ""
                        }`}
                        autoComplete="off"
                      />
                      {pickupValidated && (
                        <Icon
                          icon="mdi:check-circle"
                          className="w-4 h-4 text-green-500 mr-2"
                        />
                      )}
                    </div>
                    <button
                      onClick={() => openMap("pickup")}
                      className="text-primary text-xs mt-1 ml-2 self-start hover:text-primary-dark cursor-pointer"
                    >
                      Open Map
                    </button>

                    {pickupError && (
                      <p className="text-red-500 text-xs ml-2">{pickupError}</p>
                    )}

                    {renderLocationDropdown(
                      "pickup",
                      pickupSuggestions,
                      isPickupDropdownOpen,
                      pickupSearchValue,
                      handlePickupSelect,
                      pickupHighlightedIndex
                    )}
                  </div>

                  <div
                    className="relative sm:min-h-[80px] flex flex-col"
                    ref={dropoffDropdownRef}
                  >
                    <div
                      className={`flex items-center border rounded-xl p-1 sm:p-2 h-12 sm:h-14 ${
                        dropoffError
                          ? "border-red-500"
                          : "border-primary-gray/50"
                      }`}
                    >
                      <Icon
                        icon={ICON_DATA.DROP_LOCATION}
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ml-1 sm:ml-2 text-primary-gray"
                      />
                      <input
                        name="dropoff"
                        type="text"
                        placeholder="Drop Off Location"
                        value={dropoffSearchValue}
                        onChange={(e) => handleDropoffSearch(e.target.value)}
                        onKeyDown={handleDropoffKeyDown}
                        onFocus={() => {
                          if (!isDropoffDropdownOpen) {
                            setIsDropoffDropdownOpen(true);
                          }
                        }}
                        onBlur={(e) => {
                          setTimeout(() => {
                            if (
                              !dropoffDropdownRef.current?.contains(
                                document.activeElement
                              )
                            ) {
                              if (!isSelectingFromDropdown) {
                                handleDropoffBlur();
                              }
                              setIsDropoffDropdownOpen(false);
                            }
                          }, 150);
                        }}
                        className={`flex-1 p-1 sm:p-2 focus:outline-none border-none bg-transparent text-xs sm:text-sm md:text-base ${
                          dropoffError ? "text-red-600" : ""
                        }`}
                        autoComplete="off"
                      />
                      {dropoffValidated && (
                        <Icon
                          icon="mdi:check-circle"
                          className="w-4 h-4 text-green-500 mr-2"
                        />
                      )}
                    </div>
                    <button
                      onClick={() => openMap("dropoff")}
                      className="text-primary text-xs mt-1 ml-2 self-start hover:text-primary-dark cursor-pointer"
                    >
                      Open Map
                    </button>

                    {dropoffError && (
                      <p className="text-red-500 text-xs ml-2">
                        {dropoffError}
                      </p>
                    )}

                    {renderLocationDropdown(
                      "dropoff",
                      dropoffSuggestions,
                      isDropoffDropdownOpen,
                      dropoffSearchValue,
                      handleDropoffSelect,
                      dropoffHighlightedIndex
                    )}
                  </div>
                </>
              )}

              {activeTab === "single" && (
                <div className="sm:min-h-[80px] flex flex-col">
                  <div className="flex items-center border border-primary-gray/50 rounded-xl p-1 sm:p-2 h-12 sm:h-14">
                    <Icon
                      icon={ICON_DATA.CALENDAR_PICKUP}
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-gray flex-shrink-0"
                    />
                    <Inputs
                      name="pickupDate"
                      type="datetime-local"
                      min={getCurrentDateTime()}
                      value={tripData.pickupDateTime}
                      onChange={(e) =>
                        updateTripData({ pickupDateTime: e.target.value })
                      }
                      className={`flex-1 w-full p-2 border-none rounded-md focus:outline-none ${
                        tripData.pickupDateTime
                          ? "text-black"
                          : "text-primary-gray"
                      } text-xs sm:text-sm md:text-base`}
                    />
                  </div>
                </div>
              )}

              {activeTab === "round" && (
                <>
                  <div className="sm:min-h-[80px] flex flex-col">
                    <div className="flex items-center border border-primary-gray/50 rounded-xl p-1 sm:p-2 h-12 sm:h-14">
                      <Icon
                        icon={ICON_DATA.CALENDAR_PICKUP}
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-gray flex-shrink-0"
                      />
                      <Inputs
                        name="pickupDate"
                        type="datetime-local"
                        min={getCurrentDateTime()}
                        value={tripData.pickupDateTime}
                        onChange={(e) =>
                          updateTripData({ pickupDateTime: e.target.value })
                        }
                        className={`flex-1 w-full p-2 border-none rounded-md focus:outline-none ${
                          tripData.pickupDateTime
                            ? "text-black"
                            : "text-primary-gray"
                        } text-xs sm:text-sm md:text-base`}
                      />
                    </div>
                  </div>

                  <div className="sm:min-h-[80px] flex flex-col">
                    <div className="flex items-center border border-primary-gray/50 rounded-xl p-1 sm:p-2 h-12 sm:h-14">
                      <Icon
                        icon={ICON_DATA.CALENDAR_RETURN}
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-gray flex-shrink-0"
                      />
                      <Inputs
                        name="returnDate"
                        type="datetime-local"
                        value={tripData.returnDateTime}
                        min={tripData.pickupDateTime || ""}
                        onChange={(e) => {
                          if (
                            tripData.pickupDateTime &&
                            e.target.value < tripData.pickupDateTime
                          ) {
                            toast.error(
                              "Return date/time cannot be before pickup!"
                            );
                            return;
                          }
                          updateTripData({ returnDateTime: e.target.value });
                        }}
                        className={`flex-1 w-full p-2 border-none rounded-md focus:outline-none ${
                          tripData.returnDateTime
                            ? "text-black"
                            : "text-primary-gray"
                        } text-xs sm:text-sm md:text-base`}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Add Stop Button */}
            <div className="flex items-center justify-between">
              <Button
                label="Add Stop"
                onClick={() => {
                  setActiveTab("multi");
                  updateTripData({
                    tripType: "multi",
                    multiStops: [{ location: "", date: "" }],
                  });
                  setIsTabDropdownOpen(false);
                  router.push(`${ROUTES.PLAN_JOURNEY}?focusStop=true`);
                }}
                variant="primary"
                className="text-xs block sm:text-sm min-w-fit sm:min-w-fit"
                size="sm"
              />
              <Button
                label="Get Quote"
                onClick={handleSubmit}
                variant="primary"
                className="text-xs block lg:hidden sm:text-sm min-w-fit sm:min-w-fit"
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Map Modal with Real-time Address Display */}
      {isMapOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[90vw] sm:max-w-3xl min-h-[60vh] max-h-[90vh] flex flex-col">
            <div className="flex flex-row justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-semibold">
                  Select {mapType === "pickup" ? "Pickup" : "Dropoff"} Location
                </h3>
                {/* Real-time Address Display */}
                <div className="mt-2 flex items-center gap-2">
                  {isLoadingAddress ? (
                    <>
                      <Icon
                        icon="mdi:loading"
                        className="w-4 h-4 text-primary animate-spin"
                      />
                      <p className="text-sm text-gray-500">
                        Loading address...
                      </p>
                    </>
                  ) : (
                    <>
                      <Icon
                        icon={ICON_DATA.LOCATION}
                        className="w-4 h-4 text-primary flex-shrink-0"
                      />
                      <p className="text-sm text-gray-700 font-medium truncate">
                        {currentMapAddress ||
                          "Move the map to select a location"}
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

            {/* Coordinates Display */}
            {/* {selectedCoordinates && (
              <div className="mt-2 text-xs text-gray-500 text-center">
                Lat: {selectedCoordinates.lat.toFixed(6)}, Lng: {selectedCoordinates.lng.toFixed(6)}
              </div>
            )} */}

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
}
