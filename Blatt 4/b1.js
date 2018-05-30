var nextPos = {
    x: 0,
    y: 0
};
var lastPos = {
    x: 0,
    y: 0
};
var nextSize = {
    hor: 0,
    vert: 0
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

function draw() {
        createCanvas(windowWidth, windowHeight);
        background(100);
        fill(255, 0, 0);
        line(0, height / 2, width, height / 2);
        calcRandomPosition();

        // draw rectangle to screen
        fill(255, 0, 0);
        rect(nextPos.x, nextPos.y, nextSize.hor, nextSize.vert);
}

function calcRandomPosition() {
    const MAX_COUNT = 10;
    const MIN_DISTANCE = 30;
    let rand;

    // select random size. Check max amount while selecting
    console.log("Array size: " + rectSizes.length - 1);

    do {
        rand = int(random(rectSizes.length));
        console.log("Rand index: " + rand);
    } while (rectSizes[rand].count == MAX_COUNT);

    nextSize = rectSizes[rand];
    // calc random position that complies with distance premise.
    do {
        nextPos.x = int((random(width) + rectSizes[rand].hor) % width);
        console.log("Next x position: " + nextPos.x);
    } while (int(dist(lastPos.x, lastPos.y, nextPos.x, lastPos.y)) < MIN_DISTANCE);
    // align at middle of height
    nextPos.y = height / 2 - rectSizes[rand].vert / 2;


    rectSizes[rand].count++;
    lastPos.x = nextPos.x;
    lastPos.y = nextPos.y;
}

