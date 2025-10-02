"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from "react-hot-toast";
import axios, { AxiosError } from 'axios';
import Button from "../../components/ui/Button";
import { ICON_DATA } from "@/app/constants/IconConstants";
import { API } from "@/app/constants/APIConstants";
import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";
import { ROUTES } from "@/app/constants/RoutesConstant";

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  cityName: string;
  zipCode: string;
  phoneNo: string;
  profileImage: File | null;
}

// Create axios instance with base configuration
const apiClient = axios.create({
  timeout: 30000, // 30 seconds timeout for file uploads
  headers: {
    'Accept': 'application/json',
  },
});

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    cityName: "",
    zipCode: "",
    phoneNo: "",
    profileImage: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof SignupFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      updateField("profileImage", e.target.files[0]);
    }
  };

  // Password validation
  const validatePassword = (password: string): string | null => {
    // if (password.length < 6) return "Password must be at least 6 characters";
    // if (!/[A-Z]/.test(password))
    //   return "Password must include an uppercase letter";
    // if (!/[a-z]/.test(password))
    //   return "Password must include a lowercase letter";
    // if (!/[0-9]/.test(password)) return "Password must include a number";
    // if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
    //   return "Password must include a special character";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData object for multipart/form-data
      const form = new FormData();
      
      // Append all form fields except confirmPassword
      Object.entries(formData).forEach(([key, value]) => {
        if (value && key !== "confirmPassword") {
          form.append(key, value as any);
        }
      });

      // Make the API request using Axios
      const response = await apiClient.post(API.USER_SIGNUP, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // Optional: Add upload progress tracking
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
            // You can use this to show a progress bar if needed
          }
        },
      });

      // Success response
      toast.success("Account created successfully!");
      router.push(ROUTES.USER_LOGIN);

    } catch (error) {
      // Enhanced error handling with Axios
      let errorMessage = "Signup failed";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          errorMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        `Signup failed with status ${error.response.status}`;
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          // Something else happened
          errorMessage = "An unexpected error occurred during signup.";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-white px-2">
      <div className="w-full max-w-md mx-auto">
        <div className="p-2 sm:p-0">
          {/* Header */}
          <div className="text-center mb-4">
            <img
              src={IMAGES_ASSETS.LOGO}
              alt="Logo"
              className="mx-auto mb-3 w-20"
            />
            <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-500 text-sm">Fill in your details</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* First & Last Name */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-3 text-sm 
                           focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
                disabled={isLoading}
              />
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-3 text-sm 
                           focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
                disabled={isLoading}
              />
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm 
                         focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              required
              disabled={isLoading}
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => updateField("password", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm pr-10 
                           focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
                disabled={isLoading}
              >
                <Icon
                  icon={showPassword ? ICON_DATA.EYE_SLASH : ICON_DATA.EYE}
                  className="w-5 h-5"
                />
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => updateField("confirmPassword", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm pr-10 
                           focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400"
                disabled={isLoading}
              >
                <Icon
                  icon={
                    showConfirmPassword ? ICON_DATA.EYE_SLASH : ICON_DATA.EYE
                  }
                  className="w-5 h-5"
                />
              </button>
            </div>

            {/* Address */}
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => updateField("address", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm 
                         focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              required
              disabled={isLoading}
            />

            {/* City & Zip */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="City"
                value={formData.cityName}
                onChange={(e) => updateField("cityName", e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-3 text-sm 
                           focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
                disabled={isLoading}
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={(e) => updateField("zipCode", e.target.value)}
                className="w-1/2 border border-gray-300 rounded-lg px-3 py-3 text-sm 
                           focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                required
                disabled={isLoading}
              />
            </div>

            {/* Phone */}
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phoneNo}
              onChange={(e) => updateField("phoneNo", e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm 
                         focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              required
              disabled={isLoading}
            />

            {/* Profile Image */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Profile Image
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="flex-1 text-sm border border-gray-300 rounded-lg file:mr-2 file:py-2 file:px-4 
                 file:rounded-md file:border-0 file:bg-primary file:text-white 
                 hover:file:bg-primary/90 cursor-pointer
                 focus:border-primary focus:ring-1 focus:ring-primary outline-none
                 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                {formData.profileImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, profileImage: null });
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    disabled={isLoading}
                  >
                    <Icon
                      icon={ICON_DATA.CLOSE}
                      className="w-5 h-5 cursor-pointer text-danger"
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              label={isLoading ? "Creating Account..." : "Sign Up"}
              size="full"
              disabled={isLoading}
              className={`bg-primary rounded-lg text-sm py-2 
                ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
            />

            {/* Login Redirect */}
            <div className="text-center pt-2">
              <span className="text-gray-600 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push(ROUTES.USER_LOGIN)}
                  className="text-primary font-semibold hover:underline cursor-pointer"
                  disabled={isLoading}
                >
                  Login
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Signup;
