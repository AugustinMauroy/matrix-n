/* @ts-self-types="./mod.d.ts" */

/**
 * Represents a generic N x M matrix.
 */
export class MatrixN {
	public readonly rows: number;
	public readonly cols: number;
	public elements: Float32Array;

	/**
	 * Creates an instance of MatrixN.
	 * @param rows - Number of rows.
	 * @param cols - Number of columns.
	 * @param initialData - Optional flat array (row-major) or 2D array to initialize matrix elements.
	 *                    If not provided, matrix is initialized with zeros.
	 */
	constructor(rows: number, cols: number, initialData?: number[] | number[][]) {
		if (rows <= 0 || cols <= 0) {
			throw new Error("Matrix dimensions must be positive.");
		}
		this.rows = rows;
		this.cols = cols;
		this.elements = new Float32Array(rows * cols);

		if (initialData) {
			if (Array.isArray(initialData[0])) {
				// 2D array
				const data2D = initialData as number[][];
				if (data2D.length !== rows) {
					throw new Error(
						"Initial data dimensions do not match matrix dimensions.",
					);
				}
				for (let i = 0; i < rows; i++) {
					if (!Array.isArray(data2D[i]) || data2D[i].length !== cols) {
						throw new Error(
							"Initial data dimensions do not match matrix dimensions.",
						);
					}
					for (let j = 0; j < cols; j++) {
						this.elements[i * cols + j] = data2D[i][j];
					}
				}
			} else {
				// Flat array
				const data1D = initialData as number[];
				if (data1D.length !== rows * cols) {
					throw new Error(
						"Initial flat data length does not match matrix dimensions.",
					);
				}
				this.elements.set(data1D);
			}
		}
	}

	/**
	 * Creates a MatrixN from a 2D array.
	 * @param arrayOfArrays - Data to initialize the matrix.
	 * @returns A new MatrixN instance.
	 */
	static fromArray(arrayOfArrays: number[][]): MatrixN {
		if (!Array.isArray(arrayOfArrays) || arrayOfArrays.length === 0) {
			throw new Error("Input must be a non-empty 2D array.");
		}
		const rows = arrayOfArrays.length;
		let cols = 0; // Will be determined by the first row

		for (let i = 0; i < rows; i++) {
			if (!Array.isArray(arrayOfArrays[i])) {
				throw new Error("Input must be a non-empty 2D array.");
			}
			if (i === 0) {
				cols = arrayOfArrays[i].length;
			}
			// The MatrixN constructor will validate if all rows have the same 'cols' length
			// and if 'cols' is positive.
		}
		// If arrayOfArrays was [[]], rows = 1, cols = 0. Constructor will throw.
		return new MatrixN(rows, cols, arrayOfArrays);
	}

	/**
	 * Creates an identity matrix of a given size.
	 * @param size - The number of rows and columns for the identity matrix.
	 * @returns A new square MatrixN instance.
	 */
	static identity(size: number): MatrixN {
		const mat = new MatrixN(size, size);
		for (let i = 0; i < size; i++) {
			mat.elements[i * size + i] = 1;
		}
		return mat;
	}

	/**
	 * Creates a matrix filled with zeros.
	 * @param rows - Number of rows.
	 * @param cols - Number of columns.
	 * @returns A new MatrixN instance.
	 */
	static zeros(rows: number, cols: number): MatrixN {
		return new MatrixN(rows, cols);
	}

	/**
	 * Creates a matrix filled with ones.
	 * @param rows - Number of rows.
	 * @param cols - Number of columns.
	 * @returns A new MatrixN instance.
	 */
	static ones(rows: number, cols: number): MatrixN {
		const mat = new MatrixN(rows, cols);
		mat.elements.fill(1);
		return mat;
	}

	/**
	 * Creates a matrix filled with a specific value.
	 * @param rows - Number of rows.
	 * @param cols - Number of columns.
	 * @param value - The value to fill the matrix with.
	 * @returns A new MatrixN instance.
	 */
	static fill(rows: number, cols: number, value: number): MatrixN {
		const mat = new MatrixN(rows, cols);
		mat.elements.fill(value);
		return mat;
	}

