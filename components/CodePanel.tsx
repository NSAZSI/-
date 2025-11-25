import React, { useEffect, useRef } from 'react';
import { CODE_LINES } from '../constants';

interface CodePanelProps {
  activeLine: number;
}

const CodePanel: React.FC<CodePanelProps> = ({ activeLine }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`[data-line="${activeLine}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeLine]);

  return (
    <div className="bg-slate-900 rounded-lg shadow-lg border border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="px-4 py-2 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-300">Solution.py</span>
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar" ref={scrollRef}>
        <code className="block text-sm font-mono leading-6">
          {CODE_LINES.map((line, index) => {
            // Python code implies 0-indexed array, but typical editors are 1-indexed.
            // Our Simulation logic uses the line numbers from the string constant, 
            // assuming the first line is line 1.
            const lineNumber = index + 1;
            const isActive = lineNumber === activeLine;
            
            return (
              <div 
                key={index} 
                data-line={lineNumber}
                className={`relative pl-4 pr-2 rounded transition-colors duration-200 ${isActive ? 'bg-blue-900/40 border-l-2 border-blue-500' : 'border-l-2 border-transparent'}`}
              >
                <span className="inline-block w-8 mr-2 text-slate-600 text-xs select-none text-right">{lineNumber}</span>
                <span className={`${isActive ? 'text-blue-100 font-medium' : 'text-slate-400'}`}>
                  {line}
                </span>
              </div>
            );
          })}
        </code>
      </div>
    </div>
  );
};

export default CodePanel;