"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import axios from 'axios';
import Button from "../ui/Button";
import { ROUTES } from "@/app/constants/RoutesConstant";
import { API } from "@/app/constants/APIConstants";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { IMAGES_ASSETS } from "@/app/constants/ImageConstant";
import Skeleton from "../loaders/SkeletonLoader";

// Types
interface UserProfile {
  profileImage?: string;
}

interface CachedProfile {
  profileImage: string;
  timestamp: number;
  userId: string;
}

// Create axios instance with base configuration
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth utility class
class AuthService {
  private static readonly TOKEN_KEY = "auth_token";
  private static readonly USER_ID_KEY = "user_id";
  private static readonly PROFILE_CACHE_KEY = "user_profile_cache";
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

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

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_ID_KEY);
      // Clear cached profile data on logout
      localStorage.removeItem(this.PROFILE_CACHE_KEY);
      // Clear any other auth-related data
      localStorage.removeItem("user_data");
      localStorage.removeItem("user_profile");
    }
  }

  // Get cached profile from localStorage
  static getCachedProfile(): UserProfile | null {
    if (typeof window === "undefined") return null;
    
    try {
      const cached = localStorage.getItem(this.PROFILE_CACHE_KEY);
      if (!cached) return null;

      const cachedData: CachedProfile = JSON.parse(cached);
      const currentUserId = this.getUserId();
      
      // Check if cache is for current user and not expired
      if (
        cachedData.userId === currentUserId &&
        Date.now() - cachedData.timestamp < this.CACHE_DURATION
      ) {
        return { profileImage: cachedData.profileImage };
      } else {
        // Clear expired or invalid cache
        localStorage.removeItem(this.PROFILE_CACHE_KEY);
        return null;
      }
    } catch (error) {
      console.error("Error reading cached profile:", error);
      localStorage.removeItem(this.PROFILE_CACHE_KEY);
      return null;
    }
  }

  // Save profile to localStorage cache
  static setCachedProfile(profileImage: string): void {
    if (typeof window === "undefined") return;

    try {
      const userId = this.getUserId();
      if (!userId) return;

      const cacheData: CachedProfile = {
        profileImage,
        timestamp: Date.now(),
        userId,
      };

      localStorage.setItem(this.PROFILE_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error caching profile:", error);
    }
  }

  // Check if profile cache is valid
  static isCacheValid(): boolean {
    if (typeof window === "undefined") return false;

    try {
      const cached = localStorage.getItem(this.PROFILE_CACHE_KEY);
      if (!cached) return false;

      const cachedData: CachedProfile = JSON.parse(cached);
      const currentUserId = this.getUserId();
      
      return (
        cachedData.userId === currentUserId &&
        Date.now() - cachedData.timestamp < this.CACHE_DURATION
      );
    } catch (error) {
      return false;
    }
  }

  // Fetch user profile with caching
  static async getUserProfile(forceRefresh: boolean = false): Promise<UserProfile | null> {
    const token = this.getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Return cached data if available and not forcing refresh
    if (!forceRefresh) {
      const cachedProfile = this.getCachedProfile();
      if (cachedProfile) {
        return cachedProfile;
      }
    }

    try {
      const response = await apiClient.get(API.USER_PROFILE, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Extract only profileImage from the response
      const { profileImage } = response.data;
      
      // Cache the profile image
      if (profileImage) {
        this.setCachedProfile(profileImage);
      }
      
      return { profileImage };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          // Token is invalid, logout user
          this.logout();
          throw new Error("Session expired. Please login again.");
        } else if (error.response) {
          throw new Error(error.response.data?.message || "Failed to fetch profile");
        } else if (error.request) {
          throw new Error("Network error. Please check your connection.");
        }
      }
      throw new Error("An unexpected error occurred");
    }
  }

  // Clear profile cache manually
  static clearProfileCache(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.PROFILE_CACHE_KEY);
    }
  }
}

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);

  // Fetch user profile when authenticated
  const fetchUserProfile = async (forceRefresh: boolean = false) => {
    if (!AuthService.isAuthenticated()) return;

    // Don't show loading for cached data
    if (forceRefresh || !AuthService.isCacheValid()) {
      setIsLoadingProfile(true);
    }

    try {
      const profile = await AuthService.getUserProfile(forceRefresh);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      if (error instanceof Error && error.message.includes("Session expired")) {
        toast.error(error.message);
        setIsAuthenticated(false);
        setUserProfile(null);
        router.push(ROUTES.USER_LOGIN);
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Check authentication status on component mount and when localStorage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = AuthService.isAuthenticated();
      setIsAuthenticated(authStatus);
      
      if (authStatus) {
        fetchUserProfile();
      } else {
        setUserProfile(null);
      }
    };

    // Initial check
    checkAuthStatus();

    // Listen for storage changes (useful for multiple tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_token" || e.key === "user_id") {
        checkAuthStatus();
      }
      // Also listen for profile cache changes
      if (e.key === "user_profile_cache") {
        if (AuthService.isAuthenticated()) {
          const cachedProfile = AuthService.getCachedProfile();
          setUserProfile(cachedProfile);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Reduced frequency since we're using cache
    const interval = setInterval(() => {
      const authStatus = AuthService.isAuthenticated();
      if (authStatus !== isAuthenticated) {
        checkAuthStatus();
      }
    }, 10000); // Check every 10 seconds instead of 5

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    try {
      AuthService.logout(); // This will clear the cache automatically
      setIsAuthenticated(false);
      setUserProfile(null);
      setIsDropdownOpen(false);
      toast.success("Logged out successfully!");
      
      // Redirect to home page after logout
      router.push('/');
    } catch (error) {
      toast.error("Error during logout");
      console.error("Logout error:", error);
    }
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    router.push('/profile');
  };

  // Function to refresh profile data
  const refreshProfile = () => {
    fetchUserProfile(true); // Force refresh
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Get profile image URL with fallback
  const getProfileImageUrl = () => {
    if (userProfile?.profileImage) {
      return userProfile.profileImage;
    }
    // Fallback to default image
    return "/header/user.png";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white px-4 sm:px-6 md:px-8 shadow">
      <nav className="max-w-[1320px] mx-auto flex items-center justify-between h-[70px]">
        {/* Left: Logo */}
        <div className="flex-shrink-0 w-[70px] sm:w-[80px] md:w-[90px]">
          <a href={ROUTES.HOME}>
            <img src={IMAGES_ASSETS.LOGO} alt="Logo" className="w-full" />
          </a>
        </div>

        {/* Right: Links + Search + Button + Avatar + Hamburger */}
        <div className="flex items-center gap-6">
          {/* Desktop Navigation */}  
          <div className="hidden lg:flex items-center gap-10">
            {/* Nav Links */}
            <div className="flex gap-7 xl:gap-10 text-[14px] xl:text-[18px]">
              <a
                href={ROUTES.HOME}
                className="hover:text-primary text-lg font-semibold text-[#040401] transition-colors duration-200"
              >
                Home
              </a>
              <a
                href={ROUTES.PLAN_JOURNEY}
                className="hover:text-primary text-lg font-semibold text-[#040401] transition-colors duration-200"
              >
                Service
              </a>
              <a
                href={ROUTES.ABOUT}
                className="hover:text-primary text-lg font-semibold text-[#040401] transition-colors duration-200"
              >
                About Us
              </a>
              <a
                href={ROUTES.CONTACT}
                className="hover:text-primary text-lg font-semibold text-[#040401] transition-colors duration-200"
              >
                Contact Us
              </a>
            </div>

            {/* Search */}
            <div className="relative lg:w-[150px] w-[180px] md:w-[240px] xl:w-[250px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={20}
              />
              <input
                type="search"
                placeholder="Search..."
                className="border border-primary bg-white rounded-full h-[42px] md:h-[47px] w-full pl-12 pr-4 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
              />
            </div>

            {/* Book Now */}
            <Button 
              label="Book Now" 
              href={ROUTES.PLAN_JOURNEY} 
              className="lg:w-[150px] text-xs transition-transform duration-200" 
            />
          </div>

          {/* Conditional Rendering: User Avatar or Login Button */}
          {isAuthenticated ? (
            /* User Avatar + Dropdown */
            <div className="relative user-dropdown z-100">
              <button
                className="flex items-center"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                aria-label="User menu"
                disabled={isLoadingProfile}
              >
                <div className="flex hover:bg-primary-gray/20  p-2 rounded-lg items-center transition-all duration-200 cursor-pointer gap-2">
                <div className="rounded-full h-[36px] w-[36px] md:h-[40px] md:w-[40px] overflow-hidden ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200 relative">
                  {isLoadingProfile ? (
                    <Skeleton animation="shimmer" className="w-full h-full" />
                  ) : (
                    <img
                      src={getProfileImageUrl()}
                      alt="Profile"
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        // Fallback to default image if profile image fails to load
                        (e.target as HTMLImageElement).src = "/header/user.png";
                      }}
                    />
                  )}
                </div>
                <svg
                  className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden animate-fadeIn">
                  <div className="py-2">
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-200 flex items-center cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My Profile
                    </button>
                    
                    
                    <hr className="border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 flex items-center cursor-pointer"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Login Button */
            <Button 
              label="Login" 
              href={ROUTES.USER_LOGIN} 
              className="lg:w-[150px] text-xs hover:scale-105 transition-transform duration-200" 
            />
          )}

          {/* Hamburger Icon - Mobile only */}
          <button
            className="lg:hidden p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide Menu */}
      <div
        className={`lg:hidden fixed top-[70px] right-0 bottom-0 w-[80vw] sm:w-[60vw] bg-white shadow-xl z-50 transition-transform duration-300 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-4 px-6 pt-6">
          <a 
            href="/" 
            className="text-[18px] font-medium py-2 hover:text-primary transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </a>
          <a 
            href={ROUTES.PLAN_JOURNEY} 
            className="text-[18px] font-medium py-2 hover:text-primary transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Service
          </a>
          <a 
            href="/about" 
            className="text-[18px] font-medium py-2 hover:text-primary transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </a>
          <a 
            href="/contact" 
            className="text-[18px] font-medium py-2 hover:text-primary transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact Us
          </a>

          <div className="relative mt-6">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="search"
              placeholder="Search..."
              className="border border-primary rounded-full h-[42px] w-full pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-40 top-[70px]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
