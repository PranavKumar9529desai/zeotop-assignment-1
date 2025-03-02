"use client";

import {
	calculateAverage,
	calculateCount,
	calculateMax,
	calculateMin,
	calculateSum,
} from "@/lib/actions/mathOperations";
import type { CellValue } from "@/lib/types";

export default function TestMathPage() {
	// Sample data matrix (3x3)
	const sampleData: CellValue[][] = [
		[
			{ raw: "1", computed: 1 },
			{ raw: "2", computed: 2 },
			{ raw: "3", computed: 3 },
		],
		[
			{ raw: "4", computed: 4 },
			{ raw: "5", computed: 5 },
			{ raw: "6", computed: 6 },
		],
		[
			{ raw: "7", computed: 7 },
			{ raw: "8", computed: 8 },
			{ raw: "9", computed: 9 },
		],
	];

	const testRange = {
		start: { row: 0, col: 0 },
		end: { row: 2, col: 2 },
	};

	async function runTests() {
		// Test SUM
		const sumResult = await calculateSum(testRange, sampleData);
		console.log("SUM Result:", sumResult);

		// Test AVERAGE
		const avgResult = await calculateAverage(testRange, sampleData);
		console.log("AVERAGE Result:", avgResult);

		// Test MAX
		const maxResult = await calculateMax(testRange, sampleData);
		console.log("MAX Result:", maxResult);

		// Test MIN
		const minResult = await calculateMin(testRange, sampleData);
		console.log("MIN Result:", minResult);

		// Test COUNT
		const countResult = await calculateCount(testRange, sampleData);
		console.log("COUNT Result:", countResult);
	}

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold mb-4">Math Operations Test</h1>

			<div className="mb-4">
				<h2 className="text-xl mb-2">Sample Data Matrix:</h2>
				<div className="grid grid-cols-3 gap-2 mb-4">
					{sampleData.map((row, rowIndex) => (
						<div key={`row-${rowIndex}`} className="contents">
							{row.map((cell, colIndex) => (
								<div
									key={`cell-${rowIndex}-${colIndex}`}
									className="border p-2 text-center"
								>
									{cell.raw}
								</div>
							))}
						</div>
					))}
				</div>
			</div>

			<button
				type="button"
				onClick={runTests}
				className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
			>
				Run Tests
			</button>

			<div className="mt-4">
				<p>Check the browser console to see the results!</p>
				<p className="text-gray-600 mt-2">
					The test runs on a 3x3 matrix with values 1-9. Expected results:
				</p>
				<ul className="list-disc ml-6 mt-2">
					<li>SUM: 45 (1+2+3+4+5+6+7+8+9)</li>
					<li>AVERAGE: 5 (45/9)</li>
					<li>MAX: 9</li>
					<li>MIN: 1</li>
					<li>COUNT: 9</li>
				</ul>
			</div>
		</div>
	);
}
