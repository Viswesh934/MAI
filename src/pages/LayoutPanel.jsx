import React, { useState } from 'react';

// Add these keyframes to your CSS or use Tailwind's animation classes
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleUp {
  from { transform: scale(0.98); }
  to { transform: scale(1); }
}

.markdown-guide {
  animation: fadeIn 0.6s ease-out;
}

.section-enter {
  animation: scaleUp 0.3s ease-out;
}

.hover-scale:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

.grid-pattern {
  background-size: 40px 40px;
  background-image: linear-gradient(to right, rgba(156, 163, 175, 0.1) 1px, transparent 1px),
                   linear-gradient(to bottom, rgba(156, 163, 175, 0.1) 1px, transparent 1px);
}
`;

export default function LayoutPanel() {
  const [expandedSection, setExpandedSection] = useState('basic');

  // Define the sections array here
  const sections = [
    {
      id: 'basic',
      title: 'Basic Formatting',
      icon: '📝',
      examples: [
        {
          syntax: '# Heading 1\n**Bold** and *italic* text',
          rendered: (
            <div>
              <h1 style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Heading 1</h1>
              <div>
                <b>Bold</b> and <i>italic</i> text
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: 'lists',
      title: 'Lists',
      icon: '📋',
      examples: [
        {
          syntax: '- Item 1\n- Item 2\n  - Subitem',
          rendered: (
            <ul>
              <li>Item 1</li>
              <li>Item 2
                <ul>
                  <li>Subitem</li>
                </ul>
              </li>
            </ul>
          ),
        },
      ],
    },
    {
      id: 'code',
      title: 'Code Blocks',
      icon: '💻',
      examples: [
        {
          syntax: '```js\nconsole.log("Hello, world!");\n```',
          rendered: (
            <pre>
              <code>console.log("Hello, world!");</code>
            </pre>
          ),
        },
      ],
    },
    {
      id: 'tables',
      title: 'Tables',
      icon: '📊',
      examples: [
        {
          syntax: `| Name  | Age |\n|-------|-----|\n| Alice |  24 |\n| Bob   |  27 |`,
          rendered: (
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Name</th>
                  <th className="border px-2 py-1">Age</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-2 py-1">Alice</td>
                  <td className="border px-2 py-1">24</td>
                </tr>
                <tr>
                  <td className="border px-2 py-1">Bob</td>
                  <td className="border px-2 py-1">27</td>
                </tr>
              </tbody>
            </table>
          ),
        },
      ],
    },
    {
      id: 'links',
      title: 'Links & Images',
      icon: '🔗',
      examples: [
        {
          syntax: '[VibeNote](https://github.com)\n\n![Logo](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)',
          rendered: (
            <div>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">VibeNote</a>
              <div className="mt-2">
                <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="Logo" style={{ width: 40, height: 40 }} />
              </div>
            </div>
          ),
        },
      ],
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <style>{styles}</style>
      <div className="markdown-guide container mx-auto p-4 max-w-3xl relative z-10">
        <div className="grid-pattern absolute inset-0 z-0 opacity-20 dark:opacity-10"></div>
        
        <div className="relative bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-2xl p-8 transform transition-all duration-300 hover:shadow-3xl">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
            ✨ Markdown Magic Guide ✨
          </h1>

          <p className="mb-6 text-gray-600 dark:text-gray-300 text-lg text-center leading-relaxed">
            Discover the art of Markdown with these interactive examples. Click to explore each category!
          </p>

          <div className="space-y-4">
            {sections.map(section => (
              <div 
                key={section.id} 
                className="section-enter border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-blue-400 hover:dark:border-purple-500 hover-scale"
              >
                <button 
                  className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 font-medium flex justify-between items-center transition-colors duration-200"
                  onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-blue-500 dark:text-purple-400 text-xl">
                      {section.icon || '📝'}
                    </span>
                    <span className="text-lg">{section.title}</span>
                  </div>
                  <span className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                    expandedSection === section.id ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </span>
                </button>
                
                {expandedSection === section.id && (
                  <div className="p-4 bg-white dark:bg-gray-800 space-y-4 animate-fade-in">
                    {section.examples.map((example, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 transition-all duration-200 hover:shadow-md hover:border-blue-200 dark:hover:border-purple-400"
                      >
                        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                            <span className="mr-2">🛠️</span>Syntax
                          </h3>
                          <pre className="mt-1 text-sm font-mono whitespace-pre-wrap bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                            {example.syntax}
                          </pre>
                        </div>
                        <div className="p-3">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                            <span className="mr-2">🎨</span>Rendered Output
                          </h3>
                          <div className="mt-2 transition-opacity duration-200">
                            {example.rendered}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl shadow-inner animate-pulse-slow">
            <h2 className="font-medium mb-3 text-lg flex items-center">
              <span className="mr-2">🚀</span>Pro Tips
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li className="transition-colors hover:text-blue-600 dark:hover:text-purple-400">Use <code className="text-sm px-1 py-0.5 rounded bg-white dark:bg-gray-800">Tab</code> key for faster indentation</li>
              <li className="transition-colors hover:text-blue-600 dark:hover:text-purple-400">Combine multiple formatting styles creatively</li>
              <li className="transition-colors hover:text-blue-600 dark:hover:text-purple-400">Use code blocks with language hints for better syntax highlighting</li>
              <li className="transition-colors hover:text-blue-600 dark:hover:text-purple-400">Leverage table generators for complex layouts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}