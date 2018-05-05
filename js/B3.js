var experimentActive = false; var testActive = false;
var times = new Array();
var lastTimeShapeChanged;
var isMammal = false;
// pressed space a key even though he should not have
var isWrong = false;
var countErrors = 0;
var countTurns = 0;
var animal;

var animals = [["Alpaca", true], ["Braunbaer", true], ["Delfin", true], ["Wal", true],
["Dachs", true], ["Esel", true], ["Elefant", true], ["Zebra", true], ["Eichhoernchen", true],
["Flusspferd", true], ["Gorilla", true], ["Koala", true], ["Panda", true], ["Schaf", true], ["Tiger", true],
["Clown-Fisch", false], ["Seepferdchen", false], ["Piranha", false], ["Blutegel", false],
["Seestern", false], ["Qualle", false], ["Biene", false], ["Schmtterling", false], ["Skorpion", false],
["Python", false], ["Gecko", false], ["Frosch", false], ["Chamaeleon", false], ["Leguan", false],
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
    document.getElementById("instruction").innerHTML = "Druecken Sie 't', wenn es sich beim Tier um ein Saeugetier handelt, sonst 'f'. Druecken Sie 'a' um die Studie abzubrechen.";
    startTest();
}

/*
Start next turn. Wait 2 to 6 seconds before next stimulus.
*/
function startTest() {
    // clear area where animal information shown
    console.log("starting test. No stimulus shown..");
    toggleStimulus();
    timeInSeconds = Math.random() * 4 + 2; // 2 - 6s
    isMammal = false;
    window.setTimeout("showStimulus()", timeInSeconds * 1000);
}

/*
Start new experiment.
*/
function showStimulus() {
    console.log("showing stimulus...");
    testActive = true;
    // show animal
    toggleStimulus();
}

/*
Sttop current turn.
*/
function stopTest() {
    console.log("stop test...");
    var currTime = new Date().getTime();
    var deltaTime = currTime - lastTimeShapeChanged;
    countTurns++;
    times.push(deltaTime);
    document.getElementById("time").innerHTML = "Letzte Zeit: " + deltaTime + "ms";
    document.getElementById("count").innerHTML = "Wiederholungs-Zaehler: " + countTurns;
    testActive = false;
    // abort experiment after 30 turns.
    if (countTurns == 30) {
        stopExperiment();
    } else {
        startTest();
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
    document.getElementById("errorMsg").innerHTML = "";
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
    document.getElementById("count").innerHTML = "Stimuli-Zaehler: " + countTurns;
    document.getElementById("mean").innerHTML = "Mittelwert: " + meanDeltaTime + "ms";
    document.getElementById("sd").innerHTML = "Standardabweichung: " + standardDerivation + "ms";
    document.getElementById("description").style.display = "block";
    document.getElementById("instruction").innerHTML = "Druecken Sie die LEERTASTE um die Studie erneut zu starten.";
    document.getElementById("errors").innerHTML = "Error rate: " + countErrors + " in " + (countTurns + countErrors) + " clicks = " + ((countErrors / (countTurns + countErrors)) * 100).toFixed(2) + "%";
    times = [];
    countErrors = 0;
    countTurns = 0;
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
    // clear area
    else {
        document.getElementById("text").innerHTML = "";
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
            if (!experimentActive) {break;} //avoid input before experiment stated
            if (testActive) {
                if (!isMammal) {
                    console.log("Wrong! Pressed true when animal was not a mammal...");
                    document.getElementById("errorMsg").innerHTML = "WRONG!";
                    countErrors++;
                } else {
                    document.getElementById("errorMsg").innerHTML = "";
                    console.log("Correct! Pressed true...");
                }
                stopTest();
            } else {
                countErrors++;
                document.getElementById("errorMsg").innerHTML = "TOO EARLY!";
            }
            break;
        case 70: // f           
            if (!experimentActive) {break;} //avoid input before experiment stated
            if (testActive) {
                if (isMammal) {
                    console.log("Wrong! Pressed false when animal was a mammal...");
                    document.getElementById("errorMsg").innerHTML = "WRONG!";
                    countErrors++;
                } else {
                    document.getElementById("errorMsg").innerHTML = "";
                    console.log("Correct! Pressed true...");
                }
                stopTest();
            } else {
                countErrors++;
                document.getElementById("errorMsg").innerHTML = "TOO EARLY!";
            }
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
