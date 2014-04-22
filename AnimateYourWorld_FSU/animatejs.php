<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
		<script src="js/src/animatejs.js" type="text/javascript"></script>
		<script src="js/src/CloudMeasurer.js"></script>
		<script src="js/vendor/jquery-1.11.0.js"></script>
		<script src="js/vendor/pixastic.core.js"></script>
		<script src="js/vendor/actions/colorhistogram.js"></script>
		<script src="js/vendor/actions/desaturate.js"></script>
    </head>
    <body>
        <?php
		$urls = $_POST["urls"];
        ?>

		<script>
			$( document ).ready(function(){
				startAnimation("http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=2&TileRow=3&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=2&TileRow=2&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=3&TileRow=3&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=3&TileRow=2&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=2&TileRow=1&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=2&TileRow=0&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=3&TileRow=1&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=3&TileRow=0&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=4&TileRow=3&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=4&TileRow=2&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=5&TileRow=3&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=5&TileRow=2&TIME=2014-04-01 http://map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?Layer=MODIS_Terra_CorrectedReflectance_TrueColor&style&Style&TileMatrixSet=EPSG4326_250m&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fjpeg&0=1&1=57&TileMatrix=3&TileCol=4&TileRow=1&TIME=2014-04-02"); 
//				startAnimation("<?=$urls; ?>");
				});
		</script>
			
		<canvas id="myCanvas" style="background-color: blue"></canvas>
		<br/>
		<img id="frame" src="" width="40%" height="40%">
		<button type="button" onClick="playimg()">Play</button>
		<button type="button" onClick="pause()">Pause</button>
			
		<button type="button" onClick="playReverse()">Reverse</button>
		<button type="button" onClick="restart()">Restart</button>
			
			
    </body>
</html>
