let mouthOpenSound;
let mouthOpenSound2;
let shakingHeadSound;
let eyebrowSound;

let previousNoseY = 0;
let isShaking = false;

let envelope;
// let osc;
let attackTime = 0.001;
let sustainTime = 0.5;
let sustainLevel = 0.8;
let releaseTime = 0.01;

let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let video;
let faces = [];

var w = 640, h = 480;

function preload() {
  faceMesh = ml5.faceMesh(options);
  mouthOpenSound = loadSound('assets/NowWeAreReadyToSpend/Other.mp3');
  mouthOpenSound2 = loadSound('assets/NowWeAreReadyToSpend/Vocals.mp3');
  shakingHeadSound = loadSound('assets/NowWeAreReadyToSpend/Drums.mp3');
  eyebrowSound = loadSound('assets/NowWeAreReadyToSpend/Bass.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  userStartAudio();

  // osc = new p5.TriOsc(); // set frequency and type
  envelope = new p5.Envelope(attackTime, sustainTime, sustainLevel, releaseTime);

  // Create the video and hide it
  video = createCapture(VIDEO);
  // video.size(640, 480);
  push();
  translate(0, - ((width / 640) * 480 - height) / 2)
  video.size(width, (width / 640) * 480);
  video.hide();

  mouthOpenSound.loop();
  mouthOpenSound.setVolume(0);
  mouthOpenSound2.loop();
  mouthOpenSound2.setVolume(0);
  shakingHeadSound.loop();
  shakingHeadSound.setVolume(0);
  eyebrowSound.loop();
  eyebrowSound.setVolume(0);


  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  pop();
}

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

function draw() {
  background(0);


  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(100, 100, 100);  // Green color for the dots
      noStroke();
      ellipse(keypoint.x, keypoint.y, 5, 5);  // Draw a small circle for each keypoint
    }

    let mouthHeight = dist(face.keypoints[13].x, face.keypoints[13].y, face.keypoints[14].x, face.keypoints[14].y);
    let faceHeight = dist(face.keypoints[152].x, face.keypoints[152].y, face.keypoints[10].x, face.keypoints[10].y);
    let mouthProportion = mouthHeight / faceHeight;
    let mouthThreshold = 0.03;

    if (mouthProportion > mouthThreshold) {
      mouthOpenSound.setVolume(1, 0.1);
      mouthOpenSound2.setVolume(1, 0.1);
    } else {
      mouthOpenSound.setVolume(0, 0.1);
      mouthOpenSound2.setVolume(0, 0.1);
    }

    let noseY = face.keypoints[4].y;
    let noseMovement = abs(noseY - previousNoseY);
    let shakeThreshold = 1;

    if (noseMovement > shakeThreshold) {
      isShaking = true;
      shakingHeadSound.setVolume(2, 0.1);
    } else {
      isShaking = false;
      shakingHeadSound.setVolume(0, 0.1);
    }
    previousNoseY = noseY;

    // Calculate frown by measuring distance between eyebrows and nose bridge
    let leftEyebrowNoseDistance = dist(face.keypoints[285].x, face.keypoints[285].y,
      face.keypoints[168].x, face.keypoints[168].y);
    let rightEyebrowNoseDistance = dist(face.keypoints[55].x, face.keypoints[55].y,
      face.keypoints[168].x, face.keypoints[168].y);
    let avgEyebrowNoseDistance = (leftEyebrowNoseDistance + rightEyebrowNoseDistance) / 2;
    let frownProportion = avgEyebrowNoseDistance / faceHeight;
    let frownThreshold = 0.11; // Adjust this value based on testing

    if (frownProportion < frownThreshold) {
      eyebrowSound.setVolume(2, 0.1);
    } else {
      eyebrowSound.setVolume(0, 0.1);
    }

    // // Display the index number near each keypoint
    // fill(0, 0, 100); // Set text color to red for the numbers (contrast with dots)
    // textAlign(CENTER, CENTER); // Align text to center it around the dot
    // text(j, keypoint.x + 10, keypoint.y);  // Display the index number slightly to the right of the dot
  }
}


