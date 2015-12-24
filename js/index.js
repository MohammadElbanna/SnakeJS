var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = canvas.width;
var height = canvas.height;

//==================
/* loading assets */
//==================

// assets source http://rembound.com/articles/creating-a-snake-game-tutorial-with-html5
var sprite = new Image();
sprite.onload = function () {
    paused = false;
}
sprite.src = "assets/snake-graphics.png";

var wall = new Image();
wall.onload = function () {
    paused = false;
}
wall.src = "assets/stone5.jpg"

//============
/* Model */
//============

var blockSize = 10;
var widthInBlocks = width / blockSize;
var heightInBlocks = height / blockSize;

var score = 0;

var paused = true;

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
            this.move(snake);
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
    
    var wallCollision = (head.col == 0) || (head.row == 0) || (head.col == Math.floor(widthInBlocks) - 1) || (head.row == Math.floor(heightInBlocks) - 1);
    
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
    var head = this.segments[0];256
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
        score = score + 10;
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

Block.prototype.renderImage = function(sprite, xSprite, ySprite, widthInSprite, heightInSprite) {
    ctx.drawImage(sprite, xSprite, ySprite, widthInSprite, heightInSprite, this.col * blockSize, this.row * blockSize, blockSize, blockSize);
}


Snake.prototype.headRender = function () {
    if(snake.direction == "up")
        this.segments[0].renderImage(sprite, 194, 2, 60, 62);
    else if(snake.direction == "down")
        this.segments[0].renderImage(sprite, 258, 64, 60, 62);
    else if(snake.direction == "left")
        this.segments[0].renderImage(sprite, 194, 66, 62, 60);
    else // right
        this.segments[0].renderImage(sprite, 256, 2, 62, 60);
}

Snake.prototype.tailRender = function () {
    var theBlockBeforeTail = this.segments[this.segments.length - 2];
    var tailBlock = this.segments[this.segments.length - 1];
    
    if(theBlockBeforeTail.row < tailBlock.row) {
        // the tail goes up
        tailBlock.renderImage(sprite, 198, 128, 52, 59);
    }
    else if (theBlockBeforeTail.row > tailBlock.row) {
        // the tail goes down
        tailBlock.renderImage(sprite, 262, 197, 52, 59);
    }
    else if (theBlockBeforeTail.col < tailBlock.col) {
        // the tail goes left
        tailBlock.renderImage(sprite, 192, 198, 59, 52);
    }
    else if (theBlockBeforeTail.col > tailBlock.col) {
        // the tail goes right
        tailBlock.renderImage(sprite, 261, 134, 59, 52)
    }
}

// render the snake on the screen
Snake.prototype.draw = function () {
    this.headRender();
    
    var theBlockBefore = this.segments[0];
    var theBlockAfter = this.segments[2];
    
    for(var i = 1; i < this.segments.length -1; i++) {
        if(theBlockBefore.col == this.segments[i].col) { //vertical
            
            if(theBlockBefore.row < this.segments[i].row) { // down
                if(theBlockAfter.col > this.segments[i].col) { // then right
                    this.segments[i].renderImage(sprite, 5, 70, 57, 52);
                }
                else if (theBlockAfter.col == this.segments[i].col) {
                    // same vertical line
                    this.segments[i].renderImage(sprite, 134, 64, 52, 63);
                }

                else { // then left
                    this.segments[i].renderImage(sprite, 128, 134, 59, 52);
                }
            }   
            else if (theBlockBefore.row > this.segments[i].row){ // up
                if(theBlockAfter.col > this.segments[i].col) { // then right
                    this.segments[i].renderImage(sprite, 5, 5, 53, 58);
                }
                else if (theBlockAfter.col == this.segments[i].col) {
                    // same vertical line
                    this.segments[i].renderImage(sprite, 134, 64, 52, 63);
                }
                else { // then left
                    this.segments[i].renderImage(sprite, 133, 5, 53, 53);
                }
            }

        }
        
        else if (theBlockBefore.row == this.segments[i].row) { // horizontal
            if(theBlockBefore.col < this.segments[i].col) { // right
                if(theBlockAfter.row < this.segments[i].row) { // then up
                    this.segments[i].renderImage(sprite, 128, 134, 59, 52);
                }
                else if (theBlockAfter.row == this.segments[i].row) {
                    // same horizontal line
                    this.segments[i].renderImage(sprite, 64, 6, 63, 52);
                }
                else { // then down
                    this.segments[i].renderImage(sprite, 133, 5, 53, 53);
                }
            }
            else if (theBlockBefore.col > this.segments[i].col) { // left
                if(theBlockAfter.row < this.segments[i].row) { // then up
                    this.segments[i].renderImage(sprite, 5, 70, 57, 52);
                }
                else if(theBlockAfter.row == this.segments[i].row) {
                    // then same horizontal line
                    this.segments[i].renderImage(sprite, 64, 6, 63, 52);

                }
                else { // then down
                    this.segments[i].renderImage(sprite, 5, 5, 53, 58);
                }
            }
        }
                
        theBlockBefore = this.segments[i];
        theBlockAfter = this.segments[i+2];
        //this.segments[i].drawSquare("Blue");
    }
    
    this.tailRender();
}

