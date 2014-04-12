/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function initBaseLayers(){
	$("#baseLayers").change(function() {
		var new_idx = parseInt($("select option:selected").val());
		map_main.removeLayer(ol3_layers[currentLayer]);
		map_main.addLayer(ol3_layers[new_idx]);
		currentLayer = new_idx;
	});
}


function updateBaseLayer(){
	var newDate = $("#datepicker").val();
	var mainLayer = ol3_layers[currentLayer];

    layer_sorce = mainLayer.getSource();

    layerParams.time = newDate;//Modify the desired parameter
	
    mainLayer.getSource().updateParams(layerParams);//Updates the layer

	console.log("end");
}