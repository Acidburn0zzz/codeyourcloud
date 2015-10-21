/*===
* CODEYOURCLOUD
===*/

var editors = []; //the codemirror editors
var current_file = "";

var converter = new Markdown.Converter();

//[name, codemirror code, file extensions seperated by | ]
var modes = CodeMirror.modeInfo;
for(var i = 0; i < modes.length; i++){
	var _mode_name = modes[i].mode;
	if(_mode_name !== "null"){
		var url = "https://codeyourcloud.com/lib/codemirror/mode/" + _mode_name + "/" + _mode_name + ".js";
	    jQuery.ajax({
	        url: url,
	        dataType: 'script',
	        success: function(){},
	        async: true
		});
	}
}

var themes = [
	"3024-day.css",
	"ambiance-mobile.css",
	"blackboard.css",
	"dracula.css",
	"eclipse.css",
	"lesser-dark.css",
	"material.css",
	"mdn-like.css",
	"neat.css",
	"paraiso-dark.css",
	"rubyblue.css",
	"tomorrow-night-bright.css",
	"twilight.css",
	"xq-light.css",
	"3024-night.css",
	"base16-dark.css",
	"cobalt.css",
	"elegant.css",
	"liquibyte.css",
	"midnight.css",
	"neo.css",
	"paraiso-light.css",
	"seti.css",
	"solarized.css",
	"tomorrow-night-eighties.css",
	"vibrant-ink.css",
	"zenburn.css",
	"ambiance.css",
	"base16-light.css",
	"colorforth.css",
	"erlang-dark.css",
	"mbo.css",
	"monokai.css",
	"night.css",
	"pastel-on-dark.css",
	"the-matrix.css",
	"ttcn.css",
	"yeti.css",
	"xq-dark.css"
];
for(var i = 0; i < themes.length; i++){
	themes[i] = themes[i].replace(".css","");
	$('<link rel="stylesheet" type="text/css" async href="https://codeyourcloud.com/lib/codemirror/theme/'+themes[i]+'.css" >').appendTo("head");
}

var themes_name = themes;
var is_mobile = false;
var real_mobile = false;
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 	is_mobile = true;
 	real_mobile = true;
}
if(window.location.href.indexOf("?mobile=true") !== -1){
	is_mobile = true;
	//spoofing to test mobile
}


var editor_theme = "seti";
var auto_save = true;
var auto_save_int = 30000;	
var sql_font = 12;
var autoC = false;
var side_open = false;
var developerKey = 'AIzaSyBTSFIgQkLly9v6Xuqc2Nqm-vX0jpyEbZk';


var cloud_use = null; //sky|drive

/*=======
MESSENGER
========*/
Messenger.options = {
    extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
    theme: 'air',
    hideAfter: 10
};

function infoFromUrl() {
  if (window.location.hash) {
    var authResponse = window.location.hash.substring(1);
    var authInfo = JSON.parse(
      '{"' + authResponse.replace(/&/g, '","').replace(/=/g, '":"') + '"}',
      function(key, value) { return key === "" ? value : decodeURIComponent(value); });
    return authInfo;
  }
  else {
  }
}