let mouthOpenSound;
let mouthOpenSound2;
let shakingHeadSound;
let eyebrowSound;
//let smileSound;




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




let isStarted = false;
let arrow;
let isDragging = false;
let interfaceVisible = true;




let waveLines = [];
const WAVE_COLORS = [
  [90, 70, 100],     // Yellow-green
  [120, 100, 100],   // Pure green
  [160, 100, 80],    // Blue-green (teal)
  [140, 100, 60]     // Deep emerald
];

class WaveTrack {
  constructor(y, color) {
    this.points = new Array(100).fill(0);
    this.y = y;
    this.color = color;
    this.maxPoints = 100;
    this.currentVolume = 0;
  }

  addPoint(volume) {
    this.currentVolume = lerp(this.currentVolume, volume, 0.1);
    this.points.unshift(this.currentVolume);
    if (this.points.length > this.maxPoints) {
      this.points.pop();
    }
  }

  draw() {
    push();
    stroke(this.color);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let x = map(i, 0, this.maxPoints, width, 0);
      let amplitude = map(this.points[i], 0, 1, 0, 50);
      let pointyWave = pow(sin(i * 0.3), 3) * amplitude;
      vertex(x, this.y + pointyWave);
    }
    endShape();
    pop();
  }
}




function draw() {
  background(0);


  if (interfaceVisible) {
    push();
    translate(width, -((width / 640) * 480 - height) / 2);
    scale(-1, 1);
    image(video, 0, 0, width, (width / 640) * 480);
    pop();
  }




  let slideX = map(arrow.x, width - 50, 50, width, 0);
  fill(0);
  rect(slideX, 0, width, height);




  if (isDragging) {
    arrow.x = constrain(mouseX, 50, width - 50);
  }




  if (isStarted && arrow.x >= width - 50) {  // When arrow reaches right edge




    isStarted = false;
    interfaceVisible = true;

    mouthOpenSound.stop();
    mouthOpenSound2.stop();
    shakingHeadSound.stop();
    eyebrowSound.stop();
  }




  if (!isStarted && arrow.x < width / 2) {
    isStarted = true;
    mouthOpenSound.jump(0);
    mouthOpenSound2.jump(0);
    shakingHeadSound.jump(0);
    eyebrowSound.jump(0);

    mouthOpenSound.loop();
    mouthOpenSound2.loop();
    shakingHeadSound.loop();
    eyebrowSound.loop();
  }




  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    push();
    translate(width, -((width / 640) * 480 - height) / 2);
    scale(-1, 1);

    // Get nose x position and map it to playback rate
    let noseX = face.keypoints[4].x;
    let playbackRate = map(noseX, 0, width, 0.8, 1.2);

    // Apply playback rate to all sounds
    mouthOpenSound.rate(playbackRate);
    mouthOpenSound2.rate(playbackRate);
    shakingHeadSound.rate(playbackRate);
    eyebrowSound.rate(playbackRate);


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
    let frownThreshold = 0.10;
    if (frownProportion < frownThreshold) {
      eyebrowSound.setVolume(2, 0.1);
    } else {
      eyebrowSound.setVolume(0, 0.1);
    }

    pop();
  }




  if (true) {
    drawingContext.shadowBlur = 35;
    drawingContext.shadowColor = 'rgb(0, 255, 0)';

    push();
    strokeWeight(5);
    stroke(120, 100, 80);

    let angle = 120;
    let angleRad = angle * PI / 180;
    let lineLength = arrow.size * 3;
    let spacing = 20;

    if (arrow.x > width / 2) {
      let x1 = arrow.x + cos(angleRad / 2) * lineLength;
      let y1 = arrow.y - sin(angleRad / 2) * lineLength;
      let x2 = arrow.x + cos(-angleRad / 2) * lineLength;
      let y2 = arrow.y - sin(-angleRad / 2) * lineLength;
      line(arrow.x, arrow.y, x1, y1);
      line(arrow.x, arrow.y, x2, y2);

      let x3 = (arrow.x - spacing) + cos(angleRad / 2) * lineLength;
      let y3 = arrow.y - sin(angleRad / 2) * lineLength;
      let x4 = (arrow.x - spacing) + cos(-angleRad / 2) * lineLength;
      let y4 = arrow.y - sin(-angleRad / 2) * lineLength;
      line(arrow.x - spacing, arrow.y, x3, y3);
      line(arrow.x - spacing, arrow.y, x4, y4);
    } else {
      let x1 = arrow.x - cos(angleRad / 2) * lineLength;
      let y1 = arrow.y - sin(angleRad / 2) * lineLength;
      let x2 = arrow.x - cos(-angleRad / 2) * lineLength;
      let y2 = arrow.y - sin(-angleRad / 2) * lineLength;
      line(arrow.x, arrow.y, x1, y1);
      line(arrow.x, arrow.y, x2, y2);

      let x3 = (arrow.x - spacing) - cos(angleRad / 2) * lineLength;
      let y3 = arrow.y - sin(angleRad / 2) * lineLength;
      let x4 = (arrow.x - spacing) - cos(-angleRad / 2) * lineLength;
      let y4 = arrow.y - sin(-angleRad / 2) * lineLength;
      line(arrow.x - spacing, arrow.y, x3, y3);
      line(arrow.x - spacing, arrow.y, x4, y4);
    }

    pop();

    drawingContext.shadowBlur = 0;
  }

  // Update and draw wave tracks
  if (isStarted) {
    waveLines[0].addPoint(mouthOpenSound.getVolume());
    waveLines[1].addPoint(mouthOpenSound2.getVolume());
    waveLines[2].addPoint(shakingHeadSound.getVolume());
    waveLines[3].addPoint(eyebrowSound.getVolume());
    
    for (let wave of waveLines) {
      wave.draw();
    }
  }
}




