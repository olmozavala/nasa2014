  maxval=10;
	var slides = new Array;
	for (i=0;i<=maxval;i++){
		slides[i] = ["0000"+i];
	}
	
	index=0;
	timer=0;
	console.log("loaded");


	function playimg(){
	
		timer=setInterval(increment,1000);
		index=index+1;
		
		function increment(){
			if(index>=maxval){
				clearInterval(timer);
			}
			else{
				console.log(slides[index]);
				document.getElementById('frame').src = "images/cloudfree/"+slides[index++]+".png";
			}
		}
	}


	function pause(){
	
		clearInterval(timer);
	
	}
	
	function restart(){
	
		index=0;
		document.getElementById('frame').src = "images/"+slides[index]+".png";
	
	}

	function playReverse(){
	
		console.log(index);
		clearInterval(timer);
		timer=setInterval(decrement,1000);
		index=index-2;
		function decrement(){
				console.log("index=",index);
				document.getElementById('frame').src = "images/"+slides[index--]+".png";
		if(index<0){
				clearInterval(timer);
		}
	}
}
