function poly_loaded(){
    
}

window.addEventListener('polymer-ready', function(e){
	//the actual event
	
	checkGithub(); //declared in broadcast.js
	
	poly_loaded();

	//sets options
	line_wrap = editor().getOption("lineWrapping");
	line_number = editor().getOption("lineNumbers");
	if(line_wrap !== $('#side-wrap').prop('checked')){
		document.getElementById("side-wrap").toggle();
	}
	
	if(line_number !== $('#side-nums').prop('checked')){
		document.getElementById("side-nums").toggle();
	}

	editor().refresh();
	
	CoreStyle.g.paperInput.focusedColor = "#95A5A6";
});

window.addEventListener("DOMContentLoaded", function () {
    var geval = eval;

    repl = new CodeMirrorREPL("repl", {
        mode: "javascript",
        theme: "eclipse"
    });

    repl.print("/* JavaScript REPL*/");

    window.print = function (message) {
        repl.print(message, "message");
    };

	repl.refresh = function(){mirror.refresh()}

    repl.isBalanced = function (code) {
        var length = code.length;
        var delimiter = '';
        var brackets = [];
        var matching = {
            ')': '(',
            ']': '[',
            '}': '{'
        };

        for (var i = 0; i < length; i++) {
            var char = code.charAt(i);

            switch (delimiter) {
            case "'":
            case '"':
            case '/':
                switch (char) {
                case delimiter:
                    delimiter = "";
                    break;
                case "\\":
                    i++;
                }

                break;
            case "//":
                if (char === "\n") delimiter = "";
                break;
            case "/*":
                if (char === "*" && code.charAt(++i) === "/") delimiter = "";
                break;
            default:
                switch (char) {
                case "'":
                case '"':
                    delimiter = char;
                    break;
                case "/":
                    var lookahead = code.charAt(++i);
                    delimiter = char;

                    switch (lookahead) {
                    case "/":
                    case "*":
                        delimiter += lookahead;
                    }

                    break;
                case "(":
                case "[":
                case "{":
                    brackets.push(char);
                    break;
                case ")":
                case "]":
                case "}":
                    if (!brackets.length || matching[char] !== brackets.pop()) {
                        repl.print(new SyntaxError("Unexpected closing bracket: '" + char + "'"), "error");
                        return null;
                    }
                }
            }
        }

        return brackets.length ? false : true;
    };

    repl.eval = function (code) {
    	code = code.split("console.log").join("repl.print");
        try {
            if (isExpression(code)) {
                geval("__expression__ = " + code);
                express(__expression__);
            } else geval(code);
        } catch (error) {
            repl.print(error, "error");
        }
    };

    function isExpression(code) {
        if (/^\s*function\s/.test(code)) return false;

        try {
            Function("return " + code);
            return true;
        } catch (error) {
            return false;
        }
    }

    function express(value) {
        if (value === null) var type = "Null";
        else if (typeof value === "Undefined") var type = "Undefined";
        else var type = Object.prototype.toString.call(value).slice(8, -1);

        switch (type) {
        case "String":
            value = '"' + value.replace('\\', '\\\\').replace('\0', '\\0').replace('\n', '\\n').replace('\r', '\\r').replace('\t', '\\t').replace('\v', '\\v').replace('"', '\\"') + '"';
        case "Number":
        case "Boolean":
        case "Function":
        case "Undefined":
        case "Null":
            repl.print(value);
            break;
        case "Object":
        case "Array":
            repl.print(JSON.stringify(value, 4));
            break;
        default:
            repl.print(value, "error");
        }
    }
    
    repl.print("/*Code Your Cloud*/");
    repl.setTheme("cobalt-cold");
    
}, false);

