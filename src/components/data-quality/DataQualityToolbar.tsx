'use client';

import {
  applyFindAndReplace,
  applyLower,
  applyRemoveDuplicates,
  applyTrim,
  applyUpper,
} from '@/lib/client-data-quality';
import type { GridData } from '@/lib/client-data-quality';
import { useState } from 'react';

interface DataQualityToolbarProps {
  data: GridData;
  selectedRange: {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  };
  onDataChange: (newData: GridData) => void;
}

export function DataQualityToolbar({
  data = [[]], // Provide default empty grid
  selectedRange = { startRow: 0, endRow: 0, startCol: 0, endCol: 0 }, // Provide default range
  onDataChange,
}: DataQualityToolbarProps) {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOperation = (operation: () => GridData) => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
        throw new Error('Invalid grid data');
      }

      setError(null);
      const newData = operation();
      onDataChange(newData);
    } catch (err) {
      console.error('Operation failed:', err);
      setError(err instanceof Error ? err.message : 'Operation failed');
    }
  };

  const handleTrim = () => handleOperation(() => applyTrim(data, selectedRange));
  const handleUpper = () => handleOperation(() => applyUpper(data, selectedRange));
  const handleLower = () => handleOperation(() => applyLower(data, selectedRange));
  const handleRemoveDuplicates = () =>
    handleOperation(() => applyRemoveDuplicates(data, selectedRange));
  const handleFindAndReplace = () => {
    if (!findText) {
      setError('Please enter text to find');
      return;
    }
    handleOperation(() =>
      applyFindAndReplace(data, selectedRange, findText, replaceText, caseSensitive)
    );
  };

  const buttonBaseClass =
    'px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  const activeButtonClass =
    'px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  // Disable buttons if data is invalid
  const isDataValid = data && Array.isArray(data) && data.length > 0 && Array.isArray(data[0]);

  return (
    <div className="flex flex-col gap-2 p-2 bg-white border-b">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleTrim}
          className={buttonBaseClass}
          disabled={!isDataValid}
        >
          Trim
        </button>
        <button
          type="button"
          onClick={handleUpper}
          className={buttonBaseClass}
          disabled={!isDataValid}
        >
          UPPER
        </button>
        <button
          type="button"
          onClick={handleLower}
          className={buttonBaseClass}
          disabled={!isDataValid}
        >
          lower
        </button>
        <button
          type="button"
          onClick={handleRemoveDuplicates}
          className={buttonBaseClass}
          disabled={!isDataValid}
        >
          Remove Duplicates
        </button>
        <button
          type="button"
          onClick={() => setShowFindReplace(!showFindReplace)}
          className={showFindReplace ? activeButtonClass : buttonBaseClass}
          disabled={!isDataValid}
        >
          Find & Replace
        </button>
      </div>

      {error && <div className="text-red-600 text-sm font-medium">{error}</div>}

      {showFindReplace && (
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Find"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            className="px-2 py-1 text-sm border rounded text-gray-900 placeholder-gray-500"
            disabled={!isDataValid}
          />
          <input
            type="text"
            placeholder="Replace"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            className="px-2 py-1 text-sm border rounded text-gray-900 placeholder-gray-500"
            disabled={!isDataValid}
          />
          <label className="flex items-center gap-1 text-sm text-gray-700 font-medium">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="text-blue-600 border-gray-300 rounded"
              disabled={!isDataValid}
            />
            Case Sensitive
          </label>
          <button
            type="button"
            onClick={handleFindAndReplace}
            className={activeButtonClass}
            disabled={!isDataValid || !findText}
          >
            Replace
          </button>
        </div>
      )}
    </div>
  );
}
