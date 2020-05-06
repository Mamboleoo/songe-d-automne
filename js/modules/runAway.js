tfe.factory("runAway", function(data, socket, sounds){
	var searchMeAplayer, timerSink;
	var youWin = function($scope){
		data.player.scores.runAway.lifes++;
		localStorage.setItem("scoreRunAwayLifes", data.player.scores.runAway.lifes);
		data.player.scores.runAway.steps = parseInt(data.player.scores.runAway.steps)+150;
		localStorage.setItem("scoreRunAwaySteps", data.player.scores.runAway.steps);
		$scope.playerWon[data.player.name] = true;
		$scope.$apply();
	}
	var youLost = function($scope){
		//If he didn't survived
		if(!$scope.playerWon[data.player.name]){
			sounds("drowning");
			data.player.scores.runAway.death++;
			localStorage.setItem("scoreRunAwayDeath", data.player.scores.runAway.death);
			data.player.scores.runAway.steps = parseInt(data.player.scores.runAway.steps);
			data.player.scores.runAway.steps += (150-$scope.playersOnline[data.player.name].where);
			localStorage.setItem("scoreRunAwaySteps", data.player.scores.runAway.steps);
		}
		else{sounds("survived");}
		$scope.gameState = 2;
		$scope.$apply();
	}
	return {
		"pressSpace" : function($scope){
			document.body.addEventListener("keyup", function(e){
				if(e.keyCode==32 && $scope.gameState == 1){
					$scope.playersOnline[data.player.name].where--;
					sounds("step");
					if($scope.playersOnline[data.player.name].where == 0){
						$scope.$apply();
						youWin($scope);
						socket.emit("player won",$scope.room, data.player.name);
						socket.emit("space pressed");
					}
					else{
						socket.emit("space pressed");
						$scope.$apply();
					}
				}
			});
			socket.on("space pressed", function(who){
				$scope.playersOnline[who].where--;
				$scope.$apply();
			});
		},
		"joinGame" : function(){
			socket.emit("ra join game");
		},
		"quitGame" : function(){
			timerSink = clearTimeout(timerSink);
		},
		"playerWon" : function($scope){
			socket.on("ra someone won", function(player){
				$scope.playerWon[player] = true;
			});
		},
		"gameJoined" : function($scope){
			socket.on("ra game joined", function(players){
				$scope.gameState = 0;
				$scope.overlayTrue = true;
				$scope.playersOnline = players;
				sounds("waiting");
				$scope.$apply();
				console.log("Vous avez rejoint la partie");
			});
			socket.on("ra new player", function(newPlayer){
				$scope.playersOnline[newPlayer.name] = newPlayer;
				$scope.$apply();
				console.log("Un nouveau joueur a rejoint la partie");
			});
			socket.on("ra game full", function(players){
				alert("la partie est complète");
			});
			socket.on("ra game restarted", function(players){
				sounds("waiting",0, true);
				counterDown();
				for(var key in $scope.playerWon){$scope.playerWon[key] = false;}
				$scope.overlayTrue = false;
				$scope.playersOnline = players;
				$scope.gameState = 0;
				sounds("countDown");
				$scope.$apply();
				function counterDown(){
					if($scope.counter>0){
						$scope.counterShow = true;
						$scope.counter--;
						$scope.$apply();
						if($scope.counter>-1){setTimeout(counterDown, 1000);}
					}
					else{
						if(data.step == 3.2){
							sounds("sinking");
							$scope.counterShow = false;
							$scope.counter = 4;
							$scope.gameState = 1;
							timerSink = setTimeout(function(){youLost($scope)},25000);
							$scope.$apply();
						}
					}
				}
			});
		}
	}
});