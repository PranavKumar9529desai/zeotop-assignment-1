'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'grid-sizes';
const DEBOUNCE_DELAY = 200; // Reduced from 500ms for smoother feel
const SAVE_DELAY = 1000; // Separate delay for localStorage saves

export interface GridSizes {
  columns: { [key: number]: number };
  rows: { [key: number]: number };
}

export function useGridSizes() {
  const [sizes, setSizes] = useState<GridSizes>({ columns: {}, rows: {} });
  const [isLoading, setIsLoading] = useState(true);
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const saveTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastSavedRef = useRef<GridSizes>({ columns: {}, rows: {} });

  // Load sizes from localStorage on mount
  useEffect(() => {
    try {
      const savedSizes = localStorage.getItem(STORAGE_KEY);
      if (savedSizes) {
        const parsed = JSON.parse(savedSizes);
        setSizes(parsed);
        lastSavedRef.current = parsed;
      }
    } catch (error) {
      console.error('Failed to load grid sizes:', error);
    }
    setIsLoading(false);
  }, []);

  // Save sizes to localStorage
  const saveSizes = useCallback((sizesToSave: GridSizes) => {
    try {
      // Only save if there are actual changes
      if (JSON.stringify(sizesToSave) !== JSON.stringify(lastSavedRef.current)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sizesToSave));
        lastSavedRef.current = sizesToSave;
      }
    } catch (error) {
      console.error('Failed to save grid sizes:', error);
    }
  }, []);

  // Update sizes with double debouncing - one for UI updates and one for storage
  const updateSizes = useCallback(
    (newSizes: GridSizes, shouldSave = true) => {
      // Clear any existing UI update timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Set a new timeout for UI update with shorter delay
      updateTimeoutRef.current = setTimeout(() => {
        setSizes(newSizes);

        if (shouldSave) {
          // Clear any existing save timeout
          if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
          }

          // Set a new timeout for localStorage save with longer delay
          saveTimeoutRef.current = setTimeout(() => {
            saveSizes(newSizes);
          }, SAVE_DELAY);
        }
      }, DEBOUNCE_DELAY);
    },
    [saveSizes]
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    sizes,
    updateSizes,
    isLoading,
    saveSizes,
  };
}
