/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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