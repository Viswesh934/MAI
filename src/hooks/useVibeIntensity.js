import { useEffect, useRef } from 'react';

export default function useVibeIntensity(markdown, setVibeIntensity, setKeyPressInterval) {
  const lastEditTime = useRef(Date.now());
  const editHistory = useRef([]);

  useEffect(() => {
    const now = Date.now();
    const interval = now - lastEditTime.current;
    lastEditTime.current = now;
    editHistory.current.push(interval);
    if (editHistory.current.length > 10) editHistory.current.shift();

    const avgInterval =
      editHistory.current.reduce((a, b) => a + b, 0) / editHistory.current.length;
    setKeyPressInterval(avgInterval);

    // Example: faster typing = higher intensity
    const intensity = Math.max(0, Math.min(1, (1500 - avgInterval) / 1500));
    setVibeIntensity(intensity);
    // eslint-disable-next-line
  }, [markdown]);
}