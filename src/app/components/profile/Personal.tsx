// components/profile/Personal.tsx
"use client";

import React from "react";

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

interface PersonalPageProps {
  profileData: UserProfileData | null;
  isLoading: boolean;
}

const PersonalPage: React.FC<PersonalPageProps> = ({
  profileData,
  isLoading,
}) => {
  // Format text with fallback
  const formatText = (text?: string, fallback: string = "Not provided") => {
    return text !== "" ? text : fallback;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}

      <h3 className="text-xl font-semibold text-primary">
        Personal Information
      </h3>

      {/* Personal Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black">First Name</label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-black/70">
              {formatText(profileData?.firstName)}
            </p>
          </div>
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black">Last Name</label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-black/70">{formatText(profileData?.lastName)}</p>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black">
            Email Address
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-black/70">{formatText(profileData?.email)}</p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black">Phone Number</label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-black/70">{formatText(profileData?.phoneNo)}</p>
          </div>
        </div>

        {/* Full Address */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-black">
            Street Address
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-black/70">{formatText(profileData?.address)}</p>
          </div>
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black">City</label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-black/70">{formatText(profileData?.cityName)}</p>
          </div>
        </div>

        {/* Zip Code */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-black">Zip Code</label>
          <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-black/70">{formatText(profileData?.zipCode)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalPage;
