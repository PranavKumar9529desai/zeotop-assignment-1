'use client';

import { Spreadsheet } from '@/components/spreadsheet/spreadsheet';
import { useState } from 'react';

export default function TestSpreadsheetPage() {
  const [testResults, setTestResults] = useState<
    Array<{ id: string; name: string; passed: boolean; expected: string; actual: string }>
  >([]);

  const runTests = async () => {
    const results: Array<{
      id: string;
      name: string;
      passed: boolean;
      expected: string;
      actual: string;
    }> = [];

    // Helper to add test result
    const addResult = (id: string, name: string, expected: string, actual: string) => {
      results.push({
        id,
        name,
        passed: expected === actual,
        expected,
        actual,
      });
    };

    // Test basic functions
    addResult(
      'sum-basic',
      'Basic SUM',
      '60',
      document.querySelector('[data-cell="C1"]')?.textContent || 'Not found'
    );

    addResult(
      'average-basic',
      'Basic AVERAGE',
      '20',
      document.querySelector('[data-cell="C2"]')?.textContent || 'Not found'
    );

    addResult(
      'max-combined',
      'MAX of multiple ranges',
      '30',
      document.querySelector('[data-cell="C3"]')?.textContent || 'Not found'
    );

    addResult(
      'min-combined',
      'MIN of multiple ranges',
      '5',
      document.querySelector('[data-cell="C4"]')?.textContent || 'Not found'
    );

    addResult(
      'count-basic',
      'COUNT of range',
      '6',
      document.querySelector('[data-cell="C5"]')?.textContent || 'Not found'
    );

    // Test error handling
    addResult(
      'sum-error',
      'SUM with invalid range',
      '#VALUE_ERROR',
      document.querySelector('[data-cell="D1"]')?.textContent || 'Not found'
    );

    addResult(
      'average-error',
      'AVERAGE with syntax error',
      '#SYNTAX_ERROR',
      document.querySelector('[data-cell="D2"]')?.textContent || 'Not found'
    );

    addResult(
      'max-error',
      'MAX with invalid reference',
      '#RANGE_ERROR',
      document.querySelector('[data-cell="D3"]')?.textContent || 'Not found'
    );

    setTestResults(results);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-2">Spreadsheet Formula Testing</h1>
        <p className="text-gray-600 mb-4">Follow these steps to test the mathematical functions:</p>
        <ol className="list-decimal ml-6 mb-4 space-y-2">
          <li>
            Enter the following test data:
            <ul className="list-disc ml-6 mt-1">
              <li>A1: 10</li>
              <li>A2: 20</li>
              <li>A3: 30</li>
              <li>B1: 5</li>
              <li>B2: 15</li>
              <li>B3: 25</li>
            </ul>
          </li>
          <li>
            Try these formulas:
            <ul className="list-disc ml-6 mt-1">
              <li>C1: =SUM(A1:A3) [Expected: 60]</li>
              <li>C2: =AVERAGE(A1:A3) [Expected: 20]</li>
              <li>C3: =MAX(A1:A3,B1:B3) [Expected: 30]</li>
              <li>C4: =MIN(A1:A3,B1:B3) [Expected: 5]</li>
              <li>C5: =COUNT(A1:B3) [Expected: 6]</li>
            </ul>
          </li>
          <li>
            Test error handling:
            <ul className="list-disc ml-6 mt-1">
              <li>D1: =SUM(X1:X5) [Expected: #VALUE_ERROR]</li>
              <li>D2: =AVERAGE() [Expected: #SYNTAX_ERROR]</li>
              <li>D3: =MAX(ABC) [Expected: #RANGE_ERROR]</li>
            </ul>
          </li>
        </ol>
        <button
          type="button"
          onClick={runTests}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Run Tests
        </button>
      </div>

      <div className="mb-8 border rounded-lg overflow-hidden">
        <Spreadsheet />
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Test Results</h2>
        {testResults.length > 0 ? (
          <div className="space-y-2">
            {testResults.map((result) => (
              <div
                key={result.id}
                className={`p-2 rounded ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}
              >
                <div className="font-medium">
                  {result.name}: {result.passed ? '✅ Passed' : '❌ Failed'}
                </div>
                {!result.passed && (
                  <div className="text-sm text-gray-600">
                    Expected: {result.expected}, Got: {result.actual}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            Enter the test data and formulas above, then click &quot;Run Tests&quot; to see results.
          </p>
        )}
      </div>
    </div>
  );
}
