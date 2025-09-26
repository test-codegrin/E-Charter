// File: src/app/security/page.tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Button from "../ui/Button";
import Inputs from "../ui/Inputs";

export default function PasswordPage() {
  // Modal state
  const [showModal, setShowModal] = useState(false);

  // Password input state
  const [formData, setFormData] = useState({
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
  };

  // Handle update action
  const handleUpdate = () => {
    console.log("Password Update Attempt ✅", formData);

    if (formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirmation do not match!");
      return;
    }

    // TODO: Add API call here to update password securely
    setShowModal(false);
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
            className="mt-4 sm:mt-0 w-full sm:w-auto px-6 py-2 rounded-full text-white font-semibold text-lg bg-primary hover:bg-[#34a7af] transition"
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
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black text-lg"
            >
              ✕
            </button>

            {/* Title */}
            <h4 className="text-xl font-semibold mb-6">Change Password</h4>

            {/* Form */}
            <form className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative mt-1">
                  <Inputs
                    name="currentPassword"
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 px-2 py-2 text-sm focus:outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="relative mt-1">
                  <Inputs
                    name="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 px-2 py-2 text-sm focus:outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <Inputs
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full border-b border-gray-300 px-2 py-2 text-sm focus:outline-none focus:border-primary pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <Button
                label="Cancel"
                onClick={() => setShowModal(false)}
                variant="outline"
                size="md"
              />
              <Button
                label="Update"
                onClick={handleUpdate}
                size="md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
