let osc, envelope;


let attackTime = 0.001;
let sustainTime = 0.5;
let sustainLevel = 0.8;
let releaseTime = 0.01;


let noseX, noseY;
let p_noseX, p_noseY;


var capture;
var tracker
var w = 640,
    h = 480;


function setup() {


    osc = new p5.TriOsc(); // set frequency and type
    envelope = new p5.Envelope(attackTime, sustainTime, sustainLevel, releaseTime);


    //osc.start();
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function () {
        console.log('capture ready.')
    });
    capture.elt.setAttribute('playsinline', '');
    // let canvas = createCanvas(w, h);
    // canvas.parent("p5-container");
  createCanvas(800, 600);


    capture.size(w, h);
    capture.hide();


    colorMode(HSB);


    tracker = new clm.tracker();
    tracker.init();
    tracker.start(capture.elt);
}


function draw() {
  image(capture, 0, 0, w, h);
    var positions = tracker.getCurrentPosition();
    noFill();
    stroke(255);
  //creates line shape around the face
    beginShape();
    for (var i = 0; i < positions.length; i++) {
        fill(100);
        noStroke;
        ellipse (positions[i][0], positions[i][1], 2, 2);
        //vertex(positions[i][0], positions[i][1]);
        //text(i, positions[i][0], positions[i][1]);
    }
  //ends line shape around the face
    endShape();


   


    noStroke();
    for (var i = 0; i < positions.length; i++) {
        //fill(map(i, 0, positions.length, 0, 360), 0, 100);
        //ellipse(positions[62][0], positions[62][1], 4, 4);
        //text(62, positions[62][0], positions[62][1]);
    }


    if (positions.length > 0) {
        noseX = positions[62][0];
        noseY = positions[62][1];
        eye1X = positions[24][0];
        eye1Y = positions[24][1];
        eyebrow1X = positions[22][0];
        eyebrow1Y = positions[22][1];
        mouth1X = positions[60][0];
        mouth1Y = positions[60][1];
        mouth2X = positions[57][0];
        mouth2Y = positions[57][1];
        let d = dist(noseX, noseY, p_noseX, p_noseY);
        let EYEd = dist (eye1X, eye1Y, eyebrow1X, eyebrow1Y);
        let MOUTHd = dist (mouth1X, mouth1Y, mouth2X, mouth2Y);
        //rect(20, 20, d * 3, 20);


        if (d > 10){
             osc.start();
            let f = map(noseX, 0, width, 100, 300);
            osc.freq(f);
            envelope.play(osc);  
        }
        if (EYEd > 30){
          osc.start();
         let f = map(EYEd, 0, width, 600, 800);
         osc.freq(f);
         envelope.play(osc);
         }
         if (MOUTHd >= 15){
          osc.start();
         let f = map(mouth1X, 0, width, 800, 1000);
         osc.freq(f);
         envelope.play(osc);
         }
    }


    p_noseX = noseX;
    p_noseY = noseY;
}
