//I'm setting up the sounds here
let mouthOpenSound;
let mouthOpenSound2;
let shakingHeadSound;
let eyebrowSound;
let christmasMouthSound;
let christmasMouthSound2;
let christmasShakingSound;
let christmasEyebrowSound;








let envelope;
let attackTime = 0.001;
let sustainTime = 0.5;
let sustainLevel = 0.8;
let releaseTime = 0.01;








let previousNoseY = 0;
let isShaking = false;








//Initiating
let isStarted = false;
let interfaceVisible = true;








//Transition between modes
let currentMode = 'NowWe';








//Facemesh tool
let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
let video;
let faces = [];
let volumeFactor = 0;








//OOP-Snow
let snowflakes = [];
class Snow {
constructor() {
  this.x = random(width);
  this.y = random(-100, 0);
  this.size = random(3, 8);
  this.speed = random(1, 3);
  this.wobble = random(0, 2 * PI);
  this.brightness = random(200, 255);
  this.isOffscreen = false;
}
fall() {
  this.y += this.speed;
  this.x += sin(this.wobble) * 0.5;
  this.wobble += 0.01;
  if (this.y > height) {
    this.isOffscreen = true;
  }
}
show() {
  push();
  noStroke();
  fill(this.brightness);
  circle(this.x, this.y, this.size);
  pop();
}
}
















let isSoundPlaying = false;








// Add FFT analyzers
let fft1, fft2, fft3, fft4;








