function Noise() {
    // Vis Name
    this.name = "noise";
    this.noiseStep = 0.01;
    this.prog = 0;
    // Fourier Transform
    this.fourier = new p5.FFT();

    this.draw = function() {
        push();
        this.fourier.analyze();
        var trebleEnergy = this.fourier.getEnergy("treble");

        // Set a threshold for treble energy
        var threshold = 10;
        var speed = 0;
        if (trebleEnergy > threshold) {
            // Adjust the speed based on the treble energy
            speed = map(trebleEnergy, threshold, 255, 0.01, 0.1);
        }

        stroke(255);
        noFill();
        translate(width / 2, height / 2);
        beginShape();
        for (var i = 0; i < 100; i++) {
            //Use noise to affect the stroke
            var x = map(noise(i * this.noiseStep + this.prog), 0, 1, -500, 500);
            var y = map(noise(i * this.noiseStep + this.prog + 100), 0, 1, -500, 500);

            // Add RGB to the line over a duration of time
            var r = map(sin(frameCount * 0.05), -1, 1, 50, 255); // Red component
            var g = map(sin(frameCount * 0.03), -1, 1, 50, 255); // Green component
            var b = map(sin(frameCount * 0.07), -1, 1, 50, 255); // Blue component
            stroke(r, g, b)
            vertex(x, y);
        }
        endShape();
        this.prog += speed;
        pop();
    }
}
