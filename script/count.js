/**
 * Customizable minutes/seconds counter and countdown
 * Start, Stop & Continue functions available
 *
 * HTML div tag needed
 * Change loader parameters to fit your preferences
 *
 * Loader parameters, order to respect:
 *					  myDiv: div id (string),
 *					  minText: minutes text (string),
 *					  secText: seconds text (string),
 *					  plural[Optional]: plural character (string),
 *					  sec01[Optional]: always display seconds with 2 digits (bool),
 *					  start[Optional]: start counter from specified seconds value, if negative -> countdown (int),
 *					  callback[Optional]: Callback function to call when countdown has finished (function);
 *
 * Available methods: 	count.loader(myDiv, minText, secText[, plural, sec01, start, callback])
 *							Variables to load when all DOM content is loaded,
 *						count.start(start)
 *							Continue count or start new count with arguments passed to function (int)
 *							Parameter value represents start time in seconds, use negative value for countdown
 *						count.stop()
 *							Stop/Pause timer,
 *						count.refresh()
 *							Refresh timer, useful if Firebug has broken timer (setInterval) after breakpoint,
 *						count.time()
 *							Returns minutes and seconds values in an array
 *						count.timeString()
 *							Returns time string as it is displayed
 *						count.reset()
 *							Restart timer;
 *
 * Changelog
 * 1.2 Countdown feature added, callback method (Suggestion: Alexandre Munch)
 * 1.1 User can personalize counter output (Suggestion: Alexandre Munch)
 * 1.0 Initial counter, API control
 *
 *
 * Version 1.2
 *
 * Copyright (c) 2012 https://www.linkedin.com/in/bhassenfratz
 * Licensed under MIT license http://opensource.org/licenses/MIT
 **/


var count = new Count();

// if script is already inserted on window load
(function() {
	// loader parameters
	var myDiv = "count";
	var minText = "minute";
	var secText = "seconde";
	var plural = "s";
	var sec01 = true;
	var start = 0;
	var callback = function(){alert("Do or display something");};
	
	if(window.addEventListener)
		window.addEventListener("load", countLoader = function(){count.loader(myDiv, minText, secText, plural, sec01, start, callback);});
	else if(window.attachEvent)
		window.attachEvent("onload", countLoader = function(){count.loader(myDiv, minText, secText, plural, sec01, start, callback);});
	else if(window.onload)
		window.onload = function(){count.loader(myDiv, minText, secText, plural, sec01, start, callback);};
})();


