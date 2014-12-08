function FollowerRectangle(x, y, width, height) {
	this.pos 			= new Vector(x, y);
	this.width 			= width;
	this.height 		= height;
	this.lastMousePos 	= null;
	this.misclickTimer 	= 0;
	this.forceSize 		= 80000;
	this.blinkTimerSize	= 0.5;
	this.blinkTimer		= this.blinkTimerSize;

	this.state = GameRectangle.STATE_SHOWING;
};

FollowerRectangle.ColorShown = "#fff";
FollowerRectangle.ColorHidden = "#000";

FollowerRectangle.createRectangle = function() {
	return new FollowerRectangle(25, 65, 5, 12);
};

FollowerRectangle.prototype.update = function(gameTime) {
	switch(this.state) {
		case GameRectangle.STATE_SHOWING:
			this.blinkTimer -= gameTime.time;

			if (this.blinkTimer < -this.blinkTimerSize) {
				this.blinkTimer = this.blinkTimerSize;
			}
			break;
		case GameRectangle.STATE_NORMAL:
			this.width 	= 20;
			this.height = 20;
			var tmp = new Vector(Input.MousePosition.x - this.width / 2, 
				Input.MousePosition.y - this.height / 2);

			var diff = tmp.subtract(this.pos);
			//var force = diff.multiply(this.forceSize);
			var force = diff.unit().multiply(this.forceSize);
			var accelSecs = force.multiply(gameTime.time);
			this.pos = this.pos.add(accelSecs.divide(2).multiply(gameTime.time));
			//this.pos = this.pos.add(force);

			if(this.misclickTimer > 0) {
				this.misclickTimer -= gameTime.time;
			}

			if (Input.IS_MOUSE_DOWN) {
				this.misclickTimer = GameRectangle.MisclickTimer;
			}

			if ((this.lastMousePos == null && Collision.collidesWithPoint(Input.MousePosition, this)) || 
			    (this.lastMousePos != null && Collision.collidesWithLine([this.lastMousePos, Input.MousePosition], this))){
				this.state = GameRectangle.STATE_HIT;
			}

			this.lastMousePos = Input.MousePosition.clone();

			break;
		case GameRectangle.STATE_HIT:
			// this state will remain just for one frame, so that the world
			// can count the points
			this.state = FollowerRectangle.STATE_DYING;
			break;
		case GameRectangle.STATE_DYING:
			// no dying animation as for now
			this.state = FollowerRectangle.STATE_DEAD;
			break;
		case GameRectangle.STATE_DEAD:
			break;
	}
};

FollowerRectangle.prototype.draw = function(context) {
	switch(this.state) {
		case GameRectangle.STATE_SHOWING:
			if(this.blinkTimer < 0) {
				context.fillStyle = FollowerRectangle.ColorHidden;
			} else {
				context.fillStyle = FollowerRectangle.ColorShown;
			}
			break;
		case GameRectangle.STATE_DEAD:
		case GameRectangle.STATE_DYING:
		case GameRectangle.STATE_HIT:
		case GameRectangle.STATE_NORMAL:
			if (this.misclickTimer > 0) {
				context.fillStyle = FollowerRectangle.ColorHidden;
			} else {
				context.fillStyle = FollowerRectangle.ColorShown;
			}
			break;
	}

	context.fillRect(Math.floor(this.pos.x), Math.floor(this.pos.y), Math.floor(this.width), Math.floor(this.height));
};