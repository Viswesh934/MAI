import { useEffect } from 'react';

export default function useKeyboardShortcuts({
  toggleMusic,
  toggleTheme,
  showSummary,
  setShowSummary,
  highlightText,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.altKey && e.code === 'KeyM') {
        e.preventDefault();
        toggleMusic();
      }
      if (e.altKey && e.code === 'KeyT') {
        e.preventDefault();
        toggleTheme();
      }
      if (e.altKey && e.code === 'KeyS') {
        e.preventDefault();
        setShowSummary(!showSummary);
      }
      if (e.altKey && e.code === 'KeyH') {
        e.preventDefault();
        highlightText();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleMusic, toggleTheme, showSummary, setShowSummary, highlightText]);
}