var w = 640, h = 480;




function preload() {
  faceMesh = ml5.faceMesh(options);
  mouthOpenSound = loadSound('assets/NowWeAreReadyToSpend/Other.mp3');
  mouthOpenSound2 = loadSound('assets/NowWeAreReadyToSpend/Vocals.mp3');
  shakingHeadSound = loadSound('assets/NowWeAreReadyToSpend/Drums.mp3');
  eyebrowSound = loadSound('assets/NowWeAreReadyToSpend/Bass.mp3');
  //smileSound = loadSound('assets/ChrisrmasTimeIsHere/.mp3');
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




  // Start detecting faces from the webcam video
  faceMesh.detectStart(video, gotFaces);
  pop();




  arrow = { x: width - 50, y: height / 2, size: 20 };

  // Initialize wave tracks
  let spacing = height / 5;
  for (let i = 0; i < 4; i++) {
    waveLines.push(new WaveTrack(spacing * (i + 1), WAVE_COLORS[i]));
  }
}




// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}




function mousePressed() {
  let hitAreaWidth = arrow.size * 2.5;
  let hitAreaHeight = arrow.size * 2;

  if (arrow.x > width / 2) {
    if (mouseX > arrow.x && mouseX < arrow.x + hitAreaWidth &&
      mouseY > arrow.y - hitAreaHeight / 2 && mouseY < arrow.y + hitAreaHeight / 2) {
      isDragging = true;
    }
  } else {
    if (mouseX < arrow.x && mouseX > arrow.x - hitAreaWidth &&
      mouseY > arrow.y - hitAreaHeight / 2 && mouseY < arrow.y + hitAreaHeight / 2) {
      isDragging = true;
    }
  }
}




function mouseReleased() {
  if (isDragging && !isStarted) {
    if (arrow.x > width / 2) {
      isStarted = true;
      mouthOpenSound.loop();
      mouthOpenSound2.loop();
      shakingHeadSound.loop();
      eyebrowSound.loop();
    }
  }
  isDragging = false;
}




function mouseDragged() {
  if (isDragging) {
    arrow.x = constrain(mouseX, 50, width - 50);
  }
}




