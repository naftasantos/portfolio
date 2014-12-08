function Collision() {
	
};

Collision.collidesWithPoint = function(pointA, rectB) {
	return pointA.x > rectB.pos.x && pointA.x < rectB.pos.x + rectB.width &&
		   pointA.y > rectB.pos.y && pointA.y < rectB.pos.y + rectB.height;
};

Collision.collidesWithRect = function(rectA, rectB) {
	return rectA.pos.x < rectB.pos.x + rectB.width && rectA.pos.x + rectA.width > rectB.pos.x &&
		   rectA.pos.y < rectB.pos.y + rectB.height && rectA.pos.y + rectA.height > rectB.pos.y;
};

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
};

Collision.adjustPosition = function(rect, other, lastPos, gameTime) {
    // using bisect search to find the nearest collision position
    var notCollidedPos = lastPos;
    var result = notCollidedPos;
    // will divide the time by half
    var root = 0.5;

    for (var i=0; i < 5; i++) {
        // returning to the last frame position
        rect.pos = notCollidedPos;
        // advancing some time
        rect.calculateForce(gameTime.time * root);

        // verifies if collision happens
        if (Collision.collidesWithRect(rect, other)) {
            // if so, go more back in time
            root *= 0.5;
        } else {
            result = rect.pos.clone();
            // if not, advance a little bit more to the future
            root *= 1.5;
        }
    }

    rect.pos = result;
}

Collision.getResultingCollisionForce = function(rectA, rectB, direction) {
    var result = rectB.direction.add(rectA.direction);
    var invertA = rectA.direction.multiply(-1);
    var invertB = rectB.direction.multiply(-1);

    return invertB.add(result).unit();


    // detecting which face has it collided with
    /*var collidedLine = Collision.getNearestToCollisionFace(rectA, rectB);

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

    return null;*/
};

Collision.getNearestToCollisionFace = function(rectA, rectB) {
    var facesA = [ 
        // top face
        [ {"x": rectA.pos.x, "y": rectA.pos.y }, { "x": rectA.pos.x + rectA.width, "y": rectA.pos.y } ],
        // right face
        [ {"x": rectA.pos.x + rectA.width, "y": rectA.pos.y }, { "x": rectA.pos.x + rectA.width, "y": rectA.pos.y + rectA.height } ],
        // bottom face
        [ {"x": rectA.pos.x, "y": rectA.pos.y + rectA.height }, { "x": rectA.pos.x + rectA.width, "y": rectA.pos.y + rectA.height }],
        // left face
        [ {"x": rectA.pos.x, "y": rectA.pos.y }, { "x": rectA.pos.x, "y": rectA.pos.y + rectA.height } ] 
    ];

    var facesB = [
        // bottom face
        [ {"x": rectB.pos.x, "y": rectB.pos.y + rectB.height }, { "x": rectB.pos.x + rectB.width, "y": rectB.pos.y + rectB.height }],
        // left face
        [ {"x": rectB.pos.x, "y": rectB.pos.y }, { "x": rectB.pos.x, "y": rectB.pos.y + rectB.height } ],
        // top face
        [ {"x": rectB.pos.x, "y": rectB.pos.y }, { "x": rectB.pos.x + rectB.width, "y": rectB.pos.y } ],
        // right face
        [ {"x": rectB.pos.x + rectB.width, "y": rectB.pos.y }, { "x": rectB.pos.x + rectB.width, "y": rectB.pos.y + rectB.height } ],
    ]

    var diffs = [
        Math.abs(facesB[0][0].y - facesA[0][0].y),
        Math.abs(facesB[1][0].x - facesA[1][0].x),
        Math.abs(facesB[2][0].y - facesA[2][0].y),
        Math.abs(facesB[3][0].x - facesA[3][0].x)
    ]

    var smallest = 0;

    for (var i=1; i<4; i++) {
        if(diffs[i] < diffs[smallest]) {
            smallest = i;
        }
    }

    return facesB[smallest];
}