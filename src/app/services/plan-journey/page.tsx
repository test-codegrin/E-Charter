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
import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";
import toast from "react-hot-toast";

interface Stop {
  location: string;
  date: string;
  id?: string;
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

// Helper function to calculate minimum return datetime
const calculateMinReturnDateTime = (
  pickupDateTime: string,
  travelTimeInSeconds: number
): string => {
  if (!pickupDateTime || !travelTimeInSeconds) return "";

  const pickupDate = new Date(pickupDateTime);
  // Add travel time in seconds
  pickupDate.setSeconds(pickupDate.getSeconds() + travelTimeInSeconds);

  // Convert to datetime-local format (YYYY-MM-DDTHH:mm)
  const year = pickupDate.getFullYear();
  const month = String(pickupDate.getMonth() + 1).padStart(2, "0");
  const day = String(pickupDate.getDate()).padStart(2, "0");
  const hours = String(pickupDate.getHours()).padStart(2, "0");
  const minutes = String(pickupDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const PlanJourney = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    tripData,
    updateTripData,
    updatePickupCoordinates,
    updateDropoffCoordinates,
    updateReturnCoordinates,
  } = useTrip();
  const stopInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // TomTom API Key from environment
  const TOMTOM_API_KEY = process.env.NEXT_PUBLIC_TOMTOM_API_KEY;

  // Search functionality state
  const [pickupSuggestions, setPickupSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [dropoffSuggestions, setDropoffSuggestions] = useState<
    LocationSuggestion[]
  >([]);
  const [returnSuggestions, setReturnSuggestions] = useState<
    LocationSuggestion[]
  >([]);

  const [isPickupDropdownOpen, setIsPickupDropdownOpen] = useState(false);
  const [isDropoffDropdownOpen, setIsDropoffDropdownOpen] = useState(false);
  const [isReturnDropdownOpen, setIsReturnDropdownOpen] = useState(false);

  const [pickupSearchValue, setPickupSearchValue] = useState("");
  const [dropoffSearchValue, setDropoffSearchValue] = useState("");
  const [returnSearchValue, setReturnSearchValue] = useState("");

  // Keyboard navigation states
  const [pickupHighlightedIndex, setPickupHighlightedIndex] = useState(-1);
  const [dropoffHighlightedIndex, setDropoffHighlightedIndex] = useState(-1);
  const [returnHighlightedIndex, setReturnHighlightedIndex] = useState(-1);

  // Validation states
  const [pickupValidated, setPickupValidated] = useState(false);
  const [dropoffValidated, setDropoffValidated] = useState(false);

  const [pickupError, setPickupError] = useState("");
  const [dropoffError, setDropoffError] = useState("");
  const [pickupTimeError, setPickupTimeError] = useState("");
  const [dropoffTimeError, setDropoffTimeError] = useState("");

  // Current location states
  const [isGettingCurrentLocation, setIsGettingCurrentLocation] =
    useState(false);
  const [currentLocationFor, setCurrentLocationFor] = useState<
    "pickup" | "dropoff" | "round" | null
  >(null);

  // Add flag to track if user is selecting from dropdown
  const [isSelectingFromDropdown, setIsSelectingFromDropdown] = useState(false);

  // Map modal states
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapType, setMapType] = useState<"pickup" | "dropoff" | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<tt.Map | null>(null);

  // NEW: Map address display states
  const [currentMapAddress, setCurrentMapAddress] = useState<string>("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  // Refs for dropdowns
  const pickupDropdownRef = useRef<HTMLDivElement>(null);
  const dropoffDropdownRef = useRef<HTMLDivElement>(null);
  const returnDropdownRef = useRef<HTMLDivElement>(null);

  const pickupSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropoffSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const returnSearchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const addressFetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we should focus on stop input from URL params
  const shouldFocusStop = searchParams.get("focusStop") === "true";

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
        mapRef.current.setCenter([
          initialCoordinates.lng,
          initialCoordinates.lat,
        ]);
        setSelectedCoordinates(initialCoordinates);
      } else {
        // Fallback to default location (Toronto, Canada)
        mapRef.current.setCenter([-79.3832, 43.6532]);
        setSelectedCoordinates({ lat: 43.6532, lng: -79.3832 });
      }

      // Resize map after centering
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

  // Handle Close button click
  const handleCloseClick = () => {
    setIsMapOpen(false);
    setSelectedCoordinates(null);
    setCurrentMapAddress("");
  };

  // Get current location using Geolocation API
  const getCurrentLocation = async (type: "pickup" | "dropoff" | "round") => {
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
                } else if (type === "round") {
                  setReturnSearchValue(address);
                  updateTripData({ returnLocation: address });
                  updateReturnCoordinates(coordinates);
                  setIsReturnDropdownOpen(false);
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

  // Search TomTom API for locations
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

  // Handle pickup search with validation
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

  // Handle dropoff search with validation
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

  // Handle return search with validation
  const handleReturnSearch = (value: string) => {
    setReturnSearchValue(value);
    setReturnHighlightedIndex(-1);

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
    setPickupHighlightedIndex(-1);

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
    setDropoffHighlightedIndex(-1);

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
    setIsReturnDropdownOpen(false);
    setReturnSuggestions([]);
    setReturnHighlightedIndex(-1);

    setTimeout(() => {
      setIsSelectingFromDropdown(false);
    }, 100);
  };

  // Handle keyboard navigation for pickup
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

  // Handle keyboard navigation for dropoff
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

  // Handle keyboard navigation for return
  const handleReturnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isReturnDropdownOpen) return;

    const totalOptions = returnSuggestions.length + 1;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setReturnHighlightedIndex((prev) =>
          prev < totalOptions - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setReturnHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : totalOptions - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (returnHighlightedIndex === 0) {
          getCurrentLocation("round");
        } else if (returnHighlightedIndex > 0) {
          const suggestion = returnSuggestions[returnHighlightedIndex - 1];
          if (suggestion) {
            handleReturnSelect(suggestion);
          }
        }
        break;
      case "Escape":
        setIsReturnDropdownOpen(false);
        setReturnHighlightedIndex(-1);
        break;
    }
  };

