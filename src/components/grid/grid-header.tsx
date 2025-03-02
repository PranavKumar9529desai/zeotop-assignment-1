'use client';

interface GridHeaderProps {
  columnCount: number;
  selectedColumn: number | null;
}

export function GridHeader({ columnCount, selectedColumn }: GridHeaderProps) {
  const getColumnLabel = (index: number): string => {
    let label = '';
    let num = index;
    
    while (num >= 0) {
      label = String.fromCharCode(65 + (num % 26)) + label;
      num = Math.floor(num / 26) - 1;
    }
    
    return label;
  };

  return (
    <thead>
      <tr>
        {/* Corner cell */}
        <th 
          className="spreadsheet-header top-0 left-0 z-30 w-12 h-8 border-r border-b"
          scope="col"
        />
        
        {/* Column headers */}
        {Array.from({ length: columnCount }).map((_, index) => {
          const columnLabel = getColumnLabel(index);
          return (
            <th
              key={columnLabel}
              className={`spreadsheet-header top-0 z-20 w-24 h-8 border-r border-b text-center ${
                selectedColumn === index ? 'spreadsheet-header-highlight' : ''
              }`}
              scope="col"
              aria-colindex={index + 1}
            >
              {columnLabel}
            </th>
          );
        })}
      </tr>
    </thead>
  );
} 