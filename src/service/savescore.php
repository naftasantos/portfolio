<?php
	$score 	= $_POST['score'];
	$time 	= $_POST['time'];

	$txt = date("d M Y H:i:s")." - ".$score." | ".$time;

	file_put_contents ("scores.txt", $txt, FILE_APPEND);
?>