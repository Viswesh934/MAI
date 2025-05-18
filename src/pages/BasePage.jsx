import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import EditorPanel from './EditorPanel';
import VibePanel from '../components/VibePanel';
import PreviewPanel from '../components/PreviewPanel';
import StatusBar from '../components/StatusBar';
import CodePanel from './CodePanel';
import LayoutPanel from './LayoutPanel';
import LoaderAndTutorial from '../components/LoaderComponent';
import renderMarkdown from '../utils/renderMarkdown';
import waveVisualization from '../utils/waveVisualization';
import * as Tone from 'tone';
import _ from 'lodash';
import { fetchGeminiSummary } from '../services/docsummary';

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("# Welcome to VibeNote\n\nStart writing your *markdown* here!\n\n## Features\n\n- **Live Preview**: See your changes instantly\n- **Syntax Highlighting**: Makes your code look great\n- **Live Vibing**: Dynamic background that reacts to your writing pace\n- **Match Vibe**: Music that adapts to your writing style\n- **Summary Dropdown**: Press Alt+S to see a summary of your document\n- **Download**: Save your document as PDF or Markdown\n\n```javascript\n// Sample code\nfunction hello() {\n  console.log('Hello world!');\n}\n```\n\nTry typing quickly to increase the music tempo and intensity!");
  const [theme, setTheme] = useState('light');
  const [vibeIntensity, setVibeIntensity] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryInput, setSummaryInput] = useState('');
  const [selectedSection, setSelectedSection] = useState("editor");
  const [highlightedText, setHighlightedText] = useState("");
  const [isProcessingDownload, setIsProcessingDownload] = useState(false);
  const lastEditTime = useRef(Date.now());
  const editHistory = useRef([]);
  const previewRef = useRef(null);

  // New state for code and layout panels
  const [code, setCode] = useState('// Write your code here...');
  const [layout, setLayout] = useState('vertical');

  // Music vibe state
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [musicMode, setMusicMode] = useState('ambient'); // ambient, focus, energetic
  const [lastNotes, setLastNotes] = useState([]);
  const [keyPressInterval, setKeyPressInterval] = useState(500); // ms between keypresses
  const synthRef = useRef(null);
  const effectsRef = useRef({});
  const sequencerRef = useRef(null);

  // Add loading state for the application
  const [appIsInitializing, setAppIsInitializing] = useState(true);

  // Tutorial state
  const tutorialSteps = [
    {
      title: "Welcome to VibeNote!",
      description: "Get ready to enhance your writing experience with music and vibes.",
      position: { top: '30%', left: '50%', transform: 'translate(-50%, -50%)' }
    },
    {
      title: "Write with Vibes",
      description: "Your background changes based on your typing speed and rhythm.",
      position: { top: '40%', left: '30%', transform: 'translate(-50%, -50%)' }
    },
    {
      title: "Enable Music",
      description: "Press Alt+M to toggle music that matches your writing pace.",
      position: { top: '10%', right: '20%', transform: 'translate(0, 0)' }
    },
    {
      title: "Markdown Preview",
      description: "See your formatted text in real-time as you type.",
      position: { top: '40%', right: '20%', transform: 'translate(0, 0)' }
    },
    {
      title: "Quick Summary",
      description: "Press Alt+S to generate a summary of your document.",
      position: { top: '20%', left: '20%', transform: 'translate(0, 0)' }
    }
  ];

  const [showTutorial, setShowTutorial] = useState(() => {
  // Only show if not completed before
  return !localStorage.getItem('vibenote_tutorial_complete');
});
  const [tutorialCurrentStep, setTutorialCurrentStep] = useState(0);
  const [tutorialStepStatus, setTutorialStepStatus] = useState(
    Array(tutorialSteps.length).fill('pending')
  );

  // Initialize Tone.js
  useEffect(() => {
    synthRef.current = new Tone.PolySynth().toDestination();

    // Add effects
    effectsRef.current.reverb = new Tone.Reverb(3).toDestination();
    effectsRef.current.delay = new Tone.FeedbackDelay("8n", 0.3).toDestination();
    effectsRef.current.chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination();

    // Chain effects
    synthRef.current.connect(effectsRef.current.reverb);
    synthRef.current.connect(effectsRef.current.delay);
    synthRef.current.volume.value = Tone.gainToDb(volume);

    // Simulate app initialization time
    const initTimer = setTimeout(() => {
      setAppIsInitializing(false);
    }, 2500);

    // Clean up
    return () => {
      clearTimeout(initTimer);
      if (synthRef.current) synthRef.current.dispose();
      if (sequencerRef.current) sequencerRef.current.dispose();
      Object.values(effectsRef.current).forEach(effect => {
        if (effect) effect.dispose();
      });
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.volume.value = Tone.gainToDb(volume);
    }
  }, [volume]);

  // Update key press intervals for rhythm detection
  useEffect(() => {
    const keypressIntervals = [];
    if (editHistory.current.length > 1) {
      for (let i = 1; i < editHistory.current.length; i++) {
        const interval = editHistory.current[i].time - editHistory.current[i-1].time;
        if (interval < 2000) {
          keypressIntervals.push(interval);
        }
      }
    }
    if (keypressIntervals.length > 3) {
      const avgInterval = _.mean(keypressIntervals);
      setKeyPressInterval(avgInterval);
    }
  }, [markdown]);

  // Generate notes based on the text content and typing speed
  const generateNotes = (text, typingSpeed) => {
    const scales = {
      ambient: ['A3', 'C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'],
      focus: ['D3', 'F3', 'G3', 'A3', 'C4', 'D4', 'F4', 'G4', 'A4'],
      energetic: ['E3', 'G3', 'A3', 'B3', 'D4', 'E4', 'G4', 'A4', 'B4']
    };
    const currentScale = scales[musicMode];
    const chars = text.slice(-10);
    const notes = [];
    for (let i = 0; i < Math.min(3, chars.length); i++) {
      const charCode = chars.charCodeAt(chars.length - 1 - i);
      const noteIndex = charCode % currentScale.length;
      notes.push(currentScale[noteIndex]);
    }
    return notes;
  };

  // Play notes based on typing
  const playNotes = (notes) => {
    if (!musicEnabled || !synthRef.current) return;
    synthRef.current.releaseAll();
    const adjustedVolume = Math.min(0.7, volume * (vibeIntensity + 0.3));
    synthRef.current.volume.value = Tone.gainToDb(adjustedVolume);
    const noteDuration = Math.max(0.2, Math.min(1.5, keyPressInterval / 500));
    if (notes.length > 0) {
      synthRef.current.triggerAttackRelease(notes, noteDuration);
    }
    setLastNotes(notes);
  };

  // Update vibe intensity based on typing speed
  useEffect(() => {
    const now = Date.now();
    const timeDiff = now - lastEditTime.current;
    if (timeDiff < 1000) {
      setVibeIntensity(Math.min(vibeIntensity + 0.2, 1));
    } else {
      setVibeIntensity(Math.max(vibeIntensity - 0.1, 0));
    }
    lastEditTime.current = now;
    editHistory.current.push({
      time: now,
      content: markdown
    });
    if (editHistory.current.length > 50) {
      editHistory.current.shift();
    }
    if (musicEnabled) {
      const notes = generateNotes(markdown, vibeIntensity);
      playNotes(notes);
    }
  }, [markdown, vibeIntensity, musicEnabled, musicMode, volume, keyPressInterval]);

  // Toggle music on/off
  const toggleMusic = async () => {
    if (!musicEnabled) {
      await Tone.start();
      setMusicEnabled(true);
    } else {
      if (synthRef.current) synthRef.current.releaseAll();
      setMusicEnabled(false);
    }
  };

  // Download markdown only
  const downloadMarkdownFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vibenote-document.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // FIXED: Improved generateSummary function 
  const generateSummary = async () => {
    if (!markdown || markdown.trim().length < 10) {
      setSummary("Text is too short to summarize.");
      setSummaryLoading(false);
      return;
    }
    
    try {
      setSummaryLoading(true);
      const result = await fetchGeminiSummary(markdown);
      console.log('Summary result:', result);
      setSummary(result);
      console.log('Summary generated:', result);
    } catch (err) {
      console.error('Summary generation failed:', err);
      setSummary('Failed to generate summary: ' + err.message);
    } finally {
      setSummaryLoading(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        setShowSummary(true);
        // Use the dedicated function to generate summary
        generateSummary();
      }
      if (e.altKey && e.key === 't') {
        e.preventDefault();
        setTheme(theme === 'light' ? 'dark' : 'light');
      }
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        const selection = window.getSelection().toString();
        if (selection) {
          setHighlightedText(selection);
        }
      }
      if (e.altKey && e.key === 'm') {
        e.preventDefault();
        toggleMusic();
      }
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        downloadMarkdownFile();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, markdown, musicEnabled]);

  // Apply theme to HTML document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Tutorial handlers
  const handleTutorialComplete = () => {
    setTutorialStepStatus(prev => {
      const updated = [...prev];
      updated[tutorialCurrentStep] = 'completed';
      return updated;
    });
    if (tutorialCurrentStep < tutorialSteps.length - 1) {
      setTutorialCurrentStep(tutorialCurrentStep + 1);
    } else {
      setShowTutorial(false);
      localStorage.setItem('vibenote_tutorial_complete', 'true');
    }
  };

  const handleTutorialSkip = () => {
    setTutorialStepStatus(prev => {
      const updated = [...prev];
      updated[tutorialCurrentStep] = 'skipped';
      return updated;
    });
    if (tutorialCurrentStep < tutorialSteps.length - 1) {
      setTutorialCurrentStep(tutorialCurrentStep + 1);
    } else {
      setShowTutorial(false);
      localStorage.setItem('vibenote_tutorial_complete', 'true');
    }
  };

  const parallaxStyle = {
    backgroundPosition: `${vibeIntensity * 5}% ${vibeIntensity * 10}%`,
    transition: 'background-position 0.5s ease-out'
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Loader and Tutorial */}
      <LoaderAndTutorial
        isLoading={appIsInitializing}
        showTutorial={showTutorial}
        tutorialSteps={tutorialSteps}
        currentStep={tutorialCurrentStep}
        stepStatus={tutorialStepStatus}
        onComplete={handleTutorialComplete}
        onSkip={handleTutorialSkip}
      />

      <Navbar
        theme={theme}
        setTheme={setTheme}
        toggleMusic={toggleMusic}
        musicEnabled={musicEnabled}
        setShowSummary={setShowSummary}
        onSummaryClick={generateSummary}
        setSummary={setSummary}
        vibeIntensity={vibeIntensity}
        downloadMarkdown={downloadMarkdownFile}
        isProcessingDownload={isProcessingDownload}
        selectedSection={selectedSection}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
          theme={theme}
        />
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden" style={parallaxStyle}>
            {selectedSection === 'vibe' && (
              <VibePanel
                musicEnabled={musicEnabled}
                toggleMusic={toggleMusic}
                volume={volume}
                setVolume={setVolume}
                musicMode={musicMode}
                setMusicMode={setMusicMode}
                vibeIntensity={vibeIntensity}
                keyPressInterval={keyPressInterval}
                waveVisualization={() => waveVisualization(vibeIntensity)}
                theme={theme}
              />
            )}
            {selectedSection === 'editor' && (
              <EditorPanel
                markdown={markdown}
                setMarkdown={setMarkdown}
                vibeIntensity={vibeIntensity}
                darkMode={theme === 'dark'}
              />
            )}
            {selectedSection === 'code' && (
              <CodePanel
                code={code}
                setCode={setCode}
                theme={theme}
              />
            )}
            {selectedSection === 'Markdown guide' && (
              <LayoutPanel
                layout={layout}
                setLayout={setLayout}
                theme={theme}
              />
            )}
          </div>
          {/* Only show PreviewPanel for the editor section */}
          {selectedSection === 'editor' && (
            <PreviewPanel
              markdown={markdown}
              renderMarkdown={renderMarkdown}
              showSummary={showSummary}
              setShowSummary={setShowSummary}
              summary={summary}
              highlightedText={highlightedText}
              setHighlightedText={setHighlightedText}
              musicEnabled={musicEnabled}
              vibeIntensity={vibeIntensity}
              waveVisualization={() => waveVisualization(vibeIntensity)}
              theme={theme}
              ref={previewRef}
            />
          )}
        </div>
      </div>
      {/* FIXED: Improved summary modal with proper styling and better error handling */}
      {showSummary && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Document Summary</h3>
              <button
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-xl"
                onClick={() => setShowSummary(false)}
              >
                ×
              </button>
            </div>
            
            {summaryLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="w-6 h-6 border-2 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
                <span className="ml-2">Generating summary...</span>
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                {summary ? (
                  <p className="text-gray-700 dark:text-gray-300">{summary}</p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No summary available.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <StatusBar
        markdown={markdown}
        musicEnabled={musicEnabled}
        musicMode={musicMode}
        theme={theme}
      />
    </div>
  );
}