/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var countImages = 0;
var totalImages = 0;
var imagesData = new Array;
var redTileSize = 128;//TODO
var animSize = .50;//Percentage of height
var cols = new Array;
var rows = new Array;
var dates = new Array;
var urlTemplate = "";
var currentDate = 0;
var waitTimeBetweenFrames = 2000;

function initAnimationButtons(){
	$("#nextFrame").click(function(){
		currentDate = currentDate < (dates.length - 1)? currentDate+1: 0;
		createOneFrame(false,0) });
	$("#previousFrame").click(function(){
		currentDate = currentDate > 0? currentDate-1: dates.length -1;
		createOneFrame(false,0) });
	$("#playAnimation").click(function(){
		createOneFrame(true,waitTimeBetweenFrames);});

	$("#makeAnimation").click(makeAnimation);
	$("#clearAnimation").click(function(){
//		clearDateRanges();
		$("#divCanvas").hide();
	});

}

function startAnimation(urlstxt){

	displayControls(false);
	$("#loading").show();
	cols = new Array;
	rows = new Array;
	dates = new Array;
	var urls = urlstxt.split("\n");
	var firstTileMatrix = 0;

	for(i=0;i<urls.length-1;i++){
		var currUrl = urls[i].split("&");
		//Forces to use the same tile matrix (zoom level)
		if(i===0){ firstTileMatrix = currUrl[currUrl.length - 4].split("=")[1]; }

		if( firstTileMatrix === currUrl[currUrl.length - 4].split("=")[1]){
			var currCol = currUrl[currUrl.length - 3].split("=")[1]; 
			var currRow = currUrl[currUrl.length - 2].split("=")[1]; 
			var currDate = currUrl[currUrl.length - 1].split("=")[1];
			cols.push(parseInt(currCol));
			rows.push(parseInt(currRow));
			dates.push(currDate);
		}
	}
	cols = makeUnique(cols).sort(sortNumber);
	rows = makeUnique(rows).sort(sortNumber);
	dates = makeUnique(dates).sort();

//	var winHeight = $(window).height();
//	redTileSize = Math.floor( (animSize*winHeight)/rows.length );

//	var winWidth= $(window).width();
//	redTileSize = Math.floor( (animSize*winWidth)/cols.length );
	
	urlTemplate = mergeUntilTileCol(urls[0].split("&"));
	
	$("#myCanvas").show();
	var theCanvas = document.getElementById("myCanvas");
	var ctx = theCanvas.getContext('2d');

	theCanvas.width = redTileSize*cols.length;
	theCanvas.height = redTileSize*rows.length;

	console.log("Rows:"+rows);
	console.log("Cols:"+cols);
	console.log("Dates:"+dates);

	totalImages = cols.length*rows.length;
	currentDate = 0;

	createOneFrame(true, 0);
}

/**
 * This function iterates "one frame" of the animation 
 * @param {boolean} iterate Indicates if we should display all the frames or just one
 * @param {int} wait Indicates how long to wait between frames
 */
function createOneFrame(iterate, wait){

	var theCanvas = document.getElementById("myCanvas");
	var ctx = theCanvas.getContext('2d');
	var img = document.getElementById("frame");
	$("#currentDate").text(dates[currentDate]);

	for(var j=0;j<rows.length;j++){
		for(var k=0;k<cols.length;k++){
			var coltxt = "TileCol="+cols[k];
			var rowtxt = "TileRow="+rows[j];
			var datetxt = "Time="+dates[currentDate];
			var url = urlTemplate+coltxt+"&"+rowtxt+"&"+datetxt;
			//				console.log(url);// This is the url we are calling (the image)
			var img = new Image();
			img.src = url;
			img.row = j;
			img.col = k;
			img.onload = function(){
				ctx.drawImage(this,this.col*redTileSize,this.row*redTileSize,redTileSize,redTileSize);
				countImages++;
				if( countImages===totalImages){
					countImages = 0;
					//If we haven't finsh, then we start drawing the next frame
					if(currentDate < (dates.length-1)){
						console.log("Draw one more date:"+currentDate+" Total:"+dates.length);
						if(iterate){
							currentDate++;
							setTimeout( createOneFrame, wait, iterate, wait);
						}
					}else{
						currentDate = 0;
						displayControls(true);
						if(iterate){
							createOneFrame(false,0);
						}
					}
				}
			};
		}//cols
	}//rows
}

function displayControls(display){
	if(display){
		$("#loading").hide();
		$("#previousFrame").show();
		$("#nextFrame").show();
		$("#playAnimation").show();
	}else{
		$("#previousFrame").hide();
		$("#nextFrame").hide();
		$("#playAnimation").hide();
	}

}

/**
 * Function used to sort integer arrays 
 * @param {int} a
 * @param {int} b
 * @returns {int} If a>b postive else negative
 */
function sortNumber(a,b){
	// If a>b postive else negative
	return a-b;
}
/**
 *	This function removes everything after  the "TileCol" element of an array
 *	and returns everything else as text
 * @param {array} url
 * @returns {undefined}
 */
function mergeUntilTileCol(url){
	var urlTxt = "";
	for(var i=0;i<url.length;i++){
		if(url[i].indexOf("TileCol") !== -1){
			return urlTxt;//Finish loop
		}else{
			urlTxt = urlTxt+url[i]+"&";
		}
	}
}

function makeUnique(inputArray){
	var outputArray = [];
	for (var i = 0; i < inputArray.length; i++) {
		if (($.inArray(inputArray[i], outputArray)) === -1) {
			outputArray.push(inputArray[i]);
		}
	}
	
	return outputArray;
}