function draw() {
background(0);
//initiating
if (interfaceVisible) {
  push();
  translate(width, -((width / 640) * 480 - height) / 2);
  scale(-1, 1);
  image(video, 0, 0, width, (width / 640) * 480);
  pop();
}








let slideX = mouseX;
fill(0);
noStroke();
rect(0, 0, slideX, height);








// Draw FFT waveforms
if (currentMode === 'NowWe') {
  drawWaveform(mouthOpenSound, fft1, 4*height/5, [167, 100, 100]);
  drawWaveform(mouthOpenSound2, fft2, 3*height/5, [188,79,100]);
  drawWaveform(shakingHeadSound, fft3, 2*height/5, [240,100,100]);
  drawWaveform(eyebrowSound, fft4, height/5, [251, 48, 100]);
}
























let nosePoints = [4, 6, 197, 195, 248, 3, 281, 51, 275, 45, 1, 274, 44, 196, 419, 5,168];
let mouthPoints = [269,303,271,311,39,73,41,81,40,74,42,80,270,304,272,310,14, 15, 16, 17, 84,85,86,87,178,179,180,181,88,89,90,95,96,317,316,315,314,402,403,404,405,318,319,320,0,11,12,13,37,72,38,82,267,302,268,312];
let eyebrowsPoints = [336,285,296,295,334,282,293,283,300,276,107,55,66,65,52,63,53,70,46];




if(faces.length == 0){
  mouthOpenSound.setVolume(0);
  mouthOpenSound2.setVolume(0);
  shakingHeadSound.setVolume(0);
  eyebrowSound.setVolume(0);
  christmasMouthSound.setVolume(0);
  christmasMouthSound2.setVolume(0);
  christmasShakingSound.setVolume(0);
  christmasEyebrowSound.setVolume(0);
}








for (let i = 0; i < faces.length; i++) {
























  let face = faces[i];
  push();
  translate(width, -((width / 640) * 480 - height) / 2);
  scale(-1, 1);
  //Trigger1-space and speed
  let noseX = face.keypoints[4].x;
  let playbackRate = map(noseX, 0, width, 0.8, 1.2);
  if(isStarted){
    mouthOpenSound.rate(playbackRate);
    mouthOpenSound2.rate(playbackRate);
    shakingHeadSound.rate(playbackRate);
    eyebrowSound.rate(playbackRate);
  }








  //face dots
  for (let j = 0; j < face.keypoints.length; j++) {
    let keypoint = face.keypoints[j];
    noStroke();
    if (currentMode === 'christmas') {
      fill(255);
    } else {
      // Check if this is a nose point (indices 4-6 are nose points)
      if (nosePoints.includes(j)) {
        // Bright red for nose dots
        fill(240,100,100);
      } else {
       if(mouthPoints.includes(j)){
         fill(188,79, 100);
       }else{
         if(eyebrowsPoints.includes(j)){
           fill(251, 48, 100);
         }else{
           fill(120, 100, 100);
         }
       }
      }
    }
    ellipse(keypoint.x, keypoint.y, 5, 5);








   //  push()
   //  translate(keypoint.x, keypoint.y);
   //  scale(-1, 1)
   //  text(j, 0, 0);
   //  pop()
  }
  pop();








  if(isStarted && face.keypoints.length > 0){
    //Trigger2a-mouth open detection
    let mouthHeight = dist(face.keypoints[13].x, face.keypoints[13].y, face.keypoints[14].x, face.keypoints[14].y);
    let faceHeight = dist(face.keypoints[152].x, face.keypoints[152].y, face.keypoints[10].x, face.keypoints[10].y);
    let mouthProportion = mouthHeight / faceHeight;
    let mouthThreshold = 0.03;
















    // handle volumeFactor
    // console.log(faceHeight/height);
    // volumeFactor = map(faceHeight/height, 0.1, 0.3, 0, 1, true)
    let smallestFace = 0.2;
    let biggestFace = 0.45;   
    if(faceHeight/height<smallestFace){
      volumeFactor = 0;
    }else if(faceHeight/height>biggestFace){
      volumeFactor = 1;
    }else{
      volumeFactor = map(faceHeight/height, smallestFace, biggestFace, 0, 1)
    }








    console.log(volumeFactor)








    fill(255);
    textSize(16);
    // text("face ratio: " + faceHeight/height, 100, 50)
    // text("volume factor: "+ volumeFactor, 100, 60)
















    if (mouthProportion > mouthThreshold) {
      mouthOpenSound.setVolume(1*volumeFactor, 0.1);
      mouthOpenSound2.setVolume(1*volumeFactor, 0.1);
    } else {
      mouthOpenSound.setVolume(0, 0.1);
      mouthOpenSound2.setVolume(0, 0.1);
    }








    //Trigger3-nose movement detection (shaking head)
    let noseY = face.keypoints[4].y;
    let noseMovement = abs(noseY - previousNoseY);
    let shakeThreshold = 1;
    if (noseMovement > shakeThreshold) {
      isShaking = true;
      shakingHeadSound.setVolume(2*volumeFactor, 0.1);
    } else {
      isShaking = false;
      shakingHeadSound.setVolume(0, 0.1);
    }
    previousNoseY = noseY;








    //Trigger4-eyebrow movement detection (frowning/lifting)
    let leftEyebrowNoseDistance = dist(face.keypoints[285].x, face.keypoints[285].y,
      face.keypoints[168].x, face.keypoints[168].y);
    let rightEyebrowNoseDistance = dist(face.keypoints[55].x, face.keypoints[55].y,
      face.keypoints[168].x, face.keypoints[168].y);
    let avgEyebrowNoseDistance = (leftEyebrowNoseDistance + rightEyebrowNoseDistance) / 2;
    let frownProportion = avgEyebrowNoseDistance / faceHeight;
    let frownThreshold = 0.10;
    if (frownProportion < frownThreshold) {
      eyebrowSound.setVolume(2*volumeFactor, 0.1);
    } else {
      eyebrowSound.setVolume(0, 0.1);
    }








    //Trigger2b-mouth lifting detection (smile)
    let leftMouthCorner = face.keypoints[61];
    let rightMouthCorner = face.keypoints[291];
    let upperLipCenter = face.keypoints[13];
    let avgCornerHeight = (leftMouthCorner.y + rightMouthCorner.y) / 2;
    let lipLift = upperLipCenter.y - avgCornerHeight;
    let lipLiftProportion = lipLift / faceHeight;
    let smileThreshold = 0.01;








    //Play mode2
    if (currentMode === 'christmas') {
      if (lipLiftProportion > smileThreshold) {
        christmasMouthSound.setVolume(1*volumeFactor, 0.1);
        christmasMouthSound2.setVolume(1*volumeFactor, 0.1);
      } else {
        christmasMouthSound.setVolume(0, 0.1);
        christmasMouthSound2.setVolume(0, 0.1);
      }








      if (noseMovement > shakeThreshold) {
        isShaking = true;
        christmasShakingSound.setVolume(2*volumeFactor, 0.1);
      } else {
        isShaking = false;
        christmasShakingSound.setVolume(0, 0.1);
      }








      if (frownProportion > frownThreshold) {
        christmasEyebrowSound.setVolume(2*volumeFactor, 0.1);
      } else {
        christmasEyebrowSound.setVolume(0, 0.1);
      }








      let playbackRate = map(noseX, 0, width, 0.8, 1.2);
      christmasMouthSound.rate(playbackRate);
      christmasMouthSound2.rate(playbackRate);
      christmasShakingSound.rate(playbackRate);
      christmasEyebrowSound.rate(playbackRate);
    }
  }








  pop();
}








//execute oop-snow
if (currentMode === 'christmas') {
  while (snowflakes.length < 100) {
    snowflakes.push(new Snow());
  }








  for (let i = snowflakes.length - 1; i >= 0; i--) {
    snowflakes[i].fall();
    snowflakes[i].show();








    if (snowflakes[i].isOffscreen) {
      snowflakes.splice(i, 1);
    }
  }
}








if(!isStarted){
  noStroke();
  fill(255);
  text("admin: press 's' to start sound", 20, height-50)








}
}








