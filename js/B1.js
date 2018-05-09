var experimentActive = false; var testActive = false;
var timesImage = new Array();
var timesAudio = new Array();
var times = new Array();
var lastTime;
var isImage;
var countErrors = 0;
var counter = 0;
var userName='';
var userAge;

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
	document.getElementById("errorRate").innerHTML = "";
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
    document.getElementById('errorMsg').innerHTML = "";
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
    document.getElementById("errorRate").innerHTML = "Fehlerrate: " + ((countErrors /(count+countErrors))*100) + "%";

    timesAudio.push("Audiotimes") ;
    timesAudio.push("Name: " + userName); 
    timesAudio.push("Alter: " + userAge);
    timesAudio.push("Durchschnittszeit: " + meanDeltaTimeAudio);
    timesAudio.push("Standardabweichung: " + standardDerivationAudio);

    timesAudio.push("Imagetimes");
    timesImage.push("Name: " + userName);
    timesImage.push("Alter: " + userAge);
    timesImage.push("Durchschnittszeit: " + meanDeltaTimeImage);
    timesImage.push("Standardabweichung: " + standardDerivationImage);

    times = timesAudio.concat(timesImage);
	times.push("Fehleranzahl: " + countErrors);
	countErrors=0;
    csvDownload();
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
            document.getElementById('errorMsg').innerHTML = "";
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
    
    download(csvContent, userName + 'Experiment1.csv', 'text/csv;encoding:utf-8');
}

document.onkeydown = onKey;
function onKey(e) { if (e == null) {
    e = window.event;
}
    switch (e.which || e.charCode || e.keyCode) {
        case 32:
            // space
            if ((!experimentActive)&&(userName.trim() != '')) {
                startExperiment(); }
            else {
                if (testActive) {
                    stopTest();
                } else {
					document.getElementById('errorMsg').innerHTML = "TOO EARLY";
					countErrors++
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
