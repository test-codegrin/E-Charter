"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import toast from 'react-hot-toast';
import axios from 'axios';
import Button from "../../components/ui/Button";
import { ICON_DATA } from "@/app/constants/IconConstants";
import { API } from "@/app/constants/APIConstants";
import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";
import { ROUTES } from "@/app/constants/RoutesConstant";

// Types
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user_id: string;
}

interface FormErrors {
  email: string;
  password: string;
  general: string;
}

// Validation utilities
const validateEmail = (email: string): string => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
};

const validatePassword = (password: string): string => {
  if (!password.trim()) return "Password is required";
  // if (password.length < 6) return "Password must be at least 6 characters";
  return "";
};

// Create axios instance with base configuration
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth service
class AuthService {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly USER_ID_KEY = "user_id";

  static async login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
      const response = await apiClient.post(API.USER_LOGIN, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        if (error.response) {
          // Server responded with error status
          const errorMessage = error.response.data?.error || 
                              error.response.data?.message || 
                              `Login failed with status ${error.response.status}`;
          throw new Error(errorMessage);
        } else if (error.request) {
          // Request was made but no response received
          throw new Error("Network error. Please check your connection.");
        } else {
          // Something else happened
          throw new Error("An unexpected error occurred");
        }
      }
      // Non-Axios error
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }

  static saveToken(token: string, userId: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_ID_KEY, userId);
    }
  }

  static getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  static getUserId(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(this.USER_ID_KEY);
    }
    return null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Custom hook for form management
const useLoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    general: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
    }
  };

  const handleBlur = (field: keyof LoginFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof LoginFormData) => {
    let error = "";
    if (field === "email") error = validateEmail(formData.email);
    if (field === "password") error = validatePassword(formData.password);

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const validateForm = (): boolean => {
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ email: emailError, password: passwordError, general: "" });
    setTouched({ email: true, password: true });

    return !emailError && !passwordError;
  };

  return { formData, errors, touched, updateField, handleBlur, validateForm, setErrors };
};

const Login = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { formData, errors, touched, updateField, handleBlur, validateForm, setErrors } = useLoginForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (AuthService.isAuthenticated()) {
     router.push(ROUTES.HOME);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Show toast for validation errors
      if (errors.email) {
        toast.error(errors.email);
      } else if (errors.password) {
        toast.error(errors.password);
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthService.login(formData);
      AuthService.saveToken(response.token, response.user_id);

      toast.success("Login successful! Welcome back.", {
        duration: 1000,
      });
    
      setTimeout(() => {
        router.back();
      }, 1000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 md:px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Login Card */}
        <div className="bg-white rounded-3xl  p-6 sm:p-8 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <img src={IMAGES_ASSETS.LOGO} alt="Bus" className=" mx-auto mb-6" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-500 text-lg">Sign in to continue your journey</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-3 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300">
                  <Icon icon={ICON_DATA.EMAIL} className="text-gray-400 w-6 h-6 mr-3 group-focus-within:text-primary transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="Enter your email"
                    className="w-full bg-transparent focus:outline-none text-base placeholder-gray-400"
                    disabled={isLoading}
                    required
                  />
                </div>
              
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-3 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300">
                  <Icon icon={ICON_DATA.PASSWORD} className="text-gray-400 w-6 h-6 mr-3 group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter your password"
                    className="w-full bg-transparent focus:outline-none text-base placeholder-gray-400 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-primary transition-colors duration-200 p-1"
                    disabled={isLoading}
                  >
                    <Icon 
                      icon={showPassword ? ICON_DATA.EYE_SLASH : ICON_DATA.EYE} 
                      className="w-6 h-6 cursor-pointer" 
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/auth/forgot-password")}
                className="text-primary hover:text-[#2da8ab] text-sm font-semibold transition-colors duration-200 hover:underline cursor-pointer"
                disabled={isLoading}
              >
                Forgot your password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              label={
                isLoading ? (
                  "Signing In..."
                ) : (
                  "Sign In"
                )
              }
              rounded={false}
              size="full"
              disabled={isLoading}
              className={`bg-primary transform transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            />

            {/* Sign Up Link */}
            <div className="text-center pt-6 border-t border-gray-100">
              <span className="text-gray-600 text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/auth/signup")}
                  className="text-primary hover:text-[#2da8ab] font-semibold transition-colors duration-200 hover:underline cursor-pointer"
                  disabled={isLoading}
                >
                  Create Account
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
