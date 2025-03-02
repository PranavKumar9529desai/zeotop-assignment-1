'use client';

interface FormulaBarProps {
  selectedCell: { row: number; col: number } | null;
  value: string;
  onChange: (value: string) => void;
}

export function FormulaBar({ selectedCell, value, onChange }: FormulaBarProps) {
  const getCellReference = () => {
    if (!selectedCell) return '';
    const colLabel = String.fromCharCode(65 + selectedCell.col);
    return `${colLabel}${selectedCell.row + 1}`;
  };

  return (
    <div className="flex items-center h-8 border-b border-gray-300 bg-white px-2">
      <div className="flex items-center space-x-2">
        <div className="text-[var(--spreadsheet-text-secondary)] font-medium w-8">fx</div>
        <div className="bg-gray-100 px-2 py-1 rounded text-sm text-[var(--spreadsheet-text-primary)]">
          {getCellReference()}
        </div>
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 ml-2 outline-none text-[var(--spreadsheet-text-input)]"
        placeholder="Enter a value or formula"
      />
    </div>
  );
} 