import { MatrixN } from "./matrix-n.ts";

/**
 * Represents a 2x2 Matrix. Extends MatrixN.
 */
export class Mat2 extends MatrixN {
	constructor(initialData?: number[] | number[][]) {
		if (initialData) {
			if (Array.isArray(initialData[0])) {
				const data2D = initialData as number[][];
				if (
					data2D.length !== 2 ||
					data2D.some((row) => !Array.isArray(row) || row.length !== 2)
				) {
					throw new Error("Mat2 initial data must be 2x2.");
				}
			} else if (initialData.length !== 4) {
				throw new Error("Mat2 initial flat data must have 4 elements.");
			}
		}
		super(2, 2, initialData);
	}

	static fromValues(m00: number, m01: number, m10: number, m11: number): Mat2 {
		return new Mat2([m00, m01, m10, m11]);
	}

	static identity(): Mat2 {
		return new Mat2([1, 0, 0, 1]);
	}
}
