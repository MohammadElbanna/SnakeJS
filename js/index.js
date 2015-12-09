var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

//============
/* Model */
//============

var blockSize = 20;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

var score = 0;

var paused = false;

// Block constructor
var Block = function (col, row){
    this.col = col;
    this.row = row;
}


// return true if 2 blocks are on the same spot
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
}

// Apple constructor
var Apple = function () {
    this.position = new Block(10, 10);
}

// move the apple to a new random location
Apple.prototype.move = function (snake) {
    var randCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    var randRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    var tempBlock = new Block (randCol, randRow);
    
    for(var i = 0; i < snake.segments.length; i++) {
        if(snake.segments[i].equal(tempBlock)){
            this.move();
            return;
        }
    }
    // when we reach here, we now that the new position is safe.
    this.position = tempBlock;
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

Snake.prototype.setDirection = function (direction) {
    
    if (paused)
        return;
    
    if (direction == "left" && this.direction == "right") {
        return;
    }
    else if (direction == "right" && this.direction == "left") {
        return;
    }
    else if (direction == "up" && this.direction == "down") {
        return;
    }
    else if (direction == "down" && this.direction == "up") {
        return;
    }
    
    // if it's legal move, then change the direction state
    this.nextDirection = direction;
};

/*
takes the head as input and return true if head hit the walls or the body of the snake
*/
Snake.prototype.checkCollision = function (head) {
    
    var wallCollision = (head.col == 0) || (head.row == 0) || (head.col == widthInBlocks - 1) || (head.row == heightInBlocks - 1);
    
    var selfCollision = false;
    
    for(var i = 0; i < this.segments.length; i++) {
        if(head.equal(this.segments[i])) {
            selfCollision = true;
            break;
        }
    }
    
    return wallCollision || selfCollision;
}

Snake.prototype.move = function () {
    var head = this.segments[0];
    var newHead; 
    
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
    
    // do this BEFORE adding the new head to the segments array
    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }
    
    // push the new head at the first index of the array
    this.segments.unshift(newHead);
    
    if (newHead.equal(apple.position)) {
        score++;
        apple.move(this);
    }
    else {
        // remove the last square from the tail only when no apples
        this.segments.pop();
    }
    
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

// fill a circle in the block
Block.prototype.drawCircle = function (color) {
    var centerX = (this.col * blockSize) + (blockSize / 2);
    var centerY = (this.row * blockSize) + (blockSize / 2);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, blockSize / 2, 0, Math.PI*2, false);
    ctx.fill();
}

// render the snake on the screen
Snake.prototype.draw = function () {
    for(var i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("Blue");
    }
}

// draw an apple (circle) on the apple position
Apple.prototype.draw = function () {
    this.position.drawCircle("limeGreen");
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
    cancelAnimationFrame(loopID);
    document.removeEventListener("keydown", keyBoardListner, true);
    ctx.font = "60px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);
};




/*
===============
Game Loop
===============
*/

var snake = new Snake();
var apple = new Apple();

var frames = 0;

function gameLoop () {
    frames ++;
    loopID = requestAnimationFrame(gameLoop);
    
    if (frames % 3 === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawScore();
        snake.move();
        snake.draw();
        apple.draw();
        //drawBorder();
        frames = 0;
    }
}

resize();
// kick off rAF
var loopID = requestAnimationFrame(gameLoop);


//=======================
/* Listen to actions */
//=======================loopID

var mapKeyborad = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    80: "pause"
};

function keyBoardListner(event) {
    if (mapKeyborad[event.keyCode] !== undefined) {
        
        if(mapKeyborad[event.keyCode] === "pause"){
            if(paused){
                loopID = requestAnimationFrame(gameLoop);
                paused = false;
            }
            else {
                cancelAnimationFrame(loopID);
                paused = true;
            }
        }
        
        else 
            snake.setDirection(mapKeyborad[event.keyCode]);
    }
}

document.addEventListener("keydown", keyBoardListner, true);

function resize () {
    var gameWidth = window.innerWidth;
    var gameHeight = window.innerHeight;
    var scaleToFitX = gameWidth / 1280;
    var scaleToFitY = gameHeight / 720;

    var currentScreenRatio = gameWidth / gameHeight;
    var optimalRatio = Math.min(scaleToFitX, scaleToFitY);
//    var optimalRatio = Math.max(scaleToFitX, scaleToFitY);

    // 16:9 screen sizes.
    if (currentScreenRatio >= 1.77 && currentScreenRatio <= 1.79) {
        canvas.style.width = gameWidth + "px";
        canvas.style.height = gameHeight + "px";
    }
    else {
        canvas.style.width = 1280 * scaleToFitX + "px";
        canvas.style.height = 720 * scaleToFitY + "px";
    }
}

window.addEventListener("resize", resize, true)

