const gcd = v => {
    const absMin = Math.abs(v.reduce((acc, curr) => (curr === 0 || Math.abs(acc) < Math.abs(curr)) ? acc : curr ))
    if (absMin === 0) {
        return 0
    }

    const r = gcd (v.map( n => n%absMin))
    if (r === 0) {
        return absMin
    }

    return r
}

const Matrix = function (n,m) {
    const buffer = new ArrayBuffer(n*m*Float64Array.BYTES_PER_ELEMENT);
    const values = new Float64Array(buffer);
    values.forEach((x,i,a) => a[i] = Math.floor(
        20
        *2*(Math.random()-0.5)
        *2*(Math.random()-0.5)
        * 2 * (Math.random() - 0.5)
    ))
    
    const matrixFunc = function() {
        if (arguments.length == 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
            return values[arguments[0]*m + arguments[1]]
        } else if (arguments.length == 3 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number' && typeof arguments[2] === 'number') {
            values[arguments[0]*m + arguments[1]] = arguments[2]
            return matrixFunc
        } else if (arguments.length == 1 && arguments[0].__isMatrix) {
            return matrixFunc.multiply(arguments[0])
        } else if (arguments.length == 1 && typeof arguments[0] === 'string' && arguments[0].toLowerCase() === 't') {
            return matrixFunc.transpose()
        }
    }


    Object.defineProperties(matrixFunc, {
        __isMatrix: {
            enumerable: false,
            configurable: false,
            get: () => true,
        },
        rows: {
            enumerable: false,
            configurable: false,
            get: () => n
        },
        cols: {
            enumerable: false,
            configurable: false,
            get: () => m
        },
        multiply: {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (B) {
                const A = matrixFunc;
                let C = new Matrix(A.rows,B.cols);
    
                let K = Math.min(A.cols, B.rows);
    
                for (let i = 0; i < A.rows; i++) {
                    for (let j = 0; j < B.cols; j++) {
                        const index = i*C.cols+j;
                        C(i,j,0)
                        for (let k = 0; k < K; k++) {
                            C(i,j,C(i,j) + A(i,k) * B(k,j))
                        }
                    }
                }

    
                return C
            }
        },
        getArray: {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function () {
                const a = [];
                for (let i = 0; i < matrixFunc.rows; i++) {
                    console.log(i,i*matrixFunc.cols, matrixFunc.cols + i*matrixFunc.cols)
                console.log(new Float64Array(buffer,i*matrixFunc.cols,matrixFunc.cols))
                    a.push(new Float64Array(buffer,i*matrixFunc.cols,1))
                }
                return a;
            }
        },
        toLatex: {
            enumerable: false,
            configurable: false,
            writable: true,
            value: function () {
                let texCode = ''
                texCode += '\\left(\n\t\\begin{array}{'+'c'.repeat(matrixFunc.cols)+'}\n'
                
                for (let i = 0; i < matrixFunc.rows; i++) {
                    texCode += '\t\t'
                    for (let j = 0; j < matrixFunc.cols; j++) {
                        texCode += '' + matrixFunc(i,j) + ((j < matrixFunc.cols -1) ? ' & ' : '\\\\')
                    }
                    texCode += '\n'
                }

                texCode += '\t\\end{array}\n\\right)'
                return texCode
            }
        },
        det: {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function () {
                if (matrixFunc.cols != matrixFunc.rows) {
                    return null
                }

                return 0
            }
        },
        transpose: {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function () {
                let C = new Matrix(matrixFunc.cols,matrixFunc.rows);
                for (let i = 0; i < matrixFunc.rows; i++) {
                    for (let j = 0; j < matrixFunc.cols; j++) {
                        C(j,i,matrixFunc(i,j))
                    }
                }
                return C
            }
        },
        forEach: {
            enumerable: true,
            configurable: false,
            writable: false,
            value: function (f) {
                for (let i = 0; i < matrixFunc.rows; i++) {
                    for (let j = 0; j < matrixFunc.cols; j++) {
                        f(matrixFunc(i,j),i,j,matrixFunc)
                    }
                }
            }
        },

        swapRows: {
            enumerable: true,
            configurable: false,
            writable: false,
            value: function (i1,i2) {
                for (let j = 0; j < matrixFunc.cols; j++) {
                    const a = matrixFunc(i1,j)
                    matrixFunc(i1,j,matrixFunc(i2,j))
                    matrixFunc(i2,j,a)
                }
            }
        },
        swapCols: {
            enumerable: true,
            configurable: false,
            writable: false,
            value: function (j1,j2) {
                for (let i = 0; i < matrixFunc.rows; i++) {
                    const a = matrixFunc(i,j1)
                    matrixFunc(i,j1,matrixFunc(i,j2))
                    matrixFunc(i,j2,a)
                }
            }
        },
        inv: {
            enumerable: true,
            configurable: true,
            writable: true,
            value: function () {
                const plu = Matrix.plu(matrixFunc)
                const L_inv = Matrix.invLowerTriangular(plu['L'])
                const U_inv = Matrix.invLowerTriangular(plu['U']('t'))('t')
                return U_inv(L_inv)
            }
        },
        
    });

    return matrixFunc;

};

