"use client";

import { FormulaBar } from "@/components/formula-bar/formula-bar";
import Grid from "@/components/grid/grid";
import { Toolbar } from "@/components/toolbar/toolbar";
import { useCallback, useState } from "react";
import {
  type CellData,
  type SpreadsheetData,
  getCellKey,
  getDefaultCellData,
} from "./types";

export function Spreadsheet() {
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [editingCell, setEditingCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [spreadsheetData, setSpreadsheetData] = useState<SpreadsheetData>(
    new Map()
  );

  const getCurrentCellData = useCallback((): CellData | null => {
    if (!selectedCell) return null;
    return (
      spreadsheetData.get(getCellKey(selectedCell)) || getDefaultCellData()
    );
  }, [selectedCell, spreadsheetData]);

  const updateCellData = useCallback(
    (newData: Partial<CellData>) => {
      if (!selectedCell) return;

      const cellKey = getCellKey(selectedCell);
      const currentData = spreadsheetData.get(cellKey) || getDefaultCellData();
      const updatedData = { ...currentData, ...newData };

      setSpreadsheetData(new Map(spreadsheetData).set(cellKey, updatedData));
    },
    [selectedCell, spreadsheetData]
  );

  const handleBold = useCallback(() => {
    const currentData = getCurrentCellData();
    if (!currentData) return;
    updateCellData({
      styles: { ...currentData.styles, bold: !currentData.styles.bold },
    });
  }, [getCurrentCellData, updateCellData]);

  const handleItalic = useCallback(() => {
    const currentData = getCurrentCellData();
    if (!currentData) return;
    updateCellData({
      styles: { ...currentData.styles, italic: !currentData.styles.italic },
    });
  }, [getCurrentCellData, updateCellData]);

  const handleUnderline = useCallback(() => {
    const currentData = getCurrentCellData();
    if (!currentData) return;
    updateCellData({
      styles: {
        ...currentData.styles,
        underline: !currentData.styles.underline,
      },
    });
  }, [getCurrentCellData, updateCellData]);

  const handleAlign = useCallback(
    (alignment: "left" | "center" | "right") => {
      const currentData = getCurrentCellData();
      if (!currentData) return;
      updateCellData({
        styles: { ...currentData.styles, align: alignment },
      });
    },
    [getCurrentCellData, updateCellData]
  );

  const handleCellSelect = useCallback((row: number, col: number) => {
    setSelectedCell({ row, col });
  }, []);

  const handleStartEdit = useCallback((row: number, col: number) => {
    setEditingCell({ row, col });
  }, []);

  const handleStopEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  const handleCellChange = useCallback(
    (row: number, col: number, value: string) => {
      const cellKey = getCellKey({ row, col });
      const currentData = spreadsheetData.get(cellKey) || getDefaultCellData();

      setSpreadsheetData(
        new Map(spreadsheetData).set(cellKey, {
          ...currentData,
          value,
          formula: value.startsWith("=") ? value : undefined,
        })
      );
    },
    [spreadsheetData]
  );

  const handleFormulaChange = useCallback(
    (value: string) => {
      if (!selectedCell) return;
      handleCellChange(selectedCell.row, selectedCell.col, value);
    },
    [selectedCell, handleCellChange]
  );

  const currentCellData = getCurrentCellData();

  return (
    <>
      <Toolbar
        onBold={handleBold}
        onItalic={handleItalic}
        onUnderline={handleUnderline}
        onAlignLeft={() => handleAlign("left")}
        onAlignCenter={() => handleAlign("center")}
        onAlignRight={() => handleAlign("right")}
      />
      <FormulaBar
        selectedCell={selectedCell}
        value={currentCellData?.formula || currentCellData?.value || ""}
        onChange={handleFormulaChange}
      />
      <div className="flex-1 overflow-hidden">
        <Grid
          data={spreadsheetData}
          selectedCell={selectedCell}
          editingCell={editingCell}
          onCellSelect={handleCellSelect}
          onCellChange={handleCellChange}
          onStartEdit={handleStartEdit}
          onStopEdit={handleStopEdit}
        />
      </div>
    </>
  );
}
