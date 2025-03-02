'use server';

import type { CalculationResult, CellRange, CellValue } from '../types';

const validateRange = (range: CellRange, values: CellValue[][]): CalculationResult => {
  if (!values[range.start.row] || !values[range.end.row]) {
    return {
      value: null,
      error: {
        type: 'RANGE_ERROR',
        message: 'Invalid range: Row out of bounds',
      },
      numericValues: [],
    };
  }

  const numericValues: number[] = [];
  for (let i = range.start.row; i <= range.end.row; i++) {
    for (let j = range.start.col; j <= range.end.col; j++) {
      const value = values[i]?.[j]?.computed;
      if (typeof value === 'number') {
        numericValues.push(value);
      }
    }
  }

  return { value: null, numericValues };
};

export async function calculateSum(
  range: CellRange,
  values: CellValue[][]
): Promise<CalculationResult> {
  const validation = validateRange(range, values);
  if (validation.error) return validation;

  const sum = (validation.numericValues || []).reduce((acc, val) => acc + val, 0);
  return { value: sum };
}

export async function calculateAverage(
  range: CellRange,
  values: CellValue[][]
): Promise<CalculationResult> {
  const validation = validateRange(range, values);
  if (validation.error) return validation;

  const numericValues = validation.numericValues || [];
  if (numericValues.length === 0) {
    return {
      value: null,
      error: {
        type: 'VALUE_ERROR',
        message: 'No numeric values in range',
      },
    };
  }

  const sum = numericValues.reduce((acc, val) => acc + val, 0);
  return { value: sum / numericValues.length };
}

export async function calculateMax(
  range: CellRange,
  values: CellValue[][]
): Promise<CalculationResult> {
  const validation = validateRange(range, values);
  if (validation.error) return validation;

  const numericValues = validation.numericValues || [];
  if (numericValues.length === 0) {
    return {
      value: null,
      error: {
        type: 'VALUE_ERROR',
        message: 'No numeric values in range',
      },
    };
  }

  return { value: Math.max(...numericValues) };
}

export async function calculateMin(
  range: CellRange,
  values: CellValue[][]
): Promise<CalculationResult> {
  const validation = validateRange(range, values);
  if (validation.error) return validation;

  const numericValues = validation.numericValues || [];
  if (numericValues.length === 0) {
    return {
      value: null,
      error: {
        type: 'VALUE_ERROR',
        message: 'No numeric values in range',
      },
    };
  }

  return { value: Math.min(...numericValues) };
}

export async function calculateCount(
  range: CellRange,
  values: CellValue[][]
): Promise<CalculationResult> {
  const validation = validateRange(range, values);
  if (validation.error) return validation;

  const numericValues = validation.numericValues || [];
  return { value: numericValues.length };
}
