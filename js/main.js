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
        plu: {
            enumerable: true,
            configurable: false,
            writable: false,
            value: function () {
                const A =matrixFunc
                const p = [];
                for (let i = 0; i < A.rows; i++) {
                    p.push(i)
                }
                
                const L = Matrix(A.rows,A.rows)
                const U = A('t')('t')

                return {'perm': p, 'L': L, 'U': U}
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
        value: function(n,) {
            const C = new Matrix(n,n)
            C.forEach((e,i,j,C) => C(i,j, i == j ? 1 : 0))
            return C
        }
    },
});

const UnifInt = (a = 0, b = 1) => Math.floor((b-a+1)*Math.random()) + a
const BottomSquaredInt = (a = 0, b = 1) => Math.floor((b - a + 1) * Math.random() * Math.random()) + a


window.addEventListener('load', event => {

    const containerCols = document.querySelectorAll('.questions-container .question-container-rows')
    const contianerAns = document.querySelector('.answer-container-rows')

    const exercises = [];
    for (let i = 0 ; i < 1; i++) {
        const dims = [0,0,0].map( i => BottomSquaredInt(2,5))
        const A = new Matrix(dims[0], dims[1])
        const B = new Matrix(dims[1], dims[2])
        const C = A(B)
        const exercice = {
            m: [A,B],
            sol: C
        }
        exercises.push(exercice)

        const cc = containerCols[i%containerCols.length]

        const wrapper = document.createElement('div')
        const wrapper2 = document.createElement('div')
        wrapper.classList.add('row')
        wrapper2.classList.add('col-8')
        wrapper.appendChild(wrapper2)
        wrapper2.innerHTML = '$$' + A.toLatex() + ' \\cdot ' + B.toLatex() + ' = $$'
        
        const wrapper3 = document.createElement('div')
        const wrapper4 = document.createElement('div')
        //wrapper4.classList.add('')
        wrapper4.classList.add('matrix')
        wrapper3.classList.add('col-4')
        wrapper3.classList.add('align-middle')
        const table = document.createElement('table')
        for (let ii = 0; ii < dims[0]; ii++) {
            const row = document.createElement('tr')
            for (let jj = 0; jj < dims[2]; jj++) {
                const cell = document.createElement('td')
                const input = document.createElement('input')
                input.setAttribute('type','number')
                input.classList.add('inputCell')
                input.addEventListener('keyup', event => {
                    if (input.value === '') {
                        input.classList.remove('correct')
                        input.classList.remove('incorrect')
                    } else if (isNaN(input.value) || Number(input.value) != C(ii,jj)) {
                        input.classList.add('incorrect')
                        input.classList.remove('correct')
                    } else {
                        input.classList.add('correct')
                        input.classList.remove('incorrect')
                    }
                })
                
                cell.appendChild(input)
                row.appendChild(cell)
            }
            table.appendChild(row)
        }
        wrapper4.appendChild(table)
        wrapper3.appendChild(wrapper4)
        wrapper.appendChild(wrapper3)
        cc.appendChild(wrapper)
        
    }

    for (let i = 0 ; i < 1; i++) {
        const dims = [0,0].map( i => BottomSquaredInt(2,5))
        const A = new Matrix(dims[0], dims[1])
        const C = A('t')
        const exercice = {
            m: A,
            sol: C
        }
        exercises.push(exercice)

        const cc = containerCols[i%containerCols.length]

        const wrapper = document.createElement('div')
        const wrapper2 = document.createElement('div')
        wrapper.classList.add('row')
        wrapper2.classList.add('col-8')
        wrapper.appendChild(wrapper2)
        wrapper2.innerHTML = '$$' + A.toLatex() + '^{t} = $$'
        
        const wrapper3 = document.createElement('div')
        const wrapper4 = document.createElement('div')
        //wrapper4.classList.add('')
        wrapper4.classList.add('matrix')
        wrapper3.classList.add('col-4')
        wrapper3.classList.add('align-middle')
        const table = document.createElement('table')
        for (let ii = 0; ii < dims[1]; ii++) {
            const row = document.createElement('tr')
            for (let jj = 0; jj < dims[0]; jj++) {
                const cell = document.createElement('td')
                const input = document.createElement('input')
                input.setAttribute('type','number')
                input.classList.add('inputCell')
                input.addEventListener('keyup', event => {
                    if (input.value === '') {
                        input.classList.remove('correct')
                        input.classList.remove('incorrect')
                    } else if (isNaN(input.value) || Number(input.value) != C(ii,jj)) {
                        input.classList.add('incorrect')
                        input.classList.remove('correct')
                    } else {
                        input.classList.add('correct')
                        input.classList.remove('incorrect')
                    }
                })
                
                cell.appendChild(input)
                row.appendChild(cell)
            }
            table.appendChild(row)
        }
        wrapper4.appendChild(table)
        wrapper3.appendChild(wrapper4)
        wrapper.appendChild(wrapper3)
        cc.appendChild(wrapper)
        
    }

    for (let i = 0 ; i < 1; i++) {
        const dims = [0,0].map( i => BottomSquaredInt(2,5))
        const A = new Matrix(dims[0], dims[1])
        const plu = A.plu()
        const exercice = {
            m: A,
            sol: plu
        }
        exercises.push(exercice)

        const cc = containerCols[i%containerCols.length]

        const wrapper = document.createElement('div')
        const wrapper2 = document.createElement('div')
        wrapper.classList.add('row')
        wrapper2.classList.add('col-8')
        wrapper.appendChild(wrapper2)
        wrapper2.innerHTML = '$$' + A.toLatex() + '^{t} = $$'
        
        const wrapper3 = document.createElement('div')
        const wrapper4 = document.createElement('div')
        //wrapper4.classList.add('')
        wrapper3.classList.add('col-4')
        wrapper3.classList.add('align-middle')
        wrapper4.innerHTML = wrapper2.innerHTML = '$$' + plu.L.toLatex() + ' \\cdot ' + plu.U.toLatex() + ' $$'
        wrapper3.appendChild(wrapper4)
        wrapper.appendChild(wrapper3)
        cc.appendChild(wrapper)
        
    }


})

window.Matrix = Matrix