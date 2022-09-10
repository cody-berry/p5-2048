

// contains the information needed for a 2048 cell
class Number2048 {
    constructor(boardLocation, row, col, colorJSON) {
        this.size = 20
        this.targetSize = 56

        this.xPos = boardLocation.x + row*60 + 30
        this.yPos = boardLocation.y + col*60 + 30
        this.targetX = boardLocation.x + row*60 + 30
        this.targetY = boardLocation.y + col*60 + 30

        this.num = 0
        
        this.colors = colorJSON
    }

    // copies the current number
    copy() {
        let copy = new Number2048(
            new p5.Vector(), 0, 0, this.colors
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
        let c = this.colors
        switch (this.num) {
            case 2:
                fill(c["2"]["hue"], c["2"]["sat"], c["2"]["brightness"])
                break
            case 4:
                fill(c["4"]["hue"], c["4"]["sat"], c["4"]["brightness"])
                break
            case 8:
                fill(c["8"]["hue"], c["8"]["sat"], c["8"]["brightness"])
                break
            case 16:
                fill(c["16"]["hue"], c["16"]["sat"], c["16"]["brightness"])
                break
            case 32:
                fill(c["32"]["hue"], c["32"]["sat"], c["32"]["brightness"])
                break
            case 64:
                fill(c["64"]["hue"], c["64"]["sat"], c["64"]["brightness"])
                break
            case 128:
                fill(c["128"]["hue"], c["128"]["sat"], c["128"]["brightness"])
                break
            case 256:
                fill(c["256"]["hue"], c["256"]["sat"], c["256"]["brightness"])
                break
            case 512:
                fill(c["512"]["hue"], c["512"]["sat"], c["512"]["brightness"])
                break
            case 1024:
                fill(c["1024"]["hue"], c["1024"]["sat"], c["1024"]["brightness"])
                textSize(19)
                break
            case 2048:
                fill(c["2048"]["hue"], c["2048"]["sat"], c["2048"]["brightness"])
                textSize(19)
                break
            default:
                fill(c["none"]["hue"], c["none"]["sat"], c["none"]["brightness"])
                textSize(12)
        }

        if (this.num > 0) {
            rectMode(CENTER)
            square(this.xPos, this.yPos, this.size)

            textAlign(CENTER, CENTER)
            fill(0, 0, 100)
            stroke(0, 0, 100)
            strokeWeight(3.2/sqrt(this.num))

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
            if (abs(this.targetX - this.xPos) < 20) {
                this.xPos += map(abs(this.targetX - this.xPos), 0, 15, 0, 5)
            } else {
                this.xPos += 10
            }
        } else {
            if (abs(this.targetX - this.xPos) < 20) {
                this.xPos -= map(abs(this.targetX - this.xPos), 0, 15, 0, 5)
            } else {
                this.xPos -= 10
            }
        }
        if (abs(this.targetY - this.yPos) === this.targetY - this.yPos) {
            if (abs(this.targetY - this.yPos) < 20) {
                this.yPos += map(abs(this.targetY - this.yPos), 0, 15, 0, 5)
            } else {
                this.yPos += 10
            }
        } else {
            if (abs(this.targetY - this.yPos) < 20) {
                this.yPos -= map(abs(this.targetY - this.yPos), 0, 15, 0, 5)
            } else {
                this.yPos -= 10
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

