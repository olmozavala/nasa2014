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
	map_main.removeLayer(ol3_layers[currentLayer]);
	map_main.addLayer(ol3_layers[new_idx]);
	currentLayer = new_idx;
}

function updateLayerDate(){
	var newDate = $("#datepicker").val();

	for(var i=0;i<ol3_layers.length;i++){
		var layer = ol3_layers[i];
	
		var layerSource = layer.getSource();
	
		var superTileUrlFunction = layerSource.tileUrlFunction;

		layerSource.tileUrlFunction = function() {
			var url = superTileUrlFunction.apply(layerSource, arguments);
			//Checks if the url already has a TIME parameter
			if(url){
				if(url.indexOf('TIME') !== -1){
					//Remove old time
					url = url.substring(0, url.length - 15);
				}
				url += "&TIME="+newDate; 
				saveCurrentRequests(url);
				return url; 
			}
			
		};
	}

}

function saveCurrentRequests(url){
	var size = current_requests.length;
	current_requests[size] = url;
	console.log(url);
}