var broadcast = {};
broadcast.init = function(){
	
	console.log("broadcast");
	
	//GITHUB STAR
	if(localStorage.getItem("cyc-github-star") === null){
		//message not yet set
		localStorage.setItem("cyc-github-star", true);
		$("#broadcast").prepend("<iframe src='https://ghbtns.com/github-btn.html?user=mkaminsky11&repo=codeyourcloud&type=star&count=true' frameborder='0' scrolling='0' width='170px' height='20px'></iframe>");
		broadcast.show();
	}
	else{
		//github already shown...
		var val = localStorage.getItem("cyc-donate")
		if(val === null){
			localStorage.setItem("cyc-donate", 0)
		}
		else if(val === "0"){
			$("#broadcast #donate").css("display","block");
			broadcast.show();
			localStorage.setItem("cyc-donate", 15); //countdown!
		}
		else{
			localStorage.setItem("cyc-donate", val - 1);
			if(Math.floor(Math.random() * 10) === 5){
				//$("#broadcast #ad").css("display","block");
			}
		}
	}	
};

broadcast.show = function(){
	$("#broadcast").css("opacity",0).css("display","block");
	$("#broadcast").velocity("transition.fadeIn");	
};

broadcast.ad_ok = function(){
	connection.send(JSON.stringify({type:"survey",vote:"yes"}));
}
broadcast.ad_no = function(){
	connection.send(JSON.stringify({type:"survey",vote:"no"}));
}
