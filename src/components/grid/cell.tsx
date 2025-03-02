"use client";

import { useEffect, useRef } from "react";
import type { CellData, CellStyle } from "../spreadsheet/types";

interface CellProps {
  row: number;
  col: number;
  isSelected: boolean;
  data: CellData;
  onSelect: (row: number, col: number) => void;
  onChange: (value: string) => void;
  isEditing: boolean;
  onStartEdit: () => void;
  onStopEdit: () => void;
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
}: CellProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cellRef = useRef<HTMLTableCellElement>(null);

  useEffect(() => {
    if (isSelected && isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelected, isEditing]);

  const handleClick = () => {
    onSelect(row, col);
  };

  const handleDoubleClick = () => {
    onStartEdit();
  };

  const handleBlur = () => {
    onStopEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (isEditing) {
        onStopEdit();
      } else {
        onStartEdit();
      }
      e.preventDefault();
    } else if (e.key === "Escape" && isEditing) {
      onStopEdit();
    } else if (!isEditing) {
      // Navigation when not editing
      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          if (row > 0) onSelect(row - 1, col);
          break;
        case "ArrowDown":
          e.preventDefault();
          onSelect(row + 1, col);
          break;
        case "ArrowLeft":
          e.preventDefault();
          if (col > 0) onSelect(row, col - 1);
          break;
        case "ArrowRight":
          e.preventDefault();
          onSelect(row, col + 1);
          break;
      }
    }
  };

  const getCellStyles = (styles: CellStyle): string => {
    const classNames = ["w-full h-full px-1 overflow-hidden text-sm leading-8"];

    if (styles.bold) classNames.push("font-bold");
    if (styles.italic) classNames.push("italic");
    if (styles.underline) classNames.push("underline");

    switch (styles.align) {
      case "center":
        classNames.push("text-center");
        break;
      case "right":
        classNames.push("text-right");
        break;
      default:
        classNames.push("text-left");
    }

    return classNames.join(" ");
  };

  return (
    <td
      ref={cellRef}
      role="gridcell"
      tabIndex={isSelected ? 0 : -1}
      className={`spreadsheet-cell w-24 h-8 border-r border-b relative p-0 ${
        isSelected ? "spreadsheet-selected" : ""
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      aria-selected={isSelected}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={data.formula || data.value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="spreadsheet-input absolute inset-0 w-full h-full px-1 border-2 border-blue-500 outline-none"
        />
      ) : (
        <div className={getCellStyles(data.styles)}>{data.value}</div>
      )}
    </td>
  );
}
