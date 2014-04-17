<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
		<script src="js/src/animate.js" type="text/javascript"></script>

    </head>
    <body>
        <?php

		$urls = htmlspecialchars($_POST["urls"]);
		$totImages = htmlspecialchars($_POST["numImages"]);

//		echo $totImages;
//		echo("Post:" .  $urls);
//		echo("<br>----------------------</br>");

//		echo("<br> ------------------------------------------------------------ <br>");
//		$mystring = system("python makeAnimation.py 'que pex'", $retval);
//		echo("sadfsdf");
		$mystring = system("python url2video.py '".$urls."' 40", $retval);
//		echo("<br>");
//		echo($mystring);
        ?>

		<script>
			startAnimation(<?=$totImages; ?>);
		</script>
		<img id="frame" src="" width="40%" height="40%">
			
		<br />
		<button type="button" onClick="playimg()">Play</button>
		<button type="button" onClick="pause()">Pause</button>
			
		<button type="button" onClick="playReverse()">Reverse</button>
		<button type="button" onClick="restart()">Restart</button>
			
			
    </body>
</html>
