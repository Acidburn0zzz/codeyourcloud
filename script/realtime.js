//the codemirror editor
var e = CodeMirror(document.getElementById("welcome"),{
    lineNumbers: true,
    mode: "text",
    theme: "code-your-cloud",
    lineWrapping: true, 
    indentUnit: 4, 
    indentWithTabs: true
});

var txtFile = new XMLHttpRequest();
txtFile.open("GET", "https://codeyourcloud.com/intro.txt", true);
txtFile.onreadystatechange = function()
{
	if (txtFile.readyState === 4) {  // document is ready to parse.
		if (txtFile.status === 200) {  // file is found
			var allText = txtFile.responseText; 
			e.setValue(allText);
		}
	}
}
txtFile.send(null);

add_editor(e, "welcome", true);

current_file = "welcome";

editor().on("beforeSelectionChange", function(cm, selection){
	set_color(editor().getSelection());	
});
editor().setOption("autoCloseBrackets",true);
editor().setOption("matchBrackets",true);
$(".CodeMirror").css("line-height","1");











/*===========
AUTHORIZATION
=============*/
function loadDrive(){
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},handleAuth);
}
//handles result
function handleAuth(authResult){
	if (!authResult.error) {
		logged_in = true;
		loadClient();
	} 
	else {
		window.location = "https://codeyourcloud.com/about";
	}
}

function loadClient() {
	gapi.client.load('drive', 'v2', load_drive);
}

function load_drive(){
	setInterval(function(){
		refreshToken();
	},3000000);
	get_info();
	
	//https://codeyourcloud.com/?state=%7B%22ids%22:%5B%220ByWSHHBN-zyoTl9rQWZyOU5HV2s%22%5D,%22exportIds%22:%5B%220ByWSHHBN-zyoTl9rQWZyOU5HV2s%22%5D,%22action%22:%22open%22,%22userId%22:%22113256493817901278064%22%7D
	
	var url = window.location.href;
	
	var query = window.location.href.split("?")[1];
	
	if(url.indexOf("%22action%22:%22open") !== -1){
		//need to open
		var query_id = query.split("%22")[3];
		
		addTab("loading...",query_id,false);
		
	}
	else if(url.indexOf("%22action%22:%22create%22") !== -1){
		var query_folder_id = query.split("%22")[3];
		
		insertNewFile(query_folder_id);
	}
}
function refreshToken() {
	gapi.auth.authorize({'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate':true},function(result){
		
	});
}

function get_info(){
    var request = gapi.client.drive.about.get();
    request.execute(function(resp) {
        myRootFolderId = resp.rootFolderId;
        
        try{
        	myEmail = resp.user.emailAddress;
        	$("#side-email").html(myEmail);
        }
        catch(e){
        	window.location = "https://codeyourcloud.com/about";
        }
        
        userName = resp.name;
        try{
            userUrl = resp.user.picture.url;
        }
        catch(e){}
        try{
            userId = resp.user.permissionId;
            $("#side-pub-link").attr("href", "https://codeyourcloud.com/pub/"+userId+"/index.html");
            user_loaded = true;
            if(sql_loaded){
	            get_sql();
            }
            
        }
        catch(e){}
        total_q = resp.quotaBytesTotal;
        user_q = resp.quotaBytesUsedAggregate;
        product_q = Math.round(user_q/total_q * 100);
        
        user_loaded = true;
        if(sql_loaded){
        	get_sql();
        }
    });
}
/*============
USERS
=============*/
function insertUser(name, color, photo, id, fileid){
	var new_user = "<img class=\"user-photo\" id=\"img_" + id + "\" src=\""+ photo +"\" height=\"53px\" width=\"53px\" style=\"border:solid 4px "+ color +";display:none\">";
	
	
	$(".users-container[data-fileid='"+fileid+"']").html( $(".users-container[data-fileid='"+fileid+"']").html() + new_user);
	
	
	$("#img_" + id).slideDown("slow",function(){
		$("#img_" + id).css("height","53px");
	});
}
function removeUser(id, fileid){
	try{
		$(".users-container[data-fileid='"+fileid+"']").find("#img_" + id).slideUp("slow",function(){
			$(".users-container[data-fileid='"+fileid+"']").find("#img_" + id).remove();
		});
	}
	catch(e){
	}
}


/*===============
SAVING
================*/
function save(){
	if(current_file !== "welcome"){
		sendData({
			type: "save"
		}, current_file);
	}
}


function saveAs(){
	close_side();
	showSaveAsPicker();
}