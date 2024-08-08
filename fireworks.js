function Fireworks() {
    // Vis name
    this.name = "fireworks";
    // Fourier Transform
    this.fourier = new p5.FFT();
    // Stores the sample fourier
    this.sampleBuffer = [];
    this.fireworks = [];

    this.draw = function() {
        push();
        var spectrum = this.fourier.analyze();
        var sum = 0;

        for (var i = 0; i < spectrum.length; i++) {
            sum += spectrum[i] * spectrum[i];
        }

        if (this.sampleBuffer.length === 60) {
            // Detect a beat
            var sampleSum = 0;
            for (var i = 0; i < this.sampleBuffer.length; i++) {
                sampleSum += this.sampleBuffer[i];
            }

            var sampleAverage = sampleSum / this.sampleBuffer.length;

            var varianceSum = 0;
            for (var i = 0; i < this.sampleBuffer.length; i++) {
                varianceSum += this.sampleBuffer[i] - sampleAverage;
            }

            // beat detection threshold
            var c = 1.2;

            if (sum > sampleAverage * c) {
                // Beat detected
                this.addFirework();
            }

            this.sampleBuffer.splice(0, 1);
            this.sampleBuffer.push(sum);
        } else {
            this.sampleBuffer.push(sum);
        }

        this.updateFireworks();
        pop();
    }

    this.addFirework = function() {
        var f_colour = color(random(0, 255), random(0, 255), random(0, 255));
        var f_x = random(width * 0.2, width * 0.8);
        var f_y = random(height * 0.2, height * 0.8);
        this.fireworks.push(new Firework(f_colour, f_x, f_y));
    }

    this.updateFireworks = function() {
        for (var i = this.fireworks.length - 1; i >= 0; i--) {
            this.fireworks[i].draw();
            if (this.fireworks[i].depleted) {
                this.fireworks.splice(i, 1);
            }
        }
    }
}

function Firework(colour, x, y) {
    this.colour = colour;
    this.x = x;
    this.y = y;

    this.particles = [];
    this.depleted = false;

    for (var i = 0; i < TWO_PI; i += PI / 10) {
        this.particles.push(new Particle(x, y, colour, i, 10));
    }

    this.draw = function() {
        for (var i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].draw();
            if (this.particles[i].speed <= 0) {
                this.particles.splice(i, 1);
            }
        }
        if (this.particles.length == 0) {
            this.depleted = true;
        }
    };
}

function Particle(x, y, colour, angle, speed) {
    this.x = x;
    this.y = y;
    this.colour = colour;
    this.angle = angle;
    this.speed = speed;

    this.draw = function() {
        this.update();
        fill(this.colour);
        ellipse(this.x, this.y, 10, 10);
    }

    this.update = function() {
        this.speed -= 0.1;
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
    }
}
