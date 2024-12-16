let x;
let y;
let m;

function setup() {
    let canvas = createCanvas(800, 550);
    canvas.parent('sketch-holder');
    m = 80;
    x = width / 2;
    y = height / 2;
}

function draw() {
    background(0);
    noStroke();
    push();
    translate(x, y);
    rotate(80);
    for (let i = 0; i < 400; i += 10) {
        j = 10 * sin((frameCount * 10 - i) / 100);
        let s = map(i, 200, 400, 40, 1);
        let opa = map(i, 0, 400, 255, 10);
        fill(255, opa);
        circle(i / 4, j, s);
    }
    for (let i = 0; i < 600; i += 10) {
        j = 10 * sin((frameCount * 10 - i) / 100);
        let s = map(i, 0, 600, 80, 1);
        let opa = map(i, 0, 600, 255, 0);
        fill(255, opa);
        circle(i / 4, j + 30, s);
    }
    for (let i = 0; i < 400; i += 10) {
        j = -10 * sin((frameCount * 10 - i) / 100);
        let s = map(i, 200, 400, 40, 1);
        let opa = map(i, 0, 400, 255, 0);
        fill(255, opa);
        circle(i / 4, j + 50, s);
    }
    pop();

    m = -20 * sin(frameCount / 10);
    noStroke();
    fill(255);
    ellipse(width / 2 + 20, height / 2, m + 120, 85);
} 