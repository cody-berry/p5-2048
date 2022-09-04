

// contains the information needed for a 2048 cell
class Number2048 {
    constructor(boardLocation, row, col) {
        this.size = 20
        this.targetSize = 56

        this.xPos = boardLocation.x + row*60 + 30
        this.yPos = boardLocation.y + col*60 + 30
        this.targetX = boardLocation.x + row*60 + 30
        this.targetY = boardLocation.y + col*60 + 30

        this.num = 0
    }

    // shows the current number
    show() {
        rectMode(CENTER)
        square(this.xPos, this.yPos, this.size)
        textAlign(CENTER, CENTER)
        fill(0, 0, 100)
        text(this.num, this.xPos, this.yPos)
    }

    // arrive to a target location
    arriveLocation() {
        if (abs(this.targetX - this.xPos) === this.targetX - this.xPos) {
            if (abs(this.targetX - this.xPos) < 15) {
                this.xPos += map(abs(this.targetX - this.xPos), 0, 15, 5, 0)
            } else {
                this.xPos += 5
            }
        } else {
            if (abs(this.targetX - this.xPos) < 15) {
                this.xPos -= map(abs(this.targetX - this.xPos), 0, 15, 5, 0)
            } else {
                this.xPos -= 5
            }
        }
        if (abs(this.targetY - this.yPos) === this.targetY - this.yPos) {
            if (abs(this.targetY - this.yPos) < 15) {
                this.yPos += map(abs(this.targetY - this.xPos), 0, 15, 5, 0)
            } else {
                this.yPos += 5
            }
        } else {
            if (abs(this.targetY - this.yPos) < 15) {
                this.yPos -= map(abs(this.targetY - this.yPos), 0, 15, 5, 0)
            } else {
                this.yPos -= 5
            }
        }
    }

    // arrive to a target size
    arriveSize() {

    }

    // arrives to target location and size
    update() {
        this.arriveLocation()
        this.arriveSize()
    }
}

