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

player_colors = ["blue", "red", "pink", "yellow", "green", "grey"]

canvas = document.getElementById('canvas-2');
context = canvas.getContext('2d');

let power_x;
let power_y;

var tileH = canvas.height % 41;
var tileW = canvas.width % 41;


var player =  {
    id: null,
    x: 80,
    y: 40,
    size: 20,
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
        // console.log (numPlayers);
});

fromEvent(socket,'newPlayerID').pipe(
    map((x) => JSON.parse(x))).subscribe(function(playerInit) {
        player.id = playerInit;
        console.log(playerInit);
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



function gameLoop(){

    // canvas.height = window.innerHeight;
    // canvas.width = window.innerWidth;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // console.log('number of players in the game', numPlayers.length);

    for(var i = 0; i < numPlayers.length; i++) {
        context.fillStyle = player_colors[i];
        context.fillRect(numPlayers[i].x, numPlayers[i].y, numPlayers[i].size, numPlayers[i].size);
        //   var ax2 = a.x + a.w;
//   var ay2 = a.y + a.h;
//   var bx2 = b.x + b.w;
//   var by2 = b.y + b.h;

//   var xInRange = (a.x >= b.x && a.x <= bx2 || ax2 >= b.x && ax2 <= bx2);
//   var yInRange = (a.y >= b.y && a.y <= by2 || ay2 >= b.y && ay2 <= by2);
//   // Clockwise hit from top 1,2,3,4 or -1

//   if (ay2 > b.y && a.y < by2 && xInRange) return 1; // A hit the top of B
//   if (a.x < bx2 && ax2 > b.x && yInRange) return 2; // A hit the right of B
//   if (a.y < by2 && ay2 > b.y && xInRange) return 3; // A hit the bottom of B
//   if (ax2 > b.x && a.x < bx2 && yInRange) return 4; // A hit the right of B
//   return -1; // nohit
// }
    }



for(var i = 0; i < numPlayers.length; i++) {

        // // window.requestAnimationFrame(gameLoop);
        // if ((player.y + player.size) > numPlayers[i].x && player.y < (numPlayers[i].y + numPlayers[i].size) && player.x >= numPlayers[i].x && player.x <= (numPlayers[i].x + numPlayers[i].size || (player.x + player.size) >= numPlayers[i].x && (player.x + player.size) <= (numPlayers[i].x + numPlayers[i].size)) ) {
        //     console.log('hello this is a collision player hit TOP of opponent');
        // }
        // if(player.x < (numPlayers[i].x + numPlayers[i].size) && (player.x + player.size) > numPlayers[i].x && player.y >= numPlayers[i].y && player.y <= (numPlayers[i].y + numPlayers[i].size || (player.y + player.size) >= numPlayers[i].y && (player.y + player.size) <= (numPlayers[i].y + numPlayers[i].size)) ) {
        //     console.log('this is collision player hit RIGHT of opponent');
        // }
        // if(player.y < (numPlayers[i].y + numPlayers[i].size) && player.y + player.size > numPlayers[i].y && player.x >= numPlayers[i].x && player.x <= numPlayers[i].x + numPlayers[i].size || (player.x + player.size) >= numPlayers[i].x && (player.x + player.size) <= (numPlayers[i].x + numPlayers[i].size)) {
        //     console.log('this is collision player hit BOTTOM of opponent');
        // }
        // if((player.x + player.size) > numPlayers[i].x && player.x < (numPlayers[i].x + numPlayers[i].size && player.y >= numPlayers[i].y && player.y <= numPlayers[i].y + numPlayers[i].size || (player.y + player.size) >= numPlayers[i].y && (player.y + player.size) <= (numPlayers[i].y + numPlayers[i].size))) {
        //     console.log('this is collision player hit LEFT of opponent');
        // }

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

            // console.log(playerLocationX, playerLocationY, numPlayers[i].x, numPlayers[i].y);
        if ((playerLocationX >= opPlayerBoundryX1) && (playerLocationX <= opPlayerBoundryX2) && (playerLocationY >= opPlayerBoundryY1) && (playerLocationY <= opPlayerBoundryY2)) {
            // console.log("collision: ", playerLocationX, playerLocationY, opPlayerBoundryX1, opPlayerBoundryX2, opPlayerBoundryY1, opPlayerBoundryY2);
        }
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

    if(player.x <= 20) { player.x = 20; }

    if(player.y <= 20) { player.y = 20; }

    if(player.x > canvas.width - player.width - 20) { player.x = canvas.width - player.width - 20; }
    
    if(player.y > canvas.height - player.height - 20) { player.y = canvas.height - player.height - 20; }


    // for(var col = 0; col < map_game.length; col++) {
    //     for(var row = 0; row < map_game[col].length; row++) {
    //         // console.log(map_game[col][row]);
    //     }
    // }
    // var topLeft = player.size;
    // var topRight;
    // var bottomLeft;
    // var bottomRight;

    // player = a
    // numPlayers = b

    // if ((player.y + player.size) && player.y < (numPlayers.y + numPlayers.size) && player.x >= numPlayers.x && player.x <= (numPlayers.x + numPlayers.size || (player.x + player.size) >= numPlayers.x && (player.x + player.size) <= (numPlayers.x + numPlayers.size)) ) {
    //     console.log('hello this is a collision player hit TOP of opponent');
    // }
    // if(player.x < (numPlayers.x + numPlayers) && (player.x + player.size) > numPlayers.x && player.y >= numPlayers.y && player.y <= (numPlayers.y + numPlayers.size || (player.y + player.size) >= numPlayers.y && (player.y + player.size) <= (numPlayers.y + numPlayers.size)) ) {
    //     console.log('this is collision player hit RIGHT of opponent');
    // }
    // if(player.y < (numPlayers.y + numPlayers.size) && player.y + player.size > numPlayers.y && player.x >= numPlayers.x && player.x <= numPlayers.x + numPlayers.size || (player.x + player.size) >= numPlayers.x && (player.x + player.size) <= (numPlayers.x + numPlayers.size)) {
    //     console.log('this is collision player hit BOTTOM of opponent');
    // }
    // if((player.x + player.size) > numPlayers.x && player.x < (numPlayers.x + numPlayers.size && player.y >= numPlayers.y && player.y <= numPlayers.y + numPlayers.size || (player.y + player.size) >= numPlayers.y && (player.y + player.size) <= (numPlayers.y + numPlayers.size))) {
    //     console.log('this is collision player hit LEFT of opponent');
    // }

    // player.x >= numPlayers.x && player.x <= numPlayers.x + numPlayers.size || (player.x + player.size) >= numPlayers.x && (player.x + player.size) <= (numPlayers.x + numPlayers.size)

    //player.y >= numPlayers.y && player.y <= numPlayers.y + numPlayers.size || (player.y + player.size) >= numPlayers.y && (player.y + player.size) <= (numPlayers.y + numPlayers.size)
//   function boxCollide(a, b) {

//   var ax2 = a.x + a.w;
//   var ay2 = a.y + a.h;
//   var bx2 = b.x + b.w;
//   var by2 = b.y + b.h;

//   // simple hit true, false
//   //if (ax2 < b.x || a.x > bx2 || ay2 < b.y || a.y > by2) return false;
//   // return true

//   var xInRange = (a.x >= b.x && a.x <= bx2 || ax2 >= b.x && ax2 <= bx2);
//   var yInRange = (a.y >= b.y && a.y <= by2 || ay2 >= b.y && ay2 <= by2);
//   // Clockwise hit from top 1,2,3,4 or -1

//   if (ay2 > b.y && a.y < by2 && xInRange) return 1; // A hit the top of B
//   if (a.x < bx2 && ax2 > b.x && yInRange) return 2; // A hit the right of B
//   if (a.y < by2 && ay2 > b.y && xInRange) return 3; // A hit the bottom of B
//   if (ax2 > b.x && a.x < bx2 && yInRange) return 4; // A hit the right of B
//   return -1; // nohit
// }


    renderMap();
    stream();
    window.requestAnimationFrame(gameLoop);
    
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function haveIntersection(r1, r2) {
    return !(
        r2.x > r1.x + r1.width ||
        r2.x + r2.width < r1.x ||
        r2.y > r1.y + r1.height ||
        r2.y + r2.height < r1.y
    );
}
