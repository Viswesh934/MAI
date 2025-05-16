import React from 'react';

/**
 * Simple animated wave visualization based on vibeIntensity.
 * @param {number} vibeIntensity - 0 to 1
 * @returns {JSX.Element}
 */
export default function waveVisualization(vibeIntensity = 0.5) {
  // Number of bars and their heights based on intensity
  const bars = 12;
  const maxHeight = 24;
  const minHeight = 6;
  const heights = Array.from({ length: bars }, (_, i) => {
    // Create a wave pattern
    const phase = (i / bars) * Math.PI * 2;
    return (
      minHeight +
      (Math.sin(phase + Date.now() / 300) * 0.5 + 0.5) *
        (maxHeight - minHeight) *
        vibeIntensity
    );
  });

  return (
    <div className="flex items-end space-x-0.5 h-6">
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: `${h}px`,
            background:
              vibeIntensity > 0.5
                ? 'linear-gradient(to top, #6366f1, #a21caf)'
                : '#cbd5e1',
            borderRadius: 2,
            transition: 'height 0.2s',
          }}
        />
      ))}
    </div>
  );
}