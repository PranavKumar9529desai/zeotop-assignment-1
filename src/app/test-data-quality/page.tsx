'use client';

import { DataQualityToolbar } from '@/components/data-quality/DataQualityToolbar';
import type { GridData } from '@/lib/data-quality';
import { useState } from 'react';

const sampleData: GridData = [
  ['  Hello  ', '  WORLD  ', '  Test  '],
  ['hello', 'world', 'test'],
  ['HELLO', 'WORLD', 'TEST'],
  ['  Hello  ', '  WORLD  ', '  Test  '], // Duplicate row
  ['123', 'abc', 'DEF'],
];

export default function TestDataQualityPage() {
  const [data, setData] = useState<GridData>(sampleData);
  const selectedRange = {
    startRow: 0,
    endRow: data.length - 1,
    startCol: 0,
    endCol: data[0].length - 1,
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Data Quality Features</h1>

      <DataQualityToolbar data={data} selectedRange={selectedRange} onDataChange={setData} />

      <div className="mt-4 border rounded">
        <table className="w-full">
          <thead>
            <tr>
              <th className="border p-2">Column 1</th>
              <th className="border p-2">Column 2</th>
              <th className="border p-2">Column 3</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={`row-${row.join('-')}-${rowIndex}`}>
                {row.map((cell, colIndex) => (
                  <td key={`cell-${cell}-${rowIndex}-${colIndex}`} className="border p-2">
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
        <ul className="list-disc pl-5">
          <li>The sample data contains mixed case text and whitespace</li>
          <li>Click &quot;Trim&quot; to remove leading/trailing whitespace</li>
          <li>Click &quot;UPPER&quot; or &quot;lower&quot; to change text case</li>
          <li>Click &quot;Remove Duplicates&quot; to remove duplicate rows</li>
          <li>Click &quot;Find & Replace&quot; to open the find/replace panel</li>
          <li>All operations work on the entire table in this demo</li>
        </ul>
      </div>
    </div>
  );
}
