import React from "react";
import { Plus, ExternalLink, Copy, Share2, Globe, Store as StoreIcon } from "lucide-react";

const StoresPage = ({
  stores,
  setStores,
  newStore,
  setNewStore,
  storeCategories,
  createStore,
  selectedStore,
  setSelectedStore,
  openStoreWebsite,
  myProducts,
  navigate,
  token,
  setCurrentView
}) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent tracking-tight drop-shadow-sm">
            Your Stores
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Create, customize, and manage your online stores beautifully
          </p>
        </div>

        <button
          onClick={() => setCurrentView("create-store")}
        // onClick={() => navigate("/create-store")}

          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-100 transition-all"
        >
          <Plus className="h-5 w-5" />
          <span className="font-medium">Create Store</span>
        </button>
      </div>

      {/* Empty state */}
      {(!stores || stores.length === 0) ? (
        <div className="bg-white/80 backdrop-blur-md border border-slate-200 p-10 sm:p-16 rounded-3xl shadow-xl text-center">
          <StoreIcon className="h-16 w-16 sm:h-20 sm:w-20 text-blue-500 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-3">
            No Stores Yet
          </h2>
          <p className="text-slate-600 mb-8 text-base sm:text-lg">
            You haven’t created any stores yet. Start your online journey now!
          </p>

          <button
            onClick={() => setCurrentView("create-store")}
            className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Create Your First Store
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {stores.map((store, index) => (
            <div
              key={store?.id || store?._id || index}
              className="group bg-white/70 backdrop-blur-lg p-6 rounded-2xl border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
            >
              {/* Hover Glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 line-clamp-1">
                    {store?.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 capitalize line-clamp-1">
                    {store?.category}
                  </p>
                </div>

                <button
                  onClick={() => openStoreWebsite(store)}
                  className="text-indigo-600 hover:text-indigo-800 transition"
                >
                  <ExternalLink className="h-5 w-5" />
                </button>
              </div>

              {/* Domain / Actions */}
              <div className="mb-6 bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
                <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">
                  {store?.customDomain || store?.domain}
                </p>

                <div className="flex flex-wrap gap-3 mt-3">
                  {/* Copy */}
                  <button
                    onClick={() => {
                      const raw = store?.customDomain || store?.domain || "";
                      const copyUrl = raw.startsWith("http")
                        ? raw
                        : `${window.location.origin}/${String(raw).replace(/^\//, "")}`;

                      navigator.clipboard
                        .writeText(copyUrl)
                        .then(() => alert("Copied to clipboard!"))
                        .catch(() => alert("Failed to copy"));
                    }}
                    className="flex items-center text-xs text-slate-600 hover:text-slate-900 transition"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>

                  {/* Edit Store */}
                  <button
                    onClick={() =>
                      navigate(`/builder/${store?._id}`, {
                        state: {
                          store,
                          publishedProducts: (myProducts || []).filter(p => p?.published),
                        },
                      })
                    }
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Edit Store
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => {
                      const raw = store?.domain || "";
                      const shareUrl = raw.startsWith("http")
                        ? raw
                        : `${window.location.origin}/${String(raw).replace(/^\//, "")}`;

                      if (navigator.share) {
                        navigator.share({
                          title: store?.name || "My Store",
                          url: shareUrl,
                        });
                      } else {
                        alert("Sharing not supported on this device");
                      }
                    }}
                    className="flex items-center text-xs text-slate-600 hover:text-slate-900 transition"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>

                  {/* Edit Domain */}
                  <button
                    onClick={() => {
                      const current = store?.customDomain || "";
                      const newDomain = prompt("Enter your custom domain:", current);

                      if (newDomain) {
                        fetch(`https://hivehub-1.onrender.com/api/stores/${store?._id}/domain`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                            Authorization: token ? `Bearer ${token}` : undefined,
                          },
                          body: JSON.stringify({ customDomain: newDomain }),
                        })
                          .then(res => res.json())
                          .then(data => {
                            if (data?.success) {
                              setStores(prev =>
                                prev.map(s =>
                                  s?._id === store?._id ? data.store : s
                                )
                              );
                            } else {
                              alert(data?.error || "Failed to update domain");
                            }
                          })
                          .catch(() => alert("Failed to update domain"));
                      }
                    }}
                    className="text-xs text-indigo-600 hover:text-indigo-900 transition"
                  >
                    Edit Domain
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                <button
                  onClick={() => openStoreWebsite(store)}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                >
                  <Globe className="h-4 w-4" />
                  View Live Store
                </button>

                <button
                  onClick={() => {
                    setSelectedStore(store);
                    setCurrentView("inventory");
                  }}
                  className="text-sm text-slate-700 hover:text-slate-900 font-medium transition"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoresPage;
