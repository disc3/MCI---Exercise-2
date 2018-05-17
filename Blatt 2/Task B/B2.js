/*
Diego Schaich, 3232529; Softwaretechnik, Bachelor
Justin Gruenenwald, 3332982; Elektromobilitaet, Master
Anna Penzkofer, 3197473; Informatik, Bachelor
*/
var experimentActive = false; var testActive = false;
var times = new Array();
var lastTimeShapeChanged;
var isTriangle = false;
// pressed space key even though he should not have
var pressedWrong = false;
var timer = 0;
var countErrors = 0;
var countTurns = 0;
// canvas to draw shapes
var canvas = document.getElementById("shape");
var ctx = canvas.getContext("2d");
var userName='';
var userAge;
const MAX_TIME_STIMULUS_SHOWN = 4000;
const TEST_CONDITIONS_ON = false;

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
    document.getElementById("instruction").innerHTML = "Drücken Sie die LEERTASTE wenn Sie ein Dreieck sehen. Drücken Sie 'a' zum abbrechen.";
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
    isTriangle = false;
    pressedWrong = false;
    window.setTimeout("showStimulus()", timeInSeconds * 1000);
}

/*
Start new experiment.
*/
function showStimulus() {

    document.getElementById("errorMsg").innerHTML = "";
    console.log("showing stimulus...");
    testActive = true;
    // show shape
    toggleStimulus();
    // set timer that cancels after 3 seconds
    startInterval();
}

