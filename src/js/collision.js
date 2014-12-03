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
    var q = [lineA[0].x - rectB.pos.x, (rectB.pos.x + rectB.width) - lineA[0].x, lineA[0].y - rectB.pos.y, (rectB.pos.y + rectB.height) - lineA[0].y];
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

Collision.getReflection = function(rectA, rectB, direction) {
    // detecting which face has it collided with
    var lineA = [ {"x": rectA.pos.x, "y": rectA.pos.y }, { "x": rectA.pos.x + rectA.width, "y": rectA.pos.y } ];
    var lineB = [ {"x": rectA.pos.x + rectA.width, "y": rectA.pos.y }, { "x": rectA.pos.x + rectA.width, "y": rectA.pos.y + rectA.height } ];
    var lineC = [ {"x": rectA.pos.x, "y": rectA.pos.y + rectA.height }, { "x": rectA.pos.x + rectA.width, "y": rectA.pos.y + rectA.height } ];
    var lineD = [ {"x": rectA.pos.x, "y": rectA.pos.y }, { "x": rectA.pos.x, "y": rectA.pos.y + rectA.height } ];

    var collidedLine = null;

    if (Collision.collidesWithLine(lineA, rectB)) {
        collidedLine = lineA;
    } else if (Collision.collidesWithLine(lineB, rectB)) {
        collidedLine = lineB;
    } else if (Collision.collidesWithLine(lineC, rectB)) {
        collidedLine = lineC;
    } else if (Collision.collidesWithLine(lineD, rectB)) {
        collidedLine = lineD;
    }

    if (collidedLine != null) {
        // calculating the normal of the collided line
        var diffX   = collidedLine[1].x - collidedLine[0].x;
        var diffY   = collidedLine[1].y - collidedLine[0].y;
        var normal  = new Vector(-diffY, diffX).unit();

        // r = d - (2(d dot n)) * n
        var reflection = direction.subtract(normal.multiply(direction.dot(normal) * 2));

        return reflection.unit();
    } else {
        console.log("Something is wrong. No face collided. =/");
    }

    return null;
}