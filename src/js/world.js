function World(){
	this.dotRect = { "pos":new Vector(), "width":20, "height":20 }
};

World.DiffScale = 5;

World.prototype.update = function(gameTime) {
	var diff = Input.MousePosition.subtract(this.dotRect.pos);
	var small = diff.multiply(World.DiffScale * gameTime.time);
	this.dotRect.pos = this.dotRect.pos.add(small);
};

World.prototype.draw = function(context) {
	var halfDotRect = { "x": this.dotRect.pos.x - Math.floor(this.dotRect.width / 2),
						"y": this.dotRect.pos.y - Math.floor(this.dotRect.height / 2), 
						"width": this.dotRect.width,
						"height": this.dotRect.height };

	context.fillStyle = "#000";
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	context.fillStyle = "#fff";
	context.fillRect(halfDotRect.x, halfDotRect.y, halfDotRect.width, halfDotRect.height);
};