/*
Sttop current turn.
*/
function stopTest() {
    console.log("stop test...");
    var currTime = new Date().getTime();
    var deltaTime = currTime - lastTimeShapeChanged;
    countTurns++;
    // don't push times where nothing was clicked within 3 seconds of being shown stimulus.
    if ((isTriangle || pressedWrong) && deltaTime <= MAX_TIME_STIMULUS_SHOWN) {
        times.push(deltaTime);
        document.getElementById("time").innerHTML = "Letzte Zeit: " + deltaTime + "ms";
    }
    document.getElementById("count").innerHTML = "Wiederholungs-Zähler: " + countTurns;
    testActive = false;
    // abort experiment after 30 turns.
    if (times.length == 30 && TEST_CONDITIONS_ON == true) {
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
    //window.setTimeout("showStimulus()", 0);
    testActive = false;
    experimentActive = false;
    stopInterval();
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
    document.getElementById("count").innerHTML = "Wiederholungs-Zähler: " + countTurns;
    document.getElementById("mean").innerHTML = "Mittelwert: " + meanDeltaTime + "ms";
    document.getElementById("sd").innerHTML = "Standardabweichung: " + standardDerivation + "ms";
    document.getElementById("description").style.display = "block";
    document.getElementById("instruction").innerHTML = "Drücken Sie die LEERTASTE um die Studie erneut zu starten.";
    document.getElementById("errors").innerHTML = "Error rate: " + countErrors + " in " + countTurns + " turns = " + ((countErrors / countTurns) * 100).toFixed(2) + "%";
    
    times.push("Name: " + userName) ;
    times.push("Alter: " + userAge) ;
    times.push("Durchschnittszeit: " + meanDeltaTime) ;
    times.push("Standardabweichung: " + standardDerivation);
	times.push("Fehleranzahl: " + countErrors);
    csvDownload(); 
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
    // clear canvas, delete drawn shape
    else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/*
Draws stimulus. Can draw a circle and a triangle. Shape determined by chance.
*/
function changeStimulus() {
    console.log("change stimulus...");
    isTriangle = Math.random() <= 0.5;
    document.getElementById("text").style.display = "none";
    var sizeOfShape = Math.random() * 200 + 150;
    if (isTriangle) {
        // draw triangle
        ctx.beginPath();
        ctx.moveTo(10 + sizeOfShape, 10 + sizeOfShape);
        ctx.lineTo(10 + sizeOfShape / 2, 10);
        ctx.lineTo(10, 10 + sizeOfShape);
        ctx.closePath();
        ctx.stroke();
    } else {
        // draw circle
        ctx.beginPath();
        ctx.arc(10 + sizeOfShape / 2, 10 + sizeOfShape / 2, sizeOfShape / 2, 0, 2 * Math.PI);
        ctx.stroke();
    }

    // the filling color
    ctx.fillStyle = "#FFCC00";
    ctx.fill();
}

function checkInputandStart(){
    // called when Submit button is pressed
    userName = document.getElementById('nameInput').value;
    userAge = document.getElementById('ageInput').value;

    if ((!experimentActive)&&(userName.trim() != '')) {
        console.log(userAge,userName);
        if ((userAge.trim() == '') || (userName.trim() == '')){
            document.getElementById("errorMsg").innerHTML = "Bitte vollstaendig und korrekt ausfuellen!";
            userName='';
        } else {
            document.getElementById('submitButton').style.visibility = 'hidden';
            document.getElementById('nameInput').style.visibility = 'hidden';
            document.getElementById('ageInput').style.visibility = 'hidden';
            document.getElementById('ageDescript').style.visibility = 'hidden';
            document.getElementById('nameDescript').style.visibility = 'hidden';
            document.getElementById('errorMsg').style.visibility = 'hidden';
            startExperiment();
        }
    }
}

function csvDownload(){
    // Building the CSV from the Data two-dimensional array
    // Each column is separated by ";" and new line "\n" for next row
    var csvContent = '';
    console.log(times);
    times.forEach(function(infoArray, index) {
      csvContent += index < times.length ? infoArray + '\n' : infoArray;
    });
    
    // The download function takes a CSV string, the filename and mimeType as parameters
    // Scroll/look down at the bottom of this snippet to see how download is called
    var download = function(content, fileName, mimeType) {
      var a = document.createElement('a');
      mimeType = mimeType || 'application/octet-stream';
    
      if (navigator.msSaveBlob) { // IE10
        navigator.msSaveBlob(new Blob([content], {
          type: mimeType
        }), fileName);
      } else if (URL && 'download' in a) { //html5 A[download]
        a.href = URL.createObjectURL(new Blob([content], {
          type: mimeType
        }));
        a.setAttribute('download', fileName);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
      }
    }
    
    download(csvContent, userName + 'Experiment2.csv', 'text/csv;encoding:utf-8');
}
/*
Function that checks how long stimulus has been shown.
*/
function startInterval() {
    timer = setInterval(checkInterval, 500);
}

/*
Resets the timer.
*/
function stopInterval() {
    clearInterval(timer);
    timer = 0;
    if (experimentActive) {

        console.log("stopTest is called");
        stopTest();
    }
}
/*
 Stimulus should be viewed for max. 3 seconds.
*/
function checkInterval() {
    // calc time difference since being shown stimulus.
    var cTime = new Date().getTime();
    var dTime = cTime - lastTimeShapeChanged;
    if (dTime > MAX_TIME_STIMULUS_SHOWN) {
        if (isTriangle) {
            console.log("Did not press anything, even though triangle was shown.");
            document.getElementById("errorMsg").innerHTML = "too late";
            countErrors++;
        } else {
            console.log("Did not press anything for 4 seconds.");
        }
        stopInterval();
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
            if ((!experimentActive)&&(userName.trim() != '')) {
                console.log("pressed space the after first experiment run...");
                startExperiment();
            } else {
                if (testActive) {
                    if (!isTriangle) {
                        console.log("pressed space when circle was shown...");
                        document.getElementById("errorMsg").innerHTML = "wrong";
                        countErrors++;
                        pressedWrong = true;
                    } else {
                        console.log("pressed space correctly...");
                    }
                    stopInterval();
                } else {
                    console.log("pressed space w/o stimulus...");
                    countErrors++;
                }
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
