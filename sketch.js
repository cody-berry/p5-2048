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
let colors2048
let lost=false /* have you lost the game? */
let lastMoves = [] /* the result of your last moves */


function preload() {
    font = loadFont('data/consola.ttf')
    fixedWidthFont = loadFont('data/consola.ttf')
    variableWidthFont = loadFont('data/meiryo.ttf')
    colors2048 = loadJSON('data/colors.json')
}


function setup() {
    let cnv = createCanvas(600, 400)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch
        lowercase R → reset game
        lowercase U → undo move
        lowercase B → view best board: undo-able
        ⚠Currently, you can cheat 
         by undoing a move, doing
         that move again, and undoing
         multiple times to get the
         spawn you want⚠</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    // gridFor2048.runSlideRightTests()
    // gridFor2048.runCombineRightTests()
    // print(gridFor2048.combineRight([0, 0, 0, 2]))
    // gridFor2048.runMoveRightTests()
    // gridFor2048.runMoveLeftTests()

    let gameBoard = getItem('game-board')

    if (!getItem('best-score')) {
        storeItem('best-score', 0)
        storeItem('best-board', new GameBoard(colors2048))
    }

    gridFor2048 = new GameBoard(colors2048)
    for (let rowNum in gameBoard.rows) {
        for (let colNum in gameBoard.rows[rowNum]) {
            let num = gameBoard.rows[rowNum][colNum]
            gridFor2048.rows[rowNum][colNum].num = num.num
            gridFor2048.rows[rowNum][colNum].size = num.size
            gridFor2048.rows[rowNum][colNum].targetX = num.targetX
            gridFor2048.rows[rowNum][colNum].xPos = num.xPos
            gridFor2048.rows[rowNum][colNum].yPos = num.yPos
            gridFor2048.rows[rowNum][colNum].targetY = num.targetY
            gridFor2048.rows[rowNum][colNum].targetSize = num.targetSize
        }
    }
    gridFor2048.score = gameBoard.score

    if (gridFor2048) {
        if (ifGameLost()) {
            gridFor2048 = new GameBoard(colors2048)

            // these are the initial twos/fours
            gridFor2048.spawnRandomNumber()
            gridFor2048.spawnRandomNumber()
        }
    } else {
        gridFor2048 = new GameBoard(colors2048)

        // these are the initial twos/fours
        gridFor2048.spawnRandomNumber()
        gridFor2048.spawnRandomNumber()
    }

    lastMoves = []
}


function draw() {
    background(49, 4, 98)

    gridFor2048.show()
    if (lost) {
        textSize(30)
        text('GAME LOST', 300, 300)
    }

    for (let row of gridFor2048.rows) {
        for (let cell of row) {
            cell.update()
        }
    }

    fill(28, 14, 72)

    let bestScore = getItem('best-score').toString()

    rectMode(CENTER)

    rect(textWidth(bestScore)/2 + 220, 60, textWidth(bestScore) + 40, 60)
    rect(textWidth(gridFor2048.score)/2 + 20, 60, textWidth(gridFor2048.score) + 40, 60)


    textSize(10)

    textAlign(CENTER, CENTER)
    fill(35, 10, 93)

    text('BEST', textWidth(bestScore)/2 + 220, 40)
    text('SCORE', textWidth(gridFor2048.score)/2 + 20, 40)

    fill(0, 0, 100)
    textSize(20)
    textAlign(CENTER, CENTER)

    text(bestScore, textWidth(bestScore)/2 + 220, 80)
    text(gridFor2048.score, textWidth(gridFor2048.score)/2 + 20, 80)

    textSize(20)

    fill(29, 28, 56)

    if (
        mouseX > 250 &&
        mouseX < 350 &&
        mouseY > 175 &&
        mouseY < 225
    ) {
        stroke(0, 0, 75)
    }

    rect(300, 200, 100, 50, 5)

    noStroke()

    fill(0, 0, 100)
    textAlign(CENTER, CENTER)
    text('New game', 300, 200)

    /* debugCorner needs to be last so its z-index is highest */
    // debugCorner.setText(`frameCount: ${frameCount}`, 2)
    // debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    // debugCorner.showBottom()

    // if (frameCount > 3000)
    //     noLoop()
}

function mousePressed() {
    if (
        mouseX > 200 &&
        mouseX < 300 &&
        mouseY > 175 &&
        mouseY < 225
    ) {
        gridFor2048 = new GameBoard(colors2048)

        // these are the initial twos/fours
        gridFor2048.spawnRandomNumber()
        gridFor2048.spawnRandomNumber()

        lost = false
    }
}

