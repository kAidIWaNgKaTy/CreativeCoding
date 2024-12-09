// CCLab Mini Project - 9.R Particle World Template

let NUM_OF_PARTICLES = 3; // Decide the initial number of particles.

let particles = [];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent("p5-canvas-container");

  // generate particles
  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles[i] = new Particle(random(width), random(height));
  }
}

function draw() {
  background(50,150);

  // update and display
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
  }
}

class Particle {
  // constructor function
  constructor(startX, startY) {
    // properties (variables): particle's characteristics
    this.x = startX;
    this.y = startY;
    //this.dia = 30;
  }
  // methods (functions): particle's behaviors
  update() {
    // (add) 
  }
  display() {
    // particle's appearance
    push();
    translate(this.x, this.y);
    
    for(let i=0; i<400; i+=10){
      let j = 20*sin((frameCount-i)/100);
      let s = map(i, 0, 400, 60, 6);
      stroke(255);
      circle(i/4,j,s);
    }
    pop();
  
  }
}