  // Validation on blur
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

    if (
      isPickupDropdownOpen ||
      isDropoffDropdownOpen ||
      isReturnDropdownOpen ||
      isMapOpen
    ) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [
    isPickupDropdownOpen,
    isDropoffDropdownOpen,
    isReturnDropdownOpen,
    isMapOpen,
    isSelectingFromDropdown,
    pickupSearchValue,
    dropoffSearchValue,
    pickupValidated,
    dropoffValidated,
  ]);

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
      if (addressFetchTimeoutRef.current) {
        clearTimeout(addressFetchTimeoutRef.current);
      }
    };
  }, []);

  // Render location dropdown
  const renderLocationDropdown = (
    type: "pickup" | "dropoff" | "round",
    suggestions: LocationSuggestion[],
    isOpen: boolean,
    searchValue: string,
    onSelect: (suggestion: LocationSuggestion) => void,
    highlightedIndex: number
  ) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary-gray/30 rounded-xl drop-shadow-2xl z-50 max-h-60 overflow-y-auto">
        <button
          onMouseDown={() => setIsSelectingFromDropdown(true)}
          onClick={() => getCurrentLocation(type)}
          onMouseEnter={() => {
            if (type === "pickup") setPickupHighlightedIndex(0);
            if (type === "dropoff") setDropoffHighlightedIndex(0);
            if (type === "round") setReturnHighlightedIndex(0);
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
                  if (type === "round") setReturnHighlightedIndex(index + 1);
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
      const newIndex =
        typeof index === "number" ? index + 1 : updated.length - 1;
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
  const handleTripTypeChange = (value: "single" | "round" | "multi") => {
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
      window.history.replaceState(null, "", newUrl);

      return () => clearTimeout(timer);
    }
  }, [shouldFocusStop, tripData.tripType, tripData.multiStops]);

  // **UPDATED: Handle pickup time change with validation and round trip/multi-stop updates**
  const handlePickupTimeChange = (value: string) => {
    setPickupTimeError("");

    // Validate that pickup time is not in the past
    const currentDateTime = getCurrentDateTime();
    if (value && value < currentDateTime) {
      setPickupTimeError("Pickup date and time cannot be in the past.");
      return;
    }

    if (value && tripData.pickupLocation && pickupValidated) {
      // Store the old pickup time to calculate the difference
      const oldPickupTime = tripData.pickupDateTime;

      updateTripData({ pickupDateTime: value });

      // **ROUND TRIP: Update dropoff time if it exists**
      if (
        tripData.tripType === "round" &&
        tripData.returnDateTime &&
        oldPickupTime
      ) {
        const oldPickupDate = new Date(oldPickupTime);
        const newPickupDate = new Date(value);
        const oldDropoffDate = new Date(tripData.returnDateTime);

        // Calculate the time difference between old pickup and dropoff
        const timeDifference =
          oldDropoffDate.getTime() - oldPickupDate.getTime();

        // Apply the same time difference to the new pickup time
        const newDropoffDate = new Date(
          newPickupDate.getTime() + timeDifference
        );

        // Format the new dropoff time
        const year = newDropoffDate.getFullYear();
        const month = String(newDropoffDate.getMonth() + 1).padStart(2, "0");
        const day = String(newDropoffDate.getDate()).padStart(2, "0");
        const hours = String(newDropoffDate.getHours()).padStart(2, "0");
        const minutes = String(newDropoffDate.getMinutes()).padStart(2, "0");
        const newDropoffTime = `${year}-${month}-${day}T${hours}:${minutes}`;

        updateTripData({ returnDateTime: newDropoffTime });
      }

      // **MULTI-STOP: Clear any stop dates that are before the new pickup time**
      if (tripData.tripType === "multi" && tripData.multiStops.length > 0) {
        const updatedStops = tripData.multiStops.map((stop) => {
          if (stop.date && stop.date < value) {
            // Clear the stop date if it's before the new pickup time
            return { ...stop, date: "" };
          }
          return stop;
        });

        // Only update if any stops were cleared
        const stopsChanged = updatedStops.some(
          (stop, index) => stop.date !== tripData.multiStops[index].date
        );

        if (stopsChanged) {
          updateTripData({ multiStops: updatedStops });
          toast.success("Stop dates before pickup time have been cleared.");
        }
      }
    } else if (value) {
      setPickupTimeError("Please select a valid pickup location first.");
    }
  };

  // Handle dropoff time change with validation for round trip
  const handleDropoffTimeChange = (value: string) => {
    setDropoffTimeError("");

    if (
      tripData.tripType === "round" &&
      value &&
      tripData.dropoffLocation &&
      dropoffValidated
    ) {
      // Validate that return time is after pickup + travel time
      if (
        tripData.pickupDateTime &&
        tripData.routeSummary?.roundTripDropTravelTimeInSeconds
      ) {
        const minReturnDateTime = calculateMinReturnDateTime(
          tripData.pickupDateTime,
          tripData.routeSummary.roundTripDropTravelTimeInSeconds
        );

        if (value < minReturnDateTime) {
          setDropoffTimeError(
            `Return time must be after estimated arrival time (${new Date(
              minReturnDateTime
            ).toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })})`
          );
          return;
        }
      }

      updateTripData({ returnDateTime: value });
    } else if (value && tripData.tripType === "round") {
      setDropoffTimeError("Please select a valid dropoff location first.");
    }
  };

  // Next button handler with enhanced validation
  const handleNext = () => {
    let hasError = false;

    // Validate pickup location and time
    if (!tripData.pickupLocation || !pickupValidated) {
      setPickupError("Please select a pickup location from the suggestions.");
      hasError = true;
    }

    if (!tripData.pickupDateTime) {
      setPickupTimeError("Please select a pickup date and time.");
      hasError = true;
    } else {
      // Validate that pickup time is not in the past
      const currentDateTime = getCurrentDateTime();
      if (tripData.pickupDateTime < currentDateTime) {
        setPickupTimeError("Pickup date and time cannot be in the past.");
        hasError = true;
      }
    }

    // Validate dropoff location and time for all trip types, but time only for round trip
    if (!tripData.dropoffLocation || !dropoffValidated) {
      setDropoffError("Please select a dropoff location from the suggestions.");
      hasError = true;
    }

    if (tripData.tripType === "round") {
      if (!tripData.returnDateTime) {
        setDropoffTimeError(
          "Please select a dropoff date and time for round trip."
        );
        hasError = true;
      } else if (
        tripData.pickupDateTime &&
        tripData.routeSummary?.roundTripDropTravelTimeInSeconds
      ) {
        const minReturnDateTime = calculateMinReturnDateTime(
          tripData.pickupDateTime,
          tripData.routeSummary.roundTripDropTravelTimeInSeconds
        );

        if (tripData.returnDateTime < minReturnDateTime) {
          setDropoffTimeError(
            "Return time must be after the estimated arrival time at the dropoff location."
          );
          hasError = true;
        }
      }
    }

    if (hasError) return;

    // Clear errors if validation passes
    setPickupError("");
    setPickupTimeError("");
    setDropoffError("");
    setDropoffTimeError("");

    router.push(ROUTES.RESERVE_CAR);
  };

  // Helper function to set stop input ref
  const setStopInputRef = (index: number) => (el: HTMLInputElement | null) => {
    stopInputRefs.current[index] = el;
  };

  type TripType = "single" | "round" | "multi";
  const TRIPS = [
    {
      id: "single" as TripType,
      label: "Single Trip",
      icon: IMAGES_ASSETS.SINGLE_TRIP,
      onClick: () => {
        handleTripTypeChange("single");
        setIsTabDropdownOpen(false);
      },
    },
    {
      id: "round" as TripType,
      label: "Round Trip",
      icon: IMAGES_ASSETS.ROUND_TRIP,
      onClick: () => {
        handleTripTypeChange("round");
        setIsTabDropdownOpen(false);
      },
    },
    {
      id: "multi" as TripType,
      label: "Multi Stop",
      icon: IMAGES_ASSETS.MULTI_STOP_TRIP,
      onClick: () => {
        handleTripTypeChange("multi");
        updateTripData({
          tripType: "multi",
          multiStops: [],
        });
        setIsTabDropdownOpen(false);
        router.push(ROUTES.PLAN_JOURNEY);
      },
    },
  ];

  const [isTabDropdownOpen, setIsTabDropdownOpen] = useState(false);
  const tabDropdownRef = useRef<HTMLDivElement>(null);

  const getActiveTab = () => {
    return TRIPS.find((tab) => tab.id === tripData.tripType);
  };

  return (
    <section className="w-full max-w-[1320px] mx-auto mt-[75px] px-4 sm:px-6 md:px-4 2xl:px-[0px] bg-white">
      <div className="flex flex-col xl:flex-row lg:flex-col max-w-screen-3xl mx-auto sm:px-0 md:px-0 py-6 md:py-10 lg:py-10 lg:gap-8 xl:gap-10 2xl:gap-10">
        {/* Left Panel */}
        <div className="w-full 2xl:w-[580px] xl:w-[600px] md:w-full">
          {/* Back Button */}
          <button
            onClick={() => router.push(ROUTES.HOME)}
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
                {/* TRIPS Dropdown */}
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
                            tripData.tripType === tab.id
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
                          {tripData.tripType === tab.id ? (
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
                <i className="fa-solid fa-chevron-down transition-transform duration-200 group-open:rotate-180" />
              </div>
            </summary>

            {/* Pickup Section */}
            <div className="border border-gray-200 rounded-2xl p-4 sm:p-6 mt-4 bg-[#FCFCFC] space-y-4 sm:space-y-6">
              <div className="sm:flex flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center">
                    <Icon
                      icon={ICON_DATA.HOME}
                      className="text-white w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg text-[#3DC1C4] font-semibold">
                    Pickup
                  </h3>
                </div>
                <div className="sm:flex flex flex-wrap items-center gap-3">
                  <PersonCounter
                    value={tripData.persons}
                    onChange={(value) => updateTripData({ persons: value })}
                  />
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
              <section className="flex flex-col max-sm:gap-y-4 sm:flex-row sm:gap-4 mt-6">
                {/* Pickup Location with Search Dropdown */}
                <div className="flex flex-col gap-2 w-full sm:w-1/2">
                  <div
                    className="w-full relative h-[40px] sm:h-[44px] flex flex-col"
                    ref={pickupDropdownRef}
                  >
                    <label
                      className={`flex items-center gap-3 w-full h-full border rounded-xl px-2 py-1 ${
                        pickupError
                          ? "border-red-500"
                          : "border-primary-border/20"
                      }`}
                    >
                      <Icon
                        icon={ICON_DATA.LOCATION}
                        className={`text-primary-gray w-5 h-5 flex-shrink-0 ${
                          pickupError ? "text-red-500" : ""
                        }`}
                      />
                      <input
                        type="text"
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
                        placeholder="Pickup Location"
                        className={`flex-1 bg-transparent text-sm placeholder-[#9C9C9C] focus:outline-none ${
                          pickupError ? "text-red-600" : ""
                        }`}
                        autoComplete="off"
                      />
                      {pickupValidated && (
                        <Icon
                          icon="mdi:check-circle"
                          className="w-4 h-4 text-green-500"
                        />
                      )}
                    </label>

                    {renderLocationDropdown(
                      "pickup",
                      pickupSuggestions,
                      isPickupDropdownOpen,
                      pickupSearchValue,
                      handlePickupSelect,
                      pickupHighlightedIndex
                    )}
                  </div>
                  {pickupError && (
                    <p className="text-red-500 text-xs ml-2">{pickupError}</p>
                  )}
                  <button
                    onClick={() => openMap("pickup")}
                    className="text-primary text-xs mt-1 ml-2 self-start  hover:text-primary-dark cursor-pointer"
                  >
                    Open Map
                  </button>
                </div>

                {/* Date & Time WITH VALIDATION */}
                <div className="w-full sm:w-1/2 relative h-[40px] sm:h-[44px] flex flex-col">
                  <label className="flex items-center gap-3 w-full h-full border rounded-xl px-2 py-1 border-primary-border/20">
                    <Icon
                      icon={ICON_DATA.CALENDAR_PICKUP}
                      className="w-6 h-6 text-primary-gray flex-shrink-0"
                    />
                    <Inputs
                      name="Stop Date & Time"
                      type="datetime-local"
                      placeholder="Select Date & Time"
                      min={getCurrentDateTime()}
                      value={tripData.pickupDateTime}
                      onChange={(e) => handlePickupTimeChange(e.target.value)}
                      className="flex-1 bg-transparent text-sm text-[#9C9C9C] focus:outline-none cursor-text"
                    />
                  </label>
                  {pickupTimeError && (
                    <p className="text-red-500 text-xs ml-2">
                      {pickupTimeError}
                    </p>
                  )}
                  <div className="h-5 mt-1"></div>
                </div>
              </section>
            </div>

            {/* Multi Stops */}
            {tripData.tripType === "multi" &&
              tripData.multiStops.length > 0 &&
              tripData.multiStops.map((s, index) => (
                <StopCard
                  key={`stop-${index}-${s.location}-${s.date}`}
                  id={index}
                  location={s.location}
                  date={s.date}
                  pickupCoordinates={tripData.pickupCoordinates}
                  pickupDateTime={tripData.pickupDateTime}
                  previousStopDate={
                    index > 0 ? tripData.multiStops[index - 1].date : undefined
                  }
                  previousStopLocation={
                    index > 0
                      ? tripData.multiStops[index - 1].location
                      : undefined
                  }
                  stopIndex={index}
                  totalStops={tripData.multiStops.length}
                  onChange={(id, data) => handleUpdateStop(id as number, data)}
                  onRemove={(id) => handleRemoveStop(id as number)}
                  onAdd={(id) => handleAddStop(id as number)}
                  ref={setStopInputRef(index)}
                />
              ))}

            {/* Dropoff Section */}
            {(tripData.tripType === "single" ||
              tripData.tripType === "round" ||
              tripData.tripType === "multi") && (
              <div className="border bg-[#FCFCFC] border-gray-200 rounded-2xl p-4 sm:p-6 mt-6 space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center">
                    <Icon
                      icon={ICON_DATA.DROP_LOCATION}
                      className="text-white w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#3DC1C4]">
                    Dropoff
                  </h3>
                </div>

                <section className="flex flex-col max-sm:gap-y-4 sm:flex-row sm:gap-4 mt-6">
                  {/* Dropoff Location with Search Dropdown */}
                  <div className="flex flex-col gap-2 w-full sm:w-1/2">
                    <div
                      className="w-full relative h-[40px] sm:h-[44px] flex flex-col"
                      ref={dropoffDropdownRef}
                    >
                      <label
                        className={`flex items-center gap-3 w-full h-full border rounded-xl px-2 py-1 ${
                          dropoffError
                            ? "border-red-500"
                            : "border-primary-border/20"
                        }`}
                      >
                        <Icon
                          icon={ICON_DATA.LOCATION}
                          className={`text-primary-gray w-5 h-5 flex-shrink-0 ${
                            dropoffError ? "text-red-500" : ""
                          }`}
                        />
                        <input
                          type="text"
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
                          placeholder="Dropoff Location"
                          className={`flex-1 bg-transparent text-sm placeholder-[#9C9C9C] focus:outline-none ${
                            dropoffError ? "text-red-600" : ""
                          }`}
                          autoComplete="off"
                        />
                        {dropoffValidated && (
                          <Icon
                            icon="mdi:check-circle"
                            className="w-4 h-4 text-green-500"
                          />
                        )}
                      </label>

                      {renderLocationDropdown(
                        "dropoff",
                        dropoffSuggestions,
                        isDropoffDropdownOpen,
                        dropoffSearchValue,
                        handleDropoffSelect,
                        dropoffHighlightedIndex
                      )}
                    </div>
                    {dropoffError && (
                      <p className="text-red-500 text-xs ml-2">
                        {dropoffError}
                      </p>
                    )}
                    <button
                      onClick={() => openMap("dropoff")}
                      className="text-primary text-xs mt-1 ml-2 self-start hover:text-primary-dark cursor-pointer"
                    >
                      Open Map
                    </button>
                  </div>

                  {/* Date & Time WITH VALIDATION */}
                  {tripData.tripType === "round" && (
                    <div className="w-full sm:w-1/2 relative h-[40px] sm:h-[44px] flex flex-col">
                      <label className="flex items-center gap-3 w-full h-full border rounded-xl px-2 py-1 border-[#DBDBDB]">
                        <Icon
                          icon={ICON_DATA.CALENDAR_PICKUP}
                          className="w-6 h-6 text-primary-gray flex-shrink-0"
                        />
                        <Inputs
                          name="Return Date & Time"
                          type="datetime-local"
                          min={
                            tripData.pickupDateTime &&
                            tripData.routeSummary
                              ?.roundTripDropTravelTimeInSeconds
                              ? calculateMinReturnDateTime(
                                  tripData.pickupDateTime,
                                  tripData.routeSummary
                                    .roundTripDropTravelTimeInSeconds
                                )
                              : tripData.pickupDateTime || undefined
                          }
                          value={tripData.returnDateTime}
                          onChange={(e) =>
                            handleDropoffTimeChange(e.target.value)
                          }
                          className="flex-1 bg-transparent text-sm text-[#9C9C9C] focus:outline-none cursor-text"
                        />
                      </label>
                      {dropoffTimeError && (
                        <p className="text-red-500 text-xs ml-2">
                          {dropoffTimeError}
                        </p>
                      )}
                      <div className="h-5 mt-1"></div>
                    </div>
                  )}
                </section>

                {/* Route Summary Display */}
                {tripData.routeSummary && tripData.pickupDateTime && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-around gap-4 flex-wrap">
                      {/* Distance */}
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={ICON_DATA.DISTANCE}
                          className="w-5 h-5 text-primary"
                        />
                        <div>
                          <p className="text-xs text-gray-500">Distance</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {(tripData.tripType === "round"
                              ? tripData.routeSummary
                                  .roundTripDropLengthInMeters / 1000
                              : tripData.routeSummary.lengthInMeters / 1000
                            ).toFixed(1)}{" "}
                            km
                          </p>
                        </div>
                      </div>

                      {/* Travel Time */}
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={ICON_DATA.CLOCK}
                          className="w-5 h-5 text-primary"
                        />
                        <div>
                          <p className="text-xs text-gray-500">Travel Time</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {(() => {
                              const hours = Math.floor(
                                tripData.tripType === "round"
                                  ? tripData.routeSummary
                                      .roundTripDropTravelTimeInSeconds / 3600
                                  : tripData.routeSummary.travelTimeInSeconds /
                                      3600
                              );
                              const minutes = Math.floor(
                                (tripData.tripType === "round"
                                  ? tripData.routeSummary
                                      .roundTripDropTravelTimeInSeconds % 3600
                                  : tripData.routeSummary.travelTimeInSeconds %
                                    3600) / 60
                              );
                              return hours > 0
                                ? `${hours}h ${minutes}m`
                                : `${minutes} min`;
                            })()}
                          </p>
                        </div>
                      </div>

                      {/* Estimated Arrival */}
                      {tripData.tripType !== "multi" && (
                        <div className="flex items-center gap-2">
                          <Icon
                            icon={ICON_DATA.ARRIVAL}
                            className="w-5 h-5 text-primary"
                          />
                          <div>
                            <p className="text-xs text-gray-500">
                              Est. Arrival
                            </p>
                            <p className="text-sm font-semibold text-gray-800">
                              {(() => {
                                const pickupDate = new Date(
                                  tripData.pickupDateTime
                                );
                                const arrivalDate = new Date(
                                  pickupDate.getTime() +
                                    (tripData.tripType === "round"
                                      ? tripData.routeSummary
                                          .roundTripDropTravelTimeInSeconds *
                                        1000
                                      : tripData.routeSummary
                                          .travelTimeInSeconds * 1000)
                                );
                                return arrivalDate.toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                });
                              })()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Return Section (only in round trip) */}
            {tripData.tripType === "round" && (
              <div className="border bg-[#FCFCFC] border-gray-200 rounded-2xl p-4 sm:p-6 mt-6 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#3DC1C4] flex justify-center items-center">
                    <Icon
                      icon={ICON_DATA.HOME}
                      className="text-white w-4 h-4 sm:w-5 sm:h-5"
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[#3DC1C4]">
                    Return
                  </h3>
                </div>
                <section className="flex flex-col max-sm:gap-y-4 sm:flex-row sm:gap-4 mt-6">
                  {/* Return To Pickup Location */}
                  <div className="flex flex-col gap-2 w-full sm:w-1/2">
                    <div className="w-full relative h-[40px] sm:h-[44px] flex flex-col">
                      <label
                        className={`flex items-center gap-3 w-full h-full border rounded-xl px-2 py-1 ${
                          pickupError
                            ? "border-red-500"
                            : "border-primary-border/20"
                        }`}
                      >
                        <Icon
                          icon={ICON_DATA.LOCATION}
                          className="text-primary-gray w-5 h-5 flex-shrink-0"
                        />
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
                          placeholder="Return to Pickup Location"
                          className={`flex-1 bg-transparent text-sm placeholder-[#9C9C9C] focus:outline-none ${
                            pickupError ? "text-red-600" : ""
                          }`}
                          autoComplete="off"
                          disabled
                        />
                      </label>
                    </div>
                  </div>
                </section>

                {/* Route Summary Display */}
                {tripData.routeSummary && tripData.pickupDateTime && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      {/* Distance */}
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={ICON_DATA.DISTANCE}
                          className="w-5 h-5 text-primary"
                        />
                        <div>
                          <p className="text-xs text-gray-500">Distance</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {(
                              tripData.routeSummary.lengthInMeters / 1000
                            ).toFixed(1)}{" "}
                            km
                          </p>
                        </div>
                      </div>

                      {/* Travel Time */}
                      <div className="flex items-center gap-2">
                        <Icon
                          icon={ICON_DATA.CLOCK}
                          className="w-5 h-5 text-primary"
                        />
                        <div>
                          <p className="text-xs text-gray-500">Travel Time</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {(() => {
                              const hours = Math.floor(
                                tripData.routeSummary.travelTimeInSeconds / 3600
                              );
                              const minutes = Math.floor(
                                (tripData.routeSummary.travelTimeInSeconds %
                                  3600) /
                                  60
                              );
                              return hours > 0
                                ? `${hours}h ${minutes}m`
                                : `${minutes} min`;
                            })()}
                          </p>
                        </div>
                      </div>

                      {/* Estimated Arrival */}

                      <div className="flex items-center gap-2">
                        <Icon
                          icon={ICON_DATA.ARRIVAL}
                          className="w-5 h-5 text-primary"
                        />
                        <div>
                          <p className="text-xs text-gray-500">Est. Arrival</p>
                          <p className="text-sm font-semibold text-gray-800">
                            {(() => {
                              const pickupDate = new Date(
                                tripData.returnDateTime
                              );
                              const arrivalDate = new Date(
                                pickupDate.getTime() +
                                  tripData.routeSummary.travelTimeInSeconds *
                                    1000
                              );
                              return arrivalDate.toLocaleString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              });
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </details>

          <div className="border-t border-gray-200 my-6 md:my-8" />

          {/* Trip Details Accordion */}
          <details className="group w-full overflow-hidden" open>
            <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer select-none list-none">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Trip Details
              </h2>
              <i className="fa-solid fa-chevron-down w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-open:rotate-180" />
            </summary>
            <div className="border border-primary-border/20 bg-[#FCFCFC] mt-4 rounded-2xl p-4 sm:p-6 space-y-5">
              {/* Trip Name */}
              <div>
                <label className="block font-semibold text-base sm:text-lg text-gray-800 mb-2">
                  Trip Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={tripData.tripName || ""}
                    onChange={(e) =>
                      updateTripData({ tripName: e.target.value })
                    }
                    placeholder="Enter trip name (e.g., Round trip)"
                    className="text-sm text-gray-700 px-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none w-full bg-white transition-all"
                    name="Trip Name"
                  />
                </div>
              </div>

              {/* Luggage and Event Types Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {/* Luggage */}
                <div>
                  <label className="block font-semibold text-base sm:text-lg text-gray-800 mb-2">
                    Luggage
                  </label>
                  <div className="relative">
                    <Icon
                      icon={ICON_DATA.BAG_SUITCASE}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    />
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={tripData.luggageCount.toString() || ""}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        // Only update if value is between 0 and 10, or if field is empty
                        if (
                          e.target.value === "" ||
                          (value >= 0 && value <= 10)
                        ) {
                          updateTripData({
                            luggageCount: isNaN(value) ? 0 : value,
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        // Prevent typing 'e', '+', '-', '.'
                        if (["e", "E", "+", "-", "."].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        // Prevent pasting non-numeric values
                        const pastedText = e.clipboardData.getData("text");
                        const value = parseInt(pastedText);
                        if (isNaN(value) || value < 0 || value > 10) {
                          e.preventDefault();
                        }
                      }}
                      placeholder="0"
                      className="text-sm text-gray-700 pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none w-full bg-white transition-all"
                      name="Luggage"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-1">
                    Maximum 10 luggage
                  </p>
                </div>

                {/* Event Types */}
                <div>
                  <label className="block font-semibold text-base sm:text-lg text-gray-800 mb-2">
                    Event Type
                  </label>
                  <div className="relative">
                    <Icon
                      icon="mdi:calendar-star"
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    />
                    <select
                      value={tripData.eventType || ""}
                      onChange={(e) =>
                        updateTripData({ eventType: e.target.value })
                      }
                      className="text-sm text-gray-700 pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none w-full bg-white cursor-pointer appearance-none transition-all"
                    >
                      <option value="" disabled>
                        Select event type
                      </option>
                      <option value="personal">Personal</option>
                      <option value="business">Business</option>
                      <option value="airport">Airport Transfer</option>
                      <option value="wedding">Wedding</option>
                      <option value="corporate">Corporate</option>
                    </select>
                    <Icon
                      icon="mdi:chevron-down"
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Accessible Vehicle */}
              <div className="pt-2">
                <label className="block font-semibold text-base sm:text-lg text-gray-800 mb-3">
                  Accessible Vehicle
                </label>
                <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg hover:border-primary transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Custom Checkbox */}
                    <label className="relative flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tripData.accessibleVehicle || false}
                        onChange={(e) =>
                          updateTripData({
                            accessibleVehicle: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                        {tripData.accessibleVehicle && (
                          <Icon
                            icon="mdi:check"
                            className="w-4 h-4 text-white"
                          />
                        )}
                      </div>
                    </label>

                    {/* Label Text */}
                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-medium text-gray-800">
                        ADA Standards Compliant
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Vehicle with accessibility features
                      </p>
                    </div>
                  </div>

                  {/* Wheelchair Icon */}
                  <div className="flex-shrink-0 ml-3">
                    <Icon
                      icon={ICON_DATA.WHEELCHAIR}
                      className="w-10 h-10 text-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          </details>

          <Button
            label="Next"
            onClick={handleNext}
            size="full"
            className="mt-[30px]"
          />
        </div>

        {/* Right Panel */}
        <div className="w-full lg:mx-auto lg:w-[100%] xl:w-[60%] 2xl:w-[55%] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[calc(100vh-80px)] lg:sticky lg:top-20 rounded-xl overflow-hidden">
          <MapCard />
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
                icon={ICON_DATA.CLOSE}
                onClick={handleCloseClick}
                className="w-8 h-8 cursor-pointer hover:bg-primary-gray/20 rounded-full p-2 flex-shrink-0"
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

            <div className="flex justify-end mt-4">
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
    </section>
  );
};

export default PlanJourney;
