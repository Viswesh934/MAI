import React from 'react';

export default function Navbar({ 
  theme, 
  setTheme, 
  toggleMusic, 
  musicEnabled, 
  setShowSummary, 
  onSummaryClick,
  setSummary, 
  vibeIntensity,
  downloadMarkdown,
  isProcessingDownload,
  selectedSection
}) {
  // Enhanced theme-specific styling
  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-800';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const buttonBgColor = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200';
  const activeButtonBgColor = theme === 'dark' ? 'bg-blue-600' : 'bg-blue-500';

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Only show the summary modal, fetching is handled elsewhere
  const handleSummaryClick = () => {
    onSummaryClick();
    setShowSummary(true);
  };

  return (
    <nav className={`${bgColor} ${textColor} border-b ${borderColor} px-4 py-3 flex items-center justify-between`}>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">VibeNote</span>
        <div className={`h-2 w-2 rounded-full ${vibeIntensity > 0.5 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Only show these options for the editor section */}
        {selectedSection === 'editor' && (
          <>
            {/* Theme Toggle */}
            <button 
              onClick={handleThemeToggle}
              className={`${buttonBgColor} px-3 py-1 rounded-md text-sm flex items-center`}
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
            
            {/* Music Toggle */}
            <button 
              onClick={toggleMusic}
              className={`${musicEnabled ? activeButtonBgColor + ' text-white' : buttonBgColor} px-3 py-1 rounded-md text-sm flex items-center`}
            >
              {musicEnabled ? 'Music: On' : 'Music: Off'}
            </button>
            
            {/* Summary Button */}
            <button 
              onClick={handleSummaryClick}
              className={`${buttonBgColor} px-3 py-1 rounded-md text-sm`}
            >
              Summary
            </button>
            
            {/* Download Dropdown */}
            <div className="relative inline-block text-left">
              <div>
                <button 
                  className={`${buttonBgColor} px-3 py-1 rounded-md text-sm flex items-center`}
                  id="download-menu"
                  aria-expanded="true"
                  aria-haspopup="true"
                  onClick={() => document.getElementById('download-dropdown').classList.toggle('hidden')}
                >
                  Download
                  <svg className="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              
              <div 
                id="download-dropdown"
                className={`hidden origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ${theme === 'dark' ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-black ring-opacity-5'} ring-1 z-10`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="download-menu"
              >
                <div className="py-1" role="none">
                  <button
                    onClick={downloadMarkdown}
                    className={`block w-full text-left px-4 py-2 text-sm ${theme === 'dark' ? 'text-gray-100 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    role="menuitem"
                  >
                    Markdown (.md)
                  </button>
                </div>
              </div>
            </div>
            
            {/* Keyboard Shortcuts Help */}
            <button 
              onClick={() => alert('Keyboard Shortcuts:\nAlt+T: Toggle Theme\nAlt+M: Toggle Music\nAlt+S: Show Summary\nAlt+H: Highlight Selected Text\nAlt+D: Download Markdown')}
              className={`${buttonBgColor} px-3 py-1 rounded-md text-sm`}
            >
              Help
            </button>
          </>
        )}
      </div>
    </nav>
  );
}