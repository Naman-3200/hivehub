// // Add this to a utils file or at the top of your AuthSuccess component

// // Monitor localStorage changes
// export const monitorLocalStorage = () => {
//   const originalSetItem = localStorage.setItem;
//   const originalRemoveItem = localStorage.removeItem;
//   const originalClear = localStorage.clear;

//   localStorage.setItem = function(key, value) {
//     console.log(`📝 localStorage.setItem("${key}", "${value.length > 50 ? value.substring(0, 50) + '...' : value}")`);
//     console.trace('localStorage setItem called from:');
//     return originalSetItem.apply(this, arguments);
//   };

//   localStorage.removeItem = function(key) {
//     console.log(`🗑️ localStorage.removeItem("${key}")`);
//     console.trace('localStorage removeItem called from:');
//     return originalRemoveItem.apply(this, arguments);
//   };

//   localStorage.clear = function() {
//     console.log('🧹 localStorage.clear()');
//     console.trace('localStorage clear called from:');
//     return originalClear.apply(this, arguments);
//   };
// };

// // Call this early in your app (like in main.jsx or App.jsx)
// // monitorLocalStorage();