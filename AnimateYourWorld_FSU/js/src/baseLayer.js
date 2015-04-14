
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
	
	var firstDate = (nasa_layers[currentLayer].from).split('-');
//	if(firstDate !== ""){
	if(false){
		var lastDate= (nasa_layers[currentLayer].to).split('-');;
		
		var firstYear = parseInt(firstDate[0]);
		var lastYear= parseInt(lastDate[0]);
		
		var selectedYear = $("#selectedYear");
		selectedYear.empty();
		
		for(var i=firstYear; i< lastYear; i++){
			option = new Option(i, i);
			selectedYear.append(option);
		}
	}
	
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