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

function updateLayerDate(){
	var newDate = $("#datepicker").val();
	
	var tempLayer= ol3_layers[currentLayer];
	
	var layerSource = tempLayer.getSource();
	
	var superTileUrlFunction = layerSource.tileUrlFunction;
	
	layerSource.tileUrlFunction = function() {
		var url = superTileUrlFunction.apply(layerSource, arguments);
		//Checks if the url already has a TIME parameter
		if(url){
			if(url.indexOf('TIME') !== -1){
				//Remove old time
				url = url.substring(0, url.length - 16);
			}
			url += "&TIME="+newDate; 
			saveCurrentRequests(url);
			return url; 
		}
		
	};
	
}

function saveCurrentRequests(url){
	var size = current_requests.length;
	current_requests[size] = url;
	//	console.log(url);
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