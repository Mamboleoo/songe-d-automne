tfe.factory("saveNewInfos", function(data, socket){

	return {
		"saveNewInfos" : function(player, $scope){
			if($scope.pictureChanged == true){
				player.picture = document.getElementById("canvasCamP").toDataURL("image/jpeg",.5);
				localStorage.setItem("playerPicture", player.picture);
			}
			//s'il a changé son nom
			if(data.player.name != player.name){
				data.players[player.name] = player;
				delete data.players[data.player.name];
				data.player.name = player.name;
				socket.emit("informations changed", player, false);
			}
			else{
				data.players[player.name] = player;
				socket.emit("informations changed", player, true);
			}
			data.player.city = player.city;
			data.player.sex = player.sex;
			data.player.class = player.class;
			data.player.picture = player.picture;
			$scope.pictureChanged = false;
			localStorage.setItem("playerName", player.name);
			localStorage.setItem("playerCity", player.city);
			localStorage.setItem("playerSex", player.sex);
			localStorage.setItem("playerClass", player.class);
		}
	};

});
