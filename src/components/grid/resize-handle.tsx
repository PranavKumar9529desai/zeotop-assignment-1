'use client';

import { useCallback, useRef, useState } from 'react';

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
  const [isResizing, setIsResizing] = useState(false);
  const [guidePosition, setGuidePosition] = useState<number>(0);
  const handleRef = useRef<HTMLDivElement>(null);
  const pendingSizeRef = useRef<number>(defaultSize);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!handleRef.current) return;

      // Get the handle's position for accurate initial positioning
      const rect = handleRef.current.getBoundingClientRect();
      const handlePosition = type === 'column' ? rect.right : rect.bottom;
      const mousePosition = type === 'column' ? e.clientX : e.clientY;

      setIsResizing(true);
      startPosRef.current = mousePosition;
      startSizeRef.current = defaultSize;
      pendingSizeRef.current = defaultSize;
      setGuidePosition(handlePosition); // Use handle position for initial guide position

      const handleMouseMove = (e: MouseEvent) => {
        const currentPos = type === 'column' ? e.clientX : e.clientY;
        const diff = currentPos - startPosRef.current;
        const newSize = Math.max(startSizeRef.current + diff, minSize);
        pendingSizeRef.current = newSize;

        // Calculate guide position based on the initial handle position plus the mouse movement
        const newGuidePosition = handlePosition + diff;
        setGuidePosition(newGuidePosition);
      };

      const handleMouseUp = (e: MouseEvent) => {
        setIsResizing(false);
        const finalPos = type === 'column' ? e.clientX : e.clientY;
        const diff = finalPos - startPosRef.current;
        const newSize = Math.max(startSizeRef.current + diff, minSize);
        onResize(index, newSize);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [type, index, onResize, defaultSize, minSize]
  );

  return (
    <>
      <div
        ref={handleRef}
        className={`absolute ${
          type === 'column'
            ? 'cursor-col-resize w-1 h-full top-0 right-0 hover:bg-blue-400'
            : 'cursor-row-resize h-1 w-full left-0 bottom-0 hover:bg-blue-400'
        } bg-transparent hover:bg-opacity-50 z-10`}
        onMouseDown={handleMouseDown}
      />
      {isResizing && (
        <div
          className={`fixed ${
            type === 'column'
              ? 'w-0.5 h-screen cursor-col-resize'
              : 'w-screen h-0.5 cursor-row-resize'
          } bg-blue-500 pointer-events-none z-50`}
          style={{
            [type === 'column' ? 'left' : 'top']: `${guidePosition}px`,
          }}
        />
      )}
    </>
  );
}
