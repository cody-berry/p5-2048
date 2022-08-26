// This displays a 2048 board that can slide right, left, up, and down.
// sketch.js should handle all the key presses.
class GameBoard {
    constructor() {
        this.rows = [
            [0, 0, 0, 0],  // this is the 1st row
            [0, 0, 0, 0],  // this is the 2nd row
            [0, 0, 0, 0],  // this is the 3rd row
            [0, 0, 0, 0]   // this is the 4th row
        ]
        this.focusedRow = [
            0,           // this is the index of the row we're focused on
            [0, 0, 0, 0] // this is the row we're currently sliding
        ]

        this.cols = [
            [0, 0, 0, 0],  // this is the 1st column
            [0, 0, 0, 0],  // this is the 2nd column
            [0, 0, 0, 0],  // this is the 3rd column
            [0, 0, 0, 0]   // this is the 4th column
        ]
        this.focusedCol = [
            0,           // this is the index of the column we're focused on
            [0, 0, 0, 0] // this is the column we're currently sliding
        ]

        this.score = 0     // the current score. increases on each combine
    }

    // slideRight() {

    // }

    spawnRandomTwo() {

    }

    spawnRandomFour() {

    }

    // preforms the right move command on a single row, except without the combine part
    slideRight(row){
        let rowCopy = [...row]
        let result = [0, 0, 0, 0]

        for (let cellIndex = 3; cellIndex >= 0; cellIndex--) {
            let cell = rowCopy[cellIndex]

            let slideIndex = 0
            for (let possibleSlideIndex = cellIndex; possibleSlideIndex < 4; possibleSlideIndex++) {
                if (result[possibleSlideIndex] !== 0) {
                    break
                }
                slideIndex = possibleSlideIndex
            }

            result[slideIndex] = cell
        }

        return result
    }


    // runs tests for the function slideRight()
    runSlideRightTests() {
        const testTuples = [
            // basic single cell slides
            {'arr': [0, 0, 0, 0], 'ans': [0, 0, 0, 0]},
            {'arr': [0, 0, 0, 2], 'ans': [0, 0, 0, 2]},
            {'arr': [0, 0, 2, 0], 'ans': [0, 0, 0, 2]},
            {'arr': [0, 2, 0, 0], 'ans': [0, 0, 0, 2]},
            {'arr': [2, 0, 0, 0], 'ans': [0, 0, 0, 2]},
            // slides with arr[3] filled
            {'arr': [0, 2, 0, 2], 'ans': [0, 0, 2, 2]},
            {'arr': [2, 0, 0, 2], 'ans': [0, 0, 2, 2]},
            // test mid-array multi-slide
            {'arr': [2, 0, 2, 0], 'ans': [0, 0, 2, 2]},
            {'arr': [2, 2, 0, 0], 'ans': [0, 0, 2, 2]},
            {'arr': [2, 2, 2, 0], 'ans': [0, 2, 2, 2]},
            // no slides
            {'arr': [2, 2, 2, 2], 'ans': [2, 2, 2, 2]}
        ]

        for (const i in testTuples) {
            const test = testTuples[i]

            const testCase = test['arr']
            const expectedResult = test['ans']
            const slideResult = this.slideRight(testCase)

            console.log(`${i.padStart(2, '0')}.slide→[${testCase}]→[${slideResult}] ?= [${expectedResult}]`)
        }
    }

    combineRight(row) {
        let rowCopy = [...row]
        let result = [0, 0, 0, 0]

        for (let cellIndex = 3; cellIndex > 0; cellIndex--) {
            if (rowCopy[cellIndex] === rowCopy[cellIndex-1]) {
                result[cellIndex] = rowCopy[cellIndex] * 2
                rowCopy[cellIndex - 1] = 0
            } else {
                result[cellIndex] = rowCopy[cellIndex]
            }
        }

        return result
    }

    // runs tests for the function combineRight()
    runCombineRightTests() {
        const testTuples = [
            // basic combines only on 2 squares
            {'arr': [2, 2, 0, 0], 'ans': [0, 4, 0, 0]},
            {'arr': [0, 0, 2, 2], 'ans': [0, 0, 0, 4]},
            {'arr': [0, 2, 2, 0], 'ans': [0, 0, 4, 0]},
            // test combine on 0s
            {'arr': [0, 0, 0, 0], 'ans': [0, 0, 0, 0]},
            // test multiple combines
            {'arr': [2, 2, 2, 2], 'ans': [0, 4, 0, 4]},
            // test combine order
            {'arr': [0, 2, 2, 4], 'ans': [0, 0, 4, 4]}
        ]

        for (const i in testTuples) {
            const test = testTuples[i]

            const testCase = test['arr']
            const expectedResult = test['ans']
            const slideResult = this.combineRight(testCase)

            console.log(`${i.padStart(2, '0')}.combine→[${testCase}]→[${slideResult}] ?= [${expectedResult}]`)
        }
    }

    moveRight(row) {
        let slidedRow = this.slideRight(row)

        let combinedRow = this.combineRight(slidedRow)

        let result = this.slideRight(combinedRow)
        return result
    }

    // runs tests for the function moveRight()
    runMoveRightTests() {
        const testTuples = [
            // basic single-cell slides
            {'arr': [0, 0, 0, 0], 'ans': [0, 0, 0, 0]},
            {'arr': [0, 0, 0, 2], 'ans': [0, 0, 0, 2]},
            {'arr': [0, 0, 2, 0], 'ans': [0, 0, 0, 2]},
            {'arr': [0, 2, 0, 0], 'ans': [0, 0, 0, 2]},
            {'arr': [2, 0, 0, 0], 'ans': [0, 0, 0, 2]},
            // test basic combines
            {'arr': [0, 0, 2, 2], 'ans': [0, 0, 0, 4]},
            {'arr': [0, 2, 0, 2], 'ans': [0, 0, 0, 4]},
            {'arr': [2, 0, 0, 2], 'ans': [0, 0, 0, 4]},
            // test complex middle-array combines
            {'arr': [2, 0, 2, 0], 'ans': [0, 0, 0, 4]},
            {'arr': [2, 2, 0, 0], 'ans': [0, 0, 0, 4]},
            {'arr': [0, 2, 2, 0], 'ans': [0, 0, 0, 4]},
            // test combine order
            {'arr': [0, 2, 2, 2], 'ans': [0, 0, 2, 4]},
            {'arr': [2, 2, 2, 2], 'ans': [0, 0, 4, 4]}
        ]

        for (const i in testTuples) {
            const test = testTuples[i]

            const testCase = test['arr']
            const expectedResult = test['ans']
            const slideResult = this.moveRight(testCase)

            console.log(`${i.padStart(2, '0')}.right→[${testCase}]→[${slideResult}] ?= [${expectedResult}]`)
        }
    }
}


