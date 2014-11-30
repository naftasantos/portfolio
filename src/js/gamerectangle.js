function GameRectangle(x, y, width, height, type) {
	this.pos 	= new Vector(x, y);
	this.width 	= width;
	this.height = height;
	this.type 	= type;
	this.time 	= 3;
	this.points = 0;
	this.timeAdd = 0;
	this.lastMousePos = null;
	this.misclickTimer = 0;
	this.dotColorShown = "#fff";
	this.dotColorHidden = "#000";
	this.hitBlockColorNormal = "#E6DB58";
	this.hitBlockColorSpecial = "#A9E175";
	this.diffScale = 1200;
	this.blinkTimerSize	= 0.5;
	this.blinkTimer	= this.blinkTimerSize;

	switch(type) {
		case GameRectangle.TYPE_NORMAL:
			this.points = 1;
			this.timeAdd = 0.5;
			break;
		case GameRectangle.TYPE_SPECIAL:
			this.points = 2;
			this.timeAdd = 1.5;
			break;
	}

	this.state 	= GameRectangle.STATE_SHOWING;
};

GameRectangle.TYPE_NORMAL 	= "GameRectangle_TYPE_NORMAL";
GameRectangle.TYPE_SPECIAL 	= "GameRectangle_TYPE_SPECIAL";
GameRectangle.TYPE_FOLLOWER = "GameRectangle_TYPE_FOLLOWER";

GameRectangle.STATE_SHOWING	= "GameRectangle_STATE_SHOWING";
GameRectangle.STATE_NORMAL	= "GameRectangle_STATE_NORMAL";
GameRectangle.STATE_HIT		= "GameRectangle_STATE_HIT";
GameRectangle.STATE_DYING	= "GameRectangle_STATE_DYING";
GameRectangle.STATE_DEAD	= "GameRectangle_STATE_DEAD";

GameRectangle.createRandomRects = function(totalRects, canvas) {
	ret = [];

	for (var i = 0; i < totalRects; i++) {
		var obj = this.createRectangle(GameRectangle.TYPE_NORMAL);
		obj.pos.x = Math.floor(Math.random() * (canvas.width - obj.width));
		obj.pos.y = Math.floor(Math.random() * (canvas.height - obj.height));
		ret.push(obj);
	}

	if (Math.ceil(Math.random() * 10) >= 10) {
		// 10% chance of generating a special square
		var obj = this.createRectangle(GameRectangle.TYPE_SPECIAL);
		obj.pos.x = Math.floor(Math.random() * (canvas.width - obj.width));
		obj.pos.y = Math.floor(Math.random() * (canvas.height - obj.height));
		ret.push(obj);
	}

	return ret;
}

GameRectangle.createRectangle = function(type) {
	return new GameRectangle(0, 0, 20, 20, type);
}

GameRectangle.createFollowerRect = function() {
	return new GameRectangle(25, 85, 5, 12, GameRectangle.TYPE_FOLLOWER);
}

GameRectangle.prototype.update = function(gameTime) {
	switch(this.state) {
		case GameRectangle.STATE_SHOWING:
			if (this.type == GameRectangle.TYPE_FOLLOWER) {
				this.blinkTimer -= gameTime.time;

				if (this.blinkTimer < -this.blinkTimerSize) {
					this.blinkTimer = this.blinkTimerSize;
				}
			} else {
				// no showing animation as for now
				this.state = GameRectangle.STATE_NORMAL;
			}
			break;
		case GameRectangle.STATE_NORMAL:
			// game play state
			if (this.type == GameRectangle.TYPE_FOLLOWER) {
				this.width 	= 20;
				this.height = 20;
				var tmp = new Vector(Input.MousePosition.x - this.width / 2, 
					Input.MousePosition.y - this.height / 2);

				var diff = tmp.subtract(this.pos);
				var force = diff.multiply(this.diffScale);

				var accelSecs = force.multiply(gameTime.time);
				this.pos = this.pos.add(accelSecs.divide(2).multiply(gameTime.time));
			} else if (this.type == GameRectangle.TYPE_SPECIAL) {
				this.time -= gameTime.time;

				if(this.time <= 0) {
					this.state = GameRectangle.STATE_DYING;
					// stop processing this block
					break;
				}
			}

			if(this.misclickTimer > 0) {
				this.misclickTimer -= gameTime.time;
			}

			if (Input.IS_MOUSE_DOWN) {
				this.misclickTimer = 3;
			}

			if ((this.lastMousePos == null && Collision.collidesWithPoint(Input.MousePosition, this)) || 
			    (this.lastMousePos != null && Collision.collidesWithLine([this.lastMousePos, Input.MousePosition], this))){
				this.state = GameRectangle.STATE_HIT;
			}

			this.lastMousePos = Input.MousePosition.clone();

			break;
		case GameRectangle.STATE_HIT:
			if (this.type != GameRectangle.TYPE_FOLLOWER) {
				// this state will remain just for one frame, so that the world
				// can count the points
				this.state = GameRectangle.STATE_DYING;
			}
			break;
		case GameRectangle.STATE_DYING:
			// no dying animation as for now
			this.state = GameRectangle.STATE_DEAD;
			break;
		case GameRectangle.STATE_DEAD:
			break;
	}
}

GameRectangle.prototype.draw = function(context) {
	switch(this.state) {
		case GameRectangle.STATE_SHOWING:
			if (this.type == GameRectangle.TYPE_FOLLOWER) {
				if(this.blinkTimer < 0) {
					context.fillStyle = this.dotColorHidden;
				} else {
					context.fillStyle = this.dotColorShown;
				}
			} else if (this.type == GameRectangle.TYPE_SPECIAL) {
				context.fillStyle = this.hitBlockColorSpecial;
			} else {
				context.fillStyle = this.hitBlockColorNormal;
			}
			break;
		case GameRectangle.STATE_DEAD:
		case GameRectangle.STATE_DYING:
		case GameRectangle.STATE_HIT:
		case GameRectangle.STATE_NORMAL:
			if (this.misclickTimer > 0) {
				context.fillStyle = this.dotColorHidden;
			}
			else if (this.type == GameRectangle.TYPE_FOLLOWER) {
				context.fillStyle = this.dotColorShown;
			} else if (this.type == GameRectangle.TYPE_SPECIAL) {
				context.fillStyle = this.hitBlockColorSpecial;
			} else {
				context.fillStyle = this.hitBlockColorNormal;
			}
			break;
	}

	context.fillRect(Math.floor(this.pos.x), Math.floor(this.pos.y), Math.floor(this.width), Math.floor(this.height));
}