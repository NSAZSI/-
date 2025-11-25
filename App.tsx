import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CodePanel from './components/CodePanel';
import Visualizer from './components/Visualizer';
import ControlPanel from './components/ControlPanel';
import { generateSimulationSteps } from './services/simulation';
import { SimulationStep } from './types';
import { Settings } from 'lucide-react';

const App: React.FC = () => {
  // Inputs
  const [numsInput, setNumsInput] = useState<string>("1,1,1");
  const [kInput, setKInput] = useState<number>(2);
  
  // Simulation State
  const [nums, setNums] = useState<number[]>([1, 1, 1]);
  const [k, setK] = useState<number>(2);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000); // ms per step
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Generate steps based on current nums and k
  const steps: SimulationStep[] = useMemo(() => {
    return generateSimulationSteps(nums, k);
  }, [nums, k]);

  const currentStep = steps[currentStepIndex];

  // Playback Logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speed]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const applyConfig = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedNums = numsInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));
      if (parsedNums.length === 0) throw new Error("Invalid Array");
      setNums(parsedNums);
      setK(kInput);
      handleReset();
      setIsConfigOpen(false);
    } catch (err) {
      alert("Please enter a valid comma-separated list of numbers.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Subarray Sum Equals K</h1>
            <p className="text-xs text-slate-400">Prefix Sum + HashMap Visualization</p>
          </div>
        </div>

        <button 
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sm text-slate-300 transition-colors"
        >
          <Settings size={16} />
          <span>Config</span>
        </button>
      </header>

      {/* Config Panel (Collapsible) */}
      {isConfigOpen && (
        <div className="bg-slate-900 border-b border-slate-800 p-6 animate-in slide-in-from-top-2">
          <form onSubmit={applyConfig} className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Input Array (nums)</label>
              <input 
                type="text" 
                value={numsInput} 
                onChange={(e) => setNumsInput(e.target.value)}
                placeholder="e.g. 1, 1, 1"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-full md:w-32">
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-2">Target (k)</label>
              <input 
                type="number" 
                value={kInput}
                onChange={(e) => setKInput(parseInt(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-2 rounded-lg transition-colors w-full md:w-auto"
            >
              Update
            </button>
          </form>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 p-6 overflow-hidden">
        
        {/* Left Column: Visualizer (Variables & Arrays) */}
        <section className="flex-[3] flex flex-col min-h-[500px] lg:h-full gap-4">
          {/* Explanation Box */}
          <div className="bg-slate-800/80 border border-blue-900/50 rounded-xl p-4 shadow-lg min-h-[80px] flex items-center">
            <p className="text-lg text-blue-100 font-medium leading-relaxed">
              {currentStep ? currentStep.description : "Loading..."}
            </p>
          </div>

          <div className="flex-1 bg-slate-900/50 rounded-2xl border border-slate-800 p-4 shadow-inner overflow-hidden">
            <Visualizer step={currentStep} nums={nums} k={k} />
          </div>

          <div className="mt-auto">
             <ControlPanel 
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNext={handleNext}
                onPrev={handlePrev}
                onReset={handleReset}
                progress={currentStepIndex}
                totalSteps={steps.length}
                speed={speed}
                setSpeed={setSpeed}
             />
          </div>
        </section>

        {/* Right Column: Code */}
        <section className="flex-[2] hidden lg:flex flex-col h-full min-h-[400px]">
          <CodePanel activeLine={currentStep.lineNo} />
        </section>
        
        {/* Mobile Code View Toggle (Optional, usually hidden on desktop) */}
        <section className="lg:hidden h-64">
           <CodePanel activeLine={currentStep.lineNo} />
        </section>

      </main>
    </div>
  );
};

export default App;