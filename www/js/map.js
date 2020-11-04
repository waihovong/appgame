const { fromEvent, from, of } = rxjs;
const { map, auditTime } = rxjs.operators;  

let canvas;
let context;

var map_game = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

player_colors = ["blue", "red", "pink", "yellow", "green", "grey", ""]

canvas = document.getElementById('canvas-2');
context = canvas.getContext('2d');

let power_x;
let power_y;

var tileH = canvas.height % 41;
var tileW = canvas.width % 41;


var player =  {
    x: 600,
    y: 70,
    xVel: 0,
    yVel: 0,
    jump: true,
    height: 20,
    width: 20,
    onGround: true,
    invincible: false,
    flight: false
    
};

var numPlayers = [];

var keypress = {
    up: false,
    right: false,
    left: false,
};

var gameGravity = 0.5;
var grav = false;
var friction = 0.7;

var movement = 0.7;

var rectX = 0;
var rectY = 0;

var moveRight = false;
var moveLeft = false;

var boundry = false;

var buttonDown = false;

window.onload = init;

var socket = io.connect('http://' +window.localStorage.getItem("ip") + ':3000');

function stream() {
    if(socket.connected) {
        const playerObservable = of(player);
        playerObservable.subscribe(function(playerObj) {
            // console.log(playerObj);
            socket.emit('playerObject', JSON.stringify(playerObj));
        });
    }
}

fromEvent(socket,'players').pipe(
    map((x) => JSON.parse(x))).subscribe(function(mice) {
        numPlayers = mice;
});


function init(){
    window.requestAnimationFrame(gameLoop);
}

function createPlayer() {
    context.fillStyle = "#FF0000";
    context.fillRect(player.x, player.y, player.width, player.height);

}

function renderMap() {
    for(var x = 0; x < map_game.length; x++) {
        for(var y = 0; y < map_game[x].length; y++) {
            if(map_game[x][y] !== 0) {
                context.fillStyle= "#000000";
                context.fillRect(y * 20, x * 20, 20, 20);
            }
            if(map_game[x][y] == 2) {
                context.fillStyle = "#AEF172";
                context.fillRect(y * 20, x * 20, 20, 20);
            }
        }
    }
}

function showPower(min, max) {
    return Math.round(Math.random() * (max - min) / 10) * min;
}

function generatePowerUp() {
    power_x = showPower(100, canvas.width / 2);
    power_y = showPower(100, canvas.height / 2);
    context.fillStyle = 'blue'
    context.fillRect(power_x, power_y, 10, 10)
}

function insertPowerUp() {
    // console.log('inserting power up');
    
    context.fillStyle = 'blue';
    context.fillRect(power_x, power_y, 10, 10);
}

function keyDown(e) {
    switch(e.keyCode) {
        case 37:
            console.log('moving left');
            moveLeft = true;
            break;
        case 38:
            if(grav) {
                console.log('jump');
                player.yVel = -9;
                onGround = false;
            }
            break;
        case 39:
            console.log('moving right');
            moveRight = true;
            break;
    }
}


function leftMovement() {
    buttonDown = true;
    moveLeft = true;
    console.log('moving left');
    // player.xVel = -1;
}

var mouseDownR;
var mouseDownL;
var mouseDownJ;

var rightM = document.getElementById('rightMovement');
var leftM = document.getElementById('leftMovement');
var jumpM = document.getElementById('jumpMovement');


function rightMovement() {
    mouseDownR = requestAnimationFrame(whileMouseDownR);
}

function leftMovement() {
    mouseDownL = requestAnimationFrame(whileMouseDownL);
}

function jumpMovement() {
    mouseDownJ = requestAnimationFrame(whileMouseDownJ);
}

function whileMouseDownR() {

    player.xVel = 2;
    mouseDownR = requestAnimationFrame(whileMouseDownR);
}

function whileMouseDownL() {
    player.xVel = -2;
    mouseDownL = requestAnimationFrame(whileMouseDownL);

}

function whileMouseDownJ() {
    player.yVel = -5;
    mouseDownJ = requestAnimationFrame(whileMouseDownJ);
}

