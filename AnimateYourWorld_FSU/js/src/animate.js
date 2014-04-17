
var slides = new Array;
var maxval=0;

function startAnimation(numImages){
	
	maxval=numImages;
	console.log("maxval=",maxval);
	for (i=0;i<=maxval;i++){
		slides[i] = ["0000"+i];
	}
}
	
index=0;
timer=0;
	
function playimg(){
		
	timer=setInterval(increment,1000);
	index=index+1;
		
	function increment(){
		if(index>=maxval){
			clearInterval(timer);
		}
		else{
			console.log(index);
			document.getElementById('frame').src = "img/cloudfree/"+slides[index++]+".png";
		}
	}
}
	
	
function pause(){
		
	clearInterval(timer);
		
}
	
function restart(){
		
	index=1;
	document.getElementById('frame').src = "img/"+slides[index]+".png";
		
}
	
function playReverse(){
		
	console.log(index);
	clearInterval(timer);
	timer=setInterval(decrement,1000);
	index=index-1;
	function decrement(){
		console.log("index=",index);
		document.getElementById('frame').src = "img/"+slides[index--]+".png";
		if(index<=0){
			clearInterval(timer);
		}
	}
}
