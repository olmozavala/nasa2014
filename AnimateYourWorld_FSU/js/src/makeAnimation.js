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
		console.log("clear");
	}
//	console.log(url);

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
	console.log("The urls are:"+text);

	var action ="animate.php";

	var ourForm = $("form");

	$('<input>').attr({
		type: 'hidden',
		id: 'urls',
		name: 'urls',
		value: text
	}).appendTo('form');

	$('<input>').attr({
		type: 'hidden',
		id: 'numImages',
		name: 'numImages',
		value: dateRanges.length
	}).appendTo('form');

	$.ajax({   
		type: 'POST',   
		url: action,   
		data: ourForm.serialize(),
		success: animationSuccess,
		fail: failedAnimation,
		dataType: "html"
	});

	$("#loading").show();

}

function failedAnimation(why){
	alert("Building the animation failed");
	console.log(why);
}

function animationSuccess(output){
	$("#loading").hide();
	console.log(output);
	var win = window.open();
	win.document.write(output);
}