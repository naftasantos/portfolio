function World(canvas){
	this.canvas = canvas;

	this.resetGame();
};

World.prototype.loadHighscore = function() {
	var that = this;

	$.ajax({
		url: 'service/gethighscore.php',
		type: 'GET'
	})
	.done(function(evt){
		that.highscore = parseInt(evt);
	});
}

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
}

World.prototype.highscoreReceived = function(highscore) {
	this.highscore = parseInt(highscore);
}

World.prototype.update = function(gameTime) {

	for (var idx in this.randomRects) {
		rect = this.randomRects[idx];
		if (Collision.collidesWithPoint(Input.MousePosition, rect)) {
			this.randomRects.splice(idx, 1);
			this.points++;
			break;
		}
	}

	var diff = Input.MousePosition.subtract(this.dotRect.pos);
	var small = diff.multiply(this.diffScale * gameTime.time);
	this.dotRect.pos = this.dotRect.pos.add(small);

	if(Collision.collidesWithPoint(Input.MousePosition, this.dotRect)) {
		if (this.points > this.highscore) {
			this.saveHighscore();
		}
		this.resetGame();
	}

	if(this.randomRects.length == 0) {
		this.randomRects = World.generateRandomRects(this.canvas, this.totalRects);
		this.diffScale *= 1.5;
	}
};

World.prototype.draw = function(context) {
	var halfDotRect = { "x": Math.floor(this.dotRect.pos.x - (this.dotRect.width / 2)),
						"y": Math.floor(this.dotRect.pos.y - (this.dotRect.height / 2)), 
						"width": this.dotRect.width,
						"height": this.dotRect.height };

	context.fillStyle = "#000";
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	context.fillStyle = "#fff";
	context.fillRect(halfDotRect.x, halfDotRect.y, halfDotRect.width, halfDotRect.height);

	context.fillStyle = "#E6DB58";
	
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
}

World.prototype.resetGame = function() {
	this.diffScale	= 1;
	this.totalRects = 5;
	this.points 	= 0;
	this.highscore 	= -1;

	this.dotRect = { "pos":new Vector(), "width":20, "height":20 }

	this.randomRects = World.generateRandomRects(this.canvas, this.totalRects);
	this.loadHighscore();
}