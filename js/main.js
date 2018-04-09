const Matrix = function (n,m) {
    
    Object.defineProperties(this, {
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
        value: {
            enumerable: false,
            configurable: false,
            get: function() {
                return (i,j) => this[m*i + j]
            }
        },
        multiply: {
            enumerable: false,
            configurable: false,
            writable: false,
            value: function (B) {
                const A = this;
                let C = new Matrix(A.rows,B.cols);

                let K = Math.min(A.cols, B.rows);

                for (let i = 0; i < A.rows; i++) {
                    for (let j = 0; j < B.cols; j++) {
                        const index = i*m+j;
                        C[index] = 0;
                        for (let k = 0; k < K; k++) {
                            C[index] += A[i*m + k] * B[k*B.cols + j]
                        }
                    }
                }

                return C
            }
        },
    });

};

Matrix.prototype = Object.create(Float64Array.prototype);

window.addEventListener('load', event => {

    const A = new Matrix(2,2);
    const B = new Matrix(2,2);
    const C = A.multiply(B);
    console.log(A,B,C)


})