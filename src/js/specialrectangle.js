function SpecialRectangle(x, y, width, height) {
	this.pos 	= new Vector(x, y);
	this.initialPos = null;
	this.width 	= 0;
	this.height = 0;
	this.size 	= width;
	this.time 	= 3;
	this.lastMousePos = null;
	this.misclickTimer = 0;
	this.points = 5;
	this.showAnimationTotalTime = 0.15;
	this.showAnimationTime = this.showAnimationTotalTime;

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
			if (this.initialPos == null) {
				this.initialPos = this.pos.clone();
			}

			this.showAnimationTime -= gameTime.time;
			size = this.size * (1 - (this.showAnimationTime / this.showAnimationTotalTime));
			this.pos.x = this.initialPos.x - size / 2;
			this.pos.y = this.initialPos.y - size / 2;
			this.width = Math.ceil(size);
			this.height = Math.ceil(size);

			if (this.showAnimationTime <= 0) {
				this.state = GameRectangle.STATE_NORMAL;
				this.width 	= this.size;
				this.height = this.size;
				this.showAnimationTime = this.showAnimationTotalTime;
			}
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
			this.showAnimationTime -= gameTime.time;
			size = this.size * (this.showAnimationTime / this.showAnimationTotalTime);
			this.pos.x = this.initialPos.x - size / 2;
			this.pos.y = this.initialPos.y - size / 2;
			this.width = Math.ceil(size);
			this.height = Math.ceil(size);

			if (this.showAnimationTime <= 0) {
				this.state = GameRectangle.STATE_DEAD;
				this.width 	= this.size;
				this.height = this.size;
				this.initialPos = null;
				this.showAnimationTime = this.showAnimationTotalTime;
			}			
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