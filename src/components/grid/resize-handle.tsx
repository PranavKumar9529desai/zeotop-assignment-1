'use client';

import { useCallback, useRef } from 'react';

interface ResizeHandleProps {
  type: 'column' | 'row';
  index: number;
  onResize: (index: number, newSize: number) => void;
  defaultSize: number;
  minSize: number;
}

export function ResizeHandle({ type, index, onResize, defaultSize, minSize }: ResizeHandleProps) {
  const startPosRef = useRef<number>(0);
  const startSizeRef = useRef<number>(defaultSize);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      startPosRef.current = type === 'column' ? e.clientX : e.clientY;
      startSizeRef.current = defaultSize;

      const handleMouseMove = (e: MouseEvent) => {
        const currentPos = type === 'column' ? e.clientX : e.clientY;
        const diff = currentPos - startPosRef.current;
        const newSize = Math.max(startSizeRef.current + diff, minSize);
        onResize(index, newSize);
      };

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [type, index, onResize, defaultSize, minSize]
  );

  return (
    <div
      className={`absolute ${
        type === 'column'
          ? 'cursor-col-resize w-1 h-full top-0 right-0 hover:bg-blue-400'
          : 'cursor-row-resize h-1 w-full left-0 bottom-0 hover:bg-blue-400'
      } bg-transparent hover:bg-opacity-50 z-10`}
      onMouseDown={handleMouseDown}
    />
  );
}
