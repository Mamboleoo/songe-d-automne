var tfe = angular.module("tfe",["ngAnimate"]);

tfe.factory("socket", function(){
	var socket = io.connect("http://localhost:5000/");
	return socket;

});


//========== FACTORY ===========\\

tfe.factory("data", function(){
	data = {};
	data = {
			"player": {},
			"players" : [],
			"step": 0,
			"chat" : [],
			"charly": {},
			"game" : 0,
			"sound" : true,
			"charlyShowRank" : false,
			"charlyCurrentRoom" : 0
		};
		if(localStorage.getItem("new")){
			data.player.name = localStorage.getItem("playerName");
			data.player.city = localStorage.getItem("playerCity");
			data.player.sex = localStorage.getItem("playerSex");
			data.player.class = localStorage.getItem("playerClass");
			data.player.picture = localStorage.getItem("playerPicture");
			data.sound 			= localStorage.getItem("sound") == "true";
			data.player.scores = {
				"runAway" : {
					"death" : parseInt(localStorage.getItem("scoreRunAwayDeath")) || 0,
					"lifes": parseInt(localStorage.getItem("scoreRunAwayLifes")) || 0,
					"steps": parseInt(localStorage.getItem("scoreRunAwaySteps")) || 0
				},
				"charly" :{
					"pieces" : parseInt(localStorage.getItem("scoreRunAwayPieces")) || 0
				}
			}
		}
		else{
			localStorage.clear();
			data.player.name = null;
			localStorage.setItem("new", true);
		}


	return data;
});
