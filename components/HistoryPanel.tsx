
import React from 'react';
import { Calculation } from '../types';

interface Props {
  history: Calculation[];
  onClearHistory: () => void;
  onSelect: (item: Calculation) => void;
}

const HistoryPanel: React.FC<Props> = ({ history, onClearHistory, onSelect }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-3xl border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
          <i className="fa-solid fa-clock-rotate-left text-indigo-400 text-sm"></i>
          History
        </h2>
        {history.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center px-4">
            <i className="fa-solid fa-ghost text-4xl mb-4 opacity-20"></i>
            <p className="text-sm">No calculations yet. Start crunching some numbers!</p>
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full text-left p-3 rounded-2xl hover:bg-slate-800 transition-all group"
            >
              <div className="text-xs text-slate-500 mb-1 mono group-hover:text-slate-400">
                {item.expression}
              </div>
              <div className="text-lg text-white font-medium mono group-hover:text-indigo-400 transition-colors">
                {item.result}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
