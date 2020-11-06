const { fromEvent, from, of } = rxjs;
const { map, auditTime } = rxjs.operators;  

let canvas;
let context;

var map_game = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// var platform = [];

player_colors = ["blue", "red", "pink", "yellow", "green", "grey"];

canvas = document.getElementById('canvas-2');
context = canvas.getContext('2d');

let power_x;
let power_y;

var tileH = 26;
var tileW = 18;


var player =  {
    id: 0,
    x: 80,
    y: 60,
    size: 20,
    xVel: 0,
    yVel: 0,
    jump: true,
    height: 20,
    width: 20,
    onGround: true,
    speed: true,
    flight: true,
    status: true
};


var numPlayers = [];

var keypress = {
    up: false,
    right: false,
    left: false,
};

var gameGravity = 0.5;
var friction = 0.7;

var movement = 0.7;

var rectX = 0;
var rectY = 0;

var moveRight = false;
var moveLeft = false;

var grav = false;
var floor = false;

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

fromEvent(socket,'newPlayerID').pipe(
    map((x) => JSON.parse(x))).subscribe(function(playerInit) {
        if (player.id == 0) {
            player.id = playerInit;
            console.log(playerInit);
        }
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

function generatePowerUp() {
    context.fillStyle = 'orange'
    context.fillRect(100, 370, 20, 20)
}

function insertPowerUp() {
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
                // player.jump = false;
                player.yVel = -18;
                onGround = false;
            }
            player.jump = false;
            console.log('jump', player.jump);
            break;
        case 39:
            console.log('moving right');
            moveRight = true;
            break;
    }
}

function keyUp(e) {
    switch (e.keyCode) {
        case 37:
            moveLeft = false;
            break;
        case 38:
            if(player.yVel < -1) {
                player.yVel  = -2;
            } 
            break;
        case 39:
            moveRight = false;
            break;
    }
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
    // console.log(player.jump);
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
    player.yVel = -16;
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


var playerPosDisplayX = document.getElementById('posX');
var playerPosDisplayY = document.getElementById('posY');

var playerSpeedX = document.getElementById('speedX');
var playerSpeedY = document.getElementById('speedY');



function gameLoop(){

    context.clearRect(0, 0, canvas.width, canvas.height);

    for(var i = 0; i < numPlayers.length; i++) {
        context.fillStyle = player_colors[i];
        context.fillRect(numPlayers[i].x, numPlayers[i].y, numPlayers[i].size, numPlayers[i].size);
        if (player.id == numPlayers[i].id)
        {
            continue;
        }
        var playerLocationX = player.x; 
        var playerLocationY = player.y;

        var opPlayerBoundryX1 = numPlayers[i].x - player.size;
        var opPlayerBoundryX2 = numPlayers[i].x + numPlayers[i].size;

        var opPlayerBoundryY1 = numPlayers[i].y - player.size;
        var opPlayerBoundryY2 = numPlayers[i].y + numPlayers[i].size;

        if ((playerLocationX >= opPlayerBoundryX1) && 
        (playerLocationX <= opPlayerBoundryX2) && 
        (playerLocationY >= opPlayerBoundryY1) && 
        (playerLocationY <= opPlayerBoundryY2)) {
            // console.log('collision');
        }
    }

    // for(var col = 0; col < map_game.length; col++) {
        // for(var row = 0; row < map_game[col].length; row++) {
            // if(platform == 2) {
                // console.log('here here here here');
            // }
    //         var playerLocationX = player.x; 
    //         var playerLocationY = player.y;

    //         var mapPlayerBoundryX1 = map_game[col][row] - player.size;
    //         var mapPlayerBoundryX2 = map_game[col][row] + map_game[col][row].size;

    //         var mapPlayerBoundryY1 = map_game[col][row] - player.size;
    //         var mapPlayerBoundryY2 = map_game[col][row] + map_game[col][row].size;

            // if(map_game[col][row] === 2) {
                // var mapX = row * tileW;
                // var mapY = col * tileH;
                // if()


    // if(player.x > canvas.width - player.width - 20) { 
    //     player.x = canvas.width - player.width - 20; 
    // }
    
    // if(player.y > canvas.height - player.height - 20) { 
    //     player.y = canvas.height - player.height - 20; 
    // }
                // if(player.x + player.size >= mapX && player.x <= mapX + tileW && player.y + player.size >= mapY && player.y <= mapY + tileH) {
                // if(player.y + player.size >= mapY && player.y <= mapY + tileH) {

                // if(player.y > canvas.height - player.height - 20) { player.y = canvas.height - player.height - 20; }
                    // floor = true;
                    // grav = true;
                    // player.yVel = 0;
                    // player.y = mapY - player.s;
                // }
            // }
        // }
    // }
    
    // if(floor) {
        if(moveLeft) { 
            player.xVel -= 2;
        }
        if(moveRight) { 
            player.xVel += 2;
        }
    // } else {
        player.yVel += gameGravity * 0.7;
    // }

    moveLeft = false;
    moveRight = false;

    player.x += player.xVel;
    player.y += player.yVel;
    // player.yVel += gameGravity * 0.9;
    player.xVel *= friction;

    grav = true;
    floor = false;

    if(player.x <= 20) { player.x = 20; }

    if(player.y <= 20) { player.y = 20; }

    if(player.x > canvas.width - player.width - 20) { 
        player.x = canvas.width - player.width - 20; 
    }
    
    if(player.y > canvas.height - player.height - 20) { 
        player.y = canvas.height - player.height - 20; 
    }

    renderMap();
    stream();
    // insertPowerUp();
    if(player.speed) {
        generatePowerUp();
    }

    if ((player.x >= 100) && (player.x <= 120) && (player.y >= 370) && (player.y <= 390)) {
            console.log('collision');
    }

    window.requestAnimationFrame(gameLoop);
    
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function checkPlatform(){
    for(var col = 0; col < map_game.length; col++) {
        for(var row = 0; row < map_game[col].length; row++) {
            if(map_game[col][row] === 2) {
                var mapX = row * tileW;
                var mapY = col * tileH;
                if(player.x + player.size >= mapX && player.x <= mapX + tileW && player.y + player.size >= mapY && player.y <= mapY + tileH) {
                    floor = true;
                    player.yVel = 0;
                    player.y = mapY - player.s;
                }
            }
        }
    }
}