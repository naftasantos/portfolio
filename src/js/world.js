function World(){
	this.dotRect = { "x":0, "y":0, "width":20, "height":20 }
};

World.prototype.update = function(gameTime) {
	this.dotRect.x = Input.MousePosition.x;
	this.dotRect.y = Input.MousePosition.y;
};

World.prototype.draw = function(context) {
	var halfDotRect = { "x": this.dotRect.x - Math.floor(this.dotRect.width / 2),
						"y": this.dotRect.y - Math.floor(this.dotRect.height / 2), 
						"width": this.dotRect.width,
						"height": this.dotRect.height };

	context.fillStyle = "#000";
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	context.fillStyle = "#fff";
	context.fillRect(halfDotRect.x, halfDotRect.y, halfDotRect.width, halfDotRect.height);
};