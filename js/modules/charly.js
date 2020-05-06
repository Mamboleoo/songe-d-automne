tfe.factory("charly", function(data, socket, $rootScope, sounds){
	var chrono;
	return {
		"sendMsg" : function(){
			if(this.chat.newMessage.msg != " " && this.chat.newMessage.msg != "" && this.chat.newMessage.msg != undefined){
				var time = new Date();
				var min = time.getMinutes();
				if(min<10){min = "0"+min;}
				time = time.getHours()+":"+min;
				this.chat.newMessage.time = time;
				this.chat.newMessage.player = this.data.player.name;
				socket.emit("send message", this.chat.newMessage);
				this.chat.newMessage = "";
			}
		},
		"joinTheGame" : function($scope){
			socket.on("join the game", function(players, charlyRound, charlyGameIsEnd){
				sounds("charlyBg");
				if(charlyGameIsEnd){$scope.rankOn = true;}
				data.players = players;
				console.log("Vous avez rejoint la partie");
				charlyRound = ((charlyRound-(charlyRound%10))/10);
				data.charlyCurrentRoom = charlyRound%2;
				$rootScope.$apply();
				$scope.$apply();
			});
		},
		"startGame" : function(){
			data.game = 1;
			socket.emit("start game");
			socket.on("new challenger", function(players){
				data.players = players;
				console.log("Un joueur a rejoint la partie");
				$rootScope.$apply();
			});
		},
		"quitGame" : function(){
			data.charlyShowRank = false;
			socket.emit("quit game");
		},
		"playerLeft" : function(){
			data.game = 0;
			socket.on("challenger left", function(players){
				data.players = players;
				console.log("Un joueur a quitté la partie");
				$rootScope.$apply();
			});
		},
		"newRound" : function($scope){
			socket.on("new round", function(newPiece){
				sounds("charlyCountDown");
				$scope.rankOn = false;
				$scope.timeLeft = 13;
				chrono = clearInterval(chrono);
				chrono = setInterval(function(){$scope.timeLeft--;$scope.$apply();},1000);
				data.charly.round = true;
				data.charly.hasWon = false;
				data.charlyShowRank = false;
				$scope.player.lost = false;
				$scope.player.ranking = 0;
				$scope.findPiece = newPiece;
				console.log("Nouveau round");
				$rootScope.$apply();
				$scope.$apply();
			});
		},
		"endOfRound" : function($scope){
			socket.on("end of round", function(players){
				if(data.charlyShowRank == false){
					$scope.player.lost = true;
				}
				data.charly.round = false;
				$scope.scoreChanged = "";
				$scope.findPiece = -1;
				console.log("Fin du round");
				$rootScope.$apply();
				$scope.$apply();
			});
		},
		"endGame" : function($scope){
			socket.on("charly end game", function(charlyRound){
				$scope.rankOn = true;
				data.charlyCurrentRoom = (charlyRound/10)%2;
				setTimeout(function(){
					for(key in data.players){
						if(data.players[key].inGame){data.players[key].score = 0;}
					}
				},10000);
				$scope.$apply();
				$rootScope.$apply();
			});
		},
		"clickRect" : function($scope){
			var rects =document.getElementById("verandaSquares").childNodes;
			var rectClicked = function(el){
				var clicked = el.getAttribute("nbr");
				if(clicked == $scope.findPiece){
					if(data.charly.hasWon){
						// alert("Vous avez déjà un point");
					}
					else{
						data.player.scores.charly.pieces++;
						localStorage.setItem("scoreRunAwayPieces", data.player.scores.charly.pieces);
						data.charly.hasWon = true;
						socket.emit("player won");
					}
				}
			}
			for (var i=rects.length-1;i>=0;i--){
				rects[i].addEventListener("click", function(){rectClicked(this);});
			};
			socket.on("player won", function(who, rank){
				$scope.scoreChanged = who;
				$scope.scorePlus 	= "+"+rank;
				var newMsg = {"msg": "a trouvé l'image", "time":"", "player":who}
				//Si ce n'est pas le même joueur
				if(who!=data.player.name){
					$scope.chat.messages.push(newMsg);
				}
				else{
					for(var i = 0;i<rank;i++){sounds("charlyWon",i*250);}
					$scope.player.ranking = rank;
					data.charlyShowRank = true;
				}
				data.players[who].score += rank;
				$rootScope.$apply();
				$scope.$apply();
			});
		}
	};

});
