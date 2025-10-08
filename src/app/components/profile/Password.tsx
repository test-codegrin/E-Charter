// File: src/app/components/profile/Password.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { API } from "@/app/constants/APIConstants";
import Input from "../ui/Inputs";
import Button from "../ui/Button";

interface PasswordPageProps {
  email?: string;
}

export default function PasswordPage({ email }: PasswordPageProps) {
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password input state
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Form errors
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    let isValid = true;

    // Validate current password
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = "Current password is required";
      isValid = false;
    }

    // Validate new password
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your new password";
      isValid = false;
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Check if new password is same as current
    if (formData.currentPassword === formData.newPassword && formData.newPassword) {
      newErrors.newPassword = "New password must be different from current password";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  // Handle modal close
  const handleCloseModal = () => {
    resetForm();
    setShowModal(false);
  };

// Handle update action
const handleUpdate = async () => {
  // Validate form
  if (!validateForm()) {
    return;
  }

  // Check if email is available
  if (!email) {
    toast.error("Email not found. Please refresh the page");
    return;
  }

  // Get token from localStorage
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    toast.error("Authentication token not found. Please login again");
    return;
  }

  setIsLoading(true);

  try {
    const response = await axios.post(API.CHANGE_PASSWORD, {
      email: email,
      oldPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    // Success response
    if (response.data && response.data.message) {
      toast.success(response.data.message || "Password updated successfully");
      resetForm();
      setShowModal(false);
    }
  } catch (error) {
    console.error("Error changing password:", error);

    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Handle 401 Unauthorized (expired/invalid token)
        if (error.response.status === 401) {
          toast.error("Session expired. Please login again");
          // Optional: Redirect to login page
          // window.location.href = '/login';
          return;
        }

        // Server responded with error
        const errorMessage = error.response.data?.error || 
                             error.response.data?.message || 
                             "Failed to update password";
        toast.error(errorMessage);
        
        // If incorrect old password, highlight the field
        if (errorMessage.toLowerCase().includes("incorrect old password") || 
            errorMessage.toLowerCase().includes("incorrect password")) {
          setErrors((prev) => ({
            ...prev,
            currentPassword: "Incorrect password"
          }));
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection");
      } else {
        toast.error("An error occurred. Please try again");
      }
    } else {
      toast.error("An unexpected error occurred");
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="max-w-[1176px] w-full">
      {/* Page Title */}
      <h3 className="text-[22px] font-semibold text-primary mb-6">
        Security Settings
      </h3>

      {/* Password Card */}
      <div className="mt-6 w-full max-w-[1116px] bg-[#F4F4F4] border border-[#DBDBDB] rounded-[14px]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6">
          <div className="flex-1">
            <p className="text-xl font-semibold">Password</p>
            <p className="text-lg text-gray-600">Last changed 30 days ago</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 w-full sm:w-auto px-6 py-2 rounded-full text-white font-semibold text-lg bg-primary hover:bg-[#34a7af] transition cursor-pointer"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="relative bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              disabled={isLoading}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg disabled:opacity-50"
            >
              ✕
            </button>

            {/* Title */}
            <h4 className="text-xl font-semibold mb-6">Change Password</h4>

            {/* Form */}
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Current Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1 border rounded-md border-gray-300 p-2">
                  <Input
                    name="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full border-b border-gray-300 px-2 py-2 text-sm focus:outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary cursor-pointer disabled:opacity-50"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1 border rounded-md border-gray-300 p-2">
                  <Input
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full border-b border-gray-300 px-2 py-2 text-sm focus:outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary cursor-pointer disabled:opacity-50"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1 border rounded-md border-gray-300 p-2">
                  <Input
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full border-b border-gray-300 px-2 py-2 text-sm focus:outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    disabled={isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary cursor-pointer disabled:opacity-50"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            </form>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <Button
                label="Cancel"
                onClick={handleCloseModal}
                variant="outline"
                size="md"
                disabled={isLoading}
              />
              <Button
                label={isLoading ? "Updating..." : "Update"}
                onClick={handleUpdate}
                size="md"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
