
function NasaLayer(n, ext, url,mtrx,mres,pro,z,f, dateFrom, dateTo){
	this.name = n;//Name of the layer
	this.extent = ext;// Extend
	this.wmts = url;// Text summarizing projection and resolution
	this.matrix = mtrx;// Matrix of tilesj
	this.maxRes = mres;// Max resolutions
	this.proj = pro;// Projection
	this.zoom = z;// Number of zooms available for the layer
	this.format = f;// Image format jpg or png
	this.from = dateFrom;
	this.to = dateTo;
};

