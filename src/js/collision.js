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

Collision.collidesWithLine = function(lineA, rectB) {
	var diffX = (lineA[1].x - lineA[0].x);
	var diffY = (lineA[1].y - lineA[0].y);

	var p = [-diffX, diffX, -diffY, diffY];
    var q = [lineA[0].x - rect.pos.x, (rect.pos.x + rect.width) - lineA[0].x, lineA[0].y - rect.pos.y, (rect.pos.y + rect.height) - lineA[0].y];
    var u1 = Number.MIN_VALUE;
    var u2 = Number.MAX_VALUE;

    for (i = 0; i < 4; i++) {
        if (p[i] == 0) {
                if (q[i] < 0)
                        return false;
        }
        else {
                var t = q[i] / p[i];
                if (p[i] < 0 && u1 < t)
                        u1 = t;
                else if (p[i] > 0 && u2 > t)
                        u2 = t;
        }
    }

    if (u1 > u2 || u1 > 1 || u1 < 0)
            return false;

    return true;
}