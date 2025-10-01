"use client";

import React, { useState, useEffect } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import PersonalPage from "../components/profile/Personal";
import PaymentPage from "../components/profile/Payment";
import MyJourneyPage from "../components/profile/Journy";
import PasswordPage from "../components/profile/Password";
import Skeleton from "../components/loaders/SkeletonLoader";
import { API } from "@/app/constants/APIConstants";

// Types for user profile data
interface UserProfileData {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNo?: string;
  address?: string;
  cityName?: string;
  zipCode?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Auth utility class (same as navbar)
class AuthService {
  private static readonly TOKEN_KEY = "auth_token";

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Create axios instance
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function Page() {
  const [activeTab, setActiveTab] = useState("personal");
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true for initial load
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { key: "personal", label: "Personal Info" },
    { key: "payment", label: "Payment Method" },
    { key: "journey", label: "My Journey" },
    { key: "password", label: "Password" },
  ];

  // Fetch user profile data
  const fetchUserProfile = async () => {
    if (!AuthService.isAuthenticated()) {
      setError("Please login to view profile");
      setIsLoading(false);
      return;
    }

    const token = AuthService.getToken();
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(API.USER_PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      
      let errorMessage = "Failed to load profile data";
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          errorMessage = "Session expired. Please login again.";
        } else if (error.response) {
          errorMessage = error.response.data?.message || "Failed to fetch profile";
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection.";
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch profile data on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Get profile image URL with fallback
  const getProfileImageUrl = () => {
    if (profileData?.profileImage) {
      return profileData.profileImage;
    }
    return "/images/Profile12.png";
  };

  // Get display name
  const getDisplayName = () => {
    if (profileData?.firstName && profileData?.lastName) {
      return `${profileData.firstName} ${profileData.lastName}`;
    } else if (profileData?.firstName) {
      return profileData.firstName;
    } else if (profileData?.lastName) {
      return profileData.lastName;
    }
    return "User Name";
  };

  // Get display email
  const getDisplayEmail = () => {
    return profileData?.email || "user@example.com";
  };

  // Error state (only show when not loading and there's an error)
  if (error && !profileData && !isLoading) {
    return (
      <div className="min-h-[533px] max-w-[1760px] mx-auto w-full flex flex-col">
        <main className="flex mt-[100px] flex-col items-center mb-[50px] px-4 flex-grow">
          <div className="bg-[#FCFCFC] max-w-[1176px] border border-[#DBDBDB] rounded-[14px] p-6 w-full">
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchUserProfile}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[533px] max-w-[1760px] mx-auto w-full flex flex-col">
      <main className="flex mt-[100px] flex-col items-center mb-[50px] px-4 flex-grow">

        {/* Profile Card Section */}
        <div className="bg-[#FCFCFC] max-w-[1176px] border border-[#DBDBDB] rounded-[14px] p-6 w-full">
          <div className="flex sm:flex-row flex-col sm:mx-auto justify-center items-center">
            {isLoading ? (
              <>
                {/* Profile Image Skeleton */}
                <Skeleton
                  variant="circular"
                  animation="shimmer"
                  className="w-[130px] h-[130px] flex-shrink-0"
                />
                {/* Profile Info Skeleton */}
                <div className="ml-[24px] w-[304px] space-y-3 text-center">
                  <Skeleton animation="shimmer" className="w-3/4 h-8 mx-auto" />
                  <Skeleton animation="shimmer" className="w-1/2 h-5 mx-auto" />
                </div>
              </>
            ) : (
              <>
                <div className="relative">
                  <img
                    src={getProfileImageUrl()}
                    alt="profile"
                    className="rounded-full h-32 w-32  object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/Profile12.png";
                    }}
                  />
                </div>
                <div className="md:ml-[24px] w-fit text-center">
                  <h2 className="text-xl sm:text-4xl font-semibold mt-3">{getDisplayName()}</h2>
                  <p className="text-base sm:text-xl text-black/70">
                    {getDisplayEmail()}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tabs Section*/}
        <div className="w-full max-w-[1176px] bg-[#FCFCFC] mt-6 border border-[#DBDBDB] p-4 sm:p-6 rounded-[14px]">
          {/* Tab headers */}
          {isLoading ? (
            <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6 border-b border-[#DBDBDB] pb-2">
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} animation="shimmer" className="w-[120px] h-6 rounded" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-6 border-b border-[#DBDBDB] text-base sm:text-lg font-medium overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative pb-2 transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.key
                      ? "text-primary font-semibold"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Tab Content */}
          <div className="mt-6">
            {isLoading ? (
              <div className="space-y-6">
                {/* Form Fields Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="space-y-2">
                      <Skeleton animation="shimmer" className="w-[100px] h-4" />
                      <Skeleton animation="shimmer" className="w-full h-10 rounded-lg" />
                    </div>
                  ))}
                </div>
                {/* Button Skeleton */}
                <div className="flex justify-end">
                  <Skeleton animation="shimmer" className="w-[120px] h-10 rounded-lg" />
                </div>
              </div>
            ) : (
              <>
                {/* PERSONAL INFO TAB */}
                {activeTab === "personal" && (
                  <PersonalPage 
                    profileData={profileData} 
                    isLoading={false}
                  />
                )}

                {/* PAYMENT TAB */}
                {activeTab === "payment" && (
                  <PaymentPage />
                )}

                {/* JOURNEY TAB */}
                {activeTab === "journey" && (
                  <MyJourneyPage />
                )}

                {/* PASSWORD TAB */}
                {activeTab === "password" && (
                  <PasswordPage />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
