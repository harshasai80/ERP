import React from 'react';

function SyllabusTab() {
  return (
    <div className="flex items-center justify-center w-full px-4">
      {/* Main Card */}
      <div className="relative bg-white/10 backdrop-blur-lg shadow-xl rounded-xl p-6 sm:p-8 text-center 
                      w-full max-w-md border border-white/20 transition-all duration-300">
        
        {/* Icon */}
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 
                        bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-3 shadow-lg">
          <div className="text-2xl">📊</div>
        </div>

        {/* Header */}
        <div className="mt-6 mb-4">
          <h1 className="text-xl sm:text-2xl font-extrabold 
                         bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 
                         bg-clip-text text-transparent">
            Syllabus Management
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full mt-2"></div>
        </div>

        {/* Status Message */}
        <div className="mb-4">
          <p className="text-gray-200 text-sm">
            Currently 
            <span className="ml-2 text-base font-bold 
                            bg-gradient-to-r from-orange-400 to-red-500 
                            bg-clip-text text-transparent animate-pulse">
              Under Development
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Feature will be available soon.
          </p>
        </div>

        {/* Features Preview */}
        <div className="flex flex-wrap justify-center gap-2 mb-3">
          {['Mark Entry', 'Auto Calculate', 'Grade Reports', 'Analytics'].map((feature, i) => (
            <span 
              key={i} 
              className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full border 
                         border-purple-500/30 text-xs"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Progress Bar */}
        <div>
          <div className="w-full bg-gray-700/50 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-1.5 rounded-full animate-pulse"
                 style={{ width: '70%' }}></div>
          </div>
          <p className="text-xs text-gray-400 mt-1">70% Complete</p>
        </div>
      </div>
    </div>
  );
}

export default SyllabusTab;
