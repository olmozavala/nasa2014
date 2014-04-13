/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function initBaseLayers(){
	$("#baseLayers").change(function() {
		var new_idx = parseInt($("select option:selected").val());
		updateBaseLayer(new_idx);
	});
}

function updateBaseLayer(new_idx){
	//The order of these 4 instructions is important, do not change
	map_main.removeLayer(ol3_layers[currentLayer]);
	currentLayer = new_idx;
	updateLayerDate();// This is required to update the date of the new layer
	map_main.addLayer(ol3_layers[new_idx]);
}

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
	console.log(url);
	lastUpdateOfUrls = currentUpdate;

	var size = current_requests.length;
	current_requests[size] = url;
}

function fillDropdown(nasa_layers,currentLayer,url){
	
	//Filling the base layers dropdown
	var select = $("#baseLayers");
	for(var i=0;i<nasa_layers.length;i++){
		nasa_layers[i].wmts = url;
		option = new Option(nasa_layers[i].name, i)
		if(i === currentLayer){
			option.selected = true;
		}
		select.append(option);
	}
}