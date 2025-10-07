"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Button from "../../components/ui/Button";
import Inputs from "../../components/ui/Inputs";
import { useTrip } from "../../context/tripContext";
import { AUDIO, ROUTES } from "@/app/constants/RoutesConstant";
import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";
import toast from "react-hot-toast";
import { Icon } from "@iconify/react";
import Skeleton from "@/app/components/loaders/SkeletonLoader";

interface SavedCard {
  id: string;
  name_on_card: string;
  card_number: string;
  expire_date: string;
  security_code: string;
  billing_adress: string;
}

function Payment() {
  const router = useRouter();
  const { tripData,resetTripData } = useTrip();

  const [useSavedCard, setUseSavedCard] = useState(true);
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [loadingCards, setLoadingCards] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiration: "",
    securityCode: "",
    address: "",
    adaCompliant: false,
  });

  // Check if required data is available
  useEffect(() => {
    if (!tripData.selectedCar) {
      console.log("No car selected. Please select a car first.");
      // toast.error("No car selected. Please select a car first.");
      router.push(ROUTES.PLAN_JOURNEY);
    }
  }, [tripData.selectedCar, router]);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(AUDIO.PAYMENT);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Fetch saved cards
  useEffect(() => {
    const fetchSavedCards = async () => {
      try {
        setLoadingCards(true);
        const response = await fetch(
          "https://68e4f99e8e116898997dd0fa.mockapi.io/card-info"
        );
        if (!response.ok) throw new Error("Failed to fetch cards");
        const data = await response.json();
        setSavedCards(data);
        if (data.length > 0) {
          setSelectedCardId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching saved cards:", error);
        toast.error("Failed to load saved cards");
        setUseSavedCard(false);
      } finally {
        setLoadingCards(false);
      }
    };

    fetchSavedCards();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Mask card number for display
  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\D/g, "");
    if (cleaned.length < 4) return cardNumber;
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  // Format expiry date
  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
  };

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

  // Format date only (without time) helper
  const formatDateOnly = (dateTimeString: string) => {
    if (!dateTimeString) return "Not set";
    const date = new Date(dateTimeString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  // Calculate pricing
  const calculatePricing = () => {
    const baseFare = tripData.selectedCar?.price || 0;
    const serviceFee = baseFare * 0.03; // 3% service fee
    const total = baseFare + serviceFee;

    return {
      baseFare: baseFare.toFixed(2),
      serviceFee: serviceFee.toFixed(2),
      total: total.toFixed(2),
    };
  };

  const pricing = calculatePricing();

  // Play success sound
  const playSuccessSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((error) => {
        console.log("Audio play prevented:", error);
      });
    }
  };

  const handleReserveClick = async () => {
    if (useSavedCard) {
      if (!selectedCardId) {
        toast.error("Please select a payment card.");
        return;
      }
    } else {
      const { name, cardNumber, expiration, securityCode, address } = formData;

      if (!name || !cardNumber || !expiration || !securityCode || !address) {
        toast.error("Please fill in all required fields.");
        return;
      }

      // Validate card number (basic check)
      if (cardNumber.replace(/\s/g, "").length < 13) {
        toast.error("Please enter a valid card number.");
        return;
      }

      // Validate expiration (MM/YY format)
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(expiration)) {
        toast.error("Please enter expiration in MM/YY format.");
        return;
      }

      // Validate CVV
      if (securityCode.length < 3) {
        toast.error("Please enter a valid security code.");
        return;
      }
    }

    // Show processing state
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessModal(true);
      playSuccessSound();

      // Redirect after showing success animation
      setTimeout(() => {
        resetTripData();
        router.push(ROUTES.HOME);
      }, 3000);
    }, 2000);
  };

  // Get image source with fallback
  const getCarImageSrc = () => {
    const image = tripData.selectedCar?.car_image;
    if (!image || image.trim() === "") {
      return IMAGES_ASSETS.TEMP_CAR;
    }
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `/images/${image}`;
  };

  // Get card brand icon
  const getCardIcon = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === "4") return "logos:visa";
    if (firstDigit === "5") return "logos:mastercard";
    if (firstDigit === "3") return "logos:amex";
    return "mdi:credit-card";
  };

  // Skeleton loader for saved cards
  const CardSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((index) => (
        <div
          key={index}
          className="relative p-4 rounded-xl border-2 border-gray-200 bg-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              {/* Card icon skeleton */}
              <Skeleton
                variant="rectangular"
                className="w-12 h-12"
                animation="shimmer"
              />
              <div className="flex-1">
                {/* Card number skeleton */}
                <Skeleton
                  variant="text"
                  className="h-5 w-48 mb-2"
                  animation="shimmer"
                />
                {/* Name and expiry skeleton */}
                <Skeleton
                  variant="text"
                  className="h-4 w-36"
                  animation="shimmer"
                />
              </div>
            </div>
            {/* Radio button skeleton */}
            <Skeleton
              variant="circular"
              className="w-6 h-6"
              animation="shimmer"
            />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="mt-[70px] px-4 sm:px-6 md:px-4 2xl:px-2 max-w-[1320px] mx-auto mb-10">
        <div className="bg-white text-gray-900 min-h-screen">
          <div className="max-w-7xl sm:w-[573px] lg:w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col items-start mb-10">
              <button
                onClick={() => router.push(ROUTES.RESERVE_CAR)}
                className="flex items-center cursor-pointer mb-6 text-primary hover:text-primary-dark font-medium transition-colors duration-200"
              >
                <Icon icon="mdi:arrow-left" className="mr-2 w-5 h-5" />
                Back to Car Reserve
              </button>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Complete Your Booking
                </h1>
                <p className="text-gray-500 mt-1">
                  Review and confirm your payment details
                </p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Payment Info */}
              <div className="flex-1">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Payment Method
                    </h2>
                    <Icon
                      icon="mdi:shield-check"
                      className="w-6 h-6 text-green-500"
                    />
                  </div>

                  {/* Toggle between saved and new card */}
                  <div className="flex gap-4 mb-6">
                    <button
                      onClick={() => setUseSavedCard(true)}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        useSavedCard
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon
                        icon="mdi:credit-card-multiple"
                        className="inline w-5 h-5 mr-2"
                      />
                      Saved Cards
                    </button>
                    <button
                      onClick={() => setUseSavedCard(false)}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                        !useSavedCard
                          ? "bg-primary text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      <Icon
                        icon="mdi:credit-card-plus"
                        className="inline w-5 h-5 mr-2"
                      />
                      New Card
                    </button>
                  </div>

                  {/* Saved Cards Section */}
                  {useSavedCard && (
                    <div className="space-y-4">
                      {loadingCards ? (
                        <CardSkeleton />
                      ) : savedCards.length > 0 ? (
                        <div className="space-y-3">
                          {savedCards.map((card) => (
                            <div
                              key={card.id}
                              onClick={() => setSelectedCardId(card.id)}
                              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedCardId === card.id
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-gray-200 hover:border-gray-300 bg-white"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                    <Icon
                                      icon={getCardIcon(card.card_number)}
                                      className="w-8 h-8 text-white"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900">
                                      {maskCardNumber(card.card_number)}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {card.name_on_card} • Exp:{" "}
                                      {formatExpiryDate(card.expire_date)}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedCardId === card.id
                                      ? "border-primary bg-primary"
                                      : "border-gray-300"
                                  }`}
                                >
                                  {selectedCardId === card.id && (
                                    <Icon
                                      icon="mdi:check"
                                      className="w-4 h-4 text-white"
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Icon
                            icon="mdi:credit-card-off"
                            className="w-16 h-16 text-gray-300 mx-auto mb-4"
                          />
                          <p className="text-gray-500">No saved cards found</p>
                          <button
                            onClick={() => setUseSavedCard(false)}
                            className="mt-4 text-primary font-semibold hover:underline"
                          >
                            Add a new card
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* New Card Form */}
                  {!useSavedCard && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <div className="relative">
                          <Icon
                            icon="mdi:account"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                          />
                          <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <Icon
                            icon="mdi:credit-card"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                          />
                          <input
                            name="cardNumber"
                            type="text"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiration
                          </label>
                          <div className="relative">
                            <Icon
                              icon="mdi:calendar"
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            />
                            <input
                              type="text"
                              name="expiration"
                              value={formData.expiration}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <div className="relative">
                            <Icon
                              icon="mdi:lock"
                              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                            />
                            <input
                              type="text"
                              name="securityCode"
                              value={formData.securityCode}
                              onChange={handleChange}
                              placeholder="123"
                              maxLength={4}
                              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Billing Address
                        </label>
                        <div className="relative">
                          <Icon
                            icon="mdi:map-marker"
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                          />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="123 Main St, City, State"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {tripData.accessibleVehicle && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="adaCompliant"
                          checked={formData.adaCompliant}
                          onChange={handleChange}
                          className="w-5 h-5 mt-0.5 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">
                            ADA Standards Compliant Vehicle Required
                          </span>
                          <p className="text-xs text-gray-600 mt-1">
                            This vehicle meets accessibility requirements
                          </p>
                        </div>
                      </label>
                    </div>
                  )}

                  <div className="mt-8">
                    <Button
                      label={
                        isProcessing
                          ? "Processing..."
                          : `Pay $${pricing.total}`
                      }
                      onClick={handleReserveClick}
                      size="full"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Icon icon="mdi:shield-lock" className="w-4 h-4" />
                    <span>
                      Secure payment • Your information is encrypted and
                      protected
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Summary - Keep the same as before */}
              <div className="lg:w-[450px]">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm lg:sticky lg:top-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Booking Summary
                  </h2>
                  <div className="border-b border-gray-200 mb-4"></div>

                  {/* Trip Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatTripType(tripData.tripType)}
                        </p>
                        {tripData.tripName && (
                          <p className="text-xs text-gray-500 mt-1">
                            {tripData.tripName}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => router.push(ROUTES.PLAN_JOURNEY)}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>

                    {/* Locations */}
                    <div className="space-y-2 text-xs text-gray-700">
                      <div className="flex gap-2">
                        <span className="font-semibold min-w-[60px]">
                          From:
                        </span>
                        <span className="flex-1">
                          {tripData.pickupLocation || "Not set"}
                        </span>
                      </div>

                      {tripData.tripType === "multi" &&
                        tripData.multiStops.length > 0 &&
                        tripData.multiStops.map((stop, index) => (
                          <div key={index} className="flex gap-2">
                            <span className="font-semibold min-w-[60px]">
                              Stop {index + 1}:
                            </span>
                            <span className="flex-1">
                              {stop.location || "Not set"}
                            </span>
                          </div>
                        ))}

                      <div className="flex gap-2">
                        <span className="font-semibold min-w-[60px]">
                          To:
                        </span>
                        <span className="flex-1">
                          {tripData.dropoffLocation || "Not set"}
                        </span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-gray-200 mt-2">
                        <span className="font-semibold min-w-[60px]">
                          Date:
                        </span>
                        <span className="flex-1">
                          {formatDateTime(tripData.pickupDateTime)}
                        </span>
                      </div>

                      {tripData.tripType === "multi" &&
                        tripData.multiStops.length > 0 &&
                        tripData.multiStops.map(
                          (stop, index) =>
                            stop.date && (
                              <div key={`date-${index}`} className="flex gap-2">
                                <span className="font-semibold min-w-[60px]">
                                  Stop {index + 1}:
                                </span>
                                <span className="flex-1">
                                  {formatDateOnly(stop.date)}
                                </span>
                              </div>
                            )
                        )}

                      {tripData.tripType === "round" &&
                        tripData.returnDateTime && (
                          <div className="flex gap-2">
                            <span className="font-semibold min-w-[60px]">
                              Return:
                            </span>
                            <span className="flex-1">
                              {formatDateTime(tripData.returnDateTime)}
                            </span>
                          </div>
                        )}
                    </div>

                    <div className="flex gap-4 text-sm text-gray-700 pt-2">
                      <span className="flex items-center gap-1">
                        <Icon icon="mdi:account-group" className="w-4 h-4" />
                        {tripData.persons}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon icon="mdi:bag-suitcase" className="w-4 h-4" />
                        {tripData.luggageCount}
                      </span>
                    </div>
                  </div>

                  <div className="border-b border-gray-200 my-4"></div>

                  {/* Car Details */}
                  {tripData.selectedCar && (
                    <>
                      <div className="mb-4">
                        <p className="text-base font-semibold text-gray-900 mb-1">
                          {tripData.selectedCar.carName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {tripData.selectedCar.carType} •{" "}
                          {tripData.selectedCar.fuelType}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Capacity: {tripData.selectedCar.passenger_capacity}{" "}
                          passengers
                        </p>
                      </div>

                      <div className="mb-6 flex justify-center bg-gray-50 rounded-xl p-4">
                        <img
                          src={getCarImageSrc()}
                          alt={tripData.selectedCar.carName}
                          className="w-2/3 h-auto object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              IMAGES_ASSETS.TEMP_CAR;
                          }}
                        />
                      </div>
                    </>
                  )}

                  {/* Pricing */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Base Fare</span>
                      <span className="font-medium">${pricing.baseFare}</span>
                    </div>
                    <div className="flex justify-between text-gray-700">
                      <span>Service Fee (3%)</span>
                      <span className="font-medium">${pricing.serviceFee}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total</span>
                        <span className="text-primary">${pricing.total}</span>
                      </div>
                    </div>
                  </div>

                  {tripData.selectedCar?.cancellation_charge && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex gap-2">
                        <Icon
                          icon="mdi:information"
                          className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-xs font-semibold text-amber-900">
                            Cancellation Policy
                          </p>
                          <p className="text-xs text-amber-700 mt-1">
                            Free cancellation up to 24 hours before pickup.
                            Cancellation fee: $
                            {tripData.selectedCar.cancellation_charge}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - Keep the same as before */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowSuccessModal(false)}
          ></div>

          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scaleIn">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center animate-bounce-in">
                  <Icon
                    icon="mdi:check-bold"
                    className="w-12 h-12 text-white animate-check-scale"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Payment Successful!
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Your booking has been confirmed
              </p>

              <div className="w-full bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${pricing.total}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {tripData.selectedCar?.carName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTripType(tripData.tripType)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-500 text-center">
                Redirecting to home page...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes checkScale {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .animate-check-scale {
          animation: checkScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            0.2s both;
        }
      `}</style>
    </>
  );
}

export default Payment;
