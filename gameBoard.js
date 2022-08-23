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

    slideRight() {

    }

    spawnRandomTwo() {

    }

    spawnRandomFour() {

    }
}


