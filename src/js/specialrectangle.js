function SpecialRectangle(x, y, width, height) {
	this.pos 	= new Vector(x, y);
	this.width 	= width;
	this.height = height;
	this.time 	= 3;
	this.lastMousePos = null;
	this.misclickTimer = 0;
	this.points = 2;

	this.state 	= GameRectangle.STATE_SHOWING;
};

SpecialRectangle.ColorShown = "#A9E175";
SpecialRectangle.ColorHidden = "#000";

SpecialRectangle.createRectangle = function() {
	return new SpecialRectangle(0, 0, 20, 20);
};

SpecialRectangle.prototype.update = function(gameTime) {
	switch(this.state) {
		case GameRectangle.STATE_SHOWING:
			// no showing animation as for now
			this.state = GameRectangle.STATE_NORMAL;
			break;
		case GameRectangle.STATE_NORMAL:
			this.time -= gameTime.time;

			if(this.time <= 0) {
				this.state = GameRectangle.STATE_DYING;
				// stop processing this block
				break;
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
			this.state = GameRectangle.STATE_DYING;
			break;
		case GameRectangle.STATE_DYING:
			// no dying animation as for now
			this.state = GameRectangle.STATE_DEAD;
			break;
		case GameRectangle.STATE_DEAD:
			break;
	}
};

SpecialRectangle.prototype.draw = function(context) {
	switch(this.state) {
		case GameRectangle.STATE_SHOWING:
			context.fillStyle = SpecialRectangle.ColorShown;
			break;
		case GameRectangle.STATE_DEAD:
		case GameRectangle.STATE_DYING:
		case GameRectangle.STATE_HIT:
		case GameRectangle.STATE_NORMAL:
			if (this.misclickTimer > 0) {
				context.fillStyle = SpecialRectangle.ColorHidden;
			}
			else {
				context.fillStyle = SpecialRectangle.ColorShown;
			}
			break;
	}

	context.fillRect(Math.floor(this.pos.x), Math.floor(this.pos.y), Math.floor(this.width), Math.floor(this.height));
};