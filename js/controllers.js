//GAME
tfe.controller("game", function ($scope, socket, data, socketFct, charly, runAway, sounds){
	$scope.data = data;
	$scope.openTicket = false;
	$scope.socketFct = socketFct;
	$scope.newPlayer = {"sex":1,"class":1};
	$scope.charly = charly;
	$scope.runAway = runAway;
	$scope.sounds = sounds;

	socketFct.getPlayers();
	socketFct.pseudoTaken();
	socketFct.createPlayer($scope);
	socketFct.playerJoin($scope);
	socketFct.playerLeft($scope);
	socketFct.playerChanged($scope);
	$scope.getOldplayer = socketFct.getOldplayer;
	
	$scope.$watch("data.sound", function(newVal, oldVal) {
		if(newVal != oldVal){localStorage.setItem("sound", newVal);}
	});

	$scope.quitCharly = function(){
		charly.quitGame();
	}

});


//BOARDING PASS
tfe.controller("boardingPass", function ($scope, socket, data, uploadPicture, socketFct){
	$scope.uploadPicture = uploadPicture;
	$scope.data = data;
	$scope.hasAPicture = false;
	$scope.newPlayer.picture = false;
	$scope.newPlayer = $scope.$parent.newPlayer;

	$scope.initCam = uploadPicture.initWebcam;
	$scope.savePicture = uploadPicture.savePicture;
	$scope.uploadPix = uploadPicture.uploadPix;
	$scope.picture = "";
	data.ticketLoading = false;

	$scope.sendBoardingPass = function(){
		if($scope.newPlayer.name != "" && $scope.newPlayer.name != undefined){
			if(data.hasAPicture){$scope.newPlayer.picture = document.getElementById("canvasCam").toDataURL("image/jpeg",.5);}
			socketFct.sendNewPlayer($scope.newPlayer);
			data.ticketLoading = true;
		}
		else{$scope.namePlaceHolder = "Veuillez insérer votre nom";}
	};

});

tfe.controller("profile", function ($scope, socket, data, saveNewInfos, uploadPicture){
	$scope.data = data;
	$scope.saveNewInfos = saveNewInfos;
	$scope.uploadPicture = uploadPicture;
	$scope.initCam = uploadPicture.initWebcam;
	$scope.savePicture = uploadPicture.savePicture;
	$scope.uploadPix = uploadPicture.uploadPix;
	$scope.switchCanvas = false;

	$scope.saveNewInfosfct = function(){
		saveNewInfos.saveNewInfos(data.players[data.player.name], $scope);
		$scope.infosHaveChanged = false;
	}

	$scope.clickCanvas = function(){
		$scope.snapLens = true;
		$scope.infosHaveChanged=true;
		$scope.pictureChanged=true;
		$scope.savePicture('P');
	};
	
});

tfe.controller("settings", function ($scope, socketFct){
	$scope.data = data;
	$scope.socketFct = socketFct;
	setInterval(socketFct.getMyPing,5000);
	
});

tfe.controller("gameSelect", function ($scope, charly, runAway){
	$scope.charly = charly;
	$scope.runAway = runAway;
	$scope.startGame = function(){
		charly.startGame($scope);
	}
});

tfe.controller("runAwayCtrl", function ($scope, data, runAway){
	$scope.data = data;
	$scope.runAway = runAway;
	$scope.gameState = 0;


	$scope.counter = 4;
	$scope.counterShow = false;
	$scope.playersOnline = {};
	$scope.overlayTrue = false;

	runAway.pressSpace($scope);
	runAway.gameJoined($scope);
	runAway.playerWon($scope);
	$scope.playerWon = {};
	$scope.pawnsBackground = function(i){return -i*50+"px 0px";};

});


//GAME CHARLY
tfe.controller("charlyCtrl", function ($scope, socket, data, charly){
	$scope.data = data;
	$scope.charly = charly;
	$scope.rankOn = false;
	$scope.rooms = ["smokeRoom", "veranda"];

	//CHAT
	$scope.sendMsg = charly.sendMsg;
	$scope.chat = {
			"messages" : [],
			"newMessage" : {"player":"","time":"","msg":""}
	}
	socket.on("new message", function(msg){
		$scope.chat.messages.push(msg);
		$scope.$apply();
		document.getElementById("chatMsg").scrollTop = document.getElementById("chatMsg").scrollHeight-75;
	});

	//GAME
	$scope.status = 0;
	$scope.findPiece = -1;
	charly.playerLeft();
	charly.newRound($scope);
	charly.endOfRound($scope);
	charly.endGame($scope);
	charly.joinTheGame($scope);
	$scope.svgLoaded = function(){charly.clickRect($scope);}
	$scope.itemsToArray = function(items){
		var array = [];
		angular.forEach(items, function(item){
			if(item.inGame){array.push(item);}
		});
		return array;
	};
	$scope.player ={"ranking":0};
	$scope.timeLeft= 0;


});