//Matrix.prototype = Object.create(Float64Array.prototype);

Object.defineProperties(Matrix, {

    value: {
        enumerable: false,
        configurable: false,
        get: function() {
            return (i,j) => this[this.cols*i + j]
        }
    },
    zeros: {
        enumerable: true,
        configurable: false,
        writable: true,
        value: function(n,m) {
            const C = new Matrix(n,m)
            C.forEach((e,i,j,C) => C(i,j,0))
            return C
        }
    },
    id: {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function(n) {
            const C = new Matrix(n,n)
            C.forEach((e,i,j,C) => C(i,j, i == j ? 1 : 0))
            return C
        }
    },
    random: {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function(n,m) {
            const C = new Matrix(n,m)
            C.forEach((e,i,j,C) => C(i,j, Math.floor(
                20
                *2*(Math.random()-0.5)
                *2*(Math.random()-0.5)
                * 2 * (Math.random() - 0.5)
            )))
            return C
        }
    },
    randomInvertible: {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function(n) {
            const L = new Matrix(n,n)
            L.forEach((e,i,j,C) => C(i,j,
                i > j ?

                    Math.floor(
                        20
                        *2*(Math.random()-0.5)
                        *2*(Math.random()-0.5)
                        * 2 * (Math.random() - 0.5)
                    )
                : (
                    i == j ?
                        1
                    :
                        0
                )
            ))

            const U = new Matrix(n,n)
            U.forEach((e,i,j,C) => C(i,j,
                i < j ?

                    Math.floor(
                        20
                        * 2 * (Math.random()-0.5)
                        * 2 * (Math.random()-0.5)
                        * 2 * (Math.random() - 0.5)
                    )
                : (
                    i == j ?
                        1
                    :
                        0
                )
            ))

            return L(U)
        }
    },

    invLowerTriangular: {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function (L) {
            const A = Matrix.zeros(L.rows,L.cols) 
            for (let j = 0; j < L.cols; j++) {
                A(j,j,1/L(j,j))
                for (let i = j+1; i < L.rows; i++) {
                    let s = 0;
                    for (let jj = j; jj < i; jj++) {
                        s += L(i,jj)*A(jj,j)
                    }
                    A(i,j, -s/L(i,i))
                }
            }
            return A
        }
    },

    plu: {
        enumerable: true,
        configurable: false,
        writable: false,
        value: function (A) {
            const p = [];
            for (let i = 0; i < A.rows; i++) {
                p.push(i)
            }
            
            const L = Matrix.id(A.rows)
            const U = A('t')('t') // a way to copy matrix

            const swap = (i,j) => {
                const a = p[i]
                p[i] = p[j]
                p[j] = a
            }

            for (let j = 0; j < A.cols; j++) {
                for (let i = j + 1; i < A.rows; i++) {
                    const g = gcd([U(j,j),U(i,j)])
                    const coefJ = U(i,j)/g
                    const coefI = U(j,j)/g 

                    for (let jj = 0; jj < U.cols; jj++) {
                        U(i,jj,coefJ * U(j,jj) - coefI * U(i,jj))
                    }

                    for (let jj = 0; jj < L.cols; jj++) {
                        L(i,jj,coefJ * L(j,jj) - coefI * L(i,jj))
                    }

                }
            }

            return {'perm': p, 'L': Matrix.invLowerTriangular(L), 'U': U}
        }
    },
});