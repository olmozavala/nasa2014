/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function initGui(){
	initBaseLayers();
	initDatePickers();

	resizeMaps();

	$("#addRange").click(addDateRange);
	$("#makeAnimation").click(makeAnimation);
}

function resizeMaps(){
	var vpw = $(window).width();
	var vph = $(window).height();
	
	//	$("#mainMap").css({'width':vpw+'px'});
//	var mapHeight = Math.ceil(vph/2); 
//	var mapHeight = vph;
	var mapHeight = 400;
	$("#mainMap").css({'height':mapHeight+'px'});
	
	var o_map_northpole= $("#northpoleMap");
	var o_map_antarctica = $("#antarcticaMap");
}



function updateAvailableTimes(){

}
