"use client"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center max-w-md">
        {/* Offline Icon */}
        <div className="mb-8 relative">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-2xl">
            <svg
              className="w-16 h-16 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
              />
            </svg>
          </div>
          <div className="absolute top-0 right-1/4 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          You're Offline
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          No internet connection detected. Don't worry, many calculators still work offline!
        </p>

        {/* Features */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Available Offline:
          </h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="text-green-500 text-2xl">✓</span>
              <span>All calculator functions</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="text-green-500 text-2xl">✓</span>
              <span>Previously loaded pages</span>
            </li>
            <li className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <span className="text-green-500 text-2xl">✓</span>
              <span>Saved calculations</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors shadow-lg"
          >
            Try Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Tip:</strong> Check your internet connection or try switching between WiFi and mobile data.
          </p>
        </div>
      </div>
    </div>
  )
}
