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
var touchedShape = false;
var turnCounter = 1;

/*
    These constants were determined by analyzing web pages for a desktop solution of 1920x1080.
    The max height has been reduced because the task bar is always visible (size for default task bar in Windows 10).
*/
const MAX_DESKTOP_WIDTH = 1920;
const MAX_DESKTOP_HEIGHT = 974;


function setup() {
    createCanvas(min(windowWidth, MAX_DESKTOP_WIDTH), min(windowHeight, MAX_DESKTOP_HEIGHT));
    background(100);
    calcRandomPosition();
    fill(255, 0, 0);
    rect(nextPos.x, nextPos.y, nextSize.hor, nextSize.vert);
    screen.orientation.lock('landscape');
}

function draw() {
    createCanvas(min(windowWidth, MAX_DESKTOP_WIDTH), min(windowHeight, MAX_DESKTOP_HEIGHT));
    background(100);
    fill(255, 0, 0);
    line(0, height / 2, width, height / 2);
    // check if mouse clicked on shape. If yes, reshape.
    if (touchedShape == true && turnCounter <=50) {
        calcRandomPosition();
    } else if(turnCounter > 50){
        alert("You finished the exercise!");
        remove();
    }
    // reset boolean to "not clicked"
    touchedShape = false;

    // draw rectangle to screen
    fill(255, 0, 0);
    rect(nextPos.x, nextPos.y, nextSize.hor, nextSize.vert);
}

function calcRandomPosition() {
    const MAX_COUNT = 10;
    const MIN_DISTANCE = 30;
    let randomIndex;
    // select random size. Check max amount while selecting
    console.log("Array size: " + rectSizes.length - 1);
    
    if (turnCounter > 50){
        alert("You finished the exercise.");
    }

    do {
        randomIndex = int(random(rectSizes.length));
        console.log("Rand index: " + randomIndex);
    } while (rectSizes[randomIndex].count == MAX_COUNT);

    nextSize = rectSizes[randomIndex];
    // calc random position that complies with distance premise.
    do {
        nextPos.x = int((random(width) + rectSizes[randomIndex].hor) % width);
        console.log("Next x position: " + nextPos.x);
    } while (int(dist(lastPos.x, lastPos.y, nextPos.x, lastPos.y)) < MIN_DISTANCE);
    // align at middle of height
    nextPos.y = height / 2 - rectSizes[randomIndex].vert / 2;


    rectSizes[randomIndex].count++;
    lastPos.x = nextPos.x;
    lastPos.y = nextPos.y;
}

function mousePressed() {
    if ((mouseX >= nextPos.x) && (mouseX <= (nextPos.x + nextSize.hor)) && (mouseY >= nextPos.y) && (mouseY <= (nextPos.y + nextSize.vert))) {
        touchedShape = true;
        turnCounter++;
    }
}