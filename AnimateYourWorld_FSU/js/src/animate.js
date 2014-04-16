var slides = new Array;
var maxval=0;
var txtFile = new XMLHttpRequest();
txtFile.open("GET", "http://localhost/public_html/numImages.txt", true);
txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4) {  // Makes sure the document is ready to parse.
    if (txtFile.status === 200) {  // Makes sure it's found the file.
      maxval=parseInt(txtFile.responseText)+1;
			console.log("maxval=",maxval);
			for (i=0;i<=maxval+1;i++){
				slides[i] = ["0000"+i];
			}
    }
  }
}

txtFile.send(null);

	console.log("outside:maxval=",maxval);
	
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
				console.log(index);
				document.getElementById('frame').src = "images/cloudfree/"+slides[index++]+".png";
			}
		}
	}


	function pause(){
	
		clearInterval(timer);
	
	}
	
	function restart(){
	
		index=1;
		document.getElementById('frame').src = "images/"+slides[index]+".png";
	
	}

	function playReverse(){
	
		console.log(index);
		clearInterval(timer);
		timer=setInterval(decrement,1000);
		index=index-1;
		function decrement(){
				console.log("index=",index);
				document.getElementById('frame').src = "images/"+slides[index--]+".png";
		if(index<=0){
				clearInterval(timer);
		}
	}
}
