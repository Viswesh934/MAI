import React, { useState, useEffect } from 'react';
import { Code, Palette, Copy, Download, BarChart2, Plus, Trash2, Save, Star, Search, Terminal, Zap, Moon, Sun, X, Filter } from 'lucide-react';

// Mock SyntaxHighlighter since we don't have the actual library
const SyntaxHighlighter = ({ language, style, customStyle, showLineNumbers, children }) => {
  return (
    <pre className="p-4 rounded text-white overflow-auto" style={{ ...customStyle, backgroundColor: '#282c34' }}>
      <code>{children}</code>
    </pre>
  );
};

const defaultSnippets = [
  {
    id: 1,
    title: 'Hello World in JavaScript',
    code: 'console.log("Hello, World!");',
    language: 'javascript',
    description: 'The classic first program in JavaScript',
    favorite: true,
    tags: ['Utility', 'Demo']
  },
  {
    id: 2,
    title: 'React useState Example',
    code: 'const [count, setCount] = useState(0);\n\nreturn (\n  <button onClick={() => setCount(count + 1)}>\n    Count: {count}\n  </button>\n);',
    language: 'javascript',
    description: 'Basic counter using React hooks',
    favorite: false,
    tags: ['React', 'Demo']
  },
  {
    id: 3,
    title: 'Python List Comprehension',
    code: 'squares = [x**2 for x in range(10)]\nprint(squares)',
    language: 'python',
    description: 'Generate a list of squares using list comprehension',
    favorite: false,
    tags: ['Python', 'Demo']
  }
];

