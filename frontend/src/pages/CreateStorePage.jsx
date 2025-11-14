import React from "react";

const CreateStorePage = ({
  newStore,
  setNewStore,
  storeCategories,
  createStore,
  navigate
}) => {
  return (
    <div className="max-w-3xl sm:max-w-4xl mx-auto py-10">
      {/* Header */}
      <div className="mb-10 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
          Create a New Store
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Set up your online store in just a few elegant steps
        </p>
      </div>

      {/* Create Store Card */}
      <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200">
        <div className="space-y-8 sm:space-y-10">
          
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Store Name
            </label>
            <input
              type="text"
              value={newStore?.name || ""}
              onChange={(e) =>
                setNewStore({ ...newStore, name: e.target.value })
              }
              placeholder="Enter your store name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              What do you want to sell?
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {(storeCategories || []).map((category) => (
                <button
                  type="button"
                  key={category.id}
                  onClick={() =>
                    setNewStore({ ...newStore, category: category.id })
                  }
                  className={`p-5 sm:p-6 rounded-xl text-center border transition-all transform 
                    hover:scale-[1.02] ${
                      newStore?.category === category.id
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md"
                        : "border-slate-200 hover:border-indigo-300 hover:shadow-sm"
                    }`}
                >
                  <div className="text-2xl sm:text-3xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/stores")}
              className="px-6 py-2 border border-slate-300 rounded-lg 
                         text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={createStore}
              disabled={!newStore?.name || !newStore?.category}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-500 
                         text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.01]
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Generate Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateStorePage;
