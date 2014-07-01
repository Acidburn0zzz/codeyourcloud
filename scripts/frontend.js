var connection = new WebSocket('wss://codeyourcloud.com:8080');
connection.onopen = function () {
	console.log("%cThe webocket has opened", "color:#27AE60; font-size: 12px");
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
		if(json.type === "get"){

			rec = true;
			
			login_sql = json.last_login;
			
			proccess_time();
			
			
			theme_sql = json.theme.split("_").join("-");
			if(themes_name.indexOf(theme_sql) !== -1){
				setTheme(theme_sql);
			}
			else{
				theme_sql = "code-your-cloud";
				set_sql();
			}
			//FONT_SIZE *done
			$(".CodeMirror").css("fontSize", json.font_size+"px");
			$("#spinner-font").val(json.font_size);
			sql_font = json.font_size;
			
			line_wrap = to_bool(json.wrap);
			editor.setOption("lineWrapping",line_wrap);
			
			var s_t = "on";
			if(line_wrap === false){
				s_t = "off";
			}
			set_switch_state("#side-wrap_switch",s_t);
			
			line_number = to_bool(json.nums);
			editor.setOption("lineNumbers",line_number);
			
			s_t = "on";
			
			if(line_number === false){
				s_t = "off";
			}
			
			set_switch_state("#side-nums_switch",s_t);
		}
		if(json.type === "new"){
			set_sql();	
		}
		if(json.type === "pub"){
			console.log("%cHtml published","color:#27AE60; font-size: 12px");
		}
	} catch (e) {
		console.log("%cThere was an error!", "color:#E74C3C; font-size: 12px");
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
	if(rec){
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
	}
}
function get_sql(){
	connection.send(JSON.stringify({type:"get", id:userId}));
}
function publish_html(){
	var p = editor.getValue();
	if(editor.getOption("mode") === "text/x-markdown" || editor.getOption("mode") === "gfm"){
		p = converter.makeHtml(p);
	}
	connection.send(JSON.stringify({type:"publish", id:userId, lines:p.split("\n")}));
}

function proccess_time(){
	var t = login_sql;
	
	if(t >= 5260){
		//days when this was started
		var r = Math.floor(0 + Math.random() * 100)
		//5% of the time
		if(r >= 0 && r <= 5){
			//go!
			var a = "How about a <a href='https://codeyourcloud.com/survey' target='_blank'>survey</a>?";
			sendMessage(a,"info");
		}
	}
}
/*********
LEAVE THESE ALONE FOR NOW
**********/
connection.onerror = function (error) {
};