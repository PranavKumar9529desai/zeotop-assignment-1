'use client';

interface GridHeaderProps {
  columnCount: number;
  selectedColumn: number | null;
  onColumnSelect: (colIndex: number, event?: React.MouseEvent) => void;
  isColumnSelected: (colIndex: number) => boolean;
}

export function GridHeader({ columnCount, selectedColumn, onColumnSelect, isColumnSelected }: GridHeaderProps) {
  const handleColumnHeaderKeyDown = (colIndex: number, event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onColumnSelect(colIndex);
    }
  };

  const getHeaderHighlightClass = (isSelected: boolean, isActive: boolean) =>
    isActive ? "spreadsheet-header-active" : isSelected ? "spreadsheet-header-highlight" : "";

  return (
    <thead>
      <tr>
        {/* Corner cell */}
        <th className="spreadsheet-header sticky top-0 left-0 z-30 w-12 h-8 border-r border-b" />
        
        {/* Column headers */}
        {Array.from({ length: columnCount }, (_, index) => {
          const columnLetter = String.fromCharCode(65 + index);
          const isActive = selectedColumn === index;
          const isSelected = isColumnSelected(index);
          
          return (
            <th
              key={`col-${columnLetter}`}
              className={`spreadsheet-header sticky top-0 z-20 w-24 h-8 border-r border-b p-0 ${getHeaderHighlightClass(isSelected, isActive)}`}
            >
              <button
                type="button"
                className={`w-full h-full flex items-center justify-center cursor-pointer ${getHeaderHighlightClass(isSelected, isActive)}`}
                onClick={(e) => onColumnSelect(index, e)}
                onKeyDown={(e) => handleColumnHeaderKeyDown(index, e)}
                aria-label={`Column ${columnLetter}`}
              >
                {columnLetter}
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
} 