const UnifInt = (a = 0, b = 1) => Math.floor((b-a+1)*Math.random()) + a
const BottomSquaredInt = (a = 0, b = 1) => Math.floor((b - a + 1) * Math.random() * Math.random()) + a


window.addEventListener('load', event => {

    const containerCols = document.querySelectorAll('.questions-container .question-container-rows')
    const contianerAns = document.querySelector('.answer-container-rows')
    const keyupEventListenerGenerator = (i,j,C) => function keyup(event) {
        if (this.value === '') {
            this.classList.remove('correct')
            this.classList.remove('incorrect')
        } else if (isNaN(this.value) || Number(this.value) != C(i,j)) {
            this.classList.add('incorrect')
            this.classList.remove('correct')
        } else {
            this.classList.add('correct')
            this.classList.remove('incorrect')
        }
    }

    const structureResponseMatrix = C => {
        const rowsStructure = [];
        for (let ii = 0; ii < C.rows; ii++) {
            const rowStructure = ['tr',[]]
            for (let jj = 0; jj < C.cols; jj++) {
                rowStructure[1].push(['td',
                    ['input',{'class':'inputCell','type':'number'},keyupEventListenerGenerator(ii,jj,C)]
                ])
            }
            rowsStructure.push(rowStructure)
        }
        return ['div',{'class':'matrix'},['table',rowsStructure]]
    }

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
        toDom(['div',{'class':'row'},[
            ['div',{'class':'col-8'},'$$' + A.toLatex() + ' \\cdot ' + B.toLatex() + ' = $$'],
            ['div',{'class':'col-4 align-middle'},structureResponseMatrix(C)],
        ]],{at: cc})

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
        toDom(['div',{'class':'row'},[
            ['div',{'class':'col-8'},'$$' + A.toLatex() + '^{t} = $$'],
            ['div',{'class':'col-4 align-middle'},structureResponseMatrix(C)],
        ]],{at: cc})
        
    }

    for (let i = 0 ; i < 1; i++) {
        const dims = [0].map( i => BottomSquaredInt(2,5))
        const A = Matrix.randomInvertible(dims[0])
        const plu = Matrix.plu(A)
        const exercice = {
            m: A,
            sol: plu
        }
        exercises.push(exercice)

        const cc = containerCols[i%containerCols.length]
        toDom(['div',{'class':'row'},[
            ['div',{'class':'col-8'},'$$' + A.toLatex() + ' = $$'],
            ['div',{'class':'col-4 align-middle'},[
                ['div','$$' + plu.L.toLatex() + ' \\cdot ' + plu.U.toLatex() + ' $$'],
            ]],
        ]],{at: cc})

        
    }

    for (let i = 0 ; i < 1; i++) {
        const dims = [0].map( i => BottomSquaredInt(2,5))
        const A = Matrix.randomInvertible(dims[0])
        const C = A.inv()
        const exercice = {
            m: A,
            sol: C
        }
        exercises.push(exercice)

        const cc = containerCols[i%containerCols.length]

        toDom(['div',{'class':'row'},[
            ['div',{'class':'col-8'},'$$' + A.toLatex() + '^{-1} = $$'],
            ['div',{'class':'col-4 align-middle'},structureResponseMatrix(C)],
        ]],{at: cc})
        
        
    }


})

window.Matrix = Matrix