var broadcast = {};
broadcast.init = function(){
	//github already shown...
	var val = localStorage.getItem("cyc-donate")
	if(val === null){
		localStorage.setItem("cyc-donate", 0)
	}
	else if(val === "0"){
		$("#broadcast #donate").css("display","flex");
		broadcast.show();
		localStorage.setItem("cyc-donate", 8); //countdown!
	}
	else{
		localStorage.setItem("cyc-donate", val - 1);
		if(Math.floor(Math.random() * 10) === 5){
			//$("#broadcast #ad").css("display","block");
		}
	}	
};

broadcast.show = function(){
	$("#broadcast").css("opacity",0).css("display","block");
	window.setTimeout(function(){
		$("#broadcast").velocity("transition.bounceUpIn");
	}, 500);
};

broadcast.ad_ok = function(){
	connection.send(JSON.stringify({type:"survey",vote:"yes"}));
}
broadcast.ad_no = function(){
	connection.send(JSON.stringify({type:"survey",vote:"no"}));
}