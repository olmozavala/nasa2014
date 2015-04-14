/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var lastUpdateOfUrls = new Date();
/**
 * This function is used to save the current 'tiles' that the user is 'viewing' 
 * @param {type} url
 * @returns {undefined}
 */
function saveCurrentRequests(url){
	var currentUpdate = new Date();
	// We assume that requesting the layers takes less than 1 sec. 
	var threshold = 500; 
	if( (currentUpdate - lastUpdateOfUrls ) > threshold){
		lastUpdateOfUrls = currentUpdate;
		current_requests = new Array();
		console.log("---------- Clearing prev urls ----------");
	}

	var currUrl = url.split("&");
	var currCol = currUrl[currUrl.length - 3].split("=")[1]; 
	var currRow = currUrl[currUrl.length - 2].split("=")[1]; 
	console.log("Col: "+currCol+"  Row: "+currRow);
	var size = current_requests.length;
	current_requests[size] = url;
}

function makeAnimation(){
	
	var textArea = $("textarea");
	var count = $("#countUrls");
	var total = current_requests.length;
	count.text(total);
	
	var text = "";
	var tileDelimiter = "\n";
	
	for(var j=0; j < dateRanges.length; j++){
		for(var i=0; i < current_requests.length; i++){
			subUrl = current_requests[i].substring(0,current_requests[i].length - 10);
			text += subUrl+dateRanges[j]+tileDelimiter;
		}
	}
	
	textArea.val(text);
	
	$("#divCanvas").show();
	startAnimation();
}