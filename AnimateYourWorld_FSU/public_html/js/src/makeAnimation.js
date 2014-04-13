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
	count.text(current_requests.length);
	textArea.val(current_requests);
}