//preload the sound and the facemesh tool
function preload() {
faceMesh = ml5.faceMesh(options);








mouthOpenSound = loadSound('assets/NowWeAreReadyToSpend/Other.mp3');
mouthOpenSound2 = loadSound('assets/NowWeAreReadyToSpend/Vocals.mp3');
shakingHeadSound = loadSound('assets/NowWeAreReadyToSpend/Drums.mp3');
eyebrowSound = loadSound('assets/NowWeAreReadyToSpend/Bass.mp3');








christmasMouthSound = loadSound('assets/ChristmasTimeIsHere/Other.mp3');
christmasMouthSound2 = loadSound('assets/ChristmasTimeIsHere/Vocals.mp3');
christmasShakingSound = loadSound('assets/ChristmasTimeIsHere/Drums.mp3');
christmasEyebrowSound = loadSound('assets/ChristmasTimeIsHere/Bass.mp3');
}








function setup() {
createCanvas(windowWidth, windowHeight);
colorMode(HSB);
userStartAudio();
envelope = new p5.Envelope(attackTime, sustainTime, sustainLevel, releaseTime);
video = createCapture(VIDEO);
push();
translate(0, - ((width / 640) * 480 - height) / 2)
video.size(width, (width / 640) * 480);
video.hide();








// Start all sounds looping
// if (currentMode === 'NowWe') {
//   mouthOpenSound.loop();
//   mouthOpenSound2.loop();
//   shakingHeadSound.loop();
//   eyebrowSound.loop();
// } else {
//   christmasMouthSound.loop();
//   christmasMouthSound2.loop();
//   christmasShakingSound.loop();
//   christmasEyebrowSound.loop();
// }








// Initialize volumes to 0
mouthOpenSound.setVolume(0);
mouthOpenSound2.setVolume(0);
shakingHeadSound.setVolume(0);
eyebrowSound.setVolume(0);








christmasMouthSound.setVolume(0);
christmasMouthSound2.setVolume(0);
christmasShakingSound.setVolume(0);
christmasEyebrowSound.setVolume(0);








faceMesh.detectStart(video, gotFaces);
pop();








// Initialize FFT analyzers
fft1 = new p5.FFT();
fft2 = new p5.FFT();
fft3 = new p5.FFT();
fft4 = new p5.FFT();
 // Set up initial inputs
fft1.setInput(mouthOpenSound);
fft2.setInput(mouthOpenSound2);
fft3.setInput(shakingHeadSound);
fft4.setInput(eyebrowSound);
}








