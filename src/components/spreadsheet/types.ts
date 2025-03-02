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

export type SpreadsheetData = Map<string, CellData>;

export function getCellKey(position: CellPosition): string {
  return `${position.row}-${position.col}`;
}

export function getDefaultCellData(): CellData {
  return {
    value: '',
    styles: {
      align: 'left'
    }
  };
} 