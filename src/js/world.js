function World(canvas){
	this.canvas = canvas;
	this.backgroundColor = "#000";
	this.dotColorShown = "#fff";
	this.dotColorHidden = "#000";
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
	switch(this.state) {
		case World.STATE_GAME:
			if(this.misclicktimer > 0) {
				this.misclicktimer -= gameTime.time;
			}

			if (Input.IS_MOUSE_DOWN) {
				this.misclicktimer = 3;
			}

			for (var idx in this.randomRects) {
				rect = this.randomRects[idx];
				
				if(rect.type == "special") {
					rect.time -= gameTime.time;

					if(rect.time <= 0) {
						this.randomRects.splice(idx, 1);
						break;
					}
				}
				if((this.lastMousePos == null && Collision.collidesWithPoint(Input.MousePosition, rect)) || 
			   	   (this.lastMousePos != null && Collision.collidesWithLine([this.lastMousePos, Input.MousePosition], rect))) {
					this.randomRects.splice(idx, 1);

					if (!this.firstHit) {
						this.dotRect.width 	= 20;
						this.dotRect.height = 20;
					}

					this.firstHit = true;
					
					if (rect.type == "normal") {
						this.points++;
						this.gameTime += 0.5;
					} else if (rect.type == "special") {
						this.points += 2;
						this.gameTime += 1.5;
					}
					break;
				}
			}

			this.lastMousePos = Input.MousePosition.clone();

			if (this.firstHit) {
				this.gameTime -= gameTime.time;

				if(this.gameTime < 0) {
					this.gameTime = 0;
				}

				var tmp = new Vector(Input.MousePosition.x - this.dotRect.width / 2, Input.MousePosition.y - this.dotRect.height / 2);
				var diff = tmp.subtract(this.dotRect.pos);
				var force = diff.multiply(this.diffScale);
				var accelSecs = force.multiply(gameTime.time);
				this.dotRect.pos = this.dotRect.pos.add(accelSecs.divide(2).multiply(gameTime.time));
			}

			if(this.gameTime <= 0 ||
			   Collision.collidesWithPoint(Input.MousePosition, this.dotRect)) {
				if (this.points > this.highscore) {
					this.saveHighscore();
				}
				this.saveScore();
				this.state = World.STATE_GAME_OVER;
			}

			if(this.randomRects.length == 0) {
				this.randomRects = this.generateRandomRects(this.canvas, this.totalRects);
			}
			break;
		case World.STATE_GAME_OVER:
			if (Input.KeysDown[Input.ENTER]) {
				this.resetGame();
			}
			break;
	}

	this.blinkTimer -= gameTime.time;
	if (this.blinkTimer < -this.blinkTimerSize) {
		this.blinkTimer = this.blinkTimerSize;
	}
};

World.prototype.draw = function(context) {
	context.fillStyle = this.backgroundColor;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);

	switch(this.state){
		case World.STATE_GAME_OVER:
			context.fillStyle = "#fff";
			context.font = "12px Courier";
			txt = "Game Over. Press ENTER to try again.";
			size = context.measureText(txt);
			context.fillText(txt, this.canvas.width / 2 - size.width / 2, this.canvas.height / 2 - 10);
		case World.STATE_GAME:
			if(!this.firstHit && this.blinkTimer < 0) {
				context.fillStyle = this.dotColorHidden;
			} else {
				context.fillStyle = this.dotColorShown;
			}
			context.fillRect(this.dotRect.pos.x, this.dotRect.pos.y, this.dotRect.width, this.dotRect.height);

			for(var idx in this.randomRects) {
				rect = this.randomRects[idx];
				
				if (this.misclicktimer > 0) {
					context.fillStyle = "#000";
				} else if(rect.type == "special") {
					context.fillStyle = "#A9E175";
				} else {
					context.fillStyle = "#E6DB58";
				}

				context.fillRect(rect.pos.x, rect.pos.y, rect.width, rect.height);
			}

			context.fillStyle = "#fff";
			context.font = "12px Courier";
			context.fillText("> score: " + this.points, 10, 35);

			context.fillText("> time: " + Math.ceil(this.gameTime), 10, 55);

			if (this.highscore > -1) {
				context.fillText("> high score: " + this.highscore, 10, 75);
			}

			context.fillText("> ", 10, 95);
		break;
	}
};

World.prototype.generateRandomRects = function(canvas, totalRects) {
	ret = [];

	for (var i = 0; i < totalRects; i++) {
		ret.push(this.createSquare("normal"));
	}

	if (Math.ceil(Math.random() * 10) >= 10) {
		// 10% chance of generating a special square
		ret.push(this.createSquare("special"));
	}

	return ret;
};

World.prototype.createSquare = function(type){
	return { 
		"pos":new Vector(Math.floor(Math.random() * (canvas.width - 20)), Math.floor(Math.random() * (canvas.height - 20))),
		"width":20,
		"height":20,
		"type":type,
		"time":3
	};
};

World.prototype.resetGame = function() {
	this.diffScale		= 1200;
	this.totalRects 	= 3;
	this.points 		= 0;
	this.highscore 		= -1;
	this.lastMousePos 	= null;
	this.misclicktimer 	= 0;
	this.gameTime 		= 30;
	this.blinkTimerSize	= 0.5;
	this.blinkTimer		= this.blinkTimerSize;
	this.firstHit		= false;

	this.state = World.STATE_GAME;

	this.dotRect = { "pos":new Vector(25, 85), "width":5, "height":12 }

	this.randomRects = this.generateRandomRects(this.canvas, this.totalRects);
	this.loadHighscore();
};