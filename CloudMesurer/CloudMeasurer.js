
function CloudMeasurer(ImageID)
{
    console.log("Cloud const.");
    console.log(ImageID);
    this.rvals = [];
    this.bvals = [];
    this.gvals = [];
    this.ImgSrc = document.getElementById(ImageID).src;
    this.img = new Image();
    this.img.src = this.ImgSrc;
}



CloudMeasurer.prototype.GetHists = function() 
{
    console.log(this.img.src);
    Pixastic.process(this.img, "colorhistogram",{paint:true,returnValue:this});
    document.body.appendChild(this.img);
};

CloudMeasurer.prototype.PrintHists = function()
{
    console.log("Printing rvals");    
    console.log(this.rvals);
  //  hist.gvals; 
  //  hist.bvals; 
};
