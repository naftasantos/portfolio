function World(){

};

World.prototype.update = function(gameTime) {
	if(Input.KeysDown[Input.ENTER]) {
		console.log("enter")
	}
};

World.prototype.draw = function(gameTime) {
	
};