var experimentActive = false; var testActive = false;
var timesImage = new Array();
var timesAudio = new Array();
var lastTime;
var isImage;
var counter = 0;

/**
 * Start new Experiment
 */
function startExperiment() {
    experimentActive = true;
    document.getElementById("time").innerHTML = "";
    document.getElementById("count").innerHTML = "";
    document.getElementById("meanAudio").innerHTML = "";
    document.getElementById("meanImage").innerHTML = "";
    document.getElementById("sdAudio").innerHTML = "";
    document.getElementById("sdImage").innerHTML = "";
    document.getElementById("description").style.display = "none";
    document.getElementById("instruction").innerHTML = "Druecken Sie die Leertaste wenn ein Ton oder ein Bild erscheint \n Druecken Sie 'a' um die Studie abzubrechen";
    startTest();
}

/**
 * Start next turn. Wait 2 to 6 seconds before next stimulus.
 */
function startTest() {
    console.log('starting test. No stimulus...');
    toggleStimulus();
    var timeInSeconds = Math.random() * 4 + 2; // 2 - 6s
    window.setTimeout("showStimulus()", timeInSeconds * 1000);
}


/**
 * Start new Stimulus.
 */
function showStimulus() {
    console.log('showing stimulus...')
    testActive = true;
    toggleStimulus();
}

/**
 * Stops current turn.
 */
function stopTest() {
    console.log('stop test...')
    var currTime = new Date().getTime();
    var deltaTime = currTime - lastTime;
    counter++;
    if (isImage == false){
        timesAudio.push(deltaTime);
    } else {
        timesImage.push(deltaTime);
    }
    document.getElementById("time").innerHTML = deltaTime + "ms";
    testActive = false;

    if(counter == 30){
        stopExperiment();
    } else {
        startTest();
    }

}

/**
 * Stops the experiment.
 * Calculates Mean and Standardderivation (sd) of Audiotimes and Imagetimes.
 */
function stopExperiment() {
    testActive = false;
    experimentActive = false;
    toggleStimulus();
    var meanDeltaTimeAudio = 0.0;
    for (var i = 0; i < timesAudio.length; ++i) {
        meanDeltaTimeAudio += timesAudio[i];
    }
    meanDeltaTimeAudio = Math.round(meanDeltaTimeAudio / timesAudio.length);
    var standardDerivationAudio = 0.0;
    for (var i = 0; i < timesAudio.length; ++i) {
        var diff = (timesAudio[i] - meanDeltaTimeAudio);
        standardDerivationAudio += diff * diff;
    }
    standardDerivationAudio =  Math.round(Math.sqrt(standardDerivationAudio / timesImage.length));
    var meanDeltaTimeImage = 0.0;
    for (var i = 0; i < timesImage.length; ++i) {
        meanDeltaTimeImage += timesImage[i];
    }
    meanDeltaTimeImage = Math.round(meanDeltaTimeImage / timesImage.length);
    var standardDerivationImage = 0.0;
    for (var i = 0; i < timesImage.length; ++i) {
        var diff = (timesImage[i] - meanDeltaTimeImage);
        standardDerivationImage += diff * diff;
    }
    standardDerivationImage =  Math.round(Math.sqrt(standardDerivationImage / timesImage.length));

    var count = timesImage.length + timesAudio.length;
    document.getElementById("count").innerHTML = "Count: " + count;
    document.getElementById("meanImage").innerHTML = "Mean of Image: " + meanDeltaTimeImage + "ms";
    document.getElementById("meanAudio").innerHTML = "Mean of Audio: " + meanDeltaTimeAudio + "ms";
    document.getElementById("sdImage").innerHTML = "SD of Image: " + standardDerivationImage + "ms";
    document.getElementById("sdAudio").innerHTML = "SD of Audio: " + standardDerivationAudio + "ms";
    document.getElementById("instruction").innerHTML = "Leertaste druecken um neu zu starten";

    console.log(buildCsv());

    timesAudio = [];
    timesImage = [];

}

/**
 * Toggle stimulus.
 */
function toggleStimulus(){
    console.log('toggle stimulus...')
    if(testActive && experimentActive){

        changeStimulus();
        lastTime = new Date().getTime();

    } else {  //stop stimuli
        document.getElementById("text").innerHTML = "";
        if (isImage) {
            document.getElementById("image").style.display = "none";
        } else {
            document.getElementById("audiofile").pause();
            document.getElementById("audiofile").currentTime = 0;
        }
    }
}

/**
 * Randomly decides if next stimulus is image or audio and shows that.
 */
function changeStimulus() {
    console.log('change stimulus...')
    isImage = Math.random() >= 0.5;
    if(isImage){
        document.getElementById("image").style.display = "block";
    } else {
        document.getElementById("audiofile").play();
    }
}

/**
 * Building csv data from audiotimes and imagetimes array.
 * Each value is separated by "," and new line "\n" for next row.
 * @returns {string}
 */
function buildCsv(){
    var csvContent = '';
    var info = 'Audio' + ',';
    csvContent += info;
    timesAudio.forEach(function (value, index) {
        csvContent += index < timesAudio.length ? value + ',' : value;
    });
    csvContent += '\n';
    var info = 'Image' + ',';
    csvContent += info;
    timesImage.forEach(function (value, index) {
        csvContent += index < timesImage.length ? value + ',' : value;
    });
    return csvContent;
}


document.onkeydown = onKey;
function onKey(e) { if (e == null) {
    e = window.event;
}
    switch (e.which || e.charCode || e.keyCode) {
        case 32:
            // space
            if (!experimentActive) {
                startExperiment(); }
            else {
                if (testActive) {
                    stopTest();
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
