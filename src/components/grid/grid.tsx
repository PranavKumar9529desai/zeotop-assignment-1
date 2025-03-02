"use client";

import { useCallback, useRef } from "react";
import {
  type CellData,
  type SpreadsheetData,
  getCellKey,
} from "../spreadsheet/types";
import Cell from "./cell";
import { GridHeader } from "./grid-header";

interface GridProps {
  rowCount?: number;
  columnCount?: number;
  data: SpreadsheetData;
  selectedCell: { row: number; col: number } | null;
  editingCell: { row: number; col: number } | null;
  onCellSelect: (row: number, col: number) => void;
  onCellChange: (row: number, col: number, value: string) => void;
  onStartEdit: (row: number, col: number) => void;
  onStopEdit: () => void;
}

export default function Grid({
  rowCount = 100,
  columnCount = 26,
  data,
  selectedCell,
  editingCell,
  onCellSelect,
  onCellChange,
  onStartEdit,
  onStopEdit,
}: GridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleCellSelect = useCallback(
    (row: number, col: number) => {
      onCellSelect(row, col);
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

  const isRowSelected = (rowIndex: number) => selectedCell?.row === rowIndex;
  const isColSelected = (colIndex: number) => selectedCell?.col === colIndex;

  return (
    <div className="w-full h-full overflow-auto relative bg-[var(--spreadsheet-cell-bg)]" ref={gridRef}>
      <table className="border-collapse table-fixed">
        <GridHeader columnCount={columnCount} selectedColumn={selectedCell?.col} />
        <tbody>
          {Array.from({ length: rowCount }).map((_, rowIndex) => (
            <tr key={`row-${rowIndex}`} data-row={rowIndex}>
              {/* Row header */}
              <td 
                className={`spreadsheet-header left-0 z-20 w-12 h-8 flex items-center justify-center border-r border-b ${
                  isRowSelected(rowIndex) ? 'spreadsheet-header-highlight' : ''
                }`}
                role="rowheader"
                aria-rowindex={rowIndex + 1}
              >
                {rowIndex + 1}
              </td>

              {/* Row cells */}
              {Array.from({ length: columnCount }).map((_, colIndex) => (
                <Cell
                  key={`cell-${rowIndex}-${colIndex}`}
                  row={rowIndex}
                  col={colIndex}
                  data={getCellData(rowIndex, colIndex)}
                  isSelected={
                    selectedCell?.row === rowIndex &&
                    selectedCell?.col === colIndex
                  }
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
