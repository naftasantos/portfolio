<?php
	$score = intval($_POST['score']);
	$saved = intval(file_get_contents("highscore.txt"));

	if ($score > $saved) {
		file_put_contents ("highscore.txt", $score);
	}
?>