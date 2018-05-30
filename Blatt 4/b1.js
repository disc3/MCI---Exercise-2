var horizontal;
var vertical;
function setup() {
    ScreenOrientationManager = new ScreenOrientationManager();
    ScreenOrientationManager.lockOrientation('landscape-primary');
}
function draw() {
    background(100);
    fill(255, 0, 0);
    line(0, height / 2, width, height / 2);
}