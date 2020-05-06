tfe.filter("onlinePlayers", function() {
    return function(input) {
        return Object.keys(input).length;
    };
});

tfe.filter("playerSex", function() {
    return function(input) {
        if(input == 1)
        	return "Homme";
        else
        	return "Femme";
    };
});

tfe.filter("hasAPictureFilter", function() {
    return function(input) {
    	if(input!=undefined){
    		if(input.picture == false || input.picture == "false"){
				//if male
	        	if(input.sex == 1)
	        		return "../../img/ui/malePix.jpg";
	        	//if female
	        	else
	        		return "../../img/ui/femalePix.jpg";
	        }
	        else{
	        	return input.picture;
	        }
    	}
        
    };
});

tfe.filter("pseudoLength", function() {
    return function(input) {
        if(input.length > 9){
            input = input.substring(0,7);
            input +=  "...";
        }
        return input;
    };
});