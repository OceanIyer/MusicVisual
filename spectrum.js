function Spectrum(){
	this.name = "spectrum";

	this.draw = function(){
		push();
		var spectrum = fourier.analyze();
		noStroke();
		


		for(var i = 0; i < spectrum.length; i++){

			//fade the colour from blue to green depending
			// on height
			var colour = map(spectrum[i], 0, 1024, 0, 255)
			fill(colour, spectrum[i], 120)

			//draw each bin as a rectangle from the left of the screen
			//across
			var y = map(i, 0, spectrum.length, 0, height);
			var w = map(spectrum[i], 0, 255, 0, width);
			rect(0, y, w, height/spectrum.length);
		}  		
		pop();
	};
}