// Callback function for when faceMesh outputs data
function gotFaces(results) {
// Save the output to the faces variable
faces = results;
}








function switchMode() {
if(!isStarted){
  return
}
// Stop all sounds
mouthOpenSound.stop();
mouthOpenSound2.stop();
shakingHeadSound.stop();
eyebrowSound.stop();
christmasMouthSound.stop();
christmasMouthSound2.stop();
christmasShakingSound.stop();
christmasEyebrowSound.stop();








 // Switch the mode
currentMode = currentMode === 'NowWe' ? 'christmas' : 'NowWe';
// Start the new set of sounds looping
if (currentMode === 'christmas') {
  christmasMouthSound.loop();
  christmasMouthSound2.loop();
  christmasShakingSound.loop();
  christmasEyebrowSound.loop();
  snowflakes = Array(200).fill().map(() => new Snow());
} else {
  mouthOpenSound.loop();
  mouthOpenSound2.loop();
  shakingHeadSound.loop();
  eyebrowSound.loop();
  snowflakes = [];
}
























// Initialize all volumes to 0
mouthOpenSound.setVolume(0);
mouthOpenSound2.setVolume(0);
shakingHeadSound.setVolume(0);
eyebrowSound.setVolume(0);
christmasMouthSound.setVolume(0);
christmasMouthSound2.setVolume(0);
christmasShakingSound.setVolume(0);
christmasEyebrowSound.setVolume(0);
}








//mode switching
function mousePressed() {
switchMode();
}








function keyPressed() {
if (key === 's') {  // Check if spacebar is pressed
  if (isSoundPlaying) {
    // Stop all sounds
    mouthOpenSound.stop();
    mouthOpenSound2.stop();
    shakingHeadSound.stop();
    eyebrowSound.stop();
    christmasMouthSound.stop();
    christmasMouthSound2.stop();
    christmasShakingSound.stop();
    christmasEyebrowSound.stop();
  } else {
    // Start sounds based on current mode
    console.log("starting sound")
    if (currentMode === 'NowWe') {
      mouthOpenSound.loop();
      mouthOpenSound2.loop();
      shakingHeadSound.loop();
      eyebrowSound.loop();
    } else {
      christmasMouthSound.loop();
      christmasMouthSound2.loop();
      christmasShakingSound.loop();
      christmasEyebrowSound.loop();
    }
    // Reset all volumes to 0
    mouthOpenSound.setVolume(0);
    mouthOpenSound2.setVolume(0);
    shakingHeadSound.setVolume(0);
    eyebrowSound.setVolume(0);
    christmasMouthSound.setVolume(0);
    christmasMouthSound2.setVolume(0);
    christmasShakingSound.setVolume(0);
    christmasEyebrowSound.setVolume(0);
  }
  isStarted = true;
  isSoundPlaying = !isSoundPlaying;  // Toggle the state
}
}








// Update drawWaveform function to use specific FFT analyzer
function drawWaveform(sound, fft, yPosition, color) {
let waveform = fft.waveform();
noFill();
beginShape();
stroke(color);
strokeWeight(2);
 for (let i = 0; i < waveform.length; i++){
  let x = map(i, 0, waveform.length, 0, width);
  let y;
  if (yPosition === height/5) {
    y = map(waveform[i], -1, 1, yPosition-150, yPosition+150);
  } else if (yPosition === 2*height/5 || yPosition === 3*height/5) {
    y = map(waveform[i], -1, 1, yPosition-100, yPosition+100);
  } else {
    y = map(waveform[i], -1, 1, yPosition-50, yPosition+50);
  }
  vertex(x, y);
}
endShape();
}



