export default function CodeNotebook() {
  const [darkMode, setDarkMode] = useState(true); // Set initial dark mode to true
  const [snippets, setSnippets] = useState(defaultSnippets);
  const [activeSnippet, setActiveSnippet] = useState(snippets[0]);
  const [code, setCode] = useState(snippets[0].code);
  const [language, setLanguage] = useState(snippets[0].language);
  const [fontSize, setFontSize] = useState(14);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [description, setDescription] = useState(snippets[0].description);
  const [title, setTitle] = useState(snippets[0].title);
  const [showVisualization, setShowVisualization] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tags, setTags] = useState(['Utility', 'React', 'Demo', 'Python']);
  const [selectedTag, setSelectedTag] = useState('all');
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showTagsFilter, setShowTagsFilter] = useState(false);

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'python', name: 'Python' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
    { id: 'markdown', name: 'Markdown' }
  ];

  // Update code when active snippet changes
  useEffect(() => {
    if (activeSnippet) {
      setCode(activeSnippet.code);
      setLanguage(activeSnippet.language);
      setDescription(activeSnippet.description || '');
      setTitle(activeSnippet.title || 'Untitled Snippet');
    }
  }, [activeSnippet]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            saveSnippet();
            break;
          case 'n':
            e.preventDefault();
            createNewSnippet();
            break;
          case 'd':
            e.preventDefault();
            setDarkMode(!darkMode);
            break;
          case 'k':
            e.preventDefault();
            setShowCommandPalette(true);
            break;
        }
      } else if (e.key === 'Escape') {
        // Close command palette with Escape key
        setShowCommandPalette(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [darkMode]);

  // Filter snippets based on search, tag, and favorites
  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || snippet.tags?.map(tag => tag.toLowerCase()).includes(selectedTag.toLowerCase());
    const matchesFavorite = showFavoritesOnly ? snippet.favorite : true;
    return matchesSearch && matchesTag && matchesFavorite;
  });

  // Add tags to snippets with first letter capital
  const addTagToSnippet = (tag) => {
    // Capitalize first letter
    const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
    
    const updatedSnippets = snippets.map(snippet =>
      snippet.id === activeSnippet.id ?
      { ...snippet, tags: [...new Set([...(snippet.tags || []), capitalizedTag])] } :
      snippet
    );
    setSnippets(updatedSnippets);
  };

  // Remove tag from snippet
  const removeTagFromSnippet = (tagToRemove) => {
    const updatedSnippets = snippets.map(snippet =>
      snippet.id === activeSnippet.id ?
      { ...snippet, tags: snippet.tags.filter(tag => tag !== tagToRemove) } :
      snippet
    );
    setSnippets(updatedSnippets);
  };

  // Copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Download code file
  const downloadCode = () => {
    const fileExtension = language === 'javascript' ? 'js' :
                          language === 'python' ? 'py' :
                          language === 'html' ? 'html' :
                          language === 'css' ? 'css' : 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Create a new snippet
  const createNewSnippet = () => {
    const newSnippet = {
      id: Date.now(),
      title: 'New Snippet',
      code: '',
      language: 'javascript',
      description: '',
      favorite: false,
      tags: []
    };
    setSnippets([...snippets, newSnippet]);
    setActiveSnippet(newSnippet);
  };

  // Delete current snippet
  const deleteSnippet = (id) => {
    const updatedSnippets = snippets.filter(snippet => snippet.id !== id);
    setSnippets(updatedSnippets);
    if (activeSnippet.id === id && updatedSnippets.length > 0) {
      setActiveSnippet(updatedSnippets[0]);
    }
  };

  // Save current snippet
  const saveSnippet = () => {
    const updatedSnippets = snippets.map(snippet =>
      snippet.id === activeSnippet.id ?
      { ...snippet, code, language, description, title } :
      snippet
    );
    setSnippets(updatedSnippets);

    // Update active snippet
    setActiveSnippet({
      ...activeSnippet,
      code,
      language,
      description,
      title
    });
  };

  // Toggle favorite status
  const toggleFavorite = (id) => {
    const updatedSnippets = snippets.map(snippet =>
      snippet.id === id ?
      { ...snippet, favorite: !snippet.favorite } :
      snippet
    );
    setSnippets(updatedSnippets);

    if (activeSnippet.id === id) {
      setActiveSnippet({
        ...activeSnippet,
        favorite: !activeSnippet.favorite
      });
    }
  };

  const commands = [
    { name: 'New Snippet', action: createNewSnippet, shortcut: '⌘+N' },
    { name: 'Toggle Dark Mode', action: () => setDarkMode(!darkMode), shortcut: '⌘+D' },
    { name: 'Save Snippet', action: saveSnippet, shortcut: '⌘+S' },
    { name: 'Toggle Visualization', action: () => setShowVisualization(!showVisualization), shortcut: '⌘+V' },
  ];
  
  // Enhanced visualization
  const renderVisualization = () => (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Code Complexity</h3>
          <div className="h-32 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center text-white">
            <span className="text-2xl font-bold">3.8</span>
            <span className="ml-2">/ 10</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Language Distribution</h3>
          <div className="flex space-x-2">
            {['javascript', 'python', 'html'].map((lang) => (
              <div key={lang} className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-400"
                  style={{ width: `${Math.random() * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Command Palette */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-96 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 flex-1">
                <Search size={18} className="text-gray-500" />
                <input
                  type="text"
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent focus:outline-none"
                  autoFocus
                />
              </div>
              <button 
                onClick={() => setShowCommandPalette(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2">
              {commands.map((cmd, i) => (
                <button
                  key={i}
                  onClick={() => { cmd.action(); setShowCommandPalette(false); }}
                  className="w-full flex justify-between items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <span>{cmd.name}</span>
                  <span className="text-xs text-gray-500">{cmd.shortcut}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-500">
              Press ESC to close
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Terminal size={24} />
          <h1 className="text-xl font-bold">Dev Notebook</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-blue-700 transition-colors"
            title="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setShowCommandPalette(true)}
            className="flex items-center space-x-1 bg-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-800"
          >
            <Zap size={14} />
            <span>Commands</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Enhanced Sidebar */}
        <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2 py-1 rounded bg-gray-100 dark:bg-gray-700 focus:outline-none text-sm"
              />
              <Search size={16} className="absolute left-2 top-2 text-gray-500" />
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`px-2 py-1 rounded-full text-xs flex items-center ${
                  showFavoritesOnly 
                    ? 'bg-yellow-400 text-yellow-900' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Star size={12} className={showFavoritesOnly ? "mr-1 fill-current" : "mr-1"} />
                Favorites
              </button>
              
              <button 
                onClick={() => setShowTagsFilter(!showTagsFilter)}
                className={`px-2 py-1 rounded-full text-xs flex items-center ${
                  showTagsFilter || selectedTag !== 'all'
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                <Filter size={12} className="mr-1" />
                Tags
              </button>
            </div>

            {/* Tags Filter */}
            {showTagsFilter && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-500 flex justify-between items-center">
                  <span>Filter by Tag</span>
                  <button 
                    onClick={() => {setSelectedTag('all'); setShowTagsFilter(false);}}
                    className="text-blue-500 text-xs hover:text-blue-600"
                  >
                    Reset
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['all', ...tags].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2 py-1 rounded-full text-xs ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag === 'all' ? 'All' : tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Snippet List */}
          <div className="p-2 space-y-1">
            {filteredSnippets.length > 0 ? (
              filteredSnippets.map(snippet => (
                <div
                  key={snippet.id}
                  className={`group p-2 rounded mb-1 cursor-pointer transition-all ${
                    activeSnippet.id === snippet.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setActiveSnippet(snippet)}
                >
                  <div className="flex justify-between items-center">
                    <div className="truncate text-sm font-medium">{snippet.title}</div>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(snippet.id); }}
                      className={`${activeSnippet.id === snippet.id ? 'text-yellow-300' : snippet.favorite ? 'text-yellow-400' : 'text-gray-400'} hover:scale-110 transition-transform`}
                    >
                      {snippet.favorite ? <Star size={14} fill="currentColor" /> : <Star size={14} />}
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs opacity-75">{snippet.language}</span>
                    {snippet.tags?.length > 0 && (
                      <div className="flex space-x-1">
                        {snippet.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className={`text-xs px-1.5 py-0.5 rounded ${
                            activeSnippet.id === snippet.id 
                              ? 'bg-blue-500/30' 
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}>
                            {tag}
                          </span>
                        ))}
                        {snippet.tags?.length > 2 && (
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            activeSnippet.id === snippet.id 
                              ? 'bg-blue-500/30' 
                              : 'bg-gray-200 dark:bg-gray-600'
                          }`}>
                            +{snippet.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-500 text-sm">
                No snippets match your filters
              </div>
            )}
            
            {/* New Snippet Button */}
            <button
              onClick={createNewSnippet}
              className="w-full flex items-center justify-center space-x-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors p-2 rounded text-sm mt-2"
            >
              <Plus size={14} />
              <span>New Snippet</span>
            </button>
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Snippet Title and Actions */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-semibold bg-transparent border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={(e) => toggleFavorite(activeSnippet.id)}
                className="text-gray-400 hover:text-yellow-400"
                title="Toggle Favorite"
              >
                {activeSnippet.favorite ? <Star size={18} fill="currentColor" className="text-yellow-400" /> : <Star size={18} />}
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={saveSnippet}
                className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white transition-colors px-3 py-1 rounded text-sm"
              >
                <Save size={14} />
                <span>Save</span>
              </button>
              <button
                onClick={() => deleteSnippet(activeSnippet.id)}
                className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors px-3 py-1 rounded text-sm"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>

          {/* Enhanced Editor Section */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Enhanced Tags Section */}
            <div>
              <label className="text-sm font-medium mb-1 block">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2 border rounded p-2 bg-gray-50 dark:bg-gray-800 min-h-12">
                {activeSnippet.tags?.length > 0 ? activeSnippet.tags?.map(tag => (
                  <div
                    key={tag}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full text-xs flex items-center group"
                  >
                    <span>{tag}</span>
                    <button 
                      onClick={() => removeTagFromSnippet(tag)}
                      className="ml-1 opacity-0 group-hover:opacity-100 text-blue-400 hover:text-blue-600 dark:hover:text-blue-200"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )) : (
                  <span className="text-xs text-gray-500 flex items-center justify-center w-full">
                    No tags yet. Add some below
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      addTagToSnippet(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  className="bg-gray-100 dark:bg-gray-700 rounded text-sm p-2 focus:outline-none flex-1"
                >
                  <option value="">Add from existing tags...</option>
                  {tags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                
                <div className="relative flex-1">
                  <input
                    id="new-tag"
                    type="text"
                    placeholder="Add new tag..."
                    className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 focus:outline-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        addTagToSnippet(e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('new-tag');
                      if (input.value.trim()) {
                        addTagToSnippet(input.value.trim());
                        input.value = '';
                      }
                    }}
                    className="absolute right-2 top-2 text-gray-500 hover:text-blue-500"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Enhanced Code Area */}
            <div className="rounded-lg overflow-hidden shadow-lg">
              <div className="bg-gray-100 dark:bg-gray-700 p-2 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Code Editor</span>
                  <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {code.length} chars • {code.split('\n').length} lines
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="Editor Settings"
                  >
                    <Palette size={18} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
              <textarea
                className={`w-full h-64 p-4 font-mono focus:outline-none resize-none ${
                  darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
                }`}
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{ fontSize: `${fontSize}px` }}
                spellCheck="false"
                placeholder="// Start coding here..."
              />
            </div>

            {isSettingsOpen && (
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-2 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div>
                    <label htmlFor="fontSize" className="text-xs text-gray-600 dark:text-gray-400">Font Size</label>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setFontSize(Math.max(10, fontSize - 1))}
                        className="bg-gray-200 dark:bg-gray-600 px-2 rounded"
                      >-</button>
                      <span className="text-sm">{fontSize}px</span>
                      <button
                        onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                        className="bg-gray-200 dark:bg-gray-600 px-2 rounded"
                      >+</button>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors px-2 py-1 rounded text-sm"
                  >
                    <Copy size={14} />
                    <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={downloadCode}
                    className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors px-2 py-1 rounded text-sm"
                  >
                    <Download size={14} />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={() => setShowVisualization(!showVisualization)}
                    className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors px-2 py-1 rounded text">
                    <BarChart2 size={14} />
                    <span>Visualize</span>
                  </button>
                </div>
              </div>
            )}

            <input
              className="w-full mb-3 p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add a description or note for this code snippet (optional)..."
            />

            {showVisualization && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BarChart2 className="mr-2" />
                  Code Analysis
                </h3>
                {renderVisualization()}
              </div>
            )}

            <div className="overflow-auto rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <SyntaxHighlighter
                language={language}
                customStyle={{ fontSize: `${fontSize}px` }}
                showLineNumbers
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
