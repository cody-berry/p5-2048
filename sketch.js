/**
 *  @author Cody
 *  @date 2022.08.15
 *
 *
 *  test cases for right for just a single row:
 *       [0, 0, 0, 2] → [0, 0, 0, 2] due to nothing being able to be shifted
 *       [2, 0, 0, 0] → [0, 0, 0, 2] due to the 2 being shifted all the way
 *       [2, 4, 8, 0] → [0, 2, 4, 8] due to the numbers being shifted all the way
 *       [2, 4, 8, 16] → [2, 4, 8, 16] due to numbers blocking each other
 *       [0, 0, 2, 2] → [0, 0, 0, 4] due to the left 2 being combined with the right one
 *       [0, 2, 0, 2] → [0, 0, 0, 4] due to the left 2 moving and combining with the right one
 *       [2, 0, 2, 2] → [0, 0, 2, 4] due to the 2s being combined and the other 2 moving to the right-most square after
 *       [0, 4, 2, 2] → [0, 0, 4, 4] due to the 4s not being able to be combined another time
 *       [2, 2, 4, 4] → [0, 0, 4, 8] due to the 4s being combined and the 2s combine moving to the right side
 *       [2, 2, 2, 2] → [0, 0, 4, 4] due to the 4s not being able to be combined another time
 *       [2, 2, 4, 8] → [0, 4, 4, 8] as opposed to [0, 0, 0, 16] due to the 2s combining but not being able to combine again with the 4
 *
 */

let font
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */
let twentyFortyEightBoard


function preload() {
    font = loadFont('data/consola.ttf')
}


function setup() {
    let cnv = createCanvas(600, 300)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    twentyFortyEightBoard = new GameBoard()

    // twentyFortyEightBoard.runSlideRightTests()
    // twentyFortyEightBoard.runCombineRightTests()
    // print(twentyFortyEightBoard.combineRight([0, 0, 0, 2]))
    // twentyFortyEightBoard.runMoveRightTests()
    // twentyFortyEightBoard.runMoveLeftTests()


    // these are the initial twos
    twentyFortyEightBoard.spawnRandomNumber()
    twentyFortyEightBoard.spawnRandomNumber()
}


function draw() {
    background(234, 34, 24)

    twentyFortyEightBoard.show()

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.show()

    // if (frameCount > 3000)
    //     noLoop()
}




function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }
    if (key === 'ArrowRight') {
        let originalRows = [...twentyFortyEightBoard.rows]

        for (let rowNum in twentyFortyEightBoard.rows) {
            twentyFortyEightBoard.rows[rowNum] = twentyFortyEightBoard.moveRight(twentyFortyEightBoard.rows[rowNum])
        }

        if (twentyFortyEightBoard.rows !== originalRows) {
            twentyFortyEightBoard.spawnRandomNumber()
        }
    }
    if (key === 'ArrowLeft') {
        for (let rowNum in twentyFortyEightBoard.rows) {
            twentyFortyEightBoard.rows[rowNum] = twentyFortyEightBoard.moveLeft(twentyFortyEightBoard.rows[rowNum])
        }

        twentyFortyEightBoard.spawnRandomNumber()
    }
    if (key === 'ArrowDown') {
        for (let colNum in twentyFortyEightBoard.rows) {
            let col = []
            for (let row of twentyFortyEightBoard.rows) {
                col.push(row[colNum])
            }

            col = twentyFortyEightBoard.moveRight(col)

            for (let rowNum in twentyFortyEightBoard.rows) {
                twentyFortyEightBoard.rows[rowNum][colNum] = col[rowNum]
            }
        }

        twentyFortyEightBoard.spawnRandomNumber()
    }
    if (key === 'ArrowUp') {
        for (let colNum in twentyFortyEightBoard.rows) {
            let col = []
            for (let row of twentyFortyEightBoard.rows) {
                col.push(row[colNum])
            }

            col = twentyFortyEightBoard.moveLeft(col)

            for (let rowNum in twentyFortyEightBoard.rows) {
                twentyFortyEightBoard.rows[rowNum][colNum] = col[rowNum]
            }
        }

        twentyFortyEightBoard.spawnRandomNumber()
    }
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    show() {
        textFont(font, 14)

        const LEFT_MARGIN = 10
        const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
        const LINE_SPACING = 2
        const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

        /* semi-transparent background */
        fill(0, 0, 0, 10)
        rectMode(CORNERS)
        const TOP_PADDING = 3 /* extra padding on top of the 1st line */
        rect(
            0,
            height,
            width,
            DEBUG_Y_OFFSET - LINE_HEIGHT*this.debugMsgList.length - TOP_PADDING
        )

        fill(0, 0, 100, 100) /* white */
        strokeWeight(0)

        for (let index in this.debugMsgList) {
            const msg = this.debugMsgList[index]
            text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
        }
    }
}