
function EdgeFinder(){
    CurrentImg = new Image();
    
    for (var i=0;i<2;i++) {
	console.log("URLImage"+i);
	CurrentImg.src = document.getElementById("URLImage"+i);
	Pixastic.process(CurrentImg, "edges", {mono:true,invert:false});
    }

    <script>
    var actions = [
    	'blur','desaturate','edges','edges2',
    	'emboss','flip','fliph','flipv','invert',
    	'iaplace','sepia','solarize'
    ]
	var imgSrc= document.getElementById('img').src
	for (i in actions){
		var img = new Image();	
		var title=document.createElement('h2');
		title.innerHTML=actions[i];
		document.body.appendChild(title);	
		document.body.appendChild(img);	
		img.src=imgSrc;
		Pixastic.process(img, actions[i]);
	}
    </script>

}
