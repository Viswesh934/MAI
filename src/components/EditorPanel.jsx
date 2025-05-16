import React from 'react';

export default function EditorPanel({
  markdown,
  setMarkdown,
  vibeIntensity
}) {
  return (
    <>
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center transition-colors duration-200">
        <h2 className="font-semibold">Editor</h2>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">Live Vibing:</span>
          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${vibeIntensity * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 transition-colors duration-200">
        <textarea
          className="w-full h-full p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none font-mono text-gray-900 dark:text-gray-100 transition-colors duration-200"
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Start typing your markdown here..."
        />
      </div>
    </>
  );
}