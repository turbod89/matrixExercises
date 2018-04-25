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
    });

    return matrixFunc;

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

const UnifInt = (a = 0, b = 1) => Math.floor((b-a+1)*Math.random()) + a
const BottomSquaredInt = (a = 0, b = 1) => Math.floor((b - a + 1) * Math.random() * Math.random()) + a


window.addEventListener('load', event => {

    const containerCols = document.querySelectorAll('.questions-container .question-container-rows')
    const contianerAns = document.querySelector('.answer-container-rows')

    const exercises = [];
    for (let i = 0 ; i < 10; i++) {
        const dims = [0,0,0].map( i => BottomSquaredInt(2,5))
        const A = new Matrix(dims[0], dims[1])
        const B = new Matrix(dims[1], dims[2])
        const C = A(B)
        const exercice = exercises[1] = {
            m: [A,B],
            sol: C
        }

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


})