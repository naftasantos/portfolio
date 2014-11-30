function World(canvas){
	this.canvas = canvas;
	this.backgroundColor = "#000";
	this.textColor = "#fff";
	this.textFont = "12px Courier";
	this.fps = 0;
	this.highscore = -1;
	this.resetGame();
};

World.STATE_GAME 		= "WORLD_StateGame";
World.STATE_GAME_OVER	= "WORLD_StateGameOver";

World.prototype.loadHighscore = function() {
	var that = this;

	$.ajax({
		url: 'service/gethighscore.php',
		type: 'GET'
	})
	.done(function(evt){
		that.highscore = parseInt(evt);
	});
};

World.prototype.saveHighscore = function() {
	var that = this;

	$.ajax({
		url: 'service/savehighscore.php',
		type: 'POST',
		data: {'score':this.points},
		success: function (data) {
			that.loadHighscore();
		}
	});
};

World.prototype.saveScore = function() {
	var that = this;

	$.ajax({
		url: 'service/savescore.php',
		type: 'POST',
		data: {'score':this.points, 'time':this.gameTime},
		success: function (data) {
			//
		}
	});
}

World.prototype.highscoreReceived = function(highscore) {
	this.highscore = parseInt(highscore);
};

World.prototype.update = function(gameTime) {
	this.fps = gameTime.fps;

	switch(this.state) {
		case World.STATE_GAME:
			this.dotRect.update(gameTime);

			if (this.dotRect.state == GameRectangle.STATE_HIT) {
				this.state = World.STATE_GAME_OVER;
				break;
			}

			for(var idx in this.randomRects) {
				var rect = this.randomRects[idx];
				rect.update(gameTime);

				if (rect.state == GameRectangle.STATE_HIT) {
					this.gameTime += rect.timeAdd;
					this.points += rect.points;

					if (!this.firstHit) {
						this.dotRect.state = GameRectangle.STATE_NORMAL;
						this.firstHit = true;
					}
				} else if (rect.state == GameRectangle.STATE_DEAD) {
					this.randomRects.splice(idx, 1);
					break;
				}
			}

			if(this.randomRects.length == 0) {
				this.randomRects = GameRectangle.createRandomRects(this.totalRects, this.canvas);
			}
			break;
		case World.STATE_GAME_OVER:
			if (Input.KeysDown[Input.ENTER]) {
				this.resetGame();
			}
			break;
	}
};

World.prototype.draw = function(context) {
	context.fillStyle = this.backgroundColor;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);

	switch(this.state){
		case World.STATE_GAME_OVER:
			context.fillStyle 	= this.textColor;
			context.font 		= this.textFont;

			txt = "Game Over. Press ENTER to try again.";
			size = context.measureText(txt);
			context.fillText(txt, Math.floor(this.canvas.width / 2 - size.width / 2), Math.floor(this.canvas.height / 2 - 10));
		case World.STATE_GAME:
			this.dotRect.draw(context);

			for(var idx in this.randomRects) {
				rect = this.randomRects[idx];
				rect.draw(context);
			}

			context.fillStyle 	= this.textColor;
			context.font 		= this.textFont;
			context.fillText("> score: " + this.points, 10, 35);

			context.fillText("> time: " + Math.ceil(this.gameTime), 10, 55);

			if (this.highscore > -1) {
				context.fillText("> high score: " + this.highscore, 10, 75);
			}

			context.fillText("> ", 10, 95);
		break;
	}

	context.fillStyle 	= this.textColor;
	context.font 		= this.textFont;

	context.fillText("> fps: " + this.fps, 10, 15);
};

World.prototype.resetGame = function() {
	this.totalRects 	= 3;
	this.points 		= 0;
	this.misclicktimer 	= 0;
	this.gameTime 		= 30;
	this.firstHit		= false;

	this.state 			= World.STATE_GAME;
	this.dotRect 		= GameRectangle.createFollowerRect();
	this.randomRects 	= GameRectangle.createRandomRects(this.totalRects, this.canvas);

	this.loadHighscore();
};