'use client';

import { useEffect, useRef, useState } from 'react';
import type { CellData } from '../spreadsheet/types';

interface CellProps {
  row: number;
  col: number;
  isSelected: boolean;
  data: CellData;
  onSelect: (row: number, col: number, event?: React.MouseEvent) => void;
  onChange: (value: string) => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
  width: number;
}

export default function Cell({
  row,
  col,
  isSelected,
  data,
  onSelect,
  onChange,
  isEditing,
  onStartEdit,
  onStopEdit,
  width,
}: CellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [localValue, setLocalValue] = useState(() => data.formula || data.value || '');
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    setLocalValue(data.formula || data.value || '');
  }, [data.formula, data.value]);

  useEffect(() => {
    if (isSelected && isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Debounce the actual state update
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = (event: React.MouseEvent) => {
    onSelect(row, col, event);
  };

  const handleDoubleClick = () => {
    onStartEdit();
  };

  const handleBlur = () => {
    onStopEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (isEditing) {
        onStopEdit();
      } else {
        onStartEdit();
      }
      e.preventDefault();
    } else if (e.key === 'Escape' && isEditing) {
      onStopEdit();
    } else if (!isEditing) {
      // Navigation when not editing
      const moveAmount = e.shiftKey ? 5 : 1; // Move 5 cells at a time with Shift

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (row >= moveAmount) {
            onSelect(row - moveAmount, col);
          } else {
            onSelect(0, col); // Move to first row
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          onSelect(row + moveAmount, col);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (col >= moveAmount) {
            onSelect(row, col - moveAmount);
          } else {
            onSelect(row, 0); // Move to first column
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          onSelect(row, col + moveAmount);
          break;
        case 'Home':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            onSelect(0, 0); // Move to first cell
          } else {
            onSelect(row, 0); // Move to start of row
          }
          break;
        case 'End':
          e.preventDefault();
          if (e.ctrlKey || e.metaKey) {
            onSelect(99, 25); // Move to last cell (assuming 100 rows, 26 columns)
          } else {
            onSelect(row, 25); // Move to end of row
          }
          break;
        case 'PageUp':
          e.preventDefault();
          if (row >= 10) {
            onSelect(row - 10, col);
          } else {
            onSelect(0, col);
          }
          break;
        case 'PageDown':
          e.preventDefault();
          onSelect(row + 10, col);
          break;
      }
    }
  };

  const getCellStyles = (styles: CellData['styles']): string => {
    const classNames = [
      'w-full h-full px-1 overflow-hidden text-sm leading-8 text-[var(--spreadsheet-text-primary)]',
    ];

    if (styles.bold) classNames.push('font-bold');
    if (styles.italic) classNames.push('italic');
    if (styles.underline) classNames.push('underline');

    switch (styles.align) {
      case 'center':
        classNames.push('text-center');
        break;
      case 'right':
        classNames.push('text-right');
        break;
      default:
        classNames.push('text-left');
    }

    return classNames.join(' ');
  };

  return (
    <td
      ref={cellRef}
      className={`spreadsheet-cell border-r border-b relative p-0 ${
        isSelected ? 'spreadsheet-selected' : ''
      }`}
      style={{ width }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      aria-selected={isSelected}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 w-full h-full px-1 border-2 border-blue-500 outline-none text-[var(--spreadsheet-text-input)]"
        />
      ) : (
        <div className={getCellStyles(data.styles)}>{data.value}</div>
      )}
    </td>
  );
}
