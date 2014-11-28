<?php
	$score 	= $_POST['score'];
	$time 	= $_POST['time'];

	$txt = $_SERVER['REMOTE_ADDR'].": ".gethostbyaddr($_SERVER['REMOTE_ADDR'])." - ".date("d M Y H:i:s").": ".$score." | ".$time."\n";

	file_put_contents ("scores.txt", $txt, FILE_APPEND);
?>