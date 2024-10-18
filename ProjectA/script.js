let x = [];
let y = [];
let s = [];
let speedX = [];
let speedY = [];
let opa = [];
let n = 1000;
let threshold = 60;
let angle = 90;
let w = 10;
let r;

function setup() {
    createCanvas(800, 500);
  let canvas = createCanvas(800, 500);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
  for (let i = 0; i < n; i++) {
    x[i] = random(width);
    y[i] = random(height);
    s[i] = random(30, 50);
    speedX[i] = random(0.001, 0.01);
    speedY[i] = random(0.001, 0.01);
    opa[i] = random(160);
  }
}

function draw() {
  background(0);
  for (let i = 0; i < width; i+=w) {
    for (let j = 0; j < width; j+=w) {
      if (i < width / 2) {
        r = map(i, 0, width / 2, 0, 250);
      } else {
        r = map(i, width / 2,width, 250, 0);
      }
      push();
      translate(i,j);
      rotate(angle);
      rectMode(CENTER);
      noStroke();
      fill(r,0,0);
      rect(0,0,w,w);
      pop();
    }
  }
  angle+=0.03;
  for (let i = 0; i < n; i++) {
    drawFace(x[i], y[i], s[i], opa[i]);
  }
  move();
  awayMouse();
}
function drawFace(ballX, ballY, ballS, ballOpa) {
  push();
  translate(ballX, ballY);
  fill(0, ballOpa);
  noStroke();
  circle(0, 0, ballS);
  pop();
}

function move() {
  for (let i = 0; i < n; i++) {
    x[i] = width * noise(frameCount * speedX[i]);
    y[i] = height * noise(frameCount * speedY[i]);
  }
}

function awayMouse() {
  for (let i = 0; i < n; i++) {
    let mouseDist = dist(mouseX, mouseY, x[i], y[i]);
    if (mouseDist <= s[i] + threshold/2) {
      let randomNum = random();
      if (randomNum < 0.25) {
        x[i] = mouseX + threshold + random(10, 15);
        y[i] = mouseY + threshold + random(10, 15);
      } else if (randomNum >= 0.25 && randomNum < 0.5) {
        x[i] = mouseX - threshold + random(-15, -10);
        y[i] = mouseY + threshold + random(10, 15);
      } else if (randomNum >= 0.5 && randomNum < 0.75) {
        x[i] = mouseX + threshold + random(10, 15);
        y[i] = mouseY - threshold + random(-15, -10);
      } else if (randomNum >= 0.75) {
        x[i] = mouseX - threshold + random(-15, -10);
        y[i] = mouseY - threshold + random(-15, -10);
      }
    } else {
      x[i] = width * noise(frameCount * speedX[i]);
      y[i] = height * noise(frameCount * speedY[i]);
    }
  }
}


