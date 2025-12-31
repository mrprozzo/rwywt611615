
import React, { useEffect } from 'react';
import { CalculatorMode } from '../types';

interface Props {
  display: string;
  expression: string;
  mode: CalculatorMode;
  onInput: (val: string) => void;
  onCalculate: () => void;
  onClear: () => void;
  onDelete: () => void;
}

const CalculatorBody: React.FC<Props> = ({ 
  display, expression, mode, onInput, onCalculate, onClear, onDelete 
}) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') onInput(e.key);
      if (['+', '-', '*', '/'].includes(e.key)) onInput(e.key);
      if (e.key === '.') onInput('.');
      if (e.key === 'Enter') onCalculate();
      if (e.key === 'Escape') onClear();
      if (e.key === 'Backspace') onDelete();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInput, onCalculate, onClear, onDelete]);

  const Button = ({ label, onClick, className = '', variant = 'normal' }: any) => {
    let baseStyles = "calc-button h-16 rounded-2xl flex items-center justify-center text-xl font-medium transition-all";
    let colorStyles = "bg-slate-800/50 hover:bg-slate-700 text-white";
    
    if (variant === 'operator') colorStyles = "bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-400";
    if (variant === 'action') colorStyles = "bg-slate-700/50 hover:bg-slate-600 text-slate-300";
    if (variant === 'equals') colorStyles = "bg-indigo-600 hover:bg-indigo-500 text-white col-span-1 shadow-lg shadow-indigo-500/20";
    if (variant === 'clear') colorStyles = "bg-rose-500/20 hover:bg-rose-500/30 text-rose-400";

    return (
      <button onClick={onClick} className={`${baseStyles} ${colorStyles} ${className}`}>
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Display Area */}
      <div className="flex-none mb-8 text-right overflow-hidden">
        <div className="h-6 text-slate-500 mono text-sm mb-1 truncate">
          {expression}
        </div>
        <div className="text-5xl font-light text-white mono truncate">
          {display}
        </div>
      </div>

      {/* Grid Area */}
      <div className="grid grid-cols-4 gap-3 flex-1">
        {/* Row 1 */}
        <Button label="AC" onClick={onClear} variant="clear" />
        <Button label={<i className="fa-solid fa-delete-left"></i>} onClick={onDelete} variant="action" />
        <Button label="(" onClick={() => onInput('(')} variant="action" />
        <Button label=")" onClick={() => onInput(')')} variant="action" />

        {/* Scientific Row (Conditional) */}
        {mode === 'scientific' && (
          <>
            <Button label="sin" onClick={() => onInput('sin(')} variant="action" />
            <Button label="cos" onClick={() => onInput('cos(')} variant="action" />
            <Button label="tan" onClick={() => onInput('tan(')} variant="action" />
            <Button label="log" onClick={() => onInput('log(')} variant="action" />
          </>
        )}

        {/* Row 2 */}
        <Button label="7" onClick={() => onInput('7')} />
        <Button label="8" onClick={() => onInput('8')} />
        <Button label="9" onClick={() => onInput('9')} />
        <Button label="/" onClick={() => onInput('/')} variant="operator" />

        {/* Row 3 */}
        <Button label="4" onClick={() => onInput('4')} />
        <Button label="5" onClick={() => onInput('5')} />
        <Button label="6" onClick={() => onInput('6')} />
        <Button label="*" onClick={() => onInput('*')} variant="operator" />

        {/* Row 4 */}
        <Button label="1" onClick={() => onInput('1')} />
        <Button label="2" onClick={() => onInput('2')} />
        <Button label="3" onClick={() => onInput('3')} />
        <Button label="-" onClick={() => onInput('-')} variant="operator" />

        {/* Row 5 */}
        <Button label="0" onClick={() => onInput('0')} />
        <Button label="." onClick={() => onInput('.')} />
        <Button label="=" onClick={onCalculate} variant="equals" />
        <Button label="+" onClick={() => onInput('+')} variant="operator" />
      </div>
    </div>
  );
};

export default CalculatorBody;
