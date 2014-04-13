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

	var firstDate = nasa_layers[currentLayer].from;

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