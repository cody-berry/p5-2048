

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

    // copies the current number
    copy() {
        let copy = new Number2048(
            new p5.Vector(), 0, 0
        )
        copy.size = this.size
        copy.targetSize = this.targetSize
        copy.xPos = this.xPos
        copy.yPos = this.yPos
        copy.targetX = this.targetX
        copy.targetY = this.targetY
        copy.num = this.num
        return copy
    }

    // shows the current number
    show() {
        switch (this.num) {
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
                textSize(19)
                break
            case 2048:
                fill(60, 100, 100)
                textSize(19)
                break
            default:
                fill(0, 0, 25)
                textSize(12)
        }

        if (this.num > 0) {
            rectMode(CENTER)
            square(this.xPos, this.yPos, this.size)

            textAlign(CENTER, CENTER)
            fill(0, 0, 100)
            stroke(0, 0, 100)
            strokeWeight(4/this.num)

            if (this.num < 8) {
                fill(0, 0, 0)
                stroke(0, 0, 0)
            }

            text(this.num, this.xPos, this.yPos)
        }
    }

    // arrive to a target location
    arriveLocation() {
        if (abs(this.targetX - this.xPos) === this.targetX - this.xPos) {
            if (abs(this.targetX - this.xPos) < 15) {
                this.xPos += map(abs(this.targetX - this.xPos), 0, 15, 0, 5)
            } else {
                this.xPos += 5
            }
        } else {
            if (abs(this.targetX - this.xPos) < 15) {
                this.xPos -= map(abs(this.targetX - this.xPos), 0, 15, 0, 5)
            } else {
                this.xPos -= 5
            }
        }
        if (abs(this.targetY - this.yPos) === this.targetY - this.yPos) {
            if (abs(this.targetY - this.yPos) < 15) {
                this.yPos += map(abs(this.targetY - this.yPos), 0, 15, 0, 5)
            } else {
                this.yPos += 5
            }
        } else {
            if (abs(this.targetY - this.yPos) < 15) {
                this.yPos -= map(abs(this.targetY - this.yPos), 0, 15, 0, 5)
            } else {
                this.yPos -= 5
            }
        }
    }

    // arrive to a target size
    arriveSize() {
        if (abs(this.targetSize - this.size) === this.targetSize - this.size) {
            if (abs(this.targetSize - this.size) < 15) {
                this.size += map(abs(this.targetSize - this.size), 0, 15, 0, 5)
            } else {
                this.size += 5
            }
        } else {
            if (abs(this.targetSize - this.yPos) < 15) {
                this.size -= map(abs(this.targetSize - this.size), 0, 15, 0, 5)
            } else {
                this.size -= 5
            }
        }
    }

    // arrives to target location and size
    update() {
        this.arriveLocation()
        this.arriveSize()
    }
}

