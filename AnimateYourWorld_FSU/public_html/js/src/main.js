/*
goog.provide('animate');

goog.require('ol.Map');
goog.require('ol.View2D');
goog.require('ol.extent');
goog.require('ol.layer.Tile');
goog.require('ol.proj');
goog.require('ol.source.OSM');
goog.require('ol.source.MapQuest');
goog.require('ol.source.WMTS');
goog.require('ol.tilegrid.WMTS');
goog.require('ol.format.WMSCapabilities');
 */


var nasa_layers = new Array();
var ol3_layers = new Array();
var currentLayer = 46;
var map_main;

function runApp(){
	var o_map_main = $("#mainMap");
	var o_map_northpole= $("#northpoleMap");
	var o_map_antarctica = $("#antarcticaMap");

	initNasaLayers();

	initGui();
}



function initMaps(){
	var view_main = new ol.View2D({
		projection: 'EPSG:4326',
		center: [87,25],
		zoom: 1
	});
	var view_northpole = new ol.View2D({
		center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
		//		center: ol.proj.transform([0, 90], 'EPSG:4326', 'EPSG:3857'),
		zoom: 4
	});
	var view_antarctica = new ol.View2D({
		center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
		//		center: ol.proj.transform([0, -90], 'EPSG:4326', 'EPSG:3857'),
		zoom: 4
	});
	
	var projection = ol.proj.get('EPSG:4326');
	var projectionExtent = projection.getExtent();
	var maxResolution = 0.5625;
	var size = 20;
	var resolutions = new Array(size);
	var matrixIds = new Array(size);
	for (var z = 0; z < size; ++z) {
		// generate resolutions and matrixIds arrays for this WMTS
		resolutions[z] = maxResolution/ Math.pow(2, z);
		matrixIds[z] = z;
	}
	
	var attribution = new ol.Attribution({
		html: "<a href='http://openlayers.org'>" +
				"OpenLayers</a>&nbsp;&nbsp;&nbsp;" +
				"<a href='https://earthdata.nasa.gov/gibs'>" +
				"NASA EOSDIS GIBS</a>&nbsp;&nbsp;&nbsp;" +
				"<a href='https://github.com/nasa-gibs/web-examples/blob/master/openlayers2/js/geographic-epsg4326.js'>" +
				"View Source" +
				"</a>" 
	});
	
	
	for(var i=0;i<nasa_layers.length;i++){
		layerSource = new ol.source.WMTS({
				attributions: [attribution],
				url: nasa_layers[i].wmts,
				layer: nasa_layers[i].name,
				matrixSet: nasa_layers[i].matrix,

//				layer: "MODIS_Terra_CorrectedReflectance_TrueColor",

				formAt: 'image/jpg',
				projection: projection,
				tileGrid: new ol.tilegrid.WMTS({
					origin: ol.extent.getTopLeft(projectionExtent),
					resolutions: resolutions,
					matrixIds: matrixIds,
					tileSize: 512
				}),
//				extent: nasa_layers[i].extent,
				extent: projectionExtent,
				style: ''
			});
			
		var superTileUrlFunction = layerSource.tileUrlFunction;
		layerSource.tileUrlFunction = function() {
			var url = superTileUrlFunction.apply(layerSource, arguments);
			if ( url ) { return url + "&TIME=2013-06-15"; }
		};
		
		ol3_layers[i] = new ol.layer.Tile({ source: layerSource });
	}// loop
	
	initMap('mainMap',view_main,[ol3_layers[currentLayer]]);
	//	initMap('northpoleMap',view_northpole,[def_layer]);
	//	initMap('antarcticaMap',view_antarctica,[def_layer]);
	
}//initMaps()

function initMap(id, view,layers){
	map_main = new ol.Map({
        target: id,
        layers: layers,
        view: view});
}

function initNasaLayers(){
	var parser = new ol.format.WMSCapabilities();
	
	$.ajax('http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?SERVICE=WMTS&request=GetCapabilities').then(function(response) {
		var url = $($(response).find('[name=GetTile] HTTP').children()[1]).attr("xlink:href");
		
		var allLayers = $(response).find('Layer').each(function (idx,layer){
			var name = $(layer).find('Title').text();
			//TODO I do not know if this will always work (removing 'default')
			name = name.replace('default','');
			var matrixSet = $.trim($(layer).find('TileMatrixSetLink').text());
			var extent =  [$(layer).find('LowerCorner').text(), $(layer).find('UpperCorner').text()];
			nasa_layers[idx] = new NasaLayer(name,extent,"",matrixSet,"","");
		});
		
		var select = $("#baseLayers");
		for(var i=0;i<nasa_layers.length;i++){
			nasa_layers[i].wmts = url;
			option = new Option(nasa_layers[i].name, i)
			if(i == currentLayer){
				option.selected = true;
			}
			select.append(option);
		}
		
		initMaps();
		
	});
}