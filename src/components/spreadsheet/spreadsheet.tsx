'use client';

import { DataQualityToolbar } from '@/components/data-quality/DataQualityToolbar';
import { FormulaBar } from '@/components/formula-bar/formula-bar';
import Grid from '@/components/grid/grid';
import { Toolbar } from '@/components/toolbar/toolbar';
import {
  calculateAverage,
  calculateCount,
  calculateMax,
  calculateMin,
  calculateSum,
} from '@/lib/actions/mathOperations';
import type { GridData } from '@/lib/data-quality';
import { useCallback, useState } from 'react';
import {
  type CellData,
  type CellPosition,
  type CellRange,
  type CellValue,
  type SelectionState,
  type SpreadsheetData,
  getCellKey,
  getDefaultCellData,
} from './types';

// Helper function to parse cell references (e.g., "A1" to {row: 0, col: 0})
const parseCellReference = (ref: string) => {
  const match = ref.match(/([A-Z]+)(\d+)/);
  if (!match) return null;

  const col = match[1].split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;
  const row = Number.parseInt(match[2], 10) - 1;
  return { row, col };
};

// Helper function to parse range (e.g., "A1:B3")
const parseRange = (range: string): CellRange | null => {
  const [start, end] = range.split(':');
  if (!start || !end) return null;

  const startPos = parseCellReference(start);
  const endPos = parseCellReference(end);
  if (!startPos || !endPos) return null;

  return { start: startPos, end: endPos };
};

