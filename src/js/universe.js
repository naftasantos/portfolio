function Universe(canvas){
	this.canvas = canvas;
	this.context = canvas.getContext('2d');

	this.timing = {
		lastTimer: 0,
		currentTimer: 0,
		time: 0,
		fps: 60,
		frameCounter: 0,
		timeCounter: 0
	};

	this.timing.lastTimer = new Date().getTime();
	this.timing.currentTimer = this.timing.lastTimer;
};

Universe.prototype.update = function() {
	var gameTime = { time: 0, fps: 0 };
	this.calculateTime();

	gameTime.fps = this.timing.fps;
	gameTime.time = this.timing.time;
};

Universe.prototype.erase = function() {

};

Universe.prototype.draw = function() {

};

Universe.prototype.calculateTime = function() {
	this.timing.currentTimer = new Date().getTime();
	this.timing.time = this.timing.currentTimer - this.timing.lastTimer;
	this.timing.lastTimer = this.timing.currentTimer;
	this.timing.timeCounter += this.timing.time;
	this.timing.frameCounter++;

	if(this.timing.timeCounter >= 1000){ // one second
		this.timing.timeCounter = 0;
		this.timing.fps = this.timing.frameCounter;
		this.timing.frameCounter = 0;
	}
};