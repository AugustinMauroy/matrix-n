/* @ts-self-types="./mat4.ts" */

import { MatrixN } from "./matrix-n.ts";

/**
 * Represents a 4x4 Matrix. Extends MatrixN.
 */
export class Mat4 extends MatrixN {
	constructor(initialData?: number[] | number[][]) {
		if (initialData) {
			if (Array.isArray(initialData[0])) {
				const data2D = initialData as number[][];
				if (
					data2D.length !== 4 ||
					data2D.some((row) => !Array.isArray(row) || row.length !== 4)
				) {
					throw new Error("Mat4 initial data must be 4x4.");
				}
			} else if (initialData.length !== 16) {
				throw new Error("Mat4 initial flat data must have 16 elements.");
			}
		}
		super(4, 4, initialData);
	}

	static fromValues(
		m00: number,
		m01: number,
		m02: number,
		m03: number,
		m10: number,
		m11: number,
		m12: number,
		m13: number,
		m20: number,
		m21: number,
		m22: number,
		m23: number,
		m30: number,
		m31: number,
		m32: number,
		m33: number,
	): Mat4 {
		return new Mat4([
			m00,
			m01,
			m02,
			m03,
			m10,
			m11,
			m12,
			m13,
			m20,
			m21,
			m22,
			m23,
			m30,
			m31,
			m32,
			m33,
		]);
	}

	static identity(): Mat4 {
		return new Mat4([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	}
}
