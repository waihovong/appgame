let app = require('express')();

let cors = require('cors');
app.use(cors());

let http = require('http').Server(app);
let io = require('socket.io')(http);

http.listen(3000,()=>console.log('Server listening on port 3000'));

let { combineLatest, fromEvent } = require('rxjs');
let { map, startWith, auditTime } = require('rxjs/operators');

let connected_observables = [];
let main_observable = null;

var id_counter = 0;

fromEvent(io,'connection')
  .subscribe(function(client) {
    
    // Restart the main observable if required
    if(connected_observables.length > 0){
      stopMain();
    }

    id_counter++
	if (id_counter == 1) {
    	io.emit('newPlayerID',JSON.stringify({
			id: id_counter,
			status: "chaser"
		}));
	} else {
		io.emit('newPlayerID',JSON.stringify({
			id: id_counter,
			status: "runner"
		}));
	}
    
    // Observe events from this client; start in center of screen
    let client_obs = fromEvent(client, 'playerObject').pipe(
      map((x)=>JSON.parse(x))
      // startWith([50,50,''])
    );
    // Add client observable to array
    connected_observables.push(client_obs);

    fromEvent(client, 'disconnect').subscribe(() => { 
		// Remove disconnected observable from array
		let index = connected_observables.indexOf(client_obs);
		if (index > -1) {
			connected_observables.splice(index, 1);
		}
		
		// Restart the main observable
		stopMain();
		if(connected_observables.length > 0){
			startMain();
		}
		console.log('removed a connection');
    });

    // Start main observable
    startMain();
    console.log('added connection');

  });
  
var player_server = [];
var powerUpSpeed = {
	name: "speed",
	x: 70,
	y: 370,
	size: 20,
	visible: true
}
var powerUpFlight = {
	name: "flight",
	x: 270,
	y: 370,
	size: 20,
	visible: true
}
var powerup = [powerUpSpeed, powerUpFlight];
var first = 0;

function startMain() {
  // Combine latest outputs from all clients; send updates at most every 100ms
main_observable = combineLatest(connected_observables).pipe(
auditTime(50)
).subscribe((x) => { 
	for (let i=0; i<player_server.length; i++) {
		if (player_server.flight != null) {
			x[i].flight = player_server.flight;
			x[i].speed = player_server.speed;
			x[i].status = player_server.status;
			x[i].alive = player_server.alive;
		}	
	}
    player_server = x;

    for(var i = 0; i < x.length; i++) {
		for(var j = 0; j < x.length; j++) {
			if (i!=j) {

			if(player_server[i].status == "chaser" && first == 0) {
				first = 1;
				player_server[i].x = 20;
			}

			//going through to see who is the chaser when players join
			//if tagged they are eliminated from the game but can still spectate
			if(player_server[i].status == "chaser" && player_server[j].status == "runner") {
				if(detectCollision(player_server[i], player_server[j])) {
					console.log('you lose you got tagged');
					player_server[j].alive = false;	
					player_server[j].x = 800;
				}
				io.emit('players',JSON.stringify(player_server));
			}
			//going through to see who is the chaser when players join
			//if tagged they are eliminated from the game but can still spectate
			if(player_server[i].status == "runner" && player_server[j].status == "chaser") {
				if(detectCollision(player_server[i], player_server[j])) {
					console.log('you lose you got tagged');
					player_server[i].alive = false;	
					player_server[i].x = 800;
				}
				io.emit('players',JSON.stringify(player_server));
			}
			//chaser becomes slower
			if (player_server[i].status == "runner") {
				if(detectCollision(player_server[i], powerUpSpeed) && powerUpSpeed.visible) {
					// hide power up
					powerUpSpeed.visible = false;
					setTimeout(function () {
						powerUpSpeed.visible = true;
						for(var p = 0; p < player_server.length; p++) {
							player_server[p].speed = true;
						}
						io.emit('players',JSON.stringify(player_server));
					}, 5000);

					for(var k = 0; k < x.length; k++) {
						if (i != k ) {
							player_server[k].speed = false;
						} 
					}
					console.log("speed");
				}
			}
			// chaser gets no fly power up
			if (player_server[i].status == "chaser") {
				if(detectCollision(player_server[i], powerUpFlight) && powerUpFlight.visible) {
					// hide power up
					powerUpFlight.visible = false;
					setTimeout(function () {
						powerUpFlight.visible = true;
						for(var p = 0; p < player_server.length; p++) {
							player_server[p].flight = true;
						}
						io.emit('players',JSON.stringify(player_server));
					}, 5000);

					// prevent all others from flying
					for(var k = 0; k < x.length; k++){
						if (i != k ) {
							player_server[k].flight = false;
							console.log('this is the id', player_server[k].id);
						}
					}
					console.log("anti fly on the ground");
				}
			}
		}
		}
    }
	// console.log(player_server[1])
	io.emit('powerUps',JSON.stringify(powerup));
	io.emit('players',JSON.stringify(player_server));
  });
}

function stopMain() {
  main_observable.unsubscribe();
}

function detectCollision(obj1, obj2) {
  if( obj1.x >= obj2.x &&                           // top left
      obj1.x <= obj2.x + obj2.size && 
      obj1.y >= obj2.y && 
      obj1.y <= obj2.y + obj2.size) {
    return true;
  } else if( 
      obj1.x + obj1.size >= obj2.x &&               // top right
      obj1.x + obj1.size <= obj2.x + obj2.size && 
      obj1.y >= obj2.y && 
      obj1.y <= obj2.y + obj2.size) {
    return true;
  } else if( 
      obj1.x >= obj2.x &&                           // bottom left
      obj1.x <= obj2.x + obj2.size && 
      obj1.y + obj1.size >= obj2.y && 
      obj1.y + obj1.size <= obj2.y + obj2.size) {
    return true;
  } else if( 
      obj1.x + obj1.size >= obj2.x &&              // bottom right
      obj1.x + obj1.size <= obj2.x + obj2.size && 
      obj1.y + obj1.size >= obj2.y && 
      obj1.y + obj1.size <= obj2.y + obj2.size) {
    return true;
  } else {
    //console.log('not server side collision');
    return false;
  }
}