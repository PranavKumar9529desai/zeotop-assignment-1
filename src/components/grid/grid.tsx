"use client";

import { useCallback, useRef } from "react";
import { RangeSelector } from "../spreadsheet/RangeSelector";
import {
  type CellData,
  type CellPosition,
  type SelectionState,
  type SpreadsheetData,
  getCellKey,
  isCellSelected,
} from "../spreadsheet/types";
import Cell from "./cell";
import { GridHeader } from "./grid-header";

interface GridProps {
  rowCount?: number;
  columnCount?: number;
  data: SpreadsheetData;
  selection: SelectionState;
  setSelection: (selection: SelectionState) => void;
  editingCell: CellPosition | null;
  onCellSelect: (row: number, col: number, event?: React.MouseEvent) => void;
  onCellChange: (row: number, col: number, value: string) => void;
  onStartEdit: (row: number, col: number) => void;
  onStopEdit: () => void;
}

export default function Grid({
  rowCount = 100,
  columnCount = 26,
  data,
  selection,
  setSelection,
  editingCell,
  onCellSelect,
  onCellChange,
  onStartEdit,
  onStopEdit,
}: GridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCellSelect = useCallback(
    (row: number, col: number, event?: React.MouseEvent) => {
      onCellSelect(row, col, event);
    },
    [onCellSelect]
  );

  const getCellData = (row: number, col: number): CellData => {
    return (
      data.get(getCellKey({ row, col })) || {
        value: "",
        styles: { align: "left" },
      }
    );
  };

  const isRowSelected = (rowIndex: number) =>
    selection.ranges.some((range) => {
      const minRow = Math.min(range.start.row, range.end.row);
      const maxRow = Math.max(range.start.row, range.end.row);
      return rowIndex >= minRow && rowIndex <= maxRow;
    });

  const isColSelected = (colIndex: number) =>
    selection.ranges.some((range) => {
      const minCol = Math.min(range.start.col, range.end.col);
      const maxCol = Math.max(range.start.col, range.end.col);
      return colIndex >= minCol && colIndex <= maxCol;
    });

  const getHeaderHighlightClass = (isSelected: boolean, isActive: boolean) =>
    isActive
      ? "spreadsheet-header-active"
      : isSelected
      ? "spreadsheet-header-highlight"
      : "";

  const handleRowHeaderSelect = useCallback(
    (rowIndex: number, event?: React.MouseEvent) => {
      const range = {
        start: { row: rowIndex, col: 0 },
        end: { row: rowIndex, col: columnCount - 1 },
      };

      if (event?.shiftKey && selection.activeCell) {
        const lastRange = selection.ranges[selection.ranges.length - 1];
        const updatedRanges = [
          ...selection.ranges.slice(0, -1),
          {
            start: lastRange.start,
            end: range.end,
          },
        ];

        setSelection({
          ranges: updatedRanges,
          activeCell: selection.activeCell,
        });
      } else if (
        (event?.metaKey || event?.ctrlKey) &&
        selection.ranges.length > 0
      ) {
        setSelection({
          ranges: [...selection.ranges, range],
          activeCell: range.start,
        });
      } else {
        setSelection({
          ranges: [range],
          activeCell: range.start,
        });
      }
    },
    [selection, columnCount, setSelection]
  );

  const handleColumnHeaderSelect = useCallback(
    (colIndex: number, event?: React.MouseEvent) => {
      const range = {
        start: { row: 0, col: colIndex },
        end: { row: rowCount - 1, col: colIndex },
      };

      if (event?.shiftKey && selection.activeCell) {
        const lastRange = selection.ranges[selection.ranges.length - 1];
        const updatedRanges = [
          ...selection.ranges.slice(0, -1),
          {
            start: lastRange.start,
            end: range.end,
          },
        ];

        setSelection({
          ranges: updatedRanges,
          activeCell: selection.activeCell,
        });
      } else if (
        (event?.metaKey || event?.ctrlKey) &&
        selection.ranges.length > 0
      ) {
        setSelection({
          ranges: [...selection.ranges, range],
          activeCell: range.start,
        });
      } else {
        setSelection({
          ranges: [range],
          activeCell: range.start,
        });
      }
    },
    [selection, rowCount, setSelection]
  );

  const handleRowHeaderKeyDown = useCallback(
    (rowIndex: number, event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleRowHeaderSelect(rowIndex);
      }
    },
    [handleRowHeaderSelect]
  );

  

  return (
    <div
      className="w-full h-full overflow-auto relative bg-[var(--spreadsheet-cell-bg)]"
      ref={gridRef}
    >
      
      <table className="border-collapse table-fixed">
        <GridHeader
          columnCount={columnCount}
          selectedColumn={selection.activeCell?.col ?? null}
          onColumnSelect={handleColumnHeaderSelect}
          isColumnSelected={isColSelected}
        />
        <tbody>
          {Array.from({ length: rowCount }, (_, rowIndex) => (
            <tr key={`row-${rowIndex}`} data-row={rowIndex}>
              {/* Row header */}
              <th
                scope="row"
                className={`spreadsheet-header left-0 z-20 w-12 h-8 border-r border-b p-0 ${getHeaderHighlightClass(
                  isRowSelected(rowIndex),
                  rowIndex === selection.activeCell?.row
                )}`}
              >
                <button
                  type="button"
                  className={`w-full h-full flex items-center justify-center cursor-pointer ${getHeaderHighlightClass(
                    isRowSelected(rowIndex),
                    rowIndex === selection.activeCell?.row
                  )}`}
                  onClick={(e) => handleRowHeaderSelect(rowIndex, e)}
                  onKeyDown={(e) => handleRowHeaderKeyDown(rowIndex, e)}
                  aria-label={`Row ${rowIndex + 1}`}
                >
                  {rowIndex + 1}
                </button>
              </th>

              {/* Row cells */}
              {Array.from({ length: columnCount }, (_, colIndex) => (
                <Cell
                  key={`cell-${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  data={getCellData(rowIndex, colIndex)}
                  isSelected={isCellSelected(
                    { row: rowIndex, col: colIndex },
                    selection
                  )}
                  isEditing={
                    editingCell?.row === rowIndex &&
                    editingCell?.col === colIndex
                  }
                  onSelect={handleCellSelect}
                  onChange={(value) => onCellChange(rowIndex, colIndex, value)}
                  onStartEdit={() => onStartEdit(rowIndex, colIndex)}
                  onStopEdit={onStopEdit}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
