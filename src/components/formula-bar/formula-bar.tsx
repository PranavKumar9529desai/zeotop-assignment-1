"use client";

import { RangeSelector } from "../spreadsheet/RangeSelector";
import type { CellPosition, SelectionState } from "../spreadsheet/types";

interface FormulaBarProps {
  selectedCell: { row: number; col: number } | null;
  value: string;
  onChange: (value: string) => void;
  selection: SelectionState;
  onRangeChange: (selection: SelectionState) => void;
}

const defaultSelection: SelectionState = {
  ranges: [],
  activeCell: null,
};

export function FormulaBar({
  selectedCell,
  value,
  onChange,
  selection = defaultSelection,
  onRangeChange,
}: FormulaBarProps) {
  const handleRangeChange = (range: { start: CellPosition; end: CellPosition }) => {
    onRangeChange({
      ranges: [range],
      activeCell: range.start,
    });
  };

  return (
    <div className="flex items-center h-8 border-b border-[var(--spreadsheet-border)] bg-[var(--spreadsheet-header-bg)]">
      <div className="sticky top-0 left-0 z-40 flex items-center h-8 bg-[var(--spreadsheet-header-bg)] border-b border-[var(--spreadsheet-border)]">
        <RangeSelector
          selection={selection}
          onRangeChange={handleRangeChange}
        />
      </div>
      <div className="flex items-center justify-center w-8 h-full border-x border-[var(--spreadsheet-border)] text-[var(--spreadsheet-text-primary)]">
        fx
      </div>
      <div className="flex-1 px-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={selectedCell ? "Enter a value or formula (start with = for formulas)" : ""}
          disabled={!selectedCell}
          onClick={(e) => e.currentTarget.select()}
          className="w-full h-6 px-1 bg-white outline-none text-gray-900 disabled:bg-[var(--spreadsheet-header-bg)] disabled:text-[var(--spreadsheet-text-primary)] placeholder:text-gray-500 focus:border focus:border-blue-500 rounded-sm"
        />
      </div>
    </div>
  );
}
