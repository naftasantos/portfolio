function World(canvas){
	this.canvas = canvas;

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
		type: 'GET',
		data: {'score':this.points},
		success: function (data) {
			that.loadHighscore();
		}
	});
};

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
				if((this.lastMousePos == null && Collision.collidesWithPoint(Input.MousePosition, rect)) || 
			   	   (this.lastMousePos != null && Collision.collidesWithLine([this.lastMousePos, Input.MousePosition], rect))) {
					this.randomRects.splice(idx, 1);
					this.points++;
					break;
				}
			}

			this.lastMousePos = Input.MousePosition.clone();

			var tmp = new Vector(Input.MousePosition.x - this.dotRect.width / 2, Input.MousePosition.y - this.dotRect.height / 2);
			var diff = tmp.subtract(this.dotRect.pos);
			var small = diff.multiply(this.diffScale * gameTime.time);
			this.dotRect.pos = this.dotRect.pos.add(small);

			if(Collision.collidesWithPoint(Input.MousePosition, this.dotRect)) {
				if (this.points > this.highscore) {
					this.saveHighscore();
				}
				this.state = World.STATE_GAME_OVER;
			}

			if(this.randomRects.length == 0) {
				this.randomRects = World.generateRandomRects(this.canvas, this.totalRects);
				this.diffScale *= 1.5;
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
	context.fillStyle = "#000";
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);

	switch(this.state){
		case World.STATE_GAME_OVER:
			context.fillStyle = "#fff";
			context.font = "12px Georgia";
			context.fillText("Game Over. Press ENTER to try again", this.canvas.width / 2 - 100, this.canvas.height / 2 - 10);
		case World.STATE_GAME:
			context.fillStyle = "#fff";
			context.fillRect(this.dotRect.pos.x, this.dotRect.pos.y, this.dotRect.width, this.dotRect.height);

			if (this.misclicktimer > 0) {
				context.fillStyle = "#000";
			} else {
				context.fillStyle = "#E6DB58";
			}
			
			for(var idx in this.randomRects) {
				rect = this.randomRects[idx];
				context.fillRect(rect.pos.x, rect.pos.y, rect.width, rect.height);
			}

			context.fillStyle = "#fff";
			context.font = "12px Georgia";
			context.fillText("score: " + this.points, this.canvas.width - 60, 15);

			if (this.highscore > -1) {
				context.fillText("high score: " + this.highscore, this.canvas.width - 100, 35);
			}
		break;
	}
};

World.generateRandomRects = function(canvas, totalRects) {
	ret = [];

	for (var i = 0; i < totalRects; i++) {
		ret.push({ 
			"pos":new Vector(Math.floor(Math.random() * (canvas.width - 20)), Math.floor(Math.random() * (canvas.height - 20))),
			"width":20,
			"height":20
		});
	}

	return ret;
};

World.prototype.resetGame = function() {
	this.diffScale	= 1;
	this.totalRects = 5;
	this.points 	= 0;
	this.highscore 	= -1;
	this.lastMousePos = null;
	this.misclicktimer = 0;
	
	this.state = World.STATE_GAME;

	this.dotRect = { "pos":new Vector(), "width":20, "height":20 }

	this.randomRects = World.generateRandomRects(this.canvas, this.totalRects);
	this.loadHighscore();
};