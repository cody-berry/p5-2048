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
let fixedWidthFont
let variableWidthFont
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */
let gridFor2048


function preload() {
    font = loadFont('data/consola.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')
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

    gridFor2048 = new GameBoard()

    // gridFor2048.runSlideRightTests()
    // gridFor2048.runCombineRightTests()
    // print(gridFor2048.combineRight([0, 0, 0, 2]))
    // gridFor2048.runMoveRightTests()
    // gridFor2048.runMoveLeftTests()

    // these are the initial twos
    gridFor2048.spawnRandomNumber()
    gridFor2048.spawnRandomNumber()
}


function draw() {
    background(234, 34, 24)

    gridFor2048.show()

    text(`score: ${gridFor2048.score}`, width/2, height/2)

    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.showBottom()

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
    if (key === '`') { /* toggle debug corner visibility */
        debugCorner.visible = !debugCorner.visible
        console.log(`debugCorner visibility set to ${debugCorner.visible}`)
    }
    if (key === 'ArrowRight') {
        gridFor2048.commandRight()
    }
    if (key === 'ArrowLeft') {
        for (let rowNum in gridFor2048.rows) {
            gridFor2048.rows[rowNum] = gridFor2048.moveLeft(gridFor2048.rows[rowNum])
        }

        gridFor2048.spawnRandomNumber()
    }
    if (key === 'ArrowDown') {
        for (let colNum in gridFor2048.rows) {
            let col = []
            for (let row of gridFor2048.rows) {
                col.push(row[colNum])
            }

            col = gridFor2048.moveRight(col)

            for (let rowNum in gridFor2048.rows) {
                gridFor2048.rows[rowNum][colNum] = col[rowNum]
            }
        }

        gridFor2048.spawnRandomNumber()
    }
    if (key === 'ArrowUp') {
        for (let colNum in gridFor2048.rows) {
            let col = []
            for (let row of gridFor2048.rows) {
                col.push(row[colNum])
            }

            col = gridFor2048.moveLeft(col)

            for (let rowNum in gridFor2048.rows) {
                gridFor2048.rows[rowNum][colNum] = col[rowNum]
            }
        }

        gridFor2048.spawnRandomNumber()
    }
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.visible = true
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

    showBottom() {
        if (this.visible) {
            textFont(fixedWidthFont, 14)

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
                DEBUG_Y_OFFSET - LINE_HEIGHT * this.debugMsgList.length - TOP_PADDING
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            for (let index in this.debugMsgList) {
                const msg = this.debugMsgList[index]
                text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
            }
        }
    }

    showTop() {
        if (this.visible) {
            textFont(fixedWidthFont, 14)

            const LEFT_MARGIN = 10
            const TOP_PADDING = 3 /* extra padding on top of the 1st line */

            /* offset from top of canvas */
            const DEBUG_Y_OFFSET = textAscent() + TOP_PADDING
            const LINE_SPACING = 2
            const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING

            /* semi-transparent background, a console-like feel */
            fill(0, 0, 0, 10)
            rectMode(CORNERS)

            rect( /* x, y, w, h */
                0,
                0,
                width,
                DEBUG_Y_OFFSET + LINE_HEIGHT*this.debugMsgList.length/*-TOP_PADDING*/
            )

            fill(0, 0, 100, 100) /* white */
            strokeWeight(0)

            textAlign(LEFT)
            for (let i in this.debugMsgList) {
                const msg = this.debugMsgList[i]
                text(msg, LEFT_MARGIN, LINE_HEIGHT*i + DEBUG_Y_OFFSET)
            }
        }
    }
}