
function NasaLayer(n, ext, url,mtrx,mres,pro,z,f){
	this.name = n;//Name of the layer
	this.extent = ext;// Extend
	this.wmts = url;// Text summarizing projection and resolution
	this.matrix = mtrx;// Matrix of tilesj
	this.maxRes = mres;// Different resolutions
	this.proj = pro;// Projection
	this.zoom = z;// Number of zooms available for the layer
	this.format = f;// Image format jpg or png
};

