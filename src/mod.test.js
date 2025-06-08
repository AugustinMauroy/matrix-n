import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { MatrixN, Mat2, Mat3, Mat4 } from "../src/mod.js";

const EPSILON = 1e-5; // Epsilon for floating point comparisons

describe("MatrixN Core Functionality", () => {
	it("should construct with dimensions and initialize with zeros", () => {
		const mat = new MatrixN(2, 3);

		assert.strictEqual(mat.rows, 2);
		assert.strictEqual(mat.cols, 3);
		assert.deepStrictEqual(Array.from(mat.elements), [0, 0, 0, 0, 0, 0]);
	});

	it("should construct with 1D initial data (row-major)", () => {
		const mat = new MatrixN(2, 2, [1, 2, 3, 4]);

		assert.deepStrictEqual(Array.from(mat.elements), [1, 2, 3, 4]);
	});

	it('should trhow error when "Initial data dimensions do not match matrix dimensions”', () => {
		assert.throws(
			() => new MatrixN(2, 4, [1, 2, 3]),
			/Initial flat data length does not match matrix dimensions/,
		);
	});

	it("should construct with 2D initial data", () => {
		const mat = new MatrixN(2, 2, [
			[1, 2],
			[3, 4],
		]);

		assert.deepStrictEqual(Array.from(mat.elements), [1, 2, 3, 4]);
	});

	it("should throw error for invalid dimensions in constructor", () => {
		assert.throws(
			() => new MatrixN(0, 2),
			/Matrix dimensions must be positive/,
		);
		assert.throws(
			() => new MatrixN(2, -1),
			/Matrix dimensions must be positive/,
		);
	});

	it("should throw error for mismatched initial data dimensions", () => {
		assert.throws(
			() => new MatrixN(2, 2, [1, 2, 3]),
			/Initial flat data length does not match/,
		);
		assert.throws(
			() => new MatrixN(2, 2, [[1, 2], [3]]),
			/Initial data dimensions do not match/,
		);
		assert.throws(
			() =>
				new MatrixN(2, 2, [
					[1, 2, 3],
					[4, 5, 6],
				]),
			/Initial data dimensions do not match/,
		);
		assert.throws(
			// @ts-expect-error testing invalid type
			() => new MatrixN(2, 2, [[1, 2], "not an array"]),
			/Initial data dimensions do not match matrix dimensions/,
		);
	});

	it("should throw error when 2D initialData has incorrect number of rows", () => {
		assert.throws(
			() =>
				new MatrixN(1, 2, [
					[1, 2],
					[3, 4],
				]), // rows=1, but data has 2 rows
			/Initial data dimensions do not match matrix dimensions/,
		);
	});

	it("MatrixN.fromArray should create a matrix from a 2D array", () => {
		const mat = MatrixN.fromArray([
			[1, 2],
			[3, 4],
		]);

		assert.strictEqual(mat.rows, 2);
		assert.strictEqual(mat.cols, 2);
		assert.deepStrictEqual(Array.from(mat.elements), [1, 2, 3, 4]);
	});

	it("MatrixN.fromArray should throw on invalid input", () => {
		assert.throws(
			() => MatrixN.fromArray([]),
			/Input must be a non-empty 2D array/,
		);
		assert.throws(
			// @ts-expect-error
			() => MatrixN.fromArray([[1], "not an array"]),
			/Input must be a non-empty 2D array/,
		); // Type cast for test
	});

	it("MatrixN.identity should create an identity matrix", () => {
		const mat = MatrixN.identity(3);

		assert.deepStrictEqual(
			Array.from(mat.elements),
			[1, 0, 0, 0, 1, 0, 0, 0, 1],
		);
		assert.strictEqual(mat.rows, 3);
		assert.strictEqual(mat.cols, 3);
	});

	it("MatrixN.zeros should create a zero matrix", () => {
		const mat = MatrixN.zeros(2, 3);

		assert.deepStrictEqual(Array.from(mat.elements), [0, 0, 0, 0, 0, 0]);
	});

	it("MatrixN.ones should create a matrix of ones", () => {
		const mat = MatrixN.ones(2, 2);

		assert.deepStrictEqual(Array.from(mat.elements), [1, 1, 1, 1]);
	});

	it("MatrixN.fill should create a matrix filled with a value", () => {
		const mat = MatrixN.fill(2, 2, 7);

		assert.deepStrictEqual(Array.from(mat.elements), [7, 7, 7, 7]);
	});

	it("getElement and setElement should work correctly", () => {
		const mat = new MatrixN(2, 2);

		mat.setElement(0, 1, 5);

		assert.strictEqual(mat.getElement(0, 1), 5);
		assert.throws(() => mat.getElement(2, 0), /Index out of bounds/);
		assert.throws(() => mat.setElement(0, 2, 1), /Index out of bounds/);
	});

	it("set should update all elements from a flat array", () => {
		const mat = new MatrixN(2, 2);

		mat.set([10, 20, 30, 40]);

		assert.deepStrictEqual(Array.from(mat.elements), [10, 20, 30, 40]);
		assert.throws(
			() => mat.set([1, 2, 3]),
			/Input array length does not match/,
		);
	});

	it("isSquare property should be correct", () => {
		assert.strictEqual(new MatrixN(2, 2).isSquare, true);
		assert.strictEqual(new MatrixN(2, 3).isSquare, false);
	});

	it("clone should create a deep copy", () => {
		const mat1 = new MatrixN(2, 2, [1, 2, 3, 4]);

		const mat2 = mat1.clone();

		assert.deepStrictEqual(
			Array.from(mat1.elements),
			Array.from(mat2.elements),
		);
		assert.notStrictEqual(mat1.elements, mat2.elements);
		mat2.setElement(0, 0, 99);
		assert.strictEqual(mat1.getElement(0, 0), 1);
		assert.strictEqual(mat2.getElement(0, 0), 99);
	});
});

