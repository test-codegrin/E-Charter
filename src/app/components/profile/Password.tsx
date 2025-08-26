"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordPage() {
  const [showModal, setShowModal] = useState(false);

  // State for password visibility
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="sm:px-6 lg:px-8">
      {/* Page Title */}
      <h3 className="text-[22px] font-semibold text-[#3DBEC8] mb-6">
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
            className="mt-4 sm:mt-0 w-full sm:w-auto px-6 py-2 rounded-full text-white font-semibold text-lg bg-[#3DBEC8] hover:bg-[#34a7af] transition">
            Change Password
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
            {/* Title */}
            <h2 className="text-xl font-semibold text-[#3DBEC8] mb-6">
              Change Password
            </h2>

            {/* Form */}
            <form className="space-y-5">
              {/* Current Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="Enter current password"
                    className="w-full border-b border-gray-300 px-2 py-2 text-sm focus:outline-none focus:border-[#3DBEC8] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3DBEC8]">
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
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full border-b border-gray-300 px-2 py-2 text-sm focus:outline-none focus:border-[#3DBEC8] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3DBEC8]">
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
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="w-full border-b border-gray-300 px-2 py-2 text-sm focus:outline-none focus:border-[#3DBEC8] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#3DBEC8]">
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </form>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition w-full sm:w-auto">
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-full bg-[#3DBEC8] text-white font-semibold hover:bg-[#34a7af] transition w-full sm:w-auto">
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
