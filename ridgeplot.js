function RidgePlot(){
    // Vis Name
    this.name = "ridgeplot";

    // Array to store the ridges
    this.output = [];
    // Size of the ridge plot
    this.startX = width / 5;
    this.endY = height / 5;
    this.startY = height - this.endY;
    this.spectrumWidth = (width / 5) * 3;
    
    //New fourier transform
    this.fourier = new p5.FFT();

    //Threshold for fading out the ridges
    this.fadeThreshold = this.endY + (this.startY - this.endY) * 0.2

    this.draw = function(){
        push();
        strokeWeight(2);
        noFill(); //Makes sure of no fill colour
        // Adds a ridge every 30 frames
        if (frameCount % 10 === 0) {
            this.addWave();
        }

        for (var i = 0; i < this.output.length; i++) {
            var o = this.output[i];
            beginShape();
            for (var j = 0; j < o.length; j++) {
                o[j].y -= 0.5; // Moves the line up

                //Add Colour to the ridge
                var intensity = map(o[j].y, this.startY, this.endY, 0, 255);
                var r = map(intensity, 0, 255, 0, 255);
                var g = map(intensity, 0, 255, 0, 50);
                var b = map(intensity, 0, 255, 255, 0);

                //Alpha calculated based on the fade threshold
                var alpha = 255;
                if(o[j].y < this.fadeThreshold) {
                    alpha = map(o[j].y, this.endY, this.fadeThreshold, 0, 255)
                };

                stroke(r, g, b, alpha);

                vertex(o[j].x, o[j].y);
            }
            endShape();
            // Remove the ridge if it reaches the endY position
            if (o[0].y < this.endY) {
                this.output.splice(i, 1);
            }
        }
        pop();
    };

    this.addWave = function(){
        // Create a new wave at start position
        var w = this.fourier.waveform();
        var output_wave = [];
        var smallScale = 7;
        var bigScale = 50;

        for(var i = 0; i < w.length; i++){
            if(i % 20 == 0){
                var x = map(i, 0, 1024, this.startX,
                     this.startX + this.spectrumWidth);
                if(i < 1024 * 0.25 || i > 1024 * 0.75){
                    var y = map(w[i], -1, 1, -smallScale, smallScale)
                    output_wave.push({
                        x: x,
                        y: this.startY + y
                    });
                }
                else {
                    var y = map(w[i], -1, 1, -bigScale, bigScale)
                    output_wave.push({
                        x: x,
                        y: this.startY + y
                    })
                }
            };
        }

        this.output.push(output_wave)
    };
}
