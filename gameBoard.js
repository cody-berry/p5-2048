// This displays a 2048 board that can slide right, left, up, and down.
// sketch.js should handle all the key presses.
class GameBoard {
    constructor(colorJSON) {
        this.colors = colorJSON
        this.rows = [
            [new Number2048(
                new p5.Vector(0, 100),
                0, 0, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                0, 1, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                0, 2, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                0, 3, this.colors
            )],  // this is the 1st row
            [new Number2048(
                new p5.Vector(0, 100),
                1, 0, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                1, 1, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                1, 2, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                1, 3, this.colors
            )],  // this is the 2nd row
            [new Number2048(
                new p5.Vector(0, 100),
                2, 0, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                2, 1, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                2, 2, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                2, 3, this.colors
            )],  // this is the 3rd row
            [new Number2048(
                new p5.Vector(0, 100),
                3, 0, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                3, 1, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                3, 2, this.colors
            ), new Number2048(
                new p5.Vector(0, 100),
                3, 3, this.colors
            )]   // this is the 4th row
        ]

        this.score = 0     // the current score. increases on each combine
    }

    copy() {
        let result = new GameBoard(this.colors)

        for (let rowNum in this.rows) {
            for (let colNum in this.rows[rowNum]) {
                result.rows[rowNum][colNum] = this.rows[rowNum][colNum].copy()
            }
        }

        result.score = this.score
        result.colors = this.colors

        return result
    }

    // checks if this board is equal to another board
    equals(other) {
        return this.rows[0][0].num === other.rows[0][0].num &&
               this.rows[0][1].num === other.rows[0][1].num &&
               this.rows[0][2].num === other.rows[0][2].num &&
               this.rows[0][3].num === other.rows[0][3].num &&
               this.rows[1][0].num === other.rows[1][0].num &&
               this.rows[1][1].num === other.rows[1][1].num &&
               this.rows[1][2].num === other.rows[1][2].num &&
               this.rows[1][3].num === other.rows[1][3].num &&
               this.rows[2][0].num === other.rows[2][0].num &&
               this.rows[2][1].num === other.rows[2][1].num &&
               this.rows[2][2].num === other.rows[2][2].num &&
               this.rows[2][3].num === other.rows[2][3].num &&
               this.rows[3][0].num === other.rows[3][0].num &&
               this.rows[3][1].num === other.rows[3][1].num &&
               this.rows[3][2].num === other.rows[3][2].num &&
               this.rows[3][3].num === other.rows[3][3].num

    }

    spawnRandomTwo() {
        while (true) {
            let randomRow = random([0, 1, 2, 3])
            let randomCol = random([0, 1, 2, 3])
            if (this.rows[randomRow][randomCol].num === 0) {
                this.rows[randomRow][randomCol].num = 2
                this.rows[randomRow][randomCol].size = 20
                break
            }
        }
    }

    spawnRandomFour() {
        while (true) {
            let randomRow = random([0, 1, 2, 3])
            let randomCol = random([0, 1, 2, 3])
            if (this.rows[randomRow][randomCol].num === 0) {
                this.rows[randomRow][randomCol].num = 4
                this.rows[randomRow][randomCol].size = 20
                break
            }
        }
    }

    spawnRandomNumber() {
        let squareUnfilled = false
        for (let row of this.rows) {
            for (let cell of row) {
                if (cell.num === 0) {
                    squareUnfilled = true
                    break
                }
            }
        }

        if (squareUnfilled) {
            if (random() > 0.8) {
                this.spawnRandomFour()
            } else {
                this.spawnRandomTwo()
            }
        }
    }

