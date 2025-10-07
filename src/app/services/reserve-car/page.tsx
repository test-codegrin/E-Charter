// pages/page4.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import PickupDropForm from "../../components/bookservice/PickupDropForm";
import OffersCard from "../../components/bookservice/OffersCard";
import CarCard from "../../components/bookservice/CarCard";
import { useTrip } from "../../context/tripContext";
import { ICON_DATA } from "@/app/constants/IconConstants";
import { ROUTES } from "@/app/constants/RoutesConstant";
import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";
import toast from "react-hot-toast";
import { API } from "@/app/constants/APIConstants";

interface Car {
  car_id: number;
  carName: string;
  carSize: string;
  carType: string;
  car_image: string;
  passenger_capacity: number;
  fuelType: string;
  cancellation_charge: string;
  driver_name: string;
  driver_address: string;
  price: number;
}

const ReserveCar = () => {
  const router = useRouter();
  // Import updateSelectedCar from context
  const { tripData, updateSelectedCar } = useTrip();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Format date and time helper
  const formatDateTime = (dateTimeString: string) => {
    if (!dateTimeString) return "Not set";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Format trip type helper
  const formatTripType = (type: string) => {
    switch (type) {
      case "single":
        return "Single Trip";
      case "round":
        return "Round Trip";
      case "multi":
        return "Multi Stop";
      default:
        return type;
    }
  };

  // Calculate distance from route summary
  const calculateDistance = () => {
    if (!tripData.routeSummary) return 0;

    const distanceInKm =
      tripData.tripType === "round"
        ? tripData.routeSummary.roundTripDropLengthInMeters / 1000
        : tripData.routeSummary.lengthInMeters / 1000;

    return Math.ceil(distanceInKm);
  };

  // Calculate number of days - counts calendar days involved in the trip
  const calculateNumberOfDays = () => {
    if (!tripData.pickupDateTime) return 1;

    const pickupDate = new Date(tripData.pickupDateTime);
    let endDate: Date;

    if (tripData.tripType === "round" && tripData.returnDateTime && tripData.routeSummary) {
      // For round trip: Calculate return arrival time
      // Use the RETURN journey travel time (from destination back to origin)
      const returnPickupDate = new Date(tripData.returnDateTime);
      
      // For round trips, use travelTimeInSeconds (return journey time)
      // NOT roundTripDropTravelTimeInSeconds (outbound journey time)
      const returnTravelTime = tripData.routeSummary.travelTimeInSeconds || 
                               tripData.routeSummary.roundTripDropTravelTimeInSeconds || 
                               0;
      
      const returnArrivalDate = new Date(
        returnPickupDate.getTime() + returnTravelTime * 1000
      );
      endDate = returnArrivalDate;
      
      // Debug logging
      console.log("=== Round Trip Day Calculation ===");
      console.log("Pickup DateTime:", pickupDate.toLocaleString());
      console.log("Return Pickup DateTime:", returnPickupDate.toLocaleString());
      console.log("Travel Time (seconds):", returnTravelTime);
      console.log("Return Arrival DateTime:", returnArrivalDate.toLocaleString());
      
    } else if (tripData.tripType === "single" && tripData.routeSummary) {
      // For single trip: Calculate from pickup to dropoff arrival
      const dropoffArrivalDate = new Date(
        pickupDate.getTime() +
          tripData.routeSummary.travelTimeInSeconds * 1000
      );
      endDate = dropoffArrivalDate;
      
    } else if (tripData.tripType === "multi" && tripData.multiStops.length > 0) {
      // For multi-stop: Use the last stop's date if available
      const lastStop = tripData.multiStops[tripData.multiStops.length - 1];
      if (lastStop.date) {
        endDate = new Date(lastStop.date);
      } else {
        return 1;
      }
    } else {
      return 1;
    }

    // Calculate calendar days involved
    const startDay = new Date(
      pickupDate.getFullYear(), 
      pickupDate.getMonth(), 
      pickupDate.getDate()
    );
    const endDay = new Date(
      endDate.getFullYear(), 
      endDate.getMonth(), 
      endDate.getDate()
    );
    
    console.log("Start Day (midnight):", startDay.toLocaleString());
    console.log("End Day (midnight):", endDay.toLocaleString());
    
    const diffTime = endDay.getTime() - startDay.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    console.log("Difference in milliseconds:", diffTime);
    console.log("Difference in days:", Math.floor(diffTime / (1000 * 60 * 60 * 24)));
    console.log("Final day count (+1 for inclusive):", diffDays);
    console.log("=================================");

    return diffDays > 0 ? diffDays : 1;
  };

  // Handler to save selected car to context
  const handleCarReservation = (car: Car) => {
    try {
      // Save car data to context
      updateSelectedCar({
        car_id: car.car_id,
        carName: car.carName,
        carSize: car.carSize,
        carType: car.carType,
        car_image: car.car_image,
        passenger_capacity: car.passenger_capacity,
        fuelType: car.fuelType,
        cancellation_charge: car.cancellation_charge,
        driver_name: car.driver_name,
        driver_address: car.driver_address,
        price: car.price,
      });

      // Show success message
      toast.success(`${car.carName} has been reserved!`);
      
      // Log for debugging
      console.log("Car saved to context:", car);
      console.log("Trip data:", tripData);
    } catch (error) {
      console.error("Error saving car data:", error);
      toast.error("Failed to reserve car. Please try again.");
    }
  };

  // Fetch cars from API
  const fetchCars = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("auth_token");
      if (!token) {
        toast.error("Please login to continue");
        router.push(ROUTES.HOME);
        return;
      }

      const requestBody = {
        distance: calculateDistance(),
        passengers: tripData.persons,
        luggages: tripData.luggageCount,
        number_of_stops:
          tripData.tripType === "multi" ? tripData.multiStops.length : 0,
        number_of_days: calculateNumberOfDays(),
      };

      console.log("API Request Body:", requestBody);

      const response = await fetch(API.CARS_FOR_RESERVE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }

      const data = await response.json();

      if (data.success && data.cars) {
        setCars(data.cars);
      } else {
        toast.error("No cars available for your trip");
        setCars([]);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast.error("Failed to load available cars. Please try again.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars();
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 md:px-4 2xl:px-2 max-w-[1320px] mx-auto mt-[70px] bg-white">
      <div className="bg-white lg:w-full text-black min-h-screen w-full p-4 sm:p-6 lg:p-8 xl:p-12.5 2xl:px-0 mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push(ROUTES.PLAN_JOURNEY)}
          className="flex items-center cursor-pointer mb-6 text-primary hover:text-primary-dark font-medium transition-colors duration-200"
        >
          <Icon icon="mdi:arrow-left" className="mr-2 w-5 h-5" />
          Back to Journey Planning
        </button>

        {/* Trip Details Summary Section */}
        <div className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Icon
                icon="mdi:map-marker-path"
                className="text-primary w-7 h-7"
              />
              Trip Summary
            </h2>
            <button
              onClick={() => router.push(ROUTES.PLAN_JOURNEY)}
              className="text-sm text-primary hover:text-primary-dark font-semibold underline transition-colors"
            >
              Edit Trip
            </button>
          </div>

          {/* Trip Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Trip Type */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon icon="mdi:routes" className="text-primary w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Trip Type</p>
                  <p className="text-sm font-bold text-gray-900">
                    {formatTripType(tripData.tripType)}
                  </p>
                </div>
              </div>
            </div>

            {/* Passengers */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon
                    icon="mdi:account-group"
                    className="text-primary w-5 h-5"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Passengers
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {tripData.persons}{" "}
                    {tripData.persons === 1 ? "Person" : "People"}
                  </p>
                </div>
              </div>
            </div>

            {/* Luggage */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon
                    icon="mdi:bag-suitcase"
                    className="text-primary w-5 h-5"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Luggage</p>
                  <p className="text-sm font-bold text-gray-900">
                    {tripData.luggageCount}{" "}
                    {tripData.luggageCount === 1 ? "Bag" : "Bags"}
                  </p>
                </div>
              </div>
            </div>

            {/* Total Days */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon
                    icon="mdi:calendar-range"
                    className="text-primary w-5 h-5"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Duration</p>
                  <p className="text-sm font-bold text-gray-900">
                    {calculateNumberOfDays()}{" "}
                    {calculateNumberOfDays() === 1 ? "Day" : "Days"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Locations and Times */}
          <div className="space-y-4">
            {/* Pickup, Stops, and Dropoff in flex row */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch">
              {/* Pickup */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-l-primary border border-gray-200 w-full flex flex-col h-full">
                <div className="flex items-start gap-3 h-full">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Icon
                      icon="mdi:map-marker"
                      className="text-white w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col h-full">
                    <p className="text-xs text-gray-500 font-semibold mb-1">
                      PICKUP
                    </p>
                    <p className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                      {tripData.pickupLocation || "Not set"}
                    </p>
                    <div className="flex flex-row gap-1 text-xs text-gray-600 mt-auto">
                      <p className="font-medium">Pickup Date-Time:</p>
                      <span className="font-normal">
                        {formatDateTime(tripData.pickupDateTime)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Multi-Stop Locations (if any) */}
              {tripData.tripType === "multi" &&
                tripData.multiStops.length > 0 && (
                  <div className="flex flex-col gap-4 w-full">
                    {tripData.multiStops.map((stop, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg p-4 border-l-4 border-l-orange-400 border border-gray-200 flex flex-col h-full"
                      >
                        <div className="flex items-start gap-3 h-full">
                          <div className="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col h-full">
                            <p className="text-xs text-gray-500 font-semibold mb-1">
                              STOP {index + 1}
                            </p>
                            <p className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                              {stop.location || "Not set"}
                            </p>
                            {stop.date && (
                              <div className="flex flex-col gap-1 text-xs text-gray-600 mt-auto">
                                <p className="font-medium">Stop Date-Time:</p>
                                <span className="font-normal">
                                  {formatDateTime(stop.date)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Dropoff */}
              <div className="bg-white rounded-lg p-4 border-l-4 border-l-primary border border-gray-200 w-full flex flex-col h-full">
                <div className="flex items-start gap-3 h-full">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Icon
                      icon="mdi:flag-checkered"
                      className="text-white w-5 h-5"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col h-full">
                    <p className="text-xs text-gray-500 font-semibold mb-1">
                      DROPOFF
                    </p>
                    <p className="text-sm font-bold text-gray-900 mb-2 line-clamp-2">
                      {tripData.dropoffLocation || "Not set"}
                    </p>
                    {tripData.tripType === "round" &&
                      tripData.returnDateTime && (
                        <div className="flex flex-row gap-1 text-xs text-gray-600 mt-auto">
                          <p className="font-medium">Return Date-Time:</p>
                          <span className="font-normal">
                            {formatDateTime(tripData.returnDateTime)}
                          </span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {(tripData.tripName ||
            tripData.eventType ||
            tripData.accessibleVehicle) && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                {tripData.tripName && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200">
                    <p className="text-xs font-medium text-gray-700">
                      Trip Name:
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      {tripData.tripName}
                    </p>
                  </div>
                )}
                {tripData.eventType && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200">
                    <Icon
                      icon={ICON_DATA.CALENDAR}
                      className="text-primary w-4 h-4"
                    />
                    <span className="text-xs font-medium text-gray-700 capitalize">
                      {tripData.eventType}
                    </span>
                  </div>
                )}
                {tripData.accessibleVehicle && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full border border-gray-200">
                    <Icon
                      icon={ICON_DATA.WHEELCHAIR}
                      className="text-primary w-4 h-4"
                    />
                    <span className="text-xs font-medium text-gray-700">
                      Accessible Vehicle
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Route Summary */}
          {tripData.routeSummary && (
            <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-around gap-4 flex-wrap">
                {/* Distance */}
                <div className="flex items-center gap-2">
                  <Icon
                    icon="mdi:map-marker-distance"
                    className="w-5 h-5 text-primary"
                  />
                  <div>
                    <p className="text-xs text-gray-500">Distance</p>
                    <p className="text-sm font-bold text-gray-800">
                      {(tripData.tripType === "round"
                        ? tripData.routeSummary.roundTripDropLengthInMeters /
                          1000
                        : tripData.routeSummary.lengthInMeters / 1000
                      ).toFixed(1)}{" "}
                      km
                    </p>
                  </div>
                </div>

                {/* Travel Time */}
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:clock-fast" className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">Travel Time</p>
                    <p className="text-sm font-bold text-gray-800">
                      {(() => {
                        const hours = Math.floor(
                          tripData.tripType === "round"
                            ? tripData.routeSummary.roundTripDropTravelTimeInSeconds / 3600
                            : tripData.routeSummary.travelTimeInSeconds / 3600
                        );
                        const minutes = Math.floor(
                          (tripData.tripType === "round"
                            ? tripData.routeSummary.roundTripDropTravelTimeInSeconds % 3600
                            : tripData.routeSummary.travelTimeInSeconds % 3600) / 60
                        );
                        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
                      })()}
                    </p>
                  </div>
                </div>

                {/* Est. Arrival - Dynamic based on trip type */}
                <div className="flex items-center gap-2">
                  <Icon icon="mdi:map-marker-check" className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-gray-500">
                      {tripData.tripType === "round" ? "Return Arrival" : "Est. Arrival"}
                    </p>
                    <p className="text-sm font-bold text-gray-800">
                      {(() => {
                        let arrivalDate: Date;
                        
                        if (tripData.tripType === "round" && tripData.returnDateTime) {
                          // For round trip: return pickup + travel time back
                          const returnPickupDate = new Date(tripData.returnDateTime);
                          
                          // Use the same travel time property as in calculateNumberOfDays
                          const returnTravelTime = tripData.routeSummary.travelTimeInSeconds || 
                                                   tripData.routeSummary.roundTripDropTravelTimeInSeconds || 
                                                   0;
                          
                          arrivalDate = new Date(
                            returnPickupDate.getTime() + returnTravelTime * 1000
                          );
                        } else if (tripData.pickupDateTime) {
                          // For single/multi trip
                          const pickupDate = new Date(tripData.pickupDateTime);
                          arrivalDate = new Date(
                            pickupDate.getTime() +
                              tripData.routeSummary.travelTimeInSeconds * 1000
                          );
                        } else {
                          return "N/A";
                        }

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

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 xl:gap-8 2xl:gap-0">
          {/* Offers Column */}
          <div className="flex flex-col gap-6 w-full lg:max-w-sm lg:top-4">
            <OffersCard
              title="Weekend Special"
              date="19‑05‑2025 to 25‑05‑2025"
              image="Weekend.png"
              description="Perfect for weekend getaways! Book any car for 2 days and get the 3rd day absolutely free."
              features={[
                "Valid for all car categories",
                "Free additional driver",
                "GPS navigation included",
                "Flexible pickup locations",
              ]}
              link="/"
            />

            <OffersCard
              title="Long‑Term Rentals"
              date="Save More, Rent Longer"
              image="Longterm.png"
              description="Planning an extended stay? Our monthly rental packages offer significant savings and added convenience."
              features={[
                "Up to 40% savings",
                "Flexible terms",
                "GPS navigation included",
                "Free maintenance",
              ]}
              link="/"
            />
          </div>

          {/* Cars Column */}
          <div className="2xl:ml-[30px] flex flex-col gap-6 xl:gap-8 w-full">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icon
                  icon="mdi:loading"
                  className="w-12 h-12 text-primary animate-spin"
                />
              </div>
            ) : cars.length > 0 ? (
              cars.map((car) => (
                <CarCard
                  key={car.car_id}
                  title={car.carName}
                  subtitle={car.carType}
                  image={car.car_image || IMAGES_ASSETS.TEMP_CAR}
                  passengers={car.passenger_capacity}
                  fuel={car.fuelType}
                  mileage="Limited Mileage"
                  location={car.driver_address}
                  price={`$${car.price.toFixed(2)}`}
                  features={[
                    "Automatic Transmission",
                    "Air Conditioning",
                    "GPS Navigation",
                    `Free Cancellation (Charge: $${car.cancellation_charge})`,
                  ]}
                  onReserve={() => handleCarReservation(car)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No cars available for your trip criteria.
                </p>
                <button
                  onClick={() => router.push(ROUTES.PLAN_JOURNEY)}
                  className="mt-4 text-primary hover:text-primary-dark font-semibold underline"
                >
                  Modify Trip Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveCar;
