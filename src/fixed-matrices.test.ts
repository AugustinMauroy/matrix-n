import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Mat2, Mat3, Mat4, MatrixN } from "./mod.ts";

describe("Fixed Size Matrices (Mat2, Mat3, Mat4)", () => {
	it("Mat2 should construct correctly", () => {
		const mDefault = new Mat2();

		assert.deepStrictEqual(Array.from(mDefault.elements), [0, 0, 0, 0]);

		const mValues = Mat2.fromValues(1, 2, 3, 4);

		assert.deepStrictEqual(Array.from(mValues.elements), [1, 2, 3, 4]);

		const mId = Mat2.identity();

		assert.deepStrictEqual(Array.from(mId.elements), [1, 0, 0, 1]);
		assert.throws(
			() => new Mat2([1, 2, 3]),
			/Mat2 initial flat data must have 4 elements/,
		);
		assert.throws(
			() => new Mat2([[1, 2], [3]]),
			/Mat2 initial data must be 2x2/,
		);
		assert.throws(
			() => new Mat2([[1, 2]]), // Incorrect number of rows
			/Mat2 initial data must be 2x2/,
		);
		assert.throws(
			() =>
				new Mat2([
					[1, 2],
					[3, 4],
					[5, 6],
				]), // Incorrect number of rows
			/Mat2 initial data must be 2x2/,
		);
		assert.throws(
			// @ts-expect-error testing invalid type
			() => new Mat2([[1, 2], "not an array"]), // Inner element not an array
			/Mat2 initial data must be 2x2/,
		);
	});

	it("Mat3 should construct correctly", () => {
		const mId = Mat3.identity();

		assert.deepStrictEqual(
			Array.from(mId.elements),
			[1, 0, 0, 0, 1, 0, 0, 0, 1],
		);

		const mValues = Mat3.fromValues(1, 2, 3, 4, 5, 6, 7, 8, 9);

		assert.deepStrictEqual(
			Array.from(mValues.elements),
			[1, 2, 3, 4, 5, 6, 7, 8, 9],
		);
		assert.throws(
			() => new Mat3([1, 2, 3]),
			/Mat3 initial flat data must have 9 elements/,
		);
		assert.throws(
			() => new Mat3([[1, 2, 3]]), // Incorrect number of rows
			/Mat3 initial data must be 3x3/,
		);
		assert.throws(
			// @ts-expect-error testing invalid type
			() => new Mat3([[1, 2, 3], [4, 5, 6], "not an array"]), // Inner element not an array
			/Mat3 initial data must be 3x3/,
		);
		assert.throws(
			() =>
				new Mat3([
					[1, 2, 3],
					[4, 5],
					[7, 8, 9],
				]), // Inner array wrong length
			/Mat3 initial data must be 3x3/,
		);
	});

	it("Mat4 should construct correctly", () => {
		const mId = Mat4.identity();

		assert.deepStrictEqual(
			Array.from(mId.elements),
			[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
		);

		const mValues = Mat4.fromValues(
			1,
			2,
			3,
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
		);

		assert.deepStrictEqual(
			Array.from(mValues.elements),
			[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
		);

		assert.throws(
			() => new Mat4([1, 2, 3]),
			/Mat4 initial flat data must have 16 elements/,
		);
		assert.throws(
			() => new Mat4([[1, 2, 3, 4]]), // Incorrect number of rows
			/Mat4 initial data must be 4x4/,
		);
		assert.throws(
			// @ts-expect-error testing invalid type
			() => new Mat4([[1, 2, 3, 4], [5, 6, 7, 8], "not an array"]), // Inner element not an array
			/Mat4 initial data must be 4x4/,
		);
		assert.throws(
			() =>
				new Mat4([
					[1, 2, 3, 4],
					[5, 6, 7],
					[9, 10, 11, 12],
					[13, 14, 15, 16],
				]), // Inner array wrong length
			/Mat4 initial data must be 4x4/,
		);
	});

	it("Operations on fixed size matrices should work (inherited)", () => {
		const m2a = Mat2.fromValues(1, 2, 3, 4);
		const m2b = Mat2.fromValues(5, 6, 7, 8);

		const resultAdd = m2a.add(m2b); // Returns MatrixN

		assert.ok(resultAdd instanceof MatrixN);
		assert.ok(!(resultAdd instanceof Mat2)); // Unless add is overridden in Mat2 to return Mat2
		assert.deepStrictEqual(Array.from(resultAdd.elements), [6, 8, 10, 12]);

		const resultMul = m2a.multiply(m2b); // Returns MatrixN

		assert.ok(resultMul instanceof MatrixN);
		assert.deepStrictEqual(Array.from(resultMul.elements), [19, 22, 43, 50]);
	});
});
