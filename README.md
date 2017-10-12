# SnakeJS
The classic snake game implemented in vanilla javascript

## Demo
This game is fully responsive and is playable on all screen sizes. It's more suited in landscape mode.  
You can try a demo [here](http://mohammadelbanna.github.io/SnakeJS/).

## Controls
It's very simple! on a desktop just use your arrow keys to control the direction of the snake. you can also press "p" to 
pause the game.

On a touch device the controls are very simple yet take a little to get the hang of it.  
You can touch the right half of the screen to:
* make the snake go **right** when it's going up or down
* make the snake go **up** when it's going left or right

You can touch the left half of the screen to: 
* make the snake go **left** when it's going up or down
* make the snake go **down** when it's going left or right

This is like playing the classic snake game on Nokia 3310 with only two keys, 3 and 7 ( the master's way ;) ).


## Rendering method
Canvas element is used as the rendering method in this game.  
I used the game loop pattern to animate objects on the screen. In each iteration the whole canvas is cleared and is
painted all over again.  
I used the requestAnimationFrame instead of setTimeout to sync the iterations with the browser painting events.

## Canvas and DOM
Canvas element's drawImage method is more convenient and stright forward than CSS 
properties _**background-size**_ and _**background-position**_
when dealing with sprite sheets.  

The canvas way for rendering is to clear the canvas and draw every pixel all over again only once, while when dealing with the DOM 
if you are not _-very-_ careful you can trigger a reflow and paint the whole page for every simple change, which would 
ruin the performance in the end. Also canvas is easier to be adapted to different screen sizes than dealing with the DOM.

On the other hand canvas make you do everything from scratch so a framework is typically a must, while using the DOM can make 
your life easier when having a layout module like flexbox that could be used for UI for example.  

A hybrid approach is generally possible but that wasn't this project approach.

## Acknowledgments
A lot of the implementation was inspired by Nick Morgan's book [Javascript for kids](http://www.amazon.com/JavaScript-Kids-Playful-Introduction-Programming/dp/1593274084) 
especially the chapter on the snake game, though no sprite sheet was used and the game was designed for a fixed screen size.

The snake and apple sprite sheet was from rembound blog. You can find it [here](http://rembound.com/files/creating-a-snake-game-tutorial-with-html5/snake-graphics.png).

The desert background that is used is an artwork of Bob Rooney. [link](http://www.wetcanvas.com/forums/showthread.php?t=326813)

The grass tile that is used in the background was from pinterest pinned from huaban.com
