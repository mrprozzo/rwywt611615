
export interface Calculation {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type CalculatorMode = 'standard' | 'scientific' | 'ai';

export interface AIResult {
  answer: string;
  steps: string[];
  explanation: string;
}