    // performs the right move command on a single row, except without the
    // combine part
    slideRight(row){
        let result = [...row]

        for (let cellIndex = 3; cellIndex >= 0; cellIndex--) {
            let cell = result[cellIndex]

            if (cell.num !== 0) {
                let slideIndex = cellIndex
                for (let possibleSlideIndex = cellIndex+1; possibleSlideIndex < 4; possibleSlideIndex++) {
                    if (result[possibleSlideIndex].num !== 0) {
                        break
                    }
                    slideIndex = possibleSlideIndex
                }

                result[slideIndex] = cell.copy()

                if (cellIndex !== slideIndex) {
                    result[cellIndex].num = 0
                }
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

        for (const i in testTuples) {
            const test = testTuples[i]

            const testCase = test['arr']
            const expectedResult = test['ans']
            const slideResult = this.slideRight(testCase)

            console.log(`${i.padStart(2, '0')}.slide→[${testCase}]→[${slideResult}] ?= [${expectedResult}]`)
        }
    }

    combineRight(row) {
        let result = [...row]

        for (let cellIndex = 3; cellIndex > 0; cellIndex--) {
            if (result[cellIndex].num === result[cellIndex-1].num) {
                result[cellIndex].num *= 2
                result[cellIndex].size = 20
                result[cellIndex-1].num = 0

                this.score += result[cellIndex].num
            }
        }

        return result
    }

    // runs tests for the function combineRight()
    runCombineRightTests() {
        const testTuples = [
            // basic combines only on 2 squares (make sure this doesn't test
            // combines on 0s)
            {'arr': [2, 2, 0, 2], 'ans': [0, 4, 0, 2]},
            {'arr': [2, 0, 2, 2], 'ans': [2, 0, 0, 4]},
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
            {'arr': [2, 2, 2, 0], 'ans': [0, 0, 2, 4]},
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

    moveLeft(row) {
        let rowCopy = [...row]

        // swap numbers so that it mimics moving right
        let temp = rowCopy[3]
        rowCopy[3] = rowCopy[0]
        rowCopy[0] = temp

        let tempTwo = rowCopy[2]
        rowCopy[2] = rowCopy[1]
        rowCopy[1] = tempTwo

        let result = this.moveRight(rowCopy)

        // swap numbers so that it is actually moving left
        let tempThree = result[3]
        result[3] = result[0]
        result[0] = tempThree

        let tempFour = result[2]
        result[2] = result[1]
        result[1] = tempFour

        return result
    }

    // runs tests for the function moveLeft()
    runMoveLeftTests() {
        const testTuples = [
            // basic single-cell slides
            {'arr': [0, 0, 0, 0], 'ans': [0, 0, 0, 0]},
            {'arr': [0, 0, 0, 2], 'ans': [2, 0, 0, 0]},
            {'arr': [0, 0, 2, 0], 'ans': [2, 0, 0, 0]},
            {'arr': [0, 2, 0, 0], 'ans': [2, 0, 0, 0]},
            {'arr': [2, 0, 0, 0], 'ans': [2, 0, 0, 0]},
            // test basic combines
            {'arr': [2, 2, 0, 0], 'ans': [4, 0, 0, 0]},
            {'arr': [2, 0, 2, 0], 'ans': [4, 0, 0, 0]},
            {'arr': [2, 0, 0, 2], 'ans': [4, 0, 0, 0]},
            // test complex middle-array combines
            {'arr': [0, 0, 2, 2], 'ans': [4, 0, 0, 0]},
            {'arr': [0, 2, 0, 2], 'ans': [4, 0, 0, 0]},
            {'arr': [0, 2, 2, 0], 'ans': [4, 0, 0, 0]},
            // test combine order
            {'arr': [0, 2, 2, 2], 'ans': [4, 2, 0, 0]},
            {'arr': [2, 2, 2, 0], 'ans': [4, 2, 0, 0]},
            {'arr': [2, 2, 2, 2], 'ans': [4, 4, 0, 0]}
        ]

        for (const i in testTuples) {
            const test = testTuples[i]

            const testCase = test['arr']
            const expectedResult = test['ans']
            const slideResult = this.moveLeft(testCase)

            console.log(`${i.padStart(2, '0')}.left→[${testCase}]→[${slideResult}] ?= [${expectedResult}]`)
        }
    }

    // shows all the numbers on-screen
    show() {

        rectMode(CENTER)

        fill(70, 5, 75)
        textAlign(CENTER, CENTER)


        for (let rowNum in this.rows) {
            for (let cellNum in this.rows[rowNum]) {
                square(rowNum*60 + 30, cellNum*60 + 130, 56)
            }
        }
        for (let rowNum in this.rows) {
            for (let cellNum in this.rows[rowNum]) {
                textSize(25)
                fill(70, 5, 70)
                this.rows[rowNum][cellNum].show()
                noStroke()
            }
        }
        fill(0, 0, 50, 80)
        noStroke()
        textAlign(LEFT)
    }
}


