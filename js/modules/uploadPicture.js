tfe.factory("uploadPicture", function(data, sounds){
	navigator.getUserMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
	var localMediaStream, video;
	webcamBroken = false;
	webcam = false;
	hasAPicture = false;
	data.webcamOn = true;
	data.noWebcam = false;
	var initWebcam = function(where){
		if(where!="P"){where="";}
		if(navigator.getUserMedia){
			webcam = true;
			navigator.mediaDevices.getUserMedia({ audio: false, video: true }).then(
		      function(stream){
		      	document.getElementById("canvasCam"+where).getContext("2d").clearRect(0,0,124,168);
		      	localMediaStream = stream;
	         	video = document.getElementById("webcam"+where);
	         	video.srcObject = stream;
	         	video.play();
	         	video.addEventListener("loadeddata", function(){
					video.style.left = -((video.scrollWidth-124)/2)+"px";
	         	});
	         	data.showPicture = true;
		      },
		      function(err) {
		         //Si l'utilisateur a refusé sa webcam
		        data.noWebcam = true;
		      }
		   );
		}
		else{
			//Si le navigateur ne sait pas laner la webcam
			data.noWebcam = true;
		}
	}

	return {
            "initWebcam": initWebcam,
            "savePicture": function(where){
            	if(where!="P"){where="";}
            	if(webcam == true && data.noWebcam == false){
					video = document.getElementById("webcam"+where);
					canvas = document.createElement("canvas");
					ctx = canvas.getContext("2d");
					largeur =  document.getElementById("webcam"+where).videoWidth;
					hauteur =  document.getElementById("webcam"+where).videoHeight;
					ratio = 168/hauteur;
					canvas.width = largeur;canvas.height = hauteur;
					ctx.scale(ratio, ratio);
					ctx.drawImage(video,0,0,largeur,hauteur);
					var imgData = ctx.getImageData(((largeur*ratio-124)/2),0,124,168);
					sounds('cameraSnap');
					setTimeout(function(){
						document.getElementById("canvasCam"+where).getContext("2d").putImageData(imgData,0,0,0,0,124,180);
						localMediaStream.getTracks().forEach(function(track) {
							track.stop();
						});
						webcam = false;
						data.hasAPicture = true;
					},530);
					return true;
				}
				else{
					data.hasAPicture = false;
					data.showPicture = false;
					initWebcam(where);
				}
            },
            "uploadPix": function(where){
            	if(where!="P"){where="";}
            	var file = document.getElementById("sendFile"+where).files[0];
				if(file!=undefined && file.type.match("image.*")){
				 	var ctx = document.getElementById("canvasCam"+where).getContext('2d');
					var img = new Image;
					img.onload = function() {
					    ctx.drawImage(img, 0,0,124,168);
					    data.hasAPicture = true;
					}
					img.src = URL.createObjectURL(file);
					webcam = false;
					data.showPicture = true;
					return true;
				}
				else{
					console.log("Ce type fichier n'est pas pris en charge");
					return false;
				}
            }
        }
});
