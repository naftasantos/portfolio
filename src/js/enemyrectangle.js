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
	this.force 			= new Vector();

	this.state = GameRectangle.STATE_SHOWING;
};

EnemyRectangle.ColorShown = "#FF0000";
EnemyRectangle.ColorHidden = "#000";

EnemyRectangle.createRandomRectangle = function(canvas) {
	var pos = new Vector(0, 0);
	var size = new Vector(10, 10);

	var rand = Math.round(Math.random() * 3);
	
	switch(rand){
		case 0:
			// left
			pos.x = -size.x;
			pos.y = Math.random() * canvas.height - size.x;
			break;
		case 1:
			// right
			pos.x = canvas.width;
			pos.y = Math.random() * canvas.height - size.x;
			break;
		case 2:
			// top
			pos.x = Math.random() * canvas.width - size.x;
			pos.y = -size.y;
			break;
		case 3:
			// bottom
			pos.x = Math.random() * canvas.width - size.x;
			pos.y = canvas.height;
			break;
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
			this.force = this.direction.multiply(this.forceSize);
			var accelSecs = this.force.divide(this.mass).multiply(gameTime.time);
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

	/*context.beginPath();
	context.moveTo(Math.floor(this.pos.x) + Math.floor(this.width / 2), Math.floor(this.pos.y) + Math.floor(this.height / 2));
	context.lineTo(Math.floor(this.pos.x + this.force.x), Math.floor(this.pos.y + this.force.y));
	context.strokeStyle = "#E6DB58";
	context.stroke();*/
};