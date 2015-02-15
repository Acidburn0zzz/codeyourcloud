var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("%cThe websocket has opened", "color:#27AE60; font-size: 12px");
    websocketInit();
};
function websocketInit(){
	sql_loaded = true;
	if(user_loaded){
		get_sql();
	}
}
connection.onmessage = function (message) {
	try {
		var json = JSON.parse(message.data);
		console.log(json);

		if(json.type === "translate"){
			var code_before = json.code;
			var find = "console.log";
			var re = new RegExp(find, 'g');

			var code_after = code_before.replace(re, 'repl.print');
			repl.eval(code_after);
		}

		if(json.type === "get"){
		
			rec = true;
			
			login_sql = json.last_login;
			
			proccess_time();
			
			
			$(".CodeMirror").css("fontSize", json.font_size+"px");
			$("#spinner-font").val(json.font_size);
			sql_font = json.font_size;
			
			line_wrap = to_bool(json.wrap);
			for(var i = 0; i < editors.length; i++){
				editors[i].editor.setOption("lineWrapping",line_wrap);
			}
			
			
			try{
				//if(line_wrap === true && !$('#side-wrap').prop('checked')){
				//	document.getElementById("side-wrap").toggle();
				//}
				
				//line_number = to_bool(json.nums);
				
				//for(var i = 0; i < editors.length; i++){
				///	editors[i].editor.setOption("lineNumbers",line_number);
				//}
				
				
				//if(line_number === false && $('#side-nums').prop('checked')){
				//	document.getElementById("side-nums").toggle();
				//}
			}
			catch(e){
			}
			
		}
		if(json.type === "new"){
			set_sql();	
			showTut();
			
		}
		if(json.type === "pub"){
			console.log("%cHtml published","color:#27AE60; font-size: 12px");
			 swal("Success", "HTML published!", "success")
		}
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
/********
SQL
**********/

function set_sql(){
	/*if(rec){
		//get the data
		//send it
		var ret = {};
		ret.id = userId;
		ret.theme = theme_sql;
		ret.font_size = sql_font;
		ret.wrap = to_int(line_wrap);
		ret.nums = to_int(line_number);
		ret.auto_comp = to_int(autoC);
		ret.auto_save = to_int(auto_save);
		ret.auto_time = auto_save_int;
		ret.type = "set";
		connection.send(JSON.stringify(ret));
	}*/
}
function get_sql(){
	connection.send(JSON.stringify({type:"get", id:userId}));
}
function publish_html(){
	var p = editor().getValue();
	if(editor().getOption("mode") === "text/x-markdown" || editor().getOption("mode") === "gfm"){
		p = converter.makeHtml(p);
	}
	connection.send(JSON.stringify({type:"publish", id:userId, lines:p.split("\n")}));
}

function proccess_time(){
}
/*********
LEAVE THESE ALONE FOR NOW
**********/
connection.onerror = function (error) {
	//console.log(error);
};
