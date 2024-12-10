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
let particles = [];
let analyzers=[];
const NUM_PARTICLES = 50;


let isStarted = false;

function draw() {
  background(0);

  if (!isStarted) {
    push();
    push();
    translate(width, - ((width / 640) * 480 - height) / 2)
    scale(-1, 1);  // Mirror the video horizontally
    image(video, 0, 0, width, (width / 640) * 480);
    pop();
    return;
  }

  // Add this new code to update and draw particles
  let totalVolume = 0;
  for (let analyzer of analyzers) {
    totalVolume += analyzer.getLevel();
  }
  totalVolume /= analyzers.length;  // Get average volume

  for (let particle of particles) {
    particle.update(totalVolume);
    particle.draw();
  }

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];

    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(100, 100, 100);  
      noStroke();
      ellipse(keypoint.x, keypoint.y, 5, 5);  
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

    let leftEyebrowNoseDistance = dist(face.keypoints[285].x, face.keypoints[285].y,
      face.keypoints[168].x, face.keypoints[168].y);
    let rightEyebrowNoseDistance = dist(face.keypoints[55].x, face.keypoints[55].y,
      face.keypoints[168].x, face.keypoints[168].y);
    let avgEyebrowNoseDistance = (leftEyebrowNoseDistance + rightEyebrowNoseDistance) / 2;
    let frownProportion = avgEyebrowNoseDistance / faceHeight;
    let frownThreshold = 0.11; 
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

  mouthOpenSound.setVolume(0);
  mouthOpenSound2.setVolume(0);
  shakingHeadSound.setVolume(0);
  eyebrowSound.setVolume(0);

  analyzers = [
    new p5.Amplitude(),
    new p5.Amplitude(),
    new p5.Amplitude(),
    new p5.Amplitude()
  ];
  
  analyzers[0].setInput(mouthOpenSound);
  analyzers[1].setInput(mouthOpenSound2);
  analyzers[2].setInput(shakingHeadSound);
  analyzers[3].setInput(eyebrowSound);
  
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(new Particle(random(width), random(height)));
  }

  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  pop();
}

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button');
  startButton.addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    isStarted = true;
    mouthOpenSound.loop();
    mouthOpenSound2.loop();
    shakingHeadSound.loop();
    eyebrowSound.loop();
  });
});

// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.accX = 0;
    this.accY = 0;
    this.size = random(3, 8);
    this.maxSpeed = 5;
  }

  update(volume) {
    // Add upward force based on volume
    let force = map(volume, 0, 1, 0, 8);
    this.accY -= force;
    
    // Add gravity
    this.accY += 0.5;
    
    // Update physics
    this.velX += this.accX;
    this.velY += this.accY;
    
    // Limit speed
    this.velX = constrain(this.velX, -this.maxSpeed, this.maxSpeed);
    this.velY = constrain(this.velY, -this.maxSpeed, this.maxSpeed);
    
    // Update position
    this.x += this.velX;
    this.y += this.velY;
    
    // Reset acceleration
    this.accX = 0;
    this.accY = 0;
    
    // Bounce off edges
    if (this.y > height) {
      this.y = height;
      this.velY *= -0.8;
    }
    if (this.x < 0 || this.x > width) {
      this.x = constrain(this.x, 0, width);
      this.velX *= -0.8;
    }
  }

  draw() {
    push();
    fill(120, 100, 80);  // Green in HSB
    noStroke();
    ellipse(this.x, this.y, this.size, this.size);
    pop();
  }
}


