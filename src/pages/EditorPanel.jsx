
import React, { useMemo, useState, useEffect } from 'react';
import { Sparkles, Moon, Sun, BarChart } from 'lucide-react';

export default function EditorPanel({
  markdown,
  setMarkdown,
  vibeIntensity,
  darkMode = false,
  onToggleDarkMode = () => {} // Added toggle handler
}) {
  const [isTyping, setIsTyping] = useState(false);
  const [showWordCount, setShowWordCount] = useState(false);
  const [animateVibe, setAnimateVibe] = useState(false);

  // Calculate word count
  const wordCount = useMemo(() => {
    return markdown.trim().split(/\s+/).filter(Boolean).length;
  }, [markdown]);

  // Character count
  const charCount = useMemo(() => {
    return markdown.length;
  }, [markdown]);

  // Handle typing animation
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  // Pulse animation for vibe meter when intensity changes
  useEffect(() => {
    setAnimateVibe(true);
    const timer = setTimeout(() => setAnimateVibe(false), 600);
    return () => clearTimeout(timer);
  }, [vibeIntensity]);

  // Handle text changes
  const handleTextChange = (e) => {
    setMarkdown(e.target.value);
    setIsTyping(true);
  };

  return (
    <div className={`flex flex-col h-full transition-colors  duration-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`p-4 border-b flex justify-between items-center transition-all duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
      } ${isTyping ? 'shadow-md' : ''}`}>
        <div className="flex items-center space-x-2">
          <Sparkles 
            size={18} 
            className={`transition-all duration-300 ${isTyping ? 'text-purple-500 animate-pulse' : darkMode ? 'text-gray-400' : 'text-gray-500'}`} 
          />
          <h2 className="font-semibold">Editor</h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Vibe meter with animation */}
          <div className="flex items-center space-x-2 group relative" 
               onMouseEnter={() => setShowWordCount(true)}
               onMouseLeave={() => setShowWordCount(false)}>
            <BarChart size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <div
              className={`w-20 h-3 rounded-full overflow-hidden bg-opacity-20 shadow-inner transition-all duration-300 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
            >
              <div
                className={`h-full transition-all duration-500 ease-out ${
                  animateVibe ? 'scale-110' : 'scale-100'
                } bg-gradient-to-r ${
                  darkMode 
                    ? 'from-purple-600 to-blue-400' 
                    : 'from-blue-500 to-purple-500'
                }`}
                style={{ width: `${vibeIntensity * 100}%`, transformOrigin: 'left' }}
              ></div>
            </div>

            {/* Enhanced word counter tooltip */}
            <div className={`absolute -right-10 transform -translate-x-1/2 transition-all duration-300 ${
              showWordCount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            } pointer-events-none`}>
              <div className={`px-3 py-2 rounded-lg shadow-lg ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100 shadow-lg'
              }`}>
                <div className="flex flex-col items-center">
                  <span className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-blue-600'}`}>
                    {wordCount} {wordCount === 1 ? 'word' : 'words'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme toggle button */}
          {/* <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-full transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-blue-500'
            }`}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button> */}
        </div>
      </div>

      <div className={`flex-1 overflow-auto p-4 transition-colors duration-500 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`relative h-full rounded-lg transition-all duration-300 ${
          isTyping ? 'ring-2 ring-opacity-50' : ''
        } ${
          darkMode ? 'ring-purple-500' : 'ring-blue-400'
        }`}>
          <textarea
            className={`w-full h-full p-4 rounded-lg focus:outline-none resize-none font-mono transition-all duration-300 ${
              darkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-500' 
                : 'bg-white text-gray-900 border-gray-200 placeholder-gray-400'
            } ${
              isTyping ? 'border-transparent' : 'border'
            }`}
            value={markdown}
            onChange={handleTextChange}
            placeholder="Start typing your markdown here..."
          />
          
          {/* Typing indicator */}
          <div className={`absolute bottom-4 right-4 transition-all duration-300 ${
            isTyping ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex space-x-1">
              <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-purple-500' : 'bg-blue-500'}`} style={{ animationDelay: '0ms' }}></div>
              <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-purple-500' : 'bg-blue-500'}`} style={{ animationDelay: '150ms' }}></div>
              <div className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-purple-500' : 'bg-blue-500'}`} style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}