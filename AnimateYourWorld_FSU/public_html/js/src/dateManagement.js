/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function refreshMap(){
//	(ol3_layers[currentLayer].getSource()).updateDimensions(nasa_layers[currentLayer].resolutions);
	var randNumber = Math.floor((Math.random()*100)+1);
	(ol3_layers[currentLayer].getSource()).updateDimensions([1,randNumber]);
}

function updateLayerDate(){
	var newDate = $("#datepicker").val();
	
	var tempLayer= ol3_layers[currentLayer];
	
	var layerSource = tempLayer.getSource();
	
	var superTileUrlFunction = layerSource.tileUrlFunction;

//	console.log(layerSource.getDimensions());
	refreshMap();
	
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
			} };
		
}

function initDatePickers(){

	$("#datepicker").datepicker({
				dateFormat:'yy-mm-dd',
				changeMonth: true,
				changeYear: true
				});
	$("#datepicker").val($.datepicker.formatDate('yy-mm-dd', new Date()));
	$("#datepicker").change(updateLayerDate);
	
	$( "#from" ).datepicker({
		dateFormat: 'yy-mm-dd',
		defaultDate: "-1w",
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 1,
		onClose: function( selectedDate ) {
			$( "#to" ).datepicker( "option", "minDate", selectedDate );
		}
    });
    $( "#to" ).datepicker({
		dateFormat: 'yy-mm-dd',
		defaultDate: "-1w",
		changeYear: true,
		changeMonth: true,
		numberOfMonths: 1,
		onClose: function( selectedDate ) {
			$( "#from" ).datepicker( "option", "maxDate", selectedDate );
		}
    });
}

function addDateRange(){
	var daterange=new Array;
	startdate=$("#from").val();
	enddate=$("#to").val();
	var d1=new Date(startdate.substring(0,4),startdate.substring(5,7)-1,startdate.substring(8,10));
	var d2=new Date(enddate.substring(0,4),enddate.substring(5,7)-1,enddate.substring(8,10));
	
	var n1=d1.getTime();
	var n2=d2.getTime();
	var totaldays=(n2-n1+1)/86400000;
	
	var c1=new Date(0);
	selectyear=$("#selectyear").val();	
	var yyyy=d2.getFullYear();
	
	for(j=0;j<=(yyyy-selectyear);j++){
		console.log("out");
		currentDate=n1;
		var partdatelist=new Array;
		for(i=0;i<=totaldays;i++){
		  c1.setTime(currentDate);
			var dd=("0" + c1.getDate()).slice(-2);
			var mm=("0" + (c1.getMonth() + 1)).slice(-2);
			
			partdatelist[i]=(yyyy-(yyyy-selectyear)+j)+"-"+mm+"-"+dd;	
			currentDate+=86400000;
		}
		daterange=daterange.concat(partdatelist);
	}	
	console.log(daterange);
}
