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

var animSpeed = 300;
var intervalHandler;// This is the handler of the 'interval' function
var imagesByDate = new Array();//Indicates which images are ready
var canvas = 0;
var ctx = 0;
var anim_status = "";
var currentFrame = 0;
var currTileMatrix = 0;

function initAnimationButtons(){
	$("#firstFrame").click(animFirstFrame);
	$("#nextFrame").click(animIncreaseFrame);
	$("#previousFrame").click(animDecreaseFrame);
	$("#lastFrame").click(animLastFrame);
	$("#playAnimation").click(playAnimation);
	$("#stopAnimation").click(stopAnimation);
	$("#makeAnimation").click(makeAnimation);
	$("#clearAnimation").click(clearAnimation);
}

function canvasFunction(extent, resolution, pixelRatio, size, projection) {	

	var currLayerOl3 = ol3_layers[currentLayer]; 
	var currLayer= nasa_layers[currentLayer]; 
	
	var currSource = currLayerOl3.getSource();
	var currGrid = currSource.getTileGrid();

	var allRes = currLayer.resolutions;	
	for(i = 0; i < allRes.length; i++){
		if(resolution > allRes[i]){
			currTileMatrix = i;
			break;
		}
	}
	
	// Creating this newExtent is required because the function obtains wrong results
	extent = [extent[0], -1*extent[3]+180,extent[2], -1*extent[1]+180];
	var tileRange = currGrid.getTileRangeForExtentAndResolution(extent,resolution);
	
	cols = _.range(Math.max(0,tileRange.minX),Math.max(0,tileRange.maxX));
	rows = _.range(Math.max(0,tileRange.minY),Math.max(0,tileRange.maxY));

	canvas = document.getElementById("myCanvas");

/*
	canvas.width = size[0];
	canvas.height = size[1];

	clearCanvas();
	*/
    return canvas;
}

function startAnimation(){

	displayControls(false);
	$("#loading").show();

	var layerObj = nasa_layers[currentLayer];
	urlTemplate = layerObj.wmts+"layer="+layerObj.name+
			"&style&tilematrixset="+layerObj.matrix+
			"&tilematrix="+currTileMatrix+
			"&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/png&";
	
	$("#myCanvas").show();
	canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext('2d');
	
	canvas.width = redTileSize*cols.length;
	canvas.height = redTileSize*rows.length;
	
	/*
	console.log("Rows:"+rows);
	console.log("Cols:"+cols);
	console.log("Dates:"+dates);
	*/
	
	totalImages = cols.length*rows.length;
	currentFrame = 0;

	loadAnimationImages();
	playAnimation();
}

function loadAnimationImages(){
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext('2d');

	//Creates the image objects
	for(var j = 0; j < dates.length; j++){
		for(var row=0;row<rows.length;row++){
			for(var col=0;col<cols.length;col++){
				try{// Hack to test if the variable already exists
					eval('imageNumber'+j+'_'+row+'_'+col);
				}
				catch(e){
					eval('window.imageNumber'+j+'_'+row+'_'+col+';');
					eval("imageNumber"+j+"_"+row+"_"+col+" = document.createElement('img');");
					eval("imageNumber"+j+"_"+row+"_"+col+".src = '';");//Clear any previous animation
				}
			}
		}
	}
	
	for(var j = 0; j < dates.length; j++){
		//Adds the images for one date
		for(var row=0;row<rows.length;row++){
			for(var col=0;col<cols.length;col++){
				var coltxt = "TileCol="+cols[col];
				var rowtxt = "TileRow="+rows[row];
				var datetxt = "Time="+dates[j];
				var url = urlTemplate+coltxt+"&"+rowtxt+"&"+datetxt;
				eval("imageNumber"+j+"_"+row+"_"+col+".src = '"+url+"'");
				eval("imageNumber"+j+"_"+row+"_"+col+".row = "+row);
				eval("imageNumber"+j+"_"+row+"_"+col+".col = "+col);
				eval("imageNumber"+j+"_"+row+"_"+col+".id = "+col*row*j);
				eval("imageNumber"+j+"_"+row+"_"+col+".addEventListener('load', onLoadImage);");
				eval("imageNumber"+j+"_"+row+"_"+col+".addEventListener('error', errorFunction);");
			}//cols
		}//rows
	}

	startAnimationLoop();
}

/**
 * Log the error and try to load the image again 
 * @param {type} e
 * @returns {undefined}
 */
function errorFunction(e){

	var currentImage = parseInt(e.target.id);
//	var errorCount = parseInt(e.target.errorCount);

	alert("There has been a problem loading image with id: "+ currentImage 
				+" please stop the animation and reload it");
	
}

function onLoadImage(){
	ctx.drawImage(this,this.col*redTileSize,this.row*redTileSize,redTileSize,redTileSize);
	displayControls(true);
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

/**
 * Removes previously defined animation callback functions 
 * @returns {undefined}
 */
function clearLoopHandler(){
	if(typeof intervalHandler !== 'undefined'){
		clearInterval(intervalHandler);
	}
}

/**
 * Initilizes the callback function to start the animation loop 
 * @returns {undefined}
 */
function startAnimationLoop(){
	clearLoopHandler();
	intervalHandler = setInterval(loopAnimation,animSpeed);
}

/**
 * This is the callback function in charge of displaying
 * the proper frames of the animations 
 * @returns {undefined}
 */
function loopAnimation(){
	//When the animation is 'playing' it loops on all the frames
	if(anim_status === anim_playing){
		currentFrame = currentFrame < (dates.length-1)? ++currentFrame: 0;
	}
//	clearCanvas();
	
	//Draws all the image that correspond to the current date
	$("#currentDate").text(dates[currentFrame]);
	for(var row=0;row<rows.length;row++){
		for(var col=0;col<cols.length;col++){
			ctx.drawImage(eval('imageNumber'+currentFrame+"_"+row+"_"+col), 
				col*redTileSize,row*redTileSize,redTileSize,redTileSize);
		}
	}
}
/**
 * Moves the animation to the first and last frame 
 * @returns {undefined}
 */
function animFirstFrame(){ currentFrame = 0; }
function animLastFrame(){ currentFrame = dates.length - 1; }
/**
 * Decreases the frame of the animation, if it is on the first frame
 * it goes to the last one 
 * @returns {undefined}
 */
function animDecreaseFrame(){
	if(currentFrame > 0){
		currentFrame--;
	}else{
		currentFrame = dates.length- 1;
	}
}
/**
 * Increases the frame of the animation, if it is on the last frame
 * it goes to the first one 
 * @returns {undefined}
 */
function animIncreaseFrame(){
	if(currentFrame < (dates.length- 1) ){
		currentFrame++;
	}else{
		currentFrame = 0;
	}
}
/**
 * Makes the animation 10% faster. 
 * @returns {undefined}
 */
function animFaster(){
	animSpeed = animSpeed*.80;
	startAnimationLoop();
}
/**
 * Makes the animation 10% slower. 
 * @returns {undefined}
 */
function animSlower(){
	animSpeed = animSpeed*1.20;
	startAnimationLoop();
}
/**
 * Clears the canvas by drawing an empty rectangle 
 * @returns {undefined}
 */
function clearCanvas(){
	//Clears any previous display in the canvas
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function playAnimation(){
	startAnimationLoop();
	anim_status = anim_playing;
}

function stopAnimation(){
	anim_status = anim_stopped;
}

function clearAnimation(){
	clearLoopHandler();
	$("#divCanvas").hide();
}