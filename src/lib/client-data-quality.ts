export type CellValue = string | number | boolean | null;
export type GridData = CellValue[][];

export function trim(value: CellValue): CellValue {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value;
}

export function upper(value: CellValue): CellValue {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value;
}

export function lower(value: CellValue): CellValue {
  if (typeof value === 'string') {
    return value.toLowerCase();
  }
  return value;
}

export function removeDuplicates(data: GridData): GridData {
  const stringifiedRows = data.map((row) => JSON.stringify(row));
  const uniqueStringifiedRows = [...new Set(stringifiedRows)];
  return uniqueStringifiedRows.map((row) => JSON.parse(row));
}

export function findAndReplace(
  data: GridData,
  find: string,
  replace: string,
  caseSensitive = true
): GridData {
  return data.map((row) =>
    row.map((cell) => {
      if (typeof cell === 'string') {
        if (caseSensitive) {
          return cell.replaceAll(find, replace);
        } else {
          const regex = new RegExp(find, 'gi');
          return cell.replaceAll(regex, replace);
        }
      }
      return cell;
    })
  );
}

export function applyTrim(
  data: GridData,
  selectedRange: {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  }
): GridData {
  const newData = [...data];
  for (let i = selectedRange.startRow; i <= selectedRange.endRow; i++) {
    for (let j = selectedRange.startCol; j <= selectedRange.endCol; j++) {
      if (i < newData.length && j < newData[i].length) {
        newData[i][j] = trim(newData[i][j]);
      }
    }
  }
  return newData;
}

export function applyUpper(
  data: GridData,
  selectedRange: {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  }
): GridData {
  const newData = [...data];
  for (let i = selectedRange.startRow; i <= selectedRange.endRow; i++) {
    for (let j = selectedRange.startCol; j <= selectedRange.endCol; j++) {
      if (i < newData.length && j < newData[i].length) {
        newData[i][j] = upper(newData[i][j]);
      }
    }
  }
  return newData;
}

export function applyLower(
  data: GridData,
  selectedRange: {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  }
): GridData {
  const newData = [...data];
  for (let i = selectedRange.startRow; i <= selectedRange.endRow; i++) {
    for (let j = selectedRange.startCol; j <= selectedRange.endCol; j++) {
      if (i < newData.length && j < newData[i].length) {
        newData[i][j] = lower(newData[i][j]);
      }
    }
  }
  return newData;
}

export function applyRemoveDuplicates(
  data: GridData,
  selectedRange: {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  }
): GridData {
  const selectedData = data
    .slice(selectedRange.startRow, selectedRange.endRow + 1)
    .map((row) => row.slice(selectedRange.startCol, selectedRange.endCol + 1));

  const uniqueData = removeDuplicates(selectedData);

  const newData = [...data];
  for (let i = 0; i < uniqueData.length; i++) {
    const targetRow = selectedRange.startRow + i;
    if (targetRow < newData.length) {
      for (let j = 0; j < uniqueData[i].length; j++) {
        const targetCol = selectedRange.startCol + j;
        if (targetCol < newData[targetRow].length) {
          newData[targetRow][targetCol] = uniqueData[i][j];
        }
      }
    }
  }
  return newData;
}

export function applyFindAndReplace(
  data: GridData,
  selectedRange: {
    startRow: number;
    endRow: number;
    startCol: number;
    endCol: number;
  },
  find: string,
  replace: string,
  caseSensitive = true
): GridData {
  const selectedData = data
    .slice(selectedRange.startRow, selectedRange.endRow + 1)
    .map((row) => row.slice(selectedRange.startCol, selectedRange.endCol + 1));

  const replacedData = findAndReplace(selectedData, find, replace, caseSensitive);

  const newData = [...data];
  for (let i = 0; i < replacedData.length; i++) {
    const targetRow = selectedRange.startRow + i;
    if (targetRow < newData.length) {
      for (let j = 0; j < replacedData[i].length; j++) {
        const targetCol = selectedRange.startCol + j;
        if (targetCol < newData[targetRow].length) {
          newData[targetRow][targetCol] = replacedData[i][j];
        }
      }
    }
  }
  return newData;
}
