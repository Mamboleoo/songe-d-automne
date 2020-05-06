tfe.factory("sounds", function(data){
	var songs = {
		"homeMusic" : new Audio("sounds/homeMusic.ogg")
	};
	var time = 1000;
	function fadeOut(sound){
		time = time-100;
		songs[sound].volume = time/1000;
		if(time!=0){setTimeout(function(){fadeOut(sound)}, 100);}
		else{time = 1000;songs[sound].pause();}
	}
	return function(sound, delay, stop){
		//Si stop, arrêter une musique
		if(stop){
			if(sound=="all"){
				for(key in songs){
					if(key!="homeMusic"){
						songs[key].currentTime = 0;
						songs[key].pause();
					}
				}
			}
			else if(songs[sound])fadeOut(sound);
		}
		if(data.sound){
			delay = delay || 0;
			setTimeout(function(){
				if(stop!=true){
					if(sound == "homeMusic"){
						for(var key in songs){if(key!="homeMusic")fadeOut(key);}
						songs.homeMusic.volume = 1;
						songs.homeMusic.currentTime = 0;
						songs.homeMusic.play();
						songs.homeMusic.addEventListener("ended", function(){songs[sound].currentTime = 0;songs.homeMusic.play();});
					}
					else{
						songs[sound] = new Audio("sounds/"+sound+".ogg");
						songs[sound].play();
					}
					if(sound == "cameraSnap"){
						document.getElementById("canvasCam").style.background = "url(img/ui/snapLens.gif?"+Math.random()+")";
						document.getElementById("canvasCamP").style.background = "url(img/ui/snapLens.gif?"+Math.random()+")";
					}
				}
			}, delay);
		}
	};

});