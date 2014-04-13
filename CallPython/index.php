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
    </head>
    <body>
        <?php
		$urls = $_POST['urls'];
		echo($urls);
		echo("<br> ------------------------------------------------------------ <br>");
//		$mystring = system("python makeAnimation.py 'que pex'", $retval);
		$mystring = system("python makeAnimation.py '".$urls."'", $retval);
		echo("<br>");
		echo($mystring);
        ?>
    </body>
</html>
