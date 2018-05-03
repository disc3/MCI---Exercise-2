var experimentActive = false; var testActive = false;
var times = new Array();
var lastTimeShapeChanged;
var isMammal = false;
// pressed space a key even though he should not have
var isWrong = false;
var countErrors = 0;
var countTurns = 0;
var highScore = 0;
var lastScore = 0;
var totalScore = 0;
var scoreMultiplicator = 1;
var answerStreak;
var deltaTime;
var animal;

var animals = [["Alpaca", true], ["Braunbär", true], ["Delfin", true], ["Wal", true],
["Dachs", true], ["Esel", true], ["Elefant", true], ["Zebra", true], ["Eichhörnchen", true],
["Flusspferd", true], ["Gorilla", true], ["Koala", true], ["Panda", true], ["Schaf", true], ["Tiger", true],
["Clown-Fisch", false], ["Seepferdchen", false], ["Piranha", false], ["Blutegel", false],
["Seestern", false], ["Qualle", false], ["Biene", false], ["Schmtterling", false], ["Skorpion", false],
["Python", false], ["Gecko", false], ["Frosch", false], ["Chamäleon", false], ["Leguan", false],
["Waran", false],]
/*
Start new experiment.
*/
function startExperiment() {
    experimentActive = true;
    document.getElementById("text").style.display = "none";
    document.getElementById("time").innerHTML = "";
    document.getElementById("count").innerHTML = "";
    document.getElementById("mean").innerHTML = "";
    document.getElementById("sd").innerHTML = "";
    document.getElementById("errors").innerHTML = "";
    document.getElementById("description").style.display = "none";
    document.getElementById("instruction").innerHTML = "Drücken Sie 't', wenn es sich beim Tier um ein Säugetier handelt, sonst 'f'. Drücken Sie 'a' um die Studie abzubrechen.";
    answerStreak = 0;
    startTest();
}

/*
Start next turn. Wait 2 to 6 seconds before next stimulus.
*/
function startTest() {
    // clear canvas
    console.log("starting test. No stimulus shown..");
    toggleStimulus();
    timeInSeconds = Math.random() * 4 + 2; // 2 - 6s
    isMammal = undefined;
    isWrong = false;
    pressedNothing = false;
    window.setTimeout("showStimulus()", timeInSeconds * 1000);
}

/*
Start new experiment.
*/
function showStimulus() {
    console.log("showing stimulus...");
    testActive = true;
    // show shape
    toggleStimulus();
}

/*
Sttop current turn.
*/
function stopTest() {
    console.log("stop test...");
    var currTime = new Date().getTime();
    deltaTime = currTime - lastTimeShapeChanged;
    countTurns++;
    times.push(deltaTime);
    calcScore();
    testActive = false;
    document.getElementById("time").innerHTML = "Letzte Zeit: " + deltaTime + "ms";
    document.getElementById("count").innerHTML = "Serie: " + answerStreak;
    toggleStimulus();
    // abort experiment after 30 turns.
    if (countTurns == 30) {
        stopExperiment();
    } else {
        // offset next turn by 1 second to allow the user to digest the scoring information
        window.setTimeout("startTest()", 1000);
    }
}

/*
Stops the experiment. Output of measured results.
*/
function stopExperiment() {
    console.log("stop experiment...");
    window.setTimeout("showStimulus()", 0);
    testActive = false;
    experimentActive = false;
    toggleStimulus();
    var meanDeltaTime = 0.0;
    for (var i = 0; i < times.length; ++i) {
        meanDeltaTime += times[i];
    }
    meanDeltaTime = Math.round(meanDeltaTime / times.length);
    var standardDerivation = 0.0;
    for (var i = 0; i < times.length; ++i) {
        var diff = (times[i] - meanDeltaTime);
        standardDerivation += diff * diff;
    }
    standardDerivation = Math.round(Math.sqrt(standardDerivation / times.length));
    document.getElementById("time").innerHTML = "";
    document.getElementById("count").innerHTML = "Serie: " + answerStreak;
    document.getElementById("mean").innerHTML = "Mittelwert: " + meanDeltaTime + "ms";
    document.getElementById("sd").innerHTML = "Standardabweichung: " + standardDerivation + "ms";
    document.getElementById("description").style.display = "block";
    document.getElementById("instruction").innerHTML = "Drücken Sie die LEERTASTE um die Studie erneut zu starten.";
    document.getElementById("errors").innerHTML = "Error rate: " + countErrors + " in " + countTurns + " turns = " + ((countErrors / countTurns) * 100).toFixed(2) + "%";
    times = [];
}

