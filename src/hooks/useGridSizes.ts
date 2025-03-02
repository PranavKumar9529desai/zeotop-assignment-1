'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const STORAGE_KEY = 'grid-sizes';

export interface GridSizes {
  columns: { [key: number]: number };
  rows: { [key: number]: number };
}

export function useGridSizes() {
  const [sizes, setSizes] = useState<GridSizes>({ columns: {}, rows: {} });
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load sizes from localStorage on mount
  useEffect(() => {
    try {
      const savedSizes = localStorage.getItem(STORAGE_KEY);
      if (savedSizes) {
        setSizes(JSON.parse(savedSizes));
      }
    } catch (error) {
      console.error('Failed to load grid sizes:', error);
    }
    setIsLoading(false);
  }, []);

  // Save sizes to localStorage
  const saveSizes = useCallback((sizesToSave: GridSizes) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sizesToSave));
    } catch (error) {
      console.error('Failed to save grid sizes:', error);
    }
  }, []);

  // Update sizes with debounced save
  const updateSizes = useCallback(
    (newSizes: GridSizes, shouldSave = true) => {
      setSizes(newSizes);

      if (shouldSave) {
        // Clear any existing timeout
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }

        // Set a new timeout to save
        saveTimeoutRef.current = setTimeout(() => {
          saveSizes(newSizes);
        }, 500); // Debounce for 500ms
      }
    },
    [saveSizes]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
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
