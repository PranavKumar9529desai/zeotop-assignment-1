import type { MathOperation } from "@/lib/types";

interface MathOperationsProps {
	onOperationSelect: (operation: MathOperation) => void;
	selectedOperation: MathOperation | null;
}

const operations: MathOperation[] = ["SUM", "AVERAGE", "MAX", "MIN", "COUNT"];

export function MathOperations({
	onOperationSelect,
	selectedOperation,
}: MathOperationsProps) {
	return (
		<div className="flex flex-col gap-2 p-2 border-r bg-gray-50">
			{operations.map((operation) => (
				<button
					type="button"
					key={operation}
					onClick={() => onOperationSelect(operation)}
					className={`px-4 py-2 text-sm font-medium rounded ${
						selectedOperation === operation
							? "bg-blue-600 text-white"
							: "bg-white text-gray-700 hover:bg-gray-100"
					}`}
				>
					{operation}
				</button>
			))}
		</div>
	);
}
