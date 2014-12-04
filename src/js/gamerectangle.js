function GameRectangle() {

};

GameRectangle.TYPE_NORMAL 	= "GameRectangle_TYPE_NORMAL";
GameRectangle.TYPE_SPECIAL 	= "GameRectangle_TYPE_SPECIAL";
GameRectangle.TYPE_FOLLOWER = "GameRectangle_TYPE_FOLLOWER";

GameRectangle.STATE_SHOWING	= "GameRectangle_STATE_SHOWING";
GameRectangle.STATE_NORMAL	= "GameRectangle_STATE_NORMAL";
GameRectangle.STATE_HIT		= "GameRectangle_STATE_HIT";
GameRectangle.STATE_DYING	= "GameRectangle_STATE_DYING";
GameRectangle.STATE_DEAD	= "GameRectangle_STATE_DEAD";

GameRectangle.MisclickTimer = 3;

GameRectangle.createRandomRects = function(totalRects, canvas) {
	ret = [];

	for (var i = 0; i < totalRects; i++) {
		var obj = NormalRectangle.createRectangle();

		obj.pos.x = obj.size + Math.floor(Math.random() * (canvas.width - obj.size * 2));
		obj.pos.y = obj.size + Math.floor(Math.random() * (canvas.height - obj.size * 2));
		//obj.pos.x = canvas.width / 2;
		//obj.pos.y = canvas.height / 2;
		ret.push(obj);
	}

	if (Math.ceil(Math.random() * 10) >= 10) {
		// 10% chance of generating a special square
		var obj = SpecialRectangle.createRectangle();
		obj.pos.x = obj.size + Math.floor(Math.random() * (canvas.width - obj.size * 2));
		obj.pos.y = obj.size + Math.floor(Math.random() * (canvas.height - obj.size * 2));
		ret.push(obj);
	}

	return ret;
};