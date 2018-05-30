var nextPos = {
    x: 0,
    y: 0
};
var lastPos = {
    x: 0,
    y: 0
};
var rectSizes = [{
    hor: 20,
    vert: 10,
    count: 0
}, {
    hor: 40,
    vert: 20,
    count: 0
}, {
    hor: 60,
    vert: 30,
    count: 0
}, {
    hor: 80,
    vert: 40,
    count: 0
}, {
    hor: 100,
    vert: 50,
    count: 0
}];

function setup() {

}

function draw() {
    createCanvas(windowWidth, windowHeight);
    background(100);
    fill(255, 0, 0);
    line(0, height / 2, width, height / 2);
    calcRandomPosition();
}

function calcRandomPosition() {
    const MAX_COUNT = 10;
    const MIN_DISTANCE = 30;

    let nextSize;
    let rand;

    // select random size. Check max amount while selecting
    do {
        rand = random(sizes.lenght);
    } while (rectSizes[rand].count != MAX_COUNT);

    nextSize = rectSizes[rand];
    // calc random position that complies with distance premise.
    do {
        nextPos.x = (random(width) + rectSizes[rand].hor) % width;
    } while (int(dist(lastPos.hor, lastPos.vert, nextPos.hor, lastPos.vert)) < MIN_DISTANCE);
    // align at middle of height
    nextPos.y = height/2 - rectSizes[rand].vert/2;
    // draw rectangle to screen
    rect(nextPos.x, nextPos.y, nextSize.hor, nextSize.vert);

    rectSizes[rand].count++;
    lastPos.x = nextPos.x;
    lastPos.y = nextPos.y;
}