// draw an apple (circle) on the apple position
Apple.prototype.draw = function () {
//    this.position.drawCircle("limeGreen");
    this.position.renderImage(sprite, 3, 194, 57, 61);
}

// draw the score
var drawScore = function () {
    ctx.font = blockSize + "px Courier";
    ctx.fillStyle = "Black";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
};

// drawing border 
// border was drawn using css instead of drawing it with the canvas
var drawBorder = function () {
    // drawing top and bottom
    var i;
    var tempBlock = new Block(0, 0);
    var tempBlock2 = new Block(0, heightInBlocks -1);
    
    for (i = 0; i < widthInBlocks; i++) {
        tempBlock.renderImage(wall, 0, 0, 256, 256);
        tempBlock.col += 1;
        tempBlock2.renderImage(wall, 0, 0, 256, 256);
        tempBlock2.col += 1;

    }
    
    tempBlock = new Block(0, 0)
    tempBlock2 = new Block(widthInBlocks -1, 0);
    
    for (i = 0; i < heightInBlocks; i++) {
        tempBlock.renderImage(wall, 0, 0, 256, 256);
        tempBlock.row += 1;
        tempBlock2.renderImage(wall, 0, 0, 256, 256);
        tempBlock2.row += 1;

    }
};

// draw game over
var gameOver = function () {
    cancelAnimationFrame(loopID);
    document.removeEventListener("keydown", keyBoardListner, true);
    ctx.font = blockSize*2 + "px Courier";
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
        snake.move();
        snake.draw();
        apple.draw();
        drawBorder();
        drawScore();
        frames = 0;
    }
}

resize();
// kick off rAF
var loopID = requestAnimationFrame(gameLoop);


//=======================
/* Listen to actions */
//=======================

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


canvas.addEventListener('touchstart', function(e){
    var touchobj = e.changedTouches[0];
    var touchX = parseInt(touchobj.pageX); // get x position of touch point relative to left edge of browser
    
    // if right side of the screen
    if (touchX > window.innerWidth / 2) {
        if (snake.direction == "right" || snake.direction == "left") {
            snake.setDirection("up");
        }
        else {
            snake.setDirection("right");
        }
    }
    
    // left side of the screen
    else {
        if(snake.direction == "left" || snake.direction == "right") {
            snake.setDirection("down");
        }
        else {
            snake.setDirection("left");
        }
    }
    e.preventDefault();
}, false);

function resize () {
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newRatio = newWidth / newHeight;
    var oldRatio = 1280 / 720 ;
    
    if (newRatio > oldRatio) {
        // we need to adjust the width
        newWidth = newHeight * oldRatio;
    }
    else {
        newHeight = newWidth / oldRatio;
    }
    canvas.style.width = newWidth + "px";
    canvas.style.height = newHeight + "px"
    
    canvas.width = newWidth;
    canvas.height = newHeight;
    
    width = newWidth;
    height = newHeight;
    blockSize = 40 * canvas.width / 1280;
    
    widthInBlocks = width / blockSize;
    heightInBlocks = height / blockSize;
}

window.addEventListener("resize", resize, true)

