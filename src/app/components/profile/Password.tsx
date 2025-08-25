"use client";

import { useState } from "react";

export default function PasswordPage() {
  const [showModal, setShowModal] = useState(false);

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
            className="mt-4 sm:mt-0 w-full sm:w-auto px-6 py-2 rounded-full text-white font-semibold text-lg bg-[#3DBEC8] hover:bg-[#34a7af] transition"
          >
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
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full border-b border-gray-300 mt-1 px-2 py-2 text-sm focus:outline-none focus:border-[#3DBEC8]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full border-b border-gray-300 mt-1 px-2 py-2 text-sm focus:outline-none focus:border-[#3DBEC8]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full border-b border-gray-300 mt-1 px-2 py-2 text-sm focus:outline-none focus:border-[#3DBEC8]"
                />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-full bg-[#3DBEC8] text-white font-semibold hover:bg-[#34a7af] transition w-full sm:w-auto"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
