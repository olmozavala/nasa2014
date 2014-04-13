
function CloudMeasurer(ImageID)
{
    console.log("Cloud const.");
    console.log(ImageID);
    this.hist = {};
    this.ImgSrc = document.getElementById(ImageID).src;
    this.img = new Image();
    this.img.src = this.ImgSrc;
}


CloudMeasurer.prototype.GetHists = function(PaintHist /*true or false*/) 
{
    console.log(this.img.src);
    console.log(typeof this.hist);
    Pixastic.process(this.img, "colorhistogram", {paint:PaintHist,returnValue:this.hist});

    if (PaintHist)
	// How can I replace the image instead of appending one?
	document.body.appendChild(this.img);
};

CloudMeasurer.prototype.GetCloudPercent = function()
{
    console.log("Printing rvals"); 
    console.log(typeof this.hist); 
    for( var i=0; i<256; i++) 
	console.log(this.hist.rvals[i]);
  //  hist.gvals; 
  //  hist.bvals; 
};
