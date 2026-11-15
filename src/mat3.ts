/* @ts-self-types="./mat3.ts" */

import { MatrixN } from "./matrix-n.ts";

/**
 * Represents a 3x3 Matrix. Extends MatrixN.
 */
export class Mat3 extends MatrixN {
	constructor(initialData?: number[] | number[][]) {
		if (initialData) {
			if (Array.isArray(initialData[0])) {
				const data2D = initialData as number[][];
				if (
					data2D.length !== 3 ||
					data2D.some((row) => !Array.isArray(row) || row.length !== 3)
				) {
					throw new Error("Mat3 initial data must be 3x3.");
				}
			} else if (initialData.length !== 9) {
				throw new Error("Mat3 initial flat data must have 9 elements.");
			}
		}
		super(3, 3, initialData);
	}

	static fromValues(
		m00: number,
		m01: number,
		m02: number,
		m10: number,
		m11: number,
		m12: number,
		m20: number,
		m21: number,
		m22: number,
	): Mat3 {
		return new Mat3([m00, m01, m02, m10, m11, m12, m20, m21, m22]);
	}

	static identity(): Mat3 {
		return new Mat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
	}
}
