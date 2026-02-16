# @augustinmauroy/matrix-n

A JavaScript library for matrix operations, including addition, multiplication, and inversion. It supports matrices of any size and provides a simple API for common operations.

[![npm version](https://img.shields.io/npm/v/@augustinmauroy/matrix-n.svg)](https://www.npmjs.com/package/@augustinmauroy/matrix-n)
[![JSR](https://jsr.io/badges/@augustinmauroy/matrix-n)](https://jsr.io/@augustinmauroy/matrix-n)
[![codecov](https://codecov.io/gh/AugustinMauroy/matrix-n/graph/badge.svg?token=MZVSB35XDG)](https://codecov.io/gh/AugustinMauroy/matrix-n)

> **NOTE** This package is tested with [Node.js](https://nodejs.org/en/) but the package din't use any Node.js specific feature. It should work in any JavaScript environment (browser, Deno, etc.). If you encounter any issue, please open an issue on [GitHub](https://github.com/AugustinMauroy/matrix-n/issues).

> [!NOTE]
> This lib is in `0.x.x` version. The API is not definitive and may change in the future. Your feedback is welcome!
> Please open an issue on [GitHub](https://github.com/AugustinMauroy/matrix-n/issues) if you have any suggestion or if you encounter any issue.

## Performance & Limitations

### Performance Characteristics

- **Matrix Multiplication**: $O(n^3)$ using standard algorithm. For large matrices (n > 1000), consider using specialized libraries like [numeric.js](https://numericjs.org/) or [math.js](https://mathjs.org/).
- **Determinant Calculation**: Cofactor expansion for matrices ≤ 3×3 ($O(1)$), LU decomposition for larger matrices ($O(n^3)$).
- **Matrix Inversion**: Uses LU decomposition ($O(n^3)$).
- **Rank Calculation**: Gaussian elimination ($O(n^3)$).

### Limitations

- **Numerical Stability**: This library uses standard floating-point arithmetic. Large or ill-conditioned matrices may result in numerical instability. For numerical computing, consider [JSMath](https://www.jsmathtools.org/) or [sylvester.js](http://sylvester.jcoglan.com/).
- **Algorithm Optimization**: No SIMD or GPU acceleration. Not suitable for real-time 3D graphics or scientific computing at scale.
- **Missing Decompositions**: Does not include QR decomposition, eigenvalue decomposition, or singular value decomposition (SVD).
- **Precision**: Uses `Float32Array` for storage, limiting precision to ~7 decimal places. For higher precision, use `BigDecimal` libraries.

## Example

```typescript
import { MatrixN, Mat2, Mat3 } from "@augustinmauroy/matrix-n";

const m1 = new MatrixN(2, 3, [[1, 2, 3], [4, 5, 6]]);
console.log("M1:\n" + m1.toString());

const m2 = MatrixN.fill(2, 3, 2);
console.log("M2:\n" + m2.toString());

const m3 = m1.add(m2);
console.log("M1 + M2:\n" + m3.toString());

m1.addSelf(m2);
console.log("M1 += M2 (in-place):\n" + m1.toString());


const m4 = new MatrixN(3, 2, [[7, 8], [9, 10], [11, 12]]);
console.log("M4:\n" + m4.toString());

const m5 = m1.multiply(m4); // M1 is now 2x3, M4 is 3x2 -> result 2x2
console.log("M1 * M4:\n" + m5.toString());

const mId = Mat3.identity();
console.log("Mat3 Identity:\n" + mId.toString());

const matA = new Mat2([4, 7, 2, 6]);
console.log("MatA (2x2):\n" + matA.toString());
console.log("Determinant of MatA:", matA.determinant());
const invA = matA.invert();
console.log("Inverse of MatA:\n" + invA.toString());
console.log("MatA * InvA:\n" + matA.multiply(invA).toString()); // Should be identity

const matB = new Mat3([
    [1, 2, 3],
    [0, 1, 4],
    [5, 6, 0]
]);
console.log("MatB (3x3):\n" + matB.toString());
console.log("Determinant of MatB:", matB.determinant());
const invB = matB.invert();
console.log("Inverse of MatB:\n" + invB.toString());
console.log("MatB * InvB:\n" + matB.multiply(invB).toString()); // Should be identity (approx due to float errors)

try {
    const nonSquare = new MatrixN(2,3);
    // nonSquare.determinant(); // This would throw error
    const singular = new Mat2([1,1,1,1]);
    // singular.invert(); // This would throw error
} catch (e: any) {
    console.error("Error:", e.message);
}

const mBig = MatrixN.identity(4);
// console.log("Det of 4x4 Identity:", mBig.determinant()); // Uses cofactor expansion
// const mBigInv = mBig.invert();
// console.log("Inverse of 4x4 Identity:\n", mBigInv.toString());
```
