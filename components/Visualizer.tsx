import React from 'react';
import { SimulationStep } from '../types';
import { Hash, Calculator, Target, List as ListIcon } from 'lucide-react';

interface VisualizerProps {
  step: SimulationStep;
  nums: number[];
  k: number;
}

const Visualizer: React.FC<VisualizerProps> = ({ step, nums, k }) => {
  const { variables, mapState, highlightMapKey } = step;

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
      
      {/* 1. Array Visualization */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
        <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-4 font-bold flex items-center gap-2">
           <ListIcon size={16} /> Input Array (nums)
        </h3>
        <div className="flex flex-wrap gap-3 items-center justify-center py-4">
          {nums.map((val, idx) => {
            const isCurrent = idx === variables.currentIndex;
            return (
              <div key={idx} className="relative group">
                {/* Index Label */}
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx}
                </span>
                
                {/* Number Box */}
                <div 
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-lg text-lg font-bold shadow-md transition-all duration-300 border-2
                    ${isCurrent 
                      ? 'bg-blue-600 border-blue-400 text-white scale-110 shadow-blue-500/30' 
                      : 'bg-slate-700 border-slate-600 text-slate-300'
                    }
                  `}
                >
                  {val}
                </div>

                {/* Arrow Pointer */}
                {isCurrent && (
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-blue-400"></div>
                    <span className="text-[10px] text-blue-400 font-bold uppercase mt-0.5">Curr</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Variables Panel (Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* K */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10"><Target size={40} /></div>
            <span className="text-xs text-slate-400 font-mono block mb-1">Target Sum (k)</span>
            <span className="text-2xl font-bold text-white">{k}</span>
        </div>

        {/* Pre */}
        <div className={`bg-slate-800 rounded-lg p-4 border relative overflow-hidden transition-colors duration-500 ${step.lineNo === 16 ? 'border-yellow-500 bg-yellow-900/10' : 'border-slate-700'}`}>
            <div className="absolute top-0 right-0 p-2 opacity-10"><Calculator size={40} /></div>
            <span className="text-xs text-slate-400 font-mono block mb-1">Prefix Sum (pre)</span>
            <span className={`text-2xl font-bold transition-all duration-300 ${step.lineNo === 16 ? 'text-yellow-400' : 'text-blue-300'}`}>
              {variables.pre}
            </span>
        </div>

        {/* Target Check */}
        <div className={`bg-slate-800 rounded-lg p-4 border relative overflow-hidden transition-colors duration-500 ${step.lineNo === 19 ? 'border-purple-500 bg-purple-900/10' : 'border-slate-700'}`}>
            <div className="absolute top-0 right-0 p-2 opacity-10"><Hash size={40} /></div>
            <span className="text-xs text-slate-400 font-mono block mb-1">Needed (pre - k)</span>
            <span className="text-2xl font-bold text-purple-300">
              {variables.target !== null ? variables.target : '-'}
            </span>
        </div>

        {/* Count */}
        <div className={`bg-slate-800 rounded-lg p-4 border relative overflow-hidden transition-colors duration-500 ${step.foundMatch ? 'border-green-500 bg-green-900/20' : 'border-slate-700'}`}>
            <div className="absolute top-0 right-0 p-2 opacity-10 text-green-500"><Target size={40} /></div>
            <span className="text-xs text-slate-400 font-mono block mb-1">Result (count)</span>
            <span className={`text-2xl font-bold transition-all duration-300 ${step.foundMatch ? 'text-green-400 scale-110' : 'text-white'}`}>
              {variables.count}
            </span>
        </div>
      </div>

      {/* 3. HashMap Visualization */}
      <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700 flex-1">
         <h3 className="text-sm uppercase tracking-wider text-slate-400 mb-4 font-bold flex items-center justify-between">
           <div className="flex items-center gap-2"><Hash size={16} /> Prefix Sum Map</div>
           <span className="text-[10px] normal-case bg-slate-700 px-2 py-0.5 rounded text-slate-300">Target found: add value to count</span>
         </h3>
         
         <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {Object.entries(mapState).map(([keyStr, val]) => {
              const key = parseInt(keyStr);
              // Check if this specific key is being interacted with
              const isTarget = highlightMapKey === key;
              const isFoundMatch = isTarget && step.foundMatch;
              
              return (
                <div 
                  key={key} 
                  className={`
                    flex flex-col items-center rounded-lg p-2 border-2 transition-all duration-500
                    ${isFoundMatch 
                      ? 'bg-green-900/30 border-green-500 scale-110 shadow-lg shadow-green-900/50' 
                      : isTarget 
                        ? 'bg-purple-900/30 border-purple-400 scale-105'
                        : 'bg-slate-700/50 border-slate-600'
                    }
                  `}
                >
                  <span className="text-[10px] uppercase text-slate-500 font-mono mb-1">Sum</span>
                  <span className={`text-lg font-bold font-mono ${isTarget ? 'text-white' : 'text-slate-300'}`}>{key}</span>
                  <div className="w-full h-px bg-slate-600/50 my-1"></div>
                  <span className="text-[10px] uppercase text-slate-500 font-mono">Count</span>
                  <span className={`font-medium ${isFoundMatch ? 'text-green-400' : 'text-slate-400'}`}>{val}</span>
                </div>
              );
            })}
         </div>
         {Object.keys(mapState).length === 0 && (
           <div className="text-slate-500 text-sm text-center py-8 italic">Map is empty</div>
         )}
      </div>

    </div>
  );
};

export default Visualizer;