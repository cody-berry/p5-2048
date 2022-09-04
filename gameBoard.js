// This displays a 2048 board that can slide right, left, up, and down.
// sketch.js should handle all the key presses.
class GameBoard {
    constructor() {
        this.rows = [
            [new Number2048(
                new p5.Vector(0, 0),
                0, 0
            ), new Number2048(
                new p5.Vector(0, 0),
                0, 1
            ), new Number2048(
                new p5.Vector(0, 0),
                0, 2
            ), new Number2048(
                new p5.Vector(0, 0),
                0, 3
            )],  // this is the 1st row
            [new Number2048(
                new p5.Vector(0, 0),
                1, 0
            ), new Number2048(
                new p5.Vector(0, 0),
                1, 1
            ), new Number2048(
                new p5.Vector(0, 0),
                1, 2
            ), new Number2048(
                new p5.Vector(0, 0),
                1, 3
            )],  // this is the 2nd row
            [new Number2048(
                new p5.Vector(0, 0),
                2, 0
            ), new Number2048(
                new p5.Vector(0, 0),
                2, 1
            ), new Number2048(
                new p5.Vector(0, 0),
                2, 2
            ), new Number2048(
                new p5.Vector(0, 0),
                2, 3
            )],  // this is the 3rd row
            [new Number2048(
                new p5.Vector(0, 0),
                3, 0
            ), new Number2048(
                new p5.Vector(0, 0),
                3, 1
            ), new Number2048(
                new p5.Vector(0, 0),
                3, 2
            ), new Number2048(
                new p5.Vector(0, 0),
                3, 3
            )]   // this is the 4th row
        ]

        this.gameLost = false

        this.score = 0     // the current score. increases on each combine
    }

    spawnRandomTwo() {
        while (true) {
            let randomRow = random([0, 1, 2, 3])
            let randomCol = random([0, 1, 2, 3])
            if (this.rows[randomRow][randomCol].num === 0) {
                this.rows[randomRow][randomCol] = new Number2048(
                    new p5.Vector(0, 0),
                    randomRow, randomCol
                )
                this.rows[randomRow][randomCol].num = 2
                break
            }
        }
    }

    spawnRandomFour() {
        while (true) {
            let randomRow = random([0, 1, 2, 3])
            let randomCol = random([0, 1, 2, 3])
            if (this.rows[randomRow][randomCol].num === 0) {
                this.rows[randomRow][randomCol] = new Number2048(
                    new p5.Vector(0, 0),
                    randomRow, randomCol
                )
                this.rows[randomRow][randomCol].num = 4
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

            let slideIndex = 0
            for (let possibleSlideIndex = cellIndex; possibleSlideIndex < 4; possibleSlideIndex++) {
                if (result[possibleSlideIndex].num !== 0) {
                    break
                }
                slideIndex = possibleSlideIndex
            }

            result[slideIndex].num = cell.num
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
            if (result[cellIndex] === result[cellIndex-1]) {
                result[cellIndex].num = result[cellIndex].num * 2
                result[cellIndex].size = 20

                result[cellIndex-1].num = 0

                this.score += result[cellIndex].num * 2
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

        rectMode(CORNER)

        fill(70, 5, 75)
        textAlign(CENTER, CENTER)

        if (this.gameLost) {

        }
        else {
            square(0, 0, 240)
            for (let rowNum in this.rows) {
                for (let cellNum in this.rows[rowNum]) {
                    textSize(20)
                    switch (this.rows[cellNum][rowNum].num) {
                        case 2:
                            fill(0, 0, 100, 80)
                            break
                        case 4:
                            fill(0, 0, 80, 80)
                            break
                        case 8:
                            fill(40, 100, 100)
                            break
                        case 16:
                            fill(30, 100, 100)
                            break
                        case 32:
                            fill(20, 100, 100)
                            break
                        case 64:
                            fill(10, 100, 100)
                            break
                        case 128:
                            fill(60, 100, 100)
                            break
                        case 256:
                            fill(58, 100, 90)
                            break
                        case 512:
                            fill(56, 100, 89)
                            break
                        case 1024:
                            fill(54, 100, 88)
                            textSize(15)
                            break
                        case 2048:
                            fill(60, 100, 100)
                            textSize(15)
                            break
                        default:
                            fill(0, 0, 25)
                            textSize(10)
                    }

                    print(this.rows[rowNum][cellNum])
                    this.rows[rowNum][cellNum].show()

                    noStroke()
                }
            }

            fill(0, 0, 50, 80)
            noStroke()

            // for (let rowNum in this.rows) {
            //     for (let cellNum in this.rows[rowNum]) {
            //         text(this.rows[rowNum][cellNum], cellNum * 60 + 29, rowNum * 60 + 29)
            //
            //         if (this.rows[cellNum][rowNum] === 0) {
            //             square(rowNum * 60 + 2, cellNum * 60 + 2, 56)
            //         }
            //
            //         if (frameCount === 10) {
            //             print(cellNum * 60 + 29, rowNum * 60 + 29)
            //         }
            //     }
            // }

            // cleanup
            textAlign(LEFT)
        }
    }
}


