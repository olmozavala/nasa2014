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

$(document).ready(initMaps);

var nasa_layers;

function initMaps(){
	var o_map_main = $("#mainMap");
	var o_map_northpole= $("#northpoleMap");
	var o_map_antarctica = $("#antarcticaMap");
	
	
	initOl3();	
	resizeMaps();
}

function resizeMaps(){
	var vpw = $(window).width();
	var vph = $(window).height();
	
	//	$("#mainMap").css({'width':vpw+'px'});
	var mapHeight = Math.ceil(vph/2); 
	$("#mainMap").css({'height':mapHeight+'px'});
	
	var o_map_northpole= $("#northpoleMap");
	var o_map_antarctica = $("#antarcticaMap");
}

function initOl3(){
	var view_main = new ol.View2D({
		projection: 'EPSG:4326',
		center: [0,0],
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
	
	var def_layer = new ol.layer.Tile({
		opacity: 0.7,
		source: new ol.source.WMTS({
			attributions: [attribution],
			urls: [
				"https://map1a.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi",
				"https://map1b.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi",
				"https://map1c.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi"
			],
			layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
			matrixSet: 'EPSG4326_250m',
			formAt: 'image/jpg',
			projection: projection,
			tileGrid: new ol.tilegrid.WMTS({
				origin: ol.extent.getTopLeft(projectionExtent),
				resolutions: resolutions,
				matrixIds: matrixIds,
				tileSize: 512
			}),
			extent: projectionExtent,
			style: ''
		})
	});
	
	initMap('mainMap',view_main,[def_layer]);
//	initMap('northpoleMap',view_northpole,[def_layer]);
//	initMap('antarcticaMap',view_antarctica,[def_layer]);
	
	initNasaLayers();
}

function initMap(id, view,layers){
	var map_main = new ol.Map({
        target: id,
        layers: layers,
        view: view});
}

function initNasaLayers(){
	var parser = new ol.format.WMSCapabilities();
	
	$.ajax('http://localhost:8383/AnimateYourWorld_FSU/test.xml').then(function(response) {
		var allLayers = $(response).find('Layer').each(addLayer);
	});
}

function addLayer(idx){
		console.log(this);
		var name = $(this).find('Title').text();
		var matrixSet = $(this).find('TileMatrixSetLink').text();
}