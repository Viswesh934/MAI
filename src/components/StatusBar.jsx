import React from 'react';
import { Music, AlertCircle } from 'lucide-react';

export default function StatusBar({ markdown, musicEnabled, musicMode }) {
  const charCount = markdown.length;
  const wordCount = markdown.split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
      <div className="flex items-center space-x-2">
        <span>{charCount} characters</span>
        <span>•</span>
        <span>{wordCount} words</span>
        {musicEnabled && (
          <>
            <span>•</span>
            <span className="flex items-center">
              <Music className="w-3 h-3 mr-1" />
              {musicMode} mode
            </span>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Alt+M: Music</span>
        </div>
        <div className="flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Alt+S: Summary</span>
        </div>
        <div className="flex items-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>Alt+T: Theme</span>
        </div>
      </div>
    </div>
  );
}