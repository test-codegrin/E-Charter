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
interface ForgotPasswordData {
  email: string;
}

interface VerifyCodeData {
  code: string;
}

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
  general: string;
}

// Step enum
enum ForgotPasswordStep {
  EMAIL = 'email',
  CODE = 'code',
  PASSWORD = 'password'
}

// Create axios instance with base configuration
const apiClient = axios.create({
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Validation utilities
const validateEmail = (email: string): string => {
  if (!email.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address";
  return "";
};

const validateCode = (code: string): string => {
  if (!code.trim()) return "Verification code is required";
  if (code.length < 4) return "Please enter a valid verification code";
  return "";
};

const validatePassword = (password: string): string => {
  if (!password.trim()) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
};

const validateConfirmPassword = (password: string, confirmPassword: string): string => {
  if (!confirmPassword.trim()) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

// Custom hook for form management
const useForgotPasswordForm = () => {
  const [currentStep, setCurrentStep] = useState<ForgotPasswordStep>(ForgotPasswordStep.EMAIL);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    code: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    code: false,
    password: false,
    confirmPassword: false,
  });

  const updateField = (field: string, value: string) => {
    switch (field) {
      case 'email':
        setEmail(value);
        break;
      case 'code':
        setCode(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    let error = "";
    
    switch (field) {
      case 'email':
        error = validateEmail(email);
        break;
      case 'code':
        error = validateCode(code);
        break;
      case 'password':
        error = validatePassword(password);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(password, confirmPassword);
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case ForgotPasswordStep.EMAIL:
        const emailError = validateEmail(email);
        setErrors(prev => ({ ...prev, email: emailError, general: "" }));
        setTouched(prev => ({ ...prev, email: true }));
        return !emailError;

      case ForgotPasswordStep.CODE:
        const codeError = validateCode(code);
        setErrors(prev => ({ ...prev, code: codeError, general: "" }));
        setTouched(prev => ({ ...prev, code: true }));
        return !codeError;

      case ForgotPasswordStep.PASSWORD:
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
        setErrors(prev => ({ 
          ...prev, 
          password: passwordError, 
          confirmPassword: confirmPasswordError,
          general: "" 
        }));
        setTouched(prev => ({ ...prev, password: true, confirmPassword: true }));
        return !passwordError && !confirmPasswordError;

      default:
        return false;
    }
  };

  return {
    currentStep,
    setCurrentStep,
    email,
    code,
    password,
    confirmPassword,
    resetToken,
    setResetToken,
    errors,
    touched,
    updateField,
    handleBlur,
    validateCurrentStep,
    setErrors
  };
};

const ForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    currentStep,
    setCurrentStep,
    email,
    code,
    password,
    confirmPassword,
    resetToken,
    setResetToken,
    errors,
    touched,
    updateField,
    handleBlur,
    validateCurrentStep,
    setErrors
  } = useForgotPasswordForm();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      if (errors.email) {
        toast.error(errors.email);
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(API.USER_FORGOT_PASSWORD, { email });
      
      toast.success("Verification code sent to your email!", {
        duration: 2000,
      });
      
      setCurrentStep(ForgotPasswordStep.CODE);
    } catch (error) {
      let errorMessage = "Failed to send verification code";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        `Request failed with status ${error.response.status}`;
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = "An unexpected error occurred";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      if (errors.code) {
        toast.error(errors.code);
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(API.VERIFY_RESET_CODE, { 
        email, 
        code 
      });
      
      // Save the token from verification response
      if (response.data.token) {
        setResetToken(response.data.token);
      }
      
      toast.success(response.data.message || "Code verified successfully!", {
        duration: 2000,
      });
      
      setCurrentStep(ForgotPasswordStep.PASSWORD);
    } catch (error) {
      let errorMessage = "Invalid verification code";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        `Verification failed with status ${error.response.status}`;
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = "An unexpected error occurred";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) {
      if (errors.password) {
        toast.error(errors.password);
      } else if (errors.confirmPassword) {
        toast.error(errors.confirmPassword);
      }
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(API.USER_RESET_PASSWORD, {
        token: resetToken,
        password,
        confirmPassword
      });
      
      toast.success("Password reset successfully!", {
        duration: 2000,
      });
      
      setTimeout(() => {
        router.push(ROUTES.USER_LOGIN);
      }, 2000);
    } catch (error) {
      let errorMessage = "Failed to reset password";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.error || 
                        error.response.data?.message || 
                        `Reset failed with status ${error.response.status}`;
        } else if (error.request) {
          errorMessage = "Network error. Please check your connection.";
        } else {
          errorMessage = "An unexpected error occurred";
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setErrors((prev) => ({ ...prev, general: errorMessage }));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case ForgotPasswordStep.EMAIL:
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4 relative z-10">
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
                    value={email}
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

            {/* Submit Button */}
            <Button
              type="submit"
              label={isLoading ? "Sending Code..." : "Send Verification Code"}
              rounded={false}
              size="full"
              disabled={isLoading}
              className={`bg-primary transform transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            />

            {/* Back to Login Link */}
            <div className="text-center pt-6 border-t border-gray-100">
              <span className="text-gray-600 text-sm">
                Remember your password?{" "}
                <button
                  type="button"
                  onClick={() => router.push(ROUTES.USER_LOGIN)}
                  className="text-primary hover:text-[#2da8ab] font-semibold transition-colors duration-200 hover:underline cursor-pointer"
                  disabled={isLoading}
                >
                  Back to Login
                </button>
              </span>
            </div>
          </form>
        );

      case ForgotPasswordStep.CODE:
        return (
          <form onSubmit={handleCodeSubmit} className="space-y-4 relative z-10">
            {/* Code Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Verification Code
              </label>
              <div className="relative group">
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-3 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300">
                  <Icon icon={ICON_DATA.PASSWORD} className="text-gray-400 w-6 h-6 mr-3 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    name="code"
                    value={code}
                    onChange={(e) => updateField("code", e.target.value)}
                    onBlur={() => handleBlur("code")}
                    placeholder="Enter verification code"
                    className="w-full bg-transparent focus:outline-none text-base placeholder-gray-400"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 ml-1">
                Check your email for the verification code
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              label={isLoading ? "Verifying..." : "Verify Code"}
              rounded={false}
              size="full"
              disabled={isLoading}
              className={`bg-primary transform transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            />

            {/* Back Link */}
            <div className="text-center pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setCurrentStep(ForgotPasswordStep.EMAIL)}
                className="text-primary hover:text-[#2da8ab] font-semibold transition-colors duration-200 hover:underline cursor-pointer"
                disabled={isLoading}
              >
                Back to Email
              </button>
            </div>
          </form>
        );

      case ForgotPasswordStep.PASSWORD:
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 relative z-10">
            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                New Password
              </label>
              <div className="relative group">
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-3 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300">
                  <Icon icon={ICON_DATA.PASSWORD} className="text-gray-400 w-6 h-6 mr-3 group-focus-within:text-primary transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={(e) => updateField("password", e.target.value)}
                    onBlur={() => handleBlur("password")}
                    placeholder="Enter new password"
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

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <div className="flex items-center border-2 border-gray-200 rounded-xl px-3 py-3 focus-within:border-primary focus-within:shadow-lg focus-within:shadow-primary/20 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-gray-300">
                  <Icon icon={ICON_DATA.PASSWORD} className="text-gray-400 w-6 h-6 mr-3 group-focus-within:text-primary transition-colors" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    onBlur={() => handleBlur("confirmPassword")}
                    placeholder="Confirm new password"
                    className="w-full bg-transparent focus:outline-none text-base placeholder-gray-400 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-gray-400 hover:text-primary transition-colors duration-200 p-1"
                    disabled={isLoading}
                  >
                    <Icon 
                      icon={showConfirmPassword ? ICON_DATA.EYE_SLASH : ICON_DATA.EYE} 
                      className="w-6 h-6 cursor-pointer" 
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              label={isLoading ? "Resetting Password..." : "Reset Password"}
              rounded={false}
              size="full"
              disabled={isLoading}
              className={`bg-primary transform transition-all duration-200 shadow-lg hover:shadow-xl rounded-xl ${
                isLoading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            />
          </form>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case ForgotPasswordStep.EMAIL:
        return "Forgot Password";
      case ForgotPasswordStep.CODE:
        return "Verify Code";
      case ForgotPasswordStep.PASSWORD:
        return "Reset Password";
      default:
        return "Forgot Password";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case ForgotPasswordStep.EMAIL:
        return "Enter your email to receive a verification code";
      case ForgotPasswordStep.CODE:
        return "Enter the code sent to your email";
      case ForgotPasswordStep.PASSWORD:
        return "Create your new password";
      default:
        return "Enter your email to receive a verification code";
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 md:px-4">
      <div className="w-full max-w-md mx-auto">
        {/* Forgot Password Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <img src={IMAGES_ASSETS.LOGO} alt="Logo" className="mx-auto mb-6" />
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
              {getStepTitle()}
            </h1>
            <p className="text-gray-500 text-lg">{getStepSubtitle()}</p>
          </div>

          {/* Step Content */}
          {renderStepContent()}
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
