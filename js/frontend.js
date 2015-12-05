var connect = {
	snippets: {}
};
connect.init = function(){
	if(getParameterByName("beta") !== ""){
		//not beta things
		 $(".beta").css("display","block");
		 $("#users").css("display","none");
	}	
};
connect.snippets.getSnippets = function(callback){
	$.ajax("https://codeyourcloud.com/snippets",{
		method: "GET",
		success: function(data, textStatus, jqXHR){
			callback(data.snippets);
		},
		error: function(jqXHR, textStatus, errorThrown){
			throw errorThrown;
		}
	});
};
connect.snippets.addSnippets = function(info, callback){
	$.ajax("https://codeyourcloud.com/snippets/add",{
		method: "POST",
		data: info,
		success: function(data, textStatus, jqXHR){
			callback(data);
		},
		error: function(jqXHR, textStatus, errorThrown){
			throw errorThrown;
		}
	});
};
connect.snippets.removeSnippet = function(id, callback){
	$.ajax("https://codeyourcloud.com/snippets/remove",{
		method: "POST",
		data: {
			id: id	
		},
		success: function(data, textStatus, jqXHR){
			callback(data);
		},
		error: function(jqXHR, textStatus, errorThrown){
			throw errorThrown;
		}
	});
};
connect.snippets.changeSnippet = function(id, info, callback){
	info.id = id;
	$.ajax("https://codeyourcloud.com/snippets/change",{
		method: "POST",
		data: info,
		success: function(data, textStatus, jqXHR){
			callback(data);
		},
		error: function(jqXHR, textStatus, errorThrown){
			throw errorThrown;
		}
	});
};




var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("%cThe websocket has opened", "color:#27AE60; font-size: 12px");
    websocketInit();
};
function websocketInit(){
}
connection.onmessage = function (message) {
	try {
		var json = JSON.parse(message.data);
		console.log(json);
		
		if(json.type === "pub"){
			 Messenger().post({
			  message: 'Successfully published',
			  type: 'success',
			  showCloseButton: true
			});
		}
		else if(json.type === "error"){
			Messenger().post({
			  message: 'An error occured',
			  type: 'error',
			  showCloseButton: true
			});
		};
	} catch (e) {
		console.log(e);
	}
};

function to_bool(int_val){
	if(int_val === 1){
		return true;
	}
	else{
		return false;
	}
}
function to_int(bool_val){
	if(bool_val){
		return 1;
	}
	else{
		return 0;
	}
}
function publish_html(){
	var p = editor().getValue();
	if(editor().getOption("mode") === "text/x-markdown" || editor().getOption("mode") === "gfm"){
		p = converter.makeHtml(p);
	}
	
	if(cloud_use === "drive"){
		connection.send(JSON.stringify({type:"publish",mode: editor().getOption("mode"), id:drive.id, fileId: current_file, lines:p.split("\n")}));
	}
	else if(cloud_use === "sky"){
		connection.send(JSON.stringify({type:"publish",mode: editor().getOption("mode"), id:sky.id, fileId: current_file, lines:p.split("\n")}));
	}
}
/*********
LEAVE THESE ALONE FOR NOW
**********/
connection.onerror = function (error) {
	//console.log(error);
};
