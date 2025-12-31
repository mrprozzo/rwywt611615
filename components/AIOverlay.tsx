
import React, { useState } from 'react';
import { AIResult } from '../types';

interface Props {
  onSolve: (prompt: string) => void;
  isLoading: boolean;
  result: AIResult | null;
}

const AIOverlay: React.FC<Props> = ({ onSolve, isLoading, result }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSolve(prompt);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex-none">
        <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
          <i className="fa-solid fa-sparkles text-yellow-400"></i>
          AI Math Assistant
        </h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          Ask complex questions like "What is the compound interest of $5000 at 5% over 10 years?" or solve word problems.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex-none flex gap-2">
        <input 
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
        />
        <button 
          disabled={isLoading || !prompt.trim()}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg"
        >
          {isLoading ? (
            <i className="fa-solid fa-circle-notch fa-spin"></i>
          ) : (
            <i className="fa-solid fa-paper-plane"></i>
          )}
        </button>
      </form>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
              <i className="fa-solid fa-robot absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-500"></i>
            </div>
            <p className="text-slate-400 text-sm animate-pulse">Analyzing problem...</p>
          </div>
        ) : result ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Answer Card */}
            <div className="p-5 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 mb-2 block">Final Answer</span>
              <div className="text-3xl font-bold text-white mono">
                {result.answer}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-yellow-500"></i>
                Logic & Principles
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                {result.explanation}
              </p>
            </div>

            {/* Steps */}
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                <i className="fa-solid fa-list-check text-indigo-400"></i>
                Step-by-step Solution
              </h3>
              <div className="space-y-3">
                {result.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-3 bg-slate-800/30 rounded-xl border border-slate-700/50">
                    <span className="flex-none w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-slate-400 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center px-8">
            <i className="fa-solid fa-wand-magic-sparkles text-5xl mb-4 opacity-20"></i>
            <p className="text-sm">Enter a problem above and Nova AI will solve it with complete breakdowns.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIOverlay;
