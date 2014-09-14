var canvas = document.getElementById('universe-content');
var context = canvas.getContext('2d');

var universe = new Universe(canvas);

var mainloop = function() {
	universe.update();
	
	universe.erase();
	universe.draw();
};

var animFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        null ;

if ( animFrame !== null ) {
    var recursiveAnim = function() {
        mainloop();
        animFrame( recursiveAnim, canvas );
    };

    // start the mainloop
    animFrame( recursiveAnim, canvas );
} else {
    var ONE_FRAME_TIME = 1000.0 / 60.0 ;
    setInterval( mainloop, ONE_FRAME_TIME );
}