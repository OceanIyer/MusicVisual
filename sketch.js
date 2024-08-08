//global for the controls and input 
var controls = null;
//store visualisations in a container
var vis = null;
//variable for the p5 sound object
var sound = null;
//variable for p5 fast fourier transform
var fourier;
var video;

function preload(){
	sound = loadSound('assets/The White Stripes - Seven Nation Army.mp3');
	sound.setVolume(0.2)
	
}

function setup(){
	 createCanvas(windowWidth, windowHeight, WEBGL);
	 background(0);
	 frameRate(60)
   	 video = createCapture(VIDEO)
     video.size(width, height)
     video.hide()
	 controls = new ControlsAndInput();

	 //instantiate the fft object
	 fourier = new p5.FFT();

	 //create a new visualisation container and add visualisations
	 vis = new Visualisations();
	 vis.add(new Spectrum());
	 vis.add(new WavePattern());
	 vis.add(new Needles());
	 vis.add(new RidgePlot());
	 vis.add(new Noise());
	 vis.add(new Squares());
	 vis.add(new Spirals());
	 vis.add(new Fireworks());
   	 vis.add(new Video());

}

function draw(){
	background(0);

	 // Translate back to the top-left corner
	 resetMatrix();
	 translate(-width / 2, -height / 2);
	 
	//draw the selected visualisation
	if (vis.selectedVisual) {
        vis.selectedVisual.draw();
    }
	//draw the controls on top.
	controls.draw();
}

function mouseClicked(){
	controls.mousePressed();
}

function keyPressed(){
	controls.keyPressed(keyCode);
}

//when the window has been resized. Resize canvas to fit 
//if the visualisation needs to be resized call its onResize method
function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	if(vis.selectedVisual.hasOwnProperty('onResize')){
		vis.selectedVisual.onResize();
	}
}
