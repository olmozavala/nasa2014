
function EdgeFinder(){
    CurrentImg = new Image();
    
    for (var i=0;i<2;i++) {
	console.log("URLImage"+i);
	CurrentImg.src = document.getElementById("URLImage"+i);
	Pixastic.process(CurrentImg, "edges", {mono:true,invert:false});
    }
}