function undo() {
    console.log(lastMoves)
    if (lastMoves && !gridFor2048.equals(lastMoves[lastMoves.length - 1])) {
        gridFor2048 = lastMoves.pop()
    } else {
        print('UNDO UNAVAILABLE')
    }
}

function commandLeft() {
    lastMoves.push(gridFor2048.copy())
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
}

function commandRight() {
    lastMoves.push(gridFor2048.copy())
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
}

function commandUp() {
    lastMoves.push(gridFor2048.copy())
    for (let rowNum in gridFor2048.rows) {
        gridFor2048.rows[rowNum] = gridFor2048.moveLeft(gridFor2048.rows[rowNum])
    }
}

function commandDown() {
    lastMoves.push(gridFor2048.copy())
    for (let rowNum in gridFor2048.rows) {
        gridFor2048.rows[rowNum] = gridFor2048.moveRight(gridFor2048.rows[rowNum])
    }
}

function ifGameLost() {
    let temp = lastMoves[lastMoves.length - 1]
    let originalGrid = gridFor2048.copy()
    commandLeft()
    if (!originalGrid.equals(gridFor2048.copy())) {
        lastMoves[lastMoves.length - 1] = temp
        gridFor2048 = originalGrid
        return false
    }
    commandRight()
    if (!originalGrid.equals(gridFor2048.copy())) {
        lastMoves[lastMoves.length - 1] = temp
        gridFor2048 = originalGrid
        return false
    }
    commandUp()
    if (!originalGrid.equals(gridFor2048.copy())) {
        lastMoves[lastMoves.length - 1] = temp
        gridFor2048 = originalGrid
        return false
    }
    commandDown()
    if (!originalGrid.equals(gridFor2048.copy())) {
        lastMoves[lastMoves.length - 1] = temp
        gridFor2048 = originalGrid
        return false
    }
    gridFor2048 = originalGrid
    lastMoves[lastMoves.length - 1] = temp
    return true
}

function keyPressed() {
    let originalGrid = gridFor2048.copy()
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
    if (key === 'r') { /* reset game */
        gridFor2048 = new GameBoard(colors2048)

        // these are the initial twos/fours
        gridFor2048.spawnRandomNumber()

        lost = false
    }
    if (key === 'b') { /* set board to best game */
        let gameBoard = getItem('best-board')
        gridFor2048 = new GameBoard(colors2048)
        for (let rowNum in gameBoard.rows) {
            for (let colNum in gameBoard.rows[rowNum]) {
                let num = gameBoard.rows[rowNum][colNum]
                gridFor2048.rows[rowNum][colNum].num = num.num
                gridFor2048.rows[rowNum][colNum].size = num.size
                gridFor2048.rows[rowNum][colNum].targetX = num.targetX
                gridFor2048.rows[rowNum][colNum].xPos = num.xPos
                gridFor2048.rows[rowNum][colNum].yPos = num.yPos
                gridFor2048.rows[rowNum][colNum].targetY = num.targetY
                gridFor2048.rows[rowNum][colNum].targetSize = num.targetSize
            }
        }
        originalGrid = gridFor2048.copy()
    }
    if (key === 'ArrowDown') {
        commandDown()
    }
    if (key === 'ArrowUp') {
        commandUp()
    }
    if (key === 'ArrowRight') {
        commandRight()
    }
    if (key === 'ArrowLeft') {
        commandLeft()
    }

    if (!originalGrid.equals(gridFor2048)) {
        gridFor2048.spawnRandomNumber()
    } else {
        lastMoves.pop()
    }

    for (let rowNum in gridFor2048.rows) {
        for (let cellNum in gridFor2048.rows[rowNum]) {
            gridFor2048.rows[rowNum][cellNum].targetX = rowNum*60 + 30
            gridFor2048.rows[rowNum][cellNum].targetY = cellNum*60 + 130
        }
    }

    lost = ifGameLost()


    storeItem('game-board', gridFor2048.copy())

    if (getItem('best-score')) {
        if (getItem('best-score') < gridFor2048.score) {
            storeItem('best-score', gridFor2048.score)
            storeItem('best-board', gridFor2048)
        }
    } else {
        storeItem('best-score', gridFor2048.score)
        storeItem('best-board', gridFor2048)
    }
    if (key === 'u') { /* undo move */
        undo()
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