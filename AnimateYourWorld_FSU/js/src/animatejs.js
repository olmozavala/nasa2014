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

function startAnimation(urlstxt){

	cols = new Array;
	rows = new Array;
	dates = new Array;
	var urls = urlstxt.split("\n");

	for(i=0;i<urls.length-1;i++){
		var currUrl = urls[i].split("&");
		var currCol = currUrl[currUrl.length - 3].split("=")[1]; 
		var currRow = currUrl[currUrl.length - 2].split("=")[1]; 
		var currDate = currUrl[currUrl.length - 1].split("=")[1];
		cols.push(currCol);
		rows.push(currRow);
		dates.push(currDate);
	}
	dates = makeUnique(dates).sort();
	cols = makeUnique(cols).sort();
	rows = makeUnique(rows).sort();

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

	createOneFrame(true);
}

function createOneFrame(iterate){

	var theCanvas = document.getElementById("myCanvas");
	var ctx = theCanvas.getContext('2d');
	var img = document.getElementById("frame");

	for(j=0;j<rows.length;j++){
		for(k=0;k<cols.length;k++){
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
					//If we haven't finsh, then we start drawing the next frame
					if(currentDate < (dates.length-1)){
//						console.log("Draw one more date");
						countImages = 0;
						currentDate++;
						if(iterate)
							createOneFrame(iterate);
					}else{
						countImages = 0;
						currentDate = 0;
					}
				}
			};
		}//cols
	}//rows
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