describe("MatrixN Operations", () => {
	let m1//: MatrixN;
	let m2//: MatrixN;
	let m3//: MatrixN;

	beforeEach(() => {
		m1 = new MatrixN(2, 2, [1, 2, 3, 4]);
		m2 = new MatrixN(2, 2, [5, 6, 7, 8]);
		m3 = new MatrixN(2, 3, [1, 2, 3, 4, 5, 6]); // For incompatible dimension tests
	});

	it("add should perform element-wise addition", () => {
		const result = m1.add(m2);

		assert.deepStrictEqual(Array.from(result.elements), [6, 8, 10, 12]);
	});

	it("addSelf should perform in-place addition", () => {
		m1.addSelf(m2);

		assert.deepStrictEqual(Array.from(m1.elements), [6, 8, 10, 12]);
		assert.throws(
			() => m1.addSelf(m3),
			/Matrices must have the same dimensions for addition/,
		);
	});

	it("subtract should perform element-wise subtraction", () => {
		const result = m1.subtract(m2);

		assert.deepStrictEqual(Array.from(result.elements), [-4, -4, -4, -4]);
	});

	it("should throw error for add/subtract with incompatible dimensions", () => {
		const incompatible = new MatrixN(2, 3);

		assert.throws(
			() => m1.add(incompatible),
			/Matrices must have the same dimensions/,
		);
		assert.throws(
			() => m1.subtract(incompatible),
			/Matrices must have the same dimensions/,
		);
		assert.throws(
			() => m1.addSelf(incompatible), // Added this case
			/Matrices must have the same dimensions for addition/,
		);
	});

	it("multiplyScalar should multiply all elements by a scalar", () => {
		const result = m1.multiplyScalar(2);

		assert.deepStrictEqual(Array.from(result.elements), [2, 4, 6, 8]);
	});

	it("divideScalar should divide all elements by a scalar", () => {
		const result = m1.divideScalar(2);

		assert.deepStrictEqual(Array.from(result.elements), [0.5, 1, 1.5, 2]);
		assert.throws(() => m1.divideScalar(0), /Division by zero/);
	});

	it("multiply should perform matrix multiplication", () => {
		// m1: [[1,2],[3,4]] m2: [[5,6],[7,8]]
		// Expected: [[1*5+2*7, 1*6+2*8], [3*5+4*7, 3*6+4*8]] = [[19, 22], [43, 50]]
		const result = m1.multiply(m2);

		assert.deepStrictEqual(Array.from(result.elements), [19, 22, 43, 50]);

		const mRect1 = new MatrixN(2, 3, [1, 2, 3, 4, 5, 6]); // 2x3
		const mRect2 = new MatrixN(3, 2, [7, 8, 9, 10, 11, 12]); // 3x2

		// Expected: [[1*7+2*9+3*11, 1*8+2*10+3*12], [4*7+5*9+6*11, 4*8+5*10+6*12]]
		// = [[7+18+33, 8+20+36], [28+45+66, 32+50+72]]
		// = [[58, 64], [139, 154]]
		const resultRect = mRect1.multiply(mRect2);

		assert.strictEqual(resultRect.rows, 2);
		assert.strictEqual(resultRect.cols, 2);
		assert.deepStrictEqual(Array.from(resultRect.elements), [58, 64, 139, 154]);
	});

	it("multiply should throw error for incompatible dimensions", () => {
		const incompatible = new MatrixN(3, 2); // m1 is 2x2

		assert.throws(
			() => m1.multiply(incompatible),
			/Number of columns in the first matrix must equal number of rows/,
		);
	});

	it("transpose should swap rows and columns", () => {
		const mat = new MatrixN(2, 3, [1, 2, 3, 4, 5, 6]);

		const result = mat.transpose();

		assert.strictEqual(result.rows, 3);
		assert.strictEqual(result.cols, 2);
		assert.deepStrictEqual(Array.from(result.elements), [1, 4, 2, 5, 3, 6]);
	});

	it("determinant should calculate correctly for 1x1, 2x2, 3x3", () => {
		assert.strictEqual(new MatrixN(1, 1, [5]).determinant(), 5);
		assert.strictEqual(
			new MatrixN(2, 2, [1, 2, 3, 4]).determinant(),
			1 * 4 - 2 * 3,
		); // -2
		assert.strictEqual(
			new MatrixN(3, 3, [1, 2, 3, 0, 1, 4, 5, 6, 0]).determinant(),
			1 * (0 - 24) - 2 * (0 - 20) + 3 * (0 - 5),
		); // -24 + 40 - 15 = 1
	});

	it("determinant should calculate for 4x4 (cofactor expansion)", () => {
		const m = MatrixN.identity(4);

		assert.strictEqual(m.determinant(), 1);

		const m2 = new Mat4([
			// From a known example
			3, 2, 0, 1, 4, 0, 1, 2, 3, 0, 2, 1, 9, 2, 3, 1,
		]);

		assert.strictEqual(m2.determinant(), 23.99999928474422); // Known determinant
	});

	it("determinant should throw for non-square matrices", () => {
		assert.throws(
			() => new MatrixN(2, 3).determinant(),
			/Determinant can only be calculated for square matrices/,
		);
	});

	it("invert should calculate correctly for 1x1, 2x2, 3x3", () => {
		const m1x1 = new MatrixN(1, 1, [4]);

		const m1x1Inv = m1x1.invert();

		assert.strictEqual(m1x1Inv.getElement(0, 0), 1);

		const m2x2 = new MatrixN(2, 2, [4, 7, 2, 6]); // det = 24 - 14 = 10

		const m2x2Inv = m2x2.invert();

		// Expected: (1/10) * [[6, -7], [-2, 4]] = [[0.6, -0.7], [-0.2, 0.4]]
		assert.ok(Math.abs(m2x2Inv.getElement(0, 0) - 0.6) < EPSILON);
		assert.ok(Math.abs(m2x2Inv.getElement(0, 1) - -0.7) < EPSILON);
		assert.ok(Math.abs(m2x2Inv.getElement(1, 0) - -0.2) < EPSILON);
		assert.ok(Math.abs(m2x2Inv.getElement(1, 1) - 0.4) < EPSILON);
		assert.ok(m2x2.multiply(m2x2Inv).equals(MatrixN.identity(2), EPSILON));

		const m3x3 = new MatrixN(3, 3, [1, 2, 3, 0, 1, 4, 5, 6, 0]); // det = 1
		const m3x3Inv = m3x3.invert();

		assert.ok(m3x3.multiply(m3x3Inv).equals(MatrixN.identity(3), EPSILON));
	});

	it("invert should throw for non-square or singular matrices", () => {
		assert.throws(
			() => new MatrixN(2, 3).invert(),
			/Only square matrices can be inverted/,
		);
		assert.throws(
			() => new MatrixN(2, 2, [1, 1, 1, 1]).invert(),
			/Matrix is singular/,
		); // det = 0
	});

	it("invert should work for 4x4 identity", () => {
		const m = MatrixN.identity(4);

		const mInv = m.invert();

		assert.ok(m.multiply(mInv).equals(MatrixN.identity(4), EPSILON));
	});

	it("invert should work for a generic 4x4 matrix", () => {
		// Matrix from determinant test, det = 24
		const m4 = new Mat4([3, 2, 0, 1, 4, 0, 1, 2, 3, 0, 2, 1, 9, 2, 3, 1]);
		const m4Inv = m4.invert();
		assert.ok(
			m4.multiply(m4Inv).equals(MatrixN.identity(4), EPSILON),
			"M * M^-1 should be Identity",
		);

		// Another example
		const m = new MatrixN(
			4,
			4,
			[2, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
		);
		const expectedInv = new MatrixN(
			4,
			4,
			[0.5, 0, 0, 0, 0, 0.25, 0, 0, 0, 0, 1, -1, 0, 0, 0, 1],
		);
		const mInv = m.invert();
		assert.ok(
			mInv.equals(expectedInv, EPSILON),
			"Inverse of diagonal-like matrix",
		);
		assert.ok(m.multiply(mInv).equals(MatrixN.identity(4), EPSILON));
	});
});

describe("MatrixN Utility", () => {
	const m = new MatrixN(2, 2, [1, 2, 3, 4]);

	it("equals should compare matrices", () => {
		const mSame = new MatrixN(2, 2, [1, 2, 3, 4]);
		const mDiffVal = new MatrixN(2, 2, [1, 2, 3, 5]);
		const mDiffDim = new MatrixN(2, 3);

		assert.ok(m.equals(mSame));
		assert.ok(!m.equals(mDiffVal));
		assert.ok(!m.equals(mDiffDim));

		const mAlmost = new MatrixN(2, 2, [1.000001, 2.000001, 3.000001, 4.000001]);

		assert.ok(m.equals(mAlmost, 1e-5));
		assert.ok(!m.equals(mAlmost, 1e-7));
	});

	it("rank should return the rank of the matrix", () => {
		const mFullRank = new MatrixN(2, 2, [1, 2, 3, 4]);
		const mRankDef = new MatrixN(2, 2, [1, 2, 2, 4]); // Rank 1
		const mZero = new MatrixN(2, 2); // Rank 0
		const mRect = new MatrixN(2, 3, [1, 2, 3, 4, 5, 6]); // Rank 3
		const mSingular = new MatrixN(3, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9]); // Rank 2
		const mIdentity = MatrixN.identity(3); // Rank 3
		const mDiagonal = new MatrixN(3, 3, [1, 0, 0, 0, 2, 0, 0, 0, 3]); // Rank 3

		assert.strictEqual(mFullRank.rank(), 2);
		assert.strictEqual(mRankDef.rank(), 1);
		assert.strictEqual(mZero.rank(), 0);
		assert.strictEqual(mRect.rank(), 2);
		assert.strictEqual(mSingular.rank(), 3);
		assert.strictEqual(mIdentity.rank(), 3);
		assert.strictEqual(mDiagonal.rank(), 3);
	});

	it("toArray should convert to 2D array", () => {
		assert.deepStrictEqual(m.toArray(), [
			[1, 2],
			[3, 4],
		]);
	});

	it("toFlatArray should convert to Float32Array (copy)", () => {
		const flat = m.toFlatArray();

		assert.ok(flat instanceof Float32Array);
		assert.deepStrictEqual(Array.from(flat), [1, 2, 3, 4]);
		assert.notStrictEqual(flat, m.elements); // Should be a copy
	});

	it("toString should return a string representation", () => {
		const str = m.toString();

		assert.strictEqual(typeof str, "string");
		assert.ok(str.includes("[1.000, 2.000]"));
		assert.ok(str.includes("[3.000, 4.000]"));
	});

	it("parse should create a matrix from a string", () => {
		const str = "[1, 2, 3, 4]";
		const parsed = MatrixN.parse(str);

		assert.deepStrictEqual(Array.from(parsed.elements), [1, 2, 3, 4]);
		assert.strictEqual(parsed.rows, 2);
		assert.strictEqual(parsed.cols, 2);
	});

	it("parse should throw on invalid string", () => {
		const invalidStr = "[1,2,3]";

		assert.throws(
			() => MatrixN.parse(invalidStr),
			/Input string does not represent a square matrix./,
		);
	});

	it("toJSON should serialize correctly", () => {
		const mat = new MatrixN(2, 2, [1, 2, 3, 4]);
		const json = mat.toJSON();

		assert.deepStrictEqual(json, {
			rows: 2,
			cols: 2,
			elements: [1, 2, 3, 4],
		});
	});

	it("fromJSON should deserialize correctly", () => {
		const json = {
			rows: 2,
			cols: 2,
			elements: [1, 2, 3, 4],
		};

		const mat = MatrixN.fromJSON(json);

		assert.deepStrictEqual(Array.from(mat.elements), [1, 2, 3, 4]);
		assert.strictEqual(mat.rows, 2);
		assert.strictEqual(mat.cols, 2);
	});

	it("fromJSON should throw on invalid input", () => {
		const invalidJson = {
			rows: 2,
			cols: "a",
			elements: [1, 2, 3],
		};

		assert.throws(
			// @ts-expect-error
			() => MatrixN.fromJSON(invalidJson),
			/Invalid JSON format./,
		);
	});

	it("minor should extract submatrix correctly", () => {
		const mat = new MatrixN(3, 3, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
		const minor02 = mat.minor(0, 2);

		assert.strictEqual(minor02.rows, 2);
		assert.strictEqual(minor02.cols, 2);
		assert.deepStrictEqual(Array.from(minor02.elements), [4, 5, 7, 8]);
	});

	it("minor should throw for non-square matrices", () => {
		const nonSquare = new MatrixN(2, 3, [1, 2, 3, 4, 5, 6]);

		assert.throws(
			() => nonSquare.minor(0, 0),
			/Minor can only be calculated for square matrices/,
		);
	});
});

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
