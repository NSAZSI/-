import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  progress: number;
  totalSteps: number;
  speed: number;
  setSpeed: (val: number) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  progress,
  totalSteps,
  speed,
  setSpeed,
}) => {
  return (
    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={onPrev}
          disabled={progress === 0}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30"
          title="Previous Step"
        >
          <SkipBack size={20} />
        </button>
        <button
          onClick={onPlayPause}
          className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-900/20 transition-all active:scale-95"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>
        <button
          onClick={onNext}
          disabled={progress >= totalSteps - 1}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30"
          title="Next Step"
        >
          <SkipForward size={20} />
        </button>
      </div>

      <div className="flex flex-col w-full sm:w-1/3 gap-1">
        <div className="flex justify-between text-xs text-slate-400 font-mono">
          <span>Progress</span>
          <span>{progress} / {totalSteps - 1}</span>
        </div>
        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-500 h-full transition-all duration-300 ease-out"
            style={{ width: `${(progress / Math.max(1, totalSteps - 1)) * 100}%` }}
          />
        </div>
      </div>
      
       <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span>Speed:</span>
          <input 
            type="range" 
            min="500" 
            max="2000" 
            step="100"
            className="accent-blue-500 h-1.5 w-24 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            value={2500 - speed}
            onChange={(e) => setSpeed(2500 - parseInt(e.target.value))} 
          />
       </div>
    </div>
  );
};

export default ControlPanel;