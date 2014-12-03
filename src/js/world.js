function World(canvas){
	this.canvas = canvas;
	this.backgroundColor = "#000";
	this.textColor = "#fff";
	this.textFont = "12px Courier";
	this.fps = 0;
	this.highscore = -1;
	this.wasMouseDown = false;
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
		data: {'score':this.points},
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
			//this.dotRect.update(gameTime);

			if (this.dotRect.state == GameRectangle.STATE_HIT) {
				this.gameOver();
				break;
			}

			for(var idx in this.randomRects) {
				var rect = this.randomRects[idx];
				rect.update(gameTime);

				if (rect.state == GameRectangle.STATE_HIT) {
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

			if (this.firstHit) {
				this.enemyTimeoutCounter -= gameTime.time;

				if(this.enemyTimeoutCounter <= 0) {
					this.enemies.push(EnemyRectangle.createRandomRectangle(this.canvas));
					this.enemyTimeoutCounter = this.randomEnemyTimeout();
				}
			}

			for (var idx in this.enemies) {
				var enemy = this.enemies[idx];
				enemy.update(gameTime);

				if(enemy.state == GameRectangle.STATE_HIT) {
					this.gameOver();
					break;
				} else if (enemy.state == GameRectangle.STATE_DEAD) {
					this.enemies.splice(idx, 1);
					break;
				} else if (enemy.state == GameRectangle.STATE_NORMAL) {
					if (Collision.collidesWithRect(enemy, this.dotRect)) {
						enemy.state = GameRectangle.STATE_DYING;
						break;
					}

					for (var x in this.randomRects){
						tmpRect = this.randomRects[x];

						if(Collision.collidesWithRect(enemy, tmpRect)) {
							tmpRect.state = GameRectangle.STATE_DYING;
							var reflection = Collision.getReflection(tmpRect, enemy, enemy.direction);

							if (reflection != null) {
								enemy.direction = reflection;
							}
						}
					}
				}
			}

			if(this.randomRects.length == 0) {
				this.randomRects = GameRectangle.createRandomRects(this.totalRects, this.canvas);
			}
			break;
		case World.STATE_GAME_OVER:
			if (Input.KeysDown[Input.ENTER]) {
				this.resetGame();
			} else if (this.wasMouseDown && !Input.IS_MOUSE_DOWN) {
				this.resetGame();
			}

			this.wasMouseDown = Input.IS_MOUSE_DOWN;
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

			txt = "Game Over. Press ENTER or CLICK to try again.";
			size = context.measureText(txt);
			context.fillText(txt, Math.floor(this.canvas.width / 2 - size.width / 2), Math.floor(this.canvas.height / 2 - 10));
		case World.STATE_GAME:
			this.dotRect.draw(context);

			for(var idx in this.randomRects) {
				rect = this.randomRects[idx];
				rect.draw(context);
			}

			for (var idx in this.enemies) {
				var enemy = this.enemies[idx];
				enemy.draw(context);
			}

			context.fillStyle 	= this.textColor;
			context.font 		= this.textFont;
			context.fillText("> score: " + this.points, 10, 35);

			if (this.highscore > -1) {
				context.fillText("> high score: " + this.highscore, 10, 55);
			}

			context.fillText("> ", 10, 75);
		break;
	}

	context.fillStyle 	= this.textColor;
	context.font 		= this.textFont;

	context.fillText("> fps: " + this.fps, 10, 15);
};

World.prototype.gameOver = function() {
	this.saveScore();

	if (this.points > this.highscore) {
		this.saveHighscore();
	}

	this.state = World.STATE_GAME_OVER;
}

World.prototype.resetGame = function() {
	this.totalRects 	= 3;
	this.points 		= 0;
	this.misclicktimer 	= 0;
	this.firstHit		= false;
	this.enemyTimeoutCounter = this.randomEnemyTimeout();

	this.state 			= World.STATE_GAME;
	this.dotRect 		= FollowerRectangle.createRectangle();
	this.randomRects 	= GameRectangle.createRandomRects(this.totalRects, this.canvas);
	this.enemies		= [];

	this.loadHighscore();
};

World.prototype.randomEnemyTimeout = function(){
	// from 1 to 5 seconds
	return Math.ceil(Math.random() * 5);
};