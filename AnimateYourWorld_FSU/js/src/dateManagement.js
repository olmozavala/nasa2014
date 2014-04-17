
var dateRanges = new Array;

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

	$("#clearRanges").click(clearDateRanges);

	$("#datepicker").datepicker({
		dateFormat:'yy-mm-dd',
		changeMonth: true,
		changeYear: true,
		maxDate: "+d"
	});

	var yesterday = new Date(); 
	yesterday.setDate(yesterday.getDate() - 1);

	$("#datepicker").val($.datepicker.formatDate('yy-mm-dd', yesterday));
	$("#datepicker").change(updateLayerDate);
	
	$( "#from" ).datepicker({
		dateFormat: 'yy-mm-dd',
		defaultDate: "-1d",
		changeMonth: true,
		numberOfMonths: 1,
		changeYear: true,
		maxDate: "-1d",
		onClose: function( selectedDate ) {
			$( "#to" ).datepicker( "option", "minDate", selectedDate );
		}
    });
    $( "#to" ).datepicker({
		dateFormat: 'yy-mm-dd',
		defaultDate: "+d",
		maxDate: "+d",
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 1,
		onClose: function( selectedDate ) {
			$( "#from" ).datepicker( "option", "maxDate", selectedDate );
		}
    });
}

function addDateRange(){

	var startInput = $("#from");
	var endInput = $("#to");
	var startdate = startInput.val();
	var enddate = endInput.val();
	
	var startGrp = $("#grpDateFrom"); 
	var endGrp = $("#grpDateTo"); 
	
	//Verify if the user has selected start and end dates
	var startClass = startdate? "has-success":"has-error";
	var endClass = enddate? "has-success":"has-error";
	
	// Remove classes from the form   groups
	startGrp.removeClass("has-success has-error");
	endGrp.removeClass("has-success has-error");
	
	//Adds the correct classes to the inputs
	startGrp.addClass(startClass);
	endGrp.addClass(endClass);
	
	if(startdate && enddate){
		var startDateStr = startdate.split("-");
		var endDateStr = enddate.split("-");

		var d1 = new Date(startDateStr[0],startDateStr[1],startDateStr[2]);
		var d2 = new Date(endDateStr[0],endDateStr[1],endDateStr[2]);
		
		var n1 = d1.getTime();
		var n2 = d2.getTime();
		var totaldays = (n2-n1+1)/86400000;
		
		var c1 = new Date(0);
		selectedYear = parseInt($("#selectedYear").val());	
		var yyyy = d2.getFullYear();
		
		if(selectedYear > yyyy){
			selectedYear = yyyy;
		}

		for(var j = 0;j <= (yyyy-selectedYear);j++){
			currentDate  =  n1;
			var partdatelist = new Array;
			for(i = 0;i<=totaldays;i++){
				c1.setTime(currentDate);
				var dd = ("0" + c1.getDate() ).slice(-2);
				var mm = ("0" + (c1.getMonth() )).slice(-2);
				
				partdatelist[i] = (yyyy-(yyyy-selectedYear)+j)+"-"+mm+"-"+dd;	
				currentDate+=86400000;
			}
			dateRanges = dateRanges.concat(partdatelist);
			
			var tempStart = (selectedYear+j)+"/"+d1.getMonth()+"/"+d1.getDate();
			var tempEnd = (selectedYear+j)+"/"+d2.getMonth()+"/"+d2.getDate();
			addDateRangeText(tempStart,tempEnd);
		}	
		//	console.log(dateRanges);
			
		// Remove classes from the form   groups
		startGrp.removeClass("has-success has-error");
		endGrp.removeClass("has-success has-error");

		startInput.val("");
		endInput.val("");
	}
	
}

function clearDateRanges(){
	dateRanges = new Array;

	var selectedRanges = $("#selectedRanges");
	selectedRanges.hide();

	var list = $("#selectedRangesTexts");
	list.empty();

	$("#btnAnimContainer").hide();
}

function addDateRangeText(from,to){
	var selectedRanges = $("#selectedRanges");
	
	if(!selectedRanges.is(':visible')){
		selectedRanges.show();
	}

	$("#btnAnimContainer").show();
	
	var list = $("#selectedRangesTexts");
	list.append("<li>"+from+" -- "+to+"</li>") 
	
}