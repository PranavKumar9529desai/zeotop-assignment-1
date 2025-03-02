export type CellRange = {
  start: { row: number; col: number };
  end: { row: number; col: number };
};

export type CellValue = {
  raw: string;
  computed?: number;
  formula?: string;
};

export type MathOperation = 'SUM' | 'AVERAGE' | 'MAX' | 'MIN' | 'COUNT';

export type FormulaError = {
  message: string;
  type: 'RANGE_ERROR' | 'VALUE_ERROR' | 'SYNTAX_ERROR';
};

export type CalculationError = {
  type: 'RANGE_ERROR' | 'VALUE_ERROR' | 'FORMULA_ERROR';
  message: string;
};

export type CalculationResult = {
  value: number | null;
  error?: CalculationError;
  numericValues?: number[];
};
