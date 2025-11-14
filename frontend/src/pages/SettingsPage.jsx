import React from "react";


const SettingsPage = ({
  loading,
  formData,
  setFormData,
  userData,
  handleSaveProfile,
  handleUpgradePlan,
}) => {
    console.log("userData in SettingsPage:", userData);
    console.log("formData in SettingsPage:", formData);


  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">⚙️ Settings</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Loading your profile...</p>
      ) : (
        <div className="space-y-10 max-w-3xl">
          {/* ========================== */}
          {/*        Profile Card        */}
          {/* ========================== */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Profile Settings
            </h2>

            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
              <img
                src={
                  formData?.profilePicture ||
                  "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                }
                alt="Profile"
                className="w-28 h-28 rounded-full border shadow-md object-cover"
              />
              <input
                type="text"
                value={formData?.profilePicture}
                onChange={(e) =>
                  setFormData({ ...formData, profilePicture: e.target.value })
                }
                placeholder="Profile picture URL"
                className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Name Field */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData?.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={userData?.email || ""}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 bg-gray-100 rounded-xl shadow-sm text-gray-600"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl shadow hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>

          {/* ========================== */}
          {/*      Subscription Card      */}
          {/* ========================== */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Subscription Plan
            </h2>

            <p className="text-gray-800 text-base mb-2">
              <span className="font-medium">Current Plan:</span>{" "}
              <span className="font-semibold text-indigo-600 capitalize">
                {userData?.subscription?.status === "active"
                  ? userData?.subscription?.planId || "Pro"
                  : "Free"}
              </span>
            </p>

            {userData?.subscription?.provider && (
              <p className="text-gray-600 text-sm">
                Provider: {userData.subscription.provider.toUpperCase()}
              </p>
            )}

            {userData?.subscription?.expiresAt && (
              <p className="text-gray-500 text-sm mt-1">
                Renews on:{" "}
                {new Date(
                  userData.subscription.expiresAt
                ).toLocaleDateString()}
              </p>
            )}

            <button
              onClick={handleUpgradePlan}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl shadow hover:bg-blue-700 transition"
            >
              Upgrade Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
