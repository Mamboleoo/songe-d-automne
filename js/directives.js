tfe.directive("bodyDirective", function(sounds){
    return {
        restrict: "AE",
        link : function($scope){
			backgroundSize = function(){
				var ww 		= window.innerWidth,
				wh 			= window.innerHeight,
				minHeight 	= 900,
				minWidth 	= 1280,
				bookWidth 	= 2163,
				bookHeight 	= 1461;

				var ww2 = ww;
				ww2 -= 1280;
				ww2 /= 2;
				var game = document.getElementsByClassName("game")[0];
				game.style.left = ww2+"px"

				//detect if height is not too small
				if(ww/wh < 1.47912){
					document.body.style.backgroundSize = bookWidth/(minWidth/ww)+"px auto";
					game.style.webkitTransform = " scale("+ww/1280+")";
					game.style.transform = " scale("+ww/1280+")";
					var wh2 = wh;
					wh2 = wh2-(ww/1280*900);
					wh2 = wh2/2;
					game.style.top = wh2+"px";
				}
				else{
					document.body.style.backgroundSize = "auto "+bookHeight/(minHeight/wh)+"px";
					game.style.webkitTransform = " scale("+wh/900+")";
					game.style.transform =  " scale("+wh/900+")";
					var wh2 = wh;
					wh2 = (wh/900*900)-wh2;
					wh2 = wh2/2;
					game.style.top = -wh2+"px";
				}	
			};
            backgroundSize();
            window.addEventListener("resize", backgroundSize);

        	//ParallaxTicket
			window.requestAnimFrame = (function(){
				return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame    		||
				function( callback ){
					window.setTimeout(callback, 1000 / 50);
				};
			})();
			var x, y, rotate = 0, ww, xx;
			$scope.mousePosition = function(e){
				x = e.clientX;
				y = e.clientY;
				ww = window.innerWidth;
			}
			$scope.parallaxTicket = function(){
				if(data.step == 1){
					xx = -(x-ww/2)/75;
					rotate = rotate+((xx-rotate)*.08);
					document.getElementsByClassName("boardingPass")[0].style.webkitTransform = "rotateY("+rotate+"deg) rotateX(5deg)";
					document.getElementsByClassName("boardingPass")[0].style.transform = "rotateY("+rotate+"deg) rotateX(5deg)";
				}
			}
			function animloop(){
				  requestAnimFrame(animloop);
				  $scope.parallaxTicket();
			};
			//TURN THIS ON FOR THE PARALLAX EFFECT
			animloop();

			$scope.$watch("data.step", function(newVal, oldVal) {
				if(newVal != oldVal){
					switch(newVal){
						case 1:
							setTimeout(function(){
								sounds("foldPaper");
								$scope.openTicket = true;
								$scope.$apply();
							},1200);
						break;
						case 2:
							if(oldVal!=4 && oldVal!=5 && oldVal != 3 && oldVal!=6){
								sounds("homeMusic");
							}
						break;
						case 3.1:
						case 3.2:
							sounds("homeMusic", 0, true);
						break;
					}
				}
			});
			if(data.player.name == null){
			 	var speech = new SpeechSynthesisUtterance("test");
			}
			else{
			 	var speech = new SpeechSynthesisUtterance("test");
			}
				speech.lang = 'fr-FR';
			    var keys = [],
			        konami = "38,38,40,40,37,39,37,39,66,65";
			    window.addEventListener("keydown", function(e){
			        keys.push(e.keyCode);
			        if (keys.toString().indexOf(konami) >= 0) {
		 				time = {
		 					day :  new Date().getDay(),
		 					month : new Date().getMonth(),
		 					year : 2014,
		 					hour : new Date().getHours(),
		 					min : new Date().getMinutes()
		 				}
		 				if(data.player.name==null){
		 					speech.text = " Il est "+newDate+" et un inconnu a réussi à taper le Konami code sans se tromper. Maintenant tu t'inscris et tu joues à mon jeu...";
		 				}
		 				else if(data.player.class == 3){
		 					if(data.player.sex == 1)speech.text = "Le "+time.day+" juin 2014, un pouilleux de troisième classe dénommé"+data.player.name+" a réussi à taper le Konami code.";
		 					else speech.text = "Le "+time.day+" juin 2014, une pouilleuse de troisième classe dénommée"+data.player.name+" a réussi à taper le Konami code.";
		 				}
		 				else if(data.player.class == 2){
		 					if(data.player.sex == 1) speech.text = "Bien que tu aies réussi à taper le Konami code, ne fais pas trop le malin, je te rappelle que tu n'es qu'en 2ème classe.";
		 					else speech.text = "Bien que tu aies réussi à taper le Konami code, ne fais pas trop la maligne, je te rappelle que tu n'es qu'une fausse riche de 2ème classe.";
		 				}
		 				else if(data.player.class == 1){
		 					speech.text = "Un sale con de riche de première classe a taper le Konami code le "+time.day+" juin 2014, cela mérite d'être écrit dans le registre du bateau";
		 				}
		 				if(new Date().getHours()>=23){
		 					speech.text = "Tu n'es pas très gentil avec moi, je dormais et tu me réveilles. Tout ça pour un bête Konami Code.";
		 				}
						speechSynthesis.speak(speech);
			            keys = [];
			        };
			    }, true);


        }
    }
});

tfe.directive("pourquoi", function(){
	 return {
	 	restrict: "AE",
        link : function($scope, el, attr){
        	el[0].addEventListener("scroll", function(){
        		if(el[0].scrollTop == 0){
					el[0].classList.remove("scrollTop");
					el[0].classList.add("scrollBottom");
					el[0].classList.remove("scrollMiddle");
        		}
        		else if(el[0].scrollTop == el[0].scrollHeight-el[0].offsetHeight){
					el[0].classList.remove("scrollBottom");
					el[0].classList.add("scrollTop");
					el[0].classList.remove("scrollMiddle");
        		}
        		else{
        			el[0].classList.add("scrollMiddle");
        		}
        	}, false);
        }
    }
});