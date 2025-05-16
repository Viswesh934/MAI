import React, { forwardRef } from 'react';

const PreviewPanel = forwardRef(({
  markdown,
  renderMarkdown,
  showSummary,
  setShowSummary,
  summary,
  highlightedText,
  setHighlightedText,
  musicEnabled,
  vibeIntensity,
  waveVisualization,
  theme
}, ref) => {
  // Class for light/dark theme
  const themeClasses = theme === 'dark' 
    ? 'bg-gray-800 text-gray-100' 
    : 'bg-white text-gray-900';
  
  // Highlight text if needed
  const highlightMarkdown = (content) => {
    if (!highlightedText || !content) return content;
    const regex = new RegExp(`(${highlightedText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return content.replace(regex, '<mark>$1</mark>');
  };

  const renderedHTML = markdown ? renderMarkdown(markdown) : '';
  const highlightedHTML = highlightedText ? highlightMarkdown(renderedHTML) : renderedHTML;
  
  return (
    <div className={`w-full md:w-1/2 overflow-auto p-4 border-l border-gray-200 dark:border-gray-700 ${themeClasses}`} ref={ref}>
      {/* Summary panel */}
      {showSummary && (
        <div className={`mb-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold">Document Summary</h3>
            <button 
              onClick={() => setShowSummary(false)}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
          <p>{summary}</p>
        </div>
      )}
      
      {/* Markdown preview */}
      <div 
        className="markdown-preview prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: highlightedHTML }}
      ></div>
      
      {/* Music visualization effect */}
      {musicEnabled && (
        <div className="fixed bottom-0 right-0 w-full h-1">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-70"
            style={{ 
              width: `${vibeIntensity * 100}%`,
              transition: 'width 0.5s ease-out'
            }}
          ></div>
        </div>
      )}
    </div>
  );
});

PreviewPanel.displayName = 'PreviewPanel';

export default PreviewPanel;