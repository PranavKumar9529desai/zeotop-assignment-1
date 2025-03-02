'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { CellPosition, SelectionState } from './types';

interface RangeSelectorProps {
  selection: SelectionState;
  onRangeChange: (range: { start: CellPosition; end: CellPosition }) => void;
}

function getCellReference(position: CellPosition): string {
  const column = String.fromCharCode(65 + position.col);
  const row = position.row + 1;
  return `${column}${row}`;
}

function parseCellReference(ref: string): CellPosition | null {
  const match = ref.match(/^([A-Z])(\d+)$/);
  if (!match) return null;

  const col = match[1].charCodeAt(0) - 65;
  const row = Number.parseInt(match[2], 10) - 1;

  if (row < 0 || col < 0) return null;
  return { row, col };
}

export function RangeSelector({ selection, onRangeChange }: RangeSelectorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const currentRange = selection.ranges[selection.ranges.length - 1];
  const rangeText = currentRange
    ? currentRange.start.row === currentRange.end.row &&
      currentRange.start.col === currentRange.end.col
      ? getCellReference(currentRange.start)
      : `${getCellReference(currentRange.start)}:${getCellReference(currentRange.end)}`
    : '';

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = useCallback(() => {
    setIsEditing(true);
    setEditValue(rangeText);
  }, [rangeText]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const [startRef, endRef] = editValue.split(':');
        const start = parseCellReference(startRef);
        const end = parseCellReference(endRef || startRef);

        if (start && end) {
          onRangeChange({ start, end });
        }
        setIsEditing(false);
      } else if (e.key === 'Escape') {
        setIsEditing(false);
      }
    },
    [editValue, onRangeChange]
  );

  return (
    <div className="flex items-center px-2 h-8 min-w-[100px] border-r border-[var(--spreadsheet-border)] text-[var(--spreadsheet-text-primary)]">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-6 px-1 bg-white border border-blue-500 outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className="w-full text-left hover:bg-[var(--spreadsheet-hover-bg)] px-1"
        >
          {rangeText}
        </button>
      )}
    </div>
  );
}
