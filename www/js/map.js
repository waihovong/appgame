let canvas;
let context;

var map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],

];
canvas = document.getElementById('canvas-2');
context = canvas.getContext('2d');

let power_x;
let power_y;

var tileH = canvas.height;
var tileW = canvas.width;

var player =  {
    x: 600,
    y: 70,
    xVel: 0,
    yVel: 0,
    jump: true,
    height: 20,
    width: 20,
    onGround: false,
    invincible: false,
    
};

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

window.onload = init;

function init(){


    // Start the first frame request

    window.requestAnimationFrame(gameLoop);
}

function createPlayer() {
    context.fillStyle = "#FF0000";
    context.fillRect(player.x, player.y, player.width, player.height);
}

function renderMap() {
    for(var x = 0; x < map.length; x++) {
        for(var y = 0; y < map[x].length; y++) {
            if(map[x][y] !== 0) {
                context.fillStyle= "#000000";
                context.fillRect(
                    y * 20, x * 20, 20, 20
                );
            }
            if(map[x][y] == 2) {
                context.fillStyle = "#AEF172";
                context.fillRect(
                    y * 20, x * 20, 20, 20
                );
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
    context.fillStyle = 'yellow'
    context.fillRect(power_x, power_y, 10, 10)
}

function insertPowerUp() {
    // console.log('inserting power up');
    
    context.fillStyle = 'yellow';
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

    if(moveLeft) {
        player.xVel =-2;
    }

    if(moveRight) {
        player.xVel = 2
    }

    player.x += player.xVel;
    player.y += player.yVel;
    player.yVel += gameGravity * 0.9;
    player.xVel *= friction;

    // if(grav) {
    //     player.xVel *= 0.1;
    // } else {
    //     player.yVel = 1;
    // }

    grav = false;
    var playerPosX = player.x;
    var playerPosY = player.y;

    if(player.x < 0) {
        player.x = 0;
    }

    if(player.y < 0) {
        player.y = 0;
    }

    if(player.x > canvas.width - player.width) {
        // console.log('hitting ground');        
        player.x = canvas.width - player.width;
    }
    
    if(player.y > canvas.height - player.height) {
        // console.log('hit ground')
        player.y = canvas.height - player.height;

    }

    // for(var col = 0; col < map.length; col++) {
    //     for(var row = 0; row < map[col].length; row++) {
    //         if(map[col][row] === 2) {
    //             grav = true;
    //             if(player.x > map[row].x && player.x < map[row].x + 20 && player.y > map[col].y && player.y < map[col].y + 20){
    //                 console.log('collision');
    //             }
    //         }
    //     }
    // }

    playerPosDisplayX.innerHTML = "X: " + playerPosX;
    playerPosDisplayY.innerHTML = "Y: " + playerPosY;

    // playerSpeedX.innerHTML = "X speed: " + player.xVel;
    // playerSpeedY.innerHTML = "Y speed: " + player.yVel;

    // for(var col = 0; col < map.length; col++) {
    //     for(var row = 0; row < map[col].length; row++) {
    //         if (map[col][row] == 0) {
                
    //             // console.log(map[col]);
    //             if(playerPosX + player.width >= map[col] && playerPosX <= map[col] + map[row] && playerPosY + player.width >= map[col] && playerPosY <= map[col] + map[row]) {
    //                 player.yVel = 0;
    //                 grav = true;
    //                 playerPosY = map[col] - player.yVel;
    //             }
    //         } if(map[row][col] == 1) {
    //             grav = true;
    //             if((player.xVel + playerPosX) == map[row]) {
    //                 console.log('collision with wall');
    //                 player.yVel = 0;
    //             }
    //         } 
    //     }
    // }
    
    createPlayer();
    // renderMap();
    // insertPowerUp();
    generatePowerUp();
    

    window.requestAnimationFrame(gameLoop);
    
}

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function detectWall() {
    // grav = true;
    for(var y = 0; y < map.length; y++) {
        for(var x = 0; x < map[y].length; x++) {
            if(map[y][x] == 0){

                var tileX = x*tileW;
                var tileY = y*tileH;
    
                if(player.x + player.xVel >= tileX && player.x <= tileX + tileW && player.y + player.yVel >= tileY && player.y <= tileY + tileH){                 
                    player.yVel = 0;
                    player.y = tileY - player.yVel;
                }
            } else if(map[y][x] == 1) {
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
    var box2Right = obj2.x + obj2.width
    var box2Bottom = obj2.y + obj2.height  
    
    if(box1Right > obj2.x && box2Right > obj1.x && 
      box1Bottom > obj2.y && box2Bottom > obj1.y) {
          return true;
    }
    return false
}