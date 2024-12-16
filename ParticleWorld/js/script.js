// CCLab Mini Project - 9.R Particle World Template

let NUM_OF_PARTICLES = 150; // Increased number of particles

let particles = [];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("p5-canvas-container");

  // generate particles
  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles[i] = new Particle(random(width/2-50, width/2+50), height);
  }
}

function draw() {
  background(0, 50); 

  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
    
    if (p.y < 0) {
      particles[i] = new Particle(random(width/2-50, width/2+50), height);
    }
  }
}

class Particle {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.size = random(10, 30);
    this.speedY = random(-1, -3); 
    this.speedX = random(-1, 1);  
    this.life = 255;  
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;
    
    this.x += random(-1, 1);
    
    this.life -= 0.9; 
    
    this.size *= 0.99;
  }

  display() {
    push();
    noStroke();
    
    let fireColor = color(255, random(100, 150), 0, this.life);
    fill(fireColor);
    circle(this.x, this.y, this.size);
    
    let innerColor = color(255, 200, 50, this.life * 0.8);
    fill(innerColor);
    circle(this.x, this.y, this.size * 0.6);
    
    let outerColor = color(255, 70, 0, this.life * 0.5);
    fill(outerColor);
    for (let i = 0; i < 5; i++) {
      push();
      translate(this.x, this.y);
      rotate(frameCount * 0.02 + i * (TWO_PI / 5));
      triangle(
        0, -this.size/2,
        -this.size/3, this.size/2,
        this.size/3, this.size/2
      );
      pop();
    }
    
    fill(255, 255, 200, this.life);
    let sparkleSize = this.size / 8;
    for (let i = 0; i < 3; i++) {
      let sparkleX = this.x + random(-this.size/2, this.size/2);
      let sparkleY = this.y + random(-this.size/2, this.size/2);
      circle(sparkleX, sparkleY, sparkleSize);
    }
    
    pop();
  }
}
