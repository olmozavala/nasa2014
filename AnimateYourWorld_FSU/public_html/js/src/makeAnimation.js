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
	//TODO this is a patch, if the tiles get updated after
	// two second, then we assume they are from a different view 
	var threshold = 1000; 
	if( (currentUpdate - lastUpdateOfUrls ) > threshold){
		lastUpdateOfUrls = currentUpdate;
		current_requests = new Array();
	}
//	console.log(url);
	lastUpdateOfUrls = currentUpdate;

	var size = current_requests.length;
	current_requests[size] = url;
}

function makeAnimation(){
	var textArea = $("textarea");
	var count = $("#countUrls");
	var total = current_requests.length;
	count.text(total);
	var text = "";
	for(var j=0; j < dateRanges.length; j++){
		for(var i=0; i < current_requests.length; i++){
			subUrl = current_requests[i].substring(0,current_requests[i].length - 10);
			text += subUrl+dateRanges[j]+"\n";
		}
		text += ("--------------- New Year ------------- \n");
	}
	textArea.val(text);
}