/*
Toggle stimulus.
*/
function toggleStimulus() {
    console.log("toggling stimulus...");
    if (testActive && experimentActive) {
        changeStimulus();
        lastTimeShapeChanged = new Date().getTime();
    }
    // show if answer was correct
    else {
        document.getElementById("text").innerHTML = isWrong ? "falsch" : "korrekt";
    }
}

/*
Draws stimulus. Can draw a circle and a triangle. Shape determined by chance.
*/
function changeStimulus() {
    console.log("change stimulus...");
    var ran = parseInt(Math.random() * (animals.length - 1), 10);
    animal = animals[ran][0];
    isMammal = animals[ran][1];
    document.getElementById("text").style.display = "block";
    document.getElementById("text").innerHTML = animal;
}

function calcScore() {
    var speedScore = 0;
    const MAX_SPEED_POINTS = 700;
    const POINTS_PER_QUESTION = 1000;
    console.log("Calculating score...");

    if (!isWrong) {
        answerStreak++;
    } else {
        answerStreak = 0;
    }

    calcMultiplier();
    // Quick answers will receive bonus points. Speed points turn into negative points after ca. 5 seconds.
    speedScore = Math.sqrt(deltaTime * 100);
    lastScore = (MAX_SPEED_POINTS - speedScore) * scoreMultiplicator;

    // Wrong answers will be subtracted from total
    if (isWrong) {
        lastScore = -Math.abs(lastScore);
    }

    totalScore += lastScore;
    console.log(!isWrong + " answer");
    console.log("Speed score: " + speedScore);
    console.log("Multiplier: " + scoreMultiplicator);
    console.log("Last score:" + lastScore);
    console.log("Total score: " + totalScore);

    document.getElementById("totalScore").innerHTML = "Gesamtpunktzahl: " + Math.round(totalScore) + " Pkt.";
    document.getElementById("lastScore").innerHTML = "Punkte (letzte Runde): " + Math.round(lastScore) + " Pkt.";
    document.getElementById("multiplier").innerHTML = "Score Multiplikator: " + scoreMultiplicator + " x";
}

/*
Calculating score multiplicator using binomial coefficient with d = 2. Score multiplicator will increment with streak of 2,4,7,11,16,22,... .
*/
function calcMultiplier() {
    scoreMultiplicator = 1;
    var sum = 2;
    while (answerStreak >= sum) {
        scoreMultiplicator++;
        sum += scoreMultiplicator;
    }
}



document.onkeydown = onKey;
function onKey(e) {
    if (e == null) {
        e = window.event;
    }
    switch (e.which || e.charCode || e.keyCode) {
        case 32:
            // space
            if (!experimentActive) {
                console.log("pressed space the first time...");
                startExperiment();
            }
            break;
        case 84: // t
            if (testActive && experimentActive) {
                if (!isMammal) {
                    console.log("Wrong! Pressed true when animal was not a mammal...");
                    countErrors++;
                    isWrong = true;
                } else {
                    console.log("Correct! Pressed true...");
                }
            }
            stopTest();
            break;
        case 70: // f
            if (testActive && experimentActive) {
                if (isMammal) {
                    console.log("Wrong! Pressed false when animal was a mammal...");
                    countErrors++;
                    isWrong = true;
                } else {
                    console.log("Correct! Pressed true...");
                }
            }
            stopTest();
            break;
        case 65: // a
            if (experimentActive) {
                stopExperiment();
            }
            break;
        case 66:
        // b
        // here you can extend... alert("pressed the b key"); break;
    }
}
