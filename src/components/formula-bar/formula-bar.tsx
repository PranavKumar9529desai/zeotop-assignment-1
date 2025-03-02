"use client";

import Tippy from '@tippyjs/react';
import { useCallback, useRef, useState } from 'react';
import { RangeSelector } from "../spreadsheet/RangeSelector";
import type { CellPosition, SelectionState } from "../spreadsheet/types";
import 'tippy.js/dist/tippy.css';
import '@/styles/formula-suggestions.css';
import { type FormulaSuggestion, getFormulaSuggestions } from "@/lib/formulaSuggestions";

interface FormulaBarProps {
  selectedCell: { row: number; col: number } | null;
  value: string;
  onChange: (value: string) => void;
  selection: SelectionState;
  onRangeChange: (selection: SelectionState) => void;
}

const defaultSelection: SelectionState = {
  ranges: [],
  activeCell: null,
};

export function FormulaBar({
  selectedCell,
  value,
  onChange,
  selection = defaultSelection,
  onRangeChange,
}: FormulaBarProps) {
  const [suggestions, setSuggestions] = useState<FormulaSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRangeChange = (range: { start: CellPosition; end: CellPosition }) => {
    onRangeChange({
      ranges: [range],
      activeCell: range.start,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSuggestions(getFormulaSuggestions(newValue));
    setSelectedIndex(0); // Reset selection when input changes
  };

  const handleSuggestionClick = useCallback((suggestion: FormulaSuggestion) => {
    onChange(`=${suggestion.name}(`);
    setSuggestions([]);
    setSelectedIndex(0);
    inputRef.current?.focus();
  }, [onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          handleSuggestionClick(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedIndex(0);
        break;
    }
  }, [suggestions, selectedIndex, handleSuggestionClick]);

  return (
    <div className="flex items-center h-8 border-b border-[var(--spreadsheet-border)] bg-[var(--spreadsheet-header-bg)]">
      <div className="sticky top-0 left-0 z-40 flex items-center h-8 bg-[var(--spreadsheet-header-bg)] border-b border-[var(--spreadsheet-border)]">
        <RangeSelector
          selection={selection}
          onRangeChange={handleRangeChange}
        />
      </div>
      <div className="flex items-center justify-center w-8 h-full border-x border-[var(--spreadsheet-border)] text-[var(--spreadsheet-text-primary)]">
        fx
      </div>
      <div className="flex-1 px-2 relative">
        <Tippy
          visible={suggestions.length > 0}
          interactive={true}
          placement="bottom-start"
          content={
            <div className="bg-white border border-gray-100 shadow-sm max-h-[200px] overflow-y-auto w-[300px] py-1">
              {suggestions.map((suggestion, index) => (
                <button
                  type="button"
                  key={suggestion.name}
                  className={`block w-full text-left px-2 py-1 hover:bg-gray-50 text-sm ${
                    index === selectedIndex ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestions.length === 1 ? (
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-900">{suggestion.name}</div>
                      <div className="text-gray-700 text-sm">{suggestion.description}</div>
                      <div className="mt-2 bg-gray-50 p-2 rounded border border-gray-100">
                        <div className="text-xs font-medium text-gray-500 mb-1">Example:</div>
                        <div className="font-mono text-sm">
                          <span className="text-blue-600">{suggestion.example.split(' → ')[0]}</span>
                          <span className="text-gray-400 mx-1">→</span>
                          <span className="text-green-600">{suggestion.example.split(' → ')[1]}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 min-w-[80px]">{suggestion.name}</span>
                      <span className="text-gray-700 text-xs truncate">{suggestion.description}</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          }
          appendTo={() => document.body}
          className="!rounded-none !border !shadow-sm !p-0"
        >
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={selectedCell ? "Enter a value or formula (start with = for formulas)" : ""}
            disabled={!selectedCell}
            onClick={(e) => e.currentTarget.select()}
            className="w-full h-6 px-1 bg-white outline-none text-gray-900 disabled:bg-[var(--spreadsheet-header-bg)] disabled:text-[var(--spreadsheet-text-primary)] placeholder:text-gray-500 focus:border focus:border-blue-500 rounded-sm"
          />
        </Tippy>
      </div>
    </div>
  );
}
