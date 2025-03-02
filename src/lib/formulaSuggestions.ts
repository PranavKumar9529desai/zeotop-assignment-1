export interface FormulaSuggestion {
  name: string;
  description: string;
  example: string;
}

export const formulaSuggestions: FormulaSuggestion[] = [
  {
    name: 'SUM',
    description: 'Adds up all numbers in the selected range',
    example: '=SUM(A1:A10)',
  },
  {
    name: 'AVERAGE',
    description: 'Calculates the average of numbers in the selected range',
    example: '=AVERAGE(A1:A10)',
  },
  {
    name: 'MAX',
    description: 'Finds the largest number in the selected range',
    example: '=MAX(A1:A10)',
  },
  {
    name: 'MIN',
    description: 'Finds the smallest number in the selected range',
    example: '=MIN(A1:A10)',
  },
  {
    name: 'COUNT',
    description: 'Counts the number of cells with numbers in the selected range',
    example: '=COUNT(A1:A10)',
  },
];

export const getFormulaSuggestions = (input: string): FormulaSuggestion[] => {
  if (!input.startsWith('=')) return [];

  const searchTerm = input.slice(1).toUpperCase(); // Remove = and convert to uppercase
  return formulaSuggestions.filter((suggestion) => suggestion.name.startsWith(searchTerm));
};