function Count()
{
	var myDiv;
	var minText;
	var secText;
	var plural;
	var sec01;
	var down;
	var callback;
	var loopTime;
	var min;
	var sec;
	var time;
	
	
	this.loader = function count_loader(div, m, s)
	{
		if(window.removeEventListener)
			window.removeEventListener("load", countLoader);
		else if(window.detachEvent)
			window.detachEvent("onload", countLoader);
		
		myDiv = div;
		minText = m;
		secText = s;
		
		//Optional parameters
		plural = ""; // prevent undefined value to be displayed
		sec01 = false;
		var start = null;
		
		myDiv = document.getElementById(myDiv);
		
		if(!myDiv.childNodes.length)
			myDiv.appendChild(document.createTextNode(""));
		myDiv = myDiv.firstChild;
		
		try
		{
			if(arguments.length == 7)
			{
				if(typeof(arguments[5]) == "number" && typeof(arguments[6]) == "function")
				{
					start = arguments[5];
					callback = arguments[6];
					
					if(typeof(arguments[4]) == "boolean")
						sec01 = arguments[4]
					else throw 5;
					
					if(typeof(arguments[3]) == "string")
						plural = arguments[3]
					else throw 4;
				}
				else
				{
					if(typeof(arguments[6]) != "function")
						throw 7;
					else if(typeof(arguments[5]) != "number")
						throw 6;
				}
			}
			else if(arguments.length == 6)
			{
				if(typeof(arguments[4]) == "number" && typeof(arguments[5]) == "function")
				{
					start = arguments[4];
					callback = arguments[5];
					
					if(typeof(arguments[3]) == "boolean")
						sec01 = arguments[3]
					else if(typeof(arguments[3]) == "string")
						plural = arguments[3]
					else throw 4;
				}
				else
				{
					if(typeof(arguments[5]) == "number")
						start = arguments[5]
					else throw 6;
					
					if(typeof(arguments[4]) == "boolean")
						sec01 = arguments[4]
					else throw 5;
					
					if(typeof(arguments[3]) == "string")
						plural = arguments[3]
					else throw 4;
				}
			}
			else if(arguments.length == 5)
			{
				if(typeof(arguments[3]) == "number" && typeof(arguments[4]) == "function")
				{
					start = arguments[3];
					callback = arguments[4];
				}
				else
				{
					if(typeof(arguments[4]) == "number")
						start = arguments[4];
					else if(typeof(arguments[4]) == "boolean")
						sec01 = arguments[4]
					else throw 5;
					
					if(typeof(arguments[3]) == "boolean" && typeof(arguments[4]) != "boolean")
						sec01 = arguments[3];
					else if(typeof(arguments[3]) == "string")
						plural = arguments[3];
					else throw 4;
				}
			}
			else if(arguments.length == 4)
			{
				if(typeof(arguments[3]) == "number")
					start = arguments[3];
				else if(typeof(arguments[3]) == "boolean")
					sec01 = arguments[3];
				else if(typeof(arguments[3]) == "string")
					plural = arguments[3];
				else throw 4;
			}
			else if(arguments.length > 7) {
				throw "max";
			}
			else if(arguments.length < 3) {
				throw "min";
			}
		}
		catch(err)
		{
			if(typeof(err) == "number")
				console.log("Error: argument number " + err + " is not valid");
			else if(err == "max")
				console.log("Error: too much arguments");
			else if(err == "min")
				console.log("Error: not enough arguments");
			else
				console.log(err);
			return;
		}
		
		if(start)
			count.start(start);
		else
			count.start(0);
	};
	
	var timeCount = function count_timeCount(display)
	{
		if((sec < 59 && min == 0) || (down && ((sec <= 59 && min == 0) || (sec == 0 && min == 1))))
		{
			// Calc
			if(down)
			{
				if(sec > 0) {
					sec--;
				}
				else if(sec == 0 && min == 1) {
					min--;
					sec = 59;
				}
			}
			else {
				sec++;
			}
			
			// Display
			if(sec < 2)
			{
				if(sec == 0 && min == 0)
					count.stop();
				
				if(callback && sec == 0 && min == 0) {
					callback();
				}
				else {
					if(sec01 && sec < 10) time = "0" + sec + " " + secText;
					else time = sec + " " + secText;
				}
			}
			else {
				if(sec01 && sec < 10) time = "0" + sec + " " + secText + plural;
				else time = sec + " " + secText + plural;
			}
		}
		else
		{
			// Calc
			if(down) {
				if(sec > 0) {
					sec--;
				}
				else if(sec == 0) {
					min--;
					sec = 59;
				}
			}
			else {
				if(sec == 59)
				{
					sec = 0;
					min++;
				}
				else if(sec < 59) {
					sec++;
				}
			}
			
			
			// Display
			if(sec < 2 && min < 2)
			{
				if(sec01 && sec < 10) time = min + " " + minText + " 0" + sec + " " + secText;
				else time = min + " " + minText + " " + sec + " " + secText;
			}
			else if(sec >= 2 && min < 2)
			{
				if(sec01 && sec < 10) time = min + " " + minText + " 0" + sec + " " + secText + plural;
				else time = min + " " + minText + " " + sec + " " + secText + plural;
			}
			else if(sec < 2 && min >= 2)
			{
				if(sec01 && sec < 10) time = min + " " + minText + plural + " 0" + sec + " " + secText;
				else time = min + " " + minText + plural + " " + sec + " " + secText;
			}
			else if(sec >= 2 && min >= 2)
			{
				if(sec01 && sec < 10) time = min + " " + minText + plural + " 0" + sec + " " + secText + plural;
				else time = min + " " + minText + plural + " " + sec + " " + secText + plural;
			}
		}
		
		myDiv.nodeValue = time; // document.getElementById("count").textContent: DOM3 standard, IE9 ok
	};
	
	this.start = function count_start(start)
	{
		count.stop();
		
		if(typeof(start) != "undefined")
		{
			if(start < 0) {
				start = -start;
				down = start;
			}
			else {
				down = null;
			}
			
			if(start == 0)
			{
				min = 0;
				sec = 0;
			}
			else
			{
				min = 0;
				
				// for instant display via timeCount without waiting 1s
				if(down)
					start++; // if timer is a countdown, value incremented
				else
					start--; // else, value decremented
				
				
				if(start < 60) {
					sec = start;
				}
				else if(start > 60)
				{
					var totalSec = start;
					
					while(totalSec > 60) {
						totalSec -= 60;
						min++;
					}
					sec = totalSec;
				}
				
				timeCount();
			}
		}
		
		loopTime = setInterval(function(){timeCount()}, 1000); // Timer every second (1000 ms)
	};
	
	this.stop = function count_stop()
	{
		clearInterval(loopTime);
	};
	
	this.refresh = function count_refresh()
	{
		count.stop();
		count.start();
	};
	
	this.time = function count_time()
	{
		return [min, sec];
	};
	
	this.timeString = function count_timeString()
	{
		return time;
	}
	
	this.reset = function count_reset()
	{
		count.stop();
		if(down)
			count.start(-down);
		else
			count.start(0);
	};
}
