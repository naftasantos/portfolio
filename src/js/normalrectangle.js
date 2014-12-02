function NormalRectangle(x, y, width, height) {
	this.pos 	= new Vector(x, y);
	this.initialPos = null;
	this.width 	= 0;
	this.height = 0;
	this.size = width;
	this.lastMousePos = null;
	this.misclickTimer = 0;
	this.points = 1;
	this.showAnimationTotalTime = 0.15;
	this.showAnimationTime = this.showAnimationTotalTime;

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