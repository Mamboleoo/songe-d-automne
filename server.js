var express = require("express"),
	app = express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server),
	mongojs = require("mongojs"),
	domain = require('domain');
	// var databaseUrl = "mongodb://mamboleoo:(mamboo)@kahana.mongohq.com:10029/songe-d-automne"; // "username:password@example.com/mydb"
	var collections = ["players", "reports"]
	// var db = mongojs(databaseUrl, collections);
	
	var d = domain.create();
	d.on('error', function(err) {
	  console.error(err);
	});

//My Vars
var players 	= {},
	nbrPlayer 	= 0,
	status 		= {},
	msg 		= [],
	gameOn 		= false,
	rank 		= 3,
	timer1, timer2,
	raPlayers	= {},
	raIntervalLeft = new Date().getTime(),
	charlyRound = 0,
	charlyGameIsEnd = true;

app.use(express.static(__dirname + "/"));

io.sockets.on("connection", function(socket){

	//DECONNEXION
	socket.on("disconnect", function(){
		socket.leave("charly");
		socket.leave("runAway");
    	if(io.sockets.clients("charly").length==0){
    		gameOn = false;
    		timer1 = clearTimeout(timer1);
    		timer2 = clearTimeout(timer2);
    	}
		delete players[socket.name];
		delete raPlayers[socket.name];
		socket.broadcast.emit("new player left", players);
	});
    socket.on("ping", function(){
        socket.emit("server ping");
    });
    socket.on("informations changed", function(newInfos, noName){
    	if(noName){
    		players[newInfos.name] = newInfos;
			socket.broadcast.emit("player changed infos", players);
		}
		else{
			//Add new infos in new object
	    	players[newInfos.name] = newInfos;
	    	//Delete old infos
			delete players[socket.name];
			//change socket name
			socket.name = newInfos.name;
	        socket.broadcast.emit("player changed infos", players);
		}
		// db.players.update( { _id: socket.dbId }, newInfos,true);
    });

    //CHARLY 
    socket.on("send message", function(newMsg){
    	msg.push(newMsg);
		io.sockets.in("charly").emit("new message", newMsg);
    });

    socket.on("start game", function(){
    	socket.join("charly");
    	players[socket.name].inGame = true;
    	socket.emit("join the game", players, charlyRound, charlyGameIsEnd);
    	socket.broadcast.in("charly").emit("new challenger", players);
    	if(!gameOn){gameOn = true;newRound();}
    });
    function newRound(){
		if(gameOn){
			charlyGameIsEnd = false;
			console.log("New Charly");
			rank = 3;
			var newPiece = Math.round(Math.random()*28);
			io.sockets.in("charly").emit("new round", newPiece);
			timer1 = setTimeout(function(){
				io.sockets.in("charly").emit("end of round");
				charlyRound++;
				if(charlyRound%10 == 0){
					charlyGameIsEnd = true;
					io.sockets.in("charly").emit("charly end game", charlyRound);
					timer2 = clearTimeout(timer2);
					timer2 = setTimeout(newRound,10000);
				}
			},10000);
			timer2 = setTimeout(newRound,13000);
		}
	}
 	socket.on("player won", function(){
 		players[socket.name].score+=rank;
    	io.sockets.in("charly").emit("player won", socket.name, rank, players);
 		if(rank>1)rank--;
    });
    socket.on("quit game", function(){
    	socket.leave("charly");
    	socket.leave("runAway");
    	if(players[socket.name])players[socket.name].inGame = false;
    	socket.broadcast.in("charly").emit("challenger left", players);
    	if(io.sockets.clients("charly").length==0){
    		gameOn = false;
    		timer1 = clearTimeout(timer1);
    		timer2 = clearTimeout(timer2);
    	}
    });

	//CREATION DE NOUVEAU JOUEUR
	socket.on("new player", function(player){
		//Chek in the db if player.name already exists
			// db.players.find({name:player.name},function(err, dbPlayers) {
				// if(dbPlayers.length != 0){
					// socket.emit("pseudo already exists");
				// }
				// else{
					// db.players.save(player, function(err, dbPlayer){
						// socket.dbId = dbPlayer._id;
					// });
					socket.name = player.name;
					players[player.name] = setPlayer(player);
					socket.emit("player created", player.name);
					io.sockets.emit("new player joined", players);
				// }
			// });
			
	});
	socket.on("get oldPlayer", function(player){
		// db.players.find({name:player.name}, function(err, dbPlayer){
			// if(dbPlayer.length>0){
				// socket.dbId = dbPlayer[0]._id;
				socket.name = player.name;
				players[player.name] = setPlayer(player);
				io.sockets.emit("new player joined", players);
				socket.emit("old game ok");
			// }
			// else{
				// socket.emit("error get old player");
			// }
		// });
	});
	function setPlayer(player){
		var newPlayer =  {
							"id" 		: socket.id,
							"status" 	: 0,
							"name"		: player.name,
							"sex"		: player.sex,
							"city"		: player.city,
							"class"		: player.class,
							"ping"		: 0,
							"picture"	: player.picture,
							"inGame"	: false,
							"score" 	: 0
						};
		return newPlayer;
	}
	

	socket.emit("get players", players);

	//--RUN AWAY--\\
	socket.on("ra join game", function(){
		if(Object.keys(raPlayers).length < 10){
			var newRaPlayer = {
				"name" 		: socket.name,
				"where"		: 150
			};
			raPlayers[socket.name] = newRaPlayer;
			socket.join("runAway");
			socket.emit("ra game joined", raPlayers);
			socket.broadcast.in("runAway").emit("ra new player", newRaPlayer);
		}
		else{
			socket.emit("ra game full");
		}
	});
	socket.on("space pressed", function(){
		raPlayers[socket.name].where--;
		socket.broadcast.in("runAway").emit("space pressed", socket.name);
	});
	socket.on("player won", function(room, player){
		socket.broadcast.in("runAway").emit("ra someone won", socket.name);
	});

});

runAwayInterval = setInterval(function(){
	console.log("New RunAway");
	for(key in raPlayers){
		raPlayers[key].where = 150;
	}
	raIntervalLeft = new Date().getTime();
	io.sockets.in("runAway").emit("ra game restarted", raPlayers);
},38000);

var port = process.env.PORT || 5000;
server.listen(port);