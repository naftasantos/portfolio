function NormalRectangle(x, y, width, height) {
	this.pos 	= new Vector(x, y);
	this.width 	= width;
	this.height = height;
	this.lastMousePos = null;
	this.misclickTimer = 0;
	this.points = 1;

	this.state = GameRectangle.STATE_SHOWING;
};

NormalRectangle.ColorShown = "#E6DB58";
NormalRectangle.ColorHidden = "#000";

NormalRectangle.createRectangle = function() {
	return new NormalRectangle(0, 0, 20, 20);
};

NormalRectangle.prototype.update = function(gameTime) {
	switch(this.state) {
		case GameRectangle.STATE_SHOWING:
			// no showing animation as for now
			this.state = GameRectangle.STATE_NORMAL;
			break;
		case GameRectangle.STATE_NORMAL:
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

NormalRectangle.prototype.draw = function(context) {
	switch(this.state) {
		case GameRectangle.STATE_SHOWING:
			context.fillStyle = NormalRectangle.ColorShown;
			break;
		case GameRectangle.STATE_DEAD:
		case GameRectangle.STATE_DYING:
		case GameRectangle.STATE_HIT:
		case GameRectangle.STATE_NORMAL:
			if (this.misclickTimer > 0) {
				context.fillStyle = NormalRectangle.ColorHidden;
			} else {
				context.fillStyle = NormalRectangle.ColorShown;
			}
			break;
	}

	context.fillRect(Math.floor(this.pos.x), Math.floor(this.pos.y), Math.floor(this.width), Math.floor(this.height));
};