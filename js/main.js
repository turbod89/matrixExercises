const Matrix = function (n,m) {

    const values = new Float64Array(n*m)
    
    const matrixFunc = function() {
        if (arguments.length == 2 && typeof arguments[0] === 'number' && typeof arguments[1] === 'number') {
            return values[arguments[0]*m + arguments[1]]
        } else if (arguments.length == 1 && arguments[0].__isMatrix) {
            return matrixFunc.multiply(arguments[0])
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
                        const index = i*A.cols+j;
                        C[index] = 0;
                        for (let k = 0; k < K; k++) {
                            C[index] += A(i,k) * B(k,j)
                        }
                    }
                }
    
                return C
            }
        },
    });

    return matrix;

};

//Matrix.prototype = Object.create(Float64Array.prototype);

Object.defineProperties(Matrix.prototype, {

    value: {
        enumerable: false,
        configurable: false,
        get: function() {
            return (i,j) => this[this.cols*i + j]
        }
    },
    
});

window.addEventListener('load', event => {

    const A = new Matrix(2,2);
    const B = new Matrix(2,2);
    const C = A.multiply(B);
    console.log(A,B,C)


})