	/**
	 * Gets an element at the specified row and column.
	 * @param row - Row index.
	 * @param col - Column index.
	 * @returns The element value.
	 */
	getElement(row: number, col: number): number {
		if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
			throw new Error("Index out of bounds.");
		}
		return this.elements[row * this.cols + col];
	}

	/**
	 * Sets an element at the specified row and column.
	 * @param row - Row index.
	 * @param col - Column index.
	 * @param value - The value to set.
	 * @returns The current matrix instance for chaining.
	 */
	setElement(row: number, col: number, value: number): this {
		if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
			throw new Error("Index out of bounds.");
		}
		this.elements[row * this.cols + col] = value;
		return this;
	}

	/**
	 * Sets all elements of the matrix from a flat array (row-major).
	 * @param values - Flat array of numbers.
	 * @returns The current matrix instance for chaining.
	 */
	set(values: number[]): this {
		if (values.length !== this.elements.length) {
			throw new Error("Input array length does not match matrix dimensions.");
		}
		this.elements.set(values);
		return this;
	}

	/**
	 * Checks if the matrix is a square matrix.
	 * @returns True if rows === cols, false otherwise.
	 */
	get isSquare(): boolean {
		return this.rows === this.cols;
	}

	/**
	 * Clones the matrix.
	 * @returns A new MatrixN instance with the same elements.
	 */
	clone(): MatrixN {
		const newMat = new MatrixN(this.rows, this.cols);
		newMat.elements.set(this.elements);
		return newMat;
	}

	/**
	 * Adds another matrix to this matrix.
	 * @param other - The matrix to add.
	 * @returns A new MatrixN instance with the result.
	 */
	add(other: MatrixN): MatrixN {
		if (this.rows !== other.rows || this.cols !== other.cols) {
			throw new Error("Matrices must have the same dimensions for addition.");
		}
		const result = new MatrixN(this.rows, this.cols);
		for (let i = 0; i < this.elements.length; i++) {
			result.elements[i] = this.elements[i] + other.elements[i];
		}
		return result;
	}

	/**
	 * Adds another matrix to this matrix (in-place).
	 * @param other - The matrix to add.
	 * @returns The current matrix instance.
	 */
	addSelf(other: MatrixN): this {
		if (this.rows !== other.rows || this.cols !== other.cols) {
			throw new Error("Matrices must have the same dimensions for addition.");
		}
		for (let i = 0; i < this.elements.length; i++) {
			this.elements[i] += other.elements[i];
		}
		return this;
	}

	/**
	 * Subtracts another matrix from this matrix.
	 * @param other - The matrix to subtract.
	 * @returns A new MatrixN instance with the result.
	 */
	subtract(other: MatrixN): MatrixN {
		if (this.rows !== other.rows || this.cols !== other.cols) {
			throw new Error(
				"Matrices must have the same dimensions for subtraction.",
			);
		}
		const result = new MatrixN(this.rows, this.cols);
		for (let i = 0; i < this.elements.length; i++) {
			result.elements[i] = this.elements[i] - other.elements[i];
		}
		return result;
	}

	/**
	 * Multiplies this matrix by a scalar.
	 * @param scalar - The scalar value.
	 * @returns A new MatrixN instance with the result.
	 */
	multiplyScalar(scalar: number): MatrixN {
		const result = new MatrixN(this.rows, this.cols);
		for (let i = 0; i < this.elements.length; i++) {
			result.elements[i] = this.elements[i] * scalar;
		}
		return result;
	}

	/**
	 * Divides this matrix by a scalar.
	 * @param scalar - The scalar value.
	 * @returns A new MatrixN instance with the result.
	 */
	divideScalar(scalar: number): MatrixN {
		if (scalar === 0) {
			throw new Error("Division by zero.");
		}
		const result = new MatrixN(this.rows, this.cols);
		for (let i = 0; i < this.elements.length; i++) {
			result.elements[i] = this.elements[i] / scalar;
		}
		return result;
	}

	/**
	 * Multiplies this matrix by another matrix (this * other).
	 * @param other - The matrix to multiply by.
	 * @returns A new MatrixN instance with the result.
	 */
	multiply(other: MatrixN): MatrixN {
		if (this.cols !== other.rows) {
			throw new Error(
				"Number of columns in the first matrix must equal number of rows in the second matrix.",
			);
		}
		const result = new MatrixN(this.rows, other.cols);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < other.cols; j++) {
				let sum = 0;
				for (let k = 0; k < this.cols; k++) {
					sum +=
						this.elements[i * this.cols + k] *
						other.elements[k * other.cols + j];
				}
				result.elements[i * other.cols + j] = sum;
			}
		}
		return result;
	}

	/**
	 * Transposes this matrix.
	 * @returns A new MatrixN instance with the transposed matrix.
	 */
	transpose(): MatrixN {
		const result = new MatrixN(this.cols, this.rows);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				result.elements[j * this.rows + i] = this.elements[i * this.cols + j];
			}
		}
		return result;
	}

	/**
	 * Calculates the determinant of this matrix.
	 * Only implemented for 1x1, 2x2, and 3x3 matrices for this example.
	 * For larger matrices, a more general algorithm (e.g., LU decomposition) is needed.
	 * @returns The determinant value.
	 */
	determinant(): number {
		if (!this.isSquare) {
			throw new Error(
				"Determinant can only be calculated for square matrices.",
			);
		}
		const n = this.rows;
		const m = this.elements;

		if (n === 1) {
			return m[0];
		}
		if (n === 2) {
			return m[0] * m[3] - m[1] * m[2];
		}
		if (n === 3) {
			return (
				m[0] * (m[4] * m[8] - m[5] * m[7]) -
				m[1] * (m[3] * m[8] - m[5] * m[6]) +
				m[2] * (m[3] * m[7] - m[4] * m[6])
			);
		}
		// For n > 3, a more general algorithm like cofactor expansion or LU decomposition is needed.
		// This is a placeholder and not a general solution for n > 3.
		if (n > 3) {
			console.warn(
				"Determinant calculation for N > 3 is not fully implemented in this basic version and may be incorrect or slow. Using cofactor expansion.",
			);
			let det = 0;
			if (n === 0) return 1; // Or throw error

			for (let j = 0; j < n; j++) {
				det +=
					(j % 2 === 1 ? -1 : 1) *
					this.getElement(0, j) *
					this.minor(0, j).determinant();
			}
			return det;
		}
	}

	/**
	 * Calculates the minor of an element.
	 * @param r - Row to exclude.
	 * @param c - Column to exclude.
	 * @returns A new MatrixN instance representing the minor.
	 */
	minor(r: number, c: number): MatrixN {
		if (!this.isSquare)
			throw new Error("Minor can only be calculated for square matrices.");
		const result = MatrixN.zeros(this.rows - 1, this.cols - 1);
		let ri = 0;
		for (let i = 0; i < this.rows; i++) {
			if (i === r) continue;
			let ci = 0;
			for (let j = 0; j < this.cols; j++) {
				if (j === c) continue;
				result.setElement(ri, ci, this.getElement(i, j));
				ci++;
			}
			ri++;
		}
		return result;
	}

	/**
	 * Inverts this matrix.
	 * Only implemented for 1x1, 2x2, and 3x3 matrices for this example.
	 * @returns A new MatrixN instance with the inverted matrix.
	 */
	invert(): MatrixN {
		if (!this.isSquare) {
			throw new Error("Only square matrices can be inverted.");
		}
		const n = this.rows;
		const det = this.determinant();

		if (Math.abs(det) < 1e-10) {
			// Using a small epsilon for float comparison
			throw new Error(
				"Matrix is singular and cannot be inverted (determinant is zero).",
			);
		}

		const m = this.elements;
		const invDet = 1 / det;

		if (n === 1) {
			return new MatrixN(1, 1, [invDet * m[0]]);
		}

		if (n === 2) {
			const result = new MatrixN(2, 2);
			result.elements[0] = m[3] * invDet;
			result.elements[1] = -m[1] * invDet;
			result.elements[2] = -m[2] * invDet;
			result.elements[3] = m[0] * invDet;
			return result;
		}

		if (n === 3) {
			const result = new MatrixN(3, 3);
			result.elements[0] = (m[4] * m[8] - m[5] * m[7]) * invDet;
			result.elements[1] = (m[2] * m[7] - m[1] * m[8]) * invDet;
			result.elements[2] = (m[1] * m[5] - m[2] * m[4]) * invDet;
			result.elements[3] = (m[5] * m[6] - m[3] * m[8]) * invDet;
			result.elements[4] = (m[0] * m[8] - m[2] * m[6]) * invDet;
			result.elements[5] = (m[2] * m[3] - m[0] * m[5]) * invDet;
			result.elements[6] = (m[3] * m[7] - m[4] * m[6]) * invDet;
			result.elements[7] = (m[1] * m[6] - m[0] * m[7]) * invDet;
			result.elements[8] = (m[0] * m[4] - m[1] * m[3]) * invDet;
			return result;
		}

		// Adjoint method for general N
		if (n > 3) {
			console.warn(
				"Inversion for N > 3 is not fully implemented in this basic version and may be incorrect or slow. Using Adjoint method.",
			);
			const adj = MatrixN.zeros(n, n);
			for (let i = 0; i < n; i++) {
				for (let j = 0; j < n; j++) {
					const sign = (i + j) % 2 === 0 ? 1 : -1;
					adj.setElement(j, i, sign * this.minor(i, j).determinant()); // Note transpose for adjugate
				}
			}
			return adj.multiplyScalar(invDet);
		}
	}

	/**
	 * Checks if this matrix is equal to another matrix within an optional epsilon.
	 * @param other - The matrix to compare with.
	 * @param epsilon - Tolerance for floating point comparison.
	 * @returns True if matrices are equal, false otherwise.
	 */
	equals(other: MatrixN, epsilon = 1e-6): boolean {
		if (this.rows !== other.rows || this.cols !== other.cols) {
			return false;
		}
		for (let i = 0; i < this.elements.length; i++) {
			if (Math.abs(this.elements[i] - other.elements[i]) > epsilon) {
				return false;
			}
		}
		return true;
	}

	/**
	 * Converts the matrix to a 2D array.
	 * @returns A 2D array representation of the matrix.
	 */
	toArray(): number[][] {
		const arr: number[][] = [];
		for (let i = 0; i < this.rows; i++) {
			arr[i] = [];
			for (let j = 0; j < this.cols; j++) {
				arr[i][j] = this.elements[i * this.cols + j];
			}
		}
		return arr;
	}

	/**
	 * Converts the matrix to a flat 1D array (row-major).
	 * @returns A Float32Array containing the matrix elements.
	 */
	toFlatArray(): Float32Array {
		return new Float32Array(this.elements); // Return a copy
	}

	/**
	 * Returns a string representation of the matrix.
	 * @returns A string representing the matrix.
	 */
	toString(): string {
		let str = "";
		for (let i = 0; i < this.rows; i++) {
			str += "[";
			for (let j = 0; j < this.cols; j++) {
				str += this.elements[i * this.cols + j].toFixed(3); // Fixed to 3 decimal places for readability
				if (j < this.cols - 1) {
					str += ", ";
				}
			}
			str += "]";
			if (i < this.rows - 1) {
				str += "\n";
			}
		}
		return str;
	}

	/**
	 * Parses a string representation of the matrix.
	 * @param str - The string to parse.
	 * @returns A new MatrixN instance.
	 * @example
	 * const mat = MatrixN.parse("[1, 2, 3, 4]");
	 */
	static parse(str: string): MatrixN {
		const elements = new Float32Array(
			str
				.replace(/[\[\]]/g, "") // Remove brackets
				.split(",")
				.map((s) => Number.parseFloat(s.trim())),
		);
		const size = Math.sqrt(elements.length);
		if (!Number.isInteger(size)) {
			throw new Error("Input string does not represent a square matrix.");
		}
		return new MatrixN(size, size, Array.from(elements));
	}

	/**
	 * Returns a JSON representation of the matrix.
	 * @returns A JSON object representing the matrix.
	 */
	toJSON(): object {
		return {
			rows: this.rows,
			cols: this.cols,
			elements: Array.from(this.elements), // Convert Float32Array to regular array
		};
	}

	/**
	 * Creates a matrix from a JSON object.
	 * @param json - The JSON object to create the matrix from.
	 * @returns A new MatrixN instance.
	 */
	static fromJSON(json: {
		rows: number;
		cols: number;
		elements: number[];
	}): MatrixN {
		if (
			!json ||
			!Array.isArray(json.elements) ||
			json.elements.length === 0 ||
			typeof json.rows !== "number" ||
			typeof json.cols !== "number"
		) {
			throw new Error("Invalid JSON format.");
		}
		return new MatrixN(json.rows, json.cols, json.elements);
	}
}

