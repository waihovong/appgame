const { fromEvent, from, of } = rxjs;
const { map, auditTime } = rxjs.operators;  

let canvas;
let context;
let powerups = [];
//map design layout 1 being the walls and 2 being sprite clouds
var map_game = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,2,0,0,0,0,0,0,0,0,2,2,2,0,1],
    [1,0,0,2,2,2,0,0,0,0,2,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,1],
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

//player object with states for the gameplay
var player =  {
    id: 0,
    x: 140,
    y: 60,
    size: 20,
    xVel: 0,
    yVel: 0,
    jump: true,
    height: 20,
    width: 20,
    alive: true,
    speed: true,
    flight: true,
    status: "runner",
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

//stream to server

function stream() {
    if(socket.connected) {
        const playerObservable = of(player);
        playerObservable.subscribe(function(playerObj) {
            socket.emit('playerObject', JSON.stringify(playerObj));
        });
    }
}

fromEvent(socket,'players').pipe(
    map((x) => JSON.parse(x))).subscribe(function(mice) {
        numPlayers = mice;
        for (let i=0; i<numPlayers.length; i++) {
            if (numPlayers[i].id == player.id) {
                player = numPlayers[i];
            }
        }
});

fromEvent(socket,'powerUps').pipe(
    map((x) => JSON.parse(x))).subscribe(function(mice) {
        powerups = mice;
});

fromEvent(socket,'newPlayerID').pipe(
    map((x) => JSON.parse(x))).subscribe(function(playerInit) {
        if (player.id == 0) {
            player.id = playerInit.id;
            player.status = playerInit.status;
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
                context.fillStyle = "#F0F0F0";
                context.fillRect(y * 20, x * 20, 20, 20);
            }
        }
    }
}

//creating power ups for players

function generatePowerUpSpeed(obj) {
    context.fillStyle = 'orange'
    if (obj.visible) {
        context.fillRect(obj.x, obj.y, obj.size, obj.size)
    }
}

function generatePowerUpFlight(obj) {
    context.fillStyle = 'purple'
    if (obj.visible) {
        context.fillRect(obj.x, obj.y, obj.size, obj.size)
    }
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

//movements for buttons for android devices

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
    console.log('down RIGHT');
    if(player.speed == false) {
        player.xVel = 2;
    } else if(player.speed == true) {
        player.xVel = 4;
    }
    mouseDownR = requestAnimationFrame(whileMouseDownR);
}

function whileMouseDownL() {
    console.log('down LEFT');
    if(player.speed == false) {
        player.xVel = -2;
    } else if (player.speed == true) {
        player.xVel = -4;
    }
    mouseDownL = requestAnimationFrame(whileMouseDownL);
}

function whileMouseDownJ() {
    console.log(player)
    if(player.flight == false) {
        player.yVel = -4;
    } else if(player.flight == true) {
        player.yVel = -15;
    }
    mouseDownJ = requestAnimationFrame(whileMouseDownJ);
}

//stop movement when touch screen no longer in use

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

function gameLoop(){

    context.clearRect(0, 0, canvas.width, canvas.height);

    //create dummy players for the server to generate
    //the updates when the clients moves to the server

    if(player.alive == true) {
        for(var i = 0; i < numPlayers.length; i++) {
            context.fillStyle = player_colors[i];
            context.fillRect(numPlayers[i].x, numPlayers[i].y, numPlayers[i].size, numPlayers[i].size);
            if (player.id == numPlayers[i].id)
            {
                continue;
            }
        }
    } else if(player.alive == false) {
        console.log('dead dead dead');
    }


    if(moveLeft) { 
        player.xVel -= 2;
    }
    if(moveRight) { 
        player.xVel += 2;
    }

    player.yVel += gameGravity * 0.7;

    moveLeft = false;
    moveRight = false;

    player.x += player.xVel;
    player.y += player.yVel;

    player.xVel *= friction;

    grav = true;
    floor = false;
    
    //canvas collision detection make players not move past borders

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

    if (powerups.length == 2) {
        generatePowerUpSpeed(powerups[0]);
        generatePowerUpFlight(powerups[1]);
    }

    window.requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