function stopRight(){
    cancelAnimationFrame(mouseDownR);
}

function stopLeft() {
    cancelAnimationFrame(mouseDownL);
}

function stopJump() {
    cancelAnimationFrame(mouseDownJ);
}

rightM.addEventListener('mousedown', rightMovement);
rightM.addEventListener('mouseup', stopRight);

rightM.addEventListener('touchstart', rightMovement);
rightM.addEventListener('touchend', stopRight);

leftM.addEventListener('mousedown', leftMovement);
leftM.addEventListener('mouseup', stopLeft);

leftM.addEventListener('touchstart', leftMovement);
leftM.addEventListener('touchend', stopLeft);

jumpM.addEventListener('mousedown', jumpMovement);
jumpM.addEventListener('mouseup', stopJump);

jumpM.addEventListener('touchstart', jumpMovement);
jumpM.addEventListener('touchend', stopJump);


function keyUp(e) {
    switch (e.keyCode) {
        case 37:
            moveLeft = false;
            break;
        case 38:
            if(player.yVel < -1) {
                player.yVel  = -1;
            } 
            break;
        case 39:
            moveRight = false;
            break;
    }
}

var playerPosDisplayX = document.getElementById('posX');
var playerPosDisplayY = document.getElementById('posY');

var playerSpeedX = document.getElementById('speedX');
var playerSpeedY = document.getElementById('speedY');

// console.log(player.width);


function gameLoop(){
    var x = player.x
    var y = player.y
    context.clearRect(0, 0, canvas.width, canvas.height);

    console.log('number of players in the game', numPlayers.length);

    for(var i = 0; i < numPlayers.length; i++) {
        context.fillStyle = player_colors[i];
        context.fillRect(numPlayers[i].x, numPlayers[i].y, numPlayers[i].width, numPlayers[i].height);
        // window.requestAnimationFrame(gameLoop);
    }

    if(moveLeft) { player.xVel -= 2; }
    
    if(moveRight) { player.xVel += 2; }

    moveLeft = false;
    moveRight = false;

    player.x += player.xVel;
    player.y += player.yVel;
    player.yVel += gameGravity * 0.9;
    player.xVel *= friction;

    grav = true;
    var playerPosX = player.x;
    var playerPosY = player.y;

    if(player.x < 0) { player.x = 0; }

    if(player.y < 0) { player.y = 0; }

    if(player.x > canvas.width - player.width) { player.x = canvas.width - player.width; }
    
    if(player.y > canvas.height - player.height) { player.y = canvas.height - player.height; }

    playerPosDisplayX.innerHTML = "X: " + playerPosX;
    playerPosDisplayY.innerHTML = "Y: " + playerPosY;
    
    // createPlayer();
    renderMap();
    stream();
    window.requestAnimationFrame(gameLoop);
    
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function detectWall() {
    // grav = true;
    for(var y = 0; y < map_game.length; y++) {
        for(var x = 0; x < map_game[y].length; x++) {
            if(map_game[y][x] == 0){

                var tileX = x*tileW;
                var tileY = y*tileH;
    
                if(player.x + player.xVel >= tileX && player.x <= tileX + tileW && player.y + player.yVel >= tileY && player.y <= tileY + tileH){                 
                    player.yVel = 0;
                    player.y = tileY - player.yVel;
                }
            } else if(map_game[y][x] == 1) {
                var tileX = x * tileW;
                grav = true;
                if((player.xVel + player.x) == tileX) {
                    console.log('collision')
                    player.xVel = 0;
                }
            }
        }
    }
}

function detectCollision(obj1, obj2) {
    var box1Right = obj1.x + obj1.width
    var box1Bottom = obj1.y + obj1.height  
    var box2Left = obj2.x + obj2.width
    var box2Bottom = obj2.y + obj2.height  
    
    if(box1Right > obj2.x && box2Left > obj1.x && 
      box1Bottom > obj2.y && box2Bottom > obj1.y) {
          return true;
    }
    return false
}
