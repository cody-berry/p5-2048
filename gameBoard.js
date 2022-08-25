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

    combineRight() {

    }

    moveRight() {

    }

    spawnRandomTwo() {

    }

    spawnRandomFour() {

    }

    // preforms the right move command on a single row, except without the combine part
    slideRight(row){
        let result = [...row]

        for (let cellIndex = 3; cellIndex >= 0; cellIndex--) {
            let cell = result[cellIndex]

            for (let possibleSlideIndex = cellIndex; possibleSlideIndex < 4; possibleSlideIndex++) {
                result[cellIndex] = 0

                result[possibleSlideIndex] = cell
            }
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

        console.log(testTuples[1])

        for (const i in testTuples) {
            const test = testTuples[i]

            const testCase = test['arr']
            const expectedResult = test['ans']
            const slideResult = this.slideRight(testCase)

            console.log(`${i.padStart(2, '0')}.slide→[${testCase}]→[${slideResult}] ?= [${expectedResult}]`)
        }
    }
}


