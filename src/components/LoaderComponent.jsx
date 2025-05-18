import React from 'react';
import { PenTool, Check, X } from 'lucide-react';

// Custom animated pen loader component
const PenLoader = ({ isLoading }) => {
  const [rotation, setRotation] = React.useState(0);
  
  React.useEffect(() => {
    let animationFrame;
    const animate = () => {
      setRotation(prev => (prev + 1) % 360);
      animationFrame = requestAnimationFrame(animate);
    };
    if (isLoading) {
      animationFrame = requestAnimationFrame(animate);
    }
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [isLoading]);
  
  if (!isLoading) return null;
  
  return (
    <div className="flex items-center justify-center w-full h-full absolute top-0 left-0 bg-white/80 dark:bg-gray-900/80 z-50">
      <div className="flex flex-col items-center">
        <div 
          className="relative p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg mb-4"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <PenTool size={32} className="text-indigo-600 dark:text-indigo-400" />
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent"></div>
        </div>
        <div className="text-indigo-600 dark:text-indigo-400 font-medium animate-pulse">
          Loading VibeNote...
        </div>
      </div>
    </div>
  );
};

// Tutorial step component
const TutorialStep = ({ number, title, description, isActive, onComplete, onSkip, status, position }) => {
  return (
    <div className={`
      fixed z-40 rounded-lg shadow-xl p-4 bg-white dark:bg-gray-800 w-64 border-2
      ${isActive ? 'border-indigo-500' : 'border-transparent opacity-0 pointer-events-none'}
    `} style={position}>
      <div className="flex justify-between items-center mb-2">
        <div className="bg-indigo-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
          {number}
        </div>
        <div className="flex space-x-1">
          {/* Show status icon if not pending */}
          {status === 'completed' && (
            <span className="text-green-500"><Check size={18} /></span>
          )}
          {status === 'skipped' && (
            <span className="text-red-500"><X size={18} /></span>
          )}
          {/* Show buttons only if pending and active */}
          {status === 'pending' && isActive && (
            <>
              <button 
                onClick={onComplete} 
                className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-600"
              >
                <Check size={18} />
              </button>
              <button 
                onClick={onSkip} 
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
              >
                <X size={18} />
              </button>
            </>
          )}
        </div>
      </div>
      <h3 className="font-bold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
};

// Main component that receives props from MarkdownEditor
export default function LoaderAndTutorial({
  isLoading,
  showTutorial,
  tutorialSteps,
  currentStep,
  stepStatus,
  onComplete,
  onSkip
}) {
  // Use the props passed from the parent component
  return (
    <>
      <PenLoader isLoading={isLoading} />
      
      {showTutorial && tutorialSteps.map((step, index) => (
        <TutorialStep
          key={index}
          number={index + 1}
          title={step.title}
          description={step.description}
          isActive={currentStep === index}
          onComplete={onComplete}
          onSkip={onSkip}
          status={stepStatus[index]}
          position={step.position}
        />
      ))}
      
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-20 dark:bg-opacity-40 z-30"></div>
      )}
    </>
  );
}