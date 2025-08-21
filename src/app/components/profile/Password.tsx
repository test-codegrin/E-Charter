"use client";

import { useState } from "react";

export default function PasswordPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="">
      {/* Page Title */}
      <h3 className="text-[22px] font-semibold text-[#3DBEC8] mb-4">
        Security Settings
      </h3>

      {/* Password Card */}
      <div className="mt-6 max-w-[1116px] w-full bg-[#F4F4F4] border border-[#DBDBDB] rounded-[14px]">
        <div className="flex justify-end">
          <div className="w-full md:w-[1056px] 2xl:w-[1116px] mx-[30px] h-[109px] flex items-center justify-between">
            <div className="w-[229px]">
              <p className="text-xl font-semibold">Password</p>
              <p className="text-lg text-gray-600">Last changed 30 days ago</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="w-[198px] h-[47px] rounded-full text-white font-semibold text-lg bg-[#3DBEC8] hover:bg-[#34a7af] transition"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-lg">
            <h2 className="text-xl font-semibold text-[#3DBEC8] mb-4">
              Change Password
            </h2>

            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full border-b mt-1 px-2 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full border-b mt-1 px-2 py-2 text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full border-b mt-1 px-2 py-2 text-sm focus:outline-none"
                />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-full border text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-full bg-[#3DBEC8] text-white font-semibold hover:bg-[#34a7af] transition"
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
