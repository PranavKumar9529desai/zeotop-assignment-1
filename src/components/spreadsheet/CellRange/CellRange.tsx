'use client';

import type { CellRange as CellRangeType } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

interface CellRangeProps {
  onRangeSelect: (range: CellRangeType) => void;
}

export function CellRange({ onRangeSelect }: CellRangeProps) {
  const [selecting, setSelecting] = useState(false);
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null);
  const [currentRange, setCurrentRange] = useState<CellRangeType | null>(null);

  // Add effect to handle global mouse up
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (selecting) {
        setSelecting(false);
        if (currentRange) {
          onRangeSelect(currentRange);
        }
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [selecting, currentRange, onRangeSelect]);

  const handleMouseDown = useCallback((row: number, col: number, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent text selection
    setSelecting(true);
    setStartCell({ row, col });
    setCurrentRange({
      start: { row, col },
      end: { row, col },
    });
  }, []);

  const handleMouseMove = useCallback(
    (row: number, col: number, e: React.MouseEvent) => {
      e.preventDefault(); // Prevent text selection
      if (!selecting || !startCell) return;

      const newRange = {
        start: {
          row: Math.min(startCell.row, row),
          col: Math.min(startCell.col, col),
        },
        end: {
          row: Math.max(startCell.row, row),
          col: Math.max(startCell.col, col),
        },
      };

      setCurrentRange(newRange);
    },
    [selecting, startCell]
  );

  const handleMouseUp = useCallback(() => {
    if (selecting && currentRange) {
      setSelecting(false);
      onRangeSelect(currentRange);
    }
  }, [selecting, currentRange, onRangeSelect]);

  const getCellId = (row: number, col: number) => `cell-${row}-${col}`;

  return (
    <div className="relative select-none" onMouseLeave={handleMouseUp} onMouseUp={handleMouseUp}>
      <div className="grid grid-cols-10 gap-px bg-gray-200">
        {Array.from({ length: 10 }, (_, row) => (
          <div key={`row-${row}`} className="contents">
            {Array.from({ length: 10 }, (_, col) => (
              <div
                key={getCellId(row, col)}
                id={getCellId(row, col)}
                className={`w-20 h-8 flex items-center justify-center bg-white cursor-cell
                  ${
                    currentRange &&
                    row >= currentRange.start.row &&
                    row <= currentRange.end.row &&
                    col >= currentRange.start.col &&
                    col <= currentRange.end.col
                      ? 'bg-blue-100 border border-blue-400'
                      : 'border border-gray-200'
                  }`}
                onMouseDown={(e) => handleMouseDown(row, col, e)}
                onMouseMove={(e) => handleMouseMove(row, col, e)}
                onMouseUp={handleMouseUp}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
