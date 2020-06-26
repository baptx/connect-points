/**
 * Browser-independent debug console
 * debug.log alternative to default console.log
 *
 * HTML textarea tag needed
 * Change loader parameters to fit your preferences
 *
 * Loader parameters, order to respect:
 *					  Console: textarea id (string),
 *					  maxLines: limit number of logs to display, null = no limit (int);
 *
 * Available methods: 	debug.loader(Console, maxLines)
 *							Variables to load when all DOM content is loaded,
 *						debug.log(msg)
 *							Log a message (string),
 *						debug.reset()
 *							Clear textarea;
 *
 * Version 1.0
 *
 * Copyright (c) 2012 https://www.linkedin.com/in/bhassenfratz
 * Licensed under MIT license http://opensource.org/licenses/MIT
 **/


var debug = new Debug();

// if script is already inserted on window load
(function() {
	// loader parameters
	var Console = "console";
	var maxLines = 15;
	
	if(window.addEventListener)
		window.addEventListener("load", debugLoader = function(){debug.loader(Console, maxLines);});
	else if(window.attachEvent)
		window.attachEvent("onload", debugLoader = function(){debug.loader(Console, maxLines);});
	else if(window.onload)
		window.onload = function(){debug.loader(Console, maxLines);};
})();


function Debug()
{
	var Console;
	var maxLines;
	
	
	this.loader = function debug_loader(textarea, lines)
	{
		if(window.removeEventListener)
			window.removeEventListener("load", debugLoader);
		else if(window.detachEvent)
			window.detachEvent("onload", debugLoader);
		
		Console = document.getElementById(textarea);
		
		maxLines = lines;
	};
	
	var countLines = function debug_countLines() // count number of lines in textarea
	{
		var text = Console.value.replace(/\s+$/g,""); // regex: remove last \n of textarea content (replace with "")
		// replace(/\s+$/g) -> "\s" : whitespace character; "+" : one or more times; "$" : end of line; "/g" : global search (all matches)
		var split = text.split("\n");
		// cut string for each new line (\n)
		
		return split.length;
	};
	
	this.log = function debug_log(msg)
	{
		var lines = countLines();
		
		if(maxLines == "" || lines < maxLines)
			Console.value = msg + "\n" + Console.value;
		else if(maxLines != "" && lines >= maxLines)
			Console.value = msg + "\n" + Console.value.split("\n", maxLines - 1).join("\n");
	};
	
	this.reset = function debug_reset()
	{
		Console.value = "";
	};
}
