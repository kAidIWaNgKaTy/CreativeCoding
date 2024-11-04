let sound, fft;
let img;
let customCursor;


function preload() {
  img = loadImage("background.png");
  customCursor = loadImage('grill glove2.png');
  sound = loadSound("SoundVolcano3.mp3");
}

let numBalls = 200; // Number of balls
let circleX = [];
let circleY = [];
let vx = [];
let vy = [];
let circleRadius = [];
let boundaryRadius = 150;
//let boundaryCenterX, boundaryCenterY;
let boundaryCenterX = 400;
let boundaryCenterY = 250;

let r = 50;

function setup() {
  createCanvas(800, 500);
  noCursor();
  fft = new p5.FFT();
  sound.amp(0.5);
  sound.loop();

  // Set the center of the boundary
  // boundaryCenterX = random(width);
  // boundaryCenterY = random(height);

  // Initialize positions and velocities for each ball
  for (let i = 0; i < numBalls; i++) {
    circleRadius[i] = random(10, 20);
    circleX[i] = random(
      boundaryCenterX - boundaryRadius + circleRadius[i],
      boundaryCenterX + boundaryRadius - circleRadius[i]
    );
    circleY[i] = random(
      boundaryCenterY - boundaryRadius + circleRadius[i],
      boundaryCenterY + boundaryRadius - circleRadius[i]
    );

    // Initialize velocity with random values
    vx[i] = random(-2, 2);
    vy[i] = random(-2, 2);
  }
}

function draw() {
  background(0, 30);
  image(img, 0, 0, 800, 500);
  image(customCursor, mouseX-50, mouseY-50, 100, 100);

  let spectrum = fft.analyze();
  let soundLevel = fft.getCentroid();

  boundaryCenterX = noise(frameCount * 0.01) * width;
  boundaryCenterY = noise(frameCount * 0.01 + 100) * height;

  //boundaryRadius = map(sin(frameCount * 0.01), -1, 1, 250, 450, true);
  boundaryRadius = map(soundLevel, 2000, 6000, 50, 200, true);

  // Draw the boundary circle
  noFill();
  stroke(220);
  strokeWeight(0);
  ellipse(boundaryCenterX, boundaryCenterY, boundaryRadius * 2);

  
  for (let i = 0; i < numBalls; i++) {
    
    circleX[i] += vx[i];
    circleY[i] += vy[i];

    
    let dx = circleX[i] - boundaryCenterX;
    let dy = circleY[i] - boundaryCenterY;
    let distFromCenter = sqrt(dx * dx + dy * dy);

    if (distFromCenter + circleRadius[i] > boundaryRadius) {
      let overflowDistance = distFromCenter + circleRadius[i] - boundaryRadius;

      let scalingFactor = 0.99;
      circleX[i] = boundaryCenterX + dx * scalingFactor;
      circleY[i] = boundaryCenterY + dy * scalingFactor;

      vx[i] = -vx[i];
      vy[i] = -vy[i];
    }

    for (let i = 0; i < numBalls; i++) {
      let mouseDist = dist(mouseX, mouseY, circleX[i], circleY[i]);
      if (mouseDist <= r) {
        // Calculate the angle between the particle and the mouse
        let angle = atan2(circleY[i] - mouseY, circleX[i] - mouseX);

        circleX[i] += cos(angle) * 5;
        circleY[i] += sin(angle) * 5;
      }
      //drawBall(x[i], y[i], s[i], test[i]);
    }

    // Draw the circle
    fill(0, 100);
    noStroke();
    ellipse(circleX[i], circleY[i], circleRadius[i] * 2);
  }
  //console.log(soundLevel);
}
