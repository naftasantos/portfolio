function Collision() {
	
}

Collision.collidesWithPoint = function(pointA, rectB) {
	return pointA.x > rectB.pos.x && pointA.x < rectB.pos.x + rectB.width &&
		   pointA.y > rectB.pos.y && pointA.y < rectB.pos.y + rectB.height;
}

Collision.collidesWithRect = function(rectA, rectB) {
	return rectA.pos.x < rectB.pos.x + rectB.width && rectA.pos.x + rectA.width > rectB.pos.x &&
		   rectA.pos.y < rectB.pos.y + rectB.height && rectA.pos.y + rectA.height > rectB.pos.y;
}