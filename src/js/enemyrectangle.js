function EnemyRectangle(x, y, width, height, canvas) {
	this.pos 			= new Vector(x, y);
	this.width 			= width;
	this.height 		= height;
	this.lastMousePos 	= null;
	this.misclickTimer 	= 0;
	this.forceSize 		= 6000;
	this.mass			= 1;
	this.direction		= new Vector();
	this.canvas			= canvas;

	this.state = GameRectangle.STATE_SHOWING;
};

EnemyRectangle.ColorShown = "#FF0000";
EnemyRectangle.ColorHidden = "#000";

EnemyRectangle.createRandomRectangle = function(canvas) {
	var pos = new Vector(0, 0);
	var size = new Vector(10, 10);

	if (Math.round(Math.random()) % 2) {
		pos.x = canvas.width;
		pos.y = Math.random() * canvas.width - size.x;
	} else {
		pos.x = Math.random() * canvas.height - size.y;
		pos.y = canvas.height;
	}

	var ret = new EnemyRectangle(pos.x, pos.y, size.x, size.y, canvas);

	ret.direction = new Vector(canvas.width / 2, canvas.height / 2).subtract(ret.pos).unit();
	return ret;
};

EnemyRectangle.prototype.update = function(gameTime) {
	switch(this.state) {
		case GameRectangle.STATE_SHOWING:
			// no showing animation as for now
			this.state = GameRectangle.STATE_NORMAL;
			break;
		case GameRectangle.STATE_NORMAL:
			var force = this.direction.multiply(this.forceSize);
			var accelSecs = force.divide(this.mass).multiply(gameTime.time);
			this.pos = this.pos.add(accelSecs.divide(2).multiply(gameTime.time));

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

			var bounds = { "x":-this.width, "y":-this.height, "height":canvas.height + this.height, "width":canvas.width + this.width };

			if (this.pos.x > bounds.width || this.pos.x < bounds.x ||
				this.pos.y > bounds.height || this.pos.y < bounds.y) {
				this.state = GameRectangle.STATE_DEAD;
			}

			break;
		case GameRectangle.STATE_HIT:
			// this state will remain just for one frame, so that the world
			// can count the points
			this.state = EnemyRectangle.STATE_DYING;
			break;
		case GameRectangle.STATE_DYING:
			// no dying animation as for now
			this.state = EnemyRectangle.STATE_DEAD;
			break;
		case GameRectangle.STATE_DEAD:
			break;
	}
};

EnemyRectangle.prototype.draw = function(context) {
	switch(this.state) {
		case GameRectangle.STATE_SHOWING:
			context.fillStyle = EnemyRectangle.ColorShown;
			break;
		case GameRectangle.STATE_DEAD:
		case GameRectangle.STATE_DYING:
		case GameRectangle.STATE_HIT:
		case GameRectangle.STATE_NORMAL:
			if (this.misclickTimer > 0) {
				context.fillStyle = EnemyRectangle.ColorHidden;
			} else {
				context.fillStyle = EnemyRectangle.ColorShown;
			}
			break;
	}

	context.fillRect(Math.floor(this.pos.x), Math.floor(this.pos.y), Math.floor(this.width), Math.floor(this.height));
};