export function Spreadsheet() {
  const [selection, setSelection] = useState<SelectionState>({
    ranges: [{ start: { row: 0, col: 0 }, end: { row: 0, col: 0 } }],
    activeCell: { row: 0, col: 0 },
  });
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData>(new Map());

  const getCurrentCellData = useCallback((): CellData | null => {
    if (!selection.activeCell) return null;
    return spreadsheetData.get(getCellKey(selection.activeCell)) || getDefaultCellData();
  }, [selection.activeCell, spreadsheetData]);

  const updateCellData = useCallback(
    (newData: Partial<CellData>) => {
      if (!selection.activeCell) return;

      // Create a new Map to store the updated data
      const newSpreadsheetData = new Map(spreadsheetData);

      // Apply the style changes to all selected cells
      for (const range of selection.ranges) {
        const minRow = Math.min(range.start.row, range.end.row);
        const maxRow = Math.max(range.start.row, range.end.row);
        const minCol = Math.min(range.start.col, range.end.col);
        const maxCol = Math.max(range.start.col, range.end.col);

        // Iterate through all cells in the range
        for (let row = minRow; row <= maxRow; row++) {
          for (let col = minCol; col <= maxCol; col++) {
            const cellKey = getCellKey({ row, col });
            const currentData = spreadsheetData.get(cellKey) || getDefaultCellData();
            const updatedData = { ...currentData, ...newData };
            newSpreadsheetData.set(cellKey, updatedData);
          }
        }
      }

      setSpreadsheetData(newSpreadsheetData);
    },
    [selection.ranges, selection.activeCell, spreadsheetData]
  );

  const handleBold = useCallback(() => {
    const currentData = getCurrentCellData();
    if (!currentData) return;
    // Toggle bold for all selected cells
    updateCellData({
      styles: { ...currentData.styles, bold: !currentData.styles.bold },
    });
  }, [getCurrentCellData, updateCellData]);

  const handleItalic = useCallback(() => {
    const currentData = getCurrentCellData();
    if (!currentData) return;
    // Toggle italic for all selected cells
    updateCellData({
      styles: { ...currentData.styles, italic: !currentData.styles.italic },
    });
  }, [getCurrentCellData, updateCellData]);

  const handleUnderline = useCallback(() => {
    const currentData = getCurrentCellData();
    if (!currentData) return;
    // Toggle underline for all selected cells
    updateCellData({
      styles: {
        ...currentData.styles,
        underline: !currentData.styles.underline,
      },
    });
  }, [getCurrentCellData, updateCellData]);

  const handleAlign = useCallback(
    (alignment: 'left' | 'center' | 'right') => {
      const currentData = getCurrentCellData();
      if (!currentData) return;
      // Apply alignment to all selected cells
      updateCellData({
        styles: { ...currentData.styles, align: alignment },
      });
    },
    [getCurrentCellData, updateCellData]
  );

  const handleCellSelect = useCallback(
    (row: number, col: number, event?: React.MouseEvent) => {
      const newCell: CellPosition = { row, col };

      if (!event) {
        // Handle keyboard navigation or direct selection
        setSelection({
          ranges: [{ start: newCell, end: newCell }],
          activeCell: newCell,
        });
        return;
      }

      if (event.shiftKey && selection.activeCell) {
        // Extend the current selection range
        const lastRange = selection.ranges[selection.ranges.length - 1];
        const updatedRanges = [
          ...selection.ranges.slice(0, -1),
          {
            start: lastRange.start,
            end: newCell,
          },
        ];

        setSelection({
          ranges: updatedRanges,
          activeCell: selection.activeCell,
        });
      } else if ((event.metaKey || event.ctrlKey) && selection.ranges.length > 0) {
        // Add a new selection range
        setSelection({
          ranges: [...selection.ranges, { start: newCell, end: newCell }],
          activeCell: newCell,
        });
      } else {
        // Start a new selection
        setSelection({
          ranges: [{ start: newCell, end: newCell }],
          activeCell: newCell,
        });
      }
    },
    [selection]
  );

  const handleStartEdit = useCallback((row: number, col: number) => {
    const cellPosition = { row, col };
    setEditingCell(cellPosition);
    setSelection({
      ranges: [{ start: cellPosition, end: cellPosition }],
      activeCell: cellPosition,
    });
  }, []);

  const handleStopEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  const evaluateFormula = useCallback(
    async (formula: string): Promise<string> => {
      // Remove the leading '=' and any whitespace
      const expression = formula.slice(1).trim().toUpperCase();

      // Match function pattern: FUNCTION(range)
      const match = expression.match(/^(SUM|AVERAGE|MAX|MIN|COUNT)\((.*)\)$/);
      if (!match) return '#SYNTAX_ERROR';

      const [, func, rangeStr] = match as [
        string,
        'SUM' | 'AVERAGE' | 'MAX' | 'MIN' | 'COUNT',
        string,
      ];
      const range = parseRange(rangeStr);
      if (!range) return '#RANGE_ERROR';

      // Convert spreadsheetData to 2D array format required by math operations
      const maxRow = Math.max(
        ...Array.from(spreadsheetData.keys()).map((key) => Number.parseInt(key.split('-')[0], 10))
      );
      const maxCol = Math.max(
        ...Array.from(spreadsheetData.keys()).map((key) => Number.parseInt(key.split('-')[1], 10))
      );

      const values: CellValue[][] = Array(maxRow + 1)
        .fill(null)
        .map(() =>
          Array(maxCol + 1)
            .fill(null)
            .map(() => ({ raw: '' }))
        );

      // Fill the values array with actual data
      for (const [key, value] of spreadsheetData.entries()) {
        const [row, col] = key.split('-').map((n) => Number.parseInt(n, 10));
        values[row][col] = {
          raw: value.value,
          computed: Number.parseFloat(value.value) || undefined,
        };
      }

      try {
        let result: { error?: { type: string }; value?: number | string | null };
        switch (func) {
          case 'SUM':
            result = await calculateSum(range, values);
            break;
          case 'AVERAGE':
            result = await calculateAverage(range, values);
            break;
          case 'MAX':
            result = await calculateMax(range, values);
            break;
          case 'MIN':
            result = await calculateMin(range, values);
            break;
          case 'COUNT':
            result = await calculateCount(range, values);
            break;
          default:
            return '#FUNCTION_ERROR';
        }

        if (result.error) {
          return `#${result.error.type}`;
        }
        return result.value?.toString() || '#VALUE_ERROR';
      } catch {
        return '#ERROR';
      }
    },
    [spreadsheetData]
  );

  const handleCellChange = useCallback(
    async (row: number, col: number, value: string) => {
      const cellKey = getCellKey({ row, col });
      const currentData = spreadsheetData.get(cellKey) || getDefaultCellData();

      if (value.startsWith('=')) {
        // Handle formula
        const result = await evaluateFormula(value);
        setSpreadsheetData(
          new Map(spreadsheetData).set(cellKey, {
            ...currentData,
            value: result,
            formula: value,
          })
        );
      } else {
        // Handle regular value
        setSpreadsheetData(
          new Map(spreadsheetData).set(cellKey, {
            ...currentData,
            value,
            formula: undefined,
          })
        );
      }
    },
    [spreadsheetData, evaluateFormula]
  );

  const handleFormulaChange = useCallback(
    (value: string) => {
      if (!selection.activeCell) return;
      handleCellChange(selection.activeCell.row, selection.activeCell.col, value);
    },
    [selection.activeCell, handleCellChange]
  );

  const handleFormulaRangeChange = useCallback((selection: SelectionState) => {
    setSelection(selection);
  }, []);

  // Convert spreadsheetData to GridData format for DataQualityToolbar
  const getGridData = useCallback((): GridData => {
    if (spreadsheetData.size === 0) {
      return [[null]]; // Return a minimal grid for empty spreadsheet
    }

    const keys = Array.from(spreadsheetData.keys());
    const rows = keys.map((key) => Number.parseInt(key.split('-')[0], 10));
    const cols = keys.map((key) => Number.parseInt(key.split('-')[1], 10));

    const maxRow = Math.max(...rows, 0);
    const maxCol = Math.max(...cols, 0);

    // Ensure we have at least one cell
    const gridData: GridData = Array(Math.max(maxRow + 1, 1))
      .fill(null)
      .map(() => Array(Math.max(maxCol + 1, 1)).fill(null));

    for (const [key, data] of spreadsheetData.entries()) {
      const [row, col] = key.split('-').map((n) => Number.parseInt(n, 10));
      if (row >= 0 && col >= 0 && row < gridData.length && col < gridData[0].length) {
        gridData[row][col] = data.value || null;
      }
    }

    return gridData;
  }, [spreadsheetData]);

  // Handle data changes from DataQualityToolbar
  const handleDataQualityChange = useCallback(
    (newGridData: GridData) => {
      if (!newGridData || !Array.isArray(newGridData) || newGridData.length === 0) {
        console.error('Invalid grid data received');
        return;
      }

      const newSpreadsheetData = new Map(spreadsheetData);

      newGridData.forEach((row: (string | number | boolean | null)[], rowIndex: number) => {
        if (!Array.isArray(row)) return;

        row.forEach((value: string | number | boolean | null, colIndex: number) => {
          const cellKey = getCellKey({ row: rowIndex, col: colIndex });
          const currentData = spreadsheetData.get(cellKey) || getDefaultCellData();
          newSpreadsheetData.set(cellKey, {
            ...currentData,
            value: value?.toString() || '',
            formula: undefined,
          });
        });
      });

      setSpreadsheetData(newSpreadsheetData);
    },
    [spreadsheetData]
  );

  // Get the full range that encompasses all selected ranges
  const getEffectiveRange = useCallback(() => {
    if (selection.ranges.length === 0) {
      return {
        startRow: 0,
        endRow: 0,
        startCol: 0,
        endCol: 0,
      };
    }

    let minRow = Number.POSITIVE_INFINITY;
    let maxRow = Number.NEGATIVE_INFINITY;
    let minCol = Number.POSITIVE_INFINITY;
    let maxCol = Number.NEGATIVE_INFINITY;

    for (const range of selection.ranges) {
      minRow = Math.min(minRow, range.start.row, range.end.row);
      maxRow = Math.max(maxRow, range.start.row, range.end.row);
      minCol = Math.min(minCol, range.start.col, range.end.col);
      maxCol = Math.max(maxCol, range.start.col, range.end.col);
    }

    return {
      startRow: minRow,
      endRow: maxRow,
      startCol: minCol,
      endCol: maxCol,
    };
  }, [selection.ranges]);

  const currentCellData = getCurrentCellData();

  return (
    <>
      <Toolbar
        onBold={handleBold}
        onItalic={handleItalic}
        onUnderline={handleUnderline}
        onAlignLeft={() => handleAlign('left')}
        onAlignCenter={() => handleAlign('center')}
        onAlignRight={() => handleAlign('right')}
      />
      <DataQualityToolbar
        data={getGridData()}
        selectedRange={getEffectiveRange()}
        onDataChange={handleDataQualityChange}
      />
      <FormulaBar
        selectedCell={selection.activeCell}
        value={currentCellData?.formula || currentCellData?.value || ''}
        onChange={handleFormulaChange}
        selection={selection}
        onRangeChange={handleFormulaRangeChange}
      />
      <div className="flex-1 overflow-hidden">
        <Grid
          data={spreadsheetData}
          selection={selection}
          setSelection={setSelection}
          editingCell={editingCell}
          onCellSelect={handleCellSelect}
          onCellChange={handleCellChange}
          onStartEdit={handleStartEdit}
          onStopEdit={handleStopEdit}
        />
      </div>
    </>
  );
}
