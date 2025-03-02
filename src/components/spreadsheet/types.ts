export interface CellStyle {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface CellData {
  value: string;
  formula?: string;
  styles: CellStyle;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellRange {
  start: CellPosition;
  end: CellPosition;
}

export interface SelectionState {
  ranges: CellRange[];
  activeCell: CellPosition | null;
}

export type SpreadsheetData = Map<string, CellData>;

export type CellValue = {
  raw: string;
  computed?: number;
  formula?: string;
};

export function getCellKey(position: CellPosition): string {
  return `${position.row}-${position.col}`;
}

export function getDefaultCellData(): CellData {
  return {
    value: '',
    styles: {
      align: 'left',
    },
  };
}

export function isCellInRange(cell: CellPosition, range: CellRange): boolean {
  const minRow = Math.min(range.start.row, range.end.row);
  const maxRow = Math.max(range.start.row, range.end.row);
  const minCol = Math.min(range.start.col, range.end.col);
  const maxCol = Math.max(range.start.col, range.end.col);

  return cell.row >= minRow && cell.row <= maxRow && cell.col >= minCol && cell.col <= maxCol;
}

export function isCellSelected(cell: CellPosition, selection: SelectionState): boolean {
  return selection.ranges.some((range) => isCellInRange(cell, range));
}
