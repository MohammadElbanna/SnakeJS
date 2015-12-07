var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

//============
/* Model */
//============

var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

var score = 0;

// Block constructor
var Block = function (col, row){
    this.col = col;
    this.row = row;
}

// return true if 2 blocks are on the same spot
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
}


// snake constructor
var Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];
    
    this.direction = "right";
    this.nextDirection = "right";
}

Snake.prototype.move = function () {
    var head = this.segments[0];
    var newHead; 
    
    if (this.nextDirection == "left" && this.direction == "right") {
        this.nextDirection = "right";
    }
    else if (this.nextDirection == "right" && this.direction == "left") {
        this.nextDirection = "left";
    }
    else if (this.nextDirection == "up" && this.direction == "down") {
        this.nextDirection = "down";
    }
    else if (this.nextDirection == "down" && this.direction == "up") {
        this.nextDirection = "up";
    }
    
    this.direction = this.nextDirection;
    
    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    }
    else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    }
    else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    }
    else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }
    
    // push the new head at the first index of the array
    this.segments.unshift(newHead);
    
//    if (newHead.equal(apple.position)) {
//        score++;
//        apple.move();
//    }
//    else {
//        // remove the last square from the tail only when no apples
//        this.segments.pop();
//    }
    
    this.segments.pop();

};

//======================
/*
Drawing functions (View)
*/
//======================

// fill a square in the canvas
Block.prototype.drawSquare = function (color) {
    var x = this.col * blockSize;
    var y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
}

// render the snake on the screen
Snake.prototype.draw = function () {
    for(var i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("Blue");
    }
}

// draw the score
var drawScore = function () {
    ctx.font = "20px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
};

// drawing border 
// border was drawn using css instead of drawing it with the canvas
//var drawBorder = function () {
//    
//};

// draw game over
var gameOver = function () {
    cancelAnimationFrame(gameLoop);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);
};


var snake = new Snake();
var frames = 0;

function gameLoop () {
    frames ++;
    requestAnimationFrame(gameLoop);
    
    if (frames % 3 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScore();
        snake.move();
        snake.draw();
        //apple.draw();
        //drawBorder();
        frames = 0;
    }
}

// kick off rAF
requestAnimationFrame(gameLoop);


//=======================
/* Listen to actions */
//=======================

var mapKeyborad = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

document.addEventListener("keydown", function(event) {
    snake.nextDirection = mapKeyborad[event.keyCode];
//    snake.move();
})

