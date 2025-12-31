
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CalculatorMode, Calculation, AIResult } from './types';
import { solveMathProblem } from './services/geminiService';
import CalculatorBody from './components/CalculatorBody';
import HistoryPanel from './components/HistoryPanel';
import AIOverlay from './components/AIOverlay';

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<Calculation[]>([]);
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('nova_calc_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('nova_calc_history', JSON.stringify(history));
  }, [history]);

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleDelete = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleInput = (val: string) => {
    if (display === '0' && val !== '.') {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
  };

  const handleCalculate = () => {
    try {
      // Basic math evaluation - using a safer approach for a demo
      // In a real high-end app, we'd use a parser library like mathjs
      const sanitized = display.replace(/[^-()\d/*+.]/g, '');
      // eslint-disable-next-line no-eval
      const result = eval(sanitized).toString();
      
      const newCalc: Calculation = {
        id: Date.now().toString(),
        expression: display,
        result,
        timestamp: Date.now(),
      };

      setHistory([newCalc, ...history].slice(0, 50));
      setDisplay(result);
      setExpression(display + ' =');
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleAiSolve = async (prompt: string) => {
    setIsAiLoading(true);
    setAiResult(null);
    try {
      const res = await solveMathProblem(prompt);
      setAiResult(res);
      // Also add to history
      const newCalc: Calculation = {
        id: Date.now().toString(),
        expression: prompt,
        result: res.answer,
        timestamp: Date.now(),
      };
      setHistory([newCalc, ...history].slice(0, 50));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center p-4 md:p-8 bg-slate-950 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full"></div>

      <div className="z-10 w-full max-w-5xl h-full flex flex-col md:flex-row gap-6 items-stretch">
        
        {/* Left Side: Main Calculator */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              NovaCalc <span className="text-xs font-medium uppercase tracking-widest text-slate-500 ml-1">Pro</span>
            </h1>
            <div className="flex gap-2 p-1 glass rounded-lg">
              <button 
                onClick={() => setMode('standard')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${mode === 'standard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Standard
              </button>
              <button 
                onClick={() => setMode('scientific')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${mode === 'scientific' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Scientific
              </button>
              <button 
                onClick={() => setMode('ai')}
                className={`px-3 py-1 text-sm rounded-md transition-all ${mode === 'ai' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <i className="fa-solid fa-sparkles mr-1 text-yellow-400"></i> AI
              </button>
            </div>
          </div>

          <div className="flex-1 glass rounded-3xl p-6 shadow-2xl flex flex-col min-h-[500px]">
            {mode === 'ai' ? (
              <AIOverlay 
                onSolve={handleAiSolve} 
                isLoading={isAiLoading} 
                result={aiResult} 
              />
            ) : (
              <CalculatorBody 
                display={display}
                expression={expression}
                mode={mode}
                onInput={handleInput}
                onCalculate={handleCalculate}
                onClear={handleClear}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>

        {/* Right Side: History (Visible on desktop) */}
        <div className="hidden lg:block w-80">
          <HistoryPanel 
            history={history} 
            onClearHistory={() => setHistory([])}
            onSelect={(item) => {
              setDisplay(item.result);
              setExpression(item.expression + ' =');
            }}
          />
        </div>

        {/* Mobile History Toggle */}
        <button 
          onClick={() => setShowHistory(true)}
          className="lg:hidden fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white text-xl z-20"
        >
          <i className="fa-solid fa-clock-rotate-left"></i>
        </button>

        {/* Mobile History Drawer */}
        {showHistory && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
            <div className="w-4/5 h-full bg-slate-900 border-l border-slate-700 p-6 relative">
              <button 
                onClick={() => setShowHistory(false)}
                className="absolute top-6 right-6 text-slate-400 text-2xl"
              >
                <i className="fa-solid fa-times"></i>
              </button>
              <HistoryPanel 
                history={history} 
                onClearHistory={() => setHistory([])}
                onSelect={(item) => {
                  setDisplay(item.result);
                  setExpression(item.expression + ' =');
                  setShowHistory(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
