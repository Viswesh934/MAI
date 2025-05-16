import React from 'react';
import { ToggleRight, ToggleLeft, Volume2 } from 'lucide-react';

export default function VibePanel({
  musicEnabled,
  toggleMusic,
  volume,
  setVolume,
  musicMode,
  setMusicMode,
  vibeIntensity,
  keyPressInterval,
  waveVisualization
}) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-semibold">Match Vibe Settings</h2>
      </div>
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-2xl mx-auto">
          {/* Music Control */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Music Control</h3>
            <div className="flex items-center justify-between mb-6">
              <span>Music</span>
              <button onClick={toggleMusic} className="flex items-center">
                {musicEnabled ? (
                  <ToggleRight className="w-10 h-6 text-blue-500" />
                ) : (
                  <ToggleLeft className="w-10 h-6 text-gray-400" />
                )}
              </button>
            </div>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Volume</span>
                <span>{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <Volume2 className="w-4 h-4 text-gray-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={e => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
            <div className="mb-6">
              <span className="block mb-2">Music Mode</span>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setMusicMode('ambient')}
                  className={`p-3 rounded-md flex items-center justify-center ${
                    musicMode === 'ambient'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  Ambient
                </button>
                <button
                  onClick={() => setMusicMode('focus')}
                  className={`p-3 rounded-md flex items-center justify-center ${
                    musicMode === 'focus'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  Focus
                </button>
                <button
                  onClick={() => setMusicMode('energetic')}
                  className={`p-3 rounded-md flex items-center justify-center ${
                    musicMode === 'energetic'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-medium'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  Energetic
                </button>
              </div>
            </div>
          </div>
          {/* Visualization */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Visualization</h3>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              {waveVisualization && waveVisualization()}
              <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <span>Current Vibe Intensity: {(vibeIntensity * 100).toFixed(0)}%</span>
                <span>
                  Typing Speed:{' '}
                  {keyPressInterval < 1000
                    ? 'Fast'
                    : keyPressInterval < 2000
                    ? 'Medium'
                    : 'Slow'}
                </span>
              </div>
            </div>
          </div>
          {/* How it works */}
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-blue-800 dark:text-blue-200">
            <h3 className="font-medium mb-2">How it works</h3>
            <p className="text-sm">
              Match Vibe generates music based on your typing pattern. The notes are determined by the characters you type,
              while the tempo and intensity change with your typing speed. Try typing faster to increase the energy,
              or slower for a more ambient feel.
            </p>
            <div className="mt-3 text-sm">
              <div className="font-medium">Keyboard Shortcuts:</div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                <div>Alt+M: Toggle Music</div>
                <div>Alt+T: Toggle Theme</div>
                <div>Alt+S: Show Summary</div>
                <div>Alt+H: Highlight Text</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}