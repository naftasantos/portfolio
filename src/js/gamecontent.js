function GameContent(canvas) {
	this.universe = new Universe(canvas)
	this.universe.worlds.push(new World())
};

GameContent.prototype.update = function() {
	this.universe.update();
	
	this.universe.erase();
	this.universe.draw();
};