// --- Fixed Size Matrix Classes (Mat2, Mat3, Mat4) ---
// These can be implemented as classes that extend MatrixN or as standalone
// classes with optimized operations if needed. For simplicity, they are shown
// here as type aliases and static methods for construction, relying on MatrixN
// for operations. A more optimized library might have dedicated implementations.

/**
 * Represents a 2x2 Matrix. Extends MatrixN.
 */
export class Mat2 extends MatrixN {
	constructor(initialData?: number[] | number[][]) {
		if (initialData) {
			if (Array.isArray(initialData[0])) {
				// 2D array
				const data2D = initialData as number[][];
				if (data2D.length !== 2) {
					throw new Error("Mat2 initial data must be 2x2.");
				}
				for (let i = 0; i < 2; i++) {
					if (!Array.isArray(data2D[i]) || data2D[i].length !== 2) {
						throw new Error("Mat2 initial data must be 2x2.");
					}
				}
			} else {
				// Flat array
				const data1D = initialData as number[];
				if (data1D.length !== 4) {
					throw new Error("Mat2 initial flat data must have 4 elements.");
				}
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
	// Override methods like determinant, invert for specific 2x2 optimizations if needed
	// determinant(): number { ... }
	// invert(): Mat2 { ... }
}

/**
 * Represents a 3x3 Matrix. Extends MatrixN.
 */
export class Mat3 extends MatrixN {
	constructor(initialData?: number[] | number[][]) {
		if (initialData) {
			if (Array.isArray(initialData[0])) {
				// 2D array
				const data2D = initialData as number[][];
				if (data2D.length !== 3) {
					throw new Error("Mat3 initial data must be 3x3.");
				}
				for (let i = 0; i < 3; i++) {
					if (!Array.isArray(data2D[i]) || data2D[i].length !== 3) {
						throw new Error("Mat3 initial data must be 3x3.");
					}
				}
			} else {
				// Flat array
				const data1D = initialData as number[];
				if (data1D.length !== 9) {
					throw new Error("Mat3 initial flat data must have 9 elements.");
				}
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
	// Override methods for specific 3x3 optimizations
}

/**
 * Represents a 4x4 Matrix. Extends MatrixN.
 */
export class Mat4 extends MatrixN {
	constructor(initialData?: number[] | number[][]) {
		if (initialData) {
			if (Array.isArray(initialData[0])) {
				// 2D array
				const data2D = initialData as number[][];
				if (data2D.length !== 4) {
					throw new Error("Mat4 initial data must be 4x4.");
				}
				for (let i = 0; i < 4; i++) {
					if (!Array.isArray(data2D[i]) || data2D[i].length !== 4) {
						throw new Error("Mat4 initial data must be 4x4.");
					}
				}
			} else {
				// Flat array
				const data1D = initialData as number[];
				if (data1D.length !== 16) {
					throw new Error("Mat4 initial flat data must have 16 elements.");
				}
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
	// Override methods for specific 4x4 optimizations.
	// Note: Determinant and Invert for 4x4 are more complex and are often
	// implemented with specific optimized algorithms rather than generic cofactor expansion.
	// The MatrixN versions will be used if not overridden.
}
