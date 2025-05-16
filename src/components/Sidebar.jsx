import React from 'react';
import { FileText, Code, Layout, Music } from 'lucide-react';

export default function Sidebar({ selectedSection, setSelectedSection }) {
  return (
    <aside className="w-16 bg-gray-50 dark:bg-gray-800 flex flex-col items-center py-4 border-r border-gray-200 dark:border-gray-700">
      <button
        className={`p-3 rounded-lg mb-4 ${
          selectedSection === 'editor'
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        onClick={() => setSelectedSection('editor')}
        title="Editor"
      >
        <FileText className="w-6 h-6" />
      </button>
      <button
        className={`p-3 rounded-lg mb-4 ${
          selectedSection === 'code'
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        onClick={() => setSelectedSection('code')}
        title="Code"
      >
        <Code className="w-6 h-6" />
      </button>
      <button
        className={`p-3 rounded-lg mb-4 ${
          selectedSection === 'Markdown guide'
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        onClick={() => setSelectedSection('Markdown guide')}
        title="Markdown guide"
      >
        <Layout className="w-6 h-6" />
      </button>
      <button
        className={`p-3 rounded-lg mb-4 ${
          selectedSection === 'vibe'
            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        onClick={() => setSelectedSection('vibe')}
        title="Vibe"
      >
        <Music className="w-6 h-6" />
      </button>
    </aside>
  );
}