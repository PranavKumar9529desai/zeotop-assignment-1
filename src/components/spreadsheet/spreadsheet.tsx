"use client";

import { FormulaBar } from "@/components/formula-bar/formula-bar";
import Grid from "@/components/grid/grid";
import { Toolbar } from "@/components/toolbar/toolbar";
import { useCallback, useState } from "react";
import {
  type CellData,
  type CellPosition,
  type CellRange,
  type SelectionState,
  type SpreadsheetData,
  getCellKey,
  getDefaultCellData,
} from "./types";

export function Spreadsheet() {
  const [selection, setSelection] = useState<SelectionState>({
    ranges: [{ start: { row: 0, col: 0 }, end: { row: 0, col: 0 } }],
    activeCell: { row: 0, col: 0 }
  });
  const [editingCell, setEditingCell] = useState<CellPosition | null>(null);
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData>(
    new Map()
  );

  const getCurrentCellData = useCallback((): CellData | null => {
    if (!selection.activeCell) return null;
    return (
      spreadsheetData.get(getCellKey(selection.activeCell)) || getDefaultCellData()
    );
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
    (alignment: "left" | "center" | "right") => {
      const currentData = getCurrentCellData();
      if (!currentData) return;
      // Apply alignment to all selected cells
      updateCellData({
        styles: { ...currentData.styles, align: alignment },
      });
    },
    [getCurrentCellData, updateCellData]
  );

  const handleCellSelect = useCallback((row: number, col: number, event?: React.MouseEvent) => {
    const newCell: CellPosition = { row, col };
    
    if (!event) {
      // Handle keyboard navigation or direct selection
      setSelection({
        ranges: [{ start: newCell, end: newCell }],
        activeCell: newCell
      });
      return;
    }

    if (event.shiftKey && selection.activeCell) {
      // Extend the current selection range
      const lastRange = selection.ranges[selection.ranges.length - 1];
      const updatedRanges = [...selection.ranges.slice(0, -1), {
        start: lastRange.start,
        end: newCell
      }];
      
      setSelection({
        ranges: updatedRanges,
        activeCell: selection.activeCell
      });
    } else if ((event.metaKey || event.ctrlKey) && selection.ranges.length > 0) {
      // Add a new selection range
      setSelection({
        ranges: [...selection.ranges, { start: newCell, end: newCell }],
        activeCell: newCell
      });
    } else {
      // Start a new selection
      setSelection({
        ranges: [{ start: newCell, end: newCell }],
        activeCell: newCell
      });
    }
  }, [selection]);

  const handleStartEdit = useCallback((row: number, col: number) => {
    const cellPosition = { row, col };
    setEditingCell(cellPosition);
    setSelection({
      ranges: [{ start: cellPosition, end: cellPosition }],
      activeCell: cellPosition
    });
  }, []);

  const handleStopEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  const handleCellChange = useCallback(
    (row: number, col: number, value: string) => {
      const cellKey = getCellKey({ row, col });
      const currentData = spreadsheetData.get(cellKey) || getDefaultCellData();

      setSpreadsheetData(
        new Map(spreadsheetData).set(cellKey, {
          ...currentData,
          value,
          formula: value.startsWith("=") ? value : undefined,
        })
      );
    },
    [spreadsheetData]
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

  const currentCellData = getCurrentCellData();

  return (
    <>
      <Toolbar
        onBold={handleBold}
        onItalic={handleItalic}
        onUnderline={handleUnderline}
        onAlignLeft={() => handleAlign("left")}
        onAlignCenter={() => handleAlign("center")}
        onAlignRight={() => handleAlign("right")}
      />
      <FormulaBar
        selectedCell={selection.activeCell}
        value={currentCellData?.formula || currentCellData?.value || ""}
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
