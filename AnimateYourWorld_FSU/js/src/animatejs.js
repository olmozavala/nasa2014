var countImages = 0;
var totalImages = 0;
var imagesData = new Array;
var imgSizes = 512;//TODO
var animSize = .50;//Percentage of height
var cols = new Array;
var rows = new Array;
var dates = new Array;
var urlTemplate = "";
var currentDate = 0;
var waitTimeBetweenFrames = 2000;

var offsetX = 0;
var offsetY = 0;
var scale = 1;

var tx = 0;
var ty = 0;
var mx = 0;
var my = 0;

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
	$("#makeAnimation").click(startAnimation);
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
	
	// Finding the offsets of the canvas
	var z = currGrid.getZForResolution(resolution);
	scale = resolution / currGrid.getResolution(z);

	var myTileRange = {
						"minX": (scale * (extent[0] + 180) / (resolution * imgSizes)),
						"minY": (scale * (extent[1] - 90) /  (resolution * imgSizes)),	
						"maxX": (scale * (extent[2] + 180) / (resolution * imgSizes)),
						"maxY": (scale * (extent[3] - 90) /  (resolution * imgSizes))};	

	cols = _.range(Math.max(0,tileRange.minX),Math.max(0,tileRange.maxX+1));
	rows = _.range(Math.max(0,tileRange.minY),Math.max(0,tileRange.maxY+1));

	offsetX = _.min(cols) - myTileRange.minX;
	offsetY = _.min(rows) - myTileRange.minY;

	console.log("----------------------");
	console.log(myTileRange);
	console.log(tileRange);
	console.log(scale);
//	console.log(extent);
//	console.log(scale);
//	console.log(resolution);
	console.log(cols);
	console.log(rows);
	console.log("OX: "+offsetX+ "   OY: "+offsetY);
	
	canvas = document.getElementById("animationCanvas");
	ctx = canvas.getContext('2d');
	
    var canvasWidth = size[0];
    var canvasHeight = size[1];        
	
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;   	
	
	clearCanvas();
	if(anim_status === anim_playing){
		startAnimation();
	}
//    return  document.getElementById("emptyCanvas");
    return  canvas;
}

function startAnimation(){
	
	displayControls(true);
	$("#loading").show();
	
	var layerObj = nasa_layers[currentLayer];
	urlTemplate = layerObj.wmts+"layer="+layerObj.name+
			"&style&tilematrixset="+layerObj.matrix+
			"&tilematrix="+currTileMatrix+
			"&Service=WMTS&Request=GetTile&Version=1.0.0&Format="+layerObj.format+"&";
	
	console.log("Rows:"+rows);
	console.log("Cols:"+cols);
	
	totalImages = cols.length*rows.length;
	currentFrame = 0;
	
	loadAnimationImages();
	playAnimation();
}

function loadAnimationImages(){
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
				eval("imageNumber"+j+"_"+row+"_"+col+".width = 512");
				eval("imageNumber"+j+"_"+row+"_"+col+".heigth = 512");
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

function drawImage(img){
	/*
	ctx.strokeStyle="black";
	ctx.rect(
			img.col*imgSizes + (tx*imgSizes),
			img.row*imgSizes + (ty*imgSizes),
			imgSizes,
			imgSizes);
	
	ctx.stroke();
	*/

	ctx.drawImage(img,(1/scale) * ( (img.col+offsetX) * imgSizes),
				      (1/scale) * ( (img.row+offsetY) * imgSizes),
					  (1/scale) * imgSizes,
					  (1/scale) * imgSizes);
	                   
//	ctx.drawImage(img,img.col*imgSizes/2,
//					  img.row*imgSizes/2,imgSizes/2,imgSizes/2);

//	ctx.drawImage(img,img.col*imgSizes+(offsetX*imgSizes),
//					  img.row*imgSizes+(offsetY*imgSizes),imgSizes,imgSizes);
	
	//	console.log("**************");
	//	console.log(main_view.getResolution());
}

function onLoadImage(){
//	ctx.strokeStyle="black";
//	ctx.fillRect( 0, 0, canvas.width, canvas.height);
//	ctx.rect( 0, 0, canvas.width, canvas.height);
//	ctx.stroke();
	drawImage(this);
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
			drawImage(eval('imageNumber'+currentFrame+"_"+row+"_"+col));
		}
	}
	
	map_main.render();
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
	//TODO empty the animaiton canvas
	$("#divCanvas").hide();
}