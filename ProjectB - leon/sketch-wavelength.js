let mouthOpenSound2;
let fft;
function preload() {
  // faceMesh = ml5.faceMesh(options);

  mouthOpenSound2 = loadSound('assets/NowWeAreReadyToSpend/Other.mp3');

}


function setup(){
  createCanvas(400,400);

  fft = new p5.FFT();
  fft.setInput(mouthOpenSound2)
}

function draw(){
  background(0)
  // let spectrum = fft.analyze();
  // noStroke();
  // fill(255, 0, 0);

  // for (let i = 0; i < spectrum.length; i++) {
  //   let x = map(i, 0, spectrum.length, 0, width);     
  //   let h = map(spectrum[i], 0, 255, 0, 200);
  //   rect(x, 200, width / spectrum.length, h )
  // }


  let waveform = fft.waveform();
  noFill();
  beginShape();
  stroke(255);
  
  for (let i = 0; i < waveform.length; i++){
    let x = map(i, 0, waveform.length, 0, width);
    let y = map( waveform[i], -1, 1, 200-50, 200+50);
    vertex(x,y);
  }
  endShape();
}

function mousePressed(){
  mouthOpenSound2.play();
}