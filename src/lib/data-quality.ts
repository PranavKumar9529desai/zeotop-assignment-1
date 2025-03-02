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
