/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new KatyDancer(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class KatyDancer {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.m = 0;
    // add properties for your dancer here:
    //..
    //..
    //..
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    
    //red:
    push();
    translate(this.x-width/2, this.y-height/2);
    rotate(80);
    noStroke();
    for(let i=0; i<400; i+=10){
      let j = 10*sin((frameCount*10-i)/100);
      let s = map(i, 200, 400, 40, 1);
      let opa = map(i, 0, 400, 255, 10);
      fill(255,0,0,opa/2);
      circle(i/4,j,s);
    }
    for(let i=0; i<600; i+=10){
      let j = 10*sin((frameCount*10-i)/100);
      let s = map(i, 0, 600, 80, 1);
      let opa = map(i, 0, 600, 255,0);
      fill(255,0,0,opa);
      circle(i/4,j+30,s);
    }
    for(let i=0; i<400; i+=10){
      let j = -10*sin((frameCount*10-i)/100);
      let s = map(i, 200, 400, 40, 1);
      let opa = map(i, 0, 400, 255,0);
      fill(255,0,0,opa);
      circle(i/4,j+50,s);
    }
    pop();
    
    this.m = -20*sin(frameCount/10);
    noStroke();
    fill(255,0,0);
    ellipse(this.x-width/2+20,this.y-height/2,this.m+120,85);
    
    //white:
    push();
    translate(this.x-width/2, this.y-height/2);
    rotate(80);
    noStroke();
    for(let i=0; i<300; i+=10){
      let j = 10*sin((frameCount*15-i)/100);
      let s = map(i, 0, 300, 30, 1);
      let opa = map(i, 0, 300, 255, 10);
      fill(255,opa);
      circle(i/4-10,j,s);
    }
    for(let i=0; i<400; i+=10){
      let j = 10*sin((frameCount*15-i)/100);
      let s = map(i, 0, 400, 60, 1);
      let opa = map(i, 0, 400, 255,0);
      fill(255,opa);
      circle(i/4-10,j+25,s);
    }
    for(let i=0; i<400; i+=10){
      let j = -10*sin((frameCount*15-i)/100);
      let s = map(i, 0, 300, 30, 1);
      let opa = map(i, 0, 300, 255,0);
      fill(255,opa);
      circle(i/4-10,j+35,s);
    }
    pop();
    
    this.m = 10*sin(frameCount/3.5);
    noStroke();
    fill(255);
    ellipse(this.x-width/2+20,this.y-height/2+10,this.m+75,55);
    
    //yellow:
    push();
    translate(this.x-width/2, this.y-height/2);
    rotate(80);
    noStroke();
    for(let i=0; i<80; i+=10){
      let j = -5*sin((frameCount*20-i)/100);
      let s = map(i, 0, 80, 10, 1);
      let opa = map(i, 0, 80, 255, 10);
      fill(242,242,8,opa);
      circle(i/4-25,j+15,s);
    }
    for(let i=0; i<100; i+=10){
      let j = -5*sin((frameCount*20-i)/100);
      let s = map(i, 0, 120, 20, 1);
      let opa = map(i, 0, 120, 255,0);
      fill(242,242,8,opa);
      circle(i/4-25,j+25,s);
    }
    for(let i=0; i<80; i+=10){
      let j = -5*sin((frameCount*20-i)/100);
      let s = map(i, 0, 80, 10, 1);
      let opa = map(i, 0, 80, 255,0);
      fill(242,242,8,opa);
      circle(i/4-25,j+35,s);
    }
    pop();
    
    //face:
    push();
    translate(this.x-width/2, this.y-height/2);
    let v = 5*sin(frameCount*0.4);
    fill(0);
    circle(-5,v-10, 10);
    circle(55,v-10,10);
    // fill(255,0,0);
    // noStroke();
    // triangle(this.x - 10, this.y + 5, this.x + 10, this.y + 5, this.x, this.y-5);
    // ellipse(this.x - 5, this.y - 2.5, 5);
    // ellipse(this.x + 5, this.y - 2.5, 5);
    pop();

    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/