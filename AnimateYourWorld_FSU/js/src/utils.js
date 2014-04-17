/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * This function defines how many zoom layers are available for each type of 
 * matrixset. If other types of matrixset get added then it is necessary
 * to update the list with the new zoom levels 
 * @param {string} matrixSet Contains a string with a summary of the projection
 * and resolution of the layer.
 * @returns {Number} Number of zoom levels
 */
function obtainZoomLevels(matrixSet){
	switch(matrixSet){
		case "EPSG4326_250m":
			return 9;
		case "EPSG4326_500m":
			return 8;
		case "EPSG4326_1km":
			return 7;
		case "EPSG4326_2km":
			return 6;
	}
	return 9; // by default
}