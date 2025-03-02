// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="@testing-library/jest-dom" />
'use client';

import { Spreadsheet } from '@/components/spreadsheet/spreadsheet';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Spreadsheet Multiple Selection', () => {
  beforeEach(() => {
    render(<Spreadsheet />);
  });

  test('single cell selection', () => {
    const cells = screen.getAllByRole('gridcell');
    const firstCell = cells[0];
    fireEvent.click(firstCell);
    expect(firstCell).toHaveClass('spreadsheet-selected');
  });

  test('shift + click for range selection', () => {
    const cells = screen.getAllByRole('gridcell');
    const firstCell = cells[0];
    const lastCell = cells[10];

    // Select first cell
    fireEvent.click(firstCell);

    // Shift + click on another cell to create range
    fireEvent.click(lastCell, { shiftKey: true });

    // Check if cells in between are selected
    const selectedCells = cells.slice(0, 11).filter((cell: HTMLElement) => 
      cell.classList.contains('spreadsheet-selected')
    );
    expect(selectedCells.length).toBe(11); // All cells from index 0 to 10 should be selected
  });

  test('ctrl/cmd + click for multiple selection', () => {
    const cells = screen.getAllByRole('gridcell');
    const firstCell = cells[0];
    const secondCell = cells[5];

    // Select first cell
    fireEvent.click(firstCell);

    // Ctrl + click on another non-adjacent cell
    fireEvent.click(secondCell, { ctrlKey: true });

    // Check if both cells are selected
    expect(firstCell).toHaveClass('spreadsheet-selected');
    expect(secondCell).toHaveClass('spreadsheet-selected');
  });

  describe('keyboard navigation', () => {
    test('basic arrow key navigation', () => {
      const cells = screen.getAllByRole('gridcell');
      const firstCell = cells[0];

      // Select first cell
      fireEvent.click(firstCell);

      // Navigate right
      fireEvent.keyDown(firstCell, { key: 'ArrowRight' });
      expect(cells[1]).toHaveClass('spreadsheet-selected');

      // Navigate down
      fireEvent.keyDown(cells[1], { key: 'ArrowDown' });
      expect(cells[27]).toHaveClass('spreadsheet-selected'); // 26 columns + 1
    });

    test('shift + arrow key navigation', () => {
      const cells = screen.getAllByRole('gridcell');
      const firstCell = cells[0];

      // Select first cell
      fireEvent.click(firstCell);

      // Navigate right with shift (5 cells)
      fireEvent.keyDown(firstCell, { key: 'ArrowRight', shiftKey: true });
      expect(cells[5]).toHaveClass('spreadsheet-selected');

      // Navigate down with shift (5 cells)
      fireEvent.keyDown(cells[5], { key: 'ArrowDown', shiftKey: true });
      expect(cells[135]).toHaveClass('spreadsheet-selected'); // (5 * 26) + 5
    });

    test('home and end navigation', () => {
      const cells = screen.getAllByRole('gridcell');
      const middleCell = cells[40]; // Some cell in the middle

      // Select middle cell
      fireEvent.click(middleCell);

      // Navigate to start of row
      fireEvent.keyDown(middleCell, { key: 'Home' });
      expect(cells[26]).toHaveClass('spreadsheet-selected'); // First cell of the second row

      // Navigate to end of row
      fireEvent.keyDown(cells[26], { key: 'End' });
      expect(cells[51]).toHaveClass('spreadsheet-selected'); // Last cell of the second row

      // Navigate to first cell of spreadsheet
      fireEvent.keyDown(cells[51], { key: 'Home', ctrlKey: true });
      expect(cells[0]).toHaveClass('spreadsheet-selected');

      // Navigate to last cell of spreadsheet
      fireEvent.keyDown(cells[0], { key: 'End', ctrlKey: true });
      expect(cells[cells.length - 1]).toHaveClass('spreadsheet-selected');
    });

    test('page up and page down navigation', () => {
      const cells = screen.getAllByRole('gridcell');
      const startRow = 15; // Start from row 15
      const startIndex = startRow * 26; // 15 rows * 26 columns
      const middleCell = cells[startIndex];

      // Select middle cell
      fireEvent.click(middleCell);

      // Navigate up 10 rows
      fireEvent.keyDown(middleCell, { key: 'PageUp' });
      const upIndex = (startRow - 10) * 26;
      expect(cells[upIndex]).toHaveClass('spreadsheet-selected');

      // Navigate down 10 rows
      fireEvent.keyDown(cells[upIndex], { key: 'PageDown' });
      expect(cells[startIndex]).toHaveClass('spreadsheet-selected');
    });
  });

  test('editing selected cell', async () => {
    const cells = screen.getAllByRole('gridcell');
    const firstCell = cells[0];

    // Select and double click cell to edit
    fireEvent.click(firstCell);
    fireEvent.doubleClick(firstCell);

    // Check if input appears and can be edited
    const cellInput = within(firstCell).getByRole('textbox') as HTMLInputElement;
    fireEvent.change(cellInput, { target: { value: 'test value' } });
    expect(cellInput.value).toBe('test value');

    // Press enter to confirm edit
    fireEvent.keyDown(cellInput, { key: 'Enter' });
    
    // Wait for the state update
    await waitFor(() => {
      expect(firstCell).toHaveTextContent('test value');
    });
  });
}); 