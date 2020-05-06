tfe.factory("socketFct", function($rootScope, data, socket){

	return {
		"getMyPing" : function(){
			var firstTime = Date.now();
			socket.emit("ping");
			socket.on("server ping", function() {
				ping = Date.now() - firstTime;
				data.player.ping = ping;
				$rootScope.$apply();
			});
		},
		"getPlayers" : function(){
			socket.on("get players", function(players){
				data.players = players;
				console.log("Joueurs connectés bien reçus");
				$rootScope.$apply();
			});
		},
		"getOldplayer" : function(){
			data.ticketLoading = true;
			var newPlayer = {};
			newPlayer.name 		= localStorage.getItem("playerName");
			newPlayer.city 		= localStorage.getItem("playerCity");
			newPlayer.sex 		= localStorage.getItem("playerSex");
			newPlayer.class 	= localStorage.getItem("playerClass");
			newPlayer.picture 	= localStorage.getItem("playerPicture");
			socket.emit("get oldPlayer", newPlayer);
			socket.on("error get old player", function(){
				alert("Nous n'avons pas pu retrouver votre ancienne partie. Merci de vous réinscrire");
				data.step = 1;
				$rootScope.$apply();
			});
			socket.on("old game ok", function(){
				data.step = 2;
				$rootScope.$apply();
			})
		},
		"sendNewPlayer" : function(newPlayer){
			socket.emit("new player", newPlayer);
			console.log("Requête de nouveau joueur envoyée au serveur");
		},
		"pseudoTaken" : function(){
			socket.on("pseudo already exists", function(){
				data.ticketLoading = false;
				alert("Ce nom a déjà été pris");
			});
		},
		"createPlayer": function($scope){
			socket.on("player created", function(name){
				localStorage.setItem("playerName", $scope.newPlayer.name);
				localStorage.setItem("playerCity", $scope.newPlayer.city);
				localStorage.setItem("playerSex", $scope.newPlayer.sex);
				localStorage.setItem("playerClass", $scope.newPlayer.class);
				localStorage.setItem("playerPicture", $scope.newPlayer.picture);
				data.player.name = $scope.newPlayer.name;
				data.player.city = $scope.newPlayer.city;
				data.player.sex = $scope.newPlayer.sex;
				data.player.class = $scope.newPlayer.class;
				data.player.picture = $scope.newPlayer.picture;
				data.sound 			=  true;
				data.player.scores = {
					"runAway" : {
						"death" :0,
						"lifes": 0,
						"steps": 0
					},
					"charly" :{
						"pieces" : 0
					}
				}
				//on ferme le livre
				$scope.openTicket = false;
				setTimeout(function(){
					data.step = 2;
					$scope.$apply();
				},1500);
				$scope.$apply();
				console.log("Le joueur a bien été crée");
			});
		},
		"playerJoin" : function($scope){
			socket.on("new player joined", function(players){
				data.players = players;
				$scope.$apply();
				console.log("Un joueur a rejoint le jeu");
			});
		},
		"playerLeft" : function($scope){
			socket.on("new player left", function(players){
				data.players = players;
				$scope.$apply();
				console.log("Un joueur a quitté le jeu");
			});
		},
		"playerChanged": function($scope){
			socket.on("player changed infos", function(players){
				data.players = players;
				$scope.$apply();
				console.log("Un joueur a changé ses infos");
			});
		}
	};

});
